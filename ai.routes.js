const express = require('express');
const OpenAI = require('openai');

const router = express.Router();

const SYSTEM_PROMPT =
  'You are CampusX Assistant. Help users with CampusX marketplace features like signup/login, verification, listings, payments, safety, and chat. Keep answers concise and practical.';

const FALLBACK_RESPONSE =
  'CampusX assistant is currently in limited mode. Try asking about signup, verification, listing products, payments, or account settings.';

router.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'A valid message is required.',
      });
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      return res.status(400).json({
        success: false,
        error: 'Message cannot be empty.',
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        success: true,
        reply: FALLBACK_RESPONSE,
      });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const normalizedHistory = Array.isArray(history)
      ? history
          .slice(-8)
          .filter(
            (item) =>
              item &&
              (item.role === 'user' || item.role === 'assistant') &&
              typeof item.content === 'string'
          )
          .map((item) => ({
            role: item.role,
            content: item.content.trim().slice(0, 1000),
          }))
      : [];

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini',
      temperature: 0.4,
      max_tokens: 220,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...normalizedHistory,
        { role: 'user', content: trimmedMessage.slice(0, 2000) },
      ],
    });

    const reply =
      completion?.choices?.[0]?.message?.content?.trim() || FALLBACK_RESPONSE;

    return res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error('AI chat error:', error?.message || error);
    return res.status(500).json({
      success: false,
      error: 'Unable to process chat request right now.',
    });
  }
});

module.exports = router;
