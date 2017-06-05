/**
 * 战斗日志单例
 */

var ConsoleLog = {};
ConsoleLog.logText = "";

// 记录日志
ConsoleLog.log = function(str) {
    console.log(document);
    var text = document.getElementById("log");
    console.dir(text);
    ConsoleLog.logText = str +"\n</br>"+ ConsoleLog.logText + "\n</br>";
    text.innerHTML = ConsoleLog.logText;
}

// 清除所有日志
ConsoleLog.clean = function(){

}

module.exports = ConsoleLog;