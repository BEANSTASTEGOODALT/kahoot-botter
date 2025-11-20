const express = require("express");
const path = require("path");
const Kahoot = require("kahoot.js-updated");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let client = null;

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Handle form submission
app.post("/join", async (req, res) => {
  const gamePin = req.body.pin;
  const nickname = req.body.nick;

  if (!gamePin || !nickname) {
    return res.send("Missing PIN or nickname.");
  }

  client = new Kahoot();

  console.log("Joining Kahoot...");

  client.join(Number(gamePin), nickname).catch(error => {
    console.error("Join failed:", error.description);
    res.send("Failed to join: " + error.description);
  });

  client.on("Joined", () => {
    console.log("Joined successfully!");
  });

  client.on("QuestionStart", question => {
    question.answer(0); // Always answer "first choice"
    console.log("Answered a question");
  });

  client.on("QuizEnd", () => {
    console.log("Quiz ended");
  });

  res.send("Attempting to join game… Check server console.");
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Web interface running at http://localhost:${PORT}`);
});
