const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const API_KEY = process.env.GEMINI_API_KEY;

// Middleware (optional)
app.use(express.json());
const corsOptions = {
  origin: "*", 
  methods: ["POST"],
};
app.use(cors(corsOptions)); 
// Route
app.post("/", async (req, res) => {
    const {emailText,selectedTone} = req.body
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Here is an email I received: "${emailText}". Please write a ${selectedTone} reply for me. Only provide the reply no extra text`,
                },
              ],
            },
          ],
        }),
      }
    );
    const data = await response.json(); // 👈 parse Gemini’s response
    res.json(data); // send it back to frontend
  }  catch (error) {
  console.error(error);
  res.status(500).json({ error: "Error while fetching the response, please try again" });
}
});

// Start server
app.listen(5050, () => {
  console.log("Server running on port 5050");
});
