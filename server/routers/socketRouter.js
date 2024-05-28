import { Router } from "express";
const router = Router();

router.post("/api/theme", (req, res) => {
  req.session.theme = req.body.theme;
  req.session.save();
  
  res.send("Theme saved");
});

export default router;