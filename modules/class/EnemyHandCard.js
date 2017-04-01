/**
 * 英雄的手牌类
 */

var HandCarnd = require("./HandCard");
var utils = require("../Utils");

function EnemyHandCard(game) {
    HandCarnd.apply(this, arguments);
}

utils.extend(EnemyHandCard, HandCarnd);

module.exports = EnemyHandCard;
