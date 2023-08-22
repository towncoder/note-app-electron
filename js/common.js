function getFormatDate() {
    const date = new Date();
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    const millisecond = date.getMilliseconds()
    // console.log(`${year}${month}${day}${hour}${minute}${second}${millisecond}`);
    return `${year}${month}${day}-${hour}${minute}${second}-${millisecond}`;
}

function isChinese(input) {
    const pattern = /[\u4e00-\u9fa5]/g;
    const chineseChars = input.match(pattern);
    const chineseCount = chineseChars ? chineseChars.length : 0;
    const englishCount = input.replace(pattern, "").length;
    return chineseCount >= englishCount ? "zh-CHS" : "en"
}

function isEnglish(input) {
    const pattern = /[\u4e00-\u9fa5]/g;
    const chineseChars = input.match(pattern);
    const chineseCount = chineseChars ? chineseChars.length : 0;
    const englishCount = input.replace(pattern, "").length;
    return chineseCount >= englishCount ? "en" : "zh-CHS";
}