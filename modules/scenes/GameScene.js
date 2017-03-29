function GameScene(game) {
    this.preload = function () {
        // 加载提示声明
        var loadText = game.add.text(game.world.centerX,game.world.centerY,"Loading ... ",{fill:"#333","fontSize":"28pt"});

        // 锚点设置
        loadText.anchor.set(0.5);

        game.load.image("background","../../resource/background.png");
        game.load.image("card_back","../../resource/card_back.png");
        game.load.image("dead_wing","../../resource/dead_wing.png");
        game.load.image("dead_wing_fight","../../resource/dead_wing_fight.png");
        game.load.image("enemy_turn_button","../../resource/enemy_turn_button.png");
        game.load.image("fee","../../resource/fee.png");
        game.load.image("fighter_hero","../../resource/fighter_hero.png");
        game.load.image("fishman_baby","../../resource/fishman_baby.png");
        game.load.image("fishman_baby_fight","../../resource/fishman_baby_fight.png");
        game.load.image("freshwater_crocodile","../../resource/freshwater_crocodile.png");
        game.load.image("freshwater_crocodile_fight","../../resource/freshwater_crocodile_fight.png");
        game.load.image("hero_turn_button","../../resource/hero_turn_button.png");
        game.load.image("hp_background","../../resource/hp_background.png");
        game.load.image("ogre","../../resource/ogre.png");
        game.load.image("ogre_fight","../../resource/ogre_fight.png");
        
        // 单个文件加载完的回调
        game.load.onFileComplete.add(function(){
            loadText.setText("Loading ... "+arguments[0]);
        });

        // 所有文件加载完成回调
        game.load.onLoadComplete.add(function(){
            console.log(1);
            loadText.destroy();
        });

    }
    this.create = function () {
        game.add.text(100,100,"这是游戏场景",{});
    }
}

module.exports = GameScene;