/**
 * Created by 张瑞年 on 2017/4/17.
 * Addon   by 济公   at 6/1/2017 PM
 */
function formatTime(str) {
    if (!str) return ''
    var date = new Date(str)
    var time = new Date().getTime() - date.getTime() //现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
    if (time < 0) {
        return ''
    }
    else if ((time / 1000 < 30)) {
        return '刚刚'
    }
    else if (time / 1000 < 60) {
        return parseInt((time / 1000)) + '秒前'
    }
    else if ((time / 60000) < 60) {
        return parseInt((time / 60000)) + '分钟前'
    }
    else if ((time / 3600000) < 24) {
        return parseInt(time / 3600000) + '小时前'
    }
    else if ((time / 86400000) < 31) {
        return parseInt(time / 86400000) + '天前'
    }
    else if ((time / 2592000000) < 12) {
        return parseInt(time / 2592000000) + '月前'
    }
    return parseInt(time / 31536000000) + '年前'
}
function currency(str) {
    return str + "$"
}

function SliceString(str, len) {
    len = -(len || 5);
    return str.slice(len)
}
function fixString(str, len) {
    len = len || 10;
    return str.substr(0, len)//+(str.length>len+1?'...':'')
}
function Numberdecimal(num) {
    return num.toFixed(2)
}

function BeijingTime(str, ifnul) {
    function parseDate(s) {
        var a = s.split(' '), b = a[0].split('-'), c = a[1].split(':');
        return new Date(b[0], b[1]-1, b[2], c[0], c[1], c[2])
    }
    var d, a = s => s < 10 ? '0' + s : s;
    if (!str || !((d = parseDate(str)).getDate() > -1)) { return ifnul || '-' }
    d.setHours(d.getHours() - ~~(d.getTimezoneOffset() / 60));
    return [d.getFullYear(), 1 + d.getMonth(), d.getDate()].map(a).join('-') + ' ' + [d.getHours(), d.getMinutes(), d.getSeconds()].map(a).join(':')
}
export default {
    formatTime,
    currency,
    SliceString,
    fixString,
    Numberdecimal,
    BeijingTime
}


