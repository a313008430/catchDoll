"use strict";
define(['tool', 'config', 'gameLogic', 'swiper', 'viewsEvent'], function (T, Config, gameLogic, swiper, _v_e) {
	//房间列表
	var roomList = null,
		//记录滚动位置
		scrollTop = 0;
	/**
	 *  首页数据
	 */
	function Index() {
		
		var session = Cookies.get('_session');

		// if (T) {
		// 	T.loading().open();
		// }


		Slide();
		Roomlist(session);

		//打开登陆
		$('#openLogin').off('click').on('click', function () {
			if (location.host == 'wawa.leshu.com') {
				gameLogic.setClearCookies();
				gameLogic.gameStart();
			}
		});
		// $('.nav-bottom a').off('click').on('click', function () {
		// 	if (location.host == 'wawa.leshu.com') {
		// 		gameLogic.setClearCookies();
		// 		gameLogic.gameStart();
		// 	}
		// 	return false;
		// });

		setRandomGoInRoom();
		if (window.taskType == 1) {
			window.taskType = 0;
			RandomGo()
		}
		if (Config.SDKType != Config.SDK.wanBa) {
			$('.share-btn-index,.desktop-icon').remove()
		}
	}
	T.server({ url: Config.url.configInfo + '&session=' + Cookies.get('_session') })
		.then(function (data) {
			// console.log(data)
			window.promoBonusValue = data.body.promoBonusValue;
			if (data.body.picVersion == Config.picVersion) {
				Config.picVersion = Config.picVersion + 1;
			}
		})

	function Slide(s) {
		T.server({ url: Config.url.slideIndex })
			.then(function (data) {
				var itemsData = data.body.items;
				console.log(itemsData);
				var itemslist = '';
				var popItems = [];
				var lurl = 'javascript:void(0);';
				for (var x = 0, l = itemsData.length; x < l; x++) {
					console.log(itemsData[x]['showType'])
					if (itemsData[x]['showType'] == 1) {//0是banner 1 是浮窗
						// popItems[x] = itemsData[x];
						$('.notice_box_content').html('<a data-type="'+itemsData[x]['type'] +'"><img id="adpic" src="'+itemsData[x]['picUrl']+'"/></a><a class="pop-close" onclick="$(this).parent().parent().hide();" href="javascript:void(0)"></a>');
						$('#notice_box').find('img').off('click').on('click',function(){
							_v_e.openView('notice')	
						})
						continue;
					}
					//itemsData[x]['type']; //1 weburl  2支付  3指定房间   data
					switch (itemsData[x]['type']) {
						case 1:
							lurl = itemsData[x]['data'];
							break;
						case 2:
							lurl = 'javascript:void(0);';
							break;
						case 3:
							lurl = '/grab/?roomid=' + itemsData[x]['data'];
							break;
						default:
							break;
					}
					lurl
					if (itemsData[x]['showType'] == 0) {
						console.log(111)
						itemslist += '<div class="swiper-slide"><a data-type="' + itemsData[x]['type'] + '" href=' + lurl + '><img id="banner_img" src="' + itemsData[x]['picUrl'] + '?v=' + Config.picVersion + '" alt=""></a></div>';
					// }else if(itemsData[x]['showType'] == 1){
						console.log(111111111)
					}
				}
				// console.log(itemslist);
				var item = popItems[Math.floor(Math.random() * popItems.length)];
				// $('.pop-ad').html('<a href="/grab/?roomid='+item['data']+'"><img id="adpic" src="'+item['picUrl']+'" onload="loadImage()" /></a><a class="pop-close" onclick="$(this).parent().parent().hide();" href="javascript:void(0)"></a>');
				$('#slidelist').html(itemslist);
				// for (var n = 0; n < $('.swiper-slide').length; n++) {
				// 	if ($('.swiper-slide').eq(n).find('a').attr('data-type') == 2) {
				// 		$('.swiper-slide').eq(n).find('div').off('click').on('click', function () {
				// 			_v_e.openView('notice')
				// 		})
				// 	}
				// }
				// for()
				// slide_on();
				swiper_on();
			});
	}

	var roomListHtml = '';//缓存html数据
	function Roomlist(s) {

		if (roomListHtml.length) {//取缓存
			setRoomList(s);
			return false;
		}


		T.server({ url: Config.url.roomIndex + '&session=' + s, isLoading: true })
			.then(function (data) {
				// console.log(data)
				var roomData = data.body.rooms;
				roomList = roomData;
				for (var x = 0, l = roomData.length; x < l; x++) {
					roomListHtml += '<li><a href="#roomid=' + roomData[x]['platRoomId'] + '" data-roomId="' + roomData[x]['platRoomId'] + '"><img src="' + roomData[x]['platToy']['url'] + '?v=' + Config.picVersion + '" alt=""><h3>' + roomData[x]['platToy']['name'] + '</h3>';
					roomListHtml += '<span room-id="' + roomData[x]['platRoomId'] + '" class="state '
						+ (roomData[x]['status'] === 'Ready' ? '' : 'using') + '"><em>' + Config.status[roomData[x]['status']]
						+ '</em></span><p class="flex_1"><span class="pirce flex_1"><i></i><em>' + roomData[x]['price'] + '</em>币/次</span><i class="room-num">' + 1 + '台</i></p></a></li>';
				}
				setRoomList(s);
			});
	}

	/**
	 *  添加房间列表
	 * @author Created by Xiazhou on 2018年1月19日 16:41.
	 * @param {String} s session
	 */
	function setRoomList(s) {
		$('#roomlist').html(roomListHtml);
		setRoomListState($('#roomlist').find('.state'), s);

		// 绑定房间列表点击事件--->跳转
		setRoomListHref();

		$('html,body').scrollTop(scrollTop);

	}

	/**
	 *  设置房间列表状态
	 * @author Created by Xiazhou on 2017年12月19日 16:06.
	 * @param {Array} list 状态标签列表
	 * @param   {String} s session
	 */
	//定时器
	var reTimer = null;

	function setRoomListState(list) {
		if (!list) list = [];
		var node;
		if (reTimer) clearInterval(reTimer);
		reTimer = setInterval(function () {
			updateRoomListState();
		}, 10000);
		/**
		 *  更新房间列表状态
		 * @author Created by Xiazhou on 2018年1月4日 9:20.
		 */
		updateRoomListState();

		function updateRoomListState(s) {
			T.server({ url: Config.url.roomIndex + '&session=' + Cookies.get('_session') })
				.then(function (data) {
					var roomList = data.body.rooms;
					if (!roomList) return;
					for (var x = 0, l = roomList.length; x < l; x++) {
						node = getNodeByRoomId(roomList[x]['platRoomId']);
						if (node) {
							if (roomList[x]['status'] === '1') {
								node.className = 'state';
							} else if (roomList[x]['status'] === '2') {
								node.className = 'state using';
							} else {
								node.className = 'state warning';
							}
							node.querySelector('em').innerText = Config.status[roomList[x]['status']];
						}
					}
				});
		}

		/**
		 *  根据房间id获取节点
		 * @author Created by Xiazhou on 2017年12月19日 16:13.
		 * @param {Nummber} id 房间id
		 * @return 节点
		 */
		var x = 0, l = list.length;

		function getNodeByRoomId(id) {
			for (x = 0; x < l; x++) {
				if (list[x].getAttribute('room-id') == id) {
					return list[x];
				}
			}
			return null;
		}

	}


	/**
	 *  获取用户信息
	 * @author Created by Xiazhou on 2018年1月4日 16:57.
	 * @param
	 */
	var reTimes = 0;
	function getPlayerInfo() {
		T.server({
			url: Config.url.playerInfo + '&session=' + Cookies.get('_session'),
			isLoading: true
		})
			.then(function (data) {
				if (!data.body.errcode) {
					$('#openLogin').hide();
					$('#mineinfo').show();
					if ($('#userIcon').attr('src') == '') {
						$('#userIcon')[0].src = data.body.player.pic;
					}
					$('#userName').html(data.body.player.name);
					$('#userGold').html(parseInt(data.body.player.gold) + parseInt(data.body.player.goldGiving));//更新金币
					// $('#userGoldGiving').text(data.body.player.goldGiving);
					// 判断当日是否已经签到
					var lastSignTime = parseInt(data.body.player.lastSignTime);
					var timestamp = Date.parse(new Date());
					if (data.body.player.lastSignTime == 0 || getTimes(timestamp) != getTimes(lastSignTime)) {
						signInbox();
					}
					$('#signCycle').html(data.body.player.signCycle);
					var shareUrl_index = 'http://imgws.leshu.com/game/17/share/share-3.html?' + 'doll_name=' + '&doll_img=' + '&code=' + data.body.player.promoCode + '&user_img=' + data.body.player.pic;
					window.shareUrl_index = shareUrl_index;
					// if()
					// $('.nav-bottom a').off('click');
					// $('.nav-bottom a').off('click').on('click', function () {
					// 	if (Config['SDKType'] === Config['SDK']['wanBa']) {//玩吧进入游戏
					// 		console.log(this.getAttribute('href'))
					// 		mqq.invoke("ui", "openUrl", {
					// 			url: 'https://1106635092.urlshare.cn' + this.getAttribute('href') + '/?_proxy=1&_wv=2147628839',
					// 			// url: this.href,
					// 			target: 1,
					// 			style: 0
					// 		});
					// 		mqq.ui.setWebViewBehavior({actionButton: 0})
					// 		return false;
					// 	}
					// });
					setIndexRecharge();//绑定充值按钮
					gameLogic.isLogin = true;
					reTimes = 0;
					$('html, body').css('overflow-y', 'auto');//测试用，兼容一些Iframe不执行的问题 TODO
				} else {
					gameLogic.setClearCookies();
					
					$('#recharge').off('click');
					gameLogic.isLogin = false;
					if(reTimes<2){//如果获取用户信息失败这里重新登陆
						gameLogic.gameStart({userId:Cookies.get('uid')}, function () {
							getPlayerInfo();
							// Index();
						});
						reTimes++;
					}
				}
				// else{
				// 	gameLogic.setClearCookies();
				// 	gameLogic.gameStart();
				// }
				console.log(data)
				// T.loading().close();
			});
	}

	//貌似是加载广告图片
	// function loadImage() {
	// 	var popAdH = $('#adpic').height() + 40;
	// 	$('.pop-ad').css('margin-top', -popAdH / 2);
	// }


	// 轮播
	function swiper_on() {
		new swiper('.swiper-container', {
			autoplay: true,
			slidesPerView: 1,
			observer: true,
			observeParents: true,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			loop: true,
		});
	}

	/**
	 *  首页充值
	 * @author Created by Xiazhou on 2018年1月10日 13:29.
	 */
	function setIndexRecharge() {
		var recharge = $('#recharge'),
			payView = T.payView();
		recharge.off('click').on('click', function () {
			//充值成功回调
			T.paySuccessCall = function (d) {
				if (parseInt(d.ret)) {//充值失败
					T.hintView.send('<div style="color: red">充值失败</div>');
				} else {

				}

				//更新金币
				T.server({
					url: Config.url.playerInfo + '&session=' + Cookies.get('_session')
				}).then(function (data) {
					console.log(data)
					$('#userGold').text(parseInt(data.body.player.gold) + parseInt(data.body.player.goldGiving));
				});
			};
			payView.open();
		});
	}

	/**
	 *  新手引导
	 * @author Created by Xiazhou on 2018年1月15日 14:24.
	 * @param
	 */
	function setBeginnerHint() {
		if ($('#beginnerHintView').length) return;
		var html = document.createElement('div');
		html.className = 'beginner-hint-view';
		html.id = 'beginnerHintView';
		html.innerHTML = ' <div class="swiper-container2">\n' +
			'    <div class="swiper-wrapper">\n' +
			'      <div class="swiper-slide"><img src="/public/img/step1.jpg" alt=""></div>\n' +
			'      <div class="swiper-slide"><img src="/public/img/step2.jpg" alt=""></div>\n' +
			'      <div class="swiper-slide"><img src="/public/img/step3.jpg" alt=""></div>\n' +
			'      <div class="swiper-slide"><img src="/public/img/step4.jpg" alt=""></div>\n' +
			'    </div>\n' +
			'  </div><div class="swiper-pagination2"></div>';

		$('html,body').css('overflow', 'hidden');
		if (!$('#beginnerHintView').length) {
			$('#indexViewContent')[0].appendChild(html);
		}

		var mySwiper = new swiper('.swiper-container2', {
			loop: false,
			slidesPerView: 1,
			pagination: {
				el: '.swiper-pagination2'
			},
			on: {
				reachEnd: function () {
					$('#beginnerHintView').off('click').on('click', function () {
						$(this).fadeOut(300, function () {
							mySwiper.destroy(true);
							$('html,body').css('overflow', 'scroll');
						});

					});
				},
			}
		})
	}

	/**
	 *  绑定房间列表点击事件--->跳转
	 * @author Created by Xiazhou on 2018年1月17日 15:43.
	 */
	function setRoomListHref() {
		$('#roomlist').off('click', 'a').on('click', 'a', function () {
			if (gameLogic.getIsLogin()) {
				console.log(location.href + this.getAttribute('href'));
				console.log(this.getAttribute('href'));

				scrollTop = $(window).scrollTop();//缓存当前滚动位置

				window.history.pushState(null, null, location.href + this.getAttribute('href'));
				_v_e.openView('grab');

			} else {
				T.hintView.send('请先登陆！');
			}
			return false;
		});
	}

	/**
	 *  关闭界面的时候执行--类似析构
	 * @author Created by Xiazhou on 2018年1月17日 16:06.
	 */
	function close() {
		if (reTimer) clearInterval(reTimer);
	}


	function getTimes(time) {
		var data = new Date(time), //实例一个时间对象；
			y = data.getFullYear(),//获取系统的年；
			mon = data.getMonth() + 1,//获取系统月份，由于月份是从0开始计算，所以要加1
			d = data.getDate(),// 获取系统日，
			h = data.getHours(),//获取系统时，
			min = data.getMinutes(),//分
			s = data.getSeconds();//秒
		// return y + '/' + (mon < 10 ? '0' + mon : mon) + '/' + (d < 10 ? '0' + d : d) + '  ' + (h < 10 ? '0' + h : h) + ':' + (min < 10 ? '0' + min : min) + ':' + (s < 10 ? '0' + s : s);
		return y + (mon < 10 ? '0' + mon : mon) + (d < 10 ? '0' + d : d)
	}

	// 登录签到
	function signInbox() {
		$('.signin-close').off('click').on('click', function () {
			$('.signin-box').fadeOut(300);
			$('.signok').hide();
			$('.bottom-box').fadeIn(150);
			$('body,html').css('overflow', 'scroll');
			$('#notice_box').fadeIn(150);
		});
		T.server({
			url: Config.url.dicInfo + '&session=' + Cookies.get('_session')
		})
			.then(function (data) {
				var allList = data.body.signRewardList;
				allList.sort(sortId);

				var signList = '';
				var signDay = $('#signCycle').html();
				var signNum = signDay % 7,
					siginBox = $('#signin_box'),
					li = null,
					n = 0;
				// console.log(signNum);
				if (!data.body.errcode) {
					if (signDay < 7) {
						for (var x = 0; x < 7; x++) {
							signList += '<li><div><i></i><p>+<em>' + allList[x]['goldReward'] + '</em>币</p><span></span></div><p>第' + (x + 1) + '天</p></li>';
						}
						siginBox.html(signList);
						li = siginBox.find('li');
						for (n = 0; n < signNum; n++) {
							li.eq(n).addClass('signinday');
						}
						signbtn();
					} else {
						for (var y = 7; y < 14; y++) {
							signList += '<li><div><i></i><p>+<em>' + allList[y]['goldReward'] + '</em>币</p><span></span></div><p>第' + (y - 6) + '天</p></li>';
						}
						siginBox.html(signList);
						li = siginBox.find('li');
						for (n = 0; n < signNum; n++) {
							li.eq(n).addClass('signinday');
						}
						signbtn();
					}
				}
				$('.signin-box').fadeIn(300);
				$('.bottom-box').fadeOut(150);
				$('body,html').css('overflow', 'hidden');

			})


	}

	function sortId(a, b) {
		return a.id - b.id
	}

	function signbtn() {
		$('.goldtoday').html($('#signin_box li').not(".signinday").eq(0).find('em').html());
		$('.signin-btn').off('click').on('click', function () {
			T.server({
				url: Config.url.sign + '&session=' + Cookies.get('_session')
			})
				.then(function (data) {
					if (!data.body.errcode) {
						if (data.body.result == true) {
							$('#signin_box li').not(".signinday").eq(0).addClass('signinday');
							$('.signin-btn').off('click').html('已签到').css('background-color', '#c9edb3');
							T.hintView.send('签到成功！明天继续哦！');
							setTimeout(function () {
								$('.signin-box').fadeOut(300);
								$('.bottom-box').fadeIn(150);
								$('body,html').css('overflow', 'scroll');
								$('#notice_box').fadeIn(150);
								getPlayerInfo();
							}, 1000);
						}
					} else {
						$('.signin-box').fadeOut(300);
						$('.bottom-box').fadeIn(150);
						$('body,html').css('overflow', 'scroll');
						$('#notice_box').fadeIn(150);
					}
				})
		})
	}

	/**
	 *  随机进入房间
	 * @author Created by Xiazhou on 2018年1月19日 15:02.
	 */
	function setRandomGoInRoom() {
		$('#backIndexBtn').off('click').on('click', function () {
			if (!roomList || !roomList.length || !gameLogic.getIsLogin()) return false;
			window.history.pushState(null, null, location.href + '#roomid=' + roomList[Math.floor(Math.random() * roomList.length)].platRoomId);
			_v_e.openView('grab');
			return false;
		});
	}
	function RandomGo() {
		window.history.pushState(null, null, location.href + '#roomid=' + roomList[Math.floor(Math.random() * roomList.length)].platRoomId);
		_v_e.openView('grab');
	}

	//返回内部控件
	return {
		index: Index,
		getPlayerInfo: getPlayerInfo,
		setBeginnerHint: setBeginnerHint,
		close: close
	};
});
