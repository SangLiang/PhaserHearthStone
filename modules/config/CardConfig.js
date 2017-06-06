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