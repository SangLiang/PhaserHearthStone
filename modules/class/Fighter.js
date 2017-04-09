/**
 * 战斗元素类
 * @param game 
 * @param x [number] 初始化的
 */

function Fighter(game) {
    this.fee = null;
    this.hp = null;
    this.attack = null;
    this.status = false; // 随从状态
    this.fightObj = []; // 战斗随从数组
    this.x = 150;
    this.y = game.world.centerY + 30;
}

Fighter.prototype.init = function (game) {
}

// 生成战斗随从
Fighter.prototype.buildFighter = function (game) {
    var fightBg = game.add.image(this.x, this.y, "fishman_baby_fight");
    this.fightObj.push(fightBg);
    this.reListObjs();
}



Fighter.prototype.reListObjs = function () {
    if (this.fightObj.length == 0) {
        // 如果随从的队列为空，不进行排序
        return;
    } else {
        // 重排战斗随从的数组
        for (var i = 0; i < this.fightObj.length; i++) {
            this.fightObj[i].x = this.x + i * 95;
        }
    }
}

module.exports = Fighter;