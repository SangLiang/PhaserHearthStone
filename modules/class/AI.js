/**
 * 电脑AI
 */
var DataManager = require("./DataManager");
var EnemyFighter = require("./EnemyFighter");

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
        alert("敌人选择不出牌,不知道有什么阴谋诡计");
        return;
    }

    if (DataManager.enemyFighters == null) {
        DataManager.enemyFighters = new EnemyFighter(game);
        DataManager.enemyFighters.buildFighter(game, this.enemyChoise.cardInfo.HP, this.enemyChoise.cardInfo.attack, this.enemyChoise.cardInfo.cnName, this.enemyChoise.cardInfo.fight);
    } else {
        DataManager.enemyFighters.buildFighter(game, this.enemyChoise.cardInfo.HP, this.enemyChoise.cardInfo.attack, this.enemyChoise.cardInfo.cnName, this.enemyChoise.cardInfo.fight);
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
        console.log(shotList);
        // 返回左手第一张牌
        return shotList[0];
    }
}

// 选择要攻击的目标
AI.prototype.choiseAttackTarget = function () {
    // 敌人没有随从
    if (!DataManager.enemyFighters || DataManager.enemyFighters.fightObj.length == 0) {
        return;
    }
    console.log(DataManager.enemyFighters);
    if (!DataManager.heroFighters) { // 判断玩家的随从是否存在
        if (DataManager.heroFighers.fightObj.length == 0) {
            for (var i = 0; i < DataManager.enemyFighters.fightObj.length; i++) {
                if (DataManager.enemyFighters.fightObj[i].sleep == false) {
                    alert("敌人的" + DataManager.enemyFighters.fightObj[i].cnName + "攻击了你的英雄");

                    // 更新攻击之后的状态
                    DataManager.enemyFighters.fightObj[i].sleep = true;
                    DataManager.enemyFighters.fightObj[i].alpha = 0.7;
                    DataManager.heroHead.HPObj.setText(parseInt(DataManager.heroHead.HPObj.text) - DataManager.enemyFighters.fightObj[i].attack);
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
            for (var k = 0; k < DataManager.heroFighers.fightObj.length; k++) {
                _heroFightersAttack += DataManager.heroFighers.fightObj[k].attack;
            }

            for (var i = 0; i < DataManager.enemyFighters.fightObj.length; i++) {
                if (DataManager.enemyFighters.fightObj[i].sleep == false) {
                    if (_enemyFightersAttack >= _heroFightersAttack) { // AI场攻大于玩家随从的场攻
                        alert("敌人的" + DataManager.enemyFighters.fightObj[i].cnName + "攻击了你的英雄");
                        // 更新攻击之后的状态
                        DataManager.enemyFighters.fightObj[i].sleep = true;
                        DataManager.enemyFighters.fightObj[i].alpha = 0.7;
                        DataManager.heroHead.HPObj.setText(parseInt(DataManager.heroHead.HPObj.text) - DataManager.enemyFighters.fightObj[i].attack);
                    } else {
                        // AI场攻小于玩家场攻则攻击随从
                        alert("敌方的" + DataManager.enemyFighters.fightObj[i].cnName + "攻击了我方的" + DataManager.heroFighers.fightObj[0].cnName);

                        var _heroFightHP = DataManager.enemyFighters.fightObj[i].hp - DataManager.heroFighers.fightObj[0].attack;
                        var _enemyFightHP = DataManager.heroFighers.fightObj[0].hp - DataManager.enemyFighters.fightObj[i].attack;

                        // 更新玩家的随从的hp
                        DataManager.enemyFighters.fightObj[i].hp = _heroFightHP;
                        DataManager.enemyFighters.fightObj[i].alpha = 0.7;
                        DataManager.enemyFighters.fightObj[i].sleep = true;
                        DataManager.enemyFighters.fightObj[i].children[2].alpha = 0;
                        DataManager.enemyFighters.fightObj[i].children[1].setText(_heroFightHP);

                        // 更新敌人的玩家的hp
                        DataManager.heroFighers.fightObj[0].hp = _enemyFightHP;
                        DataManager.heroFighers.fightObj[0].children[1].setText(_enemyFightHP);

                        if (_heroFightHP <= 0) {
                            DataManager.enemyFighters.fightObj[i].destroy();
                            DataManager.enemyFighters.reListObjs();
                        }

                        if (_enemyFightHP <= 0) {
                            DataManager.heroFighers.fightObj[0].destroy();
                            DataManager.heroFighers.reListObjs();
                        }
                    }
                }
            }
        }
    }
}


module.exports = AI;