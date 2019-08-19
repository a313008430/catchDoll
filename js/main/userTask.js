define(['tool', 'config', 'gameLogic', 'viewsEvent','share'], function (T, Config, gameLogic, _v,_share) {
	'use strict';
	/**
	 * 玩家任务
	 * @author zhoulifeng  1-29 14:17
	 */

	 var userPic =null;//玩家图片
	//  获取主线任务
	function getMainTask() {
		T.server({ url: Config.url.getMainTask + '&session=' + Cookies.get('_session') })
			.then(function (data) {
				console.log(data)
				var mainTask = data.body.tasks;
				if (!data.body.errcode) {
					var statusName = 'task_' + mainTask.status;
					var mainTaskList = '';
					mainTaskList += '<li data-targetId="' + mainTask.targetId + '"><i><img src="' + mainTask.picUrl + '"></i>';
					mainTaskList += '<div><h2>' + mainTask.title + '<span>(' + mainTask.achieveAmount + '/' + mainTask.targetAmount + ')</span></h2><p><i><img src="/public/img/silver-gold.png" alt=""></i><span>代币·' + mainTask.goldReward + '</span></p></div>';
					mainTaskList += '<a data-id="' + mainTask.taskId + '" class="task_link  ' + statusName + '" href="javascript:void(0);">' + Config.taskStatus[mainTask['status']] + '</a></li>';
				}
				$('#main_task').html(mainTaskList);

				if (mainTask.status == 1) {//任务未完成时可点击跳转
					$('#main_task').find('.task_link').off('click').on('click', function () {
						taskLink(mainTask.targetId)
					})
				} else if (mainTask.status == 2) {
					$('#main_task').find('.task_link').off('click').on('click', function () {
						getMainReward($(this).attr('data-id'))
					})
				}
			})
	}
	// 任务跳转路径
	function taskLink(type) {
		console.log(type)
		if (type == 10005) {
			_v.openView('user')
		} else if (type == 10004) {
			console.log(996)
			invite();
		} else if (type == 10001 || 10002 || 10003) {
			window.taskType = 1;
			_v.openView('index')
		}
	}

	// 获取主线任务奖励
	function getMainReward(num) {
		T.server({ url: Config.url.getMainReward + '&session=' + Cookies.get('_session') + '&taskId=' + num })
			.then(function (data) {
				if (data.body.result == true) {
					T.hintView.send('领取成功！');
					var mainTask = data.body.tasks;
					if (!data.body.errcode) {
						var statusName = 'task_' + mainTask.status;
						var mainTaskList = '';
						mainTaskList += '<li data-targetId="' + mainTask.targetId + '"><i><img src="' + mainTask.picUrl + '"></i>';
						mainTaskList += '<div><h2>' + mainTask.title + '<span>(' + mainTask.achieveAmount + '/' + mainTask.targetAmount + ')</span></h2><p><i><img src="/public/img/silver-gold.png" alt=""></i><span>代币·' + mainTask.goldReward + '</span></p></div>';
						mainTaskList += '<a data-id="' + mainTask.taskId + '" class="task_link  ' + statusName + '" href="javascript:void(0);">' + Config.taskStatus[mainTask['status']] + '</a></li>';
					}
					$('#main_task').html(mainTaskList);
					if (mainTask.status == 1) {//任务未完成时可点击跳转
						$('#main_task').find('.task_link').off('click').on('click', function () {
							taskLink(mainTask.targetId)
						})
					}
				} else {
					T.hintView.send('领取失败！请重试');
				}
			})
	}

	var dailyTaskStatus = [];
	// 获取日常任务列表
	function getDailyTask() {
		T.server({ url: Config.url.getDailyTask + '&session=' + Cookies.get('_session') })
			.then(function (data) {
				console.log(data)
				var dailyTask = data.body.tasks;
				var dailyTaskList = '';
				if (!data.body.errcode) {
					dailyTaskStatus = [];
					for (var x = 0; x < dailyTask.length; x++) {
						dailyTaskStatus.push(dailyTask[x].status);
						var statusName = 'task_' + dailyTask[x].status;
						dailyTaskList += '<li data-targetId="' + dailyTask[x].targetId + '"><i><img src="' + dailyTask[x].picUrl + '"></i>';
						dailyTaskList += '<div><h2>' + dailyTask[x].title + '<span>(' + dailyTask[x].achieveAmount + '/' + dailyTask[x].targetAmount + ')</span></h2><p><i><img src="/public/img/silver-gold.png" alt=""></i><span>代币·' + dailyTask[x].goldReward + '</span></p></div>';
						dailyTaskList += '<a data-id="' + dailyTask[x].taskId + '" class="task_link  ' + statusName + '" href="javascript:void(0);">' + Config.taskStatus[dailyTask[x]['status']] + '</a></li>';
					}
				}
				$('#daily_task').html(dailyTaskList);
				giveLink();
			})
	}
	// 根据任务进度绑定点击事件
	function giveLink() {
		if (dailyTaskStatus.length != 0) {
			var linkList = $('#daily_task').find('li');
			console.log(dailyTaskStatus.length)
			for (var d = 0; d < dailyTaskStatus.length; d++) {
				if (dailyTaskStatus[d] == 1) {
					console.log(dailyTaskStatus[d])
					console.log(linkList[d])
					linkList.eq(d).find('a').off('click').on('click', function () {
						taskLink($(this).parents('li').attr('data-targetId'))
					})
				} else if (dailyTaskStatus[d] == 2) {
					linkList.eq(d).find('a').off('click').on('click', function () {
						getDailyReward($(this).attr('data-id'))
					})
				} else {
					linkList.eq(d).off('click');
				}
			}
		}
	}

	//获取日常任务奖励
	function getDailyReward(taskId) {
		T.server({ url: Config.url.getDailyReward + '&session=' + Cookies.get('_session') + '&taskId=' + taskId })
			.then(function (data) {
				if (data.body.result == true) {
					T.hintView.send('领取成功！');
					getDailyTask();
				} else {
					T.hintView.send('领取失败！请重试');
				}
			})
	}

	function invite() {
		var shareUrl = 'http://imgws.leshu.com/game/17/share/share-2.html?'+'doll_name='+'&doll_img='+'&code='+'&user_img='+ userPic;
		_share.share(shareUrl);
	}
	// 
	function userTask() {
		T.server({ url: Config.url.playerInfo + '&session=' + Cookies.get('_session') }).then(function(data){
			userPic = data.body.player.pic
		})
		getMainTask();
		getDailyTask();
		// 返回设置
		$('.back-img').off('click').on('click', function () {
			_v.openView('set')
		})
	}
	return { userTask: userTask }

})