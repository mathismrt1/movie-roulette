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
// remove placeholder when clicked
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
  set(newMovieRef, { title });
  movieInput.value = "";
}

// Load and display movies from Firebase in real-time
function loadMovies() {
  const moviesRef = ref(db, "movies");
  onValue(moviesRef, (snapshot) => {
    movieList.innerHTML = "";
    const data = snapshot.val();
    if (data) {
      Object.entries(data).forEach(([key, movie]) => {
        const li = document.createElement("li");
        li.textContent = movie.title;
        li.style.position = "relative";

        // Créer bouton supprimer
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
          // Supprimer le film dans Firebase avec la clé
          const movieRef = ref(db, `movies/${key}`);
          set(movieRef, null);
        });

        li.appendChild(delBtn);
        movieList.appendChild(li);
      });
    }
  });
}


// Pick a random movie from the list
function pickRandomMovie() {
  const moviesRef = ref(db, "movies");
  get(moviesRef).then((snapshot) => {
    const data = snapshot.val();
    if (!data) return;
    const movies = Object.values(data).map(m => m.title);
    if (movies.length === 0) return;

    let count = 0;
    let delay = 25;       // délai initial en ms
    const maxDelay = 600; // délai max (ralentissement)
    const increment = 25; // augmentation progressive du délai

    function spin() {
      pickedMovie.textContent = movies[count % movies.length];
      count++;

      if (delay < maxDelay) {
        delay += increment;
        setTimeout(spin, delay);
      } else {
        // Fin du tirage, choix final au hasard
        const randomIndex = Math.floor(Math.random() * movies.length);
        pickedMovie.textContent = movies[randomIndex];
      }
    }

    spin();
  });
}


// Event listeners
addButton.addEventListener("click", () => addMovie(movieInput.value));
movieInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addMovie(movieInput.value);
});
pickButton.addEventListener("click", pickRandomMovie);

// Load movies at startup
loadMovies();
