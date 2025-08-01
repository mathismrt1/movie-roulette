import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, get } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCpr95pZ-_cfP6sMZIDkAfvOlftvo2WlRQ",
  authDomain: "movie-roulette-1fd26.firebaseapp.com",
  databaseURL: "https://movie-roulette-1fd26-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "movie-roulette-1fd26",
  storageBucket: "movie-roulette-1fd26.appspot.com",
  messagingSenderId: "286304984019",
  appId: "1:286304984019:web:3d9d7c81478f0c3a40ad26"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence).catch(error => {
  console.error("Erreur lors de la configuration de la persistance:", error);
});

// DOM Elements
const authSection = document.getElementById("authSection");
const appSection = document.getElementById("appSection");
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const movieInput = document.getElementById("movieInput");
const addButton = document.getElementById("addButton");
const movieList = document.getElementById("movieList");
const pickButton = document.getElementById("pickButton");
const pickedMovie = document.getElementById("pickedMovie");
const feedback = document.getElementById("feedback");

// Login
loginButton.addEventListener("click", () => {
  const email = document.getElementById("emailInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();
  if (!email || !password) {
    alert("Merci de remplir email et mot de passe.");
    return;
  }
  signInWithEmailAndPassword(auth, email, password)
    .catch(err => alert("Connexion échouée : " + err.message));
});

// Logout
logoutButton.addEventListener("click", () => {
  signOut(auth);
});

// Activer/Désactiver bouton Ajouter selon input
movieInput.addEventListener("input", () => {
  addButton.disabled = movieInput.value.trim() === "";
});

// Ajouter un film
addButton.addEventListener("click", () => addMovie(movieInput.value));
movieInput.addEventListener("keypress", e => {
  if (e.key === "Enter" && !addButton.disabled) addMovie(movieInput.value);
});

// Choisir un film aléatoire
pickButton.addEventListener("click", pickRandomMovie);

// Surveiller état de connexion
onAuthStateChanged(auth, (user) => {
  if (user) {
    authSection.style.display = "none";
    appSection.style.display = "block";
    addButton.disabled = movieInput.value.trim() === "";
    loadMovies(true);
  } else {
    authSection.style.display = "block";
    appSection.style.display = "none";
    addButton.disabled = true;
    movieList.innerHTML = "";
    pickedMovie.textContent = "";
  }
});

function addMovie(title) {
  if (!title.trim()) return;
  const moviesRef = ref(db, "movies");
  const newMovieRef = push(moviesRef);
  set(newMovieRef, { title: title.trim() }).then(() => {
    movieInput.value = "";
    addButton.disabled = true;
    showFeedback("✔️ Film ajouté !", true);
  }).catch(() => {
    showFeedback("❌ Erreur lors de l'ajout.", false);
  });
}

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
            delBtn.title = "Supprimer le film";
            delBtn.addEventListener("click", () => {
              set(ref(db, `movies/${key}`), null);
            });
            li.appendChild(delBtn);
          }
          movieList.appendChild(li);
        });
    }
  });
}

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

    pickedMovie.style.color = "#ffffff";
    spin();
  });
}

function showFeedback(message, success = true) {
  feedback.textContent = message;
  feedback.style.color = success ? "#00ff9d" : "#ff5555";
  setTimeout(() => feedback.textContent = "", 3000);
}

// --- AJOUT : validation login avec touche Entrée sur email et password ---
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");

function tryLoginOnEnter(event) {
  if (event.key === "Enter") {
    loginButton.click();
  }
}

emailInput.addEventListener("keydown", tryLoginOnEnter);
passwordInput.addEventListener("keydown", tryLoginOnEnter);
