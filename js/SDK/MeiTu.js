/**
 *  美图SDK所有逻辑
 * @author Created by Xiazhou on 2018年1月23日 20:51.
 */
define(['tool', 'gameLogic', 'config'], function (T, _g_l, _c) {
	var baseUrl = 'http://h5.91wan.com/api/dataapi.php';
	// c.init();, 'eruda', c
	/**
	 *  初始化，页面设置，引用JS
	 * @author Created by Xiazhou on 2018年1月24日 11:27.
	 */
	function init () {
		//针对iframe设置滚动
		$('html, body').css('overflow-y', 'auto');
		
		/**
		 *  引用美图JSSDK文件
		 * @author Created by Xiazhou on 2018年1月24日 11:22.
		 * @param
		 */
		var js = document.createElement('script');
		js.src = 'http://h5.91wan.com/js/7wanwansdk.js';
		js.addEventListener('load', function () {
			//美图登陆
			quwanwansdk.getLoginInfo({
				game_id: 2642,
				server_id: 0,
				callFunc: function (d) {
					console.log(d)
					//游戏开始
					_g_l.gameStart({
						userName: d.user_name,
						userId: 'meiTu_' + d.uid,
						pwd: '',
						uPic:'',
						sex: 0
					}, function () {
						getPlayerInfo (d.user_name);
					});
					//获取平台相关信息
					// response.uid			//（平台uid）
					// response.user_name	//（平台user_name ）
					// response.img			//（平台img）
					// response.nick_name	//（平台nick_name）
					// response.sid			//（平台sid ）
				}
			});
			
			setShare();
		});
		document.body.appendChild(js);
	}
	
	init();
	
	/**
	 *  充值档位选择回调进行相应充值
	 * @author Created by Xiazhou on 2018年1月26日 11:15.
	 */
	T.chooseOrderCall = function (d) {
		// console.log(d)
		// console.log(T)
		// console.log( _c.url.meiTuPaySDK)
		api.call(T, {
			url: _c.url.meiTuPaySDK, data: {
				itemId: d.payId,//道具ID
				account: Cookies.get('uid'),//账号
				accountId: Cookies.get('playerId'),//账号id
				serverId: 0,//
				adSource: 'meiTuH5',//广告渠道
				adPos: ''//广告渠道细分
			}
		}, function (payDate) {
			// console.log(payDate)
			
			quwanwansdk.pay({
				token: payDate['token'],
				sign: payDate['sign'],
				callFunc: function (status,msg) {
					if (status == "success") {
						T.paySuccessCall({ret:0});//这个数据 是模拟的
						T.hintView.send('充值成功！');
					}else{
						T.paySuccessCall({ret:1});//这个数据 是模拟的
						console.log("支付失败："+msg);
						alert(JSON.stringify(msg));
					}
				}
			});
			
			
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
	 *  设置分享
	 * @author Created by Xiazhou on 2018年1月25日 16:58.
	 */
	function setShare () {
		quwanwansdk.change_share_info({
			title: "疯狂抓娃娃",
			summary: "无限送金币，免费抓娃娃，抓到直接邮寄到家，快来一起玩吧！",
			img_url: "https://qzonestyle.gtimg.cn/open/app_icon/06/63/50/92/1106635092_100_m.png",
			callFunc: function (status) {
				if (status == "success") {
					T.hintView.send('分享成功!')
					T.server({ url: Config.url.shareGame + '&session=' + Cookies.get('_session') })
				} else {
					T.hintView.send('分享取消!')
				}
			},
			show_share: false
		});
	}
	
	/**
	 *  内部协议入口
	 * @author Created by Xiazhou on 2018年1月24日 11:30.
	 * @param {Object} data 需要传入数据
	 * @param {Function} fn 回调
	 */
	function api (data, fn) {
		// console.log(this)
		this.server(data).then(function (d) {
			if (fn) fn(d);
		})
	}
	
	return {};
});