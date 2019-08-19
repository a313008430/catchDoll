define(['tool', 'config', 'gameLogic', 'viewsEvent', 'help'], function (T, Config, gameLogic, _v, _help) {
    'use strict';
    function helpanswer() {
        // console.log(helpNum)
        $('#answerList').find('section').eq(helpNum).show();
        // 返回帮助首页
        $('.back-img').off('click').on('click', function () {
            $('#answerList').find('section').hide()
            _v.openView('help')
        })
        // 进入投诉建议
        $('#service_link').off('click').on('click', function () {
            _v.openView('complain')
        })

    }
    return { helpanswer: helpanswer }
})