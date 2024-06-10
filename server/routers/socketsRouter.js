import { Router } from "express";
const router = Router();

router.post("/api/themes", (req, res) => {
  req.session.theme = req.body.theme;
  req.session.save(error => {
    if (error) {
      return res.status(500).send("Failed to save theme to session");
    }
    res.send("Theme saved");
  });
});

export default router;