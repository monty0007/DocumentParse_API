const { AzureOpenAI } = require("openai");

const client = new AzureOpenAI({
  apiKey: process.env.AZURE_API_KEY,
  azureEndpoint: process.env.AZURE_OPENAI_ENDPOINT,
  deployment: process.env.AZURE_DEPLOYMENT_NAME,
  apiVersion: "2024-04-01-preview" // or your required version
});

async function extractFieldsFromText(text) {
  const deployment = process.env.AZURE_DEPLOYMENT_NAME;

  const response = await client.getChatCompletions(deployment, [
    {
      role: "system",
      content: "You are an invoice field extractor. Extract invoice_number, date, total, due_date, vendor_name, and order_id. Respond only in JSON."
    },
    { role: "user", content: text }
  ]);

  return response.choices[0].message.content;
}

module.exports = { extractFieldsFromText };
