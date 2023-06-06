import express from "express";
import { downloadHighres } from "./index.js";
const app = express();

app.get("/:videoId", async (req, res) => {
  const { videoId } = req.params;
  downloadHighres(videoId, res);
});

app.listen(3000, () => {
  console.log("Servidor escutando na porta 3000");
});
