# 🎯 Target Rush — Elite Arcade

A neon-cyberpunk reflex arcade game with Firebase leaderboard integration.

---

## 🚀 Quick Start (No Backend Needed)

Just open `Frontend/index.html` directly in your browser. Everything works offline — Firebase leaderboard is optional.

---

## 🔥 Firebase Setup (Online Leaderboard)

### Step 1 — Create a Firebase Project
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add Project** → name it (e.g. `target-rush`) → Continue
3. Disable Google Analytics if you don't need it → **Create Project**

### Step 2 — Enable Firestore
1. In the left sidebar: **Build → Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (allows reads/writes for 30 days)
4. Pick your nearest region → **Done**

### Step 3 — Get Your Config
1. In Project Overview → click the **Web app** icon `</>`
2. Register app (any nickname) → you'll see a config block like:
   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456",
     appId: "1:123:web:abc"
   };
   ```
3. Copy the config values

### Step 4 — Paste Config into gameover.html
Open `Frontend/gameover.html` and find the section labelled **FIREBASE CONFIG** (around line 190):

```js
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",       // ← paste here
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
```

Replace all `YOUR_*` placeholders with your actual values.

### Step 5 — Firestore Security Rules (Production)
In the Firestore console → **Rules** tab, replace the default with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /scores/{docId} {
      allow read: if true;
      allow create: if request.resource.data.username is string
                    && request.resource.data.score is number;
      allow update: if request.resource.data.score is number;
    }
  }
}
```

---

## 🖥️ Node.js Backend (Alternative to Firebase)

If you prefer a local Express server instead of Firebase:

```bash
npm install
npm start
# Server runs at http://localhost:3000
```

Update `gameover.html` to call your server instead:
```js
await fetch("http://localhost:3000/submit-score", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, score: finalScore })
});
```

---

## 🐛 Bugs Fixed vs Original

| # | File | Bug | Fix |
|---|------|-----|-----|
| 1 | game.html | `scoreEl` used but never declared | Added `const scoreEl = document.getElementById('scoreEl')` |
| 2 | game.html | Score HUD showed hardcoded `002,450` | Score starts at `000,000` and updates live |
| 3 | gameover.html | Count-up animated to hardcoded `128450` | Animates to actual `localStorage.finalScore` |
| 4 | gameover.html | `submitScore()` fired on page load | Wired to SUBMIT SCORE button click only |
| 5 | gameover.html | PLAY AGAIN had no handler | `onclick="window.location.href='index.html'"` |
| 6 | server.js | `const scoreEl = document.getElementById(...)` in Node.js | Removed browser API from server file |
| 7 | game.html | 3 static targets, no real spawning | 6 dynamic targets, 4 types, random positions |

## ✨ New Features

- **4 target types**: Standard (+100), Fast (+200), Bonus (+300), Mega (+500)
- **Combo multiplier** up to x10 — resets after 2s without a hit
- **Floating score popups** when hitting targets
- **Timer warnings** — yellow at 10s, red pulse at 5s
- **Stats on game over**: Hits, Best Combo, Score/Hit, Rank
- **Firebase Firestore** leaderboard — saves best score per player
- **Session leaderboard** in-game shows your rank live

---

## 📁 File Structure

```
target-rush/
├── Frontend/
│   ├── index.html       ← Home / Login screen
│   ├── game.html        ← Gameplay arena
│   └── gameover.html    ← Results + leaderboard (Firebase here)
├── Backend/
│   ├── server.js        ← Express API (optional)
│   └── scores.json      ← Local score storage
├── package.json
└── README.md
```
