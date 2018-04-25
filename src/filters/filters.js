const Time = {
    from(a) {
        if (!a) { return }
        var type = typeof a;
        if (type === 'string') {
            /*  2010-01-12 09:10:11   */
            var ts = a.replace(/-/g, ':').replace(/\s+/g, ':').split(':').filter(x => x).map(x => +x);
            --ts[1];  //js Date 月份从0开始
            return new Date(...ts)
        }
        if (type === 'object' && a.constructor === Date) { return a }
    },
    toString(a) {
        function pad0(s) {
            return s < 10 ? '0' + s : s
        }
        var t = this.from(a);
        if (!t) { return }
        return [t.getFullYear(), 1 + t.getMonth(), t.getDate()].map(pad0).join('-') + ' ' + [t.getHours(), t.getMinutes(), t.getSeconds()].map(pad0).join(':')
    },
    diff(from, to) {
        var t1 = this.from(from), t2 = this.from(to) || new Date;
        if (!t1) { return }
        var diff = t2.getTime() - t1.getTime(),
            verb = diff > 0 ? '前' : '后';
        diff = diff < 0 ? -diff : diff;
        if (diff / 1000 < 30) { return '刚刚' }
        else if (diff / 1000 < 60) {
            return parseInt((diff / 1000)) + '秒' + verb
        }
        else if ((diff / 60000) < 60) {
            return parseInt((diff / 60000)) + '分钟' + verb
        }
        else if ((diff / 3600000) < 24) {
            return parseInt(diff / 3600000) + '小时' + verb
        }
        else if ((diff / 86400000) < 31) {
            return parseInt(diff / 86400000) + '天' + verb
        }
        else if ((diff / 2592000000) < 12) {
            return parseInt(diff / 2592000000) + '月' + verb
        }
        return parseInt(diff / 31536000000) + '年' + verb
    }
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
        return new Date(b[0], b[1] - 1, b[2], c[0], c[1], c[2])
    }
    var d, a = s => s < 10 ? '0' + s : s;
    if (!str || !((d = parseDate(str)).getDate() > -1)) { return ifnul || '-' }
    d.setHours(d.getHours() - ~~(d.getTimezoneOffset() / 60));
    return [d.getFullYear(), 1 + d.getMonth(), d.getDate()].map(a).join('-') + ' ' + [d.getHours(), d.getMinutes(), d.getSeconds()].map(a).join(':')
}



export default {
    Time,
    currency,
    SliceString,
    fixString,
    Numberdecimal,
    BeijingTime
}


