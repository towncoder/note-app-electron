const fs = require('fs');
const {highlightAuto} = require("./highlight.pack");
const os = require('os');

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
let filePath = homeDir+"/SuiNotes/"
let fileType = ".md"
let fileName = "note"
let file = filePath + fileName + fileType
let input = null

window.onload = function () {
    setTimeout(loadings, 1000);
}

function loadings() {
    initMarked()
    createFile()
    input = document.getElementById('text');
    input.addEventListener("input", onInput)
    loadMd()
    setScrollSync()
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

function loadMd() {
    fs.readFile(file, 'utf8', (error, data) => {
        if (data !== undefined && data !== null) {
            input.value = data
            onInput()
        }
    })
}

function onInput() {
    document.getElementsByClassName('html')[0].innerHTML = marked.parse(input.value)
    saveNote(input);
}

function saveNote() {
    fs.writeFileSync(file, input.value);
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

/**
 * todo 新建笔记
 */
function createFile() {
    // const date = new Date();
    // date.toLocaleDateString('en-GB').split('/').reverse().join('');
    fs.mkdir(filePath, (err) => {
        err ? console.log("本地目录初始化失败："+err) : console.log('本地目录初始化成功')
    })
}








