require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // There is no listModels in the standard SDK directly, but we can try to fetch a well-known model.
    // Or we can just use fetch to hit the REST API directly to see what error it returns exactly.
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    const validModels = data.models.filter(m => m.supportedGenerationMethods.includes('generateContent')).map(m => m.name);
    console.log(validModels.join('\n'));
  } catch (err) {
    console.error(err);
  }
}

test();
