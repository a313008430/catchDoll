/**
 * 公共配置
 * Created by Xiazhou on 2017年12月14日.
 */
;(function () {
	var mainUrl = {
		//乐蜀数据请求入口
		leShuURL: MAIN_URL,
		//娃娃机入口
		// zhuaURL: 'http://test.azusasoft.com:4500/',
		//乐蜀内部SDK
		leShuSDK: 'http://test.passport.leshu.com/'
	};
	var system = {
		//平台需要类型
		SDKTypeLeShuH5: 6,
		SDKTypeLeWanBaH5: 7,//玩吧安卓
		SDKTypeLeWanBaIOSH5: 8,//玩吧苹果
		SDKTypeLeMeiTuH5: 9//美图
	};
	var config = {
		//初始化平台数据类型
		systemSDK: 4,//默认下IOS2
		//SDK列表==》客户端自己约定的数值
		SDK: {
			wanBa: 1,//玩吧
			meiTu: 2,//美图
			leShu: 3,//乐蜀
		},
		//adSource===>管理台显示平台文本===>写什么那边显示什么
		adSource: {
			6: 'LeShuH5',//乐蜀H5
			7: 'WanBaH5_Android',//玩吧安卓
			8: 'WanBaH5_IOS',//玩吧IOS
			9: 'MeiTuH5',//玩吧IOS
		},
		//SDK平台类型区分
		SDKType: null,
		url: {
			//测试注册
			login2: mainUrl.leShuURL + 'toy.do?action=Main.login2',
			//创建角色
			createPlayer: mainUrl.leShuURL + 'toy.do?action=Main.createPlayer',
			//正式登陆--获取session
			login: mainUrl.leShuURL + 'toy.do?action=Main.login',
			//加入房间--获取操作socket的地址
			roomJoin: mainUrl.leShuURL + 'toy.do?action=Room.join',
			//获取视频信息Code和用户id
			videoCode: mainUrl.leShuURL + 'toy.do?action=Player.videoCode',
			//获取玩家信息
			playerInfo: mainUrl.leShuURL + 'toy.do?action=Player.info',
			//获取房间抓记录
			roomRecords: mainUrl.leShuURL + 'toy.do?action=Room.roomRecords',
			//获取房间信息
			roomInfo: mainUrl.leShuURL + 'toy.do?action=Room.info',
			//获取视频流信息-地址
			roomVideoUrl: mainUrl.leShuURL + 'toy.do?action=Room.videoH5WS',
			//玩家操作-1进房间 2 上机 3 下机 4退出
			playerManual: mainUrl.leShuURL + 'toy.do?action=Room.playerManual',
			//首页房间
			roomIndex: mainUrl.leShuURL + 'toy.do?action=Room.list',
			//首页幻灯
			slideIndex: mainUrl.leShuURL + 'toy.do?action=Main.billboard',
			//获取留言
			getChatMessage: mainUrl.leShuURL + 'toy.do?action=Room.getChatMessage',
			//发送留言
			sendChatMessage: mainUrl.leShuURL + 'toy.do?action=Room.chat',
			//获取充值信息
			getPayInfo: mainUrl.leShuURL + 'toy.do?action=Main.payInfo',
			//乐蜀sdk预充值
			leShuPaySDK: mainUrl.leShuURL + 'leshu_sdk_pay_start.jsp?serverId=1&channel=leshusdk',
			//抓取记录
			playRecords: mainUrl.leShuURL + 'toy.do?action=Player.playRecords',
			// 玩家抓取到所有玩具
			toysLists: mainUrl.leShuURL + 'toy.do?action=Player.toyList',
			// 娃娃币交易信息
			goldLists: mainUrl.leShuURL + 'toy.do?action=Player.balance',
			// 订单
			myOrder: mainUrl.leShuURL + 'manage.do?action=Player.getOrders',
			//地址获取 
			address: mainUrl.leShuURL + 'manage.do?action=Player.getAddress',
			//地址列表获取 
			getRegions: mainUrl.leShuURL + 'manage.do?action=Main.getRegions',
			//客服
			serviceInfo: mainUrl.leShuURL + 'manage.do?action=Main.serviceInfo',
			// 地址增加
			addAddress: mainUrl.leShuURL + 'manage.do?action=Player.addAddress',
			// 地址修改
			modifyAddress: mainUrl.leShuURL + 'manage.do?action=Player.modifyAddress',
			//创建订单
			createOrder: mainUrl.leShuURL + 'manage.do?action=Player.createOrder',
			//支付订单 
			payOrder: mainUrl.leShuURL + 'manage.do?action=Player.payOrder',
			//取消订单 
			cancelOrder: mainUrl.leShuURL + 'manage.do?action=Player.cancelOrder',
			// 图片版本号
			configInfo: mainUrl.leShuURL + 'toy.do?action=Main.configInfo',
			//获取首充时间
			getBuyTimes: mainUrl.leShuURL + 'manage.do?action=Player.buyTimes',
			//修改玩家名称
			modifyPlayerName: mainUrl.leShuURL + 'manage.do?action=Player.modifyNickName',
			// 签到列表
			dicInfo: mainUrl.leShuURL + 'manage.do?action=Main.dicInfo',
			// 签到
			sign: mainUrl.leShuURL + 'manage.do?action=Player.sign',
			// 投诉建议发送
			chatGo: mainUrl.leShuURL + 'toy.do?action=Customer.chat',
			// 投诉建议接受
			chatBack: mainUrl.leShuURL + 'toy.do?action=Customer.record',
			// 主线任务列表
			getMainTask: mainUrl.leShuURL + 'toy.do?action=Task.getMainTask',
			// 获取主线任务奖励
			getMainReward:mainUrl.leShuURL + 'toy.do?action=Task.getMainReward',
			// 日常任务列表
			getDailyTask:mainUrl.leShuURL + 'toy.do?action=Task.getDailyTask',
			// 获取日常任务奖励
			getDailyReward: mainUrl.leShuURL + 'toy.do?action=Task.getDailyReward',
			// 推广码输入
			promoReward: mainUrl.leShuURL + 'toy.do?action=Player.promoReward',
			// 分享成功提交
			shareGame: mainUrl.leShuURL + 'toy.do?action=Task.shareGame',
			//乐蜀回调
			leShuSDKCallBack: mainUrl.leShuURL + 'leshu_sdk_pay_callback.jsp?details=12312312312312&gameid=17&orderprice=12.01&proid=中文test&serverid=1&uname=ABCD123XYZ&signkey=djWPWX3IoSKx0Sev74Zh%2FRSx4Ms%3D&ident=123AZ7890',
			//玩吧SDK充值
			wanBaPaySDK: mainUrl.leShuURL + 'wanba_pay_callback.jsp?',
			//美图SDK充值
			meiTuPaySDK: mainUrl.leShuURL + '91wan_pay_start.jsp?',
			
			
			//注册
			leShuRegister: mainUrl.leShuSDK + 'Register.php',
			//登陆
			leShuLogin: mainUrl.leShuSDK + 'Login.php',
			//找回密码--验证用户是否存在
			leShuPassword: mainUrl.leShuSDK + 'Passwd.php',
			//短信登陆
			leShuLoginMess: mainUrl.leShuSDK + 'LoginMess.php',
			//发验证码
			sendCode: mainUrl.leShuSDK + 'Code.php',
			//验证码验证
			checkMess: mainUrl.leShuSDK + 'CheckMess.php'
			
		},
		status: {
			'1': '有空闲',
			'2': '热抓中',
			'3': '维护中'
		},
		cointype: {
			'1': '充值',
			'2': '消费',
			'3': '下单',
			'4': '取消订单',
			'5': '兑换任务',
			'6': '签到',
			'7': '主线任务',
			'8': '每日任务',
			'9': '系统补偿',
			'10': '邀请好友赠送',
			'11': '输入邀请码赠送',
		},
		taskStatus:{
			'1': '去完成',
			'2': '领取',
			'3': '已完成',
		},
		promoReward:{
			'ERR_PLAYER_000003':'输入的是自己的验证码',
			'ERR_PLAYER_000004':'推广码不存在',
			'ERR_PLAYER_000005':'已输入过推广码',
		},
		picVersion: 1,
	};


	//判断玩吧SDK
	if (window.mqq) {
		config.SDKType = config.SDK.wanBa;
		if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {//苹果
			config.systemSDK = system.SDKTypeLeWanBaIOSH5;
		} else {
			config.systemSDK = system.SDKTypeLeWanBaH5;
		}
	}
	//通过iframe  嵌套的SDK  获取ancestorOrigins值
	//美图SDK
	else if ((location.ancestorOrigins && location.ancestorOrigins.length && location.ancestorOrigins[0] === 'http://h5.91wan.com') ||
	//兼容firefox写法  TODO 暂时使用获取iframe的name来判断>>>如果可以需要获取iframe父级src>>>目测因为跨域导致获取不到
	(window.name.length && window.name === 'game-frame')) {
		config.SDKType = config.SDK.meiTu;
		config.systemSDK = system.SDKTypeLeMeiTuH5;
		
		
		//乐蜀SDK
	}else if((location.ancestorOrigins && location.ancestorOrigins.length && location.ancestorOrigins[0] === 'http://h5.91wan.com') ||
			//todo referrer可以通过这个方法获取到父级链接
		document.referrer && document.referrer.indexOf('h5.leshu.com') !== -1){
		config.SDKType = config.SDK.leShu;
		config.systemSDK = system.SDKTypeLeShuH5;
		debugUrl();
	}
	
	/**
	 *  设置开发模式特殊地址，比如美图测试的时候就单独添加一个参数 debug=lsh5
	 * @author Created by Xiazhou on 2018年1月25日 16:11.
	 */
	function debugUrl () {
		for (var i in config.url) {
			if (config.url.hasOwnProperty(i)) {
				config.url[i] += '&debug=lsh5';
			}
		}
	}
	
	// window.Config = config;
	define(function () {
		return config;
	});
}());
