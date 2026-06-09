const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || process.env.AWS_REGION || "ap-south-1",
});

const streamToBuffer = async (stream) => {
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
};

const getS3ObjectBuffer = async (s3Key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: s3Key,
  });

  const response = await s3Client.send(command);

  return streamToBuffer(response.Body);
};

module.exports = getS3ObjectBuffer;