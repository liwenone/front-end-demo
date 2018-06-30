const header = `# front-end-demo
前端日常练习

序号 | 名称 | 关键词  | 时间 | 在线预览
---|---| --- | --- | --- |
%s`;

const readme1 = `%s | [%s](https://github.com/lwvoid/front-end-demo/tree/master/%s)| %s | %s | [预览](https://lwvoid.github.io/front-end-demo/%s/)
`;
const readme2 = `## screenshot

![image](https://github.com/lwvoid/front-end-demo/blob/master/%s/screenshot.png)`;

String.prototype.format = String.prototype.format || function() {
    let result = this;
    let argArr = Array.prototype.splice.call(arguments, 0);
    for (let i = 0; i < argArr.length; i++) {
        result = result.replace(/%s/, argArr[i]);
    }
    return result;
};

const path = require('path');
const fs = require('fs');

let strArr = [];
let i = 1;
let fileList = fs.readdirSync(__dirname);
for (let f of fileList) {
    if (!f.match(/\./)) {
        let curDirPath = path.resolve(__dirname, f);
        let indexPath = path.resolve(curDirPath, 'index.html')
        let readmePath = path.resolve(curDirPath, 'README.md');

        let keywordRegExp = /<meta http-equiv="keyword" content="(.*)?">/;
        let titleRegExp = /<title>(.*)?<\/title>/;

        let content = fs.readFileSync(indexPath, 'utf-8');
        let keyword = content.match(keywordRegExp)[1];
        let title = content.match(titleRegExp)[1];

        let str = readme2.format(f);
        fs.writeFileSync(readmePath, str);

        let time = f.split('-')[0].replace(/(\d{4})(\d{2})(\d{2})/, '$2-$3-$1');
        let lineStr = readme1.format(i++, title, f, keyword, time, f);
        strArr.push(lineStr);
    }
}

// let content = header.format(strArr.reverse().join(''));
// let curReadmePath = path.resolve(__dirname, 'README.md')
// fs.writeFileSync(curReadmePath, content);