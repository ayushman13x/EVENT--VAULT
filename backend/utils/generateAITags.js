const fs = require("fs");
const {
  RekognitionClient,
  DetectLabelsCommand,
} = require("@aws-sdk/client-rekognition");

const rekognitionClient = new RekognitionClient({
  region: process.env.AWS_REGION || "ap-south-1",
});

const generateAITags = async (filePath, fileType) => {
  try {
    if (fileType !== "image") {
      return [];
    }

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error("AI tagging failed: AWS credentials are missing in .env");
      return [];
    }

    const imageBytes = fs.readFileSync(filePath);

    const command = new DetectLabelsCommand({
      Image: {
        Bytes: imageBytes,
      },
      MaxLabels: 10,
      MinConfidence: 70,
    });

    const response = await rekognitionClient.send(command);

    const tags = response.Labels.map((label) => label.Name.toLowerCase());

    return tags;
  } catch (error) {
    console.error("AI tagging failed:", error.message);
    return [];
  }
};

module.exports = generateAITags;