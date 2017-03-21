function PreLoad(game){
	this.preload = function(){
        game.load.image("attack_icon", "resource/attack_icon.png");
        game.load.image("background","resource/background.png");
        game.load.image("fighter_hero","resource/fighter_hero.png");
        game.load.image("dead_wing","resource/dead_wing.png");
	}

    this.create = function(){
        game.state.start("StartScene");
    }
}

module.exports = PreLoad;