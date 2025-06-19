const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/analyze', async (req, res) => {
  const results = [];

  // Path to a CSV file 
  const filePath = 'data/transactions.csv';

  const stream = fs.createReadStream(filePath)
    .pipe(csv());

  stream.on('data', (data) => results.push(data));
  stream.on('end', async () => {
    const prompt = `
You are a personal finance assistant. Here's a user's transaction data:
${JSON.stringify(results.slice(0, 10), null, 2)}
Give:
1. Spending analysis
2. Saving tips
3. Simple investment advice
4. Summary in bullet points
    `;

    try {
      const aiRes = await axios.post('http://localhost:11434/api/generate', {
        model: 'tinyllama',
        prompt,
        stream: false,
      });

      res.json({ insights: aiRes.data.response, data: results });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Ollama failed to respond' });
    }
  });
  stream.on('error', (err) => {
    console.error('File read error:', err);
    res.status(500).json({ error: 'Failed to read CSV file' });
  });
});

app.listen(5001, () => console.log('🔥 Server running at http://localhost:5001'));
