/**
 * Created by Xiazhou on 2018年1月6日.
 */
define(['tool', 'crypto', 'gameLogic', 'config'], function (T, crypto, gameLogic, config) {
	var appKey = 'O26stzl2n28XUwlZ',
		baseUrl = 'https://api.urlshare.cn',
		paramsObj = null,
		wanBaApi = {
			userInfo: '/v3/user/get_info',//获取用户信息
			playZoneUserInfo: '/v3/user/get_playzone_userinfo',//查询用户积分(余额)及其它支付相关信息。
		},
		//充值回调事件绑定判断(加载顺序问题，会导致有时候不能航空方面)
		isAddEvent = false,
		//充值档位ID
		payId = null;
	// 初始化启动下拉刷新的功能
	// mqq.invoke("ui", "setPullDown", {enable: true});
	// // 监听`qbrowserPullDown`事件，当用户触发之后，即可开始处理业务方的逻辑
	// mqq.addEventListener("qbrowserPullDown", function () {
	// 	// ... Your Code ...
	// 	mqq.invoke("ui", "setPullDown", {success: true, text: "刷新成功"});
	// });


	//设置屏幕常亮
	//mqq.device.setScreenStatus(1, function () {

	//});

	/**
	 *  玩吧登陆
	 * @author Created by Xiazhou on 2018年1月11日 21:09.
	 * @param
	 */
	function wanBaLogin() {
		//异步方式获取登录态
		window.getOpenKey(function (d) {

			if (!d.code) {
				paramsObj = {
					"appid": d.data.appid,
					"format": "json",
					"openid": d.data.openid,
					"openkey": d.data.openkey,
					"pf": "wanba_ts",
					"userip": ""
				};
				//判断是否已经切换账号
				if (Cookies.get('wanBaOpenId') !== d.data.openid) {
					gameLogic.setClearCookies();
					Cookies.set('wanBaOpenId', d.data.openid);
				}
				paramsObj = JSON.stringify(paramsObj);

				T.loading().open();

				//获取玩吧用户信息
				getAPIMsg(JSON.parse(paramsObj), wanBaApi["userInfo"], function (data) {
					console.log(T.isiOS())
					//游戏开始
					gameLogic.gameStart({
						userName: data["nickname"],
						userId: 'wanba_' + (T.isiOS() ? 'o' : 'a') + '_' + md5(d.data.openid),
						pwd: '',
						uPic: data['figureurl'],
						sex: data['gender'] == '男' ? 0 : 1
					}, function () {
						T.loading().close();
					});

					// replaceNodeEvent();
				});
			}
			console.log(d);
		});
	}


	// window.reportLogin();
	//https://1106635092.urlshare.cn/
	console.error('in.........wanBaSDK')

	/**
	 *  获取用户信息
	 * @author Created by Xiazhou on 2018年1月8日 14:11.
	 * @param {Object} params 参数
	 * @param {Function} fn 回调
	 * @param {String} api 接口
	 */
	function getAPIMsg(params, api, fn) {
		//获取用户信息
		params['sig'] = getSig(params, 'POST', api);
		T.server({
			url: baseUrl + api,
			data: params,
			type: 'POST'
		}).then(function (data) {
			console.log(data);
			if (fn) fn(data);
		});
	}


	/**
	 *  获取Sig
	 * @author Created by Xiazhou on 2018年1月8日 11:21.
	 * @param {Object} data 参数
	 * @param {String} type 协议类型
	 * @param {String} api api
	 */
	function getSig(data, type, api) {

		var queryArray = [];
		for (var key in data) {
			if (key != 'sig') {
				queryArray.push(key + '=' + data[key]);
			}
		}

		queryArray.sort(function (val1, val2) {
			if (val1 > val2) {
				return 1;
			}
			if (val1 < val2) {
				return -1;
			}
			return 0;
		});

		return crypto.enc.Base64.stringify(crypto.HmacSHA1(type + '&' + encodeURIComponent(api) + '&' + encodeURIComponent(queryArray.join('&')), appKey + '&'));
	}

	/**
	 *  充值档位选择回调进行相应充值
	 * @author Created by Xiazhou on 2018年1月9日 11:39.
	 */
	T.chooseOrderCall = function (d) {
		var params = JSON.parse(paramsObj);
		params["zoneid"] = (T.isiOS() ? 2 : 1);
		payId = d.payId;

		//强制绑定 充值成功按钮事件
		// if(!isAddEvent)replaceNodeEvent ();
		// $('#orderFinishBtn').off('click').on('click', function () { T.payView().close(); });
		// console.log(d)
		console.log(params)
		T.loading().open();
		//获取实际星币余额
		getAPIMsg(params, wanBaApi["playZoneUserInfo"], function (data) {
			if (!data.code) {
				if (data.data[0].score < parseInt(d.gold)) {//判断玩吧余额是否足
					window.popPayTips({
						version: 'v2',
						defaultScore: parseInt(d.gold) - data.data[0].score,
						appid: 1106635092
					});
				} else {
					T.hintView.send('充值成功！');
				}
			} else {
				// alert(JSON.stringify(data));
				T.hintView.send('充值失败！');
				console.log(data)
			}
			T.loading().close();
		});

	};

	window.__paySuccess = function () {
		//支付成功执行
		T.hintView.send('充值成功！');
		replaceNodeEvent();
	};

	window.__payError = function () {
		//支付失败执行
		T.hintView.send('充值失败！');
	};

	window.__payClose = function () {
		//关闭对话框执行,IOS下无效
		// alert('您已经取消支付')
		T.hintView.send('您已经取消支付！');
	};


	/**
	 * 重置页面事件--针对SDK单独设置
	 */
	function replaceNodeEvent() {
		// console.log($('#orderFinishBtn'))

		console.log('发起星币兑换....' + payId)
		var d = JSON.parse(paramsObj);
		T.server({
			url: config.url.wanBaPaySDK, data: {
				openid: d.openid,
				openkey: d.openkey,
				// appid: paramsObj.appid,
				pf: 'wanba_ts',
				zoneid: T.isiOS() ? 2 : 1,//IOS2，Android填1
				itemid: payId,//道具ID
				account: Cookies.get('uid'),//账号
				accountId: Cookies.get('playerId'),//账号id
				serverId: 0,//
				adSource: 'wanBaH5',
				adPos: '',
			}
		}).then(function (data) {
			if (!parseInt(data.ret)) {
				T.paySuccessCall(data);
			} else {
				T.hintView.send('充值失败！');
				// alert(JSON.stringify(data))
				console.log(data)
			}
		});


		isAddEvent = true;
	}

	/**
	 *  添加分享和添加到主页功能按钮
	 * @author Created by Xiazhou on 2018年1月9日 19:57.
	 * @param
	 */
	function setShareBtnInIndex() {
		if (TYPE === 'index') {
			var view = $('.nav-bottom'),
				shareBtn = document.createElement('div'),//分享
				//添加到桌面
				desktopAddIcon = document.createElement('div');
			// shareBtn.innerHTML = '分享';
			shareBtn.className = 'share-btn-index';
			// desktopAddIcon.innerHTML = '桌面';
			desktopAddIcon.className = 'desktop-icon';
			view[0].appendChild(shareBtn);
			view[0].appendChild(desktopAddIcon);

			shareBtn.addEventListener('click', function () {
				mqq.invoke('ui', 'setOnShareHandler', function (type) {
					mqq.invoke('ui', 'shareMessage', {
						title: '疯狂抓娃娃',
						desc: '无限送金币，免费抓娃娃，抓到直接邮寄到家，快来一起玩吧！',
						share_type: type,
						share_url: window.shareUrl_index,
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
			});

			desktopAddIcon.addEventListener('click', function () {
				mqq.ui.addShortcut({
					action: 'web',
					title: '疯狂抓娃娃OL',
					icon: 'https://qzonestyle.gtimg.cn/open/app_icon/06/63/50/92/1106635092_100_m.png',
					url: window.OPEN_DATA.jumpurl,
					callback: function (ret) {
						if (!ret.result) {
							alert('收藏成功');
						}

					}
				});
				// window.mqq.invoke('ui','setOnAddShortcutHandler', {'callback':mqq.callback(function(){
				// 		alert(1);
				// 	}, false,true)});
			});
		}
	}

	setShareBtnInIndex();

	return {
		wanBaLogin: wanBaLogin
	}
});