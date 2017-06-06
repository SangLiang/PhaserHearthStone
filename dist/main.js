(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
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

}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_aa16b170.js","/")
},{"./modules/scenes/CardChoiseScene":23,"./modules/scenes/GameScene":24,"./modules/scenes/ResultScene":25,"./modules/scenes/StartScene":26,"Zbi7gb":28,"buffer":29}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 常用函数
 */

var Utils = {
    // 继承
    extend: function (child, parent) {
        var p = parent.prototype;
        var c = child.prototype;
        for (var i in p) {
            c[i] = p[i];
        }
        c.uber = p;
    },

    getChildByKey: function (parent, key) {
        var _child = [];
        for (var i = 0; i < parent.children; i++) {
            if (parent.children[i].key == key) {
                _child.push(parent.children[i]);
            }
        }

        if (_child.length == 0) {
            console.warn("没有在匹配的key: " + key);
        } else if (_child.length == 1) {
            return _child[0];
        } else if (_child.length > 1) {
            return _child;
        }
    }
}

module.exports = Utils;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\Utils.js","/modules")
},{"Zbi7gb":28,"buffer":29}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 电脑AI
 */
var DataManager = require("./DataManager");
var EnemyFighter = require("./EnemyFighter");
var ConsoleLog = require("./ConsoleLog");

function AI() {
    this.enemyChoise = null;
}

// 出牌
AI.prototype.shotCard = function (game) {
    this.enemyChoise = this.choiseCard();
    DataManager.turn = 0;

    if (!this.enemyChoise) {
        // 没有合适的卡牌
        DataManager.turnOverButton.loadTexture("hero_turn_button");
        // alert("敌人选择不出牌,不知道有什么阴谋诡计");
        ConsoleLog.log("敌人选择不出牌,不知道有什么阴谋诡计");

        return;
    }

    try {
        if (DataManager.enemyFighters.fightObj.length >= 5) {
            DataManager.turnOverButton.loadTexture("hero_turn_button");
            // alert("敌人选择不出牌,不知道有什么阴谋诡计");
            ConsoleLog.log("敌人选择不出牌,不知道有什么阴谋诡计");
            
            return;
        }
    } catch (e) {

    }

    console.log(this.enemyChoise.cardInfo);

    if (this.enemyChoise.cardInfo.cardType == "magic") {
        console.log("敌人的魔法拍");
    } else if (this.enemyChoise.cardInfo.cardType == "entourage") {
        if (DataManager.enemyFighters == null) {
            DataManager.enemyFighters = new EnemyFighter(game);
            DataManager.enemyFighters.buildFighter(game, this.enemyChoise.cardInfo.HP, this.enemyChoise.cardInfo.attack, this.enemyChoise.cardInfo.cnName, this.enemyChoise.cardInfo.fight);
        } else {
            DataManager.enemyFighters.buildFighter(game, this.enemyChoise.cardInfo.HP, this.enemyChoise.cardInfo.attack, this.enemyChoise.cardInfo.cnName, this.enemyChoise.cardInfo.fight);
        }
    }

    this.enemyChoise.destroy();
    DataManager.enemyHandCard.reListHandCard();
    this.enemyChoise = null;

    DataManager.turnOverButton.loadTexture("hero_turn_button");
}

// 选择手牌
AI.prototype.choiseCard = function () {
    var shotList = [];
    var _fee = parseInt(DataManager.enemyFee.feeObj.text.split("/")[0]);

    for (var i = 0; i < DataManager.enemyHandCard.cardViewList.length; i++) {
        if (_fee >= DataManager.enemyHandCard.cardViewList[i].cardInfo.fee) {
            // 只要费用允许，就放入可出的牌之中
            shotList.push(DataManager.enemyHandCard.cardViewList[i]);
        }
    }

    if (shotList.length >= 1) {
        // 返回左手第一张牌
        return shotList[0];
    }
}

// 选择要攻击的目标
AI.prototype.choiseAttackTarget = function (game) {
    // 敌人没有随从
    if (!DataManager.enemyFighters || DataManager.enemyFighters.fightObj.length == 0) {
        return;
    }

    if (DataManager.heroFighters == null) { // 判断玩家的随从是否存在
        for (var i = 0; i < DataManager.enemyFighters.fightObj.length; i++) {
            if (DataManager.enemyFighters.fightObj[i].sleep == false) {
                var _str = "敌人的" + DataManager.enemyFighters.fightObj[i].cnName + "攻击了你的英雄";
                // alert("敌人的" + DataManager.enemyFighters.fightObj[i].cnName + "攻击了你的英雄");
                ConsoleLog.log(_str);
                
                // 更新攻击之后的状态
                DataManager.enemyFighters.fightObj[i].sleep = true;
                DataManager.enemyFighters.fightObj[i].alpha = 0.7;
                DataManager.heroHead.HPObj.setText(parseInt(DataManager.heroHead.HPObj.text) - DataManager.enemyFighters.fightObj[i].attack);

                if (parseInt(DataManager.heroHead.HPObj.text) <= 0) {
                    DataManager.result = 0;
                    alert("敌人获取了胜利，玩家阵亡");
                    game.state.start("ResultScene");
                    return;
                }
            }
        }
    } else {

        var _heroFightersAttack = 0;
        var _enemyFightersAttack = 0;

        // 计算电脑AI的场攻
        for (var j = 0; j < DataManager.enemyFighters.fightObj.length; j++) {
            _enemyFightersAttack += DataManager.enemyFighters.fightObj[j].attack;
        }

        // 计算玩家战场上的场攻
        for (var k = 0; k < DataManager.heroFighters.fightObj.length; k++) {
            _heroFightersAttack += DataManager.heroFighters.fightObj[k].attack;
        }

        var _destroyList = [];
        for (var i = 0; i < DataManager.enemyFighters.fightObj.length; i++) {
            if (DataManager.enemyFighters.fightObj[i].sleep == false) {
                console.log("attack");

                // 如果电脑的随从总场攻大于玩家的所有随从的总场攻
                var case_1 = _enemyFightersAttack >= _heroFightersAttack;

                // 如果电脑的随从总场攻足矣杀死玩家
                var case_2 = _enemyFightersAttack >= parseInt(DataManager.heroHead.HPObj.text);

                if (case_1 || case_2) { // AI场攻大于玩家随从的场攻
                    // alert("敌人的" + DataManager.enemyFighters.fightObj[i].cnName + "攻击了你的英雄");
                    var _str = "敌人的" + DataManager.enemyFighters.fightObj[i].cnName + "攻击了你的英雄";
                    ConsoleLog.log(_str);

                    // 更新攻击之后的状态
                    DataManager.enemyFighters.fightObj[i].sleep = true;
                    DataManager.enemyFighters.fightObj[i].alpha = 0.7;
                    DataManager.heroHead.HPObj.setText(parseInt(DataManager.heroHead.HPObj.text) - DataManager.enemyFighters.fightObj[i].attack);

                    if (parseInt(DataManager.heroHead.HPObj.text) <= 0) {
                        DataManager.result = 0;
                        alert("敌人获取了胜利，玩家阵亡");
                        game.state.start("ResultScene");
                        return;
                    }

                } else if(!case_1){
                    // AI场攻小于玩家场攻则攻击随从
                    // alert("敌方的" + DataManager.enemyFighters.fightObj[i].cnName + "攻击了我方的" + DataManager.heroFighters.fightObj[0].cnName);

                    var _str = "敌方的" + DataManager.enemyFighters.fightObj[i].cnName + "攻击了我方的" + DataManager.heroFighters.fightObj[0].cnName;
                    ConsoleLog.log(_str);
                    
                    var _heroFightHP = DataManager.enemyFighters.fightObj[i].hp - DataManager.heroFighters.fightObj[0].attack;
                    var _enemyFightHP = DataManager.heroFighters.fightObj[0].hp - DataManager.enemyFighters.fightObj[i].attack;

                    // 更新玩家的随从的hp
                    DataManager.enemyFighters.fightObj[i].hp = _heroFightHP;
                    DataManager.enemyFighters.fightObj[i].alpha = 0.7;
                    DataManager.enemyFighters.fightObj[i].sleep = true;
                    DataManager.enemyFighters.fightObj[i].children[2].alpha = 0;
                    DataManager.enemyFighters.fightObj[i].children[1].setText(_heroFightHP);

                    // 更新敌人的玩家的hp
                    DataManager.heroFighters.fightObj[0].hp = _enemyFightHP;
                    DataManager.heroFighters.fightObj[0].children[1].setText(_enemyFightHP);

                    if (_heroFightHP <= 0) {
                        _destroyList.push(DataManager.enemyFighters.fightObj[i]);
                    }

                    if (_enemyFightHP <= 0) {
                        DataManager.heroFighters.fightObj[0].destroy();
                        DataManager.heroFighters.reListObjs();
                    }
                }
            }
        }

        for (var n = 0; n < _destroyList.length; n++) {
            _destroyList[n].destroy();
        }
        DataManager.enemyFighters.reListObjs();
    }
}

module.exports = AI;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\AI.js","/modules\\class")
},{"./ConsoleLog":6,"./DataManager":7,"./EnemyFighter":9,"Zbi7gb":28,"buffer":29}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 背景类
 */

function BackGround(game) {
    this.picObj = null;
    this.init(game);
}

BackGround.prototype.init = function (game) {
    this.picObj = this.setPic(game);

}

BackGround.prototype.setPic = function (game) {
    var background = game.add.image(0, 0, "background");
    return background;
}

module.exports = BackGround;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\BackGround.js","/modules\\class")
},{"Zbi7gb":28,"buffer":29}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 卡组生成器
 */

function CardGenerator() {}

// 卡组生成器
// @param cardLength [number] 卡组最大的长度
// @param minIndex [number] 最小索引
// @param maxIndex [number] 最大索引
// @return cardList [array] 卡牌id生成数组
CardGenerator.prototype.buildCardList = function(cardLength, minIndex, maxIndex) {
    var cardList = [];
    for (var i = 0; i < cardLength; i++) {
        var ramdom = Math.floor(Math.random() * maxIndex) + minIndex;
        cardList.push(ramdom);
    }
    return cardList;
}

// 通过玩家选择的卡片来生成完整卡组
// @param cardLength [number] 卡组最大的长度
// @param cardIndexList [obj array] 选择的卡组信息
CardGenerator.prototype.buildCardListByUserChoise = function(cardLength , cardInfoList){
	console.log(cardInfoList);

	var tempList = [];
	var cardList = [];
	for(var i = 0; i < cardInfoList.length; i++){

		tempList.push(cardInfoList[i].id);
	}

	var _length = tempList.length;

	for(var j = 0; j < cardLength; j++){
		var _ramdom = Math.floor(Math.random() * _length);
		cardList.push(tempList[_ramdom]);
	}

	return cardList;
}

module.exports = CardGenerator;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\CardGenerater.js","/modules\\class")
},{"Zbi7gb":28,"buffer":29}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 战斗日志单例
 */

var ConsoleLog = {};
ConsoleLog.logText = "";

// 记录日志
ConsoleLog.log = function(str) {
    var text = document.getElementById("log");
    ConsoleLog.logText = str +"\n</br>"+ ConsoleLog.logText + "\n</br>";
    text.innerHTML = ConsoleLog.logText;
}

// todo:清除所有日志
ConsoleLog.clean = function(){

}

module.exports = ConsoleLog;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\ConsoleLog.js","/modules\\class")
},{"Zbi7gb":28,"buffer":29}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 游戏数据管理类
 */

var DataManager = {
	turn: 0,                 // 0代表自己回合,1代表敌人回合 
	fee: 1,                  // 初始化费用，和游戏回合相关
	AI: null,

	heroChoiseCard: null,    // 英雄选择的卡牌
	heroFighters: null,      // 英雄随从
	heroHandCard: null,      // 英雄手牌
	heroFee: null,           // 英雄的费用
	heroHead: null,          // 英雄头像
	heroFighterChoise: null, // 战斗随从的选择
	heroCurrentFee: 1,       // 玩家当前费用

	enemyHandCard: null,     // 敌人手牌 
	enemyFee: null,          // 敌人的费用
	enemyHead: null,         // 敌人的头像
	enemyFighters: null,     // 敌人战场的随从
	enemyCurrentFee: 1,      // 敌人当前费用

	remainCard:null,
	turnOverButton: null,    // 回合结束的按钮
	result:0,                // 0 代表玩家失败，1代表玩家胜利

	heroHandCardIDList:[]    // 用户所选择的卡牌数组

}

module.exports = DataManager;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\DataManager.js","/modules\\class")
},{"Zbi7gb":28,"buffer":29}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var utils = require("../Utils");
var Fee = require("./Fee");

/**
 * 敌人费用管理
 */

function EnemyFee(game, x, y) {
    Fee.apply(this, arguments);
}

utils.extend(EnemyFee, Fee);

module.exports = EnemyFee;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\EnemyFee.js","/modules\\class")
},{"../Utils":2,"./Fee":12,"Zbi7gb":28,"buffer":29}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 敌人的战场随从
 */
var DataManager = require("./DataManager");
var utils = require("../Utils");
var Fighter = require("./Fighter");
var ConsoleLog = require("./ConsoleLog");

function EnemyFighter(game) {
    Fighter.apply(this, arguments);
    this.y = game.world.centerY - 130;

}

utils.extend(EnemyFighter, Fighter);

// @override
// 在玩家选择敌方随从时进行战斗结算
EnemyFighter.prototype.choiceFighter = function (fightBg) {
    if (DataManager.heroFighterChoise == null) {
        return;
    }
    else {

        // alert("我方的" + DataManager.heroFighterChoise.cnName + "攻击了敌人的" + fightBg.cnName);
        var _str = "我方的" + DataManager.heroFighterChoise.cnName + "攻击了敌人的" + fightBg.cnName;
        ConsoleLog.log(_str);
        var _heroFightHP = DataManager.heroFighterChoise.hp - fightBg.attack;
        var _enemyFightHP = fightBg.hp - DataManager.heroFighterChoise.attack;

        // 更新玩家的随从的hp
        DataManager.heroFighterChoise.hp = _heroFightHP;
        DataManager.heroFighterChoise.alpha = 0.7;
        DataManager.heroFighterChoise.sleep = true;
        DataManager.heroFighterChoise.children[2].alpha = 0;
        DataManager.heroFighterChoise.children[1].setText(_heroFightHP);

        // 更新敌人的玩家的hp
        fightBg.hp = _enemyFightHP;
        fightBg.children[1].setText(_enemyFightHP);

        if (_heroFightHP <= 0) {
            DataManager.heroFighterChoise.destroy();
            DataManager.heroFighters.reListObjs();
        }

        if (_enemyFightHP <= 0) {
            fightBg.destroy();
            DataManager.enemyFighters.reListObjs();
        }

        DataManager.heroFighterChoise = null;
        
    }
}

module.exports = EnemyFighter;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\EnemyFighter.js","/modules\\class")
},{"../Utils":2,"./ConsoleLog":6,"./DataManager":7,"./Fighter":13,"Zbi7gb":28,"buffer":29}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 敌人的手牌类
 */

var HandCarnd = require("./HandCard");
var utils = require("../Utils");
var CardConfig = require("../config/CardConfig");

function EnemyHandCard(game) {
    HandCarnd.apply(this, arguments);
    // this.setRealHandCard(game); // 真实卡面
    this.buildHandCardViewList(game); // 设置卡背

}

utils.extend(EnemyHandCard, HandCarnd);

// @override  
// 重写relistHandCard方法
EnemyHandCard.prototype.reListHandCard = function () {
    var self = this;
    var _temp = [];
    // console.log(self.cardViewList);

    if (self.cardViewList.length == 0) { // 没有手牌的情况
        return;
    } else {
        for (var i = 0; i < self.cardViewList.length; i++) {
            if (self.cardViewList[i].alive == true) { // 清除掉已经销毁了的手牌
                _temp.push(self.cardViewList[i]);
            }
        }
        self.cardViewList = _temp;

        for (var j = 0; j < self.cardViewList.length; j++) { // 重新对手牌排序
            self.cardViewList[j].x = self.x + j * 70;
        }
    }
}

// @override 
// 重写回合开始时的补牌逻辑
EnemyHandCard.prototype.addCard = function (game) {
    var _cardList = this.cardIDList.splice(0, 1);

    if (this.cardViewList.length >= 8) {
        alert("敌人已达到上限，当前到的卡牌被销毁");
        return;
    }

    for (var j = 0; j < CardConfig.card_info.length; j++) {

        if (_cardList[0] == CardConfig.card_info[j].id) {
            var card = game.add.image(this.x + this.cardViewList.length * 70, this.y, "card_back");

            // 设置相应的数据
            card.cardInfo = {};
            card.cardInfo.HP = CardConfig.card_info[j].hp; // 血量
            card.cardInfo.attack = CardConfig.card_info[j].attack; // 攻击力
            card.cardInfo.cnName = CardConfig.card_info[j].cn_name; // 中文名称
            card.cardInfo.fee = CardConfig.card_info[j].fee; // 召唤费用
            card.cardInfo.fight = CardConfig.card_info[j].fight; // 战斗图片
            card.cardInfo.cardType = CardConfig.card_info[j].type; // 卡牌类型
            card.scale.set(0.5);
            this.cardViewList.push(card);
        }
    }
}

module.exports = EnemyHandCard;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\EnemyHandCard.js","/modules\\class")
},{"../Utils":2,"../config/CardConfig":22,"./HandCard":14,"Zbi7gb":28,"buffer":29}],11:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 敌人头像
 */

var utils = require("../Utils");
var Head = require("./Head");
var DataManager = require("./DataManager");
var ConsoleLog = require("./ConsoleLog");

function EnemyHead(game, textureName, positionX, positionY) {
    Head.apply(this, arguments);
}

// 设置敌人头像
// @override重写setPic
Head.prototype.setPic = function (game) {
    var pic = game.add.image(0, 0, this.textureName);

    pic.inputEnabled = true;
    pic.events.onInputDown.add(function () {
        if (DataManager.heroFighterChoise == null) {
            return;
        }

        else {
            var _hp = parseInt(this.HPObj.text) - DataManager.heroFighterChoise.attack;
            this.HPObj.setText(_hp);

            DataManager.heroFighterChoise.alpha = 0.7;
            DataManager.heroFighterChoise.sleep = true;
            DataManager.heroFighterChoise.children[2].alpha = 0;

            // alert("我方的" + DataManager.heroFighterChoise.cnName + "攻击了敌人英雄");
            var _str = "我方的" + DataManager.heroFighterChoise.cnName + "攻击了敌人英雄";
            ConsoleLog.log(_str);
            DataManager.heroFighterChoise = null;

            if (parseInt(this.HPObj.text) <= 0) {
                alert("玩家获取胜利，敌人阵亡");
                // ConsoleLog.log("玩家获取胜利，敌人阵亡");
                DataManager.result = 1;
                game.state.start("ResultScene");
            }
        }

    }, this);

    return pic;
}

utils.extend(EnemyHead, Head);

module.exports = EnemyHead;

}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\EnemyHead.js","/modules\\class")
},{"../Utils":2,"./ConsoleLog":6,"./DataManager":7,"./Head":15,"Zbi7gb":28,"buffer":29}],12:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 费用管理类
 */

function Fee(game, x, y) {
    this.feeObj = null;
    this.x = x || game.world.width - 30;
    this.y = y || 0;
    this.init(game);
}

Fee.prototype.init = function (game) {
    this.feeObj = this.setFeePic(game);
}

// 设置Fee背景以及文字
Fee.prototype.setFeePic = function (game) {
    var fee = game.add.image(this.x, this.y, "fee");
    var text = game.add.text(60, 28, "1/1", { fill: "#fff", fontSize: "18pt" });
    text.anchor.set(0.5);
    fee.addChild(text);
    return text;
}

module.exports = Fee;

}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\Fee.js","/modules\\class")
},{"Zbi7gb":28,"buffer":29}],13:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 战斗元素类
 * @param game 
 * @param x [number] 初始化的
 */

var DataManager = require("./DataManager");

function Fighter(game) {
    this.fightObj = []; // 战斗随从数组
    this.x = 150;
    this.y = game.world.centerY + 30;
}

Fighter.prototype.init = function (game) {
}

// 生成战斗随从
Fighter.prototype.buildFighter = function (game, hp, attack, cnName, picName) {
    var fightBg = game.add.image(this.x, this.y, picName);

    fightBg.hp = hp;
    fightBg.attack = attack;
    fightBg.cnName = cnName;
    fightBg.picName = picName;
    fightBg.sleep = true; // 休眠状态，在出牌的第一回合无法进行攻击
    
    var _style = {
        fill: "#fff",
        fontSize: "12pt"
    }
    // 设置生命值
    var hp_text = game.add.text(75, 105, hp, _style);
    hp_text.anchor.set(0.5);
    hp_text.key = "hp";

    // 设置
    var attack_text = game.add.text(17, 105, attack, _style);
    attack_text.anchor.set(0.5);
    attack_text.key = "attack";

    var attack_tag = game.add.image(48, -15, "attack_icon");
    attack_tag.key = "attack_tag";
    attack_tag.scale.set(0.5);
    attack_tag.anchor.set(0.5);
    attack_tag.alpha = 0;

    fightBg.addChild(attack_text);
    fightBg.addChild(hp_text);
    fightBg.addChild(attack_tag);
    fightBg.alpha = 0.7; // sleep状态无法攻击
    this.fightObj.push(fightBg);
    this.reListObjs();

    fightBg.inputEnabled = true;
    fightBg.events.onInputDown.add(function () {
        this.choiceFighter(fightBg);
    }, this);

}

Fighter.prototype.reListObjs = function () {
    if (this.fightObj.length == 0) {
        // 如果随从的队列为空，不进行排序
        return;
    } else {
        var _temp= [];

        for(var j = 0; j<this.fightObj.length;j++){
            if(this.fightObj[j].alive == true){
                _temp.push(this.fightObj[j]);
            }
        }

        this.fightObj = _temp;

        // 重排战斗随从的数组
        for (var i = 0; i < this.fightObj.length; i++) {
            this.fightObj[i].x = this.x + i * 95;
        }
    }
}

Fighter.prototype.awakeFighter = function () {
    if (this.fightObj.length == 0) {
        return;
    }
    else {
        for (var i = 0; i < this.fightObj.length; i++) {
            this.fightObj[i].sleep = false; // 解除睡眠状态
            this.fightObj[i].alpha = 1; // 解除睡眠状态后的view

        }
    }
}

Fighter.prototype.choiceFighter = function (fightBg) {
    if (fightBg.sleep == true) {
        alert("本回合无法操作该随从！");
    }

    else {
        for (var i = 0; i < this.fightObj.length; i++) {
            this.fightObj[i].children[2].alpha = 0;
        }
        fightBg.children[2].alpha = 1;
        DataManager.heroFighterChoise = fightBg;
    }
}

module.exports = Fighter;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\Fighter.js","/modules\\class")
},{"./DataManager":7,"Zbi7gb":28,"buffer":29}],14:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 手牌类
 */

var CardGenerater = require("./CardGenerater");
var CardConfig = require("../config/CardConfig");
var DataManager = require("./DataManager");

function HandCard(game, x, y) {
    this.cardObjList = []; // 手牌对象数组
    this.cardViewList = []; // 手牌视图数组
    this.cardIDList = [];
    this.x = x || 140;
    this.y = y || 20;
    this.init(game);
}

HandCard.prototype.init = function (game) {
    this.cardIDList = this.setHandCardList();
    // this.buildHandCardViewList(game); // 设置卡背
    // this.setRealHandCard(game); // 真实卡面
}

// 构建手牌数组view  (卡背)
HandCard.prototype.buildHandCardViewList = function (game) {
    // 截取卡组中的前四张
    var _list = this.cardIDList.splice(0, 4);

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < CardConfig.card_info.length; j++) {

            if (_list[i] == CardConfig.card_info[j].id) {
                var card = game.add.image(this.x + i * 70, this.y, "card_back");

                // 设置相应的数据
                card.cardInfo = {};
                card.cardInfo.HP = CardConfig.card_info[j].hp; // 血量
                card.cardInfo.attack = CardConfig.card_info[j].attack; // 攻击力
                card.cardInfo.cnName = CardConfig.card_info[j].cn_name; // 中文名称
                card.cardInfo.fee = CardConfig.card_info[j].fee; // 召唤费用
                card.cardInfo.fight = CardConfig.card_info[j].fight; // 战斗图片
                card.cardInfo.cardType = CardConfig.card_info[j].type; // 卡牌类型
                card.scale.set(0.5);
                this.cardViewList.push(card);
            }
        }
    }
}

// 设置卡牌的数据显示 (卡面)
HandCard.prototype.setRealHandCard = function (game) {
    var _list = this.cardIDList.splice(0, 4);

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < CardConfig.card_info.length; j++) {
            if (_list[i] == CardConfig.card_info[j].id) {
                var card = game.add.image(this.x + i * 75, this.y, CardConfig.card_info[j].name);
                card.cardInfo = {};
                card.cardInfo.HP = CardConfig.card_info[j].hp; // 血量
                card.cardInfo.attack = CardConfig.card_info[j].attack; // 攻击力
                card.cardInfo.cnName = CardConfig.card_info[j].cn_name; // 中文名称
                card.cardInfo.fee = CardConfig.card_info[j].fee; // 召唤费用
                card.cardInfo.fight = CardConfig.card_info[j].fight; // 战斗图片
                card.cardInfo.cardType = CardConfig.card_info[j].type; // 卡牌类型
                card.scale.set(0.5);

                this.cardObjList.push(card);

                card.inputEnabled = true;
                card.events.onInputDown.add(function () {
                    this.inputEnabled = false; // 禁止玩家不停点击
                    if (DataManager.heroChoiseCard == null) {
                        DataManager.heroChoiseCard = this;
                    } else {
                        // 注册动画事件
                        var tween = game.add.tween(DataManager.heroChoiseCard).to({ y: DataManager.heroChoiseCard.y + 20 }, 200, "Linear", true);
                        DataManager.heroChoiseCard.inputEnabled = true;
                        // 执行动画
                        tween.start();
                        DataManager.heroChoiseCard = this;
                    }

                    var tween = game.add.tween(this).to({ y: this.y - 20 }, 200, "Linear", true);
                    tween.start();
                    tween.onComplete.add(function () {
                    });
                }, card);
            }
        }
    }
}

// 回合开始时的补牌逻辑
HandCard.prototype.addCard = function (game) {
    var _cardList = this.cardIDList.splice(0, 1);

    if (this.cardObjList.length >= 8) {
        alert("你的手牌已达到上限，当前到的卡牌被销毁");
        return;
    }

    for (var j = 0; j < CardConfig.card_info.length; j++) {
        if (_cardList[0] == CardConfig.card_info[j].id) {
            var card = game.add.image(this.x + (this.cardObjList.length) * 75, this.y, CardConfig.card_info[j].name);
            card.cardInfo = {};
            card.cardInfo.HP = CardConfig.card_info[j].hp; // 血量
            card.cardInfo.attack = CardConfig.card_info[j].attack; // 攻击力
            card.cardInfo.cnName = CardConfig.card_info[j].cn_name; // 中文名称
            card.cardInfo.fee = CardConfig.card_info[j].fee; // 召唤费用
            card.cardInfo.fight = CardConfig.card_info[j].fight; // 战斗图片
            card.cardInfo.cardType = CardConfig.card_info[j].type;// 卡牌类型
            card.scale.set(0.5);

            this.cardObjList.push(card);

            card.inputEnabled = true;
            card.events.onInputDown.add(function () {
                this.inputEnabled = false; // 禁止玩家不停点击
                if (DataManager.heroChoiseCard == null) {
                    DataManager.heroChoiseCard = this;
                } else { 
                    // 注册动画事件
                    var tween = game.add.tween(DataManager.heroChoiseCard).to({ y: DataManager.heroChoiseCard.y + 20 }, 200, "Linear", true);
                    DataManager.heroChoiseCard.inputEnabled = true;
                    // 执行动画
                    tween.start();
                    DataManager.heroChoiseCard = this;
                }

                var tween = game.add.tween(this).to({ y: this.y - 20 }, 200, "Linear", true);
                tween.start();
                tween.onComplete.add(function () {
                });
            }, card);
        }
    }
}

// 重新对手牌排序
HandCard.prototype.reListHandCard = function () {
    var self = this;
    var _temp = [];
    if (self.cardObjList.length == 0) { // 没有手牌的情况
        return;
    } else {
        for (var i = 0; i < self.cardObjList.length; i++) {
            if (self.cardObjList[i].alive == true) { // 清除掉已经销毁了的手牌
                _temp.push(self.cardObjList[i]);
            }
        }
        self.cardObjList = _temp;

        for (var j = 0; j < self.cardObjList.length; j++) { // 重新对手牌排序
            self.cardObjList[j].x = self.x + j * 75;
        }
    }
}

/**
 *  生成卡牌id数组
 * @return {array} 卡组的id数组
 */
HandCard.prototype.setHandCardList = function () {
    var cardGenerater = new CardGenerater(); 

    var cardIDList = cardGenerater.buildCardList(CardConfig.cardLength, 1, CardConfig.card_info.length);
    return cardIDList;
}

// 通过id构建真实手牌
module.exports = HandCard;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\HandCard.js","/modules\\class")
},{"../config/CardConfig":22,"./CardGenerater":5,"./DataManager":7,"Zbi7gb":28,"buffer":29}],15:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 角色头像类
 * @param game [obj] 游戏场景对象
 * @param textureName [string] 图片key
 * @param positionX [number] 初始化的x坐标
 * @param positionY [number] 初始化的y坐标
 */

function Head(game, textureName, positionX, positionY) {
	this.headObj = null;
	this.x = positionX;
	this.y = positionY;
	this.HPObj = null;  // 英雄血量
	this.textureName = textureName;
	this.init(game);
}

Head.prototype.init = function (game) {
	this.headObj = this.setPic(game);
	this.HPObj = this.setHP(game);
}

// 设置英雄头像
Head.prototype.setPic = function (game) {
	var pic = game.add.image(this.x, this.y, this.textureName);
	return pic;
}

// 设置血量
Head.prototype.setHP = function (game) {
	var HPbg = game.add.image(10, 170, "hp_background");
	var HP = game.add.text(HPbg.width / 2, HPbg.height / 2 + 5, "30", { fill: "#fff", fontSize: "24pt" });
	HP.anchor.set(0.5);
	HPbg.addChild(HP);

	return HP;
}

module.exports = Head;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\Head.js","/modules\\class")
},{"Zbi7gb":28,"buffer":29}],16:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 玩家水晶管理
 */

var Fee = require("./Fee");
var utils = require("../Utils");

function HeroFee(game) {
    Fee.apply(this, arguments);
}

utils.extend(HeroFee, Fee);

module.exports = HeroFee;

}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\HeroFee.js","/modules\\class")
},{"../Utils":2,"./Fee":12,"Zbi7gb":28,"buffer":29}],17:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Hero战斗随从
 */

var Fighter = require("./Fighter");
var utils = require("../Utils");

function HeroFighter(game){
    Fighter.apply(this,arguments);
}

utils.extend(HeroFighter,Fighter);

module.exports = HeroFighter;


}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\HeroFighter.js","/modules\\class")
},{"../Utils":2,"./Fighter":13,"Zbi7gb":28,"buffer":29}],18:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 英雄的手牌类
 */

var HandCarnd = require("./HandCard");
var utils = require("../Utils");
var CardGenerater = require("./CardGenerater");
var DataManager = require("./DataManager");
var CardConfig = require("../config/CardConfig");

function HeroHandCard(game, x, y) {
    HandCarnd.apply(this, arguments);
	this.setRealHandCard(game); // 设置真实卡面
}

utils.extend(HeroHandCard, HandCarnd);

/*
	@ override 
 */
HeroHandCard.prototype.setHandCardList = function(){
	var cardGenerater = new CardGenerater();

    if(DataManager.heroHandCardIDList.length == 0){
        var cardIDList = cardGenerater.buildCardList(CardConfig.cardLength, 1, CardConfig.card_info.length);
        return cardIDList;
    }else{
        var cardIDList = cardGenerater.buildCardListByUserChoise(CardConfig.cardLength, DataManager.heroHandCardIDList);
        return cardIDList;
    }
}

module.exports = HeroHandCard;

}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\HeroHandCard.js","/modules\\class")
},{"../Utils":2,"../config/CardConfig":22,"./CardGenerater":5,"./DataManager":7,"./HandCard":14,"Zbi7gb":28,"buffer":29}],19:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 玩家角色头像
 */
var utils = require("../Utils");
var Head = require("./Head");

function HeroHead(game, textureName, positionX, positionY) {
    Head.apply(this, arguments);
}

// HeroHead继承自Head类
utils.extend(HeroHead, Head);

/**
 *  @override 重写setHP方法
 */
HeroHead.prototype.setHP = function(game) {
    var HPbg = game.add.image(this.x, this.y - 55, "hp_background");
    var HP = game.add.text(HPbg.width / 2, HPbg.height / 2 + 5, "30", {
        fill: "#fff",
        fontSize: "24pt"
    });
    HP.anchor.set(0.5);
    HPbg.addChild(HP);

    return HP;
}

module.exports = HeroHead;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\HeroHead.js","/modules\\class")
},{"../Utils":2,"./Head":15,"Zbi7gb":28,"buffer":29}],20:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 剩余的卡牌显示
 */

var DataManager = require("./DataManager");

function RemainCard(game) {
	this.heroRemainCard = null;
	this.enemyRemainCard = null;
	this.init(game);
}

RemainCard.prototype.init = function (game) {
	this.heroRemainCard = this.setHeroRemainCard(game);
	this.enemyRemainCard = this.setEnemyRemainCard(game);
}

// 设置英雄的剩余卡片提示
RemainCard.prototype.setHeroRemainCard = function (game) {
	var image = game.add.image(680, game.world.centerY + 100, "card_back");
	image.scale.set(0.3);

	var text = game.add.text(680, game.world.centerY + 160,DataManager.heroHandCard.cardIDList.length,{
		fill:"#333333",
		fontSize:"18pt"
	});

	return {image,text}
}

// 设置敌人的剩余卡牌提示
RemainCard.prototype.setEnemyRemainCard = function (game) {
	var image = game.add.image(680, game.world.centerY - 160 , "card_back");
	image.scale.set(0.3);

	var text = game.add.text(680, game.world.centerY - 190,DataManager.enemyHandCard.cardIDList.length,{
		fill:"#333333",
		fontSize:"18pt"
	});
	return {image,text}
}

// 刷新剩余的卡牌数量
RemainCard.prototype.refresh = function(){
	this.heroRemainCard.text.setText(DataManager.heroHandCard.cardIDList.length);
	this.enemyRemainCard.text.setText(DataManager.enemyHandCard.cardIDList.length);
}

module.exports = RemainCard;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\RemainCard.js","/modules\\class")
},{"./DataManager":7,"Zbi7gb":28,"buffer":29}],21:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * UI界面管理
 */

var BackGround = require("./BackGround");
var HeroHead = require("./HeroHead");
var EnemyHead = require("./EnemyHead");
var DataManager = require("./DataManager");
var HeroHandCard = require("./HeroHandCard");
var EnemyHandCard = require("./EnemyHandCard");
var HeroFee = require("./HeroFee");
var EnemyFee = require("./EnemyFee");
var AI = require("./AI");
var RemainCard = require("./RemainCard");

var HeroFighter = require("./HeroFighter");

function UIManager(game) {
    this.backgroundObj = null; // 背景图
    this.turnOverButton = null; // 回合结束
    this.shotCardButton = null; // 出牌按钮
    this.init(game);
}

UIManager.prototype.init = function(game) {
    // 生成背景图
    this.backgroundObj = this.setBackGround(game);
    // 生成玩家英雄头像
    DataManager.heroHead = new HeroHead(game, "fighter_hero", 0, game.world.height - 140);

    // 生成电脑英雄头像
    DataManager.enemyHead = new EnemyHead(game, "fighter_hero", 0, 0);

    // 设置回合结束按钮
    DataManager.turnOverButton = this.setTurnOverButton(game);
    
    // 设置敌人手牌
    DataManager.enemyHandCard = new EnemyHandCard(game);

    // 设置玩家手牌 
    DataManager.heroHandCard = new HeroHandCard(game, null, game.world.height - 120);

    this.shotCardButton = this.setShotCardButton(game); // 设置出牌按钮

    // 英雄费用管理
    DataManager.heroFee = new HeroFee(game, game.world.width - 110, game.world.centerY + 42); 
    
    // 敌人费用管理
    DataManager.enemyFee = new EnemyFee(game, game.world.width - 110, game.world.centerY - 90); 

    // 创建AI
    DataManager.AI = new AI(); 

    // 剩余的卡牌提示
    DataManager.remainCard = new RemainCard(game); 
    // console.log(DataManager.remainCard);
}

// 设置背景
UIManager.prototype.setBackGround = function(game) {
    var background = new BackGround(game);
    return background;
}

// 回合结束
UIManager.prototype.setTurnOverButton = function(game) {
    var button = game.add.image(game.world.width - 150, game.world.centerY - 30, "hero_turn_button");
    button.inputEnabled = true;
    button.events.onInputDown.add(function() {
        if (DataManager.turn == 0) {
            button.loadTexture("enemy_turn_button");
            DataManager.turn = 1;
        }
        if (DataManager.enemyFighters) {
            DataManager.enemyFighters.awakeFighter(); // 解除敌人随从睡眠状态
        }

        DataManager.enemyFee.feeObj.setText(DataManager.fee + "/" + DataManager.fee);
        DataManager.enemyHandCard.addCard(game); // 敌人摸牌
        DataManager.remainCard.refresh();
        var time = setTimeout(function() {
            DataManager.AI.shotCard(game);
            DataManager.AI.choiseAttackTarget(game); // 电脑AI展开攻击
            if (DataManager.heroFighters) {
                DataManager.heroFighters.awakeFighter(); // 解除玩家随从睡眠状态
            }

            // 更新玩家费用的情况
            if (DataManager.fee < 9) {
                DataManager.fee += 1;
            }

            DataManager.heroCurrentFee = DataManager.fee;
            DataManager.heroFee.feeObj.setText(DataManager.fee + "/" + DataManager.fee);
            DataManager.heroHandCard.addCard(game); // 玩家摸牌
            DataManager.remainCard.refresh();

            clearTimeout(time);
        }, 1000);

    });
    return button;
}

// 出牌按钮
UIManager.prototype.setShotCardButton = function(game) {
    var shot = game.add.image(80, game.world.centerY - 10, "shot_card");
    shot.anchor.set(0.5);
    shot.inputEnabled = true;
    shot.events.onInputDown.add(function() {
        if (DataManager.turn != 0) {
            return;
        }

        // 控制玩家场上的随从
        try {
            if (DataManager.heroFighters.fightObj.length >= 5) {
                alert("您场上的随从已经到达了上限");
                return;
            }
        } catch (e) {}

        if (DataManager.heroChoiseCard) {

            // 检查选择卡牌的费用是否超出当前可用费用
            if (DataManager.heroCurrentFee < DataManager.heroChoiseCard.cardInfo.fee) {
                alert("你的费用不足，无法使用这张卡牌");
                return;
            }

            DataManager.heroCurrentFee = DataManager.heroCurrentFee - DataManager.heroChoiseCard.cardInfo.fee;
            DataManager.heroFee.feeObj.setText(DataManager.heroCurrentFee + "/" + DataManager.fee);

            //  出牌之后创建随从
            console.log(DataManager.heroChoiseCard.cardInfo);
            if(DataManager.heroChoiseCard.cardInfo.cardType == "magic"){
                console.log("我在使用魔法牌");
            }else if(DataManager.heroChoiseCard.cardInfo.cardType == "entourage"){
                if (DataManager.heroFighters == null) {
                    DataManager.heroFighters = new HeroFighter(game);
                    DataManager.heroFighters.buildFighter(game, DataManager.heroChoiseCard.cardInfo.HP, DataManager.heroChoiseCard.cardInfo.attack, DataManager.heroChoiseCard.cardInfo.cnName, DataManager.heroChoiseCard.cardInfo.fight);
                } else {
                    DataManager.heroFighters.buildFighter(game, DataManager.heroChoiseCard.cardInfo.HP, DataManager.heroChoiseCard.cardInfo.attack, DataManager.heroChoiseCard.cardInfo.cnName, DataManager.heroChoiseCard.cardInfo.fight);
                }
            }

          

            DataManager.heroChoiseCard.destroy();
            DataManager.heroHandCard.reListHandCard();
            DataManager.heroChoiseCard = null;
        }

    });
    return shot;
}
module.exports = UIManager;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\class\\UIManager.js","/modules\\class")
},{"./AI":3,"./BackGround":4,"./DataManager":7,"./EnemyFee":8,"./EnemyHandCard":10,"./EnemyHead":11,"./HeroFee":16,"./HeroFighter":17,"./HeroHandCard":18,"./HeroHead":19,"./RemainCard":20,"Zbi7gb":28,"buffer":29}],22:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 游戏卡牌的配置文件
 */

var CardConfig = {
    "card_info": [{
        "name": "fishman_baby",
        "fight": "fishman_baby_fight",
        "cn_name": "鱼人宝宝",
        "fee": 1,
        "attack": 1,
        "hp": 1,
        "id": 1,
        "type":"entourage" // 随从
    }, {
        "name": "freshwater_crocodile",
        "fight": "freshwater_crocodile_fight",
        "cn_name": "淡水鳄",
        "fee": 2,
        "attack": 2,
        "hp": 3,
        "id": 2,
        "type":"entourage"
    }, {
        "name": "ogre",
        "fight": "ogre_fight",
        "cn_name": "食人魔法师",
        "fee": 4,
        "attack": 4,
        "hp": 4,
        "id": 3,
        "type":"entourage"
    }, {
        "name": "dead_wing",
        "fight": "dead_wing_fight",
        "cn_name": "死亡之翼",
        "fee": 9,
        "attack": 9,
        "hp": 9,
        "id": 4,
        "type":"entourage"
    },{
        "name": "rose",
        "fight": "rose_fight",
        "cn_name": "拉格纳罗斯",
        "fee": 8,
        "attack": 8,
        "hp": 8,
        "id": 5,
        "type":"entourage"
    },{
        "name": "velociraptor",
        "fight": "velociraptor_fight",
        "cn_name": "超级迅猛龙",
        "fee": 4,
        "attack": 4,
        "hp": 5,
        "id": 6,
        "type":"entourage"
    },{
        "name": "arcaneWisdom",
        "fight": "",
        "cn_name": "奥术智慧",
        "fee": 3,
        "attack": 0,
        "hp": 0,
        "id": 7,
        "type":"magic" // magic魔法牌
    }], // 卡牌的相关信息
    "cardLength": 30, // 卡组长度
    "cardInitialLength": 4, // 初始化手牌长度
}

module.exports = CardConfig;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\config\\CardConfig.js","/modules\\config")
},{"Zbi7gb":28,"buffer":29}],23:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 选择游戏卡组场景
 */
var CardConfig = require("../config/CardConfig");
var DataManager = require("../class/DataManager");

function CardChoiseScene(game) {
     this.preload = function () {
        // 加载提示声明
        var loadText = game.add.text(game.world.centerX, game.world.centerY, "Loading ... ", { fill: "#333", "fontSize": "28pt" });

        // 锚点设置
        loadText.anchor.set(0.5);

        game.load.image("background", "../../resource/background.png");
        game.load.image("card_back", "../../resource/card_back.png");
        game.load.image("enemy_turn_button", "../../resource/enemy_turn_button.png");
        game.load.image("fee", "../../resource/fee.png");
        game.load.image("hero_turn_button", "../../resource/hero_turn_button.png");
        game.load.image("hp_background", "../../resource/hp_background.png");
        game.load.image("attack_icon","../../resource/attack_icon.png");
        game.load.image("shot_card","../../resource/shot_card.png");
        game.load.image("fighter_hero", "../../resource/fighter_hero.png");
        game.load.image("choiseScene_bg","../../resource/choiseScene_bg.jpg");
        game.load.image("confirm_btn","../../resource/confirm_btn.png");

        game.load.image("arcaneWisdom","../../resource/arcaneWisdom.png");
        game.load.image("dead_wing", "../../resource/dead_wing.png");
        game.load.image("dead_wing_fight", "../../resource/dead_wing_fight.png");
        game.load.image("fishman_baby", "../../resource/fishman_baby.png");
        game.load.image("fishman_baby_fight", "../../resource/fishman_baby_fight.png");
        game.load.image("freshwater_crocodile", "../../resource/freshwater_crocodile.png");
        game.load.image("freshwater_crocodile_fight", "../../resource/freshwater_crocodile_fight.png");
        game.load.image("ogre", "../../resource/ogre.png");
        game.load.image("ogre_fight", "../../resource/ogre_fight.png");
        game.load.image("rose","../../resource/rose.png");
        game.load.image("rose_fight","../../resource/rose_fight.png");
        game.load.image("velociraptor","../../resource/velociraptor.png");
        game.load.image("velociraptor_fight","../../resource/velociraptor_fight.png");

        // 单个文件加载完的回调
        game.load.onFileComplete.add(function () {
            loadText.setText("Loading ... " + arguments[0]);
        });

        // 所有文件加载完成回调
        game.load.onLoadComplete.add(function () {
            loadText.destroy();
        });
    }

    this.create = function () {
        var style = {
            fill: "#000",
            fontSize: "32pt"
        }

        this.choisedCardList = [];
        var bg = game.add.image(0,0,"choiseScene_bg");

        // 确定按钮，点击进入下一个场景
        var confirmBtn = game.add.image(670,550,"confirm_btn");

        confirmBtn.anchor.set(0.5);

        confirmBtn.inputEnabled = true;
        confirmBtn.events.onInputDown.add(function () {
            game.state.start("GameScene");
        },this);

        // 生成所有的待选卡片列表
        this.buildCommonCard(CardConfig);

    }
    
    // 待选卡片
    this.buildCommonCard = function(CardConfig){
        var self = this;

        for(var i = 0; i< CardConfig.card_info.length;i++){
            var image = game.add.image(50+i*85,50,CardConfig.card_info[i].name);
            image.scale.set(0.5);
            image.id = CardConfig.card_info[i].id;
            image.name = CardConfig.card_info[i].name;
            image.inputEnabled = true;

            image.events.onInputDown.add(function(image){
                self.addChoiseCard(image);
            });
        }
    }

    // 添加选择的卡牌
    this.addChoiseCard = function(image){
        if(DataManager.heroHandCardIDList.length == 0){
            DataManager.heroHandCardIDList.push(image);
        }else{
            for(var i = 0; i<DataManager.heroHandCardIDList.length; i++){
                if(DataManager.heroHandCardIDList[i].id == image.id){
                    return;
                }
            }

            if(this.choisedCardList.length != 0 ){
                for(var i = 0; i < this.choisedCardList.length; i++){
                    this.choisedCardList[i].destroy();
                }
            }
            DataManager.heroHandCardIDList.push(image);
        }

        for(var j = 0; j < DataManager.heroHandCardIDList.length; j++){
            // 添加已选卡片
            var image = game.add.image(46 +j*104,260,DataManager.heroHandCardIDList[j].name);
            this.choisedCardList.push(image);
            image.scale.set(0.6);
            image.id = DataManager.heroHandCardIDList[j].id;
            image.inputEnabled = true;
            image.events.onInputDown.add(function(image){
                for(var k = 0 ; k < DataManager.heroHandCardIDList.length; k++){
                    if(image.id == DataManager.heroHandCardIDList[k].id){
                        var _temp = DataManager.heroHandCardIDList.splice(k,1);
                        image.destroy();
                    }
                }
            });
        }
    }
}

module.exports = CardChoiseScene;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\scenes\\CardChoiseScene.js","/modules\\scenes")
},{"../class/DataManager":7,"../config/CardConfig":22,"Zbi7gb":28,"buffer":29}],24:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 游戏主场景
 */

var UIPanel = require("../class/UIManager");

function GameScene(game) {
   
    this.create = function () {
        // 添加ui界面
        var ui = new UIPanel(game);

    }
}

module.exports = GameScene;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\scenes\\GameScene.js","/modules\\scenes")
},{"../class/UIManager":21,"Zbi7gb":28,"buffer":29}],25:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 *  游戏结果场景
 */

var DataManager = require("../class/DataManager");

function ResultScene(game) {
    this.create = function () {
        if (DataManager.result == 0) {
            console.log("敌人胜利");
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
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\scenes\\ResultScene.js","/modules\\scenes")
},{"../class/DataManager":7,"Zbi7gb":28,"buffer":29}],26:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * 游戏开始场景 
 */

function StartScene(game) {

    this.create = function () {
        // 缩放模式
        // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // game.scale.scaleMode.maxHeight ="400px";
        var style = {
            fill: "#000",
            fontSize: "32pt"
        }
        var text = game.add.text(game.world.centerX, game.world.centerY, "欢迎来到我的炉石传说", style);

        text.anchor.set(0.5);

        var startButton = game.add.text(game.world.centerX, game.world.centerY + 70, "开始游戏", { fill: "#333", fontSize: "24pt" });

        startButton.anchor.set(0.5);

        startButton.inputEnabled = true;
        startButton.events.onInputDown.add(function () {
            game.state.start("CardChoiseScene");
        },this);
    }
}

module.exports = StartScene;
}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/modules\\scenes\\StartScene.js","/modules\\scenes")
},{"Zbi7gb":28,"buffer":29}],27:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules\\base64-js\\lib\\b64.js","/node_modules\\base64-js\\lib")
},{"Zbi7gb":28,"buffer":29}],28:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules\\browserify\\node_modules\\process\\browser.js","/node_modules\\browserify\\node_modules\\process")
},{"Zbi7gb":28,"buffer":29}],29:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules\\buffer\\index.js","/node_modules\\buffer")
},{"Zbi7gb":28,"base64-js":27,"buffer":29,"ieee754":30}],30:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,require("Zbi7gb"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/node_modules\\ieee754\\index.js","/node_modules\\ieee754")
},{"Zbi7gb":28,"buffer":29}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkU6XFxQaGFzZXJIZWFydGhTdG9uZVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvZmFrZV9hYTE2YjE3MC5qcyIsIkU6L1BoYXNlckhlYXJ0aFN0b25lL21vZHVsZXMvVXRpbHMuanMiLCJFOi9QaGFzZXJIZWFydGhTdG9uZS9tb2R1bGVzL2NsYXNzL0FJLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbW9kdWxlcy9jbGFzcy9CYWNrR3JvdW5kLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbW9kdWxlcy9jbGFzcy9DYXJkR2VuZXJhdGVyLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbW9kdWxlcy9jbGFzcy9Db25zb2xlTG9nLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbW9kdWxlcy9jbGFzcy9EYXRhTWFuYWdlci5qcyIsIkU6L1BoYXNlckhlYXJ0aFN0b25lL21vZHVsZXMvY2xhc3MvRW5lbXlGZWUuanMiLCJFOi9QaGFzZXJIZWFydGhTdG9uZS9tb2R1bGVzL2NsYXNzL0VuZW15RmlnaHRlci5qcyIsIkU6L1BoYXNlckhlYXJ0aFN0b25lL21vZHVsZXMvY2xhc3MvRW5lbXlIYW5kQ2FyZC5qcyIsIkU6L1BoYXNlckhlYXJ0aFN0b25lL21vZHVsZXMvY2xhc3MvRW5lbXlIZWFkLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbW9kdWxlcy9jbGFzcy9GZWUuanMiLCJFOi9QaGFzZXJIZWFydGhTdG9uZS9tb2R1bGVzL2NsYXNzL0ZpZ2h0ZXIuanMiLCJFOi9QaGFzZXJIZWFydGhTdG9uZS9tb2R1bGVzL2NsYXNzL0hhbmRDYXJkLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbW9kdWxlcy9jbGFzcy9IZWFkLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbW9kdWxlcy9jbGFzcy9IZXJvRmVlLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbW9kdWxlcy9jbGFzcy9IZXJvRmlnaHRlci5qcyIsIkU6L1BoYXNlckhlYXJ0aFN0b25lL21vZHVsZXMvY2xhc3MvSGVyb0hhbmRDYXJkLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbW9kdWxlcy9jbGFzcy9IZXJvSGVhZC5qcyIsIkU6L1BoYXNlckhlYXJ0aFN0b25lL21vZHVsZXMvY2xhc3MvUmVtYWluQ2FyZC5qcyIsIkU6L1BoYXNlckhlYXJ0aFN0b25lL21vZHVsZXMvY2xhc3MvVUlNYW5hZ2VyLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbW9kdWxlcy9jb25maWcvQ2FyZENvbmZpZy5qcyIsIkU6L1BoYXNlckhlYXJ0aFN0b25lL21vZHVsZXMvc2NlbmVzL0NhcmRDaG9pc2VTY2VuZS5qcyIsIkU6L1BoYXNlckhlYXJ0aFN0b25lL21vZHVsZXMvc2NlbmVzL0dhbWVTY2VuZS5qcyIsIkU6L1BoYXNlckhlYXJ0aFN0b25lL21vZHVsZXMvc2NlbmVzL1Jlc3VsdFNjZW5lLmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbW9kdWxlcy9zY2VuZXMvU3RhcnRTY2VuZS5qcyIsIkU6L1BoYXNlckhlYXJ0aFN0b25lL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qcyIsIkU6L1BoYXNlckhlYXJ0aFN0b25lL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJFOi9QaGFzZXJIZWFydGhTdG9uZS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwiRTovUGhhc2VySGVhcnRoU3RvbmUvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmxDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIFN0YXJ0U2NlbmUgPSByZXF1aXJlKFwiLi9tb2R1bGVzL3NjZW5lcy9TdGFydFNjZW5lXCIpO1xyXG52YXIgR2FtZVNjZW5lID0gcmVxdWlyZShcIi4vbW9kdWxlcy9zY2VuZXMvR2FtZVNjZW5lXCIpO1xyXG52YXIgUmVzdWx0U2NlbmUgPSByZXF1aXJlKFwiLi9tb2R1bGVzL3NjZW5lcy9SZXN1bHRTY2VuZVwiKTtcclxudmFyIENhcmRDaG9pc2VTY2VuZSA9IHJlcXVpcmUoXCIuL21vZHVsZXMvc2NlbmVzL0NhcmRDaG9pc2VTY2VuZVwiKTtcclxuXHJcbnZhciBnYW1lID0gbmV3IFBoYXNlci5HYW1lKDgwMCwgNjAwLCBQaGFzZXIuQVVUTywgJ21haW5DYW52YXMnLCB7fSwgdHJ1ZSk7XHJcblxyXG5nYW1lLnN0YXRlLmFkZChcIlN0YXJ0U2NlbmVcIiwgU3RhcnRTY2VuZSk7ICAvLyDmuLjmiI/lvIDlp4vlnLrmma9cclxuZ2FtZS5zdGF0ZS5hZGQoXCJHYW1lU2NlbmVcIiwgR2FtZVNjZW5lKTsgICAgLy8g5ri45oiP5Zy65pmvXHJcbmdhbWUuc3RhdGUuYWRkKFwiUmVzdWx0U2NlbmVcIiwgUmVzdWx0U2NlbmUpOyAvLyDmuLjmiI/nu5PmnpzlnLrmma9cclxuZ2FtZS5zdGF0ZS5hZGQoXCJDYXJkQ2hvaXNlU2NlbmVcIixDYXJkQ2hvaXNlU2NlbmUpOyAvLyDpgInmi6nljaHniYfnmoTlnLrmma9cclxuZ2FtZS5zdGF0ZS5zdGFydChcIlN0YXJ0U2NlbmVcIik7XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJaYmk3Z2JcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9mYWtlX2FhMTZiMTcwLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXHJcbiAqIOW4uOeUqOWHveaVsFxyXG4gKi9cclxuXHJcbnZhciBVdGlscyA9IHtcclxuICAgIC8vIOe7p+aJv1xyXG4gICAgZXh0ZW5kOiBmdW5jdGlvbiAoY2hpbGQsIHBhcmVudCkge1xyXG4gICAgICAgIHZhciBwID0gcGFyZW50LnByb3RvdHlwZTtcclxuICAgICAgICB2YXIgYyA9IGNoaWxkLnByb3RvdHlwZTtcclxuICAgICAgICBmb3IgKHZhciBpIGluIHApIHtcclxuICAgICAgICAgICAgY1tpXSA9IHBbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGMudWJlciA9IHA7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldENoaWxkQnlLZXk6IGZ1bmN0aW9uIChwYXJlbnQsIGtleSkge1xyXG4gICAgICAgIHZhciBfY2hpbGQgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcmVudC5jaGlsZHJlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChwYXJlbnQuY2hpbGRyZW5baV0ua2V5ID09IGtleSkge1xyXG4gICAgICAgICAgICAgICAgX2NoaWxkLnB1c2gocGFyZW50LmNoaWxkcmVuW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKF9jaGlsZC5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCLmsqHmnInlnKjljLnphY3nmoRrZXk6IFwiICsga2V5KTtcclxuICAgICAgICB9IGVsc2UgaWYgKF9jaGlsZC5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gX2NoaWxkWzBdO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoX2NoaWxkLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9jaGlsZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVXRpbHM7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlpiaTdnYlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXNcXFxcVXRpbHMuanNcIixcIi9tb2R1bGVzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXHJcbiAqIOeUteiEkUFJXHJcbiAqL1xyXG52YXIgRGF0YU1hbmFnZXIgPSByZXF1aXJlKFwiLi9EYXRhTWFuYWdlclwiKTtcclxudmFyIEVuZW15RmlnaHRlciA9IHJlcXVpcmUoXCIuL0VuZW15RmlnaHRlclwiKTtcclxudmFyIENvbnNvbGVMb2cgPSByZXF1aXJlKFwiLi9Db25zb2xlTG9nXCIpO1xyXG5cclxuZnVuY3Rpb24gQUkoKSB7XHJcbiAgICB0aGlzLmVuZW15Q2hvaXNlID0gbnVsbDtcclxufVxyXG5cclxuLy8g5Ye654mMXHJcbkFJLnByb3RvdHlwZS5zaG90Q2FyZCA9IGZ1bmN0aW9uIChnYW1lKSB7XHJcbiAgICB0aGlzLmVuZW15Q2hvaXNlID0gdGhpcy5jaG9pc2VDYXJkKCk7XHJcbiAgICBEYXRhTWFuYWdlci50dXJuID0gMDtcclxuXHJcbiAgICBpZiAoIXRoaXMuZW5lbXlDaG9pc2UpIHtcclxuICAgICAgICAvLyDmsqHmnInlkIjpgILnmoTljaHniYxcclxuICAgICAgICBEYXRhTWFuYWdlci50dXJuT3ZlckJ1dHRvbi5sb2FkVGV4dHVyZShcImhlcm9fdHVybl9idXR0b25cIik7XHJcbiAgICAgICAgLy8gYWxlcnQoXCLmlYzkurrpgInmi6nkuI3lh7rniYws5LiN55+l6YGT5pyJ5LuA5LmI6Zi06LCL6K+h6K6hXCIpO1xyXG4gICAgICAgIENvbnNvbGVMb2cubG9nKFwi5pWM5Lq66YCJ5oup5LiN5Ye654mMLOS4jeefpemBk+acieS7gOS5iOmYtOiwi+ivoeiuoVwiKTtcclxuXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgaWYgKERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmoubGVuZ3RoID49IDUpIHtcclxuICAgICAgICAgICAgRGF0YU1hbmFnZXIudHVybk92ZXJCdXR0b24ubG9hZFRleHR1cmUoXCJoZXJvX3R1cm5fYnV0dG9uXCIpO1xyXG4gICAgICAgICAgICAvLyBhbGVydChcIuaVjOS6uumAieaLqeS4jeWHuueJjCzkuI3nn6XpgZPmnInku4DkuYjpmLTosIvor6HorqFcIik7XHJcbiAgICAgICAgICAgIENvbnNvbGVMb2cubG9nKFwi5pWM5Lq66YCJ5oup5LiN5Ye654mMLOS4jeefpemBk+acieS7gOS5iOmYtOiwi+ivoeiuoVwiKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKHRoaXMuZW5lbXlDaG9pc2UuY2FyZEluZm8pO1xyXG5cclxuICAgIGlmICh0aGlzLmVuZW15Q2hvaXNlLmNhcmRJbmZvLmNhcmRUeXBlID09IFwibWFnaWNcIikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwi5pWM5Lq655qE6a2U5rOV5ouNXCIpO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLmVuZW15Q2hvaXNlLmNhcmRJbmZvLmNhcmRUeXBlID09IFwiZW50b3VyYWdlXCIpIHtcclxuICAgICAgICBpZiAoRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMgPSBuZXcgRW5lbXlGaWdodGVyKGdhbWUpO1xyXG4gICAgICAgICAgICBEYXRhTWFuYWdlci5lbmVteUZpZ2h0ZXJzLmJ1aWxkRmlnaHRlcihnYW1lLCB0aGlzLmVuZW15Q2hvaXNlLmNhcmRJbmZvLkhQLCB0aGlzLmVuZW15Q2hvaXNlLmNhcmRJbmZvLmF0dGFjaywgdGhpcy5lbmVteUNob2lzZS5jYXJkSW5mby5jbk5hbWUsIHRoaXMuZW5lbXlDaG9pc2UuY2FyZEluZm8uZmlnaHQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuYnVpbGRGaWdodGVyKGdhbWUsIHRoaXMuZW5lbXlDaG9pc2UuY2FyZEluZm8uSFAsIHRoaXMuZW5lbXlDaG9pc2UuY2FyZEluZm8uYXR0YWNrLCB0aGlzLmVuZW15Q2hvaXNlLmNhcmRJbmZvLmNuTmFtZSwgdGhpcy5lbmVteUNob2lzZS5jYXJkSW5mby5maWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZW5lbXlDaG9pc2UuZGVzdHJveSgpO1xyXG4gICAgRGF0YU1hbmFnZXIuZW5lbXlIYW5kQ2FyZC5yZUxpc3RIYW5kQ2FyZCgpO1xyXG4gICAgdGhpcy5lbmVteUNob2lzZSA9IG51bGw7XHJcblxyXG4gICAgRGF0YU1hbmFnZXIudHVybk92ZXJCdXR0b24ubG9hZFRleHR1cmUoXCJoZXJvX3R1cm5fYnV0dG9uXCIpO1xyXG59XHJcblxyXG4vLyDpgInmi6nmiYvniYxcclxuQUkucHJvdG90eXBlLmNob2lzZUNhcmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgc2hvdExpc3QgPSBbXTtcclxuICAgIHZhciBfZmVlID0gcGFyc2VJbnQoRGF0YU1hbmFnZXIuZW5lbXlGZWUuZmVlT2JqLnRleHQuc3BsaXQoXCIvXCIpWzBdKTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IERhdGFNYW5hZ2VyLmVuZW15SGFuZENhcmQuY2FyZFZpZXdMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKF9mZWUgPj0gRGF0YU1hbmFnZXIuZW5lbXlIYW5kQ2FyZC5jYXJkVmlld0xpc3RbaV0uY2FyZEluZm8uZmVlKSB7XHJcbiAgICAgICAgICAgIC8vIOWPquimgei0ueeUqOWFgeiuuO+8jOWwseaUvuWFpeWPr+WHuueahOeJjOS5i+S4rVxyXG4gICAgICAgICAgICBzaG90TGlzdC5wdXNoKERhdGFNYW5hZ2VyLmVuZW15SGFuZENhcmQuY2FyZFZpZXdMaXN0W2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNob3RMaXN0Lmxlbmd0aCA+PSAxKSB7XHJcbiAgICAgICAgLy8g6L+U5Zue5bem5omL56ys5LiA5byg54mMXHJcbiAgICAgICAgcmV0dXJuIHNob3RMaXN0WzBdO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyDpgInmi6nopoHmlLvlh7vnmoTnm67moIdcclxuQUkucHJvdG90eXBlLmNob2lzZUF0dGFja1RhcmdldCA9IGZ1bmN0aW9uIChnYW1lKSB7XHJcbiAgICAvLyDmlYzkurrmsqHmnInpmo/ku45cclxuICAgIGlmICghRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycyB8fCBEYXRhTWFuYWdlci5lbmVteUZpZ2h0ZXJzLmZpZ2h0T2JqLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChEYXRhTWFuYWdlci5oZXJvRmlnaHRlcnMgPT0gbnVsbCkgeyAvLyDliKTmlq3njqnlrrbnmoTpmo/ku47mmK/lkKblrZjlnKhcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmoubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmpbaV0uc2xlZXAgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHZhciBfc3RyID0gXCLmlYzkurrnmoRcIiArIERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmpbaV0uY25OYW1lICsgXCLmlLvlh7vkuobkvaDnmoToi7Hpm4RcIjtcclxuICAgICAgICAgICAgICAgIC8vIGFsZXJ0KFwi5pWM5Lq655qEXCIgKyBEYXRhTWFuYWdlci5lbmVteUZpZ2h0ZXJzLmZpZ2h0T2JqW2ldLmNuTmFtZSArIFwi5pS75Ye75LqG5L2g55qE6Iux6ZuEXCIpO1xyXG4gICAgICAgICAgICAgICAgQ29uc29sZUxvZy5sb2coX3N0cik7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIOabtOaWsOaUu+WHu+S5i+WQjueahOeKtuaAgVxyXG4gICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycy5maWdodE9ialtpXS5zbGVlcCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5lbmVteUZpZ2h0ZXJzLmZpZ2h0T2JqW2ldLmFscGhhID0gMC43O1xyXG4gICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuaGVyb0hlYWQuSFBPYmouc2V0VGV4dChwYXJzZUludChEYXRhTWFuYWdlci5oZXJvSGVhZC5IUE9iai50ZXh0KSAtIERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmpbaV0uYXR0YWNrKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VJbnQoRGF0YU1hbmFnZXIuaGVyb0hlYWQuSFBPYmoudGV4dCkgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLnJlc3VsdCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLmlYzkurrojrflj5bkuobog5zliKnvvIznjqnlrrbpmLXkuqFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5zdGF0ZS5zdGFydChcIlJlc3VsdFNjZW5lXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIHZhciBfaGVyb0ZpZ2h0ZXJzQXR0YWNrID0gMDtcclxuICAgICAgICB2YXIgX2VuZW15RmlnaHRlcnNBdHRhY2sgPSAwO1xyXG5cclxuICAgICAgICAvLyDorqHnrpfnlLXohJFBSeeahOWcuuaUu1xyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycy5maWdodE9iai5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBfZW5lbXlGaWdodGVyc0F0dGFjayArPSBEYXRhTWFuYWdlci5lbmVteUZpZ2h0ZXJzLmZpZ2h0T2JqW2pdLmF0dGFjaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOiuoeeul+eOqeWutuaImOWcuuS4iueahOWcuuaUu1xyXG4gICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgRGF0YU1hbmFnZXIuaGVyb0ZpZ2h0ZXJzLmZpZ2h0T2JqLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgIF9oZXJvRmlnaHRlcnNBdHRhY2sgKz0gRGF0YU1hbmFnZXIuaGVyb0ZpZ2h0ZXJzLmZpZ2h0T2JqW2tdLmF0dGFjaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBfZGVzdHJveUxpc3QgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmoubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmpbaV0uc2xlZXAgPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYXR0YWNrXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIOWmguaenOeUteiEkeeahOmaj+S7juaAu+WcuuaUu+Wkp+S6jueOqeWutueahOaJgOaciemaj+S7jueahOaAu+WcuuaUu1xyXG4gICAgICAgICAgICAgICAgdmFyIGNhc2VfMSA9IF9lbmVteUZpZ2h0ZXJzQXR0YWNrID49IF9oZXJvRmlnaHRlcnNBdHRhY2s7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g5aaC5p6c55S16ISR55qE6ZqP5LuO5oC75Zy65pS76Laz55+j5p2A5q27546p5a62XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FzZV8yID0gX2VuZW15RmlnaHRlcnNBdHRhY2sgPj0gcGFyc2VJbnQoRGF0YU1hbmFnZXIuaGVyb0hlYWQuSFBPYmoudGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNhc2VfMSB8fCBjYXNlXzIpIHsgLy8gQUnlnLrmlLvlpKfkuo7njqnlrrbpmo/ku47nmoTlnLrmlLtcclxuICAgICAgICAgICAgICAgICAgICAvLyBhbGVydChcIuaVjOS6uueahFwiICsgRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycy5maWdodE9ialtpXS5jbk5hbWUgKyBcIuaUu+WHu+S6huS9oOeahOiLsembhFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgX3N0ciA9IFwi5pWM5Lq655qEXCIgKyBEYXRhTWFuYWdlci5lbmVteUZpZ2h0ZXJzLmZpZ2h0T2JqW2ldLmNuTmFtZSArIFwi5pS75Ye75LqG5L2g55qE6Iux6ZuEXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29uc29sZUxvZy5sb2coX3N0cik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOabtOaWsOaUu+WHu+S5i+WQjueahOeKtuaAgVxyXG4gICAgICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmpbaV0uc2xlZXAgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmpbaV0uYWxwaGEgPSAwLjc7XHJcbiAgICAgICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuaGVyb0hlYWQuSFBPYmouc2V0VGV4dChwYXJzZUludChEYXRhTWFuYWdlci5oZXJvSGVhZC5IUE9iai50ZXh0KSAtIERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmpbaV0uYXR0YWNrKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlSW50KERhdGFNYW5hZ2VyLmhlcm9IZWFkLkhQT2JqLnRleHQpIDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIucmVzdWx0ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLmlYzkurrojrflj5bkuobog5zliKnvvIznjqnlrrbpmLXkuqFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhbWUuc3RhdGUuc3RhcnQoXCJSZXN1bHRTY2VuZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoIWNhc2VfMSl7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQUnlnLrmlLvlsI/kuo7njqnlrrblnLrmlLvliJnmlLvlh7vpmo/ku45cclxuICAgICAgICAgICAgICAgICAgICAvLyBhbGVydChcIuaVjOaWueeahFwiICsgRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycy5maWdodE9ialtpXS5jbk5hbWUgKyBcIuaUu+WHu+S6huaIkeaWueeahFwiICsgRGF0YU1hbmFnZXIuaGVyb0ZpZ2h0ZXJzLmZpZ2h0T2JqWzBdLmNuTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBfc3RyID0gXCLmlYzmlrnnmoRcIiArIERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmpbaV0uY25OYW1lICsgXCLmlLvlh7vkuobmiJHmlrnnmoRcIiArIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVycy5maWdodE9ialswXS5jbk5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29uc29sZUxvZy5sb2coX3N0cik7XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9oZXJvRmlnaHRIUCA9IERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmpbaV0uaHAgLSBEYXRhTWFuYWdlci5oZXJvRmlnaHRlcnMuZmlnaHRPYmpbMF0uYXR0YWNrO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBfZW5lbXlGaWdodEhQID0gRGF0YU1hbmFnZXIuaGVyb0ZpZ2h0ZXJzLmZpZ2h0T2JqWzBdLmhwIC0gRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycy5maWdodE9ialtpXS5hdHRhY2s7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOabtOaWsOeOqeWutueahOmaj+S7jueahGhwXHJcbiAgICAgICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycy5maWdodE9ialtpXS5ocCA9IF9oZXJvRmlnaHRIUDtcclxuICAgICAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5lbmVteUZpZ2h0ZXJzLmZpZ2h0T2JqW2ldLmFscGhhID0gMC43O1xyXG4gICAgICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmpbaV0uc2xlZXAgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmpbaV0uY2hpbGRyZW5bMl0uYWxwaGEgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMuZmlnaHRPYmpbaV0uY2hpbGRyZW5bMV0uc2V0VGV4dChfaGVyb0ZpZ2h0SFApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyDmm7TmlrDmlYzkurrnmoTnjqnlrrbnmoRocFxyXG4gICAgICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVycy5maWdodE9ialswXS5ocCA9IF9lbmVteUZpZ2h0SFA7XHJcbiAgICAgICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuaGVyb0ZpZ2h0ZXJzLmZpZ2h0T2JqWzBdLmNoaWxkcmVuWzFdLnNldFRleHQoX2VuZW15RmlnaHRIUCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChfaGVyb0ZpZ2h0SFAgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfZGVzdHJveUxpc3QucHVzaChEYXRhTWFuYWdlci5lbmVteUZpZ2h0ZXJzLmZpZ2h0T2JqW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChfZW5lbXlGaWdodEhQIDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuaGVyb0ZpZ2h0ZXJzLmZpZ2h0T2JqWzBdLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuaGVyb0ZpZ2h0ZXJzLnJlTGlzdE9ianMoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAodmFyIG4gPSAwOyBuIDwgX2Rlc3Ryb3lMaXN0Lmxlbmd0aDsgbisrKSB7XHJcbiAgICAgICAgICAgIF9kZXN0cm95TGlzdFtuXS5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMucmVMaXN0T2JqcygpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFJO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJaYmk3Z2JcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzXFxcXGNsYXNzXFxcXEFJLmpzXCIsXCIvbW9kdWxlc1xcXFxjbGFzc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxyXG4gKiDog4zmma/nsbtcclxuICovXHJcblxyXG5mdW5jdGlvbiBCYWNrR3JvdW5kKGdhbWUpIHtcclxuICAgIHRoaXMucGljT2JqID0gbnVsbDtcclxuICAgIHRoaXMuaW5pdChnYW1lKTtcclxufVxyXG5cclxuQmFja0dyb3VuZC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIChnYW1lKSB7XHJcbiAgICB0aGlzLnBpY09iaiA9IHRoaXMuc2V0UGljKGdhbWUpO1xyXG5cclxufVxyXG5cclxuQmFja0dyb3VuZC5wcm90b3R5cGUuc2V0UGljID0gZnVuY3Rpb24gKGdhbWUpIHtcclxuICAgIHZhciBiYWNrZ3JvdW5kID0gZ2FtZS5hZGQuaW1hZ2UoMCwgMCwgXCJiYWNrZ3JvdW5kXCIpO1xyXG4gICAgcmV0dXJuIGJhY2tncm91bmQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmFja0dyb3VuZDtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiWmJpN2diXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlc1xcXFxjbGFzc1xcXFxCYWNrR3JvdW5kLmpzXCIsXCIvbW9kdWxlc1xcXFxjbGFzc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxyXG4gKiDljaHnu4TnlJ/miJDlmahcclxuICovXHJcblxyXG5mdW5jdGlvbiBDYXJkR2VuZXJhdG9yKCkge31cclxuXHJcbi8vIOWNoee7hOeUn+aIkOWZqFxyXG4vLyBAcGFyYW0gY2FyZExlbmd0aCBbbnVtYmVyXSDljaHnu4TmnIDlpKfnmoTplb/luqZcclxuLy8gQHBhcmFtIG1pbkluZGV4IFtudW1iZXJdIOacgOWwj+e0ouW8lVxyXG4vLyBAcGFyYW0gbWF4SW5kZXggW251bWJlcl0g5pyA5aSn57Si5byVXHJcbi8vIEByZXR1cm4gY2FyZExpc3QgW2FycmF5XSDljaHniYxpZOeUn+aIkOaVsOe7hFxyXG5DYXJkR2VuZXJhdG9yLnByb3RvdHlwZS5idWlsZENhcmRMaXN0ID0gZnVuY3Rpb24oY2FyZExlbmd0aCwgbWluSW5kZXgsIG1heEluZGV4KSB7XHJcbiAgICB2YXIgY2FyZExpc3QgPSBbXTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2FyZExlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHJhbWRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG1heEluZGV4KSArIG1pbkluZGV4O1xyXG4gICAgICAgIGNhcmRMaXN0LnB1c2gocmFtZG9tKTtcclxuICAgIH1cclxuICAgIHJldHVybiBjYXJkTGlzdDtcclxufVxyXG5cclxuLy8g6YCa6L+H546p5a626YCJ5oup55qE5Y2h54mH5p2l55Sf5oiQ5a6M5pW05Y2h57uEXHJcbi8vIEBwYXJhbSBjYXJkTGVuZ3RoIFtudW1iZXJdIOWNoee7hOacgOWkp+eahOmVv+W6plxyXG4vLyBAcGFyYW0gY2FyZEluZGV4TGlzdCBbb2JqIGFycmF5XSDpgInmi6nnmoTljaHnu4Tkv6Hmga9cclxuQ2FyZEdlbmVyYXRvci5wcm90b3R5cGUuYnVpbGRDYXJkTGlzdEJ5VXNlckNob2lzZSA9IGZ1bmN0aW9uKGNhcmRMZW5ndGggLCBjYXJkSW5mb0xpc3Qpe1xyXG5cdGNvbnNvbGUubG9nKGNhcmRJbmZvTGlzdCk7XHJcblxyXG5cdHZhciB0ZW1wTGlzdCA9IFtdO1xyXG5cdHZhciBjYXJkTGlzdCA9IFtdO1xyXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBjYXJkSW5mb0xpc3QubGVuZ3RoOyBpKyspe1xyXG5cclxuXHRcdHRlbXBMaXN0LnB1c2goY2FyZEluZm9MaXN0W2ldLmlkKTtcclxuXHR9XHJcblxyXG5cdHZhciBfbGVuZ3RoID0gdGVtcExpc3QubGVuZ3RoO1xyXG5cclxuXHRmb3IodmFyIGogPSAwOyBqIDwgY2FyZExlbmd0aDsgaisrKXtcclxuXHRcdHZhciBfcmFtZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogX2xlbmd0aCk7XHJcblx0XHRjYXJkTGlzdC5wdXNoKHRlbXBMaXN0W19yYW1kb21dKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBjYXJkTGlzdDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDYXJkR2VuZXJhdG9yO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJaYmk3Z2JcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzXFxcXGNsYXNzXFxcXENhcmRHZW5lcmF0ZXIuanNcIixcIi9tb2R1bGVzXFxcXGNsYXNzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXHJcbiAqIOaImOaWl+aXpeW/l+WNleS+i1xyXG4gKi9cclxuXHJcbnZhciBDb25zb2xlTG9nID0ge307XHJcbkNvbnNvbGVMb2cubG9nVGV4dCA9IFwiXCI7XHJcblxyXG4vLyDorrDlvZXml6Xlv5dcclxuQ29uc29sZUxvZy5sb2cgPSBmdW5jdGlvbihzdHIpIHtcclxuICAgIHZhciB0ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dcIik7XHJcbiAgICBDb25zb2xlTG9nLmxvZ1RleHQgPSBzdHIgK1wiXFxuPC9icj5cIisgQ29uc29sZUxvZy5sb2dUZXh0ICsgXCJcXG48L2JyPlwiO1xyXG4gICAgdGV4dC5pbm5lckhUTUwgPSBDb25zb2xlTG9nLmxvZ1RleHQ7XHJcbn1cclxuXHJcbi8vIHRvZG865riF6Zmk5omA5pyJ5pel5b+XXHJcbkNvbnNvbGVMb2cuY2xlYW4gPSBmdW5jdGlvbigpe1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBDb25zb2xlTG9nO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJaYmk3Z2JcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzXFxcXGNsYXNzXFxcXENvbnNvbGVMb2cuanNcIixcIi9tb2R1bGVzXFxcXGNsYXNzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXHJcbiAqIOa4uOaIj+aVsOaNrueuoeeQhuexu1xyXG4gKi9cclxuXHJcbnZhciBEYXRhTWFuYWdlciA9IHtcclxuXHR0dXJuOiAwLCAgICAgICAgICAgICAgICAgLy8gMOS7o+ihqOiHquW3seWbnuWQiCwx5Luj6KGo5pWM5Lq65Zue5ZCIIFxyXG5cdGZlZTogMSwgICAgICAgICAgICAgICAgICAvLyDliJ3lp4vljJbotLnnlKjvvIzlkozmuLjmiI/lm57lkIjnm7jlhbNcclxuXHRBSTogbnVsbCxcclxuXHJcblx0aGVyb0Nob2lzZUNhcmQ6IG51bGwsICAgIC8vIOiLsembhOmAieaLqeeahOWNoeeJjFxyXG5cdGhlcm9GaWdodGVyczogbnVsbCwgICAgICAvLyDoi7Hpm4Tpmo/ku45cclxuXHRoZXJvSGFuZENhcmQ6IG51bGwsICAgICAgLy8g6Iux6ZuE5omL54mMXHJcblx0aGVyb0ZlZTogbnVsbCwgICAgICAgICAgIC8vIOiLsembhOeahOi0ueeUqFxyXG5cdGhlcm9IZWFkOiBudWxsLCAgICAgICAgICAvLyDoi7Hpm4TlpLTlg49cclxuXHRoZXJvRmlnaHRlckNob2lzZTogbnVsbCwgLy8g5oiY5paX6ZqP5LuO55qE6YCJ5oupXHJcblx0aGVyb0N1cnJlbnRGZWU6IDEsICAgICAgIC8vIOeOqeWutuW9k+WJjei0ueeUqFxyXG5cclxuXHRlbmVteUhhbmRDYXJkOiBudWxsLCAgICAgLy8g5pWM5Lq65omL54mMIFxyXG5cdGVuZW15RmVlOiBudWxsLCAgICAgICAgICAvLyDmlYzkurrnmoTotLnnlKhcclxuXHRlbmVteUhlYWQ6IG51bGwsICAgICAgICAgLy8g5pWM5Lq655qE5aS05YOPXHJcblx0ZW5lbXlGaWdodGVyczogbnVsbCwgICAgIC8vIOaVjOS6uuaImOWcuueahOmaj+S7jlxyXG5cdGVuZW15Q3VycmVudEZlZTogMSwgICAgICAvLyDmlYzkurrlvZPliY3otLnnlKhcclxuXHJcblx0cmVtYWluQ2FyZDpudWxsLFxyXG5cdHR1cm5PdmVyQnV0dG9uOiBudWxsLCAgICAvLyDlm57lkIjnu5PmnZ/nmoTmjInpkq5cclxuXHRyZXN1bHQ6MCwgICAgICAgICAgICAgICAgLy8gMCDku6PooajnjqnlrrblpLHotKXvvIwx5Luj6KGo546p5a626IOc5YipXHJcblxyXG5cdGhlcm9IYW5kQ2FyZElETGlzdDpbXSAgICAvLyDnlKjmiLfmiYDpgInmi6nnmoTljaHniYzmlbDnu4RcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRGF0YU1hbmFnZXI7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlpiaTdnYlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXNcXFxcY2xhc3NcXFxcRGF0YU1hbmFnZXIuanNcIixcIi9tb2R1bGVzXFxcXGNsYXNzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIHV0aWxzID0gcmVxdWlyZShcIi4uL1V0aWxzXCIpO1xyXG52YXIgRmVlID0gcmVxdWlyZShcIi4vRmVlXCIpO1xyXG5cclxuLyoqXHJcbiAqIOaVjOS6uui0ueeUqOeuoeeQhlxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIEVuZW15RmVlKGdhbWUsIHgsIHkpIHtcclxuICAgIEZlZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG51dGlscy5leHRlbmQoRW5lbXlGZWUsIEZlZSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVuZW15RmVlO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJaYmk3Z2JcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzXFxcXGNsYXNzXFxcXEVuZW15RmVlLmpzXCIsXCIvbW9kdWxlc1xcXFxjbGFzc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxyXG4gKiDmlYzkurrnmoTmiJjlnLrpmo/ku45cclxuICovXHJcbnZhciBEYXRhTWFuYWdlciA9IHJlcXVpcmUoXCIuL0RhdGFNYW5hZ2VyXCIpO1xyXG52YXIgdXRpbHMgPSByZXF1aXJlKFwiLi4vVXRpbHNcIik7XHJcbnZhciBGaWdodGVyID0gcmVxdWlyZShcIi4vRmlnaHRlclwiKTtcclxudmFyIENvbnNvbGVMb2cgPSByZXF1aXJlKFwiLi9Db25zb2xlTG9nXCIpO1xyXG5cclxuZnVuY3Rpb24gRW5lbXlGaWdodGVyKGdhbWUpIHtcclxuICAgIEZpZ2h0ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgIHRoaXMueSA9IGdhbWUud29ybGQuY2VudGVyWSAtIDEzMDtcclxuXHJcbn1cclxuXHJcbnV0aWxzLmV4dGVuZChFbmVteUZpZ2h0ZXIsIEZpZ2h0ZXIpO1xyXG5cclxuLy8gQG92ZXJyaWRlXHJcbi8vIOWcqOeOqeWutumAieaLqeaVjOaWuemaj+S7juaXtui/m+ihjOaImOaWl+e7k+eul1xyXG5FbmVteUZpZ2h0ZXIucHJvdG90eXBlLmNob2ljZUZpZ2h0ZXIgPSBmdW5jdGlvbiAoZmlnaHRCZykge1xyXG4gICAgaWYgKERhdGFNYW5hZ2VyLmhlcm9GaWdodGVyQ2hvaXNlID09IG51bGwpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gYWxlcnQoXCLmiJHmlrnnmoRcIiArIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVyQ2hvaXNlLmNuTmFtZSArIFwi5pS75Ye75LqG5pWM5Lq655qEXCIgKyBmaWdodEJnLmNuTmFtZSk7XHJcbiAgICAgICAgdmFyIF9zdHIgPSBcIuaIkeaWueeahFwiICsgRGF0YU1hbmFnZXIuaGVyb0ZpZ2h0ZXJDaG9pc2UuY25OYW1lICsgXCLmlLvlh7vkuobmlYzkurrnmoRcIiArIGZpZ2h0QmcuY25OYW1lO1xyXG4gICAgICAgIENvbnNvbGVMb2cubG9nKF9zdHIpO1xyXG4gICAgICAgIHZhciBfaGVyb0ZpZ2h0SFAgPSBEYXRhTWFuYWdlci5oZXJvRmlnaHRlckNob2lzZS5ocCAtIGZpZ2h0QmcuYXR0YWNrO1xyXG4gICAgICAgIHZhciBfZW5lbXlGaWdodEhQID0gZmlnaHRCZy5ocCAtIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVyQ2hvaXNlLmF0dGFjaztcclxuXHJcbiAgICAgICAgLy8g5pu05paw546p5a6255qE6ZqP5LuO55qEaHBcclxuICAgICAgICBEYXRhTWFuYWdlci5oZXJvRmlnaHRlckNob2lzZS5ocCA9IF9oZXJvRmlnaHRIUDtcclxuICAgICAgICBEYXRhTWFuYWdlci5oZXJvRmlnaHRlckNob2lzZS5hbHBoYSA9IDAuNztcclxuICAgICAgICBEYXRhTWFuYWdlci5oZXJvRmlnaHRlckNob2lzZS5zbGVlcCA9IHRydWU7XHJcbiAgICAgICAgRGF0YU1hbmFnZXIuaGVyb0ZpZ2h0ZXJDaG9pc2UuY2hpbGRyZW5bMl0uYWxwaGEgPSAwO1xyXG4gICAgICAgIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVyQ2hvaXNlLmNoaWxkcmVuWzFdLnNldFRleHQoX2hlcm9GaWdodEhQKTtcclxuXHJcbiAgICAgICAgLy8g5pu05paw5pWM5Lq655qE546p5a6255qEaHBcclxuICAgICAgICBmaWdodEJnLmhwID0gX2VuZW15RmlnaHRIUDtcclxuICAgICAgICBmaWdodEJnLmNoaWxkcmVuWzFdLnNldFRleHQoX2VuZW15RmlnaHRIUCk7XHJcblxyXG4gICAgICAgIGlmIChfaGVyb0ZpZ2h0SFAgPD0gMCkge1xyXG4gICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvRmlnaHRlckNob2lzZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVycy5yZUxpc3RPYmpzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoX2VuZW15RmlnaHRIUCA8PSAwKSB7XHJcbiAgICAgICAgICAgIGZpZ2h0QmcuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICBEYXRhTWFuYWdlci5lbmVteUZpZ2h0ZXJzLnJlTGlzdE9ianMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVyQ2hvaXNlID0gbnVsbDtcclxuICAgICAgICBcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbmVteUZpZ2h0ZXI7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlpiaTdnYlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXNcXFxcY2xhc3NcXFxcRW5lbXlGaWdodGVyLmpzXCIsXCIvbW9kdWxlc1xcXFxjbGFzc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxyXG4gKiDmlYzkurrnmoTmiYvniYznsbtcclxuICovXHJcblxyXG52YXIgSGFuZENhcm5kID0gcmVxdWlyZShcIi4vSGFuZENhcmRcIik7XHJcbnZhciB1dGlscyA9IHJlcXVpcmUoXCIuLi9VdGlsc1wiKTtcclxudmFyIENhcmRDb25maWcgPSByZXF1aXJlKFwiLi4vY29uZmlnL0NhcmRDb25maWdcIik7XHJcblxyXG5mdW5jdGlvbiBFbmVteUhhbmRDYXJkKGdhbWUpIHtcclxuICAgIEhhbmRDYXJuZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgLy8gdGhpcy5zZXRSZWFsSGFuZENhcmQoZ2FtZSk7IC8vIOecn+WunuWNoemdolxyXG4gICAgdGhpcy5idWlsZEhhbmRDYXJkVmlld0xpc3QoZ2FtZSk7IC8vIOiuvue9ruWNoeiDjFxyXG5cclxufVxyXG5cclxudXRpbHMuZXh0ZW5kKEVuZW15SGFuZENhcmQsIEhhbmRDYXJuZCk7XHJcblxyXG4vLyBAb3ZlcnJpZGUgIFxyXG4vLyDph43lhplyZWxpc3RIYW5kQ2FyZOaWueazlVxyXG5FbmVteUhhbmRDYXJkLnByb3RvdHlwZS5yZUxpc3RIYW5kQ2FyZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBfdGVtcCA9IFtdO1xyXG4gICAgLy8gY29uc29sZS5sb2coc2VsZi5jYXJkVmlld0xpc3QpO1xyXG5cclxuICAgIGlmIChzZWxmLmNhcmRWaWV3TGlzdC5sZW5ndGggPT0gMCkgeyAvLyDmsqHmnInmiYvniYznmoTmg4XlhrVcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZi5jYXJkVmlld0xpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuY2FyZFZpZXdMaXN0W2ldLmFsaXZlID09IHRydWUpIHsgLy8g5riF6Zmk5o6J5bey57uP6ZSA5q+B5LqG55qE5omL54mMXHJcbiAgICAgICAgICAgICAgICBfdGVtcC5wdXNoKHNlbGYuY2FyZFZpZXdMaXN0W2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBzZWxmLmNhcmRWaWV3TGlzdCA9IF90ZW1wO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNlbGYuY2FyZFZpZXdMaXN0Lmxlbmd0aDsgaisrKSB7IC8vIOmHjeaWsOWvueaJi+eJjOaOkuW6j1xyXG4gICAgICAgICAgICBzZWxmLmNhcmRWaWV3TGlzdFtqXS54ID0gc2VsZi54ICsgaiAqIDcwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLy8gQG92ZXJyaWRlIFxyXG4vLyDph43lhpnlm57lkIjlvIDlp4vml7bnmoTooaXniYzpgLvovpFcclxuRW5lbXlIYW5kQ2FyZC5wcm90b3R5cGUuYWRkQ2FyZCA9IGZ1bmN0aW9uIChnYW1lKSB7XHJcbiAgICB2YXIgX2NhcmRMaXN0ID0gdGhpcy5jYXJkSURMaXN0LnNwbGljZSgwLCAxKTtcclxuXHJcbiAgICBpZiAodGhpcy5jYXJkVmlld0xpc3QubGVuZ3RoID49IDgpIHtcclxuICAgICAgICBhbGVydChcIuaVjOS6uuW3sui+vuWIsOS4iumZkO+8jOW9k+WJjeWIsOeahOWNoeeJjOiiq+mUgOavgVwiKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBDYXJkQ29uZmlnLmNhcmRfaW5mby5sZW5ndGg7IGorKykge1xyXG5cclxuICAgICAgICBpZiAoX2NhcmRMaXN0WzBdID09IENhcmRDb25maWcuY2FyZF9pbmZvW2pdLmlkKSB7XHJcbiAgICAgICAgICAgIHZhciBjYXJkID0gZ2FtZS5hZGQuaW1hZ2UodGhpcy54ICsgdGhpcy5jYXJkVmlld0xpc3QubGVuZ3RoICogNzAsIHRoaXMueSwgXCJjYXJkX2JhY2tcIik7XHJcblxyXG4gICAgICAgICAgICAvLyDorr7nva7nm7jlupTnmoTmlbDmja5cclxuICAgICAgICAgICAgY2FyZC5jYXJkSW5mbyA9IHt9O1xyXG4gICAgICAgICAgICBjYXJkLmNhcmRJbmZvLkhQID0gQ2FyZENvbmZpZy5jYXJkX2luZm9bal0uaHA7IC8vIOihgOmHj1xyXG4gICAgICAgICAgICBjYXJkLmNhcmRJbmZvLmF0dGFjayA9IENhcmRDb25maWcuY2FyZF9pbmZvW2pdLmF0dGFjazsgLy8g5pS75Ye75YqbXHJcbiAgICAgICAgICAgIGNhcmQuY2FyZEluZm8uY25OYW1lID0gQ2FyZENvbmZpZy5jYXJkX2luZm9bal0uY25fbmFtZTsgLy8g5Lit5paH5ZCN56ewXHJcbiAgICAgICAgICAgIGNhcmQuY2FyZEluZm8uZmVlID0gQ2FyZENvbmZpZy5jYXJkX2luZm9bal0uZmVlOyAvLyDlj6zllKTotLnnlKhcclxuICAgICAgICAgICAgY2FyZC5jYXJkSW5mby5maWdodCA9IENhcmRDb25maWcuY2FyZF9pbmZvW2pdLmZpZ2h0OyAvLyDmiJjmlpflm77niYdcclxuICAgICAgICAgICAgY2FyZC5jYXJkSW5mby5jYXJkVHlwZSA9IENhcmRDb25maWcuY2FyZF9pbmZvW2pdLnR5cGU7IC8vIOWNoeeJjOexu+Wei1xyXG4gICAgICAgICAgICBjYXJkLnNjYWxlLnNldCgwLjUpO1xyXG4gICAgICAgICAgICB0aGlzLmNhcmRWaWV3TGlzdC5wdXNoKGNhcmQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbmVteUhhbmRDYXJkO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJaYmk3Z2JcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzXFxcXGNsYXNzXFxcXEVuZW15SGFuZENhcmQuanNcIixcIi9tb2R1bGVzXFxcXGNsYXNzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXHJcbiAqIOaVjOS6uuWktOWDj1xyXG4gKi9cclxuXHJcbnZhciB1dGlscyA9IHJlcXVpcmUoXCIuLi9VdGlsc1wiKTtcclxudmFyIEhlYWQgPSByZXF1aXJlKFwiLi9IZWFkXCIpO1xyXG52YXIgRGF0YU1hbmFnZXIgPSByZXF1aXJlKFwiLi9EYXRhTWFuYWdlclwiKTtcclxudmFyIENvbnNvbGVMb2cgPSByZXF1aXJlKFwiLi9Db25zb2xlTG9nXCIpO1xyXG5cclxuZnVuY3Rpb24gRW5lbXlIZWFkKGdhbWUsIHRleHR1cmVOYW1lLCBwb3NpdGlvblgsIHBvc2l0aW9uWSkge1xyXG4gICAgSGVhZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG4vLyDorr7nva7mlYzkurrlpLTlg49cclxuLy8gQG92ZXJyaWRl6YeN5YaZc2V0UGljXHJcbkhlYWQucHJvdG90eXBlLnNldFBpYyA9IGZ1bmN0aW9uIChnYW1lKSB7XHJcbiAgICB2YXIgcGljID0gZ2FtZS5hZGQuaW1hZ2UoMCwgMCwgdGhpcy50ZXh0dXJlTmFtZSk7XHJcblxyXG4gICAgcGljLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcbiAgICBwaWMuZXZlbnRzLm9uSW5wdXREb3duLmFkZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKERhdGFNYW5hZ2VyLmhlcm9GaWdodGVyQ2hvaXNlID09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBfaHAgPSBwYXJzZUludCh0aGlzLkhQT2JqLnRleHQpIC0gRGF0YU1hbmFnZXIuaGVyb0ZpZ2h0ZXJDaG9pc2UuYXR0YWNrO1xyXG4gICAgICAgICAgICB0aGlzLkhQT2JqLnNldFRleHQoX2hwKTtcclxuXHJcbiAgICAgICAgICAgIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVyQ2hvaXNlLmFscGhhID0gMC43O1xyXG4gICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvRmlnaHRlckNob2lzZS5zbGVlcCA9IHRydWU7XHJcbiAgICAgICAgICAgIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVyQ2hvaXNlLmNoaWxkcmVuWzJdLmFscGhhID0gMDtcclxuXHJcbiAgICAgICAgICAgIC8vIGFsZXJ0KFwi5oiR5pa555qEXCIgKyBEYXRhTWFuYWdlci5oZXJvRmlnaHRlckNob2lzZS5jbk5hbWUgKyBcIuaUu+WHu+S6huaVjOS6uuiLsembhFwiKTtcclxuICAgICAgICAgICAgdmFyIF9zdHIgPSBcIuaIkeaWueeahFwiICsgRGF0YU1hbmFnZXIuaGVyb0ZpZ2h0ZXJDaG9pc2UuY25OYW1lICsgXCLmlLvlh7vkuobmlYzkurroi7Hpm4RcIjtcclxuICAgICAgICAgICAgQ29uc29sZUxvZy5sb2coX3N0cik7XHJcbiAgICAgICAgICAgIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVyQ2hvaXNlID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJzZUludCh0aGlzLkhQT2JqLnRleHQpIDw9IDApIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwi546p5a626I635Y+W6IOc5Yip77yM5pWM5Lq66Zi15LqhXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gQ29uc29sZUxvZy5sb2coXCLnjqnlrrbojrflj5bog5zliKnvvIzmlYzkurrpmLXkuqFcIik7XHJcbiAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5yZXN1bHQgPSAxO1xyXG4gICAgICAgICAgICAgICAgZ2FtZS5zdGF0ZS5zdGFydChcIlJlc3VsdFNjZW5lXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sIHRoaXMpO1xyXG5cclxuICAgIHJldHVybiBwaWM7XHJcbn1cclxuXHJcbnV0aWxzLmV4dGVuZChFbmVteUhlYWQsIEhlYWQpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbmVteUhlYWQ7XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJaYmk3Z2JcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzXFxcXGNsYXNzXFxcXEVuZW15SGVhZC5qc1wiLFwiL21vZHVsZXNcXFxcY2xhc3NcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcclxuICog6LS555So566h55CG57G7XHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gRmVlKGdhbWUsIHgsIHkpIHtcclxuICAgIHRoaXMuZmVlT2JqID0gbnVsbDtcclxuICAgIHRoaXMueCA9IHggfHwgZ2FtZS53b3JsZC53aWR0aCAtIDMwO1xyXG4gICAgdGhpcy55ID0geSB8fCAwO1xyXG4gICAgdGhpcy5pbml0KGdhbWUpO1xyXG59XHJcblxyXG5GZWUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoZ2FtZSkge1xyXG4gICAgdGhpcy5mZWVPYmogPSB0aGlzLnNldEZlZVBpYyhnYW1lKTtcclxufVxyXG5cclxuLy8g6K6+572uRmVl6IOM5pmv5Lul5Y+K5paH5a2XXHJcbkZlZS5wcm90b3R5cGUuc2V0RmVlUGljID0gZnVuY3Rpb24gKGdhbWUpIHtcclxuICAgIHZhciBmZWUgPSBnYW1lLmFkZC5pbWFnZSh0aGlzLngsIHRoaXMueSwgXCJmZWVcIik7XHJcbiAgICB2YXIgdGV4dCA9IGdhbWUuYWRkLnRleHQoNjAsIDI4LCBcIjEvMVwiLCB7IGZpbGw6IFwiI2ZmZlwiLCBmb250U2l6ZTogXCIxOHB0XCIgfSk7XHJcbiAgICB0ZXh0LmFuY2hvci5zZXQoMC41KTtcclxuICAgIGZlZS5hZGRDaGlsZCh0ZXh0KTtcclxuICAgIHJldHVybiB0ZXh0O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZlZTtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlpiaTdnYlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXNcXFxcY2xhc3NcXFxcRmVlLmpzXCIsXCIvbW9kdWxlc1xcXFxjbGFzc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxyXG4gKiDmiJjmlpflhYPntKDnsbtcclxuICogQHBhcmFtIGdhbWUgXHJcbiAqIEBwYXJhbSB4IFtudW1iZXJdIOWIneWni+WMlueahFxyXG4gKi9cclxuXHJcbnZhciBEYXRhTWFuYWdlciA9IHJlcXVpcmUoXCIuL0RhdGFNYW5hZ2VyXCIpO1xyXG5cclxuZnVuY3Rpb24gRmlnaHRlcihnYW1lKSB7XHJcbiAgICB0aGlzLmZpZ2h0T2JqID0gW107IC8vIOaImOaWl+maj+S7juaVsOe7hFxyXG4gICAgdGhpcy54ID0gMTUwO1xyXG4gICAgdGhpcy55ID0gZ2FtZS53b3JsZC5jZW50ZXJZICsgMzA7XHJcbn1cclxuXHJcbkZpZ2h0ZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoZ2FtZSkge1xyXG59XHJcblxyXG4vLyDnlJ/miJDmiJjmlpfpmo/ku45cclxuRmlnaHRlci5wcm90b3R5cGUuYnVpbGRGaWdodGVyID0gZnVuY3Rpb24gKGdhbWUsIGhwLCBhdHRhY2ssIGNuTmFtZSwgcGljTmFtZSkge1xyXG4gICAgdmFyIGZpZ2h0QmcgPSBnYW1lLmFkZC5pbWFnZSh0aGlzLngsIHRoaXMueSwgcGljTmFtZSk7XHJcblxyXG4gICAgZmlnaHRCZy5ocCA9IGhwO1xyXG4gICAgZmlnaHRCZy5hdHRhY2sgPSBhdHRhY2s7XHJcbiAgICBmaWdodEJnLmNuTmFtZSA9IGNuTmFtZTtcclxuICAgIGZpZ2h0QmcucGljTmFtZSA9IHBpY05hbWU7XHJcbiAgICBmaWdodEJnLnNsZWVwID0gdHJ1ZTsgLy8g5LyR55yg54q25oCB77yM5Zyo5Ye654mM55qE56ys5LiA5Zue5ZCI5peg5rOV6L+b6KGM5pS75Ye7XHJcbiAgICBcclxuICAgIHZhciBfc3R5bGUgPSB7XHJcbiAgICAgICAgZmlsbDogXCIjZmZmXCIsXHJcbiAgICAgICAgZm9udFNpemU6IFwiMTJwdFwiXHJcbiAgICB9XHJcbiAgICAvLyDorr7nva7nlJ/lkb3lgLxcclxuICAgIHZhciBocF90ZXh0ID0gZ2FtZS5hZGQudGV4dCg3NSwgMTA1LCBocCwgX3N0eWxlKTtcclxuICAgIGhwX3RleHQuYW5jaG9yLnNldCgwLjUpO1xyXG4gICAgaHBfdGV4dC5rZXkgPSBcImhwXCI7XHJcblxyXG4gICAgLy8g6K6+572uXHJcbiAgICB2YXIgYXR0YWNrX3RleHQgPSBnYW1lLmFkZC50ZXh0KDE3LCAxMDUsIGF0dGFjaywgX3N0eWxlKTtcclxuICAgIGF0dGFja190ZXh0LmFuY2hvci5zZXQoMC41KTtcclxuICAgIGF0dGFja190ZXh0LmtleSA9IFwiYXR0YWNrXCI7XHJcblxyXG4gICAgdmFyIGF0dGFja190YWcgPSBnYW1lLmFkZC5pbWFnZSg0OCwgLTE1LCBcImF0dGFja19pY29uXCIpO1xyXG4gICAgYXR0YWNrX3RhZy5rZXkgPSBcImF0dGFja190YWdcIjtcclxuICAgIGF0dGFja190YWcuc2NhbGUuc2V0KDAuNSk7XHJcbiAgICBhdHRhY2tfdGFnLmFuY2hvci5zZXQoMC41KTtcclxuICAgIGF0dGFja190YWcuYWxwaGEgPSAwO1xyXG5cclxuICAgIGZpZ2h0QmcuYWRkQ2hpbGQoYXR0YWNrX3RleHQpO1xyXG4gICAgZmlnaHRCZy5hZGRDaGlsZChocF90ZXh0KTtcclxuICAgIGZpZ2h0QmcuYWRkQ2hpbGQoYXR0YWNrX3RhZyk7XHJcbiAgICBmaWdodEJnLmFscGhhID0gMC43OyAvLyBzbGVlcOeKtuaAgeaXoOazleaUu+WHu1xyXG4gICAgdGhpcy5maWdodE9iai5wdXNoKGZpZ2h0QmcpO1xyXG4gICAgdGhpcy5yZUxpc3RPYmpzKCk7XHJcblxyXG4gICAgZmlnaHRCZy5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG4gICAgZmlnaHRCZy5ldmVudHMub25JbnB1dERvd24uYWRkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLmNob2ljZUZpZ2h0ZXIoZmlnaHRCZyk7XHJcbiAgICB9LCB0aGlzKTtcclxuXHJcbn1cclxuXHJcbkZpZ2h0ZXIucHJvdG90eXBlLnJlTGlzdE9ianMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5maWdodE9iai5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgIC8vIOWmguaenOmaj+S7jueahOmYn+WIl+S4uuepuu+8jOS4jei/m+ihjOaOkuW6j1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIF90ZW1wPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKHZhciBqID0gMDsgajx0aGlzLmZpZ2h0T2JqLmxlbmd0aDtqKyspe1xyXG4gICAgICAgICAgICBpZih0aGlzLmZpZ2h0T2JqW2pdLmFsaXZlID09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgX3RlbXAucHVzaCh0aGlzLmZpZ2h0T2JqW2pdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5maWdodE9iaiA9IF90ZW1wO1xyXG5cclxuICAgICAgICAvLyDph43mjpLmiJjmlpfpmo/ku47nmoTmlbDnu4RcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZmlnaHRPYmoubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5maWdodE9ialtpXS54ID0gdGhpcy54ICsgaSAqIDk1O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuRmlnaHRlci5wcm90b3R5cGUuYXdha2VGaWdodGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuZmlnaHRPYmoubGVuZ3RoID09IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZmlnaHRPYmoubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5maWdodE9ialtpXS5zbGVlcCA9IGZhbHNlOyAvLyDop6PpmaTnnaHnnKDnirbmgIFcclxuICAgICAgICAgICAgdGhpcy5maWdodE9ialtpXS5hbHBoYSA9IDE7IC8vIOino+mZpOedoeecoOeKtuaAgeWQjueahHZpZXdcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5GaWdodGVyLnByb3RvdHlwZS5jaG9pY2VGaWdodGVyID0gZnVuY3Rpb24gKGZpZ2h0QmcpIHtcclxuICAgIGlmIChmaWdodEJnLnNsZWVwID09IHRydWUpIHtcclxuICAgICAgICBhbGVydChcIuacrOWbnuWQiOaXoOazleaTjeS9nOivpemaj+S7ju+8gVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBlbHNlIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZmlnaHRPYmoubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5maWdodE9ialtpXS5jaGlsZHJlblsyXS5hbHBoYSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpZ2h0QmcuY2hpbGRyZW5bMl0uYWxwaGEgPSAxO1xyXG4gICAgICAgIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVyQ2hvaXNlID0gZmlnaHRCZztcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGaWdodGVyO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJaYmk3Z2JcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzXFxcXGNsYXNzXFxcXEZpZ2h0ZXIuanNcIixcIi9tb2R1bGVzXFxcXGNsYXNzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXHJcbiAqIOaJi+eJjOexu1xyXG4gKi9cclxuXHJcbnZhciBDYXJkR2VuZXJhdGVyID0gcmVxdWlyZShcIi4vQ2FyZEdlbmVyYXRlclwiKTtcclxudmFyIENhcmRDb25maWcgPSByZXF1aXJlKFwiLi4vY29uZmlnL0NhcmRDb25maWdcIik7XHJcbnZhciBEYXRhTWFuYWdlciA9IHJlcXVpcmUoXCIuL0RhdGFNYW5hZ2VyXCIpO1xyXG5cclxuZnVuY3Rpb24gSGFuZENhcmQoZ2FtZSwgeCwgeSkge1xyXG4gICAgdGhpcy5jYXJkT2JqTGlzdCA9IFtdOyAvLyDmiYvniYzlr7nosaHmlbDnu4RcclxuICAgIHRoaXMuY2FyZFZpZXdMaXN0ID0gW107IC8vIOaJi+eJjOinhuWbvuaVsOe7hFxyXG4gICAgdGhpcy5jYXJkSURMaXN0ID0gW107XHJcbiAgICB0aGlzLnggPSB4IHx8IDE0MDtcclxuICAgIHRoaXMueSA9IHkgfHwgMjA7XHJcbiAgICB0aGlzLmluaXQoZ2FtZSk7XHJcbn1cclxuXHJcbkhhbmRDYXJkLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKGdhbWUpIHtcclxuICAgIHRoaXMuY2FyZElETGlzdCA9IHRoaXMuc2V0SGFuZENhcmRMaXN0KCk7XHJcbiAgICAvLyB0aGlzLmJ1aWxkSGFuZENhcmRWaWV3TGlzdChnYW1lKTsgLy8g6K6+572u5Y2h6IOMXHJcbiAgICAvLyB0aGlzLnNldFJlYWxIYW5kQ2FyZChnYW1lKTsgLy8g55yf5a6e5Y2h6Z2iXHJcbn1cclxuXHJcbi8vIOaehOW7uuaJi+eJjOaVsOe7hHZpZXcgICjljaHog4wpXHJcbkhhbmRDYXJkLnByb3RvdHlwZS5idWlsZEhhbmRDYXJkVmlld0xpc3QgPSBmdW5jdGlvbiAoZ2FtZSkge1xyXG4gICAgLy8g5oiq5Y+W5Y2h57uE5Lit55qE5YmN5Zub5bygXHJcbiAgICB2YXIgX2xpc3QgPSB0aGlzLmNhcmRJRExpc3Quc3BsaWNlKDAsIDQpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBDYXJkQ29uZmlnLmNhcmRfaW5mby5sZW5ndGg7IGorKykge1xyXG5cclxuICAgICAgICAgICAgaWYgKF9saXN0W2ldID09IENhcmRDb25maWcuY2FyZF9pbmZvW2pdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FyZCA9IGdhbWUuYWRkLmltYWdlKHRoaXMueCArIGkgKiA3MCwgdGhpcy55LCBcImNhcmRfYmFja1wiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDorr7nva7nm7jlupTnmoTmlbDmja5cclxuICAgICAgICAgICAgICAgIGNhcmQuY2FyZEluZm8gPSB7fTtcclxuICAgICAgICAgICAgICAgIGNhcmQuY2FyZEluZm8uSFAgPSBDYXJkQ29uZmlnLmNhcmRfaW5mb1tqXS5ocDsgLy8g6KGA6YePXHJcbiAgICAgICAgICAgICAgICBjYXJkLmNhcmRJbmZvLmF0dGFjayA9IENhcmRDb25maWcuY2FyZF9pbmZvW2pdLmF0dGFjazsgLy8g5pS75Ye75YqbXHJcbiAgICAgICAgICAgICAgICBjYXJkLmNhcmRJbmZvLmNuTmFtZSA9IENhcmRDb25maWcuY2FyZF9pbmZvW2pdLmNuX25hbWU7IC8vIOS4reaWh+WQjeensFxyXG4gICAgICAgICAgICAgICAgY2FyZC5jYXJkSW5mby5mZWUgPSBDYXJkQ29uZmlnLmNhcmRfaW5mb1tqXS5mZWU7IC8vIOWPrOWUpOi0ueeUqFxyXG4gICAgICAgICAgICAgICAgY2FyZC5jYXJkSW5mby5maWdodCA9IENhcmRDb25maWcuY2FyZF9pbmZvW2pdLmZpZ2h0OyAvLyDmiJjmlpflm77niYdcclxuICAgICAgICAgICAgICAgIGNhcmQuY2FyZEluZm8uY2FyZFR5cGUgPSBDYXJkQ29uZmlnLmNhcmRfaW5mb1tqXS50eXBlOyAvLyDljaHniYznsbvlnotcclxuICAgICAgICAgICAgICAgIGNhcmQuc2NhbGUuc2V0KDAuNSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhcmRWaWV3TGlzdC5wdXNoKGNhcmQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vLyDorr7nva7ljaHniYznmoTmlbDmja7mmL7npLogKOWNoemdoilcclxuSGFuZENhcmQucHJvdG90eXBlLnNldFJlYWxIYW5kQ2FyZCA9IGZ1bmN0aW9uIChnYW1lKSB7XHJcbiAgICB2YXIgX2xpc3QgPSB0aGlzLmNhcmRJRExpc3Quc3BsaWNlKDAsIDQpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBDYXJkQ29uZmlnLmNhcmRfaW5mby5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoX2xpc3RbaV0gPT0gQ2FyZENvbmZpZy5jYXJkX2luZm9bal0uaWQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjYXJkID0gZ2FtZS5hZGQuaW1hZ2UodGhpcy54ICsgaSAqIDc1LCB0aGlzLnksIENhcmRDb25maWcuY2FyZF9pbmZvW2pdLm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgY2FyZC5jYXJkSW5mbyA9IHt9O1xyXG4gICAgICAgICAgICAgICAgY2FyZC5jYXJkSW5mby5IUCA9IENhcmRDb25maWcuY2FyZF9pbmZvW2pdLmhwOyAvLyDooYDph49cclxuICAgICAgICAgICAgICAgIGNhcmQuY2FyZEluZm8uYXR0YWNrID0gQ2FyZENvbmZpZy5jYXJkX2luZm9bal0uYXR0YWNrOyAvLyDmlLvlh7vliptcclxuICAgICAgICAgICAgICAgIGNhcmQuY2FyZEluZm8uY25OYW1lID0gQ2FyZENvbmZpZy5jYXJkX2luZm9bal0uY25fbmFtZTsgLy8g5Lit5paH5ZCN56ewXHJcbiAgICAgICAgICAgICAgICBjYXJkLmNhcmRJbmZvLmZlZSA9IENhcmRDb25maWcuY2FyZF9pbmZvW2pdLmZlZTsgLy8g5Y+s5ZSk6LS555SoXHJcbiAgICAgICAgICAgICAgICBjYXJkLmNhcmRJbmZvLmZpZ2h0ID0gQ2FyZENvbmZpZy5jYXJkX2luZm9bal0uZmlnaHQ7IC8vIOaImOaWl+WbvueJh1xyXG4gICAgICAgICAgICAgICAgY2FyZC5jYXJkSW5mby5jYXJkVHlwZSA9IENhcmRDb25maWcuY2FyZF9pbmZvW2pdLnR5cGU7IC8vIOWNoeeJjOexu+Wei1xyXG4gICAgICAgICAgICAgICAgY2FyZC5zY2FsZS5zZXQoMC41KTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhcmRPYmpMaXN0LnB1c2goY2FyZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FyZC5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgY2FyZC5ldmVudHMub25JbnB1dERvd24uYWRkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlucHV0RW5hYmxlZCA9IGZhbHNlOyAvLyDnpoHmraLnjqnlrrbkuI3lgZzngrnlh7tcclxuICAgICAgICAgICAgICAgICAgICBpZiAoRGF0YU1hbmFnZXIuaGVyb0Nob2lzZUNhcmQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvQ2hvaXNlQ2FyZCA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5rOo5YaM5Yqo55S75LqL5Lu2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0d2VlbiA9IGdhbWUuYWRkLnR3ZWVuKERhdGFNYW5hZ2VyLmhlcm9DaG9pc2VDYXJkKS50byh7IHk6IERhdGFNYW5hZ2VyLmhlcm9DaG9pc2VDYXJkLnkgKyAyMCB9LCAyMDAsIFwiTGluZWFyXCIsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvQ2hvaXNlQ2FyZC5pbnB1dEVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmiafooYzliqjnlLtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW4uc3RhcnQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuaGVyb0Nob2lzZUNhcmQgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHR3ZWVuID0gZ2FtZS5hZGQudHdlZW4odGhpcykudG8oeyB5OiB0aGlzLnkgLSAyMCB9LCAyMDAsIFwiTGluZWFyXCIsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHR3ZWVuLnN0YXJ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdHdlZW4ub25Db21wbGV0ZS5hZGQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSwgY2FyZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIOWbnuWQiOW8gOWni+aXtueahOihpeeJjOmAu+i+kVxyXG5IYW5kQ2FyZC5wcm90b3R5cGUuYWRkQ2FyZCA9IGZ1bmN0aW9uIChnYW1lKSB7XHJcbiAgICB2YXIgX2NhcmRMaXN0ID0gdGhpcy5jYXJkSURMaXN0LnNwbGljZSgwLCAxKTtcclxuXHJcbiAgICBpZiAodGhpcy5jYXJkT2JqTGlzdC5sZW5ndGggPj0gOCkge1xyXG4gICAgICAgIGFsZXJ0KFwi5L2g55qE5omL54mM5bey6L6+5Yiw5LiK6ZmQ77yM5b2T5YmN5Yiw55qE5Y2h54mM6KKr6ZSA5q+BXCIpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IENhcmRDb25maWcuY2FyZF9pbmZvLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgaWYgKF9jYXJkTGlzdFswXSA9PSBDYXJkQ29uZmlnLmNhcmRfaW5mb1tqXS5pZCkge1xyXG4gICAgICAgICAgICB2YXIgY2FyZCA9IGdhbWUuYWRkLmltYWdlKHRoaXMueCArICh0aGlzLmNhcmRPYmpMaXN0Lmxlbmd0aCkgKiA3NSwgdGhpcy55LCBDYXJkQ29uZmlnLmNhcmRfaW5mb1tqXS5uYW1lKTtcclxuICAgICAgICAgICAgY2FyZC5jYXJkSW5mbyA9IHt9O1xyXG4gICAgICAgICAgICBjYXJkLmNhcmRJbmZvLkhQID0gQ2FyZENvbmZpZy5jYXJkX2luZm9bal0uaHA7IC8vIOihgOmHj1xyXG4gICAgICAgICAgICBjYXJkLmNhcmRJbmZvLmF0dGFjayA9IENhcmRDb25maWcuY2FyZF9pbmZvW2pdLmF0dGFjazsgLy8g5pS75Ye75YqbXHJcbiAgICAgICAgICAgIGNhcmQuY2FyZEluZm8uY25OYW1lID0gQ2FyZENvbmZpZy5jYXJkX2luZm9bal0uY25fbmFtZTsgLy8g5Lit5paH5ZCN56ewXHJcbiAgICAgICAgICAgIGNhcmQuY2FyZEluZm8uZmVlID0gQ2FyZENvbmZpZy5jYXJkX2luZm9bal0uZmVlOyAvLyDlj6zllKTotLnnlKhcclxuICAgICAgICAgICAgY2FyZC5jYXJkSW5mby5maWdodCA9IENhcmRDb25maWcuY2FyZF9pbmZvW2pdLmZpZ2h0OyAvLyDmiJjmlpflm77niYdcclxuICAgICAgICAgICAgY2FyZC5jYXJkSW5mby5jYXJkVHlwZSA9IENhcmRDb25maWcuY2FyZF9pbmZvW2pdLnR5cGU7Ly8g5Y2h54mM57G75Z6LXHJcbiAgICAgICAgICAgIGNhcmQuc2NhbGUuc2V0KDAuNSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNhcmRPYmpMaXN0LnB1c2goY2FyZCk7XHJcblxyXG4gICAgICAgICAgICBjYXJkLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGNhcmQuZXZlbnRzLm9uSW5wdXREb3duLmFkZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0RW5hYmxlZCA9IGZhbHNlOyAvLyDnpoHmraLnjqnlrrbkuI3lgZzngrnlh7tcclxuICAgICAgICAgICAgICAgIGlmIChEYXRhTWFuYWdlci5oZXJvQ2hvaXNlQ2FyZCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuaGVyb0Nob2lzZUNhcmQgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHsgXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5rOo5YaM5Yqo55S75LqL5Lu2XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHR3ZWVuID0gZ2FtZS5hZGQudHdlZW4oRGF0YU1hbmFnZXIuaGVyb0Nob2lzZUNhcmQpLnRvKHsgeTogRGF0YU1hbmFnZXIuaGVyb0Nob2lzZUNhcmQueSArIDIwIH0sIDIwMCwgXCJMaW5lYXJcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuaGVyb0Nob2lzZUNhcmQuaW5wdXRFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAvLyDmiafooYzliqjnlLtcclxuICAgICAgICAgICAgICAgICAgICB0d2Vlbi5zdGFydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLmhlcm9DaG9pc2VDYXJkID0gdGhpcztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdHdlZW4gPSBnYW1lLmFkZC50d2Vlbih0aGlzKS50byh7IHk6IHRoaXMueSAtIDIwIH0sIDIwMCwgXCJMaW5lYXJcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0d2Vlbi5zdGFydCgpO1xyXG4gICAgICAgICAgICAgICAgdHdlZW4ub25Db21wbGV0ZS5hZGQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sIGNhcmQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLy8g6YeN5paw5a+55omL54mM5o6S5bqPXHJcbkhhbmRDYXJkLnByb3RvdHlwZS5yZUxpc3RIYW5kQ2FyZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBfdGVtcCA9IFtdO1xyXG4gICAgaWYgKHNlbGYuY2FyZE9iakxpc3QubGVuZ3RoID09IDApIHsgLy8g5rKh5pyJ5omL54mM55qE5oOF5Ya1XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYuY2FyZE9iakxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuY2FyZE9iakxpc3RbaV0uYWxpdmUgPT0gdHJ1ZSkgeyAvLyDmuIXpmaTmjonlt7Lnu4/plIDmr4HkuobnmoTmiYvniYxcclxuICAgICAgICAgICAgICAgIF90ZW1wLnB1c2goc2VsZi5jYXJkT2JqTGlzdFtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgc2VsZi5jYXJkT2JqTGlzdCA9IF90ZW1wO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHNlbGYuY2FyZE9iakxpc3QubGVuZ3RoOyBqKyspIHsgLy8g6YeN5paw5a+55omL54mM5o6S5bqPXHJcbiAgICAgICAgICAgIHNlbGYuY2FyZE9iakxpc3Rbal0ueCA9IHNlbGYueCArIGogKiA3NTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiAg55Sf5oiQ5Y2h54mMaWTmlbDnu4RcclxuICogQHJldHVybiB7YXJyYXl9IOWNoee7hOeahGlk5pWw57uEXHJcbiAqL1xyXG5IYW5kQ2FyZC5wcm90b3R5cGUuc2V0SGFuZENhcmRMaXN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGNhcmRHZW5lcmF0ZXIgPSBuZXcgQ2FyZEdlbmVyYXRlcigpOyBcclxuXHJcbiAgICB2YXIgY2FyZElETGlzdCA9IGNhcmRHZW5lcmF0ZXIuYnVpbGRDYXJkTGlzdChDYXJkQ29uZmlnLmNhcmRMZW5ndGgsIDEsIENhcmRDb25maWcuY2FyZF9pbmZvLmxlbmd0aCk7XHJcbiAgICByZXR1cm4gY2FyZElETGlzdDtcclxufVxyXG5cclxuLy8g6YCa6L+HaWTmnoTlu7rnnJ/lrp7miYvniYxcclxubW9kdWxlLmV4cG9ydHMgPSBIYW5kQ2FyZDtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiWmJpN2diXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlc1xcXFxjbGFzc1xcXFxIYW5kQ2FyZC5qc1wiLFwiL21vZHVsZXNcXFxcY2xhc3NcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcclxuICog6KeS6Imy5aS05YOP57G7XHJcbiAqIEBwYXJhbSBnYW1lIFtvYmpdIOa4uOaIj+WcuuaZr+WvueixoVxyXG4gKiBAcGFyYW0gdGV4dHVyZU5hbWUgW3N0cmluZ10g5Zu+54mHa2V5XHJcbiAqIEBwYXJhbSBwb3NpdGlvblggW251bWJlcl0g5Yid5aeL5YyW55qEeOWdkOagh1xyXG4gKiBAcGFyYW0gcG9zaXRpb25ZIFtudW1iZXJdIOWIneWni+WMlueahHnlnZDmoIdcclxuICovXHJcblxyXG5mdW5jdGlvbiBIZWFkKGdhbWUsIHRleHR1cmVOYW1lLCBwb3NpdGlvblgsIHBvc2l0aW9uWSkge1xyXG5cdHRoaXMuaGVhZE9iaiA9IG51bGw7XHJcblx0dGhpcy54ID0gcG9zaXRpb25YO1xyXG5cdHRoaXMueSA9IHBvc2l0aW9uWTtcclxuXHR0aGlzLkhQT2JqID0gbnVsbDsgIC8vIOiLsembhOihgOmHj1xyXG5cdHRoaXMudGV4dHVyZU5hbWUgPSB0ZXh0dXJlTmFtZTtcclxuXHR0aGlzLmluaXQoZ2FtZSk7XHJcbn1cclxuXHJcbkhlYWQucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoZ2FtZSkge1xyXG5cdHRoaXMuaGVhZE9iaiA9IHRoaXMuc2V0UGljKGdhbWUpO1xyXG5cdHRoaXMuSFBPYmogPSB0aGlzLnNldEhQKGdhbWUpO1xyXG59XHJcblxyXG4vLyDorr7nva7oi7Hpm4TlpLTlg49cclxuSGVhZC5wcm90b3R5cGUuc2V0UGljID0gZnVuY3Rpb24gKGdhbWUpIHtcclxuXHR2YXIgcGljID0gZ2FtZS5hZGQuaW1hZ2UodGhpcy54LCB0aGlzLnksIHRoaXMudGV4dHVyZU5hbWUpO1xyXG5cdHJldHVybiBwaWM7XHJcbn1cclxuXHJcbi8vIOiuvue9ruihgOmHj1xyXG5IZWFkLnByb3RvdHlwZS5zZXRIUCA9IGZ1bmN0aW9uIChnYW1lKSB7XHJcblx0dmFyIEhQYmcgPSBnYW1lLmFkZC5pbWFnZSgxMCwgMTcwLCBcImhwX2JhY2tncm91bmRcIik7XHJcblx0dmFyIEhQID0gZ2FtZS5hZGQudGV4dChIUGJnLndpZHRoIC8gMiwgSFBiZy5oZWlnaHQgLyAyICsgNSwgXCIzMFwiLCB7IGZpbGw6IFwiI2ZmZlwiLCBmb250U2l6ZTogXCIyNHB0XCIgfSk7XHJcblx0SFAuYW5jaG9yLnNldCgwLjUpO1xyXG5cdEhQYmcuYWRkQ2hpbGQoSFApO1xyXG5cclxuXHRyZXR1cm4gSFA7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGVhZDtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiWmJpN2diXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlc1xcXFxjbGFzc1xcXFxIZWFkLmpzXCIsXCIvbW9kdWxlc1xcXFxjbGFzc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxyXG4gKiDnjqnlrrbmsLTmmbbnrqHnkIZcclxuICovXHJcblxyXG52YXIgRmVlID0gcmVxdWlyZShcIi4vRmVlXCIpO1xyXG52YXIgdXRpbHMgPSByZXF1aXJlKFwiLi4vVXRpbHNcIik7XHJcblxyXG5mdW5jdGlvbiBIZXJvRmVlKGdhbWUpIHtcclxuICAgIEZlZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG51dGlscy5leHRlbmQoSGVyb0ZlZSwgRmVlKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGVyb0ZlZTtcclxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlpiaTdnYlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXNcXFxcY2xhc3NcXFxcSGVyb0ZlZS5qc1wiLFwiL21vZHVsZXNcXFxcY2xhc3NcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcclxuICogSGVyb+aImOaWl+maj+S7jlxyXG4gKi9cclxuXHJcbnZhciBGaWdodGVyID0gcmVxdWlyZShcIi4vRmlnaHRlclwiKTtcclxudmFyIHV0aWxzID0gcmVxdWlyZShcIi4uL1V0aWxzXCIpO1xyXG5cclxuZnVuY3Rpb24gSGVyb0ZpZ2h0ZXIoZ2FtZSl7XHJcbiAgICBGaWdodGVyLmFwcGx5KHRoaXMsYXJndW1lbnRzKTtcclxufVxyXG5cclxudXRpbHMuZXh0ZW5kKEhlcm9GaWdodGVyLEZpZ2h0ZXIpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIZXJvRmlnaHRlcjtcclxuXHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJaYmk3Z2JcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzXFxcXGNsYXNzXFxcXEhlcm9GaWdodGVyLmpzXCIsXCIvbW9kdWxlc1xcXFxjbGFzc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxyXG4gKiDoi7Hpm4TnmoTmiYvniYznsbtcclxuICovXHJcblxyXG52YXIgSGFuZENhcm5kID0gcmVxdWlyZShcIi4vSGFuZENhcmRcIik7XHJcbnZhciB1dGlscyA9IHJlcXVpcmUoXCIuLi9VdGlsc1wiKTtcclxudmFyIENhcmRHZW5lcmF0ZXIgPSByZXF1aXJlKFwiLi9DYXJkR2VuZXJhdGVyXCIpO1xyXG52YXIgRGF0YU1hbmFnZXIgPSByZXF1aXJlKFwiLi9EYXRhTWFuYWdlclwiKTtcclxudmFyIENhcmRDb25maWcgPSByZXF1aXJlKFwiLi4vY29uZmlnL0NhcmRDb25maWdcIik7XHJcblxyXG5mdW5jdGlvbiBIZXJvSGFuZENhcmQoZ2FtZSwgeCwgeSkge1xyXG4gICAgSGFuZENhcm5kLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblx0dGhpcy5zZXRSZWFsSGFuZENhcmQoZ2FtZSk7IC8vIOiuvue9ruecn+WunuWNoemdolxyXG59XHJcblxyXG51dGlscy5leHRlbmQoSGVyb0hhbmRDYXJkLCBIYW5kQ2FybmQpO1xyXG5cclxuLypcclxuXHRAIG92ZXJyaWRlIFxyXG4gKi9cclxuSGVyb0hhbmRDYXJkLnByb3RvdHlwZS5zZXRIYW5kQ2FyZExpc3QgPSBmdW5jdGlvbigpe1xyXG5cdHZhciBjYXJkR2VuZXJhdGVyID0gbmV3IENhcmRHZW5lcmF0ZXIoKTtcclxuXHJcbiAgICBpZihEYXRhTWFuYWdlci5oZXJvSGFuZENhcmRJRExpc3QubGVuZ3RoID09IDApe1xyXG4gICAgICAgIHZhciBjYXJkSURMaXN0ID0gY2FyZEdlbmVyYXRlci5idWlsZENhcmRMaXN0KENhcmRDb25maWcuY2FyZExlbmd0aCwgMSwgQ2FyZENvbmZpZy5jYXJkX2luZm8ubGVuZ3RoKTtcclxuICAgICAgICByZXR1cm4gY2FyZElETGlzdDtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHZhciBjYXJkSURMaXN0ID0gY2FyZEdlbmVyYXRlci5idWlsZENhcmRMaXN0QnlVc2VyQ2hvaXNlKENhcmRDb25maWcuY2FyZExlbmd0aCwgRGF0YU1hbmFnZXIuaGVyb0hhbmRDYXJkSURMaXN0KTtcclxuICAgICAgICByZXR1cm4gY2FyZElETGlzdDtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIZXJvSGFuZENhcmQ7XHJcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJaYmk3Z2JcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzXFxcXGNsYXNzXFxcXEhlcm9IYW5kQ2FyZC5qc1wiLFwiL21vZHVsZXNcXFxcY2xhc3NcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcclxuICog546p5a626KeS6Imy5aS05YOPXHJcbiAqL1xyXG52YXIgdXRpbHMgPSByZXF1aXJlKFwiLi4vVXRpbHNcIik7XHJcbnZhciBIZWFkID0gcmVxdWlyZShcIi4vSGVhZFwiKTtcclxuXHJcbmZ1bmN0aW9uIEhlcm9IZWFkKGdhbWUsIHRleHR1cmVOYW1lLCBwb3NpdGlvblgsIHBvc2l0aW9uWSkge1xyXG4gICAgSGVhZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG59XHJcblxyXG4vLyBIZXJvSGVhZOe7p+aJv+iHqkhlYWTnsbtcclxudXRpbHMuZXh0ZW5kKEhlcm9IZWFkLCBIZWFkKTtcclxuXHJcbi8qKlxyXG4gKiAgQG92ZXJyaWRlIOmHjeWGmXNldEhQ5pa55rOVXHJcbiAqL1xyXG5IZXJvSGVhZC5wcm90b3R5cGUuc2V0SFAgPSBmdW5jdGlvbihnYW1lKSB7XHJcbiAgICB2YXIgSFBiZyA9IGdhbWUuYWRkLmltYWdlKHRoaXMueCwgdGhpcy55IC0gNTUsIFwiaHBfYmFja2dyb3VuZFwiKTtcclxuICAgIHZhciBIUCA9IGdhbWUuYWRkLnRleHQoSFBiZy53aWR0aCAvIDIsIEhQYmcuaGVpZ2h0IC8gMiArIDUsIFwiMzBcIiwge1xyXG4gICAgICAgIGZpbGw6IFwiI2ZmZlwiLFxyXG4gICAgICAgIGZvbnRTaXplOiBcIjI0cHRcIlxyXG4gICAgfSk7XHJcbiAgICBIUC5hbmNob3Iuc2V0KDAuNSk7XHJcbiAgICBIUGJnLmFkZENoaWxkKEhQKTtcclxuXHJcbiAgICByZXR1cm4gSFA7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGVyb0hlYWQ7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlpiaTdnYlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXNcXFxcY2xhc3NcXFxcSGVyb0hlYWQuanNcIixcIi9tb2R1bGVzXFxcXGNsYXNzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXHJcbiAqIOWJqeS9meeahOWNoeeJjOaYvuekulxyXG4gKi9cclxuXHJcbnZhciBEYXRhTWFuYWdlciA9IHJlcXVpcmUoXCIuL0RhdGFNYW5hZ2VyXCIpO1xyXG5cclxuZnVuY3Rpb24gUmVtYWluQ2FyZChnYW1lKSB7XHJcblx0dGhpcy5oZXJvUmVtYWluQ2FyZCA9IG51bGw7XHJcblx0dGhpcy5lbmVteVJlbWFpbkNhcmQgPSBudWxsO1xyXG5cdHRoaXMuaW5pdChnYW1lKTtcclxufVxyXG5cclxuUmVtYWluQ2FyZC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIChnYW1lKSB7XHJcblx0dGhpcy5oZXJvUmVtYWluQ2FyZCA9IHRoaXMuc2V0SGVyb1JlbWFpbkNhcmQoZ2FtZSk7XHJcblx0dGhpcy5lbmVteVJlbWFpbkNhcmQgPSB0aGlzLnNldEVuZW15UmVtYWluQ2FyZChnYW1lKTtcclxufVxyXG5cclxuLy8g6K6+572u6Iux6ZuE55qE5Ymp5L2Z5Y2h54mH5o+Q56S6XHJcblJlbWFpbkNhcmQucHJvdG90eXBlLnNldEhlcm9SZW1haW5DYXJkID0gZnVuY3Rpb24gKGdhbWUpIHtcclxuXHR2YXIgaW1hZ2UgPSBnYW1lLmFkZC5pbWFnZSg2ODAsIGdhbWUud29ybGQuY2VudGVyWSArIDEwMCwgXCJjYXJkX2JhY2tcIik7XHJcblx0aW1hZ2Uuc2NhbGUuc2V0KDAuMyk7XHJcblxyXG5cdHZhciB0ZXh0ID0gZ2FtZS5hZGQudGV4dCg2ODAsIGdhbWUud29ybGQuY2VudGVyWSArIDE2MCxEYXRhTWFuYWdlci5oZXJvSGFuZENhcmQuY2FyZElETGlzdC5sZW5ndGgse1xyXG5cdFx0ZmlsbDpcIiMzMzMzMzNcIixcclxuXHRcdGZvbnRTaXplOlwiMThwdFwiXHJcblx0fSk7XHJcblxyXG5cdHJldHVybiB7aW1hZ2UsdGV4dH1cclxufVxyXG5cclxuLy8g6K6+572u5pWM5Lq655qE5Ymp5L2Z5Y2h54mM5o+Q56S6XHJcblJlbWFpbkNhcmQucHJvdG90eXBlLnNldEVuZW15UmVtYWluQ2FyZCA9IGZ1bmN0aW9uIChnYW1lKSB7XHJcblx0dmFyIGltYWdlID0gZ2FtZS5hZGQuaW1hZ2UoNjgwLCBnYW1lLndvcmxkLmNlbnRlclkgLSAxNjAgLCBcImNhcmRfYmFja1wiKTtcclxuXHRpbWFnZS5zY2FsZS5zZXQoMC4zKTtcclxuXHJcblx0dmFyIHRleHQgPSBnYW1lLmFkZC50ZXh0KDY4MCwgZ2FtZS53b3JsZC5jZW50ZXJZIC0gMTkwLERhdGFNYW5hZ2VyLmVuZW15SGFuZENhcmQuY2FyZElETGlzdC5sZW5ndGgse1xyXG5cdFx0ZmlsbDpcIiMzMzMzMzNcIixcclxuXHRcdGZvbnRTaXplOlwiMThwdFwiXHJcblx0fSk7XHJcblx0cmV0dXJuIHtpbWFnZSx0ZXh0fVxyXG59XHJcblxyXG4vLyDliLfmlrDliankvZnnmoTljaHniYzmlbDph49cclxuUmVtYWluQ2FyZC5wcm90b3R5cGUucmVmcmVzaCA9IGZ1bmN0aW9uKCl7XHJcblx0dGhpcy5oZXJvUmVtYWluQ2FyZC50ZXh0LnNldFRleHQoRGF0YU1hbmFnZXIuaGVyb0hhbmRDYXJkLmNhcmRJRExpc3QubGVuZ3RoKTtcclxuXHR0aGlzLmVuZW15UmVtYWluQ2FyZC50ZXh0LnNldFRleHQoRGF0YU1hbmFnZXIuZW5lbXlIYW5kQ2FyZC5jYXJkSURMaXN0Lmxlbmd0aCk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVtYWluQ2FyZDtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiWmJpN2diXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlc1xcXFxjbGFzc1xcXFxSZW1haW5DYXJkLmpzXCIsXCIvbW9kdWxlc1xcXFxjbGFzc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxyXG4gKiBVSeeVjOmdoueuoeeQhlxyXG4gKi9cclxuXHJcbnZhciBCYWNrR3JvdW5kID0gcmVxdWlyZShcIi4vQmFja0dyb3VuZFwiKTtcclxudmFyIEhlcm9IZWFkID0gcmVxdWlyZShcIi4vSGVyb0hlYWRcIik7XHJcbnZhciBFbmVteUhlYWQgPSByZXF1aXJlKFwiLi9FbmVteUhlYWRcIik7XHJcbnZhciBEYXRhTWFuYWdlciA9IHJlcXVpcmUoXCIuL0RhdGFNYW5hZ2VyXCIpO1xyXG52YXIgSGVyb0hhbmRDYXJkID0gcmVxdWlyZShcIi4vSGVyb0hhbmRDYXJkXCIpO1xyXG52YXIgRW5lbXlIYW5kQ2FyZCA9IHJlcXVpcmUoXCIuL0VuZW15SGFuZENhcmRcIik7XHJcbnZhciBIZXJvRmVlID0gcmVxdWlyZShcIi4vSGVyb0ZlZVwiKTtcclxudmFyIEVuZW15RmVlID0gcmVxdWlyZShcIi4vRW5lbXlGZWVcIik7XHJcbnZhciBBSSA9IHJlcXVpcmUoXCIuL0FJXCIpO1xyXG52YXIgUmVtYWluQ2FyZCA9IHJlcXVpcmUoXCIuL1JlbWFpbkNhcmRcIik7XHJcblxyXG52YXIgSGVyb0ZpZ2h0ZXIgPSByZXF1aXJlKFwiLi9IZXJvRmlnaHRlclwiKTtcclxuXHJcbmZ1bmN0aW9uIFVJTWFuYWdlcihnYW1lKSB7XHJcbiAgICB0aGlzLmJhY2tncm91bmRPYmogPSBudWxsOyAvLyDog4zmma/lm75cclxuICAgIHRoaXMudHVybk92ZXJCdXR0b24gPSBudWxsOyAvLyDlm57lkIjnu5PmnZ9cclxuICAgIHRoaXMuc2hvdENhcmRCdXR0b24gPSBudWxsOyAvLyDlh7rniYzmjInpkq5cclxuICAgIHRoaXMuaW5pdChnYW1lKTtcclxufVxyXG5cclxuVUlNYW5hZ2VyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oZ2FtZSkge1xyXG4gICAgLy8g55Sf5oiQ6IOM5pmv5Zu+XHJcbiAgICB0aGlzLmJhY2tncm91bmRPYmogPSB0aGlzLnNldEJhY2tHcm91bmQoZ2FtZSk7XHJcbiAgICAvLyDnlJ/miJDnjqnlrrboi7Hpm4TlpLTlg49cclxuICAgIERhdGFNYW5hZ2VyLmhlcm9IZWFkID0gbmV3IEhlcm9IZWFkKGdhbWUsIFwiZmlnaHRlcl9oZXJvXCIsIDAsIGdhbWUud29ybGQuaGVpZ2h0IC0gMTQwKTtcclxuXHJcbiAgICAvLyDnlJ/miJDnlLXohJHoi7Hpm4TlpLTlg49cclxuICAgIERhdGFNYW5hZ2VyLmVuZW15SGVhZCA9IG5ldyBFbmVteUhlYWQoZ2FtZSwgXCJmaWdodGVyX2hlcm9cIiwgMCwgMCk7XHJcblxyXG4gICAgLy8g6K6+572u5Zue5ZCI57uT5p2f5oyJ6ZKuXHJcbiAgICBEYXRhTWFuYWdlci50dXJuT3ZlckJ1dHRvbiA9IHRoaXMuc2V0VHVybk92ZXJCdXR0b24oZ2FtZSk7XHJcbiAgICBcclxuICAgIC8vIOiuvue9ruaVjOS6uuaJi+eJjFxyXG4gICAgRGF0YU1hbmFnZXIuZW5lbXlIYW5kQ2FyZCA9IG5ldyBFbmVteUhhbmRDYXJkKGdhbWUpO1xyXG5cclxuICAgIC8vIOiuvue9rueOqeWutuaJi+eJjCBcclxuICAgIERhdGFNYW5hZ2VyLmhlcm9IYW5kQ2FyZCA9IG5ldyBIZXJvSGFuZENhcmQoZ2FtZSwgbnVsbCwgZ2FtZS53b3JsZC5oZWlnaHQgLSAxMjApO1xyXG5cclxuICAgIHRoaXMuc2hvdENhcmRCdXR0b24gPSB0aGlzLnNldFNob3RDYXJkQnV0dG9uKGdhbWUpOyAvLyDorr7nva7lh7rniYzmjInpkq5cclxuXHJcbiAgICAvLyDoi7Hpm4TotLnnlKjnrqHnkIZcclxuICAgIERhdGFNYW5hZ2VyLmhlcm9GZWUgPSBuZXcgSGVyb0ZlZShnYW1lLCBnYW1lLndvcmxkLndpZHRoIC0gMTEwLCBnYW1lLndvcmxkLmNlbnRlclkgKyA0Mik7IFxyXG4gICAgXHJcbiAgICAvLyDmlYzkurrotLnnlKjnrqHnkIZcclxuICAgIERhdGFNYW5hZ2VyLmVuZW15RmVlID0gbmV3IEVuZW15RmVlKGdhbWUsIGdhbWUud29ybGQud2lkdGggLSAxMTAsIGdhbWUud29ybGQuY2VudGVyWSAtIDkwKTsgXHJcblxyXG4gICAgLy8g5Yib5bu6QUlcclxuICAgIERhdGFNYW5hZ2VyLkFJID0gbmV3IEFJKCk7IFxyXG5cclxuICAgIC8vIOWJqeS9meeahOWNoeeJjOaPkOekulxyXG4gICAgRGF0YU1hbmFnZXIucmVtYWluQ2FyZCA9IG5ldyBSZW1haW5DYXJkKGdhbWUpOyBcclxuICAgIC8vIGNvbnNvbGUubG9nKERhdGFNYW5hZ2VyLnJlbWFpbkNhcmQpO1xyXG59XHJcblxyXG4vLyDorr7nva7og4zmma9cclxuVUlNYW5hZ2VyLnByb3RvdHlwZS5zZXRCYWNrR3JvdW5kID0gZnVuY3Rpb24oZ2FtZSkge1xyXG4gICAgdmFyIGJhY2tncm91bmQgPSBuZXcgQmFja0dyb3VuZChnYW1lKTtcclxuICAgIHJldHVybiBiYWNrZ3JvdW5kO1xyXG59XHJcblxyXG4vLyDlm57lkIjnu5PmnZ9cclxuVUlNYW5hZ2VyLnByb3RvdHlwZS5zZXRUdXJuT3ZlckJ1dHRvbiA9IGZ1bmN0aW9uKGdhbWUpIHtcclxuICAgIHZhciBidXR0b24gPSBnYW1lLmFkZC5pbWFnZShnYW1lLndvcmxkLndpZHRoIC0gMTUwLCBnYW1lLndvcmxkLmNlbnRlclkgLSAzMCwgXCJoZXJvX3R1cm5fYnV0dG9uXCIpO1xyXG4gICAgYnV0dG9uLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcbiAgICBidXR0b24uZXZlbnRzLm9uSW5wdXREb3duLmFkZChmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAoRGF0YU1hbmFnZXIudHVybiA9PSAwKSB7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5sb2FkVGV4dHVyZShcImVuZW15X3R1cm5fYnV0dG9uXCIpO1xyXG4gICAgICAgICAgICBEYXRhTWFuYWdlci50dXJuID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKERhdGFNYW5hZ2VyLmVuZW15RmlnaHRlcnMpIHtcclxuICAgICAgICAgICAgRGF0YU1hbmFnZXIuZW5lbXlGaWdodGVycy5hd2FrZUZpZ2h0ZXIoKTsgLy8g6Kej6Zmk5pWM5Lq66ZqP5LuO552h55yg54q25oCBXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBEYXRhTWFuYWdlci5lbmVteUZlZS5mZWVPYmouc2V0VGV4dChEYXRhTWFuYWdlci5mZWUgKyBcIi9cIiArIERhdGFNYW5hZ2VyLmZlZSk7XHJcbiAgICAgICAgRGF0YU1hbmFnZXIuZW5lbXlIYW5kQ2FyZC5hZGRDYXJkKGdhbWUpOyAvLyDmlYzkurrmkbjniYxcclxuICAgICAgICBEYXRhTWFuYWdlci5yZW1haW5DYXJkLnJlZnJlc2goKTtcclxuICAgICAgICB2YXIgdGltZSA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIERhdGFNYW5hZ2VyLkFJLnNob3RDYXJkKGdhbWUpO1xyXG4gICAgICAgICAgICBEYXRhTWFuYWdlci5BSS5jaG9pc2VBdHRhY2tUYXJnZXQoZ2FtZSk7IC8vIOeUteiEkUFJ5bGV5byA5pS75Ye7XHJcbiAgICAgICAgICAgIGlmIChEYXRhTWFuYWdlci5oZXJvRmlnaHRlcnMpIHtcclxuICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVycy5hd2FrZUZpZ2h0ZXIoKTsgLy8g6Kej6Zmk546p5a626ZqP5LuO552h55yg54q25oCBXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIOabtOaWsOeOqeWutui0ueeUqOeahOaDheWGtVxyXG4gICAgICAgICAgICBpZiAoRGF0YU1hbmFnZXIuZmVlIDwgOSkge1xyXG4gICAgICAgICAgICAgICAgRGF0YU1hbmFnZXIuZmVlICs9IDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIERhdGFNYW5hZ2VyLmhlcm9DdXJyZW50RmVlID0gRGF0YU1hbmFnZXIuZmVlO1xyXG4gICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvRmVlLmZlZU9iai5zZXRUZXh0KERhdGFNYW5hZ2VyLmZlZSArIFwiL1wiICsgRGF0YU1hbmFnZXIuZmVlKTtcclxuICAgICAgICAgICAgRGF0YU1hbmFnZXIuaGVyb0hhbmRDYXJkLmFkZENhcmQoZ2FtZSk7IC8vIOeOqeWutuaRuOeJjFxyXG4gICAgICAgICAgICBEYXRhTWFuYWdlci5yZW1haW5DYXJkLnJlZnJlc2goKTtcclxuXHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lKTtcclxuICAgICAgICB9LCAxMDAwKTtcclxuXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBidXR0b247XHJcbn1cclxuXHJcbi8vIOWHuueJjOaMiemSrlxyXG5VSU1hbmFnZXIucHJvdG90eXBlLnNldFNob3RDYXJkQnV0dG9uID0gZnVuY3Rpb24oZ2FtZSkge1xyXG4gICAgdmFyIHNob3QgPSBnYW1lLmFkZC5pbWFnZSg4MCwgZ2FtZS53b3JsZC5jZW50ZXJZIC0gMTAsIFwic2hvdF9jYXJkXCIpO1xyXG4gICAgc2hvdC5hbmNob3Iuc2V0KDAuNSk7XHJcbiAgICBzaG90LmlucHV0RW5hYmxlZCA9IHRydWU7XHJcbiAgICBzaG90LmV2ZW50cy5vbklucHV0RG93bi5hZGQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKERhdGFNYW5hZ2VyLnR1cm4gIT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDmjqfliLbnjqnlrrblnLrkuIrnmoTpmo/ku45cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAoRGF0YU1hbmFnZXIuaGVyb0ZpZ2h0ZXJzLmZpZ2h0T2JqLmxlbmd0aCA+PSA1KSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIuaCqOWcuuS4iueahOmaj+S7juW3sue7j+WIsOi+vuS6huS4iumZkFwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XHJcblxyXG4gICAgICAgIGlmIChEYXRhTWFuYWdlci5oZXJvQ2hvaXNlQ2FyZCkge1xyXG5cclxuICAgICAgICAgICAgLy8g5qOA5p+l6YCJ5oup5Y2h54mM55qE6LS555So5piv5ZCm6LaF5Ye65b2T5YmN5Y+v55So6LS555SoXHJcbiAgICAgICAgICAgIGlmIChEYXRhTWFuYWdlci5oZXJvQ3VycmVudEZlZSA8IERhdGFNYW5hZ2VyLmhlcm9DaG9pc2VDYXJkLmNhcmRJbmZvLmZlZSkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCLkvaDnmoTotLnnlKjkuI3otrPvvIzml6Dms5Xkvb/nlKjov5nlvKDljaHniYxcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIERhdGFNYW5hZ2VyLmhlcm9DdXJyZW50RmVlID0gRGF0YU1hbmFnZXIuaGVyb0N1cnJlbnRGZWUgLSBEYXRhTWFuYWdlci5oZXJvQ2hvaXNlQ2FyZC5jYXJkSW5mby5mZWU7XHJcbiAgICAgICAgICAgIERhdGFNYW5hZ2VyLmhlcm9GZWUuZmVlT2JqLnNldFRleHQoRGF0YU1hbmFnZXIuaGVyb0N1cnJlbnRGZWUgKyBcIi9cIiArIERhdGFNYW5hZ2VyLmZlZSk7XHJcblxyXG4gICAgICAgICAgICAvLyAg5Ye654mM5LmL5ZCO5Yib5bu66ZqP5LuOXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKERhdGFNYW5hZ2VyLmhlcm9DaG9pc2VDYXJkLmNhcmRJbmZvKTtcclxuICAgICAgICAgICAgaWYoRGF0YU1hbmFnZXIuaGVyb0Nob2lzZUNhcmQuY2FyZEluZm8uY2FyZFR5cGUgPT0gXCJtYWdpY1wiKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwi5oiR5Zyo5L2/55So6a2U5rOV54mMXCIpO1xyXG4gICAgICAgICAgICB9ZWxzZSBpZihEYXRhTWFuYWdlci5oZXJvQ2hvaXNlQ2FyZC5jYXJkSW5mby5jYXJkVHlwZSA9PSBcImVudG91cmFnZVwiKXtcclxuICAgICAgICAgICAgICAgIGlmIChEYXRhTWFuYWdlci5oZXJvRmlnaHRlcnMgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIERhdGFNYW5hZ2VyLmhlcm9GaWdodGVycyA9IG5ldyBIZXJvRmlnaHRlcihnYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvRmlnaHRlcnMuYnVpbGRGaWdodGVyKGdhbWUsIERhdGFNYW5hZ2VyLmhlcm9DaG9pc2VDYXJkLmNhcmRJbmZvLkhQLCBEYXRhTWFuYWdlci5oZXJvQ2hvaXNlQ2FyZC5jYXJkSW5mby5hdHRhY2ssIERhdGFNYW5hZ2VyLmhlcm9DaG9pc2VDYXJkLmNhcmRJbmZvLmNuTmFtZSwgRGF0YU1hbmFnZXIuaGVyb0Nob2lzZUNhcmQuY2FyZEluZm8uZmlnaHQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvRmlnaHRlcnMuYnVpbGRGaWdodGVyKGdhbWUsIERhdGFNYW5hZ2VyLmhlcm9DaG9pc2VDYXJkLmNhcmRJbmZvLkhQLCBEYXRhTWFuYWdlci5oZXJvQ2hvaXNlQ2FyZC5jYXJkSW5mby5hdHRhY2ssIERhdGFNYW5hZ2VyLmhlcm9DaG9pc2VDYXJkLmNhcmRJbmZvLmNuTmFtZSwgRGF0YU1hbmFnZXIuaGVyb0Nob2lzZUNhcmQuY2FyZEluZm8uZmlnaHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvQ2hvaXNlQ2FyZC5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIERhdGFNYW5hZ2VyLmhlcm9IYW5kQ2FyZC5yZUxpc3RIYW5kQ2FyZCgpO1xyXG4gICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvQ2hvaXNlQ2FyZCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHNob3Q7XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBVSU1hbmFnZXI7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlpiaTdnYlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXNcXFxcY2xhc3NcXFxcVUlNYW5hZ2VyLmpzXCIsXCIvbW9kdWxlc1xcXFxjbGFzc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxyXG4gKiDmuLjmiI/ljaHniYznmoTphY3nva7mlofku7ZcclxuICovXHJcblxyXG52YXIgQ2FyZENvbmZpZyA9IHtcclxuICAgIFwiY2FyZF9pbmZvXCI6IFt7XHJcbiAgICAgICAgXCJuYW1lXCI6IFwiZmlzaG1hbl9iYWJ5XCIsXHJcbiAgICAgICAgXCJmaWdodFwiOiBcImZpc2htYW5fYmFieV9maWdodFwiLFxyXG4gICAgICAgIFwiY25fbmFtZVwiOiBcIumxvOS6uuWuneWunVwiLFxyXG4gICAgICAgIFwiZmVlXCI6IDEsXHJcbiAgICAgICAgXCJhdHRhY2tcIjogMSxcclxuICAgICAgICBcImhwXCI6IDEsXHJcbiAgICAgICAgXCJpZFwiOiAxLFxyXG4gICAgICAgIFwidHlwZVwiOlwiZW50b3VyYWdlXCIgLy8g6ZqP5LuOXHJcbiAgICB9LCB7XHJcbiAgICAgICAgXCJuYW1lXCI6IFwiZnJlc2h3YXRlcl9jcm9jb2RpbGVcIixcclxuICAgICAgICBcImZpZ2h0XCI6IFwiZnJlc2h3YXRlcl9jcm9jb2RpbGVfZmlnaHRcIixcclxuICAgICAgICBcImNuX25hbWVcIjogXCLmt6HmsLTps4RcIixcclxuICAgICAgICBcImZlZVwiOiAyLFxyXG4gICAgICAgIFwiYXR0YWNrXCI6IDIsXHJcbiAgICAgICAgXCJocFwiOiAzLFxyXG4gICAgICAgIFwiaWRcIjogMixcclxuICAgICAgICBcInR5cGVcIjpcImVudG91cmFnZVwiXHJcbiAgICB9LCB7XHJcbiAgICAgICAgXCJuYW1lXCI6IFwib2dyZVwiLFxyXG4gICAgICAgIFwiZmlnaHRcIjogXCJvZ3JlX2ZpZ2h0XCIsXHJcbiAgICAgICAgXCJjbl9uYW1lXCI6IFwi6aOf5Lq66a2U5rOV5biIXCIsXHJcbiAgICAgICAgXCJmZWVcIjogNCxcclxuICAgICAgICBcImF0dGFja1wiOiA0LFxyXG4gICAgICAgIFwiaHBcIjogNCxcclxuICAgICAgICBcImlkXCI6IDMsXHJcbiAgICAgICAgXCJ0eXBlXCI6XCJlbnRvdXJhZ2VcIlxyXG4gICAgfSwge1xyXG4gICAgICAgIFwibmFtZVwiOiBcImRlYWRfd2luZ1wiLFxyXG4gICAgICAgIFwiZmlnaHRcIjogXCJkZWFkX3dpbmdfZmlnaHRcIixcclxuICAgICAgICBcImNuX25hbWVcIjogXCLmrbvkuqHkuYvnv7xcIixcclxuICAgICAgICBcImZlZVwiOiA5LFxyXG4gICAgICAgIFwiYXR0YWNrXCI6IDksXHJcbiAgICAgICAgXCJocFwiOiA5LFxyXG4gICAgICAgIFwiaWRcIjogNCxcclxuICAgICAgICBcInR5cGVcIjpcImVudG91cmFnZVwiXHJcbiAgICB9LHtcclxuICAgICAgICBcIm5hbWVcIjogXCJyb3NlXCIsXHJcbiAgICAgICAgXCJmaWdodFwiOiBcInJvc2VfZmlnaHRcIixcclxuICAgICAgICBcImNuX25hbWVcIjogXCLmi4nmoLznurPnvZfmlq9cIixcclxuICAgICAgICBcImZlZVwiOiA4LFxyXG4gICAgICAgIFwiYXR0YWNrXCI6IDgsXHJcbiAgICAgICAgXCJocFwiOiA4LFxyXG4gICAgICAgIFwiaWRcIjogNSxcclxuICAgICAgICBcInR5cGVcIjpcImVudG91cmFnZVwiXHJcbiAgICB9LHtcclxuICAgICAgICBcIm5hbWVcIjogXCJ2ZWxvY2lyYXB0b3JcIixcclxuICAgICAgICBcImZpZ2h0XCI6IFwidmVsb2NpcmFwdG9yX2ZpZ2h0XCIsXHJcbiAgICAgICAgXCJjbl9uYW1lXCI6IFwi6LaF57qn6L+F54yb6b6ZXCIsXHJcbiAgICAgICAgXCJmZWVcIjogNCxcclxuICAgICAgICBcImF0dGFja1wiOiA0LFxyXG4gICAgICAgIFwiaHBcIjogNSxcclxuICAgICAgICBcImlkXCI6IDYsXHJcbiAgICAgICAgXCJ0eXBlXCI6XCJlbnRvdXJhZ2VcIlxyXG4gICAgfSx7XHJcbiAgICAgICAgXCJuYW1lXCI6IFwiYXJjYW5lV2lzZG9tXCIsXHJcbiAgICAgICAgXCJmaWdodFwiOiBcIlwiLFxyXG4gICAgICAgIFwiY25fbmFtZVwiOiBcIuWlpeacr+aZuuaFp1wiLFxyXG4gICAgICAgIFwiZmVlXCI6IDMsXHJcbiAgICAgICAgXCJhdHRhY2tcIjogMCxcclxuICAgICAgICBcImhwXCI6IDAsXHJcbiAgICAgICAgXCJpZFwiOiA3LFxyXG4gICAgICAgIFwidHlwZVwiOlwibWFnaWNcIiAvLyBtYWdpY+mtlOazleeJjFxyXG4gICAgfV0sIC8vIOWNoeeJjOeahOebuOWFs+S/oeaBr1xyXG4gICAgXCJjYXJkTGVuZ3RoXCI6IDMwLCAvLyDljaHnu4Tplb/luqZcclxuICAgIFwiY2FyZEluaXRpYWxMZW5ndGhcIjogNCwgLy8g5Yid5aeL5YyW5omL54mM6ZW/5bqmXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FyZENvbmZpZztcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiWmJpN2diXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlc1xcXFxjb25maWdcXFxcQ2FyZENvbmZpZy5qc1wiLFwiL21vZHVsZXNcXFxcY29uZmlnXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXHJcbiAqIOmAieaLqea4uOaIj+WNoee7hOWcuuaZr1xyXG4gKi9cclxudmFyIENhcmRDb25maWcgPSByZXF1aXJlKFwiLi4vY29uZmlnL0NhcmRDb25maWdcIik7XHJcbnZhciBEYXRhTWFuYWdlciA9IHJlcXVpcmUoXCIuLi9jbGFzcy9EYXRhTWFuYWdlclwiKTtcclxuXHJcbmZ1bmN0aW9uIENhcmRDaG9pc2VTY2VuZShnYW1lKSB7XHJcbiAgICAgdGhpcy5wcmVsb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIOWKoOi9veaPkOekuuWjsOaYjlxyXG4gICAgICAgIHZhciBsb2FkVGV4dCA9IGdhbWUuYWRkLnRleHQoZ2FtZS53b3JsZC5jZW50ZXJYLCBnYW1lLndvcmxkLmNlbnRlclksIFwiTG9hZGluZyAuLi4gXCIsIHsgZmlsbDogXCIjMzMzXCIsIFwiZm9udFNpemVcIjogXCIyOHB0XCIgfSk7XHJcblxyXG4gICAgICAgIC8vIOmUmueCueiuvue9rlxyXG4gICAgICAgIGxvYWRUZXh0LmFuY2hvci5zZXQoMC41KTtcclxuXHJcbiAgICAgICAgZ2FtZS5sb2FkLmltYWdlKFwiYmFja2dyb3VuZFwiLCBcIi4uLy4uL3Jlc291cmNlL2JhY2tncm91bmQucG5nXCIpO1xyXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZShcImNhcmRfYmFja1wiLCBcIi4uLy4uL3Jlc291cmNlL2NhcmRfYmFjay5wbmdcIik7XHJcbiAgICAgICAgZ2FtZS5sb2FkLmltYWdlKFwiZW5lbXlfdHVybl9idXR0b25cIiwgXCIuLi8uLi9yZXNvdXJjZS9lbmVteV90dXJuX2J1dHRvbi5wbmdcIik7XHJcbiAgICAgICAgZ2FtZS5sb2FkLmltYWdlKFwiZmVlXCIsIFwiLi4vLi4vcmVzb3VyY2UvZmVlLnBuZ1wiKTtcclxuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UoXCJoZXJvX3R1cm5fYnV0dG9uXCIsIFwiLi4vLi4vcmVzb3VyY2UvaGVyb190dXJuX2J1dHRvbi5wbmdcIik7XHJcbiAgICAgICAgZ2FtZS5sb2FkLmltYWdlKFwiaHBfYmFja2dyb3VuZFwiLCBcIi4uLy4uL3Jlc291cmNlL2hwX2JhY2tncm91bmQucG5nXCIpO1xyXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZShcImF0dGFja19pY29uXCIsXCIuLi8uLi9yZXNvdXJjZS9hdHRhY2tfaWNvbi5wbmdcIik7XHJcbiAgICAgICAgZ2FtZS5sb2FkLmltYWdlKFwic2hvdF9jYXJkXCIsXCIuLi8uLi9yZXNvdXJjZS9zaG90X2NhcmQucG5nXCIpO1xyXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZShcImZpZ2h0ZXJfaGVyb1wiLCBcIi4uLy4uL3Jlc291cmNlL2ZpZ2h0ZXJfaGVyby5wbmdcIik7XHJcbiAgICAgICAgZ2FtZS5sb2FkLmltYWdlKFwiY2hvaXNlU2NlbmVfYmdcIixcIi4uLy4uL3Jlc291cmNlL2Nob2lzZVNjZW5lX2JnLmpwZ1wiKTtcclxuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UoXCJjb25maXJtX2J0blwiLFwiLi4vLi4vcmVzb3VyY2UvY29uZmlybV9idG4ucG5nXCIpO1xyXG5cclxuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UoXCJhcmNhbmVXaXNkb21cIixcIi4uLy4uL3Jlc291cmNlL2FyY2FuZVdpc2RvbS5wbmdcIik7XHJcbiAgICAgICAgZ2FtZS5sb2FkLmltYWdlKFwiZGVhZF93aW5nXCIsIFwiLi4vLi4vcmVzb3VyY2UvZGVhZF93aW5nLnBuZ1wiKTtcclxuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UoXCJkZWFkX3dpbmdfZmlnaHRcIiwgXCIuLi8uLi9yZXNvdXJjZS9kZWFkX3dpbmdfZmlnaHQucG5nXCIpO1xyXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZShcImZpc2htYW5fYmFieVwiLCBcIi4uLy4uL3Jlc291cmNlL2Zpc2htYW5fYmFieS5wbmdcIik7XHJcbiAgICAgICAgZ2FtZS5sb2FkLmltYWdlKFwiZmlzaG1hbl9iYWJ5X2ZpZ2h0XCIsIFwiLi4vLi4vcmVzb3VyY2UvZmlzaG1hbl9iYWJ5X2ZpZ2h0LnBuZ1wiKTtcclxuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UoXCJmcmVzaHdhdGVyX2Nyb2NvZGlsZVwiLCBcIi4uLy4uL3Jlc291cmNlL2ZyZXNod2F0ZXJfY3JvY29kaWxlLnBuZ1wiKTtcclxuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UoXCJmcmVzaHdhdGVyX2Nyb2NvZGlsZV9maWdodFwiLCBcIi4uLy4uL3Jlc291cmNlL2ZyZXNod2F0ZXJfY3JvY29kaWxlX2ZpZ2h0LnBuZ1wiKTtcclxuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UoXCJvZ3JlXCIsIFwiLi4vLi4vcmVzb3VyY2Uvb2dyZS5wbmdcIik7XHJcbiAgICAgICAgZ2FtZS5sb2FkLmltYWdlKFwib2dyZV9maWdodFwiLCBcIi4uLy4uL3Jlc291cmNlL29ncmVfZmlnaHQucG5nXCIpO1xyXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZShcInJvc2VcIixcIi4uLy4uL3Jlc291cmNlL3Jvc2UucG5nXCIpO1xyXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZShcInJvc2VfZmlnaHRcIixcIi4uLy4uL3Jlc291cmNlL3Jvc2VfZmlnaHQucG5nXCIpO1xyXG4gICAgICAgIGdhbWUubG9hZC5pbWFnZShcInZlbG9jaXJhcHRvclwiLFwiLi4vLi4vcmVzb3VyY2UvdmVsb2NpcmFwdG9yLnBuZ1wiKTtcclxuICAgICAgICBnYW1lLmxvYWQuaW1hZ2UoXCJ2ZWxvY2lyYXB0b3JfZmlnaHRcIixcIi4uLy4uL3Jlc291cmNlL3ZlbG9jaXJhcHRvcl9maWdodC5wbmdcIik7XHJcblxyXG4gICAgICAgIC8vIOWNleS4quaWh+S7tuWKoOi9veWujOeahOWbnuiwg1xyXG4gICAgICAgIGdhbWUubG9hZC5vbkZpbGVDb21wbGV0ZS5hZGQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsb2FkVGV4dC5zZXRUZXh0KFwiTG9hZGluZyAuLi4gXCIgKyBhcmd1bWVudHNbMF0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyDmiYDmnInmlofku7bliqDovb3lrozmiJDlm57osINcclxuICAgICAgICBnYW1lLmxvYWQub25Mb2FkQ29tcGxldGUuYWRkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbG9hZFRleHQuZGVzdHJveSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzdHlsZSA9IHtcclxuICAgICAgICAgICAgZmlsbDogXCIjMDAwXCIsXHJcbiAgICAgICAgICAgIGZvbnRTaXplOiBcIjMycHRcIlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jaG9pc2VkQ2FyZExpc3QgPSBbXTtcclxuICAgICAgICB2YXIgYmcgPSBnYW1lLmFkZC5pbWFnZSgwLDAsXCJjaG9pc2VTY2VuZV9iZ1wiKTtcclxuXHJcbiAgICAgICAgLy8g56Gu5a6a5oyJ6ZKu77yM54K55Ye76L+b5YWl5LiL5LiA5Liq5Zy65pmvXHJcbiAgICAgICAgdmFyIGNvbmZpcm1CdG4gPSBnYW1lLmFkZC5pbWFnZSg2NzAsNTUwLFwiY29uZmlybV9idG5cIik7XHJcblxyXG4gICAgICAgIGNvbmZpcm1CdG4uYW5jaG9yLnNldCgwLjUpO1xyXG5cclxuICAgICAgICBjb25maXJtQnRuLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgY29uZmlybUJ0bi5ldmVudHMub25JbnB1dERvd24uYWRkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZ2FtZS5zdGF0ZS5zdGFydChcIkdhbWVTY2VuZVwiKTtcclxuICAgICAgICB9LHRoaXMpO1xyXG5cclxuICAgICAgICAvLyDnlJ/miJDmiYDmnInnmoTlvoXpgInljaHniYfliJfooahcclxuICAgICAgICB0aGlzLmJ1aWxkQ29tbW9uQ2FyZChDYXJkQ29uZmlnKTtcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIOW+hemAieWNoeeJh1xyXG4gICAgdGhpcy5idWlsZENvbW1vbkNhcmQgPSBmdW5jdGlvbihDYXJkQ29uZmlnKXtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIGZvcih2YXIgaSA9IDA7IGk8IENhcmRDb25maWcuY2FyZF9pbmZvLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgaW1hZ2UgPSBnYW1lLmFkZC5pbWFnZSg1MCtpKjg1LDUwLENhcmRDb25maWcuY2FyZF9pbmZvW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICBpbWFnZS5zY2FsZS5zZXQoMC41KTtcclxuICAgICAgICAgICAgaW1hZ2UuaWQgPSBDYXJkQ29uZmlnLmNhcmRfaW5mb1tpXS5pZDtcclxuICAgICAgICAgICAgaW1hZ2UubmFtZSA9IENhcmRDb25maWcuY2FyZF9pbmZvW2ldLm5hbWU7XHJcbiAgICAgICAgICAgIGltYWdlLmlucHV0RW5hYmxlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBpbWFnZS5ldmVudHMub25JbnB1dERvd24uYWRkKGZ1bmN0aW9uKGltYWdlKXtcclxuICAgICAgICAgICAgICAgIHNlbGYuYWRkQ2hvaXNlQ2FyZChpbWFnZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyDmt7vliqDpgInmi6nnmoTljaHniYxcclxuICAgIHRoaXMuYWRkQ2hvaXNlQ2FyZCA9IGZ1bmN0aW9uKGltYWdlKXtcclxuICAgICAgICBpZihEYXRhTWFuYWdlci5oZXJvSGFuZENhcmRJRExpc3QubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICBEYXRhTWFuYWdlci5oZXJvSGFuZENhcmRJRExpc3QucHVzaChpbWFnZSk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGk8RGF0YU1hbmFnZXIuaGVyb0hhbmRDYXJkSURMaXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIGlmKERhdGFNYW5hZ2VyLmhlcm9IYW5kQ2FyZElETGlzdFtpXS5pZCA9PSBpbWFnZS5pZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLmNob2lzZWRDYXJkTGlzdC5sZW5ndGggIT0gMCApe1xyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuY2hvaXNlZENhcmRMaXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNob2lzZWRDYXJkTGlzdFtpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRGF0YU1hbmFnZXIuaGVyb0hhbmRDYXJkSURMaXN0LnB1c2goaW1hZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yKHZhciBqID0gMDsgaiA8IERhdGFNYW5hZ2VyLmhlcm9IYW5kQ2FyZElETGlzdC5sZW5ndGg7IGorKyl7XHJcbiAgICAgICAgICAgIC8vIOa3u+WKoOW3sumAieWNoeeJh1xyXG4gICAgICAgICAgICB2YXIgaW1hZ2UgPSBnYW1lLmFkZC5pbWFnZSg0NiAraioxMDQsMjYwLERhdGFNYW5hZ2VyLmhlcm9IYW5kQ2FyZElETGlzdFtqXS5uYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5jaG9pc2VkQ2FyZExpc3QucHVzaChpbWFnZSk7XHJcbiAgICAgICAgICAgIGltYWdlLnNjYWxlLnNldCgwLjYpO1xyXG4gICAgICAgICAgICBpbWFnZS5pZCA9IERhdGFNYW5hZ2VyLmhlcm9IYW5kQ2FyZElETGlzdFtqXS5pZDtcclxuICAgICAgICAgICAgaW1hZ2UuaW5wdXRFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgaW1hZ2UuZXZlbnRzLm9uSW5wdXREb3duLmFkZChmdW5jdGlvbihpbWFnZSl7XHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGsgPSAwIDsgayA8IERhdGFNYW5hZ2VyLmhlcm9IYW5kQ2FyZElETGlzdC5sZW5ndGg7IGsrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaW1hZ2UuaWQgPT0gRGF0YU1hbmFnZXIuaGVyb0hhbmRDYXJkSURMaXN0W2tdLmlkKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF90ZW1wID0gRGF0YU1hbmFnZXIuaGVyb0hhbmRDYXJkSURMaXN0LnNwbGljZShrLDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2FyZENob2lzZVNjZW5lO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJaYmk3Z2JcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzXFxcXHNjZW5lc1xcXFxDYXJkQ2hvaXNlU2NlbmUuanNcIixcIi9tb2R1bGVzXFxcXHNjZW5lc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxyXG4gKiDmuLjmiI/kuLvlnLrmma9cclxuICovXHJcblxyXG52YXIgVUlQYW5lbCA9IHJlcXVpcmUoXCIuLi9jbGFzcy9VSU1hbmFnZXJcIik7XHJcblxyXG5mdW5jdGlvbiBHYW1lU2NlbmUoZ2FtZSkge1xyXG4gICBcclxuICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIOa3u+WKoHVp55WM6Z2iXHJcbiAgICAgICAgdmFyIHVpID0gbmV3IFVJUGFuZWwoZ2FtZSk7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVTY2VuZTtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiWmJpN2diXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbW9kdWxlc1xcXFxzY2VuZXNcXFxcR2FtZVNjZW5lLmpzXCIsXCIvbW9kdWxlc1xcXFxzY2VuZXNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcclxuICogIOa4uOaIj+e7k+aenOWcuuaZr1xyXG4gKi9cclxuXHJcbnZhciBEYXRhTWFuYWdlciA9IHJlcXVpcmUoXCIuLi9jbGFzcy9EYXRhTWFuYWdlclwiKTtcclxuXHJcbmZ1bmN0aW9uIFJlc3VsdFNjZW5lKGdhbWUpIHtcclxuICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChEYXRhTWFuYWdlci5yZXN1bHQgPT0gMCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIuaVjOS6uuiDnOWIqVwiKTtcclxuICAgICAgICAgICAgdmFyIHRleHQgPSBnYW1lLmFkZC50ZXh0KGdhbWUud29ybGQuY2VudGVyWCwgZ2FtZS53b3JsZC5jZW50ZXJZLCBcIllvdSBMb3NzXCIsIHtcclxuICAgICAgICAgICAgICAgIGZpbGw6IFwiIzAwMFwiLFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRleHQuYW5jaG9yLnNldCgwLjUpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdGV4dCA9IGdhbWUuYWRkLnRleHQoZ2FtZS53b3JsZC5jZW50ZXJYLCBnYW1lLndvcmxkLmNlbnRlclksIFwiWW91IFdpblwiLCB7XHJcbiAgICAgICAgICAgICAgICBmaWxsOiBcIiMwMDBcIixcclxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiBcIjMwcHRcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGV4dC5hbmNob3Iuc2V0KDAuNSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlc3VsdFNjZW5lO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJaYmk3Z2JcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9tb2R1bGVzXFxcXHNjZW5lc1xcXFxSZXN1bHRTY2VuZS5qc1wiLFwiL21vZHVsZXNcXFxcc2NlbmVzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXHJcbiAqIOa4uOaIj+W8gOWni+WcuuaZryBcclxuICovXHJcblxyXG5mdW5jdGlvbiBTdGFydFNjZW5lKGdhbWUpIHtcclxuXHJcbiAgICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyDnvKnmlL7mqKHlvI9cclxuICAgICAgICAvLyBnYW1lLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTEw7XHJcbiAgICAgICAgLy8gZ2FtZS5zY2FsZS5zY2FsZU1vZGUubWF4SGVpZ2h0ID1cIjQwMHB4XCI7XHJcbiAgICAgICAgdmFyIHN0eWxlID0ge1xyXG4gICAgICAgICAgICBmaWxsOiBcIiMwMDBcIixcclxuICAgICAgICAgICAgZm9udFNpemU6IFwiMzJwdFwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB0ZXh0ID0gZ2FtZS5hZGQudGV4dChnYW1lLndvcmxkLmNlbnRlclgsIGdhbWUud29ybGQuY2VudGVyWSwgXCLmrKLov47mnaXliLDmiJHnmoTngonnn7PkvKDor7RcIiwgc3R5bGUpO1xyXG5cclxuICAgICAgICB0ZXh0LmFuY2hvci5zZXQoMC41KTtcclxuXHJcbiAgICAgICAgdmFyIHN0YXJ0QnV0dG9uID0gZ2FtZS5hZGQudGV4dChnYW1lLndvcmxkLmNlbnRlclgsIGdhbWUud29ybGQuY2VudGVyWSArIDcwLCBcIuW8gOWni+a4uOaIj1wiLCB7IGZpbGw6IFwiIzMzM1wiLCBmb250U2l6ZTogXCIyNHB0XCIgfSk7XHJcblxyXG4gICAgICAgIHN0YXJ0QnV0dG9uLmFuY2hvci5zZXQoMC41KTtcclxuXHJcbiAgICAgICAgc3RhcnRCdXR0b24uaW5wdXRFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICBzdGFydEJ1dHRvbi5ldmVudHMub25JbnB1dERvd24uYWRkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZ2FtZS5zdGF0ZS5zdGFydChcIkNhcmRDaG9pc2VTY2VuZVwiKTtcclxuICAgICAgICB9LHRoaXMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFN0YXJ0U2NlbmU7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlpiaTdnYlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL21vZHVsZXNcXFxcc2NlbmVzXFxcXFN0YXJ0U2NlbmUuanNcIixcIi9tb2R1bGVzXFxcXHNjZW5lc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbjsoZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG4gIHZhciBBcnIgPSAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKVxuICAgID8gVWludDhBcnJheVxuICAgIDogQXJyYXlcblxuXHR2YXIgUExVUyAgID0gJysnLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIICA9ICcvJy5jaGFyQ29kZUF0KDApXG5cdHZhciBOVU1CRVIgPSAnMCcuY2hhckNvZGVBdCgwKVxuXHR2YXIgTE9XRVIgID0gJ2EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFVQUEVSICA9ICdBJy5jaGFyQ29kZUF0KDApXG5cdHZhciBQTFVTX1VSTF9TQUZFID0gJy0nLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIX1VSTF9TQUZFID0gJ18nLmNoYXJDb2RlQXQoMClcblxuXHRmdW5jdGlvbiBkZWNvZGUgKGVsdCkge1xuXHRcdHZhciBjb2RlID0gZWx0LmNoYXJDb2RlQXQoMClcblx0XHRpZiAoY29kZSA9PT0gUExVUyB8fFxuXHRcdCAgICBjb2RlID09PSBQTFVTX1VSTF9TQUZFKVxuXHRcdFx0cmV0dXJuIDYyIC8vICcrJ1xuXHRcdGlmIChjb2RlID09PSBTTEFTSCB8fFxuXHRcdCAgICBjb2RlID09PSBTTEFTSF9VUkxfU0FGRSlcblx0XHRcdHJldHVybiA2MyAvLyAnLydcblx0XHRpZiAoY29kZSA8IE5VTUJFUilcblx0XHRcdHJldHVybiAtMSAvL25vIG1hdGNoXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIgKyAxMClcblx0XHRcdHJldHVybiBjb2RlIC0gTlVNQkVSICsgMjYgKyAyNlxuXHRcdGlmIChjb2RlIDwgVVBQRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gVVBQRVJcblx0XHRpZiAoY29kZSA8IExPV0VSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIExPV0VSICsgMjZcblx0fVxuXG5cdGZ1bmN0aW9uIGI2NFRvQnl0ZUFycmF5IChiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuXG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0Jylcblx0XHR9XG5cblx0XHQvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuXHRcdC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcblx0XHQvLyByZXByZXNlbnQgb25lIGJ5dGVcblx0XHQvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcblx0XHQvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG5cdFx0dmFyIGxlbiA9IGI2NC5sZW5ndGhcblx0XHRwbGFjZUhvbGRlcnMgPSAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMikgPyAyIDogJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDEpID8gMSA6IDBcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IG5ldyBBcnIoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuXHRcdGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIDQgOiBiNjQubGVuZ3RoXG5cblx0XHR2YXIgTCA9IDBcblxuXHRcdGZ1bmN0aW9uIHB1c2ggKHYpIHtcblx0XHRcdGFycltMKytdID0gdlxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTgpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgMTIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPDwgNikgfCBkZWNvZGUoYjY0LmNoYXJBdChpICsgMykpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDApID4+IDgpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0aWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpID4+IDQpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTApIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgNCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA+PiAyKVxuXHRcdFx0cHVzaCgodG1wID4+IDgpICYgMHhGRilcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyXG5cdH1cblxuXHRmdW5jdGlvbiB1aW50OFRvQmFzZTY0ICh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoXG5cblx0XHRmdW5jdGlvbiBlbmNvZGUgKG51bSkge1xuXHRcdFx0cmV0dXJuIGxvb2t1cC5jaGFyQXQobnVtKVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKG51bSA+PiAxOCAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiAxMiAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiA2ICYgMHgzRikgKyBlbmNvZGUobnVtICYgMHgzRilcblx0XHR9XG5cblx0XHQvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG5cdFx0Zm9yIChpID0gMCwgbGVuZ3RoID0gdWludDgubGVuZ3RoIC0gZXh0cmFCeXRlczsgaSA8IGxlbmd0aDsgaSArPSAzKSB7XG5cdFx0XHR0ZW1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuXHRcdFx0b3V0cHV0ICs9IHRyaXBsZXRUb0Jhc2U2NCh0ZW1wKVxuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAyKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSdcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dGVtcCA9ICh1aW50OFt1aW50OC5sZW5ndGggLSAyXSA8PCA4KSArICh1aW50OFt1aW50OC5sZW5ndGggLSAxXSlcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDEwKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wID4+IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCAyKSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPSdcblx0XHRcdFx0YnJlYWtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0XG5cdH1cblxuXHRleHBvcnRzLnRvQnl0ZUFycmF5ID0gYjY0VG9CeXRlQXJyYXlcblx0ZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NFxufSh0eXBlb2YgZXhwb3J0cyA9PT0gJ3VuZGVmaW5lZCcgPyAodGhpcy5iYXNlNjRqcyA9IHt9KSA6IGV4cG9ydHMpKVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlpiaTdnYlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL25vZGVfbW9kdWxlc1xcXFxiYXNlNjQtanNcXFxcbGliXFxcXGI2NC5qc1wiLFwiL25vZGVfbW9kdWxlc1xcXFxiYXNlNjQtanNcXFxcbGliXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiWmJpN2diXCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvbm9kZV9tb2R1bGVzXFxcXGJyb3dzZXJpZnlcXFxcbm9kZV9tb2R1bGVzXFxcXHByb2Nlc3NcXFxcYnJvd3Nlci5qc1wiLFwiL25vZGVfbW9kdWxlc1xcXFxicm93c2VyaWZ5XFxcXG5vZGVfbW9kdWxlc1xcXFxwcm9jZXNzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuQnVmZmVyLnBvb2xTaXplID0gODE5MlxuXG4vKipcbiAqIElmIGBCdWZmZXIuX3VzZVR5cGVkQXJyYXlzYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKGNvbXBhdGlibGUgZG93biB0byBJRTYpXG4gKi9cbkJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgPSAoZnVuY3Rpb24gKCkge1xuICAvLyBEZXRlY3QgaWYgYnJvd3NlciBzdXBwb3J0cyBUeXBlZCBBcnJheXMuIFN1cHBvcnRlZCBicm93c2VycyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLFxuICAvLyBDaHJvbWUgNyssIFNhZmFyaSA1LjErLCBPcGVyYSAxMS42KywgaU9TIDQuMisuIElmIHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgYWRkaW5nXG4gIC8vIHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcywgdGhlbiB0aGF0J3MgdGhlIHNhbWUgYXMgbm8gYFVpbnQ4QXJyYXlgIHN1cHBvcnRcbiAgLy8gYmVjYXVzZSB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gYWRkIGFsbCB0aGUgbm9kZSBCdWZmZXIgQVBJIG1ldGhvZHMuIFRoaXMgaXMgYW4gaXNzdWVcbiAgLy8gaW4gRmlyZWZveCA0LTI5LiBOb3cgZml4ZWQ6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOFxuICB0cnkge1xuICAgIHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoMClcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgcmV0dXJuIDQyID09PSBhcnIuZm9vKCkgJiZcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAvLyBDaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59KSgpXG5cbi8qKlxuICogQ2xhc3M6IEJ1ZmZlclxuICogPT09PT09PT09PT09PVxuICpcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgYXJlIGF1Z21lbnRlZFxuICogd2l0aCBmdW5jdGlvbiBwcm9wZXJ0aWVzIGZvciBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgQVBJIGZ1bmN0aW9ucy4gV2UgdXNlXG4gKiBgVWludDhBcnJheWAgc28gdGhhdCBzcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdCByZXR1cm5zXG4gKiBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBCeSBhdWdtZW50aW5nIHRoZSBpbnN0YW5jZXMsIHdlIGNhbiBhdm9pZCBtb2RpZnlpbmcgdGhlIGBVaW50OEFycmF5YFxuICogcHJvdG90eXBlLlxuICovXG5mdW5jdGlvbiBCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybylcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBzdWJqZWN0XG5cbiAgLy8gV29ya2Fyb3VuZDogbm9kZSdzIGJhc2U2NCBpbXBsZW1lbnRhdGlvbiBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgc3RyaW5nc1xuICAvLyB3aGlsZSBiYXNlNjQtanMgZG9lcyBub3QuXG4gIGlmIChlbmNvZGluZyA9PT0gJ2Jhc2U2NCcgJiYgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBzdWJqZWN0ID0gc3RyaW5ndHJpbShzdWJqZWN0KVxuICAgIHdoaWxlIChzdWJqZWN0Lmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICAgIHN1YmplY3QgPSBzdWJqZWN0ICsgJz0nXG4gICAgfVxuICB9XG5cbiAgLy8gRmluZCB0aGUgbGVuZ3RoXG4gIHZhciBsZW5ndGhcbiAgaWYgKHR5cGUgPT09ICdudW1iZXInKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0KVxuICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJylcbiAgICBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChzdWJqZWN0LCBlbmNvZGluZylcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QubGVuZ3RoKSAvLyBhc3N1bWUgdGhhdCBvYmplY3QgaXMgYXJyYXktbGlrZVxuICBlbHNlXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBuZWVkcyB0byBiZSBhIG51bWJlciwgYXJyYXkgb3Igc3RyaW5nLicpXG5cbiAgdmFyIGJ1ZlxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIC8vIFByZWZlcnJlZDogUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICBidWYgPSBCdWZmZXIuX2F1Z21lbnQobmV3IFVpbnQ4QXJyYXkobGVuZ3RoKSlcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIFRISVMgaW5zdGFuY2Ugb2YgQnVmZmVyIChjcmVhdGVkIGJ5IGBuZXdgKVxuICAgIGJ1ZiA9IHRoaXNcbiAgICBidWYubGVuZ3RoID0gbGVuZ3RoXG4gICAgYnVmLl9pc0J1ZmZlciA9IHRydWVcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmIHR5cGVvZiBzdWJqZWN0LmJ5dGVMZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgLy8gU3BlZWQgb3B0aW1pemF0aW9uIC0tIHVzZSBzZXQgaWYgd2UncmUgY29weWluZyBmcm9tIGEgdHlwZWQgYXJyYXlcbiAgICBidWYuX3NldChzdWJqZWN0KVxuICB9IGVsc2UgaWYgKGlzQXJyYXlpc2goc3ViamVjdCkpIHtcbiAgICAvLyBUcmVhdCBhcnJheS1pc2ggb2JqZWN0cyBhcyBhIGJ5dGUgYXJyYXlcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkpXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3QucmVhZFVJbnQ4KGkpXG4gICAgICBlbHNlXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3RbaV1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBidWYud3JpdGUoc3ViamVjdCwgMCwgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgIW5vWmVybykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYnVmW2ldID0gMFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuLy8gU1RBVElDIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiAoYikge1xuICByZXR1cm4gISEoYiAhPT0gbnVsbCAmJiBiICE9PSB1bmRlZmluZWQgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgZW5jb2RpbmcpIHtcbiAgdmFyIHJldFxuICBzdHIgPSBzdHIgKyAnJ1xuICBzd2l0Y2ggKGVuY29kaW5nIHx8ICd1dGY4Jykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoIC8gMlxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSB1dGY4VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdyYXcnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gYmFzZTY0VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAqIDJcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gKGxpc3QsIHRvdGFsTGVuZ3RoKSB7XG4gIGFzc2VydChpc0FycmF5KGxpc3QpLCAnVXNhZ2U6IEJ1ZmZlci5jb25jYXQobGlzdCwgW3RvdGFsTGVuZ3RoXSlcXG4nICtcbiAgICAgICdsaXN0IHNob3VsZCBiZSBhbiBBcnJheS4nKVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH0gZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbGlzdFswXVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB0b3RhbExlbmd0aCAhPT0gJ251bWJlcicpIHtcbiAgICB0b3RhbExlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdG90YWxMZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcih0b3RhbExlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICBpdGVtLmNvcHkoYnVmLCBwb3MpXG4gICAgcG9zICs9IGl0ZW0ubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBCVUZGRVIgSU5TVEFOQ0UgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gX2hleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgYXNzZXJ0KHN0ckxlbiAlIDIgPT09IDAsICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnl0ZSA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBhc3NlcnQoIWlzTmFOKGJ5dGUpLCAnSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlXG4gIH1cbiAgQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBpICogMlxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBfdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2FzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2JpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIF9hc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBTdXBwb3J0IGJvdGggKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKVxuICAvLyBhbmQgdGhlIGxlZ2FjeSAoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpXG4gIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgaWYgKCFpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2UgeyAgLy8gbGVnYWN5XG4gICAgdmFyIHN3YXAgPSBlbmNvZGluZ1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgb2Zmc2V0ID0gbGVuZ3RoXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgc2VsZiA9IHRoaXNcblxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcbiAgc3RhcnQgPSBOdW1iZXIoc3RhcnQpIHx8IDBcbiAgZW5kID0gKGVuZCAhPT0gdW5kZWZpbmVkKVxuICAgID8gTnVtYmVyKGVuZClcbiAgICA6IGVuZCA9IHNlbGYubGVuZ3RoXG5cbiAgLy8gRmFzdHBhdGggZW1wdHkgc3RyaW5nc1xuICBpZiAoZW5kID09PSBzdGFydClcbiAgICByZXR1cm4gJydcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKHRhcmdldCwgdGFyZ2V0X3N0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzXG5cbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKCF0YXJnZXRfc3RhcnQpIHRhcmdldF9zdGFydCA9IDBcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCBzb3VyY2UubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdzb3VyY2VFbmQgPCBzb3VyY2VTdGFydCcpXG4gIGFzc2VydCh0YXJnZXRfc3RhcnQgPj0gMCAmJiB0YXJnZXRfc3RhcnQgPCB0YXJnZXQubGVuZ3RoLFxuICAgICAgJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSBzb3VyY2UubGVuZ3RoLCAnc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aClcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCA8IGVuZCAtIHN0YXJ0KVxuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgKyBzdGFydFxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmIChsZW4gPCAxMDAgfHwgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRfc3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0Ll9zZXQodGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLCB0YXJnZXRfc3RhcnQpXG4gIH1cbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBfdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJlcyA9ICcnXG4gIHZhciB0bXAgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBpZiAoYnVmW2ldIDw9IDB4N0YpIHtcbiAgICAgIHJlcyArPSBkZWNvZGVVdGY4Q2hhcih0bXApICsgU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gICAgICB0bXAgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0bXAgKz0gJyUnICsgYnVmW2ldLnRvU3RyaW5nKDE2KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXMgKyBkZWNvZGVVdGY4Q2hhcih0bXApXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKylcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gX2JpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIF9hc2NpaVNsaWNlKGJ1Ziwgc3RhcnQsIGVuZClcbn1cblxuZnVuY3Rpb24gX2hleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSsxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSBjbGFtcChzdGFydCwgbGVuLCAwKVxuICBlbmQgPSBjbGFtcChlbmQsIGxlbiwgbGVuKVxuXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5fYXVnbWVudCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpKVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgdmFyIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgICByZXR1cm4gbmV3QnVmXG4gIH1cbn1cblxuLy8gYGdldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLmdldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMucmVhZFVJbnQ4KG9mZnNldClcbn1cblxuLy8gYHNldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHYsIG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLnNldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMud3JpdGVVSW50OCh2LCBvZmZzZXQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgdmFsID0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICB9IGVsc2Uge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV1cbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDJdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgICB2YWwgfD0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0ICsgM10gPDwgMjQgPj4+IDApXG4gIH0gZWxzZSB7XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMV0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMl0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAzXVxuICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0XSA8PCAyNCA+Pj4gMClcbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICB2YXIgbmVnID0gdGhpc1tvZmZzZXRdICYgMHg4MFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQxNihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MzIoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMDAwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZmZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRmxvYXQgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWREb3VibGUgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuXG5cbiAgdGhpc1tvZmZzZXRdID0gdmFsdWVcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCAyKTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAgICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZmZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgNCk7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2YsIC0weDgwKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICB0aGlzLndyaXRlVUludDgodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICB0aGlzLndyaXRlVUludDgoMHhmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmLCAtMHg4MDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQxNihidWYsIDB4ZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQzMihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MzIoYnVmLCAweGZmZmZmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBmaWxsKHZhbHVlLCBzdGFydD0wLCBlbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uICh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXZhbHVlKSB2YWx1ZSA9IDBcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kKSBlbmQgPSB0aGlzLmxlbmd0aFxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5jaGFyQ29kZUF0KDApXG4gIH1cblxuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpLCAndmFsdWUgaXMgbm90IGEgbnVtYmVyJylcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ2VuZCA8IHN0YXJ0JylcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgdGhpcy5sZW5ndGgsICdzdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSB0aGlzLmxlbmd0aCwgJ2VuZCBvdXQgb2YgYm91bmRzJylcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHRoaXNbaV0gPSB2YWx1ZVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG91dCA9IFtdXG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gdG9IZXgodGhpc1tpXSlcbiAgICBpZiAoaSA9PT0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUykge1xuICAgICAgb3V0W2kgKyAxXSA9ICcuLi4nXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIG91dC5qb2luKCcgJykgKyAnPidcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBBcnJheUJ1ZmZlcmAgd2l0aCB0aGUgKmNvcGllZCogbWVtb3J5IG9mIHRoZSBidWZmZXIgaW5zdGFuY2UuXG4gKiBBZGRlZCBpbiBOb2RlIDAuMTIuIE9ubHkgYXZhaWxhYmxlIGluIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBBcnJheUJ1ZmZlci5cbiAqL1xuQnVmZmVyLnByb3RvdHlwZS50b0FycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAgIHJldHVybiAobmV3IEJ1ZmZlcih0aGlzKSkuYnVmZmVyXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBidWYgPSBuZXcgVWludDhBcnJheSh0aGlzLmxlbmd0aClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBidWYubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpXG4gICAgICAgIGJ1ZltpXSA9IHRoaXNbaV1cbiAgICAgIHJldHVybiBidWYuYnVmZmVyXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQnVmZmVyLnRvQXJyYXlCdWZmZXIgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKVxuICB9XG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxudmFyIEJQID0gQnVmZmVyLnByb3RvdHlwZVxuXG4vKipcbiAqIEF1Z21lbnQgYSBVaW50OEFycmF5ICppbnN0YW5jZSogKG5vdCB0aGUgVWludDhBcnJheSBjbGFzcyEpIHdpdGggQnVmZmVyIG1ldGhvZHNcbiAqL1xuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX2lzQnVmZmVyID0gdHJ1ZVxuXG4gIC8vIHNhdmUgcmVmZXJlbmNlIHRvIG9yaWdpbmFsIFVpbnQ4QXJyYXkgZ2V0L3NldCBtZXRob2RzIGJlZm9yZSBvdmVyd3JpdGluZ1xuICBhcnIuX2dldCA9IGFyci5nZXRcbiAgYXJyLl9zZXQgPSBhcnIuc2V0XG5cbiAgLy8gZGVwcmVjYXRlZCwgd2lsbCBiZSByZW1vdmVkIGluIG5vZGUgMC4xMytcbiAgYXJyLmdldCA9IEJQLmdldFxuICBhcnIuc2V0ID0gQlAuc2V0XG5cbiAgYXJyLndyaXRlID0gQlAud3JpdGVcbiAgYXJyLnRvU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvTG9jYWxlU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvSlNPTiA9IEJQLnRvSlNPTlxuICBhcnIuY29weSA9IEJQLmNvcHlcbiAgYXJyLnNsaWNlID0gQlAuc2xpY2VcbiAgYXJyLnJlYWRVSW50OCA9IEJQLnJlYWRVSW50OFxuICBhcnIucmVhZFVJbnQxNkxFID0gQlAucmVhZFVJbnQxNkxFXG4gIGFyci5yZWFkVUludDE2QkUgPSBCUC5yZWFkVUludDE2QkVcbiAgYXJyLnJlYWRVSW50MzJMRSA9IEJQLnJlYWRVSW50MzJMRVxuICBhcnIucmVhZFVJbnQzMkJFID0gQlAucmVhZFVJbnQzMkJFXG4gIGFyci5yZWFkSW50OCA9IEJQLnJlYWRJbnQ4XG4gIGFyci5yZWFkSW50MTZMRSA9IEJQLnJlYWRJbnQxNkxFXG4gIGFyci5yZWFkSW50MTZCRSA9IEJQLnJlYWRJbnQxNkJFXG4gIGFyci5yZWFkSW50MzJMRSA9IEJQLnJlYWRJbnQzMkxFXG4gIGFyci5yZWFkSW50MzJCRSA9IEJQLnJlYWRJbnQzMkJFXG4gIGFyci5yZWFkRmxvYXRMRSA9IEJQLnJlYWRGbG9hdExFXG4gIGFyci5yZWFkRmxvYXRCRSA9IEJQLnJlYWRGbG9hdEJFXG4gIGFyci5yZWFkRG91YmxlTEUgPSBCUC5yZWFkRG91YmxlTEVcbiAgYXJyLnJlYWREb3VibGVCRSA9IEJQLnJlYWREb3VibGVCRVxuICBhcnIud3JpdGVVSW50OCA9IEJQLndyaXRlVUludDhcbiAgYXJyLndyaXRlVUludDE2TEUgPSBCUC53cml0ZVVJbnQxNkxFXG4gIGFyci53cml0ZVVJbnQxNkJFID0gQlAud3JpdGVVSW50MTZCRVxuICBhcnIud3JpdGVVSW50MzJMRSA9IEJQLndyaXRlVUludDMyTEVcbiAgYXJyLndyaXRlVUludDMyQkUgPSBCUC53cml0ZVVJbnQzMkJFXG4gIGFyci53cml0ZUludDggPSBCUC53cml0ZUludDhcbiAgYXJyLndyaXRlSW50MTZMRSA9IEJQLndyaXRlSW50MTZMRVxuICBhcnIud3JpdGVJbnQxNkJFID0gQlAud3JpdGVJbnQxNkJFXG4gIGFyci53cml0ZUludDMyTEUgPSBCUC53cml0ZUludDMyTEVcbiAgYXJyLndyaXRlSW50MzJCRSA9IEJQLndyaXRlSW50MzJCRVxuICBhcnIud3JpdGVGbG9hdExFID0gQlAud3JpdGVGbG9hdExFXG4gIGFyci53cml0ZUZsb2F0QkUgPSBCUC53cml0ZUZsb2F0QkVcbiAgYXJyLndyaXRlRG91YmxlTEUgPSBCUC53cml0ZURvdWJsZUxFXG4gIGFyci53cml0ZURvdWJsZUJFID0gQlAud3JpdGVEb3VibGVCRVxuICBhcnIuZmlsbCA9IEJQLmZpbGxcbiAgYXJyLmluc3BlY3QgPSBCUC5pbnNwZWN0XG4gIGFyci50b0FycmF5QnVmZmVyID0gQlAudG9BcnJheUJ1ZmZlclxuXG4gIHJldHVybiBhcnJcbn1cblxuLy8gc2xpY2Uoc3RhcnQsIGVuZClcbmZ1bmN0aW9uIGNsYW1wIChpbmRleCwgbGVuLCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHJldHVybiBkZWZhdWx0VmFsdWVcbiAgaW5kZXggPSB+fmluZGV4OyAgLy8gQ29lcmNlIHRvIGludGVnZXIuXG4gIGlmIChpbmRleCA+PSBsZW4pIHJldHVybiBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICBpbmRleCArPSBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBjb2VyY2UgKGxlbmd0aCkge1xuICAvLyBDb2VyY2UgbGVuZ3RoIHRvIGEgbnVtYmVyIChwb3NzaWJseSBOYU4pLCByb3VuZCB1cFxuICAvLyBpbiBjYXNlIGl0J3MgZnJhY3Rpb25hbCAoZS5nLiAxMjMuNDU2KSB0aGVuIGRvIGFcbiAgLy8gZG91YmxlIG5lZ2F0ZSB0byBjb2VyY2UgYSBOYU4gdG8gMC4gRWFzeSwgcmlnaHQ/XG4gIGxlbmd0aCA9IH5+TWF0aC5jZWlsKCtsZW5ndGgpXG4gIHJldHVybiBsZW5ndGggPCAwID8gMCA6IGxlbmd0aFxufVxuXG5mdW5jdGlvbiBpc0FycmF5IChzdWJqZWN0KSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoc3ViamVjdCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3ViamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgfSkoc3ViamVjdClcbn1cblxuZnVuY3Rpb24gaXNBcnJheWlzaCAoc3ViamVjdCkge1xuICByZXR1cm4gaXNBcnJheShzdWJqZWN0KSB8fCBCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkgfHxcbiAgICAgIHN1YmplY3QgJiYgdHlwZW9mIHN1YmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICB0eXBlb2Ygc3ViamVjdC5sZW5ndGggPT09ICdudW1iZXInXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYiA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGIgPD0gMHg3RilcbiAgICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHN0YXJ0ID0gaVxuICAgICAgaWYgKGIgPj0gMHhEODAwICYmIGIgPD0gMHhERkZGKSBpKytcbiAgICAgIHZhciBoID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5zbGljZShzdGFydCwgaSsxKSkuc3Vic3RyKDEpLnNwbGl0KCclJylcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaC5sZW5ndGg7IGorKylcbiAgICAgICAgYnl0ZUFycmF5LnB1c2gocGFyc2VJbnQoaFtqXSwgMTYpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShzdHIpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgcG9zXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpXG4gICAgICBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGRlY29kZVV0ZjhDaGFyIChzdHIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0cilcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoMHhGRkZEKSAvLyBVVEYgOCBpbnZhbGlkIGNoYXJcbiAgfVxufVxuXG4vKlxuICogV2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgdmFsdWUgaXMgYSB2YWxpZCBpbnRlZ2VyLiBUaGlzIG1lYW5zIHRoYXQgaXRcbiAqIGlzIG5vbi1uZWdhdGl2ZS4gSXQgaGFzIG5vIGZyYWN0aW9uYWwgY29tcG9uZW50IGFuZCB0aGF0IGl0IGRvZXMgbm90XG4gKiBleGNlZWQgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gdmVyaWZ1aW50ICh2YWx1ZSwgbWF4KSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA+PSAwLCAnc3BlY2lmaWVkIGEgbmVnYXRpdmUgdmFsdWUgZm9yIHdyaXRpbmcgYW4gdW5zaWduZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgaXMgbGFyZ2VyIHRoYW4gbWF4aW11bSB2YWx1ZSBmb3IgdHlwZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmc2ludCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmSUVFRTc1NCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG59XG5cbmZ1bmN0aW9uIGFzc2VydCAodGVzdCwgbWVzc2FnZSkge1xuICBpZiAoIXRlc3QpIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8ICdGYWlsZWQgYXNzZXJ0aW9uJylcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJaYmk3Z2JcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9ub2RlX21vZHVsZXNcXFxcYnVmZmVyXFxcXGluZGV4LmpzXCIsXCIvbm9kZV9tb2R1bGVzXFxcXGJ1ZmZlclwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uIChidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtXG4gIHZhciBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxXG4gIHZhciBlTWF4ID0gKDEgPDwgZUxlbikgLSAxXG4gIHZhciBlQmlhcyA9IGVNYXggPj4gMVxuICB2YXIgbkJpdHMgPSAtN1xuICB2YXIgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwXG4gIHZhciBkID0gaXNMRSA/IC0xIDogMVxuICB2YXIgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXVxuXG4gIGkgKz0gZFxuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpXG4gIHMgPj49ICgtbkJpdHMpXG4gIG5CaXRzICs9IGVMZW5cbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpIHt9XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzXG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KVxuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbilcbiAgICBlID0gZSAtIGVCaWFzXG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbilcbn1cblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uIChidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgY1xuICB2YXIgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKVxuICB2YXIgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpXG4gIHZhciBkID0gaXNMRSA/IDEgOiAtMVxuICB2YXIgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMFxuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpXG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDBcbiAgICBlID0gZU1heFxuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKVxuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLVxuICAgICAgYyAqPSAyXG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKVxuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrK1xuICAgICAgYyAvPSAyXG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMFxuICAgICAgZSA9IGVNYXhcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIlpiaTdnYlwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL25vZGVfbW9kdWxlc1xcXFxpZWVlNzU0XFxcXGluZGV4LmpzXCIsXCIvbm9kZV9tb2R1bGVzXFxcXGllZWU3NTRcIikiXX0=
