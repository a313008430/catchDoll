/**
 * 需要使用的工具
 * Created by Xiazhou on 2017年12月14日.
 */
define(['config'], function (Config) {
	'use strict';
	
	function Tool () {
	
	}
	
	var T;
	/**
	 *  内容适配尺寸====>>游戏界面
	 * @author Created by Xiazhou on 2018年1月3日 9:58.
	 * @param
	 */
	var bottomView = null,//#bottomView
		//视频容器对象
		shootBox = null;
	
	function matchViewSize (v) {
		var doc = document.documentElement,
			w = doc.clientWidth,
			num = (w > 750 ? 750 : w) / 750;
		
		doc.style.fontSize = (num * 100).toFixed(1) + 'px';//适配游戏整体单位大小
		
		//计算游戏界面 控制区域位置
		if (v) bottomView = v;
		if (bottomView) {
			if (num * 1000 >= Math.floor((doc.clientHeight - (num * 334)))) {
				bottomView.style.webkitTransform = 'translateY(' + Math.floor((doc.clientHeight - (num * 334))) + 'px)';
				bottomView.style.transform = 'translateY(' + Math.floor((doc.clientHeight - (num * 334))) + 'px)';
				
				//视频位置一直可以看到底设置
				shootBox = $('#shootBox');
				if(!shootBox.length) return false;
				shootBox.css({
					'transform':'translateY(' + (Math.floor((doc.clientHeight - (num * 334))) - shootBox.height()) + 'px)',
					'-webkit-transform':'translateY(' + (Math.floor((doc.clientHeight - (num * 334))) - shootBox.height()) + 'px)'
				})
			} else {
				bottomView.style.transform = 'translateY(10.1rem)';
				bottomView.style.webkitTransform = 'translateY(10.1rem)';
			}
		}
		
	}
	
	matchViewSize();
	Tool.prototype.setMatchViewSize = matchViewSize;
	window.addEventListener('resize', function () {
		matchViewSize()
	});
	
	/**
	 *  loading
	 * @author Created by Xiazhou on 2018年1月19日 15:56.
	 * @param {Number} state 1打开 0关闭
	 */
	function setLoading (state) {
		if (state) {
			this.loading().open();
		} else {
			this.loading().close();
		}
	}
	
	/**
	 *  ajax监听方法--promise  引用zepto库
	 * @author Created by Xiazhou on 2017年12月11日 10:13.
	 * @param {Object} data 数据
	 */
	Tool.prototype.server = function (data) {
		function test () {
			// 数据测试查看
			var d = '';
			for (var i in data.data) {
				d += '&' + i + '=' + data.data[i];
			}
			console.warn(data.url + '?' + d)
		}
		
		return $.Deferred(function () {
			var self = this;
			$.ajax({
				url: data.url,
				data: data.data ? data.data : '',
				dataType: data.dataType ? data.dataType : 'json',
				type: data.type ? data.type : 'GET',
				//发送请求时触发
				beforeSend: function () {
					if (data.isLoading) setLoading.call(Tool.prototype, 1);//是否加载load
				},
				//请求成功
				success: function (data) {
					//|| Config.SDKType == Config.SDK.meiTu
					if (Cookies.get('wanBaOpenId') === '7B8853357A94EA74921D528B699D8997' || Cookies.get('uid') === 'ceaa4b9c209a89ffbdce91e860e08c62') {
						test();
					}
					
					// console.log(data);
					//错误信息
					if (data.body && data.body.errcode) {
						test();
						console.error(data);
						
						// if (confirm('用户信息过期，请重新登陆')) {
						// 	setClearCookies();
						// 	window.location.href = window.location.href;
						// }else{
						// 	window.location.href = '/';
						// }
						// return;
					}
					self.resolve(data);
				},
				error: function (err) {
					console.error(err);
				},
				//请求完成执行，不管成功还是失败
				complete: function () {
					if (data.isLoading) setLoading.call(Tool.prototype, 0);
				}
			});
		});
	};
	
	/**
	 *  时间转换
	 * @author Created by Xiazhou on 2017年12月11日 19:58.
	 * @param {Number} oldTime 开始时间
	 * @return {String} xx秒/分钟/小时 前
	 */
	Tool.prototype.setConvertTime = function (oldTime) {
		var hasS = Math.floor(((new Date).getTime() - oldTime) / 1000);
		var s = 0,
			m = 0,
			h = 0,
			d = 0;
		d = Math.floor(hasS / 60 / 60 / 24);//时
		if (d) hasS -= d * 60 * 60 * 24;
		h = Math.floor(hasS / 60 / 60);//时
		if (h) hasS -= h * 60 * 60;
		m = Math.floor(hasS / 60);//分
		if (m) hasS -= m * 60;
		s = hasS;//秒
		if (d) return h + '天前';
		if (h) return h + '小时前';
		if (m) return m + '分钟前';
		if (s) return s + '秒前';
	};
	
	/**
	 *  仅提示小弹窗
	 * @author Created by Xiazhou on 2017年12月13日 17:00.
	 */
	Tool.prototype.hintView = {
		view: null,//背景视图
		timer: null,//定时器
		create: function () {
			var self = this;
			self.view = document.getElementById('hintView');
			if (!self.view) {
				var view = document.createElement('div');
				view.id = 'hintView';
				view.className = 'hint-view';
				document.body.appendChild(view);
				self.view = view;
			}
		},
		/**
		 *  发送文本
		 * @author Created by Xiazhou on 2017年12月13日 17:20.
		 * @param {String} text 文本内容
		 */
		send: function (text) {
			var self = this;
			if (!self.view) self.create();
			self.view.innerHTML = text;
			self.view.className = 'hint-view move';
			self.view.className = 'hint-view move moveInit';
			// console.log($('#hintView'))
			// $('#hintView').animate({
			// 	'translateY': '-260px',
			// 	'opacity': '1'
			// }, 700, 'cubic-bezier(.17,.74,.23,1.53)', function () {
			// 	var self = $(this);
			// 	if (self.timer) {
			// 		clearTimeout(self.timer)
			// 	}
			// 	self.timer = setTimeout(function () {
			// 		// self.animate({'bottom':'0', 'opacity':'0'}, 700);
			// 		self.animate({'translateY': '0', 'opacity': '0'}, 700);
			// 	}, 2000)
			// });
			
			if (self.timer) {
				clearTimeout(self.timer)
			}
			self.timer = setTimeout(function () {
				self.view.className = 'hint-view fadeInit';
				self.view.className = 'hint-view fadeOut fadeInit';
			}, 3000)
		}
	};
	
	/**
	 *  登陆窗口插件--测试用
	 * @author Created by Xiazhou on 2017年12月14日 11:42.
	 */
	Tool.prototype.loginView = {
		view: null,//背景视图
		timer: null,//定时器
		_fn: null,//回调
		create: function () {
			var self = this;
			self.view = document.getElementById('loginView');
			if (!self.view) {
				//创建容器
				var view = document.createElement('div');
				view.id = 'loginView';
				view.className = 'login-view';
				document.body.appendChild(view);
				//窗口
				var con = '<div class="login-con-outer-view"><a id="closeLogin" href="javascript:void(0);" class="goListBtn"></a><i class="top-icon"></i>'
					+ '<div class="login-bottom-view">'
					//登陆
					+ '<div id="loginInView" class="login-in-view login-in"><div><input id="userTel" class="login-input" type="number" placeholder="请输入手机号"></div><div><input id="loginInBtn" class="submit-btn" type="button" value="登陆/注册"></div></div>'
					//输入密码
					+ '<div id="inputPwd" class="login-in-view input-pwd">'
					+ '<div><input id="password2" class="login-input"  type="password" placeholder="请输入密码"></div>'
					+ '<div><input id="loginBtn" class="submit-btn" type="button" value="登陆"></div><div><a id="forgetPwd" href="#">忘记密码</a></div></div>'
					//获取验证码
					+ '<div id="register" class="login-in-view register"><div class="posR"><input id="codeVal" class="login-input"  type="number" placeholder="输请入验证码"><i id="verificationBtn" class="get-verification">获取验证码</i></div>'
					+ '<div><input id="passwordVal" class="login-input"  type="password" placeholder="请输入密码"></div>'
					+ '<div><input id="registerBtn" class="submit-btn" type="button" value="登陆/注册"></div></div>'
					+ '</div><div class="login-reputation"><a href="#" class="">登录即表示同意用户协议与隐私条款</a></div></div>';
				view.innerHTML = con;
				self.view = view;
			}
			
			
			//关闭
			$('#closeLogin').off('click').on('click', function () {
				if (TYPE === 'grab') {
					window.location.href = '/';
					return false;
				}
				self.close();
			});
			//确定
			var uId = $('#userTel'),
				pwd = $('#password'),
				//正确的用户Id
				_uId = null,
				//协议key
				_key = '8LU5atF8h7LwiiYQ',
				//是否是找回密码
				isPassword = 0;
			// $('#sendTrue').off('click').on('click', function () {
			// 	if (!uId.val().length || !pwd.val().length) {
			// 		alert('名称或密码不能为空!');
			// 		return;
			// 	}
			// 	if (self._fn) self._fn(uId.val(), pwd.val());
			//
			// 	Cookies.set('_pwd', pwd.val());//缓存密码
			// 	self.close();
			// });
			
			//忘记密码--找回密码
			$('#forgetPwd').off('click').on('click', function () {
				isPassword = 1;
				$('#inputPwd').animate({transform: 'translateX(-1rem)', opacity: '0'}, 300);
				$('#inputPwd').fadeOut(300);
				$('#register').css({
					'transform': 'translateX(1rem)',
					'display': 'block',
					'opacity': '0'
				}).animate({transform: 'translateX(0rem)', opacity: '1'}, 300)
			});
			
			//登陆
			$('#loginInBtn').on('click', function () {
				// alert(1);
				var pattern = /(13\d|14[579]|15[^4\D]|17[^49\D]|18\d)\d{8}/g,
					str = uId.val();
				if (!pattern.test(str)) {//手机号验证
					hint.call(Tool.prototype, '请输入正确的手机号！');
					return;
				}
				isPassword = 0;
				_uId = str;
				
				var time = getTimes(),
					pwd = '12345689',
					key = _key,
					user = str,
					data = {
						user: user,
						sec_code: 1,
						passwd: md5(pwd),
						times: time,
						token: md5(key + time + md5(user + 1 + md5(pwd))),
					};
				
				console.log(data, key, time, user, pwd)
				T.loading().open();
				server.call(Tool.prototype, {url: Config.url.leShuPassword, data: data, type: 'POST'}, function (data) {
					console.log(data)
					if (data.code && data.extra.codeid === 200107) {//用户名不已经存在--打开注册接口
						$('#loginInView').fadeOut(300);
						$('#register').css({
							'transform': 'translateX(1rem)',
							'display': 'block',
							'opacity': '0'
						}).animate({transform: 'translateX(0rem)', opacity: '1'}, 300)
					} else {//已经存在走--输入账号密码
						$('#loginInView').fadeOut(300);
						$('#inputPwd').css({
							'transform': 'translateX(1rem)',
							'display': 'block',
							'opacity': '0'
						}).animate({transform: 'translateX(0rem)', opacity: '1'}, 300);
					}
					T.loading().close();
				});
			});
			
			
			// =================================================================>
			//获取验证码
			var verificationBtn = $('#verificationBtn'),
				codeTime = 60,
				codeTimer = null;
			verificationBtn.off('click').on('click', getCode);
			
			//获取验证码
			function getCode () {
				var time = getTimes();
				verificationBtn.off('click');
				server.call(Tool.prototype, {
					url: Config.url.sendCode,
					data: {
						user: _uId,
						times: time,
						cate: isPassword ? 2 : 1,//找回密码或是登陆注册
						type: 1,
						token: md5(_key + time + md5(_uId + (isPassword ? 2 : 1)))
					},
					type: 'POST'
				}, function (data) {
					if (!data.code) {
						hint.call(Tool.prototype, '验证码已发送!');
						setCodeTime();
					} else {
						verificationBtn.off('click').on('click', getCode);
						hint.call(Tool.prototype, '发送失败!');
					}
					
				});
			}
			
			//等待验证码倒计时
			function setCodeTime () {
				if (codeTimer) {
					clearInterval(codeTimer);
				}
				codeTimer = setInterval(function () {
					codeTime--;
					verificationBtn.html(codeTime + 's');
					if (codeTime <= 0) {
						clearInterval(codeTimer);
						codeTime = 60;
						verificationBtn.off('click').on('click', getCode);
						verificationBtn.html('获取验证码');
					}
				}, 1000)
			}
			
			/**
			 *  通过验证码和密码登陆
			 * @author Created by Xiazhou on 2018年1月4日 14:49.
			 * @param
			 */
			var codeVal = $('#codeVal'),
				passwordVal = $('#passwordVal');
			$('#registerBtn').off('click').on('click', function () {
				var _codeVal = codeVal.val(),
					_passwordVal = passwordVal.val(),
					time = getTimes();
				if (!_codeVal.length) {
					hint.call(Tool.prototype, '验证码不能为空!');
					return false;
				}
				if (!_passwordVal.length) {
					hint.call(Tool.prototype, '密码不能为空!');
					return false;
				}
				T.loading().open();
				//验证验证码
				server.call(Tool.prototype, {
					url: Config.url.checkMess,
					data: {
						user: _uId,
						times: time,
						sec_code: _codeVal,
						cate: isPassword ? 2 : 1,//找回密码或是登陆注册
						type: 1,
						token: md5(_key + _codeVal + time + md5(_uId + (isPassword ? 2 : 1) + '10015'))
					},
					type: 'POST'
				}, function (data) {
					if (data.code) {
						hint.call(Tool.prototype, data.msg);
					} else {
						if (isPassword) {
							findPassword(_passwordVal, _codeVal);
						} else {
							setRegister(_passwordVal);//注册-登陆
						}
						
					}
				});
			});
			
			/**
			 *  注册
			 * @author Created by Xiazhou on 2018年1月4日 15:17.
			 * @param {String} pwd 密码
			 */
			function setRegister (pwd) {
				var time = getTimes();
				server.call(Tool.prototype, {
					url: Config.url.leShuRegister,
					data: {
						user: _uId,
						passwd: md5(pwd),
						times: time,
						token: md5(_key + time + md5(_uId + md5(pwd))),
						subgame: 4,
						fromchannel: 23,
					},
					type: "POST"
				}, function (data) {
					if (!data.code) {//注册成功
						setLogIn(pwd);
					}
				});
			}
			
			/**
			 * 乐蜀登陆
			 * @author Created by Xiazhou on 2018年1月4日 15:24.
			 * @param {String} pwd 密码
			 */
			function setLogIn (pwd) {
				var time = getTimes();
				server.call(Tool.prototype, {
					url: Config.url.leShuLogin,
					data: {
						user: _uId,
						passwd: md5(pwd),
						times: time,
						token: md5(_key + time + md5(_uId + md5(pwd))),
						subgame: 4,
						fromchannel: 23,
					},
					type: "POST"
				}, function (data) {
					if (!data.code) {//登陆成功
						self._fn(md5(data.extra.uname + data.extra.ident));
					} else {
						hint.call(Tool.prototype, data.msg);
						T.loading().close();
					}
				});
			}
			
			/**
			 *  找回密码
			 * @author Created by Xiazhou on 2018年1月4日 19:09.
			 * @param {String} pwd 密码
			 * @param {String} code 验证码
			 */
			function findPassword (pwd, code) {
				var time = getTimes();
				server.call(Tool.prototype, {
					url: Config.url.leShuPassword,
					data: {
						user: _uId,
						sec_code: code,
						passwd: md5(pwd),
						times: time,
						token: md5(_key + time + md5(_uId + code + md5(pwd))),
					},
					type: "POST"
				}, function (data) {
					console.log(data)
					if (!data.code) {//登陆成功
						hint.call(Tool.prototype, '新密码设置成功!')
						setLogIn(pwd);
					} else {
						hint.call(Tool.prototype, data.msg);
						T.loading().close();
					}
				});
			}
			
			//正常登陆  ====================================================================>
			var password2 = $('#password2');
			$('#loginBtn').off('click').on('click', function () {
				var pwd = password2.val();
				if (!pwd.length) {
					hint.call(Tool.prototype, '密码不能为空!');
					return false;
				}
				T.loading().open();
				setLogIn(pwd)
			});
			
			/**
			 *  信息提示
			 * @author Created by Xiazhou on 2018年1月4日 11:46.
			 * @param {String} msg
			 */
			function hint (msg) {
				this.hintView.send(msg);
			}
			
			// $('#loginInView').animate({transform:'translateX(-1rem)',opacity:'0'}, 300);
			
			// $('#inputPwd').fadeIn(300);
			
			
			/**
			 *  协议
			 * @author Created by Xiazhou on 2018年1月4日 10:04.
			 * @param {Number} type 1 注册 2找回密码 3发送验证码 4验证验证码
			 * @param {Object} data 传入数据
			 * @param {Function} fn 回调
			 */
			function server (data, fn) {
				var self = this;
				data['data']['fromgame'] = 10015;
				console.log(data);
				self.server(data).then(function (data) {
					// console.log(data)
					if (fn) fn(data);
				});
			}
		},
		/**
		 *  打开登陆窗口
		 * @author Created by Xiazhou on 2017年12月14日 13:16.
		 * @param {Funtion} fn 回调 (写入用户信息)
		 */
		open: function (fn) {
			var self = this;
			if (!self.view) self.create();
			
			$('html,body').css('overflow', 'hidden');
			// self.view.style.display = 'block';
			$('#loginView').show(150);
			$('#loginInView').show();
			$('#register').hide();
			$('#inputPwd').hide();
			// $('.login-con-view').fadeIn(300);
			if (fn) self._fn = fn;
			// console.log(Cookies.get('uid'), Cookies.get('_pwd'))
			//兼容处理--直接重新登陆
			// if (Cookies.get('uid') && Cookies.get('_pwd')) {
			// 	self._fn(Cookies.get('uid'), Cookies.get('pwd'));
			// 	// self.close();
			// } else {
			// 	var uid = 'test' + Math.floor(Math.random() * 1000),
			// 		pwd = Math.floor(Math.random() * 1000);
			// 	self._fn(uid, pwd);
			// 	Cookies.set(uid);
			// 	Cookies.set(pwd);
			// 	// self.close();
			// }
			
		},
		/**
		 *  关闭窗口
		 * @author Created by Xiazhou on 2017年12月14日 13:42.
		 */
		close: function () {
			var self = this;
			$('#loginView').fadeOut(150);
			$('html,body').css('overflow', 'inherit');
			$('.login-input').val('');
			// $('.login-con-view').fadeOut(150, function () {
			// 	self.view.style.display = 'none';
			// });
		}
	};
	
	/**
	 *  充值视图和逻辑
	 * @author Created by Xiazhou on 2017年12月20日 10:28.
	 */
	Tool.prototype._payView = null;
	//选择订单档位回调
	Tool.prototype.chooseOrderCall = null;
	//充值成功回调
	Tool.prototype.paySuccessCall = null;
	//缓存订单id
	Tool.prototype.payOrderId = null;
	//是否已经首充
	Tool.prototype.isFirstPay = null;
	//首充对象
	Tool.prototype.firstObj = null;
	Tool.prototype.payView = function () {
		var self = this,
			view = self._payView,//视图缓存
			//充值列表
			payList = null,
			returnObj = {},
			//订单id
			orderId = null,
			//支付信息回调视图
			payMsgCallView = null;
		
		//如果没有视图创建
		if (!view) {
			createView();
			view = self._payView;
		}
		
		//打开视图
		function open () {
			if (payList) {
				view.fadeIn(300);
				if (!self.isFirstPay) {//是否已经首充过
					isFirstPay();
				}
				
			} else {
				server.call(Tool.prototype, 1, null, isFirstPay);//调用Tool内部方法
			}
			
		}
		
		//判断是否首充主要...
		function isFirstPay () {
			server.call(Tool.prototype, 4, self.firstObj.id, function (d) {
				console.log(d)
				if (parseInt(d.body.times) >= self.firstObj.limitTimes) {
					self._payView.addClass('none-first');
					self.isFirstPay = true;
				}
				
			});//调用Tool内部方法
		}
		
		//关闭视图
		function close () {
			view.fadeOut(300);
			$('#payMsgCallView').fadeOut(300);
		}
		
		//获取服务器数据
		// 1、获取支付列表  2、发起预定单  3、乐蜀回调测试  4、获取某一档位充值次数
		//obj 额外数据
		// fn 回调
		function server (type, obj, fn) {
			var me = this;
			switch (type) {
				case 1:
					this.server({url: Config.url.getPayInfo + '&session=' + Cookies.get('_session') + '&platId=' + Config.systemSDK}).then(function (data) {
						if(!data.body.items){me.hintView.send('<div style="color: red">订单列表获取失败</div>');return false;}
						payList = data.body.items.sort(function (a, b) {
							return parseInt(a.listOrder) - parseInt(b.listOrder);
						});
						setPayList(payList);
						if (fn) fn();
					});
					break;
				case 2:
					console.log(Config.url.leShuPaySDK)
					this.server({url: Config.url.leShuPaySDK + '&accountId=' + Cookies.get('playerId') + '&itemId=' + obj + '&account=' + Cookies.get('uid')}).then(function (data) {
						if (fn) fn(data);
					});
					break;
				case 3:
					if (!orderId) {
						alert('订单ID不对，请重试');
						return;
					}
					this.server({url: Config.url.leShuSDKCallBack + '&orderId=' + orderId + '&ordertime=' + (new Date()).getTime()}).then(function (data) {
						if (fn) fn(data);
					});
					break;
				case 4:
					this.server({url: Config.url.getBuyTimes + '&session=' + Cookies.get('_session') + '&id=' + obj}).then(function (d) {
						if (fn) fn(d);
					});
					break;
			}
			
		}
		
		
		/**
		 *  打开充值界面--添加充值数据
		 * @author Created by Xiazhou on 2017年12月19日 16:44.
		 * @param{Array} list 充值列表
		 */
		function setPayList (list) {
			var html = '',
				gold = 0,
				//首充对象
				firstObj = null;
			console.log(list)
			for (var x = 0, l = list.length; x < l; x++) {
				if (list[x].limitTimes >= 1) {
					$('.first-pay').find('span').text(list[x].memo);
					$('.first-pay').find('a').text('￥' + parseInt(list[x].currency) * parseFloat(list[x].rate));
					firstObj = list[x];
					self.firstObj = list[x];
					continue;
				}
				html += '<li class="tFlex tFlexAlign">'
					+ '<div class="info tFlexGrow">'
					+ '<p><em>' + list[x].gold + '币</em> <sup>' + (parseInt(list[x].bonusGold) ? '送' + parseInt(list[x].bonusGold) + '币' : '') + '</sup></p>'
					// + '<p><em>' + list[x].gold + '</em></p>'
					// +'<p>首充10元返100个币</p>'
					+ '</div>'
					+ '<a class="pay-btn" pay-name="' + list[x].name + '" cost-gold="' + parseInt(list[x].currency) + '" pay-price=" ' + parseInt(list[x].currency) * parseFloat(list[x].rate)
					+ ' " pay-id="' + list[x].id + '">￥' + parseInt(list[x].currency) * parseFloat(list[x].rate) + '</a>'
					+ '</li>';
			}
			//选择充值--创建订单
			view.find('ul').html(html).on('click', 'a', function () {
				// if (returnObj['callBack']) {
				// 	returnObj['callBack'](this.getAttribute('pay-id'));
				// }
				var payPrice = this.getAttribute('pay-price');
				// self.payOrderId = orderId;
				var payId = this.getAttribute('pay-id');
				var costGold = this.getAttribute('cost-gold');
				var payName = this.getAttribute('pay-name');
				// server.call(Tool.prototype, 2, payId, function (data) {
				// 	console.log(data)
				// 	orderId = data.orderID;
				$('#payMsgCallView').fadeIn(300);
				//选中档位回调
				if (self.chooseOrderCall) {
					self.chooseOrderCall({
						// orderId:data.orderID,
						gold: costGold,//所需金币
						price: payPrice,
						payId: payId,
						name:payName
					});
				}
			});//调用Tool内部方法
			// });
			
			// 首充事件
			$('#firstPayBtn').on('click', function () {
				$('#payMsgCallView').fadeIn(300);
				if (self.chooseOrderCall) {
					self.chooseOrderCall({
						gold: firstObj.gold,//所需金币
						price: firstObj.currency,
						payId: firstObj.id,
						name:firstObj.name
					});
				}
			});
			view.fadeIn(300);
			console.log(self.firstObj)
		}
		
		//创建视图
		function createView () {
			
			//创建父级视图
			var v = document.createElement('div');
			v.id = 'payList';
			v.className = 'pop-box';
			v.style.display = 'none';
			
			v.innerHTML = '<div class="pop-pay">'
				+ '<h3>充值</h3>'
				+ '<div class="scroll-box">'
				+ '<div id="firstPayBtn" class="first-pay"><img src="/public/img/first_pay_header@2x.png" alt="">'
				+ '<span></span>'
				+ '<a href="javascript:void(0);"></a></div>'
				+ '<ul></ul>'
				+ '</div>'
				+ '<div class="btn-box"><a id="popClose" class="pop-close" href="javascript:;">取消</a></div>'
				+ '<div id="payMsgCallView" class="pop-box pay-msg-call-view"><div class="pay-msg-call-con">'
				+ '<h2>支付提示</h2>'
				+ '<p>您的支付订单已创建，请在新打开页面完成支付操作</p>'
				+ '<button id="orderFinishBtn" class="order-finish-btn">支付完成，返回订单列表</button>'
				+ '</div></div></div>';
			
			document.body.appendChild(v);
			
			self._payView = $('#payList');
			
			payMsgCallView = $('#payMsgCallView');
			
			//关闭充值层
			$('#popClose').off('click').on('click', function () {
				view.fadeOut(300);
			});
			
			//验证支付-*--乐蜀验证
			$('#orderFinishBtn').off('click').on('click', function () {
				$('#payMsgCallView').fadeOut(300);
				// 	server.call(Tool.prototype, 3, null, function (data) {
				// 		// if (parseInt(data.code)) {//失败
				// 		// 	setHint.call(Tool.prototype, '<div style="color: red">充值失败</div>');
				// 		// } else {//支付成功>>回调
				// 			if (self.paySuccessCall) {
				// 				self.paySuccessCall(data);
				// 			}
				// 		// }
				// 		console.log(data);
				// 	});//调用Tool内部方法
				// 	view.fadeOut(300);
				// 	$('#payMsgCallView').fadeOut(300);
			});
		}
		
		/**
		 *  调用父级弹窗提示
		 * @author Created by Xiazhou on 2017年12月21日 13:41.
		 * @param
		 */
		function setHint (msg) {
			this.hintView.send(msg);
		}
		
		// console.log(this)
		returnObj = {
			open: open,
			close: close
		};
		return returnObj;
	};
	
	/**
	 *  loading......
	 * @author Created by Xiazhou on 2018年1月4日 13:39.
	 * @param
	 */
	Tool.prototype.loadingView = null;
	Tool.prototype.loading = function () {
		var self = this,
			view = self.loadingView;
		if (!view) createView();
		
		/**
		 *  打开loading界面
		 * @author Created by Xiazhou on 2018年1月4日 13:49.
		 */
		function open () {
			view.fadeIn(300);
		}
		
		/**
		 *  关闭loading界面
		 * @author Created by Xiazhou on 2018年1月4日 13:49.
		 */
		function close () {
			view.fadeOut(300);
		}
		
		/**
		 *  创建loading
		 * @author Created by Xiazhou on 2018年1月4日 13:44.
		 */
		function createView () {
			if ($('#loadingView').length) {
				self.loadingView = $('#loadingView');
				view = self.loadingView;
				return;
			}
			var v = document.createElement('div');
			v.id = 'loadingView';
			v.className = 'loading-view';
			v.innerHTML = '<div>努力奔跑...<i>i</i><i>n</i><i>g</i><i>..</i></div>';
			document.body.appendChild(v);
			
			self.loadingView = $('#loadingView');
			view = self.loadingView;
		}
		
		return {
			open: open,
			close: close
		}
	};
	
	/**
	 *  获取客户端版本--是否是苹果
	 * @author Created by Xiazhou on 2018年1月10日 15:23.
	 */
	Tool.prototype.isiOS = function () {
		return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	};
	
	/**
	 *  获取时间 20160818085520 (格式为:年月日时分秒)
	 * @author Created by Xiazhou on 2018年1月4日 10:31.
	 * @return 返回时间
	 */
	function getTimes () {
		var data = new Date(), //实例一个时间对象；
			y = data.getFullYear(),//获取系统的年；
			mon = data.getMonth() + 1,//获取系统月份，由于月份是从0开始计算，所以要加1
			d = data.getDate(),// 获取系统日，
			h = data.getHours(),//获取系统时，
			min = data.getMinutes(),//分
			s = data.getSeconds();//秒
		
		return y + '' + (mon < 10 ? '0' + mon : mon) + '' + (d < 10 ? '0' + d : d) + '' + (h < 10 ? '0' + h : h) + '' + (min < 10 ? '0' + min : min) + '' + (s < 10 ? '0' + s : s);
	}
	
	// Tool.prototype.payView.open.call(Tool.prototype.server);
	
	// window.Tool = Tool;
	T = new Tool();
	return T;
});
