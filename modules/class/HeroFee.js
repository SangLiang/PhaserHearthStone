/**
 * 玩家水晶管理
 */

var Fee = require("./Fee");
var utils = require("../Utils");

function HeroFee(game) {
    Fee.apply(this, arguments);
}

utils.extend(HeroFee, Fee);

module.exports = HeroFee;
