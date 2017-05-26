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