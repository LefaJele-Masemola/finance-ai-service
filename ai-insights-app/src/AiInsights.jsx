import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

function AiInsights() {
  const [aiInsight, setAiInsight] = useState('');
  const [chartData, setChartData] = useState([]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await axios.get('http://localhost:5001/analyze');
        setAiInsight(res.data.insights);

        // Build chart data by category
        const categories = {};
        res.data.data.forEach((item) => {
          const cat = item.Category || 'Other';
          const amt = parseFloat(item.Amount || 0);
          if (!isNaN(amt)) {
            categories[cat] = (categories[cat] || 0) + amt;
          }
        });

        const pie = Object.entries(categories).map(([name, value]) => ({ name, value }));
        setChartData(pie);
      } catch (err) {
        console.error('Failed to fetch AI insights', err);
      }
    };

    fetchInsights();
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '2rem' }}>
     
      {aiInsight && (
        <div style={{ background: '#f0f0f0', padding: '1rem', marginTop: '2rem', borderRadius: '8px' }}>
          <h2>💼 AI Financial Insights</h2>
          <p style={{ whiteSpace: 'pre-line' }}>{aiInsight}</p>
        </div>
      )}

      {chartData.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>📊 Spending by Category</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      )}
    </div>
  );
}

export default AiInsights;
