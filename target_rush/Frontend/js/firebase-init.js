// firebase-init.js — shared across all pages
// Uses Firebase v10 compat CDN (loaded in HTML before this script)
// NO ES module import syntax here — that only works with bundlers, not CDN

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyDzDWYzvWiXu6WSpBg-hooNYg4xuJ9MePE",
  authDomain:        "target-rush28.firebaseapp.com",
  projectId:         "target-rush28",
  storageBucket:     "target-rush28.firebasestorage.app",
  messagingSenderId: "433645638247",
  appId:             "1:433645638247:web:fd21868b3698235c5a3ac2"
};

// Guard against double-init (safe to include on multiple pages)
if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}

const db = firebase.firestore();

// ── Helpers ──────────────────────────────────────────────────
async function submitScoreToFirebase(username, score, hits, bestCombo) {
  try {
    const existing = await db.collection('scores')
      .where('username', '==', username).limit(1).get();
    if (!existing.empty) {
      const doc = existing.docs[0];
      if (score > doc.data().score) {
        await doc.ref.update({
          score, hits, bestCombo,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    } else {
      await db.collection('scores').add({
        username, score, hits, bestCombo, clan: '—',
        submittedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
    return { success: true };
  } catch (e) {
    console.error('Firebase submit error:', e);
    return { success: false, error: e.message };
  }
}

async function fetchLeaderboard(limit = 100) {
  try {
    const snap = await db.collection('scores')
      .orderBy('score', 'desc').limit(limit).get();
    return snap.docs.map((d, i) => ({
      rank: i + 1,
      username: d.data().username,
      score: d.data().score,
      hits: d.data().hits || 0,
      bestCombo: d.data().bestCombo || 1,
      clan: d.data().clan || '—',
      id: d.id
    }));
  } catch (e) {
    console.error('Firebase fetch error:', e);
    return null;
  }
}
