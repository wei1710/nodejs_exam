import db from "./connection.js";

async function resetDatabase() {

  //-- *********************************** USER *********************** --//
  
  await db.users.deleteMany({});

  const testUsers = [
    {
      username: "JohnDoe",
      password: "$2b$10$7KFRq6.fSMdNA0OoLZ9XnueSm33Tnv.8sY58ej5dpUh7Yrb7svF5G",
      email: "johndoe@gmail.com",
      is_signed_up: true,
      verified: true,
      session_id: null,
      verification_token: null,
      verification_key: null,
      expiration_timestamp: null,
      reset_token: null,
      reset_timestamp: null,
      is_admin: false
    },
    {
      username: "AliceDoe",
      password: "$2b$10$lzGn5RlBjQxmMgOUMSB5UeZ6Wh5J2kSDmsEhaK4dTvnW/armWEcZ2",
      email: "alicedoe@gmail.com",
      is_signed_up: true,
      verified: true,
      session_id: null,
      verification_token: null,
      verification_key: null,
      expiration_timestamp: null,
      reset_token: null,
      reset_timestamp: null,
      is_admin: false
    },
    {
      username: "admin",
      password: "$2b$10$i4gqSJB0TdZlnQV8oJMSn.atCAx/pWliVfz6WFdovsI6UhkRN5MN.",
      email: "admin@movieportal.com",
      is_signed_up: true,
      verified: true,
      session_id: null,
      verification_token: null,
      verification_key: null,
      expiration_timestamp: null,
      reset_token: null,
      reset_timestamp: null,
      is_admin: true
    },
    {
      username: "Thomas",
      password: "$2b$10$7KFRq6.fSMdNA0OoLZ9XnueSm33Tnv.8sY58ej5dpUh7Yrb7svF5G",
      email: "thomas@gmail.com",
      is_signed_up: true,
      verified: true,
      session_id: null,
      verification_token: null,
      verification_key: null,
      expiration_timestamp: null,
      reset_token: null,
      reset_timestamp: null,
      is_admin: false
    },
    {
      username: "Simon",
      password: "$2b$10$7KFRq6.fSMdNA0OoLZ9XnueSm33Tnv.8sY58ej5dpUh7Yrb7svF5G",
      email: "simon@gmail.com",
      is_signed_up: true,
      verified: true,
      session_id: null,
      verification_token: null,
      verification_key: null,
      expiration_timestamp: null,
      reset_token: null,
      reset_timestamp: null,
      is_admin: false
    },
    {
      username: "Benjamin",
      password: "$2b$10$7KFRq6.fSMdNA0OoLZ9XnueSm33Tnv.8sY58ej5dpUh7Yrb7svF5G",
      email: "benjamin@gmail.com",
      is_signed_up: true,
      verified: true,
      session_id: null,
      verification_token: null,
      verification_key: null,
      expiration_timestamp: null,
      reset_token: null,
      reset_timestamp: null,
      is_admin: false
    },
    {
      username: "Lasse",
      password: "$2b$10$7KFRq6.fSMdNA0OoLZ9XnueSm33Tnv.8sY58ej5dpUh7Yrb7svF5G",
      email: "lasse@gmail.com",
      is_signed_up: true,
      verified: true,
      session_id: null,
      verification_token: null,
      verification_key: null,
      expiration_timestamp: null,
      reset_token: null,
      reset_timestamp: null,
      is_admin: false
    },
    {
      username: "Mikkel",
      password: "$2b$10$7KFRq6.fSMdNA0OoLZ9XnueSm33Tnv.8sY58ej5dpUh7Yrb7svF5G",
      email: "mikkel@gmail.com",
      is_signed_up: true,
      verified: true,
      session_id: null,
      verification_token: null,
      verification_key: null,
      expiration_timestamp: null,
      reset_token: null,
      reset_timestamp: null,
      is_admin: false
    },
    {
      username: "Chris",
      password: "$2b$10$7KFRq6.fSMdNA0OoLZ9XnueSm33Tnv.8sY58ej5dpUh7Yrb7svF5G",
      email: "chris@gmail.com",
      is_signed_up: true,
      verified: true,
      session_id: null,
      verification_token: null,
      verification_key: null,
      expiration_timestamp: null,
      reset_token: null,
      reset_timestamp: null,
      is_admin: false
    },
    {
      username: "Tom",
      password: "$2b$10$7KFRq6.fSMdNA0OoLZ9XnueSm33Tnv.8sY58ej5dpUh7Yrb7svF5G",
      email: "tom@gmail.com",
      is_signed_up: true,
      verified: true,
      session_id: null,
      verification_token: null,
      verification_key: null,
      expiration_timestamp: null,
      reset_token: null,
      reset_timestamp: null,
      is_admin: false
    },
    {
      username: "Elias",
      password: "$2b$10$7KFRq6.fSMdNA0OoLZ9XnueSm33Tnv.8sY58ej5dpUh7Yrb7svF5G",
      email: "elias@gmail.com",
      is_signed_up: true,
      verified: true,
      session_id: null,
      verification_token: null,
      verification_key: null,
      expiration_timestamp: null,
      reset_token: null,
      reset_timestamp: null,
      is_admin: false
    },
  ];

  await db.users.insertMany(testUsers);

  //-- *********************************** MOVIES *********************** --//

  await db.movies.deleteMany({});

  const testMovies = [
    {
      "Title": "Dune: Part Two",
      "Year": "2024",
      "Rated": "PG-13",
      "Released": "01 Mar 2024",
      "Runtime": "166 min",
      "Genre": "Action, Adventure, Drama",
      "Director": "Denis Villeneuve",
      "Writer": "Denis Villeneuve, Jon Spaihts, Frank Herbert",
      "Actors": "Timothée Chalamet, Zendaya, Rebecca Ferguson",
      "Plot": "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
      "Language": "English",
      "Country": "United States, Canada, United Arab Emirates, Hungary, Italy, New Zealand, Jordan, Gambia",
      "Awards": "2 nominations",
      "Poster": "https://m.media-amazon.com/images/M/MV5BN2QyZGU4ZDctOWMzMy00NTc5LThlOGQtODhmNDI1NmY5YzAwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg",
      "Ratings": [
        {
          "Source": "Internet Movie Database",
          "Value": "8.7/10"
        },
        {
          "Source": "Rotten Tomatoes",
          "Value": "93%"
        }
      ],
      "Metascore": "N/A",
      "imdbRating": "8.7",
      "imdbVotes": "380,747",
      "imdbID": "tt15239678",
      "Type": "movie",
      "DVD": "N/A",
      "BoxOffice": "$280,256,121",
      "Production": "N/A",
      "Website": "N/A",
      "Response": "True",
    },
    {
      "Title": "The Batman",
      "Year": "2022",
      "Rated": "PG-13",
      "Released": "04 Mar 2022",
      "Runtime": "176 min",
      "Genre": "Action, Crime, Drama",
      "Director": "Matt Reeves",
      "Writer": "Matt Reeves, Peter Craig, Bob Kane",
      "Actors": "Robert Pattinson, Zoë Kravitz, Jeffrey Wright",
      "Plot": "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
      "Language": "English, Spanish, Latin, Italian",
      "Country": "United States",
      "Awards": "Nominated for 3 Oscars. 38 wins & 181 nominations total",
      "Poster": "https://m.media-amazon.com/images/M/MV5BM2MyNTAwZGEtNTAxNC00ODVjLTgzZjUtYmU0YjAzNmQyZDEwXkEyXkFqcGdeQXVyNDc2NTg3NzA@._V1_SX300.jpg",
      "Ratings": [
        {
          "Source": "Internet Movie Database",
          "Value": "7.8/10"
        },
        {
          "Source": "Rotten Tomatoes",
          "Value": "85%"
        },
        {
          "Source": "Metacritic",
          "Value": "72/100"
        }
      ],
      "Metascore": "72",
      "imdbRating": "7.8",
      "imdbVotes": "788,250",
      "imdbID": "tt1877830",
      "Type": "movie",
      "DVD": "19 Apr 2022",
      "BoxOffice": "$369,345,583",
      "Production": "N/A",
      "Website": "N/A",
      "Response": "True",
    },
    {
      "Title": "Inception",
      "Year": "2010",
      "Rated": "PG-13",
      "Released": "16 Jul 2010",
      "Runtime": "148 min",
      "Genre": "Action, Adventure, Sci-Fi",
      "Director": "Christopher Nolan",
      "Writer": "Christopher Nolan",
      "Actors": "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",
      "Plot": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
      "Language": "English, Japanese, French",
      "Country": "United States, United Kingdom",
      "Awards": "Won 4 Oscars. 159 wins & 220 nominations total",
      "Poster": "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
      "Ratings": [
        {
          "Source": "Internet Movie Database",
          "Value": "8.8/10"
        },
        {
          "Source": "Rotten Tomatoes",
          "Value": "87%"
        },
        {
          "Source": "Metacritic",
          "Value": "74/100"
        }
      ],
      "Metascore": "74",
      "imdbRating": "8.8",
      "imdbVotes": "2,547,638",
      "imdbID": "tt1375666",
      "Type": "movie",
      "DVD": "20 Jun 2013",
      "BoxOffice": "$292,587,330",
      "Production": "N/A",
      "Website": "N/A",
      "Response": "True",
    },
    {
      "Title": "The Dark Knight",
      "Year": "2008",
      "Rated": "PG-13",
      "Released": "18 Jul 2008",
      "Runtime": "152 min",
      "Genre": "Action, Crime, Drama",
      "Director": "Christopher Nolan",
      "Writer": "Jonathan Nolan, Christopher Nolan, David S. Goyer",
      "Actors": "Christian Bale, Heath Ledger, Aaron Eckhart",
      "Plot": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      "Language": "English, Mandarin",
      "Country": "United States, United Kingdom",
      "Awards": "Won 2 Oscars. 163 wins & 164 nominations total",
      "Poster": "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
      "Ratings": [
        {
          "Source": "Internet Movie Database",
          "Value": "9.0/10"
        },
        {
          "Source": "Rotten Tomatoes",
          "Value": "94%"
        },
        {
          "Source": "Metacritic",
          "Value": "84/100"
        }
      ],
      "Metascore": "84",
      "imdbRating": "9.0",
      "imdbVotes": "2,869,224",
      "imdbID": "tt0468569",
      "Type": "movie",
      "DVD": "14 Jun 2010",
      "BoxOffice": "$534,987,076",
      "Production": "N/A",
      "Website": "N/A",
      "Response": "True",
    },
    {
      "Title": "Interstellar",
      "Year": "2014",
      "Rated": "PG-13",
      "Released": "07 Nov 2014",
      "Runtime": "169 min",
      "Genre": "Adventure, Drama, Sci-Fi",
      "Director": "Christopher Nolan",
      "Writer": "Jonathan Nolan, Christopher Nolan",
      "Actors": "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
      "Plot": "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
      "Language": "English",
      "Country": "United States, United Kingdom, Canada",
      "Awards": "Won 1 Oscar. 44 wins & 148 nominations total",
      "Poster": "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
      "Ratings": [
        {
          "Source": "Internet Movie Database",
          "Value": "8.7/10"
        },
        {
          "Source": "Rotten Tomatoes",
          "Value": "73%"
        },
        {
          "Source": "Metacritic",
          "Value": "74/100"
        }
      ],
      "Metascore": "74",
      "imdbRating": "8.7",
      "imdbVotes": "2,097,749",
      "imdbID": "tt0816692",
      "Type": "movie",
      "DVD": "24 May 2016",
      "BoxOffice": "$188,020,017",
      "Production": "N/A",
      "Website": "N/A",
      "Response": "True",
    },
    {
      "Title": "The Matrix",
      "Year": "1999",
      "Rated": "R",
      "Released": "31 Mar 1999",
      "Runtime": "136 min",
      "Genre": "Action, Sci-Fi",
      "Director": "Lana Wachowski, Lilly Wachowski",
      "Writer": "Lilly Wachowski, Lana Wachowski",
      "Actors": "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
      "Plot": "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
      "Language": "English",
      "Country": "United States, Australia",
      "Awards": "Won 4 Oscars. 42 wins & 52 nominations total",
      "Poster": "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
      "Ratings": [
        {
          "Source": "Internet Movie Database",
          "Value": "8.7/10"
        },
        {
          "Source": "Rotten Tomatoes",
          "Value": "83%"
        },
        {
          "Source": "Metacritic",
          "Value": "73/100"
        }
      ],
      "Metascore": "73",
      "imdbRating": "8.7",
      "imdbVotes": "2,045,471",
      "imdbID": "tt0133093",
      "Type": "movie",
      "DVD": "01 Jan 2009",
      "BoxOffice": "$172,076,928",
      "Production": "N/A",
      "Website": "N/A",
      "Response": "True",
    },
    {
      "Title": "Gladiator",
      "Year": "2000",
      "Rated": "R",
      "Released": "05 May 2000",
      "Runtime": "155 min",
      "Genre": "Action, Adventure, Drama",
      "Director": "Ridley Scott",
      "Writer": "David Franzoni, John Logan, William Nicholson",
      "Actors": "Russell Crowe, Joaquin Phoenix, Connie Nielsen",
      "Plot": "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
      "Language": "English",
      "Country": "United States, United Kingdom, Malta, Morocco",
      "Awards": "Won 5 Oscars. 60 wins & 104 nominations total",
      "Poster": "https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
      "Ratings": [
        {
          "Source": "Internet Movie Database",
          "Value": "8.5/10"
        },
        {
          "Source": "Rotten Tomatoes",
          "Value": "79%"
        },
        {
          "Source": "Metacritic",
          "Value": "67/100"
        }
      ],
      "Metascore": "67",
      "imdbRating": "8.5",
      "imdbVotes": "1,617,803",
      "imdbID": "tt0172495",
      "Type": "movie",
      "DVD": "15 Jun 2011",
      "BoxOffice": "$187,705,427",
      "Production": "N/A",
      "Website": "N/A",
      "Response": "True",
    },
    {
      "Title": "The Shawshank Redemption",
      "Year": "1994",
      "Rated": "R",
      "Released": "14 Oct 1994",
      "Runtime": "142 min",
      "Genre": "Drama",
      "Director": "Frank Darabont",
      "Writer": "Stephen King, Frank Darabont",
      "Actors": "Tim Robbins, Morgan Freeman, Bob Gunton",
      "Plot": "Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.",
      "Language": "English",
      "Country": "United States",
      "Awards": "Nominated for 7 Oscars. 21 wins & 42 nominations total",
      "Poster": "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg",
      "Ratings": [
        {
          "Source": "Internet Movie Database",
          "Value": "9.3/10"
        },
        {
          "Source": "Rotten Tomatoes",
          "Value": "89%"
        },
        {
          "Source": "Metacritic",
          "Value": "82/100"
        }
      ],
      "Metascore": "82",
      "imdbRating": "9.3",
      "imdbVotes": "2,879,728",
      "imdbID": "tt0111161",
      "Type": "movie",
      "DVD": "15 Aug 2008",
      "BoxOffice": "$28,767,189",
      "Production": "N/A",
      "Website": "N/A",
      "Response": "True",
    }
  ];

  await db.movies.insertMany(testMovies);
}

resetDatabase().then(() => {
  console.log("Database reset and test data inserted");
  process.exit();
});