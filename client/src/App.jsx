import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [data, setData] = useState([]);

  const handleSubmit = async () => {
    console.log('Frontend good');
    try {
      const response = await fetch('https://e02b4272-d840-49fb-90b3-d95e11e4435f-00-2bsk8jsuxwv2k.picard.replit.dev/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input }),
      });
      console.log('Response:', response.status);
      setInput('');
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleShow = async () => {
    console.log('Requesting data')
    const response = await fetch('https://e02b4272-d840-49fb-90b3-d95e11e4435f-00-2bsk8jsuxwv2k.picard.replit.dev/api/data');
    const result = await response.json();
    setData(result);
  };

  return (
    <div>
      <h1>Simple Full-Stack App</h1>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Enter something" 
      />
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={handleShow}>Show</button>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.content}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;