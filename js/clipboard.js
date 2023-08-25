const {ipcRenderer} = require('electron');

window.onload = () => {

    ipcRenderer.on('clipboardValue', (event, variable) => {
        console.log('variable',variable)
        const clipboardBlockElement = document.getElementById("clipboard-block");

        variable.reverse()
        for (const t of variable) {
            const divElement = document.createElement("div");
            divElement.innerHTML = t;
            divElement.className = "clipboard-item"
            clipboardBlockElement.append(divElement)
            divElement.addEventListener("click",()=>{
                copyToClipboard(divElement.innerHTML)
            })
        }
    });
    ipcRenderer.send('getClipboard');

}


function copyToClipboard(content) {
    // 根据不同操作系统选择对应的命令
    const command = os.platform() === 'win32' ? 'clip' : 'pbcopy';
    // 执行命令将内容复制到剪贴板
    execSync(`echo "${content}" | ${command}`);
}