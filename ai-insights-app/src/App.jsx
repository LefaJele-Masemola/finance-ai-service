import React, { useState } from 'react';
import BankUpload from './BankUpload';
import AiInsights from './AiInsights';
import SpendingChart from './SpendingChart';

function App() {
  const [bankData, setBankData] = useState([]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>💰 AI Finance Assistant</h1>

      <BankUpload onDataParsed={setBankData} />

      {bankData.length > 0 && (
        <>
          <SpendingChart data={bankData} />
          <AiInsights bankData={bankData} />
        </>
      )}

      {bankData.length === 0 && <AiInsights />}
    </div>
  );
}

export default App;
