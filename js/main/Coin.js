// 娃娃币页面
define(['tool', 'config', 'gameLogic', 'viewsEvent'], function (T, Config, gameLogic, _v) {
    'use strict';
    /**
     * 娃娃币交易信息
     * @author zhoulifeng
     */
    function coin() {
        T.server({ url: Config.url.playerInfo + '&session=' + Cookies.get('_session') })
            .then(function (n) {
                // var gold_num = n.body.player;
                // console.log(gold_num)
                if (!n.body.errcode) {
                    $('#gold_num').html(n.body.player.gold);
                    $('#silver_num').html(n.body.player.goldGiving);
                }
            });
        T.server({ url: Config.url.goldLists + '&session=' + Cookies.get('_session') })
            .then(function (c) {
                var gold = c.body.records;
                console.log(gold);
                var goldList = '';
                if (gold.length == 0) {
                    goldList += '<li>未消费</li>';
                    $('#record-list').html(goldList);
                    return false;
                }
                if (!c.body.errcode) {
                    for (var x = 0, l = gold.length; x < l; x++) {
                        var time = parseInt(gold[x].createTime);
                        if (gold[x]['amount'] != 0) {
                            goldList += '<li><div class="info"><h3>' + Config.cointype[gold[x]['type']] + '</h3><time>' + getTimes(time) + '</time></div><span class="' + cointype(gold[x]['type']).goldClassName + '">' + cointype(gold[x]['type']).goldPlus + gold[x]['amount'] + (gold[x]['coinType'] === '0' ? '金币' : '代币') + '</span></li>';
                        }
                    }
                    $('#record-list').html(goldList);
                }
            })
        function cointype(type) {
            var goldClassName = '';
            var goldPlus = '';
            if (type == '2' || type == '3') {
                goldClassName = 'pay';
                goldPlus = '-';
            } else {
                goldClassName = 'earn';
                goldPlus = '+';
            }
            return { goldClassName, goldPlus }
        }
        function getTimes(time) {
            var data = new Date(time), //实例一个时间对象；
                y = data.getFullYear(),//获取系统的年；
                mon = data.getMonth() + 1,//获取系统月份，由于月份是从0开始计算，所以要加1
                d = data.getDate(),// 获取系统日，
                h = data.getHours(),//获取系统时，
                min = data.getMinutes(),//分
                s = data.getSeconds();//秒
            return y + '/' + (mon < 10 ? '0' + mon : mon) + '/' + (d < 10 ? '0' + d : d) + '  ' + (h < 10 ? '0' + h : h) + ':' + (min < 10 ? '0' + min : min) + ':' + (s < 10 ? '0' + s : s);
        }
        // 返回设置
        $('.back-img').off('click').on('click', function () {
            _v.openView('set')
        })
    }
    return { coin: coin }
})