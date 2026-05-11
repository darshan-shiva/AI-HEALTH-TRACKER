const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/recommend', auth, async (req, res) => {
  try {
    const { healthData } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key is missing from backend environment variables.' });
    }

    const prompt = `
      You are an expert AI Health & Nutrition Assistant.
      Analyze the following user health data:
      ${JSON.stringify(healthData)}

      Provide personalized recommendations covering:
      1. Nutrition Suggestions
      2. Hydration Advice
      3. Workout Recommendations
      4. Sleep Improvement Suggestions

      Format the response as a clean, readable text or JSON string so it can be easily displayed. Be concise and actionable.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ recommendation: text });
  } catch (err) {
    console.error('AI Error:', err);
    res.status(500).send('Server Error generating AI recommendation');
  }
});

module.exports = router;
