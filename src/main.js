const { app, BrowserWindow,Menu } = require('electron')

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
    win.loadFile('src/index.html')

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplete)
    Menu.setApplicationMenu(mainMenu)

    win.on("closed", () => {
        win = null
    })
}

const mainMenuTemplete = [
    {
        label: "Tap Lap",
        submenu:[
            {
                label:"Add Item1"
            },
            {
                label:"Add Item2"
            },
            {
                label:"Add Item3"
            },
            {
                label:"Quit",
                accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
                click(){
                    app.quit()
                }
            },
            {
                label:"Toggle Dev Tools",
                accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
                click(e){
                    win.toggleDevTools()
                }
            },
            {
                role:"reload"
            },
        ]
    }
]

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

