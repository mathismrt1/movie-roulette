// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCpr95pZ-_cfP6sMZIDkAfvOlftvo2WlRQ",
  authDomain: "movie-roulette-1fd26.firebaseapp.com",
  databaseURL: "https://movie-roulette-1fd26-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "movie-roulette-1fd26",
  storageBucket: "movie-roulette-1fd26.appspot.com",
  messagingSenderId: "286304984019",
  appId: "1:286304984019:web:3d9d7c81478f0c3a40ad26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// DOM Elements
const movieInput = document.getElementById("movieInput");
const addButton = document.getElementById("addButton");
const movieList = document.getElementById("movieList");
const pickButton = document.getElementById("pickButton");
const pickedMovie = document.getElementById("pickedMovie");

// Auth DOM
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");

// Login event
loginButton.addEventListener("click", () => {
  const email = document.getElementById("emailInput").value;
  const password = document.getElementById("passwordInput").value;
  signInWithEmailAndPassword(auth, email, password)
    .catch((error) => alert("Login failed: " + error.message));
});

// Logout event
logoutButton.addEventListener("click", () => {
  signOut(auth);
});

// Auth state handling
onAuthStateChanged(auth, (user) => {
  const authSection = document.getElementById("authSection");
  if (user) {
    addButton.disabled = false;
    loadMovies(true);
  } else {
    window.location.href = "login.html";
  }
});

// Remove placeholder on focus, restore on blur
movieInput.addEventListener("focus", () => {
  movieInput.placeholderBackup = movieInput.placeholder;
  movieInput.placeholder = "";
});
movieInput.addEventListener("blur", () => {
  movieInput.placeholder = movieInput.placeholderBackup || "Add a movie...";
});

// Add movie
function addMovie(title) {
  if (!title.trim()) return;
  const moviesRef = ref(db, "movies");
  const newMovieRef = push(moviesRef);
  set(newMovieRef, { title }).then(() => {
    movieInput.value = "";
    showFeedback("✔️ Movie added!", true);
  }).catch(() => {
    showFeedback("❌ Error adding movie.", false);
  });
}

// Load movies
function loadMovies(editable = false) {
  const moviesRef = ref(db, "movies");
  onValue(moviesRef, (snapshot) => {
    movieList.innerHTML = "";
    const data = snapshot.val();

    if (data) {
      Object.entries(data)
        .sort((a, b) => a[1].title.localeCompare(b[1].title))
        .forEach(([key, movie]) => {
          const li = document.createElement("li");
          li.textContent = movie.title;

          if (editable) {
            const delBtn = document.createElement("button");
            delBtn.textContent = "✖";
            delBtn.title = "Delete movie";
            delBtn.addEventListener("click", () => {
              const movieRef = ref(db, `movies/${key}`);
              set(movieRef, null);
            });
            li.appendChild(delBtn);
          }

          movieList.appendChild(li);
        });
    }
  });
}

// Pick movie
function pickRandomMovie() {
  const moviesRef = ref(db, "movies");
  get(moviesRef).then((snapshot) => {
    const data = snapshot.val();
    if (!data) return;
    const movies = Object.values(data).map(m => m.title);
    if (movies.length === 0) return;

    let count = 0;
    let delay = 150;
    const maxDelay = 500;
    const increment = 40;
    const fastDuration = 3000;
    const startTime = Date.now();

    function spin() {
      pickedMovie.textContent = movies[count % movies.length];
      count++;
      const elapsed = Date.now() - startTime;

      if (elapsed < fastDuration) {
        setTimeout(spin, delay);
      } else if (delay < maxDelay) {
        delay += increment;
        setTimeout(spin, delay);
      } else {
        const randomIndex = Math.floor(Math.random() * movies.length);
        pickedMovie.textContent = movies[randomIndex];
        pickedMovie.style.color = "red";
      }
    }

    pickedMovie.style.color = "#007bff";
    spin();
  });
}

// Feedback
function showFeedback(message, success = true) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = message;
  feedback.style.color = success ? "green" : "red";
  setTimeout(() => feedback.textContent = "", 3000);
}

// Event listeners
addButton.addEventListener("click", () => addMovie(movieInput.value));
movieInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addMovie(movieInput.value);
});
pickButton.addEventListener("click", pickRandomMovie);
