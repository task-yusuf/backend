const core = require('@huaweicloud/huaweicloud-sdk-core');
const csms = require("@huaweicloud/huaweicloud-sdk-csms/v1/public-api");
const { Sequelize } = require('sequelize');


const endpoint = process.env.CLOUD_SDK_ENDPOINT;
const project_id = process.env.CLOUD_PROJECT_ID;


const credentials = new core.BasicCredentials()
    .withAk(process.env.CLOUD_SDK_AK)
    .withSk(process.env.CLOUD_SDK_SK)
    .withProjectId(project_id);

const client = csms.CsmsClient.newBuilder()
    .withCredential(credentials)
    .withEndpoint(endpoint)
    .build();

async function getSecret(secretName) {
    try {
        const request = new csms.ShowSecretVersionRequest();
        request.secretName = secretName;
        request.versionId = "v1";
        const response = await client.showSecretVersion(request);
        return response.version.secret_string;
    } catch (error) {
        console.error("Error fetching secret:", error);
        throw new Error("Failed to fetch secret");
    }
}

let sequelizeInstance = null;

async function getSequelize() {
    if (sequelizeInstance) {
        return sequelizeInstance;
    }

    const dbPassword = await getSecret("database");
    sequelizeInstance = new Sequelize({
        dialect: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        username: process.env.DB_USER || 'root',
        password: dbPassword,
        database: process.env.DB_NAME || 'todo_app',
        define: {
            timestamps: true
        }
    });

    return sequelizeInstance;
}

module.exports = getSequelize();