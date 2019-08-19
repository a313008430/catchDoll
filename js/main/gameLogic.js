/**
 * 所有界面 逻辑开始
 * Created by Xiazhou on 2017年12月14日.
 */
define(['tool', 'config', 'configViewBase', 'viewsEvent'], function (T, Config, configViewBase, viewsEvent) {
	//默认暂时只http
	if (location.protocol == 'https:' && location.host == 'wawa.leshu.com') {
		location.protocol = 'http:'
	}
	
	// $('div').on('touchstart', function () {
	// 	return false;
	// })
	// document.documentElement.ontouchstart = function () {
	// 	return false;
	// }
	
	var isLogin = false,
		isNewbie = false,
		//界面类型
		TYPE = 'index';
	
	// window.T = new Tool();//引用工具
	
	//版本验证---清cookie
	var _v = 201801042032;
	if (!(Cookies.get('_v') && Cookies.get('_v') == _v)) {
		setClearCookies();
	}
	
	// window.onerror = function (msg, url, row, col, error) {
	
	
	// 	try {
	// 		if(RoomeInfoTime)clearInterval(RoomeInfoTime);
	// 	}
	// 	catch(err) {
	
	// 	}
	// 	setClearCookies();
	// 	T.hintView.send('<p style="color: red">如果有问题请清除“缓存”</p>');
	// 	// gameStart();
	// 	// setLogin({
	// 	// 	userName: Cookies.get('uid'),
	// 	// 	pwd: Cookies.get('pwd')});
	// 	// logicStart
	// 		// window.location.href = location.href;
	// 	console.log([
	// 		msg,  url,  row, col, error
	// 	]);
	// 	return true;
	// };
	
	
	viewsEvent.replaceIndexViewEvent();//单独重置首页面一些事件
	
	//构造方法---不需要走登录获取的数据
	// switch (TYPE) {
	// 	case 'grab'://抓取界面
	// 		require(['grab'], function (i) {
	// 			var game = i.grab.init();
	// 			game.setReloadGame(gameStart);//设置游戏重新开始接口
	// 			game.setClearSession(setClearCookies);//设置游戏内部清除数据
	// 		});
	//
	// 		break;
	// 	case 'index':
	// 		// Index();
	// 		viewsEvent.openView('index');
	// 		break;
	// 	default:
	// 		break;
	// }
	
	var roomId = location.hash.match(/(?:roomid\=)(\w+)/);
	if (!roomId) {//如果检测到房间号，直接进入房间
		viewsEvent.openView('index');
	}
	
	/**
	 *  对应SDK入口
	 * @author Created by Xiazhou on 2018年1月23日 20:38.
	 */
	//玩吧
	switch (Config['SDKType']) {
		//玩吧
		case Config['SDK']['wanBa']:
			require(['wanBa'], function (e) {
				e.wanBaLogin();
			});
			break;
			//美图
		case Config['SDK']['meiTu']:
			require(['meiTu'], function (e) {
			
			});
			break;
			//乐蜀
		case Config['SDK']['leShu']:
			require(['leShu']);
			break;
		default:
			console.log('no SDK');
			break;
	}
	
	
	/**
	 *  登陆成功---回调---界面逻辑开始
	 * @author Created by Xiazhou on 2017年12月14日 17:32.
	 * @param {Object} obj 用户数据  会传入空
	 */
	function logicStart (obj) {
		console.log(obj)
		isLogin = true;
		// console.log(1111111111111)
		// console.log(isLogin)
		if (roomId) {//如果检测到房间号，直接进入房间
			TYPE = 'grab';
		} else {
			TYPE = 'index';
		}
		switch (TYPE) {
			case 'grab'://抓取界面
				viewsEvent.openView('grab');
				// if(isLogin){
				// 	require(['grab'], function (i) {
				// 		var game = i.grab;
				// 		//写入用户信息
				// 		if (obj) game.setUserMsg(obj);
				// 		game.roomJoin();//进入房间开始游戏
				//
				// 	});
				// }
				break;
			case 'index':
				if (isLogin) {
					require(['index'], function (i) {
						// if (location.host != 'wawa.leshu.com') {
						// 	i.index();
						// }
						i.getPlayerInfo();
						if (isNewbie) i.setBeginnerHint();
					});
				}
				
				break;
			case 'order':
				// if(isLogin) {
				// 	require(['order'], function (i) {
				// 		i.i_order();
				// 	});
				// }
				break;
			default:
				break;
		}
	}
	
	
	/**
	 *  获取用户登陆所需要的信息--并走登陆
	 * @author Created by Xiazhou on 2018年1月8日 13:35.
	 * @param {Object} userMsg 登陆所需要的信息
	 * @param {Function} fn 回调
	 */
	function gameStart (userMsg, fn) {
		//登陆-获取注册信息
		if (!Cookies.get('_session') || !Cookies.get('uid')) {
			if (location.host == 'wawa.leshu.com') {
				T.loginView.open(function (uid) {
					console.log('来了来了', uid)
					// return;
					var userMsg = {
						userName: uid + 'test',
						userId: uid,
						pwd: '',
						// uPic: 'http://tx.hddzz.leshu.com/ww/head/head.png',
						uPic: '',
						sex: 0
					};
					setClearCookies();
					Cookies.set('uid', uid);//设置cookies
					setLogin(userMsg);
				});
			} else {
				setClearCookies();
				if (userMsg) {
					Cookies.set('uid', userMsg['userId']);//设置cookies
				}
				setLogin(userMsg, fn);
			}
			
		} else {
			setLogin(null, fn);
		}
	}
	
	// if (location.host == 'wawa.leshu.com') {
	gameStart();//游戏开始
	// }
	
	
	/**
	 *  登陆协议
	 * @author Created by Xiazhou on 2017年12月14日 16:34.
	 * @param {Object} obj 用户数据
	 * @param {Funtion} fn 回调
	 */
	function setLogin (obj, fn) {
		var api = Config['url'];
		if (Cookies.get('_session')) {
			logicStart();
			if (fn) fn();
			return;
		}
		if (!obj) return;//如果没有数据，且没有正常用户数据 过来
		//注册2 测试注册--获取loginCode
		T.server({
			url: api.login2 + '&account=' + obj.userId + '&pwd=' + obj.pwd + '&vistor=0&gametoken=' + (obj.token?obj.token:0) + '&device=xxx&adSource=' + Config.adSource[Config.systemSDK] + '&adPos=0&os=' + Config.systemSDK
		}).then(function (data) {
			var loginCode = data.body.code;
			console.error(loginCode);
			// console.log(api.login2 + '&account=' + obj.userId + '&pwd=' + obj.pwd + '&vistor=0&gametoken=0&device=xxx&adSource=' + Config.adSource[Config.systemSDK] + '&adPos=0&os=' + Config.systemSDK)
			
			//缓存用户名和密码----暂时先这样保存
			// Cookies.set('_userId', obj.userId);//获取用户id
			
			//注册，
			if (loginCode[loginCode.length - 1] == 1) {
				if (Config.SDKType === Config.SDK.wanBa) window.reportRegister();
				isNewbie = true;//开启新手引导
				//encodeURI(obj.userName)   有些玩家名称是特殊字符，服务端会有问题，这里转一下
				return T.server({url: api.createPlayer + '&logincode=' + loginCode + '&name=' + encodeURI(obj.userName) + '&pic=' + obj.uPic + '&sex=' + obj.sex + '&os=' + Config.systemSDK});
				//正式登陆
			} else {
				if (Config.SDKType === Config.SDK.wanBa) window.reportLogin();
				return T.server({url: api.login + '&logincode=' + loginCode + '&os=' + Config.systemSDK});
			}
		}).then(function (data) {//获取和设置 session
			if(!data.body){
				T.hintView.send('登陆失败!');
				isLogin = false;
				setClearCookies();
				return false;
			}
			Cookies.set('playerId', data.body.player.id);//获取用户id
			Cookies.set('_session', data.body.session);//缓存session
			Cookies.set('_v', _v);//缓存版本号
			
			if (fn) fn();
			
			T.loginView.close();
			
			T.loading().close();
			
			logicStart(obj);
		});
	}
	
	function getIsLogin () {
		return isLogin;
	}


//清除cookies
	function setClearCookies () {
		Cookies.remove('_session');
		// Cookies.remove('uid');
	}
	
	// window.setClearCookies = setClearCookies;
	
	return {
		setClearCookies: setClearCookies,
		gameStart: gameStart,
		getIsLogin: getIsLogin
	}
});