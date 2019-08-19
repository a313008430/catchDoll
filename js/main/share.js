define(['tool', 'config', 'gameLogic', 'viewsEvent'], function (T, Config, gameLogic, _v) {
    'use strict';
	/**
	 * 分享
	 * @author zhoulifeng  1-29 14:17
	 */
    function share(shareUrl) {
        if (Config.SDKType === Config.SDK.wanBa) {
            mqq.invoke('ui', 'setOnShareHandler', function (type) {
                mqq.invoke('ui', 'shareMessage', {
                    title: '疯狂抓娃娃',
                    desc: '无限送金币，免费抓娃娃，抓到直接邮寄到家，快来一起玩吧！',
                    share_type: type,
                    share_url: shareUrl,
                    image_url: 'https://qzonestyle.gtimg.cn/open/app_icon/06/63/50/92/1106635092_100_m.png',
                    back: true
                }, function (result) {
                    //result
                    if (result.retCode == 0) {
                        T.server({ url: Config.url.shareGame + '&session=' + Cookies.get('_session') })
                    }
                });
            });
            mqq.ui.showShareMenu();
        }
    }
    return { share: share }
})