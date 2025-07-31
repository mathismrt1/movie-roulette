// Import Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Firebase config from your project
const firebaseConfig = {
  apiKey: "AIzaSyCpr95pZ-_cfP6sMZIDkAfvOlftvo2WlRQ",
  authDomain: "movie-roulette-1fd26.firebaseapp.com",
  databaseURL: "https://movie-roulette-1fd26-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "movie-roulette-1fd26",
  storageBucket: "movie-roulette-1fd26.firebasestorage.app",
  messagingSenderId: "286304984019",
  appId: "1:286304984019:web:3d9d7c81478f0c3a40ad26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM elements
const movieInput = document.getElementById("movieInput");

// Remove placeholder on focus, restore on blur
movieInput.addEventListener("focus", () => {
  movieInput.placeholderBackup = movieInput.placeholder;
  movieInput.placeholder = "";
});
movieInput.addEventListener("blur", () => {
  movieInput.placeholder = movieInput.placeholderBackup || "Add a movie...";
});

const addButton = document.getElementById("addButton");
const movieList = document.getElementById("movieList");
const pickButton = document.getElementById("pickButton");
const pickedMovie = document.getElementById("pickedMovie");

// Add a movie to the database
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

// Load and display movies from Firebase
function loadMovies() {
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
          li.style.position = "relative";

          // Create delete button
          const delBtn = document.createElement("button");
          delBtn.textContent = "✖";
          delBtn.style.position = "absolute";
          delBtn.style.right = "8px";
          delBtn.style.top = "50%";
          delBtn.style.transform = "translateY(-50%)";
          delBtn.style.border = "none";
          delBtn.style.background = "transparent";
          delBtn.style.color = "#c00";
          delBtn.style.fontWeight = "bold";
          delBtn.style.cursor = "pointer";
          delBtn.title = "Delete movie";

          delBtn.addEventListener("click", () => {
            const movieRef = ref(db, `movies/${key}`);
            set(movieRef, null);
          });

          li.appendChild(delBtn);
          movieList.appendChild(li);
        });
    }
  });
}


// Pick a random movie with slowing animation
function pickRandomMovie() {
  const moviesRef = ref(db, "movies");
  get(moviesRef).then((snapshot) => {
    const data = snapshot.val();
    if (!data) return;
    const movies = Object.values(data).map(m => m.title);
    if (movies.length === 0) return;

    let count = 0;
    let delay = 50;           // délai rapide constant (100ms)
    const maxDelay = 500;    // délai max pour ralentir
    const increment = 25;     // augmentation du délai à chaque tour
    const fastDuration = 3000; // durée en ms de la phase rapide
    const startTime = Date.now();

    function spin() {
      pickedMovie.textContent = movies[count % movies.length];
      count++;

      const elapsed = Date.now() - startTime;

      if (elapsed < fastDuration) {
        // Phase rapide constante
        setTimeout(spin, delay);
      } else if (delay < maxDelay) {
        // Phase ralentissement progressif
        delay += increment;
        setTimeout(spin, delay);
      } else {
        // Fin du tirage
        const randomIndex = Math.floor(Math.random() * movies.length);
        pickedMovie.textContent = movies[randomIndex];
        pickedMovie.style.color = "red";
      }
    }

    pickedMovie.style.color = "#007bff"; // reset couleur avant spin
    spin();
  });
}

function showFeedback(message, success = true) {
  const feedback = document.getElementById("feedback");
  feedback.textContent = message;
  feedback.style.color = success ? "green" : "red";

  setTimeout(() => {
    feedback.textContent = "";
  }, 3000); // disparaît après 3 secondes
}

// Event listeners
addButton.addEventListener("click", () => addMovie(movieInput.value));
movieInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addMovie(movieInput.value);
});
pickButton.addEventListener("click", pickRandomMovie);

// Load movies at startup
loadMovies();
