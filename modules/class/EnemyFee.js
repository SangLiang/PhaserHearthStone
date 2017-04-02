var utils = require("../Utils");
var Fee = require("./Fee");

/**
 * 敌人费用管理
 */

function EnemyFee(game, x, y) {
    Fee.apply(this, arguments);
}

utils.extend(EnemyFee, Fee);

module.exports = EnemyFee;