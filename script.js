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
      Object.values(data).forEach((movie) => {
        const li = document.createElement("li");
        li.textContent = movie.title;
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
    const randomIndex = Math.floor(Math.random() * movies.length);
    pickedMovie.textContent = "🎯 " + movies[randomIndex];
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
