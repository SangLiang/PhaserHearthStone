/**
 * UI界面管理
 */

var BackGround = require("./BackGround");
var HeroHead = require("./HeroHead");
var EnemyHead = require("./EnemyHead");
var DataManager = require("./DataManager");
var HeroHandCard = require("./HeroHandCard");
var EnemyHandCard = require("./EnemyHandCard");
var HeroFee = require("./HeroFee");
var EnemyFee = require("./EnemyFee");

function UIManager(game) {
    this.backgroundObj = null; // 背景图
    this.heroHeadObj = null; // 本方英雄图像
    this.enemyHeadObj = null; // 敌人英雄头像
    this.heroHandCardObj = null; // 本方英雄手牌
    this.enemyHandCardObj = null; // 敌人英雄手牌
    this.turnOverButton = null; // 回合结束
    this.shotCardButton = null; // 出牌按钮
    this.heroFeeObj = null; // 玩家费用管理
    this.enemyFeeObj = null;
    this.init(game);
}

UIManager.prototype.init = function (game) {
    this.backgroundObj = this.setBackGround(game);  // 生成背景图

    // var card = new CardGenerator();
    // card.buildCardList(15, 1, 3);

    this.heroHeadObj = new HeroHead(game, "fighter_hero", 0, 0); // 生成玩家英雄头像
    this.enemyHeadObj = new EnemyHead(game, "fighter_hero", 0, game.world.height - 140); // 生成电脑英雄头像

    this.turnOverButton = this.setTurnOverButton(game); // 设置回合结束按钮

    this.enemyHandCardObj = new EnemyHandCard(game); // 设置敌人手牌
    this.heroHandCardObj = new HeroHandCard(game, null, game.world.height - 120); // 设置玩家手牌

    this.shotCardButton = this.setShotCardButton(game); // 设置出牌按钮

    this.heroFeeObj = new HeroFee(game, game.world.width - 110, game.world.centerY - 90); // 英雄费用管理
    this.enemyFeeObj = new EnemyFee(game, game.world.width - 110, game.world.centerY + 42); // 敌人费用管理
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
    button.events.onInputDown.add(function () {
        if (DataManager.turn == 0) {
            button.loadTexture("enemy_turn_button");
            DataManager.turn = 1;
        } 
        // else if (DataManager.turn == 1) {
        //     button.loadTexture("hero_turn_button");
        //     DataManager.turn = 0;
        // }

    });

    return button;
}

// 出牌按钮
UIManager.prototype.setShotCardButton = function (game) {
    var shot = game.add.image(80, game.world.centerY - 10, "shot_card");
    shot.anchor.set(0.5);
    shot.inputEnabled = true;
    shot.events.onInputDown.add(function () {
        console.log("我出牌了");
    });
    return shot;
}
module.exports = UIManager;