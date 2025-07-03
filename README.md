# 🧠 Ripplica Query Agent

An AI-powered full-stack web query agent that fetches and summarizes web results intelligently using Playwright, OpenRouter (LLaMA-3), and semantic embeddings for caching and reuse.

---

## 🚀 Features

- 📝 Natural language query input
- ✅ Valid vs invalid query classification
- ♻️ Smart caching using vector embeddings
- 🌐 Web scraping (Playwright + DuckDuckGo/Google/Bing)
- 📄 AI summarization via LLaMA-3 on OpenRouter
- ⚡ Clean React frontend with bullet-point summaries

---


## 🚀 Flowchart

         ┌────────────┐
         │ User Query │
         └─────┬──────┘
               ↓
        [ Query Classifier ]
         └─────┬──────┘
               ↓
              ┌────────────────────┐
              │ Embedding Generator│  ← (uses transformers)
              └─────┬──────┬───────┘
                    │      │
                    ↓      ↓
           [ Vector Similarity Check ] ← Past Queries in MongoDB
                    │
            ┌───────┴───────┐
            │ Match Found?  │─────▶ Return Cached Summary
            └───────┬───────┘
                    ↓ No
            [ Playwright Web Scraper ]
                    ↓
            [ AI Summarizer via LLaMA ]
                    ↓
            [ Store Summary + Embedding in DB ]
                    ↓
            Return Final Summary to User



## ⚙️ How to Migrate & Run Locally

### 🔁 1. Clone the Repository

```bash
git clone https://github.com/your-username/ripplica-query-agent.git
cd ripplica-query-agent


⚙️ 2. Backend Setup (/server)
cd server
npm install
cp .env.example .env


Fill .env file like this:
OPENROUTER_API_KEY=your_openrouter_api_key
MONGODB_URI=your_mongo_connection_string
PORT=5000


Start backend:
node server.js
Backend runs at: http://localhost:5000

💻 3. Frontend Setup (/client)
cd ../client
npm install
npm run dev
Frontend runs at: http://localhost:5173

🔐 .env.example

OPENROUTER_API_KEY=
MONGODB_URI=
PORT=5000


🧪 Example Queries

top hotels in world
best cafes in chandigarh
famous temples in india
monuments to visit in delhi


🛠️ Tech Stack

React (Vite) for frontend
Node.js + Express for backend
MongoDB for persistence
Playwright for scraping
OpenRouter (LLaMA-3) for summarization
Cosine Similarity for semantic query matching
Axios for API communication
CSS for styling



👨‍💻 Author

Dhruv Gupta
Ripplica Technical Assignment – 2025

📄 License

This project is submitted for evaluation purposes only. Do not publish, redistribute, or modify without permission.


---
