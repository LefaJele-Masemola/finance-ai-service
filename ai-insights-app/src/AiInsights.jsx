import { useState } from 'react';
import axios from 'axios';

function AiInsights({ bankData }) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    setResponse('');

    try {
      // Optional: Use first 5 rows to keep the prompt short
      const csvSummary = bankData?.length
        ? bankData
            .slice(0, 5)
            .map((row, i) => `${i + 1}. ${JSON.stringify(row)}`)
            .join('\n')
        : '';

      const finalPrompt = csvSummary
        ? `Here is my recent spending data:\n${csvSummary}\n\n${prompt}`
        : prompt;

      const res = await axios.post('http://localhost:11434/api/generate', {
        model: 'tinyllama',
        prompt: finalPrompt,
        stream: false,
      });

      setResponse(res.data.response);
    } catch (error) {
      console.error(error);
      setResponse('❌ Could not reach Ollama.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>🧠 Ask the AI</h2>
      <textarea
        rows={4}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
        placeholder="e.g. How do I budget R5000?"
      />
      <br />
      <button onClick={handleAsk} disabled={loading}>
        {loading ? 'Thinking...' : 'Ask AI'}
      </button>
      {response && (
        <div style={{ marginTop: '1rem', background: '#eee', padding: '1rem' }}>
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default AiInsights;
