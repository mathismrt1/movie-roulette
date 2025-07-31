const db = firebase.database();
const movieInput = document.getElementById("movieInput");
const addButton = document.getElementById("addButton");
const movieList = document.getElementById("movieList");
const pickButton = document.getElementById("pickButton");
const pickedMovie = document.getElementById("pickedMovie");

// Add movie to Firebase
function addMovie(title) {
  if (!title.trim()) return;
  const movieRef = db.ref("movies").push();
  movieRef.set({ title });
  movieInput.value = "";
}

// Load movies from Firebase
function loadMovies() {
  movieList.innerHTML = "";
  db.ref("movies").on("value", (snapshot) => {
    movieList.innerHTML = "";
    const data = snapshot.val();
    if (data) {
      Object.entries(data).forEach(([id, movie]) => {
        const li = document.createElement("li");
        li.textContent = movie.title;
        movieList.appendChild(li);
      });
    }
  });
}

// Pick random movie
function pickRandomMovie() {
  db.ref("movies").once("value", (snapshot) => {
    const data = snapshot.val();
    if (!data) return;
    const movies = Object.values(data).map((m) => m.title);
    const randomIndex = Math.floor(Math.random() * movies.length);
    pickedMovie.textContent = "🎯 " + movies[randomIndex];
  });
}

// Events
addButton.addEventListener("click", () => addMovie(movieInput.value));
movieInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addMovie(movieInput.value);
});
pickButton.addEventListener("click", pickRandomMovie);

// Load on start
loadMovies();
