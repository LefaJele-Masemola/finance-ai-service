const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Ensure upload directory exists
const uploadDir = 'upload/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const upload = multer({ dest: uploadDir });

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      const sample = results.slice(0, 10);
      const prompt = `
Here is a user's transaction data:
${JSON.stringify(sample, null, 2)}
Give a summary of their spending habits, saving advice, and possible investment tips in a helpful and clear tone.
      `;

      try {
        const aiRes = await axios.post('http://localhost:11434/api/generate', {
          model: 'tinyllama',
          prompt,
          stream: false
        });

        fs.unlinkSync(filePath); // clean up
        res.json({ insights: aiRes.data.response, data: results });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: '❌ Failed to get AI response' });
      }
    });
});
app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});


app.listen(5001, () => console.log('🚀 Backend running on http://localhost:5001'));
