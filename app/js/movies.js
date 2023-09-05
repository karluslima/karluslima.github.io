const baseURL = 'http://image.tmdb.org/t/p/'
const fetchUrl = 'https://api.themoviedb.org/3/discover/movie'
const fetchParams = '?include_adult=false&include_video=false&language=pt-BR&page=1&sort_by=popularity.desc&with_genres='
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhYTVlYTUxMjM4M2ViZTM1MWVhZTQ2ZTQ4Y2Y2OGQ5OCIsInN1YiI6IjY0ZjZhZGE5NWYyYjhkMDBlMTJkMTgyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Mn_6ijjNTj2Fv7QhyTLgZLnyVjWy_KWscVl4Yi_z8zc'
  }
}

async function fetchMovies() {
  try {
    const response = await fetch(fetchUrl + fetchParams + 12, options);
    const movies = await response.json();
    const items = await movies.results;
    var featuredSlide = document.querySelector('.featured-banners .slider-container');
    for (var i = 0; i < 5; i++) {
      var item = items[i];
      $(featuredSlide).append(`<li><img src="${baseURL}w780/${item.backdrop_path}" loading="lazy" width="780px" heigth="439px" alt="${item.title}"></li>`);
    }

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}

function getMovies() {
  fetchMovies()
    .then(() => {
      const generos = ['28', '16', '35', '14'];
      for (let genero of generos) {
        fetch(fetchUrl + fetchParams + genero, options)
          .then((response) => response.json())
          .then((response) => {
            const movieGender = response.results;
            var sliderSelector = document.querySelector(`.slider-${genero}`);
            for (var i = 0; i < 15; i++) {
              var movie = movieGender[i];
              $(sliderSelector).append(`<li><img src="${baseURL}w342/${movie.poster_path}"
                loading="lazy"
                class="movie-poster"
                alt="${movie.title}"
                width="342px"
                heigth="513px">
              </li>`);
            }
          });
      }
    })
    .catch((error) => {
      console.error("Ocorreu um erro:", error);
    });
}

getMovies();
