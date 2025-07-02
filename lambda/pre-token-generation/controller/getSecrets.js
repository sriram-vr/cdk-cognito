const { SecretsManagerClient, GetSecretValueCommand } =  require('@aws-sdk/client-secrets-manager');
const client = new SecretsManagerClient({ region: "us-east-1" });
const secretName = "pristinedata/sbx/authservice";

const cacheTTL = 30 * 60 * 1000; 

let lastFetchedTime = 0;
const initDBSecret = {
    DB_USER: null,
    DB_NAME: null,
    DB_HOST: null,
    DB_PASSWORD: null,
    DB_PORT: null
}

const dbConfig = initDBSecret;

async function getDBSecrets() {
    try {
        const now = Date.now();
        if (dbConfig.DB_HOST && dbConfig.DB_NAME && dbConfig.DB_USER && dbConfig.DB_PASSWORD && dbConfig.DB_PORT && now - lastFetchedTime < cacheTTL) {
            return dbConfig;
        }
        const secretName = process.env.DB_SECRET_NAME;
        if (!secretName) { throw Error("Secrets not found."); }
        const command = new GetSecretValueCommand({ SecretId: secretName });
        const response = await client.send(command);
        if (response?.SecretString) {
            const parsedResponse = JSON.parse(response.SecretString);
            dbConfig.DB_HOST = parsedResponse.DB_HOST;
            dbConfig.DB_NAME = parsedResponse.DB_NAME;
            dbConfig.DB_USER = parsedResponse.DB_USER;
            dbConfig.DB_PASSWORD = parsedResponse.DB_PASSWORD;
            dbConfig.DB_PORT = parsedResponse.DB_PORT;
            lastFetchedTime = now;
        }
        return dbConfig;
    } catch (err) {
        return null;
    }
}

module.exports = {getDBSecrets};