/**
 * 英雄的手牌类
 */

var HandCarnd = require("./HandCard");
var utils = require("../Utils");

function HeroHandCard(game,x,y) {
    HandCarnd.apply(this, arguments);
}

utils.extend(HeroHandCard, HandCarnd);

module.exports = HeroHandCard;
