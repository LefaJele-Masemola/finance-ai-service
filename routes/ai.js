const express = require('express');
const router = express.Router();

router.post('/ask', async (req, res) => {
  const { prompt } = req.body;

  try {
    const ollamaRes = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'tinyllama',
        prompt,
        stream: false
      })
    });

    const data = await ollamaRes.json();
    res.json({ response: data.response });
  } catch (err) {
    res.status(500).json({ error: 'Failed to connect to Ollama' });
  }
});

module.exports = router;