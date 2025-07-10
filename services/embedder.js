const { AzureOpenAI } = require("openai");

const openai = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: process.env.AZURE_OPENAI_ENDPOINT, // ex: https://your-resource.openai.azure.com/openai/deployments/
  apiVersion: "2024-02-15-preview", // 👈 required for Azure!
});

async function getEmbedding(text) {
  const res = await openai.embeddings.create({
    model: process.env.AZURE_DEPLOYMENT_NAME, // 👈 your deployment name here
    input: text,
  });

  return res.data[0].embedding;
}

module.exports = { getEmbedding };
