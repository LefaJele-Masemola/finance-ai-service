import { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleAsk = async () => {
    const res = await fetch('http://localhost:5000/api/ai/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();
    setResponse(data.reply);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>💬 Ask the AI</h1>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
        cols={50}
        placeholder="Type your question..."
      />
      <br />
      <button onClick={handleAsk}>Send</button>
      <p><strong>Response:</strong> {response}</p>
    </div>
  );
}

export default App;
