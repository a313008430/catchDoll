// 订单娃娃选择页
define(['tool', 'config', 'gameLogic', 'viewsEvent', 'addresslist'], function (T, Config, gameLogic, _v, _add) {
    'use strict';
    /**
     * 订单选择页
     */
    var addressAll = [];//用户地址
    var addressAllList = [];//缓存所有地址列表
    var add = null;//地址文字缓存
    var addressId = null; //地址id
    var payindex = [];//娃娃id缓存
    var address_list = '';//地址信息缓存
    var price_last = null;//邮费
    function getOldAddress() {
        T.server({ url: Config.url.address + '&session=' + Cookies.get('_session') })
            .then(function (data) {
                console.log(data)
                // address = data.body.addresses;
                if (!data.body.addresses.length) {
                    T.hintView.send('请添加地址!');
                    $('.address-info-box').html('点击这里添加地址！');
                    return false;
                }
                ////获取不为零的地址
                for (var i = 0; i < data.body.addresses.length; i++) {
                    if (parseInt(data.body.addresses[i].id)) {
                        addressAll = data.body.addresses[i];
                        addressId = addressAll.id;
                    }
                }
                // console.log(addressAll)
                fillInput();
            })
    }
    //  分析地址
    function fillInput() {
        // console.log(addressAll)
        // console.log(addressAllList)
        for (var x = 0, l = addressAllList.length; x < l; x++) {
            if (addressAllList[x].id == addressAll.province) {
                var p = addressAllList[x]['name'];
                if (addressAllList[x]['price'] != 0) {
                    price_last = addressAllList[x]['price']
                }
            }
            if (addressAllList[x].id == addressAll.city) {
                var c = addressAllList[x]['name'];
                if (addressAllList[x]['price'] != 0) {
                    price_last = addressAllList[x]['price']
                }
            }
            if (addressAllList[x].id == addressAll.district) {
                var d = addressAllList[x]['name'];
                // address_list(d)
            }
        }
        add = p + c + d;
        window.price_last = price_last;
        if (addressAll.length == 0) {
            add = '';
        }
        addressPave()
    }
    // 地址加载
    function addressPave() {
        address_list = '';
        address_list += '<a href="javascript:void(0);"><p><span>收货人：' + addressAll['name'] + '</span><em>' + addressAll['mobile'] + '</em></p><h4>收货地址:' + add + addressAll['address'] + '</h4></a>';
        $('.address-info-box').html(address_list);
        window.address_list = address_list
        $('.address-info-box').find('a').append('<i></i>')
    }

    //可选的娃娃列表
    function getOptionalToy() {
        T.server({ url: Config.url.toysLists + '&session=' + Cookies.get('_session') })
            .then(function (data) {
                var list = data.body.toys;
                console.log(list)
                var _l = [];
                if (!data.body.errcode) {
                    for (var x = 0, l = list.length; x < l; x++) {
                        if (list[x]['status'] == 0) {
                            _l.push(list[x])
                        }
                    }
                    truetoys(_l);
                }
            })
    }

    // 娃娃列表加载
    function truetoys(_l) {
        var truetoys = _l,
            toyslist = '';
        for (var x = 0, l = _l.length; x < l; x++) {
            var time = parseInt(truetoys[x].createTime);
            toyslist += '<li data-id="' + truetoys[x]['id'] + '"><label><img src="' + truetoys[x]['url'] + '"/><i></i><h3>' + truetoys[x]['name'] + '</h3><time>' + getTimes(time) + '</time></label></li>';
        }
        $('.choose-list ul').html(toyslist);
    }

    // 时间
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

    // 创建订单
    function gopay() {
        payindex = [];
        for (var x = 0, l = $('.choose-list li').length; x < l; x++) {
            if ($('.choose-list li')[x].className == 'choose-tick') {
                payindex.push($('.choose-list li').eq(x).attr('data-id'));
            }
        }
        console.log(payindex)
        window.payindex = payindex;
        T.server({
            url: Config.url.createOrder + '&session=' + Cookies.get('_session')
                + '&addressId=' + addressId
                + '&ids=' + payindex.join(',')
        })
            .then(function (t) {
                console.log(t)
                if (!t.body) {
                    T.hintView.send('请添加地址!');
                    return false;
                }
                window.orderId = t.body.order.id;
                console.log(window.orderId);
                _v.openView('confirmPay')
            })
    }


    function CreatOrder() {
        // 获取地址
        _add.getList(function (d) {
            addressAllList = d;
            getOldAddress()
        });
        getOptionalToy()

        // 修改地址跳转
        $('.address-info-box').off('click').on('click', function () {
            _v.openView('address')
        })

        // 返回我的娃娃页面
        $('.back-img').off('click').on('click', function () {
            _v.openView('user')
        })

        // 修改地址跳转
        $('.address-info-box').off('click').on('click', function () {
            _v.openView('address')
        })

        // 复选框样式 发货按钮
        $('.choose-list').off('click').on('click', 'li', function () {
            if (this.className.length) {
                this.className = '';
            } else {
                this.className = 'choose-tick';
            }
            var tick_num = $('.choose-list .choose-tick').length;
            if (tick_num > '5') {
                tick_num = '5';
            }
            if (tick_num >= '2') {
                $('#confirmOrder').addClass('on_tick');
                $('#confirmOrder').off('click').on('click', function () {
                    gopay()
                })
            } else {
                $('#confirmOrder').off('click');
                $('#confirmOrder').removeClass('on_tick');
            }
            $('.confirm-box em').text(tick_num);
            if ($('.choose-tick').length > 5) {
                // console.log(this)
                $(this).removeClass('choose-tick');
            }
        });
    }
    return { CreatOrder: CreatOrder }
})