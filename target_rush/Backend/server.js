const express = require("express");
const fs      = require("fs");
const cors    = require("cors");
const path    = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve the Frontend folder as static files
app.use(express.static(path.join(__dirname, "../Frontend")));

const SCORES_FILE = path.join(__dirname, "scores.json");

function readScores() {
  if (!fs.existsSync(SCORES_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(SCORES_FILE, "utf8")); }
  catch { return []; }
}

function writeScores(scores) {
  fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
}

// POST /submit-score
app.post("/submit-score", (req, res) => {
  const { username, score } = req.body;
  if (!username || score === undefined) {
    return res.status(400).json({ error: "username and score required" });
  }

  let scores = readScores();

  // Update if exists, insert if new
  const idx = scores.findIndex(s => s.username === username);
  if (idx !== -1) {
    if (Number(score) > scores[idx].score) {
      scores[idx].score = Number(score);
      scores[idx].updatedAt = new Date().toISOString();
    }
  } else {
    scores.push({ username, score: Number(score), submittedAt: new Date().toISOString() });
  }

  scores.sort((a, b) => b.score - a.score);
  writeScores(scores);

  const rank = scores.findIndex(s => s.username === username) + 1;
  res.json({ message: "Score saved", rank });
});

// GET /leaderboard
app.get("/leaderboard", (req, res) => {
  const scores = readScores();
  scores.sort((a, b) => b.score - a.score);
  res.json(scores.slice(0, 10));
});

// GET / — serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅  Target Rush server running at http://localhost:${PORT}`);
});
