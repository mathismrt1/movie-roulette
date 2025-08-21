import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const backButton = document.getElementById("back");
backButton.addEventListener("click", () => {
  window.location.href = "../index.html";
});

// Vérification de la connexion
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadMovies();
  } else {
    movieList.innerHTML = "<li>Connectez-vous dans l'application principale pour noter vos films.</li>";
  }
});
