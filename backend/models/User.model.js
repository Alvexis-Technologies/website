const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/postgres.config');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING(50),
        unique:false,
        allowNull: true
    },
    second_name: {
        type: DataTypes.STRING(50),
        unique: false,
        allowNull: true
    },
    owner_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    owner_name: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    location_name: {
        type: DataTypes.STRING(200)
    },
    region: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    district: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    ward: {
        type: DataTypes.STRING(100)
    },
    village: {
        type: DataTypes.STRING(100)
    },
    land_use: {
        type: DataTypes.STRING(50),
        defaultValue: 'residential',
        validate: {
            isIn: [['residential', 'commercial', 'agricultural', 'industrial', 'mixed_use']]
        }
    },
    verification_status: {
        type: DataTypes.STRING(50),
        defaultValue: 'pending',
        validate: {
            isIn: [['pending', 'under_review', 'approved', 'rejected']]
        }
    },
    approval_status: {
        type: DataTypes.STRING(50),
        defaultValue: 'pending'
    },
    approved_by: {
        type: DataTypes.UUID
    },
    approved_at: {
        type: DataTypes.DATE
    },
    area_sq_meters: {
        type: DataTypes.DECIMAL(15, 2),
        get() {
            const value = this.getDataValue('area_sq_meters');
            return value ? parseFloat(value) : null;
        }
    },
    area_acres: {
        type: DataTypes.DECIMAL(15, 2),
        get() {
            const value = this.getDataValue('area_acres');
            return value ? parseFloat(value) : null;
        }
    },
    geometry: {
        type: DataTypes.GEOMETRY('POLYGON', 4326),
        allowNull: false
    },
    metadata: {
        type: DataTypes.JSONB,
        defaultValue: {}
    },
    created_by: {
        type: DataTypes.UUID
    }
}, {
    tableName: 'parcels',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        {
            fields: ['parcel_code'],
            unique: true
        },
        {
            fields: ['owner_id']
        },
        {
            fields: ['verification_status']
        },
        {
            fields: ['region', 'district']
        }
    ]
});

// Instance method to get GeoJSON
Parcel.prototype.toGeoJSON = function() {
    return {
        type: 'Feature',
        id: this.id,
        geometry: this.geometry,
        properties: {
            parcel_code: this.parcel_code,
            title_number: this.title_number,
            owner_name: this.owner_name,
            location_name: this.location_name,
            region: this.region,
            district: this.district,
            land_use: this.land_use,
            verification_status: this.verification_status,
            area_acres: this.area_acres,
            area_sq_meters: this.area_sq_meters,
            created_at: this.created_at
        }
    };
};

module.exports = Parcel;