import express from "express";
import youtube from "./index.js";
const app = express();

app.get("/:videoId", async (req, res) => {
  const { videoId } = req.params;
  youtube.downloadHighres(videoId, res);
});

app.listen(process.env.PORT ? Number(process.env.PORT) : 3000, () => {
  console.log("Servidor iniciado na porta 3000");
});
