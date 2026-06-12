-- ArdhiVision-Tz PostGIS Database Initialization
-- Run this script to set up the GIS database

-- Create database (run separately if needed)
-- CREATE DATABASE ardhivision_gis;

-- Connect to database
\c ardhivision_gis;

-- Enable PostGIS extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create users table (linking to MongoDB users via UUID)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mongo_id VARCHAR(100) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'citizen',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create parcels table with PostGIS geometry
CREATE TABLE parcels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_code VARCHAR(50) UNIQUE NOT NULL,
    title_number VARCHAR(100) UNIQUE NOT NULL,
    owner_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    owner_name VARCHAR(200) NOT NULL,
    location_name VARCHAR(200),
    region VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    ward VARCHAR(100),
    village VARCHAR(100),
    land_use VARCHAR(50) DEFAULT 'residential',
    verification_status VARCHAR(50) DEFAULT 'pending',
    approval_status VARCHAR(50) DEFAULT 'pending',
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    area_sq_meters DECIMAL(15, 2),
    area_acres DECIMAL(15, 2),
    geometry GEOMETRY(POLYGON, 4326) NOT NULL,
    centroid GEOMETRY(POINT, 4326),
    bounding_box GEOMETRY(POLYGON, 4326),
    metadata JSONB,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create spatial indexes
CREATE INDEX idx_parcels_geometry ON parcels USING GIST (geometry);
CREATE INDEX idx_parcels_centroid ON parcels USING GIST (centroid);
CREATE INDEX idx_parcels_parcel_code ON parcels(parcel_code);
CREATE INDEX idx_parcels_owner ON parcels(owner_id);
CREATE INDEX idx_parcels_status ON parcels(verification_status);
CREATE INDEX idx_parcels_region_district ON parcels(region, district);

-- Create parcel history table
CREATE TABLE parcel_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_id UUID REFERENCES parcels(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    previous_geometry GEOMETRY(POLYGON, 4326),
    new_geometry GEOMETRY(POLYGON, 4326),
    changes JSONB,
    performed_by UUID REFERENCES users(id),
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create spatial index for history
CREATE INDEX idx_parcel_history_geom ON parcel_history USING GIST (previous_geometry);
CREATE INDEX idx_parcel_history_parcel ON parcel_history(parcel_id);

-- Create cadastral layers table
CREATE TABLE cadastral_layers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    layer_name VARCHAR(100) NOT NULL,
    layer_type VARCHAR(50),
    geometry GEOMETRY(MULTIPOLYGON, 4326),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create function to calculate area automatically
CREATE OR REPLACE FUNCTION calculate_parcel_area()
RETURNS TRIGGER AS $$
DECLARE
    area_sqm DECIMAL;
    area_acres DECIMAL;
BEGIN
    -- Calculate area in square meters (UTM Zone 37S for mainland Tanzania)
    area_sqm := ST_Area(ST_Transform(NEW.geometry, 32737));
    NEW.area_sq_meters := area_sqm;
    NEW.area_acres := area_sqm * 0.000247105;
    NEW.centroid := ST_Centroid(NEW.geometry);
    NEW.bounding_box := ST_Envelope(NEW.geometry);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic area calculation
CREATE TRIGGER trigger_calculate_parcel_area
    BEFORE INSERT OR UPDATE ON parcels
    FOR EACH ROW
    EXECUTE FUNCTION calculate_parcel_area();

-- Create function to detect overlapping parcels
CREATE OR REPLACE FUNCTION check_parcel_overlap()
RETURNS TRIGGER AS $$
DECLARE
    overlapping RECORD;
BEGIN
    -- Check for overlapping with existing approved parcels
    SELECT id, parcel_code, owner_name, area_acres INTO overlapping
    FROM parcels
    WHERE ST_Intersects(geometry, NEW.geometry)
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)
      AND verification_status IN ('approved', 'pending')
      AND approval_status != 'rejected'
    LIMIT 1;
    
    IF FOUND THEN
        RAISE EXCEPTION 'PARCEL_OVERLAP: Parcel overlaps with existing parcel % (Owner: %, Area: % acres)', 
            overlapping.parcel_code, overlapping.owner_name, ROUND(overlapping.area_acres, 2);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for overlap detection
CREATE TRIGGER trigger_check_parcel_overlap
    BEFORE INSERT OR UPDATE ON parcels
    FOR EACH ROW
    EXECUTE FUNCTION check_parcel_overlap();

-- Create function to find parcel at specific coordinates
CREATE OR REPLACE FUNCTION find_parcel_at_point(lng DOUBLE PRECISION, lat DOUBLE PRECISION)
RETURNS TABLE(
    id UUID,
    parcel_code VARCHAR,
    owner_name VARCHAR,
    area_acres DECIMAL,
    verification_status VARCHAR,
    geometry_geojson TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id, 
        p.parcel_code, 
        p.owner_name, 
        p.area_acres, 
        p.verification_status,
        ST_AsGeoJSON(p.geometry)::TEXT as geometry_geojson
    FROM parcels p
    WHERE ST_Contains(p.geometry, ST_SetSRID(ST_MakePoint(lng, lat), 4326))
      AND p.verification_status = 'approved'
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Create function to get parcels within bounding box
CREATE OR REPLACE FUNCTION get_parcels_in_bbox(
    min_lng DOUBLE PRECISION,
    min_lat DOUBLE PRECISION,
    max_lng DOUBLE PRECISION,
    max_lat DOUBLE PRECISION
)
RETURNS TABLE(
    id UUID,
    parcel_code VARCHAR,
    owner_name VARCHAR,
    area_acres DECIMAL,
    verification_status VARCHAR,
    geometry_geojson TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id, 
        p.parcel_code, 
        p.owner_name, 
        p.area_acres, 
        p.verification_status,
        ST_AsGeoJSON(ST_Simplify(p.geometry, 0.001))::TEXT as geometry_geojson
    FROM parcels p
    WHERE p.geometry && ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)
      AND p.verification_status = 'approved'
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to validate polygon geometry
CREATE OR REPLACE FUNCTION validate_parcel_geometry()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if geometry is valid
    IF NOT ST_IsValid(NEW.geometry) THEN
        RAISE EXCEPTION 'INVALID_GEOMETRY: The polygon is not valid. Please ensure it is a closed shape without self-intersections.';
    END IF;
    
    -- Check minimum area (100 sq meters minimum)
    IF ST_Area(ST_Transform(NEW.geometry, 32737)) < 100 THEN
        RAISE EXCEPTION 'AREA_TOO_SMALL: Parcel area must be at least 100 square meters.';
    END IF;
    
    -- Check maximum area (1000 hectares / 2471 acres maximum for single parcel)
    IF ST_Area(ST_Transform(NEW.geometry, 32737)) > 10000000 THEN
        RAISE EXCEPTION 'AREA_TOO_LARGE: Parcel area exceeds maximum allowed size (1000 hectares).';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for geometry validation
CREATE TRIGGER trigger_validate_parcel_geometry
    BEFORE INSERT OR UPDATE ON parcels
    FOR EACH ROW
    EXECUTE FUNCTION validate_parcel_geometry();

-- Create index for faster spatial queries
CREATE INDEX idx_parcels_verification_status ON parcels(verification_status);
CREATE INDEX idx_parcels_created_at ON parcels(created_at DESC);

-- Create view for dashboard statistics
CREATE VIEW parcel_statistics AS
SELECT 
    COUNT(*) as total_parcels,
    COUNT(CASE WHEN verification_status = 'approved' THEN 1 END) as approved_parcels,
    COUNT(CASE WHEN verification_status = 'pending' THEN 1 END) as pending_parcels,
    COUNT(CASE WHEN verification_status = 'rejected' THEN 1 END) as rejected_parcels,
    SUM(area_acres) as total_acres,
    ROUND(AVG(area_acres), 2) as avg_parcel_size
FROM parcels;

-- Create function to auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_parcels_timestamp
    BEFORE UPDATE ON parcels
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_user;