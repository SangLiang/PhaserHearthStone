/**
 * 剩余的卡牌显示
 */

var DataManager = require("./DataManager");

function RemainCard(game) {
	this.heroRemainCard = null;
	this.enemyRemainCard = null;
	this.init(game);
}

RemainCard.prototype.init = function(game){
	this.heroRemainCard = this.setHeroRemainCard(game);
	this.enemyRemainCard = this.setEnemyRemainCard(game);

}

// 设置英雄的剩余卡片提示
RemainCard.prototype.setHeroRemainCard = function(game){
	var image = game.add.image(680,game.world.centerY-160,"card_back");
	image.scale.set(0.3);
	return image
}

// 设置敌人的剩余卡牌提示
RemainCard.prototype.setEnemyRemainCard = function(game){
	var image = game.add.image(680,game.world.centerY+100,"card_back");
	image.scale.set(0.3);
	return image
}

module.exports = RemainCard;