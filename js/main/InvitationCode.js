define(['tool', 'config', 'gameLogic', 'viewsEvent'], function (T, Config, gameLogic, _v) {
    'use strict';
	/**
	 * 填写邀请码
	 * @author zhoulifeng  1-30 13:17
	 */
    function sendpromoCode() {
        if ($('#sendCode').val() != '') {
            var promoCode = parseInt($('#sendCode').val());
            T.server({ url: Config.url.promoReward + '&session=' + Cookies.get('_session') + '&promoCode=' + promoCode })
                .then(function (data) {
                    console.log(data)
                    if (data.body.result == true) {
                        T.hintView.send('领取成功！');
                        sendafter();
                    } else if (data.body.errcode) {

                        T.hintView.send(Config.promoReward[data.body['errcode']]);
                    }
                })
        }
    }
    function sendafter() {
        $('.sendbefore').hide();
        $('.sendafter').show();
        $('.coin_box').find('span').html('x' + window.promoBonusValue)
        // 前往邀请好友页
        $('.sendafter').find('a').off('click').on('click', function () {
            _v.openView('inviteFriends')
        })
    }

    function invitationCode() {
        // 提交邀请码
        $('.sendFor').off('click').on('click', function () {
            sendpromoCode();
        })

        // 返回设置
        $('.back-img').off('click').on('click', function () {
            _v.openView('set')
        })
    }
    return { invitationCode: invitationCode }
})