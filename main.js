var StartScene = require("./modules/scenes/StartScene");
var GameScene = require("./modules/scenes/GameScene");

var game = new Phaser.Game(800, 600, Phaser.AUTO,'mainCanvas', {},true);

game.state.add("StartScene",StartScene);  // 游戏开始场景
game.state.add("GameScene",GameScene);    // 游戏场景
game.state.start("StartScene");
