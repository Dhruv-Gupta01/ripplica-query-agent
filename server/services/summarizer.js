// const { pipeline } = require('@xenova/transformers');

// let summarizer;

// async function loadSummarizer() {
//   if (!summarizer) {
//     summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-12-6');
//   }
//   return summarizer;
// }

// async function summarize(text) {
//   console.log("Summarizing text");
//   const model = await loadSummarizer();
//   const result = await model(text, {
//     max_length: 200,
//     min_length: 50,
//     do_sample: false
//   });
//   console.log("Summarized text : ", result[0].summary_text);
//   return result[0].summary_text;
// }

// module.exports = { summarize };










const OpenAI = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Ripplica Query Agent",
  },
});

async function summarizeWithAI(text) {
    try {
      console.log("text : ", text.slice(0, 1000));
      const completion = await openai.chat.completions.create({
        model: "meta-llama/llama-3-8b-instruct", // or switch to "anthropic/claude-3-haiku"
        messages: [
          {
            role: "user",
            content: `
  You are a professional content summarizer. Summarize the text below in 3–5 clear bullet points, skipping irrelevant parts like contact info, ads, or generic introductions.
  
  Text:
  ${text}
            `,
          },
        ],
        temperature: 0.3,
      });
  
      const summary = completion.choices[0].message.content;
      console.log("📄 Summary: ", summary);
      return summary;
    } catch (err) {
      console.error("❌ AI summarization failed:", err.message);
      throw err;
    }
  }
  
module.exports = { summarizeWithAI };
