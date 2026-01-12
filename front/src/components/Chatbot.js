import React, { useState } from 'react';

function Chatbot() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const ask = async () => {
    const res = await fetch('http://localhost:8000/chatbot/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    const data = await res.json();
    setAnswer(data.answer);
  };

  return (
    <div className="card p-4 mx-auto" style={{maxWidth:500}}>
      <h2 className="mb-4">Chatbot</h2>
      <div className="input-group mb-3">
        <input type="text" className="form-control" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Posez votre question..." />
        <button className="btn btn-primary" onClick={ask}>Envoyer</button>
      </div>
      {answer && <div className="alert alert-info mt-3">{answer}</div>}
    </div>
  );
}

export default Chatbot;
