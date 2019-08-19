define(['tool', 'config', 'gameLogic', 'viewsEvent'], function (T, Config, gameLogic, _v) {
    'use strict';
    function help() {
        var helpNum = null;//问题列表顺序
        $('.question-boxs').off('cilck').on('click', 'a', function () {
            window.helpNum = $(this).index();
            // console.log(helpNum)
            _v.openView('helpanswer');
        })
        // 返回设置页面
        $('.back-img').off('click').on('click', function () {
            _v.openView('set')
        })
        // 进入投诉建议
        $('#service_link').off('click').on('click', function () {
            _v.openView('complain')
        })

    }
    return { help: help }
})