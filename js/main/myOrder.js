// 订单管理页
define(['tool', 'config', 'gameLogic', 'viewsEvent'], function (T, Config, gameLogic, _v) {
	'use strict';
	
	/**
	 *订单管理数据
	 *@author zhoulifeng
	 */
	function Order (type) {
		// 娃娃列表
		var toysLists;//wawa 列表缓存
		var orderLists;//订单列表缓存
		var orderData;//临时缓存
		function wawa () {
			T.server({url: Config.url.toysLists + '&session=' + Cookies.get('_session')})
				.then(function (t) {
					toysLists = t.body.toys;
					listAll();
				})
		}
		
		// 订单列表
		mineOrder();
		
		function mineOrder (type) {
			T.server({url: Config.url.myOrder + '&session=' + Cookies.get('_session')})
				.then(function (data) {
					orderLists = data.body.orders;
					console.log(orderLists)
					orderData = orderLists;
					console.log(orderData)
					if (type) {				//type 为 1 时
						listOrder();
					} else {
						wawa();
					}
					
				})
		}
		
		//订单加载
		
		//默认余额
		var balance = 0;
		function listAll () {
			console.log(orderData)
			var orderlist = '',
				//需要消耗金币
				costNum = 0;
			if (orderData == null) {
				$('#orderlist-all').html('<div class="order-list">无订单</div>');
				return false;
			} else if (orderData.length == 0) {
				$('#orderlist-all').html('<div class="order-list">无订单</div>');
				return false;
			} else {
				for (var x = 0, l = orderData.length; x < l; x++) {
					// console.log(orderData[x].details)
					var wawalist = orderData[x].details;
					// console.log(wawalist);
					var wawabox = '';
					for (var m = 0, wl = wawalist.length; m < wl; m++) {
						var wawaid = wawalist[m].id
						for (var n = 0, tl = toysLists.length; n < tl; n++) {
							if (wawaid == toysLists[n].id) {
								wawabox += '<a href="javascript:;"><img src="' + toysLists[n]['url'] + '" alt=""><dl><dt>' + toysLists[n]['name'] + '</dt><dd>' + toysLists[n]['name'] + '</dd></dl></a>';
							}
						}
						// console.log(wawabox);
					}
					// console.log(wawabox);
					var status = '',
						needPay = false;
					if (orderData[x]['status'] == 0) {
						status = '等待买家付款';
						needPay = true;
					} else if (orderData[x]['status'] == 1) {
						status = '等待卖家发货';
					} else if (orderData[x]['status'] == 2) {
						status = '等待买家收货';
					}
					costNum = orderData[x]['price'] * 10;
					orderlist += '<div class="order-list"><div class="tittle-order"><p class="order-num">订单号：<em class="orderidnum">' + orderData[x]['id'] + '</em></p><span>' + status + '</span></div>';
					orderlist += '<div class="commodity-info">' + wawabox + '</div>';
					orderlist += '<p class="commodity-num">共计<em>' + orderData[x]['details'].length + '</em>件商品</p><div class="pay-info">';
					
					if(orderData[x]['gmMsg'] != null){
						orderlist += '<p class="mes">卖家留言：' + orderData[x]['gmMsg'] + '</p>';
					}
					
					orderlist += '<p><span>运费(快递)</span><span class="pay-num">运费合计:￥<i>' + costNum + '</i>币</span></p>';
					
					if (needPay) {//是否需要支付
						orderlist += '<p><span>余额支付</span><span class="pay-num"><i class="balanceNum">' + balance + '</i>币</span>' +
							'<span class="font-weight">订单总价</span><span class="pay-num font-weight"><i>' + costNum + '</i>币</span>' +
							'</p>';
						
						orderlist += '<p><span class="font-weight">需要支付</span><span class="pay-num font-weight"><i >' + costNum + '</i>币</span></p>';
					}
					
					
					orderlist += '<div class="pay-state">' + (orderData[x]['status'] == '0' ? '<a class="no-state cancelorder"  href="javascript:;">取消订单</a>' : '')
						+ (needPay ? '<a href="javascript:void(0);"  orderid="' + orderData[x]['id'] + '" date-cost="' + costNum + '" class="order-pay-btn orderPayBtn">支付</a>' : '<a href="javascript:void(0);">' + status + '</a>') +
						'</div></div></div>';
				}
				$('#orderlist-all').html(orderlist);
				$('.cancelorder').off('click').on('click', function () {
					var orderCencelId = [];
					orderCencelId = $(this).parents('.order-list').find('.orderidnum').html();
					T.server({url: Config.url.cancelOrder + '&session=' + Cookies.get('_session') + '&orderId=' + orderCencelId})
						.then(function (data) {
							if (_state == -1) {
								mineOrder();
							} else if (_state == 0) {
								mineOrder(1);
							}
							T.hintView.send('取消订单成功！');
						})
				});
				//支付订单
				var  payView = T.payView();
				// if (needPay) {
					console.log(1)
					getPlayerInfo();
					$('.orderPayBtn').off('click').on('click', function () {
						if(balance < parseFloat(this.getAttribute('date-cost'))){
							//充值成功回调
							T.paySuccessCall = function (d) {
								if (parseInt(d.ret)) {//充值失败
									T.hintView.send('<div style="color: red">充值失败</div>');
								} else {
									// T.hintView.send('<div style="color: red">充值失败</div>');
									//更新金币
									getPlayerInfo ();
								}
								
								
							};
							payView.open();
						}else{
							T.server({
								url: Config.url.payOrder + '&session=' + Cookies.get('_session')
								+ '&orderId=' + this.getAttribute('orderid')
							})
								.then(function (data) {
									console.log(data)
									if (data.body.result == true) {
										if (_state == -1) {
											mineOrder();
										} else if (_state == 0) {
											mineOrder(1);
										}
										T.hintView.send('支付成功，请等待发货！');
									}else{
										T.hintView.send('余额不足请充值！');
									}
								})
						}
						
					});
				}
			// }
		}
		
		/**
		 *  通过用户信息获取余额
		 * @author Created by Xiazhou on 2018年1月17日 13:23.
		 */
		function getPlayerInfo () {
			T.server({ url: Config.url.playerInfo + '&session=' + Cookies.get('_session') })
				.then(function (data) {
					balance = data.body.player.gold;
					$('.balanceNum').html(balance);
				});
		}
		
		var _state = -1;
		$('.order-nav').off('click').on('click', 'li', function () {
			$(this).siblings().find('a').removeClass('on');
			$(this).find('a').addClass('on');
			if ($(this).index() == 0) {
				mineOrder();
			} else if ($(this).index() == 1) {
				_state = 0;
				console.log(_state)
				listOrder();
			} else if ($(this).index() == 2) {
				_state = 1;
				listOrder();
			} else if ($(this).index() == 3) {
				_state = 2;
				listOrder();
			}
		})
		
		// 数据筛选
		function listOrder () {
			var list = orderLists;
			console.log(list)
			var oList = [];
			// if (!data.body.errcode) {
			if (list == null) {
				orderData = oList;
				// return false;
			} else if (list.length == 0) {
				orderData = oList;
				// return false;
			} else {
				for (var x = 0, l = list.length; x < l; x++) {
					if (list[x]['status'] == _state) {
						oList.push(list[x])
					}
				}
				orderData = oList;
			}
			wawa();
		}
		 // 返回设置
		 $('.back-img').off('click').on('click', function () {
            _v.openView('set')
        })
	}
	
	return {order: Order}
});