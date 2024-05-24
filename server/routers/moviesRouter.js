import e, { Router } from "express";
import "dotenv/config";
import { getMovie } from "../util/movie/movie.js";
import db from "../database/connection.js";

const router = Router();


//OMDB-API

//-- *********************************** GET ALL MOVIES *********************** --//
router.get("/movies", async (req, res) => {
  try {
    const movies = await db.movies.find().toArray();
    res.json(movies);
  } catch(error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Server error" });
  }
});

//-- *********************************** Find MOVIES *********************** --//
router.get("/movies/search", )

//-- *********************************** ADD MOVIES *********************** --//
router.post("/movies", async (req, res) => {
  const { imdbId } = req.body;
  try {
    const movie = await getMovie(imdbId);
    res.json(movie);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;