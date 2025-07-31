// Chargement initial
let films = JSON.parse(localStorage.getItem("films")) || [];
const listeFilms = document.getElementById("listeFilms");
const filmInput = document.getElementById("filmInput");
const filmChoisi = document.getElementById("filmChoisi");

// Afficher la liste
function afficherFilms() {
  listeFilms.innerHTML = "";
  films.forEach((film, index) => {
    const li = document.createElement("li");
    li.textContent = film;
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = () => supprimerFilm(index);
    li.appendChild(btn);
    listeFilms.appendChild(li);
  });
  localStorage.setItem("films", JSON.stringify(films));
}

// Ajouter un film
function ajouterFilm() {
  const film = filmInput.value.trim();
  if (film) {
    films.push(film);
    filmInput.value = "";
    afficherFilms();
  }
}

// Supprimer un film
function supprimerFilm(index) {
  films.splice(index, 1);
  afficherFilms();
}

// Tirer un film aléatoirement
function tirerFilm() {
  if (films.length === 0) {
    filmChoisi.textContent = "Ajoute des films d'abord !";
    return;
  }

  let i = 0;
  const max = 20 + Math.floor(Math.random() * 20); // nombre d'itérations aléatoires

  const interval = setInterval(() => {
    const alea = Math.floor(Math.random() * films.length);
    filmChoisi.textContent = "🎲 " + films[alea];
    i++;
    if (i > max) clearInterval(interval);
  }, 100); // vitesse d'animation
}

afficherFilms();
