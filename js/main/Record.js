// 抓取记录页
define(['tool', 'config', 'gameLogic', 'viewsEvent'], function (T, Config, gameLogic, _v) {
    'use strict';
    /**
     * 抓取记录
     * 
     */
    function record(t) {
        console.log(1111)


        T.server({ url: Config.url.playRecords + '&session=' + Cookies.get('_session') })
            .then(function (data) {
                console.log(data.body.records)
                var playRecords = data.body.records;
                var playRecordsList = '';
                if (playRecords.length == 0) {
                    playRecordsList += '<li>未消费</li>'
                    $('#game-record').html(playRecordsList);
                    return false;
                }
                if (!data.body.errcode) {
                    for (var x = 0, l = playRecords.length; x < l; x++) {
                        var time = parseInt(playRecords[x].createTime);
                        playRecordsList += '<li><img src="' + playRecords[x]['url'] + '"/><div class="info"><h3>' + playRecords[x]['name'] + '</h3><time>' + getTimes(time) + '</time></div><span class="game-result ' + (playRecords[x]['data'] === 'false' ? 'result-fail' : 'result-win') + '">' + (playRecords[x]['data'] === 'false' ? '失败' : '成功') + '</span></li>'
                    }
                    $('#game-record').html(playRecordsList)
                }
            });
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
        $('.back-img').off('click').on('click',function(){
			_v.openView('set')
		})
    }
    return { record: record }






})
