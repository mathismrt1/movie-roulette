let movies = JSON.parse(localStorage.getItem("movies")) || [];
const movieList = document.getElementById("movieList");
const movieInput = document.getElementById("movieInput");
const pickedMovie = document.getElementById("pickedMovie");
const addButton = document.getElementById("addButton");
const pickButton = document.getElementById("pickButton");

addButton.addEventListener("click", addMovie);

movieInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addMovie();
  }
});

function renderMovies() {
  movieList.innerHTML = "";
  movies.forEach((movie, index) => {
    const li = document.createElement("li");
    li.textContent = movie;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✖";
    deleteBtn.onclick = () => deleteMovie(index);

    li.appendChild(deleteBtn);
    movieList.appendChild(li);
  });

  localStorage.setItem("movies", JSON.stringify(movies));
}

function addMovie() {
  const movie = movieInput.value.trim();
  if (movie !== "") {
    movies.push(movie);
    movieInput.value = "";
    renderMovies();
  }
}

function deleteMovie(index) {
  movies.splice(index, 1);
  renderMovies();
}

pickButton.addEventListener("click", () => {
  if (movies.length === 0) {
    pickedMovie.textContent = "Please add some movies first!";
    return;
  }

  let counter = 0;
  const max = 15 + Math.floor(Math.random() * 15);

  const interval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * movies.length);
    pickedMovie.textContent = movies[randomIndex];
    counter++;
    if (counter >= max) {
      clearInterval(interval);
    }
  }, 100);
});

renderMovies();
