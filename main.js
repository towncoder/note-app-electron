const {app, BrowserWindow, globalShortcut} = require('electron')

let win = null
let winStatus = false
const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 650,
        // frame: false,
        webPreferences:{
            nodeIntegration:true,
            contextIsolation: false
        }
    })
    // 开启浏览器调试模式
    win.webContents.openDevTools()
    win.loadFile('index.html').then(() => {})
    win.hide()
}
app.dock.hide()
app.whenReady().then(() => {
    globalShortcut.register('Alt+N', () => {
        if (winStatus === false) {
            win.show()
            winStatus = true
        } else {
            win.hide()
            winStatus = false
        }
    })
}).then(createWindow)