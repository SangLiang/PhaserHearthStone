/**
 * 敌人的战场随从
 */

var utils = require("../Utils");
var Fighter = require("./Fighter");

function EnemyFighter(game) {
    Fighter.apply(this, arguments);
    this.y = game.world.centerY - 130;

}

utils.extend(EnemyFighter, Fighter);

module.exports = EnemyFighter;