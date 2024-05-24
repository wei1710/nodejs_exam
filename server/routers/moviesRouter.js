import { Router } from "express";
import "dotenv/config";
import { getMovie } from "../util/movie/movie.js";

const router = Router();


//OMDB-API

//-- *********************************** GET ALL MOVIES *********************** --//
router.get("/movies")

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