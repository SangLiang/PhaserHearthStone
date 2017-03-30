/**
 * 角色头像类
 */

function Head(game){
	this.headObj = null;
	this.init(game);
}

Head.prototype.init = function(game){
	this.headObj = this.setPic(game);
}

Head.prototype.setPic = function(game){
	var pic = game.add.image(0,0,"fighter_hero");
	return pic;
}

module.exports = Head;