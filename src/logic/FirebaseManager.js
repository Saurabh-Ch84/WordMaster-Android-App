import { signInAnonymously } from "firebase/auth";
import { ref, update, onValue, query, orderByChild, limitToLast } from "firebase/database";
import { auth, db } from "../config/firebaseConfig";

// 1. Silent Login (with error handling)
export const loginUserSilently = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    console.log("✅ User signed in:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("Login Failed:", error);
    return null;
  }
};

// 2. Save Score (Only updates if higher)
export const saveScoreToCloud = (userName, newScore) => {
  const user = auth.currentUser;
  if (!user) return; 

  // Create a reference to THIS user in the database
  const userRef = ref(db, 'users/' + user.uid);
  
  update(userRef, {
    name: userName || "Anonymous", // Fallback if name is empty
    score: newScore,
    updatedAt: Date.now()
  }).catch(err => console.log("Save Error:", err));
};

// 3. Listen for Leaderboard (Top 20)
export const subscribeToLeaderboard = (callback) => {
  const usersRef = ref(db, 'users');
  // Query: Order by 'score', take the last 20 (Highest scores are at the bottom in Firebase)
  const topScoresQuery = query(usersRef, orderByChild('score'), limitToLast(10));

  // Real-time Listener
  const unsubscribe = onValue(topScoresQuery, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]); 
      return;
    }

    // Convert Object { "uid1": {...}, "uid2": {...} } -> Array [ {...}, {...} ]
    const leaderboardArray = Object.keys(data)
      .map(key => ({
        id: key,
        ...data[key]
      }))
      .sort((a, b) => b.score - a.score); // Flip to Descending (Highest First)

    callback(leaderboardArray);
  });

  return unsubscribe; // Return function to stop listening
};