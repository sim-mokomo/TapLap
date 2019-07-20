const { app, BrowserWindow,Menu,Tray } = require('electron')
let win
const windowHeiht = 800
const windowWidth = 500

function createWindow() {
    // ブラウザウインドウを作成
    win = new BrowserWindow({
        width: windowWidth,
        height: windowHeiht,
        maxWidth:windowWidth,
        maxHeight:windowHeiht,
        minWidth: windowWidth,
        minHeight: windowHeiht,
        frame:false,
        titleBarStyle: "hidden",
        darkTheme: true,
        backgroundColor: "#232323",
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

let tray = null
app.on('ready', () => {
    createWindow()
    tray = new Tray("assets/img/sunTemplate.png")
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Item3', type: 'radio', checked: true },
        { label: 'Item4', type: 'radio' }
    ])
    tray.setToolTip("this is my application")
    tray.setContextMenu(contextMenu)
})

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

