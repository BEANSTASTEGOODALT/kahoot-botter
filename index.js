const express = require("express");
const path = require("path");
const Kahoot = require("kahoot.js-updated");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/join", async (req, res) => {
  const gamePin = req.body.pin;
  const nickname = req.body.nick;
  const botCount = Math.min(Number(req.body.count || 1), 100); // max 5

  if (!gamePin || !nickname) {
    return res.send("Missing PIN or nickname.");
  }

  res.send(`Starting ${botCount} educational bots… See console.`);

  for (let i = 0; i < botCount; i++) {
    createBot(gamePin, `${nickname}_${i + 1}`, i + 1);
  }
});

function createBot(pin, nickname, id) {
  const client = new Kahoot();

  console.log(`[Bot ${id}] Joining as "${nickname}"…`);

  client.join(Number(pin), nickname)
    .then(() => {
      console.log(`[Bot ${id}] Joined successfully!`);

      client.on("QuestionStart", question => {
        console.log(`[Bot ${id}] Received question, answering 0`);
        try {
          question.answer(0);
        } catch {
          console.log(`[Bot ${id}] Could not answer question.`);
        }
      });

      client.on("QuizEnd", () => {
        console.log(`[Bot ${id}] Quiz ended.`);
      });
    })
    .catch(error => {
      console.log(`[Bot ${id}] Join failed: ${error.description}`);
    });
}

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
