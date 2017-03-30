/**
 * 玩家角色头像
 */
var utils = require("../Utils");
var Head = require("./Head");
function HeroHead(){

}

// HeroHead继承自Head类
utils.extend(HeroHead,Head);

module.exports = HeroHead;

