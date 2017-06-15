/**
 * 卡组生成器
 */

function CardGenerator() {}

// 卡组生成器
// @param cardLength [number] 卡组最大的长度
// @param minIndex [number] 最小索引
// @param maxIndex [number] 最大索引
// @return cardList [array] 卡牌id生成数组
CardGenerator.prototype.buildCardList = function(cardLength, minIndex, maxIndex) {
    var cardList = [];
    for (var i = 0; i < cardLength; i++) {
        var ramdom = Math.floor(Math.random() * maxIndex) + minIndex;
        cardList.push(ramdom);
    }
    return cardList;
}

// 通过玩家选择的卡片来生成完整卡组
// @param cardLength [number] 卡组最大的长度
// @param cardIndexList [obj array] 选择的卡组信息
CardGenerator.prototype.buildCardListByUserChoise = function(cardLength , cardInfoList){
	// console.log(cardInfoList);

	var tempList = [];
	var cardList = [];
	for(var i = 0; i < cardInfoList.length; i++){

		tempList.push(cardInfoList[i].id);
	}

	var _length = tempList.length;

	for(var j = 0; j < cardLength; j++){
		var _ramdom = Math.floor(Math.random() * _length);
		cardList.push(tempList[_ramdom]);
	}

	return cardList;
}

module.exports = CardGenerator;