// 订单支付页
define(['tool', 'config', 'gameLogic', 'viewsEvent', 'addresslist'], function (T, Config, gameLogic, _v, _add) {
    'use strict';
    /**
     * 支付订单页
    */
    //支付
    function pay() {
        T.server({
            url: Config.url.payOrder + '&session=' + Cookies.get('_session')
                + '&orderId=' + orderId
        })
            .then(function (data) {
                console.log(data)
                if (data.body.result == true) {
                    $('.pop-order-black').show();
                    setTimeout(function () {
                        $('.pop-order-black').hide();
                        _v.openView('order')
                    }, 2000)
                    //进入订单管理
                } else {
                    T.hintView.send('余额不足请充值！');
                }
            })
    }

    // 娃娃列表获取
    function myorder() {
        var _last = [];
        console.log(payindex[0])
        T.server({ url: Config.url.toysLists + '&session=' + Cookies.get('_session') })
            .then(function (l) {
                var list = l.body.toys;
                for (var n = 0, n_l = payindex.length; n < n_l; n++) {
                    for (var m = 0, m_l = list.length; m < m_l; m++) {
                        if (list[m].id == payindex[n]) {
                            console.log(list[m].id)
                            _last.push(list[m])
                        }
                    }
                }
                console.log(_last)
                // 娃娃图片加载
                var payimg = _last;
                var payimglist = '';
                for (var x = 0, l = payimg.length; x < l; x++) {
                    payimglist += '<li><img src="' + payimg[x]['url'] + '" alt="' + payimg[x]['name'] + '"></li>';
                }
                console.log(payimglist)
                $('.pay-true-list ul').html(payimglist);
                T.loading().close();
            });
    }
    // 用户余额加载
    function goldMine() {
        T.server({ url: Config.url.playerInfo + '&session=' + Cookies.get('_session') })
            .then(function (data) {
                var playergold = data.body.player.gold;
                $('#playergold').html(playergold);
                // console.log(playergold)
                // console.log(price_last)
                // console.log(parseInt(playergold) >= parseInt(price_last * 10))
                if (parseInt(playergold) >= parseInt(price_last * 10)) {
                    $('.top-up').css('display', "none");
                    $('.tick-pay').css("display", "block");
                } else {
                    $('.top-up').css('display', "block");
                    $('.tick-pay').css("display", "none");
                }
            })
    }

    function confirmPay() {
        myorder()
        goldMine()
        // 返回订单管理
        $('.back-img').off('click').on('click', function () {
            _v.openView('order')
        })
        console.log(address_list)
        // 地址加载
        $('.address-info-box').html(address_list);
        // 邮费加载
        $('.confirm-box em').html(price_last * 10);
        // 支付订单按钮
        $('.true-button').off('click').on('click', function () {
            pay()
        });

	    /**
	     *  快递充值
	     * @author Created by Xiazhou on 2018年1月17日 11:05.
	     */
        var payView = T.payView();
        $('#expressPayBtn').off('click').on('click', function () {
            //充值成功回调
            T.paySuccessCall = function (d) {
                if (parseInt(d.ret)) {//充值失败
                    T.hintView.send('<div style="color: red">充值失败</div>');
                } else {

                }

                //更新金币
                T.server({
                    url: Config.url.playerInfo + '&session=' + Cookies.get('_session')
                }).then(function (data) {
                    console.log(data)
                    $('#playergold').text(data.body.player.gold);
                });
            };
            payView.open();
        });
    }

    return { confirmPay: confirmPay }
})


