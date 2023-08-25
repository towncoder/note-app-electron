const fs = require('fs');
const {highlightAuto} = require("./highlight.pack");
const os = require("os")
const { ipcRenderer } = require('electron');

// nodejs 定时任务
// const schedule = require("node-schedule");
// const rule = new schedule.RecurrenceRule();
// const times = [11, 31, 51];
// rule.second = times;
// schedule.scheduleJob(rule, function () {
// saveNote(document.getElementById('text').value);
// });

// /Users/libiao
let homeDir = os.userInfo().homedir
let rootPath = homeDir + "/SuiNotes"
let noteFilePath = rootPath + "/Notes/"
let cacheFilePath = rootPath + "/Cache/"

let mdFileType = ".md"
let cacheFileName = "cache"
let readingFileName = ""
let readingFileNameKey = "readingFileName"
let cacheFile = cacheFilePath + cacheFileName + mdFileType

let readingCache = {}

let input = null
let output = null
let noteList = null

let noteListShow = false;

window.onload = function () {
    setTimeout(loadings, 500);
}

function loadings() {
    fixWinPath()
    initVersion()
    initMarked()
    initDirectory()
    initEditor()
    initMenu()
}

function fixWinPath(){
    if (process.platform==="win32"){
        noteFilePath = noteFilePath.replaceAll("/","\\");
        cacheFilePath = cacheFilePath.replaceAll("/","\\");
        console.log('noteFilePath_cacheFilePath',noteFilePath,cacheFilePath)
    }
}

function initVersion(){
    ipcRenderer.on('versionValue', (event, variable) => {
        document.getElementById("version").innerHTML = variable
    });
    ipcRenderer.send('getVersion');
}

function initMarked() {
    const rendererMD = new marked.Renderer();
    marked.setOptions({
        renderer: rendererMD,
        gfm: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        highlight: function (code) {
            const preCode = highlightAuto(code).value;
            return `<pre class="code"'><code>${preCode}</code></pre>`
        }
    });
}

function initDirectory() {
    if (!fs.existsSync(rootPath)) {
        fs.mkdirSync(rootPath)
    }
    if (!fs.existsSync(noteFilePath)) {
        fs.mkdirSync(noteFilePath)
    }
    if (!fs.existsSync(cacheFilePath)) {
        fs.mkdirSync(cacheFilePath)
    }
    if (!fs.existsSync(cacheFile)) {
        // 只创建文件
        fs.writeFileSync(cacheFile, "")
    }
}

function markedText() {
    output.innerHTML = marked.parse(input.value)
}

function initEditor() {
    input = document.getElementById('text');
    output = document.getElementsByClassName('html')[0]
    input.addEventListener("input", () => {
        markedText();
        saveNote(input);
    })
    loadMd()
    setScrollSync()
}

function initMenu() {
    initNoteList();
}

function initNoteList() {
    noteList = document.getElementById("note-list");
    noteList.style.display = "none"
}

function loadMd() {
    // 先读缓存
    if (readingFileName === "") {
        const data = fs.readFileSync(cacheFile, 'utf8');
        if (data === "") {
            newReadingCache(getFormatDate())
            saveNote()  // 创建文件的作用
        } else {
            readingFileName = JSON.parse(data)[readingFileNameKey]
        }
    }
    input.value = fs.readFileSync(noteFilePath + readingFileName + mdFileType, 'utf8')
    markedText()
}


function saveNote() {
    fs.writeFileSync(noteFilePath + readingFileName + mdFileType, input.value);
}

function refreshPage(noteName) {
    saveNote()
    clearEditor();
    newReadingCache(noteName)
}

function clearNoteList() {
    while (noteList.childNodes.length > 0) {
        noteList.removeChild(noteList.lastChild)
    }
}

function getListNote() {
    clearNoteList()
    const noteArray = fs.readdirSync(noteFilePath, 'utf8');
    for (const note of noteArray) {
        const buttonElement = document.createElement("div");
        const noteName = note.split(".")[0];
        let className = "note-list-btn";
        if (noteName === readingFileName) {
            className = className.concat(" note-list-btn-reading")
        }
        buttonElement.innerHTML = noteName
        buttonElement.className = className
        buttonElement.addEventListener("click", () => {
            if (noteName === readingFileName) {
                return
            }
            refreshPage(noteName);
            loadMd()
            clickListNote()
        })
        noteList.append(buttonElement)
    }
}

function newReadingCache(noteName) {
    readingFileName = noteName;
    readingCache[readingFileNameKey] = readingFileName
    writeCacheFile(JSON.stringify(readingCache))
}

function clearEditor() {
    input.value = ""
    output.innerHTML = ""
}

function addNote() {
    refreshPage(getFormatDate())
    saveNote()
}

function clickListNote() {
    if (noteListShow === false) {
        getListNote()
        noteList.style.display = "block"
        noteListShow = true;
    } else {
        noteList.style.display = "none"
        noteListShow = false;
    }
}

function setScrollSync() {
    const l = document.getElementById('text')
    const r = document.getElementsByClassName('html')[0]
    // 记录目前鼠标位于左右哪个区域 1：左；2：右
    let currentTab = 0

    l.addEventListener('scroll', () => {
        if (currentTab !== 1) return
        r.scrollTop = l.scrollTop * (r.scrollHeight / l.scrollHeight)
        if (l.scrollTop + l.offsetHeight === l.scrollHeight) {
            r.scrollTop = r.scrollHeight - r.offsetHeight
        }
    })
    r.addEventListener('scroll', () => {
        if (currentTab !== 2) return
        l.scrollTop = r.scrollTop / (r.scrollHeight / l.scrollHeight)
        if (r.scrollTop + r.offsetHeight === r.scrollHeight) {
            l.scrollTop = l.scrollHeight - l.offsetHeight
        }
    })

    l.addEventListener('mouseover', () => {
        currentTab = 1
    })
    r.addEventListener('mouseover', () => {
        currentTab = 2
    })
}

function writeCacheFile(cache) {
    // cache = '{"readingFileName":"' + readingFileName + '"}';
    fs.writeFileSync(cacheFile, cache)
}











