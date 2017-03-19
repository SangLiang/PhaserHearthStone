var StartScene = require("./modules/scenes/StartScene");
var Preload = require("./modules/Preload");


var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {});

game.state.add("StartScene",StartScene);
game.state.add("Preload", Preload);
game.state.start("StartScene");
