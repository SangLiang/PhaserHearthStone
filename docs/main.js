var StartScene = require("./modules/scenes/StartScene");
var GameScene = require("./modules/scenes/GameScene");
var ResultScene = require("./modules/scenes/ResultScene");
var CardChoiseScene = require("./modules/scenes/CardChoiseScene");

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'mainCanvas', {}, true);

game.state.add("StartScene", StartScene);  // 游戏开始场景
game.state.add("GameScene", GameScene);    // 游戏场景
game.state.add("ResultScene", ResultScene); // 游戏结果场景
game.state.add("CardChoiseScene",CardChoiseScene); // 选择卡片的场景
game.state.start("StartScene");
