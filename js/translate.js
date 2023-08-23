const https = require('https');
const url = require('url');
const querystring = require('querystring');
const {execSync} = require('child_process');
const os = require('os');
const {ipcRenderer} = require('electron');

const appKey = '5f8543701ad13dfd';
const key = 'aADtvZReiWAT83f7f5f3QmPF04IasS6H';//注意：暴露appSecret，有被盗用造成损失的风险
let requestUrl = "https://openapi.youdao.com/api"

let translateOutput = null
let translateInput = null
let translateOutputCopyBtn = null
window.onload = () => {
    translateOutput = document.getElementById("translate-output")
    translateInput = document.getElementById("translate-input")
    translateInput.addEventListener("input", () => {
        const value = translateInput.value;
        debouncedYouDaoTranslate(value, isChinese(value), isEnglish(value))
    })
    translateOutputCopyBtn = document.getElementById("translate-output-copy");
    initVersion()
}

function initVersion() {
    ipcRenderer.on('versionValue', (event, variable) => {
        document.getElementById("translate-version").innerHTML = variable
    });
    ipcRenderer.send('getVersion');
}

function debounce(func, delay) {
    let timerId;
    return function (...args) {
        clearTimeout(timerId);

        timerId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// 在需要进行防抖的位置调用debouncedYouDaoTranslate方法
const debouncedYouDaoTranslate = debounce(youDaoTranslate, 500);

// function limitTranslate(query, from, to) {
//     debouncedYouDaoTranslate(query, from, to);
// }

// 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
function youDaoTranslate(query, from, to) {
    if (query === "") {
        translateOutput.innerHTML = ""
        return
    }
    // console.log('query,from,to', query, from, to)
    const salt = (new Date).getTime();
    const curtime = Math.round(new Date().getTime() / 1000);
    const str1 = appKey + truncate(query) + salt + curtime + key;
    const sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);

    const parsedUrl = url.parse(requestUrl);
    const params = querystring.stringify({
        q: query,
        appKey: appKey,
        salt: salt,
        from: from,
        to: to,
        sign: sign,
        signType: "v3",
        curtime: curtime,
    });
    const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443, // 使用 URL 中的端口号（如果存在），否则使用默认的 443 端口
        path: parsedUrl.pathname,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    const req = https.request(options, (res) => {
        res.on('data', (data) => {
            const jsonData = JSON.parse(data.toString())
            // console.log('data', jsonData)
            if (jsonData.errorCode === '0') {
                const ans = jsonData.translation;
                translateOutput.innerHTML = ans.join("")
            } else {
                translateOutput.innerHTML = '<span style="color: red">' + jsonData.errorCode + '</span>'
            }
        });
    });

    req.on('error', (error) => {
        console.error(error);
    });
    req.write(params);
    req.end();
}

function truncate(q) {
    const len = q.length;
    if (len <= 20) return q;
    return q.substring(0, 10) + len + q.substring(len - 10, len);
}

function copy() {
    if (translateOutput.innerHTML === "") {
        return
    }
    var originalText = "复制";
    copyToClipboard(translateOutput.innerHTML);
    translateOutputCopyBtn.innerText = "已复制";
    // 延时1秒后恢复原始文本内容
    setTimeout(function () {
        translateOutputCopyBtn.innerText = originalText;
    }, 500);
}


function copyToClipboard(content) {
    // 根据不同操作系统选择对应的命令
    const command = os.platform() === 'win32' ? 'clip' : 'pbcopy';
    // 执行命令将内容复制到剪贴板
    execSync(`echo "${content}" | ${command}`);
}
