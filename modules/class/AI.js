/**
 * 电脑AI
 */
var DataManager = require("./DataManager");

function AI() {

}

// 出牌
AI.prototype.shotCard = function () {
    console.log(1111111);
    this.choiseCard();
}

// 选择手牌
AI.prototype.choiseCard = function () {
    for (var i = 0; i < DataManager.enemyHandCard.cardViewList.length; i++) {
        console.log(DataManager.enemyHandCard.cardViewList[i]);
    }
}

// 选择要攻击的目标
AI.prototype.choiseAttackTarget = function () { }

module.exports = AI;