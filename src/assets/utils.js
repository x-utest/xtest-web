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

module.exports = {
    selectElem, queryParser
}