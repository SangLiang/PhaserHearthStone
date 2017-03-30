/**
 * 卡组生成器
 */
function CardGenerator() {

}
CardGenerator.prototype.init = function () {

}

// 卡组生成器
// param cardLength [number] 卡组长度
// param minIndex [number] 最小索引
// param maxIndex [number] 最大索引
CardGenerator.prototype.buildCardList = function (cardLength, minIndex, maxIndex) {
    var cardList = [];
    console.log(1);
    for (var i = 0; i < cardLength; i++) {
        var ramdom = Math.floor(Math.random() * maxIndex) + minIndex;
        cardList.push(ramdom);
        console.log(cardList);
    }
    return cardList;
}

module.exports = CardGenerator;