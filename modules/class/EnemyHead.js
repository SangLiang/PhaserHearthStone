/**
 * 敌人头像
 */
 
var utils = require("../Utils");
var Head = require("./Head");

function EnemyHead(game,textureName,positionX,positionY){
    Head.apply(this,arguments);
}

utils.extend(EnemyHead,Head);

module.exports = EnemyHead;
