/**
 * 手牌类
 */

var CardGenerater = require("./CardGenerater");
var CardConfig = require("../config/CardConfig");
var DataManager = require("./DataManager");

function HandCard(game, x, y) {
    this.cardObjList = []; // 手牌对象数组
    this.cardViewList = []; // 手牌视图数组
    this.cardIDList = [];
    this.x = x || 140;
    this.y = y || 20;
    this.init(game);
}

HandCard.prototype.init = function(game) {
    this.cardIDList = this.setHandCardList();
    // this.buildHandCardViewList(game); // 设置卡背
    // this.setRealHandCard(game); // 真实卡面
}

// 构建手牌数组view  (卡背)
HandCard.prototype.buildHandCardViewList = function(game) {
    // 截取卡组中的前四张
    var _list = this.cardIDList.splice(0, 4);

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < CardConfig.card_info.length; j++) {

            if (_list[i] == CardConfig.card_info[j].id) {
                var card = game.add.image(this.x + i * 70, this.y, "card_back");

                // 设置相应的数据
                card.cardInfo = {};
                card.cardInfo.HP = CardConfig.card_info[j].hp; // 血量
                card.cardInfo.attack = CardConfig.card_info[j].attack; // 攻击力
                card.cardInfo.cnName = CardConfig.card_info[j].cn_name; // 中文名称
                card.cardInfo.fee = CardConfig.card_info[j].fee; // 召唤费用
                card.cardInfo.fight = CardConfig.card_info[j].fight; // 战斗图片
                card.cardInfo.cardType = CardConfig.card_info[j].type; // 卡牌类型
                card.scale.set(0.5);
                this.cardViewList.push(card);
            }
        }
    }
}

// 设置卡牌的数据显示 (卡面)
HandCard.prototype.setRealHandCard = function(game) {
    var _list = this.cardIDList.splice(0, 4);

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < CardConfig.card_info.length; j++) {
            if (_list[i] == CardConfig.card_info[j].id) {
                var card = game.add.image(this.x + i * 75, this.y, CardConfig.card_info[j].name);
                card.cardInfo = {};
                card.cardInfo.HP = CardConfig.card_info[j].hp; // 血量
                card.cardInfo.attack = CardConfig.card_info[j].attack; // 攻击力
                card.cardInfo.cnName = CardConfig.card_info[j].cn_name; // 中文名称
                card.cardInfo.fee = CardConfig.card_info[j].fee; // 召唤费用
                card.cardInfo.fight = CardConfig.card_info[j].fight; // 战斗图片
                card.cardInfo.cardType = CardConfig.card_info[j].type; // 卡牌类型
                card.scale.set(0.5);

                this.cardObjList.push(card);

                card.inputEnabled = true;
                card.events.onInputDown.add(function() {
                    this.inputEnabled = false; // 禁止玩家不停点击
                    if (DataManager.heroChoiseCard == null) {
                        DataManager.heroChoiseCard = this;
                    } else {
                        // 注册动画事件
                        var tween = game.add.tween(DataManager.heroChoiseCard).to({
                            y: DataManager.heroChoiseCard.y + 20
                        }, 200, "Linear", true);
                        DataManager.heroChoiseCard.inputEnabled = true;

                        var tweenScale = game.add.tween(DataManager.heroChoiseCard.scale).to({
                            x: 0.5,
                            y: 0.5
                        }, 200, "Linear");
                        // 执行动画
                        tween.start();
                        tweenScale.start();
                        DataManager.heroChoiseCard = this;
                    }

                    var tween = game.add.tween(this).to({
                        y: this.y - 20
                    }, 200, "Linear", true);

                    var tweenScale = game.add.tween(DataManager.heroChoiseCard.scale).to({
                        x: 0.65,
                        y: 0.65
                    }, 200, "Linear");
                    DataManager.heroChoiseCard.index = 100;

                    // 将所点击的卡牌移动到最顶端
                    game.world.bringToTop(DataManager.heroChoiseCard);
                    tween.start();
                    tweenScale.start();

                    tween.onComplete.add(function() {});
                }, card);
            }
        }
    }
}

// 回合开始时的补牌逻辑
HandCard.prototype.addCard = function(game) {
    var _cardList = this.cardIDList.splice(0, 1);

    if (this.cardObjList.length >= 8) {
        alert("你的手牌已达到上限，当前到的卡牌被销毁");
        return;
    }

    for (var j = 0; j < CardConfig.card_info.length; j++) {
        if (_cardList[0] == CardConfig.card_info[j].id) {
            var card = game.add.image(this.x + (this.cardObjList.length) * 75, this.y, CardConfig.card_info[j].name);
            card.cardInfo = {};
            card.cardInfo.HP = CardConfig.card_info[j].hp; // 血量
            card.cardInfo.attack = CardConfig.card_info[j].attack; // 攻击力
            card.cardInfo.cnName = CardConfig.card_info[j].cn_name; // 中文名称
            card.cardInfo.fee = CardConfig.card_info[j].fee; // 召唤费用
            card.cardInfo.fight = CardConfig.card_info[j].fight; // 战斗图片
            card.cardInfo.cardType = CardConfig.card_info[j].type; // 卡牌类型
            card.scale.set(0.5);

            this.cardObjList.push(card);

            card.inputEnabled = true;
            card.events.onInputDown.add(function() {
                this.inputEnabled = false; // 禁止玩家不停点击
                if (DataManager.heroChoiseCard == null) {
                    DataManager.heroChoiseCard = this;
                } else {
                    // 注册动画事件
                    var tween = game.add.tween(DataManager.heroChoiseCard).to({
                        y: DataManager.heroChoiseCard.y + 20
                    }, 200, "Linear", true);
                    var tweenScale = game.add.tween(DataManager.heroChoiseCard.scale).to({
                        x: 0.5,
                        y: 0.5
                    }, 200, "Linear");
                    DataManager.heroChoiseCard.inputEnabled = true;
                    // 执行动画
                    tween.start();
                    tweenScale.start();
                    DataManager.heroChoiseCard = this;
                }

                var tween = game.add.tween(this).to({
                    y: this.y - 20
                }, 200, "Linear", true);
                var tweenScale = game.add.tween(DataManager.heroChoiseCard.scale).to({
                    x: 0.65,
                    y: 0.65
                }, 200, "Linear");

                // 将所点击的卡牌移动到最顶端
                game.world.bringToTop(DataManager.heroChoiseCard);
                tween.start();

                tweenScale.start();
                tween.onComplete.add(function() {});
            }, card);
        }
    }
}

// 重新对手牌排序
HandCard.prototype.reListHandCard = function() {
    var self = this;
    var _temp = [];
    if (self.cardObjList.length == 0) { // 没有手牌的情况
        return;
    } else {
        for (var i = 0; i < self.cardObjList.length; i++) {
            if (self.cardObjList[i].alive == true) { // 清除掉已经销毁了的手牌
                _temp.push(self.cardObjList[i]);
            }
        }
        self.cardObjList = _temp;

        for (var j = 0; j < self.cardObjList.length; j++) { // 重新对手牌排序
            self.cardObjList[j].x = self.x + j * 75;
        }
    }
}

/**
 *  生成卡牌id数组
 * @return {array} 卡组的id数组
 */
HandCard.prototype.setHandCardList = function() {
    var cardGenerater = new CardGenerater();

    var cardIDList = cardGenerater.buildCardList(CardConfig.cardLength, 1, CardConfig.card_info.length);
    return cardIDList;
}

// 通过id构建真实手牌
module.exports = HandCard;