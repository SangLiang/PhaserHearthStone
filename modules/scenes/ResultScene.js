/**
 *  游戏结果场景
 */

var DataManager = require("../class/DataManager");

function ResultScene(game) {
    this.create = function () {
        if (DataManager.result == 0) {
            var text = game.add.text(game.world.centerX, game.world.centerY, "You Loss", {
                fill: "#000",
            });

            text.anchor.set(0.5);

        } else {
            var text = game.add.text(game.world.centerX, game.world.centerY, "You Win", {
                fill: "#000",
                fontSize: "30pt"
            });
            text.anchor.set(0.5);
        }
    }
}

module.exports = ResultScene;