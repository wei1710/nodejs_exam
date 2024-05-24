import e, { Router } from "express";
import "dotenv/config";
import { getMovie } from "../util/movie/movie.js";
import db from "../database/connection.js";

const router = Router();


//OMDB-API

//-- *********************************** GET ALL MOVIES *********************** --//
router.get("/api/movies", async (req, res) => {
  try {
    const movies = await db.movies.find().toArray();
    res.json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//-- *********************************** Find MOVIES *********************** --//
router.get("/api/movies/", async (req, res) => {
  let { title } = req.query;
  if (!title) {
    return res.status(400).json({ error: "Movie doesn't exist" });
  }

  title = decodeURIComponent(title);

  try {
    const movies = await db.movies.find().toArray();
    const findMovies = movies.filter(movie =>
      movie.title.toLowerCase().includes(title.toLowerCase()));
      res.json(findMovies);
  } catch(error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//-- *********************************** ADD MOVIES *********************** --//
router.post("/api/movies", async (req, res) => {
  const { imdbId } = req.body;
  try {
    // ensure no duplicates movies
    const existingMovie = await db.movies.findOne({ imdbID: imdbId });
    if (existingMovie) {
      return res.status(400).json({ error: "Movie already exists" });
    }

    const movie = await getMovie(imdbId);
    await db.movies.insertOne(movie);

    res.json({ movie });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/api/movies/:title", async (req, res) => {
  let { title } = req.params;
  if (!title) {
    return res.status(400).json({ error: "Movie doesn't exist" });
  }

  title = decodeURIComponent(title);

  try {
    const deleteMovie = await db.movies.deleteOne({ Title: title });
    if (deleteMovie.deletedCount === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json({ message: "Movie deleted succesfully" });
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;