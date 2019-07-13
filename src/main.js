const { app, BrowserWindow } = require('electron')

let win

function createWindow() {
    // ブラウザウインドウを作成
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // そしてこのアプリの index.html をロード
    win.loadFile('index.html')

    win.webContents.openDevTools()

    win.on("closed", () => {
        win = null
    })
}

app.on('ready', createWindow)

app.on("window-all-closed", () => {
    if (process.platform != "darwin") {
        app.quit()
    }
})

app.on("activate", () => {
    if (win == null) {
        createWindow()
    }
})