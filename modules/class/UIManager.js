/**
 * UI界面管理
 */

var BackGround = require("./BackGround");
var CardGenerator = require("./CardGenerater");

function UIManager(game){
    this.backgroundObj = null; // 背景图
    this.heroHeadObj = null; // 本方英雄图像
    this.enemyHeadObj = null; // 敌人英雄头像
    this.heroHandCardObj = null; // 本方英雄手牌
    this.enemyHandCardObj = null; // 敌人英雄手牌
    this.init(game);
}

UIManager.prototype.init = function(game){
    this.backgroundObj = this.setBackGround(game);
    var card = new CardGenerator();
    card.buildCardList(15,1,3);
}

// 设置背景
UIManager.prototype.setBackGround = function(game){
     var background = new BackGround(game);
     return background;
}

module.exports = UIManager;