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
            // 修改预览金币（仅界面显示，保留原样）
            if (node.hasOwnProperty('waveCoin')) node.waveCoin = 999999999;
            if (node.hasOwnProperty('coinBase') && node.coinBase > 0) node.coinBase = 999999999;
            
            // 修改怪物参数：monster 数组格式为 [怪物ID, 难度等级, 出现数量]
            node.monsters.forEach(wave => {
                if (Array.isArray(wave)) {
                    wave.forEach(monster => {
                        if (Array.isArray(monster) && monster.length >= 3) {
                            
                            // 【核心修改点：按比例削弱难度】
                            // 这里的 0.5 代表难度/属性降为原来的 50%。
                            // Math.max(1, ...) 确保削弱后的数值最低不会小于 1。
                            if (typeof monster[1] === 'number') {
                                monster[1] = Math.max(1, Math.floor(monster[1] * 0.1)); 
                            }
                            
                            // 【注意】去掉了原版的 monster[2] = 1
                            // 保持怪物数量不变，这样通关总伤害就能过服务端的校验了
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
