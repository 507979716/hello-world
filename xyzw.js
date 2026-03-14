/*
 *
 *

[rewrite_local]
# >咸鱼之王 - 通用配置修改（敌伤害=1,血量=1）
^https?:\/\/xxz-xyzw-res\.hortorgames\.com\/remote\/config\/import\/10 url script-response-body https://raw.githubusercontent.com/507979716/hello-world/refs/heads/master/xyzw.js

[mitm]
hostname = xxz-xyzw-res.hortorgames.com
*
*
*/


var body = $response.body;
if (!body) {
    $done({});
} else {
    let obj = JSON.parse(body);

// 递归修改函数
(function modify(node) {
    if (!node || typeof node !== 'object') return;
    
    // 找到关卡配置对象（包含 monsters 字段）
    if (Array.isArray(node.monsters)) {
        // 修改预览金币（仅界面显示）
        if (node.hasOwnProperty('waveCoin')) node.waveCoin = 999999999;
        if (node.hasOwnProperty('coinBase') && node.coinBase > 0) node.coinBase = 999999999;
        
        // 修改怪物参数：monster 数组格式为 [怪物ID, 难度等级, 出现数量]
        node.monsters.forEach(wave => {
            if (Array.isArray(wave)) {
                wave.forEach(monster => {
                    if (Array.isArray(monster) && monster.length >= 3) {
                        // 难度等级设为 1（血量伤害最低）
                        if (typeof monster[1] === 'number') monster[1] = 3;
                        // 出现数量设为 1
                        if (typeof monster[2] === 'number') monster[2] = 1;
                    }
                });
            }
        });
    }
    
    // 递归遍历所有属性
    for (let key in node) {
        modify(node[key]);
    }
    })(obj);

    $done({ body: JSON.stringify(obj) });
}
