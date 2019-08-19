/**
 *  乐蜀SDK所有逻辑
 * @author Created by Xiazhou on 2018年2月5日 20:06.
 */
define(['tool', 'gameLogic', 'config'], function (T, _g_l, _c) {
	var key = 'WE18vx3CR24PjO2XN5veUsUmXtHdrIo7',
		userMsg = {};
	console.log('leShu')
	
	function init () {
		//针对iframe设置滚动
		$('html, body').css('overflow-y', 'auto');
		
		/**
		 *  引用乐蜀JSSDK文件
		 * @author Created by Xiazhou on 2018年2月5日 20:06.
		 */
		var js = document.createElement('script');
		js.src = 'http://h5.leshu.com/Public/game/js/sdk.js';
		js.addEventListener('load', function () {
			
			userMsg = LS_SDK.getURLQuery(decodeURI(location.href));
			console.log(userMsg)
			
			if(md5(userMsg['gameId'] + userMsg['channel'] + userMsg['uid'] + key) !== userMsg['sign']){
				T.hintView.send('<p style="color: red;font-weight: bolder;">验证错误！请刷新再试！</p>');
				return false;
			}
			// var lsgame = new LsGame(userMsg["gameId"], userMsg["token"], userMsg["channel"]);
			if(Cookies.get('uid') !== 'leShu_' + userMsg.uid){//如果账号和缓存账号不一样，清除缓存账号
				_g_l.setClearCookies();
			}
			//游戏开始
			_g_l.gameStart({
				userName: userMsg.nickname,
				userId: 'leShu_' + userMsg.uid,
				// token:userMsg.token,
				pwd: '',
				uPic: userMsg.headimgurl,
				sex: 0
			}, function () {
				getPlayerInfo (userMsg.nickname);
				// getPlayerInfo (d.user_name);
			});
			// console.log(lsgame)
			console.log(location)
		});
		document.body.appendChild(js);
		
	}
	
	init();
	
	/**
	 *  充值档位选择回调进行相应充值
	 * @author Created by Xiazhou on 2018年2月06日 19:06.
	 */
	T.chooseOrderCall = function (d) {
		console.log(d)
		
		api.call(T, {
			url: _c.url.leShuPaySDK + '&accountId=' + Cookies.get('playerId') + '&itemId=' + d.payId + '&account=' + Cookies.get('uid'),
			isLoading: true
		}, function (data) {
			console.log(data)
			var lsgame = new LsGame(userMsg["gameId"], userMsg["token"], userMsg["channel"]);
			console.log(lsgame)
			var payObj = {
				orderid: data['orderID'],// 游戏方订单号
				money: parseInt(d['price']) * 100,// 订单金额（单位：分）
				product: d.name,// 商品名称
				channel: userMsg['channel'],// 游戏方 渠道id
				sign: md5(data['orderID'] + parseInt(d['price']) * 100 + d.name + userMsg['channel'] + key),// 签名
				// attach: "string",				// 附加参数
				onPayCallback: function (data) {
					if (data.status == 1) {
						alert("支付成功");
					} else {
						alert("支付失败");
					}
				},
				onPayCancel: function () {
					alert("取消支付");
				}
			};
			lsgame.pay(JSON.stringify(payObj));
		});
	};
	
	/**
	 *  获取用户信息
	 * @author Created by Xiazhou on 2018年1月26日 15:42.
	 * @param {String} name 用户名称
	 */
	function getPlayerInfo (name) {
		api.call(T, {
			url:_c.url.playerInfo + '&session=' + Cookies.get('_session'),
			isLoading:true
		}, function (d) {
			if (!d.body.errcode) {
				if(d.body.player.name != name){//如果名称不一样，修改名称
					modifyPlayerName(name);
				}
			}
		});
	}
	
	/**
	 *  修改用户名称
	 * @author Created by Xiazhou on 2018年1月26日 15:47.
	 * @param {String} name 新名字
	 */
	function modifyPlayerName (name) {
		api.call(T, {
			url:_c.url.modifyPlayerName + '&session=' + Cookies.get('_session') + '&nickName=' + name,
			isLoading:true
		}, function (d) {
			console.log(d)
		});
	}
	
	
	
	/**
	 *  内部协议入口
	 * @author Created by Xiazhou on 2018年2月06日 19:06.
	 * @param {Object} data 需要传入数据
	 * @param {Function} fn 回调
	 */
	function api (data, fn) {
		// console.log(this)
		this.server(data).then(function (d) {
			if (fn) fn(d);
		})
	}
});