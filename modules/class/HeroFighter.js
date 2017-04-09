/**
 * Hero战斗随从
 */

var Fighter = require("./Fighter");
var utils = require("../Utils");

function HeroFighter(game){
    Fighter.apply(this,arguments);
}

utils.extend(HeroFighter,Fighter);

module.exports = HeroFighter;

