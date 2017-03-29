function GameScene(game) {
    this.preload = function () {

    }
    this.create = function () {
        game.add.text(100,100,"这是游戏场景",{});
    }
}

module.exports = GameScene;