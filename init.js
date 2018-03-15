const fs = require('fs'),
    readline = require('readline'),
    scaner = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

function config() {
    scaner.question('请设置服务接口完整地址，默认使用http://协议\n例如输入 192.168.1.200:8009\n', answer => {
        if (!answer) {
            console.info('请填写接口的完整地址，');
            return config();
        }
        if (!/^http/i.test(answer)) { answer = 'http://' + answer }
        if (answer[answer.length - 1] != '/') { answer += '/' }
        fs.writeFile('./src/config.js', `var apiHost = '${answer}';
module.exports = {
    apiHost
}`, e => {
                if (!e) {
                    console.log(`设置完成：${answer}`);
                    return scaner.close();
                }
                console.log(`配置文件读写失败，请使用管理员权限重试`);
            });
    });
}
config()

