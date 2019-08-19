"use strict";
define(['config', 'tool', 'viewsEvent', 'jsmpeg','share'], function (Config, T, _v_e,_share) {
	var Grab;
	
	/**
	 *  抓娃娃主逻辑
	 * @author Created by Xiazhou on 2017年12月9日 13:03.
	 */
	function Grab () {
	
	}
	
	Grab.prototype = {
		_userId: null, //用户id
		_userName: null, //用户名称
		_pwd: null, //用户密码
		_uPic: null, //用户icon
		_sex: null, //用户性别
		_roomId: null, //房间Id
		_session: null,//缓存session
		_webSocket: null, //webSocket控制的
		_webSocketState: null, //socket状态
		_webSocketUrl: null, //socket链接
		_gold: null, //玩家金币
		_price: null, //需要消耗玩家金币
		_time: null, //可操作时间
		_timer: null, //定时器
		_replaceTimes: null, //数据问题重复请求次数
		_videoUrl: null, //视频流地址
		_videoAngle: null, //视频角度
		_video: null, //视频接口对象
		_isCoin: null, //是否已经投币
		_playerManual: null, //玩家房间状态
		_onlinePlayersNode: null, //在线人员节点
		_isReady: null, //是否准备
		_userMsg: null, //用户对象信息
		_reloadGame: null, //游戏重新开始
		_clearSession: null, //清除数据
		_payManage: null, //支付方法对象
		_isCatchIng: null,//是否开始抓
		_roomInfoId: null,//房间信息内id
		_videoTimer: null,//视频定时器
		_roomToyName:null,//娃娃名称
		_roomToyPic:null,//娃娃图片
		_playerPic:null,//用户头像
		//主接口API
		// mainUrl: {
		// 	//乐蜀数据请求入口
		// 	leShuURL: null,
		// 	//娃娃机入口
		// 	zhuaURL: null,
		// },
		//数据接口
		api: function () {
			return Config['url'];
		},
		/**
		 *  初始化入口
		 * @author Created by Xiazhou on 2017年12月9日 13:02.
		 */
		init: function () {
			var self = this;
			self._playerManual = {
				state1: 1, //进房间
				state2: 2, //上机
				state3: 3, //下机
				state4: 4 //退出
			};
			
			self._replaceTimes = 0;
			
			self.isCanPlay = true;//是否可以开始游戏状态  如果视频流关闭就不可玩
			
			
			// self.mainUrl.leShuURL = url;
			// console.log(this.api());
			
			self._userId = Cookies.get('uid');
			
			
			self._session = Cookies.get('_session');
			
			
			return this;
		},
		/**
		 *  设置用户信息
		 * @author Created by Xiazhou on 2017年12月14日 15:47.
		 * @param
		 */
		setUserMsg: function (data) {
			var self = this;
			self._userName = data["userName"];
			self._userId = data['userId'];
			self._pwd = data['pwd'];
			self._uPic = data['uPic'];
			self._sex = (data['sex'] ? data['sex'] : 0);
			
			self._userMsg = data;
		},
		/**
		 *  游戏重新开始
		 * @author Created by Xiazhou on 2017年12月9日 16:59.
		 * @param
		 */
		grabStart: function () {
			
			// var self = this,
			// 	api = self.api();
			//
			// if (self._session) {
			// 	self.roomJoin();
			// 	return;
			// }
			// //注册2 测试注册--获取loginCode
			// T.server({
			// 	url: api.login2 + '&account=' + self._userId + '&pwd=' + self._pwd + '&vistor=0&gametoken=0&os=4&device=xxx&adSource=1&adPos=0'
			// }).then(function (data) {
			// 	var loginCode = data.body.code;
			// 	console.error(loginCode);
			// 	//注册，
			// 	if (loginCode[loginCode.length - 1] == 1) {
			// 		return T.server({url: api.createPlayer + '&logincode=' + loginCode + '&name=' + self._userName + '&pic=' + self._uPic + '&sex=' + self._sex});
			// 		//正式登陆
			// 	} else {
			// 		return T.server({url: api.login + '&logincode=' + loginCode});
			// 	}
			// }).then(function (data) {//获取session
			// 	Cookies.set('_session', data.body.session);
			// 	self._session = data.body.session;
			// 	self.roomJoin();
			// });
		},
		/**
		 *  进入房间
		 * @author Created by Xiazhou on 2017年12月9日 16:46.
		 * @param
		 */
		roomJoin: function () {
			var self = this,
				api = self.api(),
				//获取链接hash上面的房间ID
				roomId = location.hash.match(/(?:roomid\=)(\w+)/);
			
			self.setSession(Cookies.get('_session'));
			
			console.log(self._roomId)
			//获取房间id
			if (!self._roomId || roomId !== self._roomId) {
				// var roomId = location.href.match(/\d+(?<=roomid=\d+)/);// todo 有兼容问题
				// var roomId = location.href.match(/(?:roomid\=)(\w+)/);
				if (roomId) {
					self._roomId = roomId[1];
				} else {
					alert('请正常进入房间！');
					// window.location.href = '/';
					return false;
				}
			}
			
			//如果不存在 _session重新开始游戏
			if (!self._session) {
				self.reloadGame();
				return;
			}
			
			setViewEventBound();
			
			// T.server({url:self.mainUrl.leShuURL + 'toy.do?action=Room.list&session=' + self._session}).then(function (data) {
			// 	console.log(data);
			// })
			
			console.log(self._roomId)
			
			// //获取视频流信息
			// self._videoUrl = ['wss://wwj-video.aiwanba.com:3002/websocket?id=' + self._roomId + '&stream=mpegts'];
			// self.getVideoUrl();
			
			//获取视频流信息和房间一些信息
			self.getRoomInfo(function (data) {
				tabCut();
				console.log(data)
				self._roomToyName = data.body.room.platToy.name;
				self._roomToyPic = data.body.room.platToy.url;
				// if(){
				//
				// }
				// self._webSocketUrl = data.body.room.videoUrl;
				
				
				self.setPlayerManual(self._playerManual.state1);
				
				console.log(self._webSocketUrl)
				
				//获取视频流信息
				self._videoUrl = ['wss://wwj-video.aiwanba.com:3002/websocket?id=' + self._roomId + '&stream=mpegts&platform=H5'];
				// self._videoUrl = [data.body.room.videoUrl + '&stream=mpegts&userid=undefined&platform=H5'];
				self.getVideoUrl();
				
				self.nodeSetFun();
				
				self.getPlayerInfo();
				
				self.getRoomRecords();
				
				self.getChatMessage();
				
				self.setMusic();//播放音乐
				
				T.setMatchViewSize(document.querySelector('#bottomView'));//适配
				
				// self.setSocketContact();
				
				
				//定时更新房间信息
				window.RoomeInfoTime = setInterval(function () {
					self.getRoomInfo();
					self.updateUserMessage();//更新留言
				}, 5000);
				
				
			});
		},
		/**
		 *  重新加载数据
		 * @author Created by Xiazhou on 2017年12月13日 15:06.
		 */
		reloadGame: function () {
			var self = this;
			self.clearSession();
			self._reloadGame(self._userMsg);
		},
		// **
		//  *  删除cookie中的session记录
		//  * @author Created by Xiazhou on 2017年12月12日 16:05.
		//  */
		clearSession: function () {
			// Cookies.remove('_session');
			// this._session = null;
			if (this._clearSession) {
				this._clearSession();
				this._session = null;
			}
		},
		/**
		 *  获取房间抽取记录
		 * @author Created by Xiazhou on 2017年12月11日 19:32.
		 * @param
		 */
		getRoomRecords: function () {
			var self = this,
				api = self.api();
			
			T.server({
				url: api.roomRecords + '&roomId=' + self._roomInfoId + '&session=' + self._session
			})
				.then(function (data) {
					console.log(data)
					self.setRoomRecords(data.body.records);
				});
		},
		/**
		 *  获取房间信息
		 * @author Created by Xiazhou on 2017年12月12日 16:25.
		 */
		getRoomInfo: function (fn) {
			var self = this,
				api = self.api();
			
			T.server({
				url: api.roomInfo + '&roomId=' + self._roomId + '&session=' + self._session
			})
				.then(function (data) {
					if (data.body.errcode) {
						self.clearSession();
						self.reloadGame();
						if (RoomeInfoTime) clearInterval(RoomeInfoTime);
						return;
					}
					$('.toy-detail').find('h4').html(data.body.room.platToy.name);
					if($('.toy-detail-img').attr('src') == ''){
						$('.toy-detail-img').attr('src',data.body.room.platToy.advUrl);
					}
					self._roomInfoId = data.body.room.id;
					self.setCostGold(data.body.room.price);
					self.setCurrentPlayerViewState(data);
					self.setOnlinePlayer(data);
					if (fn) fn(data);
					// console.log(data)
					self.getRoomRecords();//更新房间抓 取列表
				});
		},
		/**
		 *  获取视频流数据
		 * @author Created by Xiazhou on 2017年12月12日 17:45.
		 */
		getVideoUrl: function () {
			var self = this,
				api = self.api();
			
			self.setVideoAngle(self._videoAngle);
			self._replaceTimes = 0;
			
			// T.server({url: api.roomVideoUrl + '&roomId=' + self._roomId + '&session=' + self._session})
			// 	.then(function (data) {
			// 		var obj = JSON.parse(data.body.ret);
			// 		if (obj.status == 'ok') {
			// 			self._videoUrl = obj.url;
			// 			self.setVideoAngle(self._videoAngle);
			// 			self._replaceTimes = 0;
			// 		} else {
			// 			alert('未获取到直播推流，请联系管理员');
			// 		}
			// 	});
		},
		/**
		 *  设置玩家操作状态
		 * @author Created by Xiazhou on 2017年12月12日 20:09.
		 * @param {Number} type 玩家操作状态
		 * @param {Function} fn 回调
		 */
		setPlayerManual: function (type, fn) {
			var self = this,
				api = self.api(),
				isLoading = false;
			if (type === self._playerManual.state4) isLoading = true;//退出房间加载Loading
			T.server({
				url: api.playerManual + '&roomId=' + self._roomId + '&type=' + type + '&session=' + self._session,
				isLoading: isLoading
			}).then(function () {
				if (fn) fn();
				self.getRoomInfo();
			});
		},
		/**
		 *  设置房间记录
		 * @author Created by Xiazhou on 2017年12月11日 19:52.
		 * @param {Array} list 房间抓取记录
		 */
		setRoomRecords: function (list) {
			var html = '';
			for (var x = 0, l = list.length; x < l; x++) {
				html += '<li><img src="' + list[x].playerHeadPic + '"/><span>' +
					list[x].playerName + '</span><time>' + T.setConvertTime(list[x].createTime) + '</time></li>'
			}
			$('#grabList').html(html);
		},
		/**
		 *  设置链接控制socket
		 * @author Created by Xiazhou on 2017年12月11日 14:02.
		 * @param {Function} fn 回调
		 */
		setSocketContact: function (fn) {
			var self = this;
			console.log(self._webSocketUrl)
			self._webSocket = new WebSocket(self._webSocketUrl, "wwj");//wwj 子协议
			//开始抓 --成功上机
			self._webSocket.onopen = function (e) {
				self.socketOpen(e);
				self.getRoomInfo();
				self._isCatchIng = true;
				self.setControlNodeState(1);
				self._time = 30;
				self.setPlayTime();
				
				self.setPlayerManual(self._playerManual.state2);
				
				self.setMyGold(self._price);//更新余额
				
				self.setVibrate();//添加振动效果
			};
			//结束控制 
			self._webSocket.onclose = function (e) {
				
				self.socketClose(e);
				self._isCatchIng = false;
				// self.getRoomInfo();
				self._time = 0;
				self.setControlNodeState(0);
				
				self.getRoomRecords();//更新房间抓取记录
				
				self.setPlayerManual(self._playerManual.state3);
			};
			self._webSocket.onmessage = function (e) {
				self.socketMessage(e, fn);
			};
			self._webSocket.onerror = function (e) {
				self.socketError(e);
			};
		},
		/**
		 *  获取玩家信息
		 * @author Created by Xiazhou on 2017年12月11日 11:25.
		 */
		getPlayerInfo: function () {
			var self = this,
				api = self.api();
			T.server({
				url: api.playerInfo + '&session=' + self._session
			})
				.then(function (data) {
					console.log(data)
					self._gold = parseInt(data.body.player.gold) + parseInt(data.body.player.goldGiving);
					self._playerPic = data.body.player.pic;
					self.setMyGold(0);
					T.loading().close();
				});
		},
		/**
		 *  界面元素事件绑定
		 * @author Created by Xiazhou on 2017年12月11日 14:56.
		 * @param
		 */
		nodeSetFun: function () {
			var self = this,
				//我要玩按钮
				beginBtn = $('#beginBtn'),
				//抓取按钮
				catchBtn = $('#catchBtn'),
				api = self.api();
			
			self._onlinePlayersNode = $('#onlinePlayers');
			
			
			//投币抓
			beginBtn.off('click').on('click', function () {
				self.setCoinsBtnState(2);
				self.getCatchEvent();
				// });
			});
			
			//灰色按钮控制时间--主要和抓一样
			// $('#overBtn').off('click').on('click', function () {
			// 	self.getCatchEvent();
			// })
			
			//抓
			catchBtn.off('click').on('click', function () {
				$('#runTime').fadeOut(300);
				$('#catchAwait').fadeIn(300);
				self.controlAll('catch');
				
				self.setVibrate();//添加振动效果
			});
			
			//娃娃控制
			var node = $('#controlNode');
			node.off('touchstart touchend mousedown mouseup').on('touchstart touchend mousedown mouseup', 'a', function (e) {
				var type = this.getAttribute('type'),
					eType = e.type;
				
				if (eType == 'touchstart' || eType == 'mousedown') {
					self.grabControl(type, 1);
					$(this).find('i').css({
						'-webkit-transform': 'scale(1.3,1.3)',
						'transform': 'scale(1.3,1.3)'
					});
					$(this).addClass('move-bg');
					
					// self.setVibrate();//添加振动效果
				} else {
					self.grabControl(type, 0);
					$(this).find('i').css({
						'-webkit-transform': 'scale(1,1)',
						'transform': 'scale(1,1)'
					});
					$(this).removeClass('move-bg');
				}
				e.preventDefault();
				// return false;
			});
			
			//摄像头
			// $('#shooting-angle').off('click').on('click', function () {
			// 	self.setVideoAngle(!self._videoAngle);
			
			// 	if ($('.direction-arr').css('transform') == 'rotate(90deg)') {
			// 		$('.direction-arr').css({
			// 			'transform': 'rotate(0)',
			// 			'-ms-transform': 'rotate(0)',
			// 			'-moz-transform': 'rotate(0)',
			// 			'-webkit-transform': 'rotate(0)',
			// 			'-o-transform': 'rotate(0)'
			// 		})
			// 	} else {
			// 		$('.direction-arr').css({
			// 			'transform': 'rotate(90deg)',
			// 			'-ms-transform': 'rotate(90deg)',
			// 			'-moz-transform': 'rotate(90deg)',
			// 			'-webkit-transform': 'rotate(90deg)',
			// 			'-o-transform': 'rotate(90deg)'
			// 		})
			// 	}
			// });
			
			//重新排队玩
			$('.play-again').off('click').on('click', function () {
				$(this).parents('.pop-box').css('display', 'none');
				self.controlAll('insert');
			});
			
			//打开充值界面
			$('#recharge').off('click').on('click', function () {
				self.getPayInfo();
			});
			
			//返回房间列表按钮
			$('#goListBtn').off('click').on('click', function () {
				self.setPlayerManual(self._playerManual.state4, function () {//退出房间
					_v_e.openView('index');
					window.history.pushState(null, null, location.origin + '/' + location.search);
				});
			});
			
			//滚动到界面顶部
			// if(document.documentElement.scrollTop !== undefined){
			// 	document.documentElement.scrollTop = 0;
			// }else{
			// 	document.body.scrollTop = 0;
			// }
			$('html,body').scrollTop(0);
		},
		/***
		 * 获取抓控制
		 */
		getCatchEvent: function () {
			var self = this,
				api = self.api();
			
			self._isReady = false;
			if (self._gold < self._price) {
				T.hintView.send('金币不币，请充值！');
				return;
			}
			// self.getRoomInfo(function (data) {
			
			// 	if (data.body.room.curPlayer) return;
			
			// 	console.log(data)
			
			T.server({
				url: api.roomJoin + '&roomId=' + self._roomId + '&session=' + self._session
			})
				.then(function (data) {
					if (!parseInt(data.body.status)) {//判断是否可以抢
						self.setCoinsBtnState(2);
						return;
					}
					self._webSocketUrl = data.body.url;
					self.setSocketContact();
				});
		},
		/**
		 *  娃娃方向控制
		 * @author Created by Xiazhou on 2017年12月11日 13:37.
		 * @param {String} type 方向
		 * @param {Number} press 是否一直按压
		 */
		grabControl: function (type, press) {
			this.controlAll('control', press, type);
		},
		/**
		 *  socket控制方法汇总
		 * @author Created by Xiazhou on 2017年12月12日 10:14.
		 * @param {String} type 操作类型
		 * @param {Number} press 是否一直按压
		 * @param {Any} other 其它属性(针对type相对的附加值)
		 */
		controlAll: function (type, press, other) {
			var self = this;
			switch (type) {
				// case 'insert': //上机
				// 	if (!self._isCoin) { //不可重复上机限制
				// 		self._webSocket.send('{"type":"Insert","extra":"' + self.getCurrentTime() + '"}');
				// 	}
				// 	break;
				case 'catch': //下抓
					// self._webSocket.send('{"type":"Control","data":"b","extra":"' + self.getCurrentTime() + '"}');
					self._webSocket.send('c');
					break;
				case 'control': //方向控制
					switch (other) {
						case 'u':
							// self._webSocket.send('{"type":w"Control","data":"' + (press ? 'u' : 'W') + '","extra":"' + self.getCurrentTime() + '"}');
							self._webSocket.send('w');
							break;
						case 'r':
							// self._webSocket.send('{"type":"Control","data":"' + (press ? 'r' : 'D') + '","extra":"' + self.getCurrentTime() + '"}');
							self._webSocket.send('d');
							break;
						case 'd':
							// self._webSocket.send('{"type":"Control","data":"' + (press ? 'd' : 'S') + '","extra":"' + self.getCurrentTime() + '"}');
							self._webSocket.send('s');
							break;
						case 'l':
							// self._webSocket.send('{"type":"Control","data":"' + (press ? 'l' : 'A') + '","extra":"' + self.getCurrentTime() + '"}');
							self._webSocket.send('a');
							break;
					}
					break;
				default:
					break;
			}
		},
		/**
		 *  获取当前时间戳
		 * @author Created by Xiazhou on 2017年12月12日 10:35.
		 * @return 返回当前时间戳
		 */
		getCurrentTime: function () {
			return (new Date()).getTime();
		},
		/**
		 *  建立webSocket
		 * @author Created by Xiazhou on 2017年12月9日 17:44.
		 */
		socketOpen: function (e) {
			console.log(e);
		},
		/**
		 *  关闭webSocket
		 * @author Created by Xiazhou on 2017年12月9日 17:44.
		 */
		socketClose: function (e) {
			// console.log(e);
			// var self = this;
			// switch (e.code) {
			// 	case 4347:
			// 		if (confirm(e.reason + '请刷新或重新登陆')) {
			// 			self.reloadGame();
			// 		}
			// 		break;
			// 	case 4243: //长时间未操作断开连接socket断开
			// 		if (this._isCoin) {
			// 			self.setSocketContact();
			// 		}
			// 		break;
			// 	case 4343: //房间关闭
			// 		T.hintView.send('房间关闭');
			// 		break;
			// 	case 4344: //设备没有准备好
			// 		T.hintView.send('设备没有准备好');
			// 		break;
			// 	case 4345: //用户等待队列已满
			// 		T.hintView.send('用户等待队列已满');
			// 		break;
			// 	case 4342: //账户余额不足
			// 		T.hintView.send('账户余额不足');
			// 		break;
			// 	case 1006: //负数BUG不明问题
			// 		// if(confirm('开点小岔，请刷新或重新登陆')){
			// 		// 	window.location.href = location.href;
			// 		// }
			// 		if (this._isCoin) {
			// 			// self.setSocketContact();
			// 		}
			// 		console.warn('1006问题，不晓得');
			// 		break;
			// }
			// this._webSocketState = e.type;
		},
		/**
		 *  通信出错
		 * @author Created by Xiazhou on 2017年12月9日 17:44.
		 */
		socketError: function (e) {
			console.warn(e);
		},
		/**
		 *  信息监听
		 * @author Created by Xiazhou on 2017年12月9日 17:44.
		 */
		socketMessage: function (e, fn) {
			// console.log(e);
			// console.log(e.data.split(':'));
			this.setResultViewState(parseInt(e.data.split(':')[1]) ? 2 : 1);
			// this._webSocketState = JSON.parse(e.data).type;
			
			// this.parseSocketState(JSON.parse(e.data), fn);
			
		},
		/**
		 *  解析socket状态
		 * @author Created by Xiazhou on 2017年12月11日 15:18.
		 * @param {Object} obj 状态数据
		 * @param {Function} fn 回调
		 */
		parseSocketState: function (obj, fn) {
			// var self = this;
			// switch (obj.type) {
			// 	case 'Ready':
			// 		if (fn) fn();
			// 		// self._isReady = true;
			// 		break;
			// 	case 'Wait':
			// 		if (obj.data) { //排队人数
			// 			// self.setCurrentPlayerViewState(0);
			// 			// self.setCoinsBtnState(0);
			// 		} else {
			// 			self.setPlayerManual(3); //下机
			// 		}
			// 		self.setCoinsBtnState(1);
			// 		self._isReady = false;
			// 		break;
			// 	case 'Close':
			// 		self.setControlNodeState(0);
			// 		self.setPlayerManual(3); //下机
			// 		break;
			// 	case 'Coin':
			// 		self._isCoin = true;
			// 		if (obj.data < 0) {
			// 			console.error('投币成负数了！');
			// 			// self.setSocketContact();
			// 			// self.reloadGame();
			// 			self.clearSession(); //临时处理
			// 			return;
			// 		}
			// 		self.setMyGold(obj.data);
			// 		self.setCoinsBtnState(1);
			// 		if (obj.data) { //投币成功
			// 			// self.setControlNodeState(1);
			// 		}
			// 		break;
			// 	case 'Time':
			// 		self._time = obj.data;
			// 		self.setPlayTime();
			// 		break;
			// 	case 'Result': //抓取结果
			// 		if (obj.data) {
			// 			self.setResultViewState(2); //成功
			// 			self.getRoomRecords(); //更新记录
			// 		} else {
			// 			self.setResultViewState(1); //失败
			// 		}
			// 		self.setControlNodeState(0);
			// 		self._isCoin = false; //重置投币状态
			// 		self.setPlayerManual(self._playerManual.state3);
			// 		break;
			// 	case 'State':
			// 		switch (obj.data) {
			// 			case 'PLAY':
			// 				self.setPlayerManual(self._playerManual.state2);
			// 				self.setControlNodeState(1);
			// 				T.hintView.send('开抓喽。。。。');
			// 				break;
			// 			case 'DROP':
			// 				break;
			// 			case 'CATCH':
			// 				break;
			// 			case 'RET':
			// 				// self.setControlNodeState(0);
			// 				// self._isCoin = false;//重置投币状态
			// 				break;
			// 		}
			// 		break;
			// }
		},
		/**
		 *  设置控制区和投币域显示和隐藏
		 * @author Created by Xiazhou on 2017年12月11日 15:42.
		 * @param {Number} state  状态 1开始玩
		 */
		setControlNodeState: function (state) {
			var playWrap = $('#playWrap'),
				controlView = playWrap.find('#controlView'),
				coinsView = playWrap.find('#coinsView');
			// state = 1;
			if (state) {
				coinsView.css('display', 'none');
				controlView.css('display', 'block');
			} else {
				coinsView.css('display', 'block');
				controlView.css('display', 'none');
				this._time = 0;
				$('#runTime').fadeOut(300); //时间隐藏
				// this.setCoinsBtnState(0);
			}
		},
		/**
		 *  设置投币按钮状态
		 * @author Created by Xiazhou on 2017年12月11日 19:14.
		 * @param {Number} state  状态 1开始扭
		 */
		setCoinsBtnState: function (state) {
			var coinsView = $('#coinsView'),
				self = this,
				beginBtn = coinsView.find('.begin-btn'),
				overBtn = coinsView.find('.over-btn');
			// console.log(state)
			
			if (!self.isCanPlay) {
				state = 2;
			}
			
			switch (state) {
				case 1:
					beginBtn.show();
					overBtn.hide();
					if (!self._isReady) {
						// T.hintView.send('Ready!');
						self._isReady = true;
					}
					break;
				case 2:
					beginBtn.hide();
					overBtn.show();
					self._isReady = false;
					break;
				default:
					break;
			}
		},
		/**
		 *  设置娃娃金币数
		 * @author Created by Xiazhou on 2017年12月11日 14:45.
		 * @param {Number} num 剩余金币
		 */
		setMyGold: function (num) {
			var self = this;
			self._gold -= num;
			if (self._gold < 0) self._gold = 0;
			$('#myGold').html(self._gold + '币');
			// self.setPlayTime();
		},
		/**
		 *  设置当前需要消耗多少金币
		 * @author Created by Xiazhou on 2017年12月11日 20:42.
		 * @param {Number} gold 金币
		 */
		setCostGold: function (gold) {
			// if (!this._price) {
			this._price = gold;
			$('#costGold').html(gold + '币')
			// }
			
		},
		/**
		 *  更新倒计时--抓 动画
		 * @author Created by Xiazhou on 2017年12月11日 17:02.
		 */
		setPlayTime: function () {
			var self = this,
				runTimeNode = $('#runTime');
			runTimeNode.fadeIn(300).html('' + self._time + '"');
			
			// self._time = 10;
			
			// var leftCircle = $('#leftCircle'),
			// 	rightCircle = $('#rightCircle');
			
			
			//初始化样式
			// rightCircle.css('display', 'none');
			// leftCircle.css({
			// 	'transform': 'rotate(0deg)',
			// 	'background-color': 'rgba(255, 255, 255, .8)'
			// });
			
			setRunTime();
			
			//时间显示逻辑
			function setRunTime () {
				self._time--;
				
				//时间轴动画
				// if (self._time >= 15) {
				// 	rightCircle.css({
				// 		'transform': 'rotateZ(' + (30 - self._time) * 12 + 'deg)',
				// 		'display': 'block'
				// 	});
				// } else {
				// 	leftCircle.css({
				// 		'transform': 'rotateZ(' + ((30 - self._time) * 12 - 180) + 'deg)',
				// 		'background-color': 'rgba(255, 255, ' + self._time * 17 + ', .8)'
				// 	});
				// }
				//更新时间显示
				if (self._time > 10) {
					runTimeNode.html('' + self._time + '"');
					callTime(true);
				} else {
					runTimeNode.animate({
						transform: 'scale(1.5, 1.5)'
					}, 300, 'cubic-bezier(.17,.74,.23,1.53)', function () {
						callTime();
					}).html('' + self._time + '"');
				}
			}
			
			//回调时间更新
			function callTime (set) {
				runTimeNode.animate({
					transform: 'scale(1, 1)'
				}, (set ? 1000 : 700), function () {
					if (self._time > 0) {
						setRunTime()
					} else {
						runTimeNode.fadeOut(300);
					}
				});
			}
			
		},
		/**
		 *  设置抓取结果显示状态
		 * @author Created by Xiazhou on 2017年12月12日 11:16.
		 * @param {Number} type 结果界面类型
		 */
		setResultViewState: function (type) {
			var self = this,
				successView = $('#successView'),
				breakDownView = $('#breakDownView');
			switch (type) {
				case 1: //失败
					breakDownView.css('display', 'block');
					setIdentifyingCodeTime(function () {
						// self.controlAll('insert');
						self.getCatchEvent();//继续抓
					}); //全局方法--设置界面定时隐藏
					break;
				case 2: //成功
					successView.css('display', 'block');
					// setIdentifyingCodeTime(function () {
						// self.controlAll('insert');
						$('.play-again-share').off('click').on('click',function(){
							self.getCatchEvent();//继续抓
							$(this).parents('.pop-box').css('display', 'none');
						})
					// }); //全局方法--设置界面定时隐藏
					
					self.setVibrate();//添加振动效果
					break;
				case 3: //余额不足--失败界面
					break;
				default:
					break;
			}
			
			$('#catchAwait').fadeOut(300);//下抓提示---文本提示隐藏
		},
		/**
		 *  设置视频角度
		 * @author Created by Xiazhou on 2017年12月12日 17:52.
		 * @param {Number} num false正面 true侧面
		 */
		setVideoAngle: function (num) {
			var self = this;
			if (!self._videoUrl || self._videoUrl.length == 0) {
				alert('未获取到直播推流，请联系管理员');
				return false;
			}
			if (num) {
				self.setViewStart(self._videoUrl[1]);
			} else {
				self.setViewStart(self._videoUrl[0]);
			}
			self._videoAngle = num;
		},
		/**
		 *  设置视频显示
		 * @author Created by Xiazhou on 2017年12月12日 17:39.
		 * @param {String} url 视频流地址
		 */
		setViewStart: function (url) {
			var canvas = document.getElementById('mpeg_video_main'),
				self = this;
			if (self._video) {
				self._video.source.socket.onclose = null;
				self._video.destroy();
			}
			// return;
			self._video = new JSMpeg.Player(url, {
				canvas: canvas,
				autoplay: true,
				loop: true,
				audio: true,
				videoBufferSize: 2097152,
				chunkSize: 2097152
			});
			// console.log(self._video)
			// self._video.source.socket.onerror = function (e) {
			// 	console.log(e)
			// }
			
			// self._video.source.socket.onmessage = function (e) {
			// 	console.log(e)
			// }
			
			
			//
			var isHeart = 0;
			if (self._videoTimer) clearInterval(self._videoTimer);
			self._videoTimer = setInterval(function () {
				if (isHeart) return;
				self._video.source.socket.send('0')
			}, 1000);
			
			//成功获取视频
			// self._video.source.socket.onopen = function () {
			// self.isCanPlay = true;
			// }
			var x = 5;
			self._video.source.socket.addEventListener('message', function () {
				x--;
				if (x < 0 && x >= -1) {
					$('#videoLoading').fadeOut(300);
				}
			});
			
			
			self._video.source.socket.onclose = function () {
				// if (self._replaceTimes >= 2) return;
				// // console.warn('视频结束了....自动更新视频流');
				// console.log(self._replaceTimes)
				// // self.getVideoUrl();
				// self._replaceTimes++;
				// isHeart++;
				if (self._video.isPlaying) {
					T.hintView.send('<p style="color:red">视频丢了，刷新或进入其它房间</p>');
					
				}
				self.isCanPlay = false;
			}
		},
		/**
		 *  设置当前在线玩家状态
		 * @author Created by Xiazhou on 2017年12月12日 20:27.
		 * @param {Object} data 房间状态数据
		 */
		setCurrentPlayerViewState: function (data) {
			var currentPlayerView = $('#currentPlayerView'),
				self = this;
			// console.log(self._isReady)
			if (data.body && data.body.room.curPlayer) {//有人
				// currentPlayerView.show();
				//是否已经显示
				if (currentPlayerView.css('opacity') === '1') return;
				currentPlayerView.css({
					'transform': 'translate3d(-100%, 0, 0)',
					'opacity': '0'
				}).animate({
					'transform': 'translate3d(0, 0, 0)',
					'-webkit-transform': 'translate3d(0, 0, 0)',
					'opacity': '1'
				}, 300);
				currentPlayerView.html('<span>' + data.body.room.curPlayer.name + '</span>' + '<img src="' + data.body.room.curPlayer.pic + '"/>');
				if (!this._isCoin) self.setCoinsBtnState(2);
			} else {//没人
				// currentPlayerView.hide();
				currentPlayerView.animate({
					'transform': 'translate3d(-100%, 0, 0)',
					'-webkit-transform': 'translate3d(-100%, 0, 0)',
					'opacity': '0'
				}, 300);
				if (!this._isCoin) self.setCoinsBtnState(1);
			}
		},
		/**
		 *  设置当前房间有多少人在线
		 * @author Created by Xiazhou on 2017年12月13日 10:57.
		 * @param {Object} data 房间信息数据
		 */
		setOnlinePlayer: function (data) {
			
			var self = this,
				players = data.body.room.players,
				html = '';
			if (!players) players = [];
			for (var x = 0, l = 3; x < l; x++) {
				if (!players[x]) continue;
				html += '<img src="' + players[x].pic + '"/>';
				// html += '<img src="' + '//tx.hddzz.leshu.com/ww/head/head.png' + '"/>';
			}
			$('#onlinePlayers').html('<span>' + data.body.room.playerCount + '人围观</span>' + html);
		},
		/**
		 *  获取当前session
		 * @author Created by Xiazhou on 2017年12月14日 15:41.
		 * @return 获取当前session
		 */
		getSession: function () {
			return this._session;
		},
		/**
		 *  设置缓存session
		 * @author Created by Xiazhou on 2017年12月14日 16:10.
		 */
		setSession: function (session) {
			this._session = session;
		},
		/**
		 *  获取当前用户id
		 * @author Created by Xiazhou on 2017年12月14日 15:41.
		 * @return 获取当前用户id
		 */
		getUserId: function () {
			return this._userId;
		},
		/**
		 *  设置重新开始游戏接口_clearSession
		 * @author Created by Xiazhou on 2017年12月14日 16:20.
		 * @param {Function} login 外部方法
		 */
		setReloadGame: function (login) {
			this._reloadGame = login;
		},
		/**
		 *  清除缓存数据
		 * @author Created by Xiazhou on 2017年12月14日 16:20.
		 * @param {Function} clear 外部清除方法
		 */
		setClearSession: function (clear) {
			this._clearSession = clear;
		},
		/**
		 *  设置音乐
		 * @author Created by Xiazhou on 2017年12月15日 20:15.
		 */
		setMusic: function () {
			var audio = $('#backgroundMusic')[0];
			if (parseInt(Cookies.get('musicStateClose'))) {
				audio.pause();
			} else {
				audio.play();
				audio.currentTime = 0;
				document.addEventListener("WeixinJSBridgeReady", function () {
					audio.play();
				}, false);
				document.addEventListener('YixinJSBridgeReady', function () {
					audio.play();
				}, false);
			}
		},
		/**
		 *  获取聊天数据
		 * @author Created by Xiazhou on 2017年12月18日 16:01.
		 */
		getChatMessage: function () {
			var self = this,
				api = self.api();
			T.server({
				url: api.getChatMessage + '&roomId=' + self._roomId + '&session=' + self._session
			}).then(function (data) {
				self.setChatManage(data.body.messages);
			});
		},
		/**
		 *  更新用户留言列表
		 * @author Created by Xiazhou on 2018年1月20日 17:13.
		 */
		updateUserMessage: function () {
			var self = this,
				api = self.api(),
				chatView = $('#chatView'),
				list = null;
			T.server({
				url: api.getChatMessage + '&roomId=' + self._roomId + '&session=' + self._session
			}).then(function (data) {
				list = data.body.messages;
				//获取留言内容
				if (list && list.length) {
					var listHtml = '',
						l = list.length;
					var addNum = 0;
					
					if (l > 8) {
						addNum = (l - 8); //从最近的几条开始展示出来
						l = 8;
					}
					
					for (var x = 0; x < l; x++) {
						if (!list[x + addNum]) continue;
						listHtml += '<li><span>' + list[x + addNum].sender + '：' + list[x + addNum].content + '</span></li>'
					}
					chatView.find('ul').html(listHtml);
				}
			});
		},
		/**
		 *  聊天逻辑
		 * @author Created by Xiazhou on 2017年12月18日 11:41.
		 * @param {Array} list 留言列表
		 */
		setChatManage: function (list) {
			var chatView = $('#chatView'),
				chatInput = $('#chatInput'),
				self = this,
				fadeToViewTime = null, //界面 隐藏时间
				api = self.api();
			
			
			// // list.sort();
			// console.log(list)
			
			//获取留言内容
			if (list && list.length) {
				var listHtml = '',
					l = list.length;
				var addNum = 0;
				
				if (l > 8) {
					addNum = (l - 8); //从最近的几条开始展示出来
					l = 8;
				}
				
				for (var x = 0; x < l; x++) {
					if (!list[x + addNum]) continue;
					listHtml += '<li><span>' + list[x + addNum].sender + '：' + list[x + addNum].content + '</span></li>'
				}
				chatView.find('ul').html(listHtml);
			}
			
			chatView.css({
				'-webkit-transform': 'translateY(0)',
				'transform': 'translateY(0)',
				'opacity': 1
			}); //初始化进入界面聊天界面动画
			
			setFadeToView();
			
			function setFadeToView () {
				chatView.css({
					'opacity': '1'
				});
				if (fadeToViewTime) clearTimeout(fadeToViewTime);
				fadeToViewTime = setTimeout(function () {
					chatView.css({
						'opacity': '0.6'
					});
				}, 5000);
				
			}
			
			//防止输入框点击时候隐藏
			chatInput.off('click').on('click', function (e) {
				// alert(1)
				this.focus();
				return false;
			});
			
			var chatInputView = $('#chatInputView');
			
			//聊天控制
			var isCanAdd = 0; //防止添加过快
			var oldLi = null,
				maxLen = 8;
			// $('#sendChat').on('touchend',function (e) {
			// 	e.stopPropagation();
			// 	e.preventDefault();
			// 	return false;
			// });
			var sendChat = $('#sendChat');//聊天发送按钮
			// 发送按钮根据input内输入改变样式
			chatInput.on('input propertychange',function(){
				console.log(!$(this).val().length)
				if(!$(this).val().length){
					sendChat.removeClass('readysend');
				}else{
					sendChat.addClass('readysend');
				}
			})
			//发送信息
			sendChat.off('click').on('click', function (e) {
				e.stopPropagation();
				sendText ();
				chatInput.focus();
			});
			// 快捷聊天文字点击添加至输入框
			$('.quickChat').off('click').on('click','li',function(){
				chatInput.val($(this).html());
				sendChat.addClass('readysend');
				chatInput.focus();
				return false;
			})
			//发送文本
			function sendText () {
				var val = (chatInput.val()).toString();
				if (isCanAdd || !val.length) return;
				var li = chatView.find('li');
				
				
				//发送留言
				T.server({
					url: api.sendChatMessage + '&roomId=' + self._roomId + '&session=' + self._session + '&content=' + val
				}).then(function (data) {
					if (oldLi) {
						li.eq(maxLen - 1).find('span').html(data.body.msg.sender + '：' + data.body.msg.content);
						li.eq(maxLen - 1).css({
							'display': 'block',
							'opacity': '0',
							'transform': 'translate3d(0, 20px, 0)',
							'-webkit-transform': 'translateY(20, 20px, 0)',
						}).animate({
							'transform': 'translate3d(0, 0, 0)',
							'-webkit-transform': 'translate3d(0, 0, 0)',
							opacity: 1
						}, 300, function () {
							isCanAdd = 0;
							chatInput.val('');
						});
					} else {
						chatView.find('ul').append('<li id="newText" style="transform:translateY(100%);opacity: 0;"><span>' + data.body.msg.sender + '：' +
							data.body.msg.content + '</span></li>');
						$('#newText').animate({
							'transform': 'translate3d(0, 0, 0)',
							'-webkit-transform': 'translate3d(0, 0, 0)',
							opacity: 1
						}, 300, function () {
							// this.removeAttribute('id');
							this.id = '';
							isCanAdd = 0;
							chatInput.val('');
						});
					}
					
					// chatInputView.fadeOut(300);
					// setClose(); //闭关
					setFadeToView();
					
					isCanAdd++;
					//最大可加入多少条
					if (li.length >= maxLen) {
						li.eq(0).animate({
							transform: 'translateX(-100%)',
							opacity: 0
						}, 300, function () {
							$(this).css({
								'transform': 'translateY(100%)',
								'opacity': 0,
								'display': 'none'
							});
							chatView.find('ul').append($(this));
							oldLi = this;
						});
					}
				});
			}
			
			
			//打开聊天界面
			$('#chatStateBtn').off('click').on('click', function () {
				$(window).scrollTop(0);
				$('body,html').scrollTop(0);
			});
			$('#chatStateBtn').off('click').on('click', function () {
				// $(window).scrollTop(0);
				$('body,html').css({
					'overflow': 'hidden',
					'height': '100%'
				});
				chatInputView.fadeIn(300, function () {
				});
				// setInterval(function () {
				// 	chatInput.triggerHandler('click');
				// chatInput.triggerHandler('focus');
				// chatInput.trigger('click');//主动触发input点击事件，获取焦点
				chatInput.focus();
				// chatInput.trigger('focus');
				// }, 1000)
				chatInput.val('');
				sendChat.removeClass('readysend');
			});
			
			
			//关闭
			chatInputView.off('click').on('click', setClose);
			
			function setClose () {
				chatInputView.fadeOut(300);
				$('body,html').css({
					'overflow': 'scroll'
				});
			}
			
			//回车事件
			chatInput.off('keyup').on('keyup', function (e) {
				var self = $(this),
					val = self.val();
				//设置最长文本
				if (val.length > 15) {
					self.val(val.match(/.{0,15}/));
				}
				if (e.which === 13) {
					sendText();
					chatInput.blur();
				}
				
			});
			//阻止冒泡
			// chatInput.on('blur',function (e) {
			// 	e.stopPropagation();
			// 	e.preventDefault();
			// 	// chatInputView.fadeOut(300);
			// 	return false;
			// });
			
		},
		/**
		 *  振动效果 (玩吧)
		 * @author Created by Xiazhou on 2018年1月22日 9:58.
		 */
		setVibrate: function () {
			//如果是玩吧SDK
			if (Config.SDKType === Config.SDK.wanBa) {
				mqq.sensor.vibrate();
			}
		},
		
		/**
		 *  充值接口调用
		 * @author Created by Xiazhou on 2017年12月19日 16:40.
		 */
		getPayInfo: function () {
			var self = this;
			if (!self._payManage) {
				self._payManage = T.payView();
				//充值成功回调
				T.paySuccessCall = function (d) {
					if (parseInt(d.ret)) {//充值失败
						T.hintView.send('<div style="color: red">充值失败</div>');
					} else {
					
					}
					
					//更新金币
					self.getPlayerInfo();
				}
			}
			self._payManage.open();
			
		}
	};
	
	var _grab = new Grab(),
		//界面定时器
		timeCode = null;
	
	/**
	 *  关闭界面的时候执行--类似析构
	 * @author Created by Xiazhou on 2018年1月17日 16:06.
	 */
	function close () {
		//清除更新房间信息定时器
		if (window.RoomeInfoTime) clearInterval(window.RoomeInfoTime);
		//清除界面关闭定时器》》结果界面
		if (timeCode) clearInterval(timeCode);
		//主动关闭视频流
		_grab._video.destroy();
		//重置货币
		_grab._price = null;
		//主动关闭socket
		if (_grab._webSocket) _grab._webSocket.close();
		//关闭视频发定时发送信息定时器
		clearInterval(_grab._videoTimer);
		//暂停音乐
		$('#backgroundMusic')[0].pause();
	}
	
	/**
	 *  界面一些事件绑定
	 * @author Created by Xiazhou on 2018年1月17日 17:40.
	 */
	function setViewEventBound () {
		//延迟关闭
		var identifyingCodeTime = 0,
			identifyingCode = $('.pop-delay-close');
		
		// identifyingCodeTime = 5;
		// if( identifyingCode.parents('.pop-box').css('display')=='none' ){
		//     timeCode = null;
		// }else{
		//     setIdentifyingCodeTime();
		// }
		window.setIdentifyingCodeTime = setIdentifyingCodeTime;
		
		function setIdentifyingCodeTime (fn) {
			if (timeCode) clearInterval(timeCode);
			identifyingCodeTime = 5;
			identifyingCode.text('再来一局(' + identifyingCodeTime + 's)');
			if (identifyingCodeTime) {
				timeCode = setInterval(function () {
					identifyingCodeTime--;
					identifyingCode.text('再来一局(' + identifyingCodeTime + 's)');
					if (identifyingCodeTime <= 0) {
						clearInterval(timeCode);
						identifyingCodeTime = 0;
						timeCode = null;
						identifyingCode.parents('.pop-box').css('display', 'none');
						if (fn) fn();
					}
				}, 1000);
			}
		}
		
		//弹窗关闭---夏州修改，删除pop-close（暂时不管）
		$('.pop-close, .play-again, .share_close').on('click', function () {
			$(this).parents('.pop-box').css('display', 'none');
			if (timeCode) clearInterval(timeCode);
		});
		$('.pop-share').off('click').on('click', function () {
			invite();
		})
	}
			// 房间物品详情----周利锋 	
			function tabCut() {
				$('.grab-list').find('h3').on('click', 'span', function () {
					var spanIndex = $(this).index();
					$(this).addClass('stateon').siblings().removeClass('stateon');
					$(this).parents('.grab-list').find('.point-more').eq(spanIndex).show().siblings().hide();
				})
			}
			function invite() {
				var shareUrl  = 'http://imgws.leshu.com/game/17/share/share-1.html?' + 'doll_name=' +self._roomToyName + '&doll_img=' +self._roomToyPic  + '&code=' +  + '&user_img=' +self._playerPic ;
				_share.share(shareUrl);
			}
	
	
	return {
		grab: _grab,
		close: close
	}
});