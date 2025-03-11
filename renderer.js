const { ipcRenderer } = require("electron");

const audioPlayer = document.getElementById("audioPlayer");
const audioName = document.getElementById("audioName");
const playPauseButton = document.getElementById("playPauseButton");
const nextButton = document.getElementById("nextButton");
const prevButton = document.getElementById("prevButton");
const progressBar = document.getElementById("progressBar");
const playPauseImage = playPauseButton.querySelector("img");

audioPlayer.addEventListener("timeupdate", () => {
    if (audioPlayer.duration) {
        progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    }
});

progressBar.addEventListener("input", () => {
    if (audioPlayer.duration) {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    }
});

ipcRenderer.on("load-cover", (event, filePath) => {
    coverLoader.src = filePath;
    width = 300;
})

ipcRenderer.on("load-track", (event, filePath, songName) => {
    audioPlayer.src = filePath;
    audioPlayer.play();
    audioName.textContent = songName;
});

ipcRenderer.on("toggle-playback", () => {
    if(audioPlayer.paused) {
        audioPlayer.play();
        playPauseImage.src = "graphics/pause.png";
    }
    else {
        audioPlayer.pause();
        playPauseImage.src = "graphics/play.png";
    }
});

playPauseButton.addEventListener("click", () => {
    ipcRenderer.send("play-pause");
});

nextButton.addEventListener("click", () => {
    ipcRenderer.send("next-track");
});

prevButton.addEventListener("click", () => {
    ipcRenderer.send("prev-track");
});