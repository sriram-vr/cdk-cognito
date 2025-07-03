const { Sequelize } = require("sequelize");
const dotenv = require('dotenv');
const { getDBSecrets } = require("../controller/getSecrets");
const { initializeSchema } = require("./init");

dotenv.config();

var sequelize;
var isDBInitialized = false;

async function initializeSequelize() {
    if (sequelize) return sequelize;
    try {
        console.log("Initializing the DB connection.")
        const config = await getDBSecrets();
        if (!config.DB_HOST || !config.DB_NAME || !config.DB_PASSWORD || !config.DB_PORT || !config.DB_USER) {
            throw Error("No DB config found.")
        }
        sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
            dialect: 'mysql',
            host: config.DB_HOST,
            port: Number(config.DB_PORT)
        });
        initializeSchema(sequelize);
    } catch (err) {
        console.log('Error while initializing the database.')
        console.log(err);
        throw err;
    }
}

async function initDB() {
    try {
        if (isDBInitialized) { return; }
        console.log("Proceeding to initialize the database.")
        await initializeSequelize();
        await sequelize.authenticate();
        isDBInitialized = true;
        console.log("Database has been initialized.")
    } catch(error) {
        console.log(error);
        console.log('Error while initializing the database.');
        isDBInitialized = false;
        throw error;
    }
}

module.exports = { initDB }