define(['tool', 'config', 'gameLogic', 'viewsEvent'], function (T, Config, gameLogic, _v) {
    'use strict';
    /**
     * 公告
     * 
     */
    function notice() {
        // 返回设置
        $('.back-img').off('click').on('click', function () {
            _v.openView('index')
        })
    }
    return { notice: notice }
})