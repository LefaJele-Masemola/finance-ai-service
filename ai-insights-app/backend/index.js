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
You are a helpful AI financial assistant. The following is a user's transaction history:

${JSON.stringify(results.slice(0, 10), null, 2)}

Give a friendly, human-readable summary that includes:
1. Total income vs expenses
2. Where the user is spending the most
3. 3 personalized budgeting or saving tips
4. Whether they are overspending, and where
5. Simple investment advice (based on spending patterns)
6. Bullet-point summary

⚠️ Don't include or repeat the transaction list. Just respond with insights.
`;


    try {
      const aiRes = await axios.post('http://localhost:11434/api/generate', {
        model: 'tinyllama',
        prompt: prompt,
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
