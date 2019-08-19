define(['tool', 'config', 'gameLogic', 'viewsEvent', 'clipboard','share'], function (T, Config, gameLogic, _v, clipboard,_share) { 
    'use strict';
    window['Clipboard'] = clipboard;
	/**
	 * 邀请好友
	 * @author zhoulifeng  1-30 13:17
	 */

    var shareUrl = null;
    function configCode() {
        // T.server({ url: Config.url.configInfo + '&session=' + Cookies.get('_session') })
        //     .then(function (data) {
        //         if (!data.body.errcode) {
        T.server({ url: Config.url.playerInfo + '&session=' + Cookies.get('_session') })
            .then(function (c) {
                console.log(c)
                $('.code_box').html(c.body.player.promoCode);
                $('.code_box').attr('data-clipboard-text', c.body.player.promoCode);
                shareUrl = 'http://imgws.leshu.com/game/17/share/share-3.html?' + 'doll_name=' + '&doll_img=' + '&code=' + c.body.player.promoCode + '&user_img=' + c.body.player.pic;

            })
        //     }
        // })
    }
    // function invite() {
    //     var shareBox = $('.inviteList');
    //     if (Config.SDKType === Config.SDK.wanBa) {
    //         shareBox.on('click', function () {
    //             _share.share(shareUrl);
    //             mqq.invoke('ui', 'setOnShareHandler', function (type) {
    //                 mqq.invoke('ui', 'shareMessage', {
    //                     title: '疯狂抓娃娃',
    //                     desc: '无限送金币，免费抓娃娃，抓到直接邮寄到家，快来一起玩吧！',
    //                     share_type: type,
    //                     share_url: shareUrl,
    //                     image_url: 'https://qzonestyle.gtimg.cn/open/app_icon/06/63/50/92/1106635092_100_m.png',
    //                     back: true
    //                 }, function (result) {
    //                     // alert(JSON.stringify(result.retCode))
    //                     if (result.retCode == 0) {
    //                         T.server({ url: Config.url.shareGame + '&session=' + Cookies.get('_session') })
    //                     }
    //                 });
    //             });
    //             mqq.ui.showShareMenu();
    //         });
    //         } else if (Config.SDKType === Config.SDK.meiTu) {
    //             shareBox.on('click', function () {
    //                 quwanwansdk.change_share_info({
    //                     title: "疯狂抓娃娃",
    //                     summary: "无限送金币，免费抓娃娃，抓到直接邮寄到家，快来一起玩吧！",
    //                     img_url: "https://qzonestyle.gtimg.cn/open/app_icon/06/63/50/92/1106635092_100_m.png",
    //                     callFunc: function (status) {
    //                         if (status == "success") {
    //                             T.hintView.send('分享成功!')
    //                             T.server({ url: Config.url.shareGame + '&session=' + Cookies.get('_session') })
    //                         } else {
    //                             T.hintView.send('分享取消!')
    //                         }
    //                     },
    //                     show_share: false
    //                 });
    //             });
    //     }
    // }
    function touch() {
        var clipboard = new Clipboard('.code_box');
        var _switch = false;
        var _time = null;
        $('.code_box').off('click').on('click', function () {
            clipboard.on('success', function (e) {
                T.hintView.send('复制成功！');
            });
        })
    }


    function inviteFriends() {
        configCode();
        touch();
        // invite();
        // 分享按钮
        $('.inviteList').off('click').on('click', function () {
            // alert(shareUrl);
            _share.share(shareUrl);
        })
        // 取消
        $('.inviteFriends_bottom').find('a').off('click').on('click', function () {
            _v.openView('set')
        })
        // 返回设置
        $('.back-img').off('click').on('click', function () {
            _v.openView('set')
        })
    }
    return { inviteFriends: inviteFriends }
})