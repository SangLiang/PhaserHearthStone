/**
 * 英雄的手牌类
 */

var HandCarnd = require("./HandCard");
var utils = require("../Utils");
var CardGenerater = require("./CardGenerater");
var DataManager = require("./DataManager");
var CardConfig = require("../config/CardConfig");

function HeroHandCard(game, x, y) {
    HandCarnd.apply(this, arguments);
	this.setRealHandCard(game); // 设置真实卡面
}

utils.extend(HeroHandCard, HandCarnd);

/*
	@ override 
 */
HeroHandCard.prototype.setHandCardList = function(){
	var cardGenerater = new CardGenerater();

    if(DataManager.heroHandCardIDList.length == 0){
        var cardIDList = cardGenerater.buildCardList(CardConfig.cardLength, 1, CardConfig.card_info.length);
        console.log("玩家没有自定义卡组");
        return cardIDList;
    }else{
        var cardIDList = cardGenerater.buildCardListByUserChoise(CardConfig.cardLength, DataManager.heroHandCardIDList);
        console.log("玩家自定义卡组");
        return cardIDList;
    }
}

module.exports = HeroHandCard;
