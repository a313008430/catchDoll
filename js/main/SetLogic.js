/**
 * 设置相关逻辑
 *  @author Created by Xiazhou on 2018年1月11日 20:35.
 */
define([
	'viewsEvent'
], function (_v) {
	'use strict';

    /**
     * 设置列表逻辑
     */
	function setMainLogic() {
		var setBackgroundMusic = $('#setBackgroundMusic'),
			setBackgroundSound = $('#setBackgroundSound');
		if (!setBackgroundMusic.length || !setBackgroundSound.length) return;
		setBackgroundMusic.on('click', function () {
			if (parseInt(Cookies.get('musicStateClose'))) {
				setSoundState(1, 0);
			} else {
				setSoundState(1, 1);
			}
		});
		setBackgroundSound.on('click', function () {
			if (parseInt(Cookies.get('musicStateClose'))) {
				setSoundState(1, 0);
				setSoundState(2, 0);
			} else {
				setSoundState(1, 1);
				setSoundState(2, 1);
			}
		});

		setSoundState(1, parseInt(Cookies.get('musicStateClose')));
		setSoundState(2, parseInt(Cookies.get('musicStateClose')));

		/**
		 *  设置音效状态
		 * @author Created by Xiazhou on 2017年12月19日 14:47.
		 * @param {Number} type 1 背景音乐 2 音效
		 * @param {Number} state  0开启 1关闭
		 */
		function setSoundState(type, state) {

			switch (type) {
				case 1:
					if (state) {
						console.log(1)
						Cookies.set('musicStateClose', 1);
						setBackgroundMusic[0].className = 'switch switch-close';
					} else {
						console.log(2)
						Cookies.set('musicStateClose', 0);
						setBackgroundMusic[0].className = 'switch switch-open';
					}
					break;
				case 2:
					if (state) {
						Cookies.set('soundStateClose', 'false');
						setBackgroundSound[0].className = 'switch switch-close';
					} else {
						console.log(22)
						Cookies.set('soundStateClose', 'true');
						setBackgroundSound[0].className = 'switch switch-open';
					}
					break;
			}
		}

		// 进入用户娃娃币界面
		$('#goWawaGold').off('click').on('click', function () {
			_v.openView('coin')
		})

		//进入抓取记录界面 
		$('#gowawarecord').off('click').on('click', function () {
			_v.openView('record')
		})
		//进入订单管理
		$('#goorder').off('click').on('click', function () {
			_v.openView('order')
		})
		// 返回首页
		$('.back-img').off('click').on('click', function () {
			_v.openView('index')
		})
		// 进入玩家帮助
		$('#playerhelp').off('click').on('click', function () {
			_v.openView('help')
		})
		// 进入投诉建议
		$('#complainBtn').off('click').on('click', function () {
			_v.openView('complain')
		})
		// 进入任务页面
		$('#userTask').off('click').on('click', function () {
			_v.openView('userTask')
		})
		// 进入输入邀请码页面
		$('#invitationCode').off('click').on('click', function () {
			_v.openView('invitationCode')
		})
		// 进入邀请好友页面
		$('#inviteFriends').off('click').on('click', function () {
			_v.openView('inviteFriends')
		})
	}

	return {
		setMainLogic: setMainLogic
	}

});