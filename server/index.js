const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const aiRoutes = require('../routes/ai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/ai', aiRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))

app.get('/', (req, res) => {
  res.send('Backend is working ✅');
})
;



