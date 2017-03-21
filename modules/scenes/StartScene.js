function StartScene(game) {
    this.preload = function () {
        console.log("im preload");
    }

    this.create = function () {
        var bg = game.add.image(0,0,"background");
    }
}

module.exports = StartScene;