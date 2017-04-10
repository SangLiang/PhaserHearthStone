/**
 * 游戏数据管理类
 */

var DataManager = {
	turn: 0, // 0代表自己回合,1代表敌人回合 
	fee: 1, // 初始化费用，和游戏回合相关
	AI: null,

	heroChoiseCard: null, // 英雄选择的卡牌
	heroFighers: null, // 英雄随从
	heroHandCard: null, // 英雄手牌
	heroFee: null, // 英雄的费用
	heroHead: null, // 英雄头像

	enemyHandCard: null, // 敌人手牌 
	enemyFee: null, // 敌人的费用
	enemyHead: null, // 敌人的头像
	enemyFighters:null, // 敌人战场的随从


	turnOverButton:null // 回合结束的按钮
}

module.exports = DataManager;