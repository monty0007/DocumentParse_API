const { OpenAI } = require('openai');
require('dotenv').config({ quiet: true });

const openai = new OpenAI({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    baseURL: process.env.AZURE_OPENAI_ENDPOINT,
    defaultQuery: {
      'api-version': process.env.AZURE_API_VERSION,
    },
  });

async function extractFieldsFromText(parsedText) {
    const systemPrompt = `
    You are an expert at extracting structured data from purchase order (PO) and invoice documents.
    
    Return only a valid JSON object with the following fields:
    
    - sno
    - po_id
    - description_of_service
    - part_code
    - company_name
    - po_start_date
    - po_end_date
    - prorata_or_unit_price
    - quantity
    - amount_without_gst
    - amount_with_gst
    - payment_terms
    - payment_frequency
    - fms_type
    - contact_person_name
    - contact_person_phone_number
    - contact_person_email_address
    - domain_or_tenant_name
    - billing_company
    - account_manager
    - po_type
    - extension_or_new
    - remarks_or_comments
    - po_rating
    - audit_approved
    - pi_number
    - pi_shared_with_customer
    - invoice_number
    - invoice_shared_with_customer
    - ticket_url
    - overall_remarks
    
    Make sure the values are clean and directly match what's written in the text. Return a flat JSON object (not a list or markdown).
    `;
    

  const userPrompt = `
Here is the invoice text:
"""
${parsedText}
"""
`;

  const response = await openai.chat.completions.create({
    model: process.env.AZURE_DEPLOYMENT_NAME, 
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0,
  });

  let output = response.choices[0].message.content;

  // 🧼 Clean out triple backticks and "json" if GPT included them
  output = output.replace(/```json|```/g, '').trim();

  return JSON.parse(output); // safe to parse now
}

// if (require.main === module) {
//     // Sample test input
//     const sampleText = `
//       INVOICE
//       Invoice No: INV-2023-0042
//       Date: 01-Jan-2024
//       Buyer: PSG College of Tech
//       Address: Peelamedu, Coimbatore
//       Total Amount: ₹1,02,070.00
//     `;
  
//     extractFieldsFromText(sampleText)
//       .then(data => console.log('✅ Extracted Fields:\n', data))
//       .catch(err => console.error('❌ Error:', err));
//   }
  

module.exports = { extractFieldsFromText };
