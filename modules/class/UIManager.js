/**
 * UI界面管理
 */

var BackGround = require("./BackGround");
var CardGenerator = require("./CardGenerater");
var HeroHead = require("./HeroHead");
var EnemyHead = require("./EnemyHead");
var DataManager = require("./DataManager");

function UIManager(game) {
    this.backgroundObj = null; // 背景图
    this.heroHeadObj = null; // 本方英雄图像
    this.enemyHeadObj = null; // 敌人英雄头像
    this.heroHandCardObj = null; // 本方英雄手牌
    this.enemyHandCardObj = null; // 敌人英雄手牌
    this.turnOverButton = null; // 回合结束
    this.init(game);
}

UIManager.prototype.init = function (game) {
    this.backgroundObj = this.setBackGround(game);  // 生成背景图

    var card = new CardGenerator();
    card.buildCardList(15, 1, 3);

    this.heroHeadObj = new HeroHead(game, "fighter_hero", 0, 0); // 玩家英雄头像
    this.enemyHeadObj = new EnemyHead(game, "fighter_hero", 0, game.world.height - 140); // 电脑英雄头像

    this.turnOverButton = this.setTurnOverButton(game);
}

// 设置背景
UIManager.prototype.setBackGround = function (game) {
    var background = new BackGround(game);
    return background;
}

// 回合结束
UIManager.prototype.setTurnOverButton = function (game) {
    var button = game.add.image(game.world.width - 150, game.world.centerY - 30, "hero_turn_button");
    button.inputEnabled = true;
    console.log(button);
    button.events.onInputDown.add(function () {
        console.log(1);
        button.loadTexture("enemy_turn_button");
    });

    return button;
}

module.exports = UIManager;