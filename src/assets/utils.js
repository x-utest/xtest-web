function selectElem(el, isCopy) {
    if (document.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(el); range.select();
    }
    else if (window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(el);
        selection.removeAllRanges();
        selection.addRange(range);
        /*if(selection.setBaseAndExtent){ selection.setBaseAndExtent(text, 0, text, 1); }*/
    }
    var r = isCopy ? document.execCommand('copy') : 0;
    return isCopy && r && selection.removeAllRanges(), r
}
function Copy(text) {
    var t = document.createElement('textarea');
    t.value = text;
    t.style.cssText = 'position:fixed;top:-1000px;left:-1000px;width:0;height:0';
    document.body.appendChild(t);
    t.select();
    var r = document.execCommand('copy');
    document.body.removeChild(t);
    return t = null, r
}


function queryParser() {
    var a = (
        location.search.slice(1) ||
        location.hash.slice(location.hash.indexOf("?") + 1)
    ).split("&");
    if (!a.length) return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split("=", 2);
        if (p.length == 1) b[p[0]] = "";
        else b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}
/*
  比较 [数组]、{对象} 结构  的内容相等 
*/
const CtxComparer = {
    /*
        a & b must be Array Type
        Array element can't be repeated !!
        Support any array data type
        Equality is compared by finding exist 
        Result are not affected by sequence
    */
    Array(a, b) {
        if (a.length != b.length) { return }
        var i = -1, l = a.length;
        while (++i < l) {
            if (b.indexOf(a[i]) < 0) { return }
        }
        return 1
    },
    Object(x, y, strict) {
        strict == !!strict;
        var a = Object.keys(x), b = Object.keys(y);
        if (a.length != b.length) { return }
        var k, i = -1, l = a.length;
        while (++i < l) {
            if (b.indexOf((k = a[i])) < 0) { return }
            let [m, n] = [x[k], y[k]];
            if (strict ? m !== n : m != n) { return }
        }
        return 1
    }
};

module.exports = {
    selectElem,Copy, queryParser, CtxComparer
}