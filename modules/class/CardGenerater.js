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
	var tempList = [];
	var cardList = [];

	for(var i = 0; i < cardInfoList.length; i++){
        var _obj = {};
        _obj.quality =  cardInfoList[i].quality;
        _obj.id = cardInfoList[i].id;

        tempList.push(_obj);
	}

	var _length = tempList.length;

	for(var j = 0; j < cardLength; j++){
		var _ramdom = Math.floor(Math.random() * _length);

		for (var k = 0; k < cardList.length; k ++){

            if(cardList.length == 0){
                continue;
            }else{

                if(!tempList[_ramdom] || !cardList[k]){
                    // if(!cardList[k]){
                    //     var random = Math.floor(Math.random() * _length);
                    //     cardList[k] = tempList[random];
                    // }
                    continue;
                }

                //判断是否含有质量为3的卡牌
                if(cardList[k].quality == tempList[_ramdom].quality && cardList[k].id == tempList[_ramdom].id && tempList[_ramdom].quality == 3){

                    tempList.splice(_ramdom,1);
                    console.log(tempList);
                    console.log(_random);
                    _ramdom = Math.floor(Math.random() * _length);
                    break;

                }
            }
        }
        cardList.push(tempList[_ramdom]);
    }

    // console.log(cardList);
    // console.log('--------templist-------');
    // console.log(tempList);
    // console.log('-----------------------');
    for(var m = 0; m <cardLength; m ++){
        if(cardList[m] == undefined){
            var _random = Math.floor(Math.random() * tempList.length);
            cardList[m] = tempList[_random];

        }
    }
    // console.log("-----card list---");
    // console.log(cardList);
    // console.log('-----------------');

    var resultList = [];

    for(var n = 0; n< cardList.length; n++){
        resultList.push(cardList[n].id);
    }

    console.log(resultList);
	return resultList;
}

module.exports = CardGenerator;