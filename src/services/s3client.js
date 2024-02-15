const {
    S3Client
} = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
    endpoint: `https://${process.env.BB_ENDPOINT}`,
    region: process.env.BB_REGION,
    credentials: {
        accessKeyId: process.env.BB_ACESSKEYID,
        secretAccessKey: process.env.BB_SECRETAPPKEY,
    },
});

module.exports = {
    s3Client
}