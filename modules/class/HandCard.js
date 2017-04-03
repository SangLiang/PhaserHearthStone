/**
 * 手牌类
 */

var CardGenerater = require("./CardGenerater");
var CardConfig = require("../config/CardConfig");
// var DataManager = require("./DataManager");

function HandCard(game, x, y) {
    this.cardObjList = []; // 手牌对象数组
    this.x = x || 140;
    this.y = y || 20;
    this.init(game);
}

HandCard.prototype.init = function (game) {
    this.buildHandCardObjList(game);
    this.setHandCardList();
    console.log(this);
}

// 构建手牌数组view
HandCard.prototype.buildHandCardObjList = function (game) {
    for (var i = 0; i < 4; i++) {
        var card = game.add.image(this.x + i * 65, this.y, "card_back");
        card.scale.set(0.5);
        this.cardObjList.push(card);
    }
}

// 生成卡牌id数组
HandCard.prototype.setHandCardList = function(){
    var cardGenerater = new CardGenerater();
    var cardIDList = cardGenerater.buildCardList(CardConfig.cardLength,1,CardConfig.card_info.length);
    console.log(cardIDList);
}

module.exports = HandCard;