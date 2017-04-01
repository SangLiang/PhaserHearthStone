/**
 * 手牌类
 */

function HandCard(game, x, y) {
    this.cardObjList = []; // 手牌对象数组
    this.x = x || 140;
    this.y = y || 20;
    this.init(game);
}

HandCard.prototype.init = function (game) {
    this.buildHandCardObjList(game);
    console.log(this);
}

// 构建手牌数组
HandCard.prototype.buildHandCardObjList = function (game) {
    for (var i = 0; i < 4; i++) {
        var card = game.add.image(this.x + i * 65, this.y, "card_back");
        card.scale.set(0.5);
        this.cardObjList.push(card);
    }
}

module.exports = HandCard;