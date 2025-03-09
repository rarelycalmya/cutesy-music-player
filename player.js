const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow;
let audioFiles = [];
let coverFiles = [];
let currentTrackIndex = 0;

app.whenReady().then(() => {
    let mainWindow = new BrowserWindow({
        width: 450,
        height: 650,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true,
    });

    mainWindow.loadFile("index.html");

    const audioDir = path.join(__dirname, "audio");
    mainWindow.webContents.once("did-finish-load", () => {
        fs.readdir(audioDir, (err, files) => {
            if(err) {
                console.error("Error", err);
                return;
            }

            audioFiles = files;
            if (files.length > 0) {
                const song = path.join("audio", files[currentTrackIndex]);
                const songName = path.parse(audioFiles[currentTrackIndex]).name;
                mainWindow.webContents.send("load-track", song, songName);
            } else {
                console.error("No audio files found in the folder.");
            }
        });
    });

    const coverDir = path.join(__dirname, "songCover");
    mainWindow.webContents.once("did-finish-load", () => {
        fs.readdir(coverDir, (err, covers) => {
            if(err) {
                console.error("Error", err);
                return;
            }
            
            coverFiles = covers;
            if (covers.length > 0) {
                const cover = path.join("songCover", covers[currentTrackIndex]); 
                mainWindow.webContents.send("load-cover", cover);
            } else {
                console.error("No cover found.");
            }
        });
    });

    ipcMain.on("play-pause", (event) => {
        mainWindow.webContents.send("toggle-playback");
    });

    ipcMain.on("next-track", (event) => {
        if (audioFiles.length > 0) {
            currentTrackIndex = (currentTrackIndex + 1) % audioFiles.length;
            const songName = path.parse(audioFiles[currentTrackIndex]).name;
            mainWindow.webContents.send("load-track", path.join("audio", audioFiles[currentTrackIndex]), songName);
            mainWindow.webContents.send("load-cover", path.join("songCover", coverFiles[currentTrackIndex]));
        }
    });

    ipcMain.on("prev-track", (event) => {
        if (audioFiles.length > 0) {
            currentTrackIndex = (currentTrackIndex - 1 + audioFiles.length) % audioFiles.length;
            const songName = path.parse(audioFiles[currentTrackIndex]).name;
            mainWindow.webContents.send("load-track", path.join("audio", audioFiles[currentTrackIndex]), songName);
            mainWindow.webContents.send("load-cover", path.join("songCover", coverFiles[currentTrackIndex]));
        }
    });
});
