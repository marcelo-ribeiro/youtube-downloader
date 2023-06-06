import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import ytdl from "ytdl-core";

// Configure a API key
// const apiKey = "AIzaSyCQ7CkvvqOdJ09Q8tca74VYCh5rseramKM";

const videoUrl = `https://www.youtube.com/watch?v=`;

function downloadLowres(videoId, res) {
  const videoOutputPath = `files/video-${videoId}.mp4`;
  const url = videoUrl + videoId;

  ytdl(url, { quality: "399" })
    .pipe(fs.createWriteStream(videoOutputPath))
    .on("finish", () => {
      console.log("Download completo!");
      res.download(mergedOutputPath, `${videoId}.mp4`, (error) => {
        if (error) {
          console.error("Erro ao fazer o download:", error);
          res.status(500).send("Erro ao fazer o download do arquivo.");
        }
        // Após o download, exclua os arquivos temporários
        fs.unlinkSync(videoOutputPath);
      });
    })
    .on("error", (error) => {
      console.error("Ocorreu um erro durante o download:", error);
    });
}

// Baixa o arquivo de vídeo com áudio em formato MP4
function downloadHighres(videoId, res) {
  const url = videoUrl + videoId;
  const audioOutputPath = `files/audio-${videoId}.mp4`;
  const videoOutputPath = `files/video-${videoId}.mp4`;
  const mergedOutputPath = `files/${videoId}.mp4`;

  // Mescla o vídeo e o áudio usando o ffmpeg
  function mergeVideoAndAudio() {
    console.log("Mesclagem de vídeo e áudio iniciada!");
    ffmpeg()
      .input(videoOutputPath)
      .input(audioOutputPath)
      .outputOptions("-c:v copy")
      .outputOptions("-c:a aac")
      .output(mergedOutputPath)
      .on("end", () => {
        console.log("Mesclagem de vídeo e áudio concluída!");
        res.download(mergedOutputPath, `${videoId}.mp4`, (error) => {
          if (error) {
            console.error("Erro ao fazer o download:", error);
            res.status(500).send("Erro ao fazer o download do arquivo.");
          }
          // Após o download, exclua os arquivos temporários
          unlinkFiles();
        });
      })
      .on("error", (error) => {
        console.error("Ocorreu um erro durante a mesclagem:", error);
      })
      .run();
  }

  // Baixa o arquivo de vídeo em formato MP4
  function downloadVideo() {
    console.log("Download de vídeo inciado!");
    ytdl(url, { filter: "videoonly" })
      .pipe(fs.createWriteStream(videoOutputPath))
      .on("finish", () => {
        console.log("Download de vídeo completo!");
        mergeVideoAndAudio();
      })
      .on("error", (error) => {
        console.error("Ocorreu um erro durante o download de vídeo:", error);
      });
  }

  // Baixa o arquivo de áudio em formato MP4
  function downloadAudio() {
    console.log("Download de áudio inciado!");
    ytdl(url, {
      filter: "audioonly",
      audioQuality: "AUDIO_QUALITY_MEDIUM",
    })
      .pipe(fs.createWriteStream(audioOutputPath))
      .on("finish", () => {
        console.log("Download de áudio completo!");
        downloadVideo();
      })
      .on("error", (error) => {
        console.error("Ocorreu um erro durante o download de áudio:", error);
      });
  }

  // Após o download, exclua os arquivos temporários
  function unlinkFiles() {
    fs.unlinkSync(audioOutputPath);
    fs.unlinkSync(videoOutputPath);
    fs.unlinkSync(mergedOutputPath);
  }

  function init() {
    downloadAudio();
  }

  init();
}

// downloadLowres();
// downloadHighres();

const youtube = { downloadHighres, downloadLowres };
export default youtube;
