const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize PostgreSQL connection with PostGIS
const sequelize = new Sequelize(
    process.env.PG_DATABASE,
    process.env.PG_USER,
    process.env.PG_PASSWORD,
    {
        host: process.env.PG_HOST,
        port: process.env.PG_PORT || 5432,
        dialect: 'postgres',
        dialectOptions: {
            ssl: process.env.NODE_ENV === 'production' ? {
                require: true,
                rejectUnauthorized: false
            } : false
        },
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Test connection and sync models
const initPostgres = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL + PostGIS Connected Successfully');
        
        // Test PostGIS extension
        const [result] = await sequelize.query('SELECT PostGIS_Version()');
        console.log('PostGIS Version:', result[0].postgis_version);
        
        // Sync models 
        await sequelize.sync({ alter: false });
        console.log('PostGIS Models Synced');
        
    } catch (error) {
        console.error('PostgreSQL Connection Error:', error.message);
        process.exit(1);
    }
};

module.exports = { sequelize, initPostgres };