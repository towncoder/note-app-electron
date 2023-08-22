const {app, BrowserWindow, globalShortcut} = require('electron')

let win = null
let winStatus = false
const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 650,
        // frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    win.hide()
    win.on('closed', function () {
        win = null
    })
}
app.dock.hide()

function loadHtml(fileName) {
    // 获取当前页面的URL
    const currentURL = win.webContents.getURL();
    const html = currentURL.split("/").pop();
    if (html !== fileName) {
        win.loadFile(fileName).then(() => {
            // 开启浏览器调试模式
            // win.webContents.openDevTools()
        })
    }
    if (winStatus === false) {
        win.show()
        winStatus = true
    } else {
        win.hide()
        winStatus = false
    }
}

app.whenReady().then(() => {
    createWindow()
    globalShortcut.register('Alt+N', () => {
        loadHtml("index.html");
    })
    globalShortcut.register('Alt+T', () => {
        loadHtml("translate.html");
    })

    app.on('will-quit', () => {
        globalShortcut.unregisterAll()
    })
})

// 关闭窗口后是否退出
// app.on('window-all-closed', function () {
//     if (process.platform !== 'darwin') {
//         app.quit()
//     }
// })

// app.on('activate', function () {
//     if (BrowserWindow.getAllWindows().length === 0) {
//         createWindow()
//     }
// })