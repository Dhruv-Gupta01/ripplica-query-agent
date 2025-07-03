const express = require("express");
const router = express.Router();

const isValidQuery = require("../utils/validator");
const { getEmbedding, isSimilar } = require("../services/embedder");
const Query = require("../models/Query");

const { scrapeBing } = require('../services/scraper');
const { summarizeWithAI } = require('../services/summarizer');

router.post("/", async (req, res) => {
  try {
    const { query } = req.body;
    console.log("Query received:", query);

    // Step 1: Validate Query
    if (!isValidQuery(query)) {
      return res.status(400).json({ message: "This is not a valid query." });
    }
    console.log("Query is valid.");
    // Step 2: Get embedding
    const embedding = await getEmbedding(query);

    // Step 3: Check similarity with past queries
    const pastQueries = await Query.find({});
    for (let past of pastQueries) {
      if (past.embedding && isSimilar(embedding, past.embedding)) {
        return res.json({ source: "cache", summary: past.summary });
      }
    }

    // Step 4: No similar query found → respond dummy for now
    console.log("No similar query found. Proceeding to scrape and summarize.");
    const pages = await scrapeBing(query);
    //console.log("Pages:", pages);
    const combinedText = pages.map(p => p.content).join('\n\n').slice(0, 5000); // keep it short
    console.log("Combined text : ", combinedText.slice(0,3000));
    const summary = await summarizeWithAI(combinedText);
    console.log("Summary:", summary);
  
    await Query.create({ query, embedding: Array.from(embedding), summary });
  
    res.json({ source: 'new', summary });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
