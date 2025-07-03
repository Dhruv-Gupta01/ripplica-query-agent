// import logo from './logo.svg';
// import './App.css';
// import { useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [query, setQuery] = useState("");
//   const [response, setResponse] = useState("");

//   const handleSubmit = async () => {
//     const res = await axios.post("http://localhost:5173/query", { query });
//     setResponse(res.data.summary);
//   };

//   return (
//     <div style={{ padding: 50 }}>
//       <h1>Ripplica Query Agent</h1>
//       <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter your query" />
//       <button onClick={handleSubmit}>Submit</button>
//       <p>Response: {response}</p>
//     </div>
//   );
// }

// export default App;








import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await axios.post("http://localhost:5173/query", { query });
      setResponse(res.data.summary || "No summary returned.");
    } catch (error) {
      console.error(error);
      setResponse("❌ Error fetching summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>🧠 Ripplica Query Agent</h1>
        <p className="subheading">Ask anything. We’ll summarize the web for you!</p>

        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. top hotels in the world"
        />

        <button className="button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Loading..." : "Get Summary"}
        </button>

        {response && (
  <div className="response">
    <h3>📄 Summary</h3>
    <ul className="summary-list">
      {response
        .split(/\n+/) // splits on newlines
        .filter((line) => line.trim() !== "")
        .map((line, idx) => (
          <li key={idx} className="summary-item">
            {line.replace(/^•\s*/, "").trim()}
          </li>
        ))}
    </ul>
  </div>
)}

      </div>
    </div>
  );
}

export default App;
