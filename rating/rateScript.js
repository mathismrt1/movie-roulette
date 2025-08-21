import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCpr95pZ-_cfP6sMZIDkAfvOlftvo2WlRQ",
  authDomain: "movie-roulette-1fd26.firebaseapp.com",
  databaseURL: "https://movie-roulette-1fd26-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "movie-roulette-1fd26",
  storageBucket: "movie-roulette-1fd26.firebasestorage.app",
  messagingSenderId: "286304984019",
  appId: "1:286304984019:web:3d9d7c81478f0c3a40ad26"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

const movieList = document.getElementById("movieList");

// Affichage des films et notation
function loadMovies() {
  const moviesRef = ref(db, "movies");
  onValue(moviesRef, (snapshot) => {
    movieList.innerHTML = "";
    const data = snapshot.val();
    if (!data) return;

    Object.entries(data).forEach(([key, movie]) => {
      const li = document.createElement("li");
      li.textContent = movie.title;

      const ratingDiv = document.createElement("div");
      ratingDiv.className = "rating";

      for (let i = 1; i <= 5; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.addEventListener("click", () => rateMovie(key, i));
        ratingDiv.appendChild(btn);
      }

      li.appendChild(ratingDiv);
      movieList.appendChild(li);
    });
  });
}

// Fonction de notation
function rateMovie(movieId, rating) {
  const user = auth.currentUser;
  if (!user) {
    alert("Vous devez être connecté pour noter un film.");
    return;
  }
  set(ref(db, `ratings/${movieId}/${user.uid}`), rating)
    .then(() => alert(`Vous avez noté ${rating} ⭐`))
    .catch(() => alert("Erreur lors de la notation."));
}

// Vérification de la connexion
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadMovies();
  } else {
    movieList.innerHTML = "<li>Connectez-vous dans l'application principale pour noter vos films.</li>";
  }
});
