/**
 *  html模版事件 打开，关闭，等
 * @author Created by Xiazhou on 2018年1月11日 20:35.
 */
define(['configViewBase', 'config'], function (_c_v, _c) {

	var indexView = $('#indexViewContent'),
		//当前已经打开视图
		currentView = null,
		//上一界面逻辑名称记录
		preViewLogic = null;


	/**
	 *  打开html模版===========》一个可以参考的路由管理代码 https://codepen.io/orangexc/pen/LRrxvP
	 * @author Created by Xiazhou on 2018年1月11日 20:40.
	 * @param {String} name 模版名称
	 */
	function openView(name) {
		if (currentView === name) {//防止界面和事件重复执行
			return false;
		}

		clearPreViewEvent(preViewLogic);

		switch (name) {
			case 'index'://打开首页
				require(['index', _c_v.index, 'gameLogic'], function (i, v, _g_logic) {
					setViewAnimation(v);
					i.index();
					// if(!isLogin)
					//  i.setBeginnerHint();//新手引导
					//判读是否登陆
					if (_g_logic && _g_logic.getIsLogin()) {
						i.getPlayerInfo();
					}
					preViewLogic = 'index';
				});
				break;
			case 'grab'://打开房间
				require([_c_v.grab, 'grab', 'gameLogic'], function (v, _e, _g_logic) {
					setViewAnimation(v);
					var game = _e.grab.init();
					game.setReloadGame(_g_logic.gameStart);//设置游戏重新开始接口
					game.setClearSession(_g_logic.setClearCookies);//设置游戏内部清除数据
					game.roomJoin();//进入房间开始游戏

					preViewLogic = 'grab';
				});
				break;
			case 'set'://打开设置
				require([_c_v.set, 'setLogic'], function (v, _s) {
					setViewAnimation(v);
					console.log(_s)
					_s.setMainLogic();

					preViewLogic = 'setLogic';
				});
				break;
			case 'coin'://打开娃娃币
				require([_c_v.coin, 'coin'], function (v, _s) {
					setViewAnimation(v);
					_s.coin();

					preViewLogic = 'coin';
				});
				break;
			case 'record'://打开抓取记录
				require([_c_v.record, 'record'], function (v, _s) {
					setViewAnimation(v);
					_s.record();
				});
				break;
			case 'order'://打开订单管理
				require([_c_v.order, 'order'], function (v, _s) {
					setViewAnimation(v);
					_s.order();

					preViewLogic = 'order';
				});
				break;
			case 'user'://打开我的
				require([_c_v.user, 'user'], function (v, _s) {
					setViewAnimation(v);
					_s.user();

					preViewLogic = 'user';
				});
				break;
			case 'creatorder'://打开下单页面
				require([_c_v.creatorder, 'CreatOrder'], function (v, _s) {
					setViewAnimation(v);
					_s.CreatOrder();

					preViewLogic = 'CreatOrder';
				});
				break;
			case 'confirmPay'://打开确认订单页面
				require([_c_v.confirmPay, 'confirmPay'], function (v, _s) {
					setViewAnimation(v);
					_s.confirmPay();

					preViewLogic = 'confirmPay';
				});
				break;
			case 'address'://打开修改地址页面
				require([_c_v.address, 'address'], function (v, _s) {
					setViewAnimation(v);
					_s.address();

					preViewLogic = 'address';
				});
				break;
			case 'help'://打开帮助页面
				require([_c_v.help, 'help'], function (v, _s) {
					setViewAnimation(v);
					_s.help();

					preViewLogic = 'help';
				});
				break;
			case 'helpanswer'://打开帮助答案页面
				require([_c_v.helpanswer, 'helpanswer'], function (v, _s) {
					setViewAnimation(v);
					_s.helpanswer();

					preViewLogic = 'helpanswer';
				});
				break;
			case 'complain'://打开投诉建议页面
				require([_c_v.complain, 'complain'], function (v, _s) {
					setViewAnimation(v);
					_s.complain();

					preViewLogic = 'complain';
				});
				break;
			case 'userTask'://打开玩家任务页面
				require([_c_v.userTask, 'userTask'], function (v, _s) {
					setViewAnimation(v);
					_s.userTask();

					preViewLogic = 'userTask';
				});
				break;
			case 'invitationCode'://打开输入邀请码页面
				require([_c_v.invitationCode, 'invitationCode'], function (v, _s) {
					setViewAnimation(v);
					_s.invitationCode();

					preViewLogic = 'invitationCode';
				});
				break;
			case 'inviteFriends'://打开输入邀请码页面
				require([_c_v.inviteFriends, 'inviteFriends'], function (v, _s) {
					setViewAnimation(v);
					_s.inviteFriends();

					preViewLogic = 'inviteFriends';
				});
				break;
			case 'notice'://打开公告页面
				require([_c_v.notice, 'notice'], function (v, _s) {
					setViewAnimation(v);
					_s.notice();

					preViewLogic = 'notice';
				});
				break;
			default:
				console.log('lose template');
				break;
		}
		currentView = name;
		console.log(currentView)
		setBottomViewState(currentView);
	}


	/**
	 *  重置主界面一些界面的事件
	 * @author Created by Xiazhou on 2018年1月12日 9:30.
	 */
	function replaceIndexViewEvent() {
		require(['gameLogic'], function (_g_logic) {
			//打开设置界面
			$('#setBtn').off('click').on('click', function () {
				if (_g_logic.isLogin) {
					openView('set');
				} else {
					reLogin();
				}
				return false;
			});

			//打开首页
			$('#backIndexBtn').off('click').on('click', function () {
				if (_g_logic.isLogin) {
					openView('index');
				} else {
					reLogin();
				}
				return false;
			});

			//打开用户背包
			$('#userBackpackBtn').off('click').on('click', function () {
				if (_g_logic.isLogin) {
					openView('user');
				} else {
					reLogin();
				}
				return false;
			});


			/**
			 *  设置数据清空和重新登陆
			 * @author Created by Xiazhou on 2018年1月12日 10:16.
			 */
			function reLogin() {
				_g_logic.setClearCookies();
				_g_logic.gameStart();
			}

		});

	}

	/**
	 *  打开界面过度效果
	 * @author Created by Xiazhou on 2018年1月15日 15:54.
	 * @param {String} html 界面
	 */
	function setViewAnimation(html) {
		indexView.html(html);
		indexView.fadeOut(0, function () {
			indexView.fadeIn(300);
			var contentView = indexView.find('#contentView');
			if (contentView) {
				contentView.css({
					'transform': 'translate3d(1rem, 0, 0)',
					'-webkit-transform': 'translate3d(1rem, 0, 0)'
				});
				contentView.animate({
					'transform': 'translate3d(0, 0, 0)',
					'-webkit-transform': 'translate3d(0, 0, 0)'
				}, 150, function () {
					contentView.css({
						'transform': 'none',
						'-webkit-transform': 'none'
					});
				});
			}
		});
	}

	/**
	 *  设置低部按钮显示隐藏
	 * @author Created by Xiazhou on 2018年1月17日 17:30.
	 */
	var bottomView = $('.bottom-box');
	function setBottomViewState(viewName) {
		if (viewName === 'index') {
			bottomView.fadeIn(150);
		}else{
			if (parseInt(bottomView.css('opacity'))) {
				bottomView.fadeOut(150);
			}
		}

	}

	/**
	 *  关闭界面时，结束上一个界面的一些逻辑
	 * @author Created by Xiazhou on 2018年1月17日 16:57.
	 * @param {String} manage 逻辑层名称
	 */
	function clearPreViewEvent(manage) {
		if (!manage) return false;
		require([manage], function (e) {
			if (e.close) e.close();
		});
	}


	return {
		openView: openView,
		replaceIndexViewEvent: replaceIndexViewEvent
	}
});