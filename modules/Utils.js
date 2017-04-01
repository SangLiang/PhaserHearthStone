/**
 * 常用函数
 */

var Utils = {
    extend: function (child, parent) {
        var p = parent.prototype;
        var c = child.prototype;
        for (var i in p) {
            c[i] = p[i];
        }
        c.uber = p;
    }
}

module.exports = Utils;