import "dotenv/config";


//OMDB-API

//-- *********************************** GET ALL MOVIES *********************** --//
function getMovie(imdbId) {
  const OMDB_URL = "http://www.omdbapi.com";
  const apiKey = process.env.OMDB_API_KEY;
  const url = `${OMDB_URL}/?apikey=${apiKey}&plot=short&i=${imdbId}`;

  return fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    return data;
  })
  .catch(error => {
    console.error("Error fetching movie data from OMDB:", error);
    throw error;
  });
}

/* getMovie("tt15239678")
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error("Failed to fetch movie:", error);
  });
*/

export { getMovie };