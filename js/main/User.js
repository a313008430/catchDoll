// 个人中心页
define(['tool', 'config', 'viewsEvent'], function (T, Config, _v) {
	'use strict';

	function user() {
		// var time = 0; 
		T.server({ url: Config.url.playerInfo + '&session=' + Cookies.get('_session') })
			.then(function (u) {
				console.log(u)
				// alert(JSON.stringify(u))
				// console.log(userData);
				if (!u.body.errcode) {
					var userData = u.body.player;
					$('#head_img')[0].src = userData.pic;
					$('.name').html('<span>' + userData['name'] + '</span>(ID:' + userData['id'] + ')');
				}
			});
		T.server({ url: Config.url.toysLists + '&session=' + Cookies.get('_session') })
			.then(function (t) {
				console.log(t)
				var toyslist = '';
				if (!t.body.errcode) {
					// console.log(t.body.toys.length)
					$('#mine_num').html(t.body.toys.length);
					if (t.body.toys.length == 0) {
						$('#mine_list').html('<p class="none-txt">您的柜子空空如也<br>现在就去抓娃娃</p>');
						return false;
					} else {
						var toysLists = t.body.toys;
						for (var x = 0, l = toysLists.length; x < l; x++) {
							var time = parseInt(toysLists[x].createTime);
							toyslist += '<li><img src="' + toysLists[x]['url'] + '"/><h3>' + toysLists[x]['name'] + '</h3><time>' + getTimes(time) + '</time></li>';
						}
						$('#mine_list').html(toyslist);
					}
				}
			});
		function getTimes(time) {
			var data = new Date(time), //实例一个时间对象；
				y = data.getFullYear(),//获取系统的年；
				mon = data.getMonth() + 1,//获取系统月份，由于月份是从0开始计算，所以要加1
				d = data.getDate(),// 获取系统日，
				h = data.getHours(),//获取系统时，
				min = data.getMinutes(),//分
				s = data.getSeconds();//秒
			return y + '/' + (mon < 10 ? '0' + mon : mon) + '/' + (d < 10 ? '0' + d : d) + '  ' + (h < 10 ? '0' + h : h) + ':' + (min < 10 ? '0' + min : min) + ':' + (s < 10 ? '0' + s : s);
		}
		// 进入发货界面
		$('#shipments').off('click').on('click', function () {
			// T.server({ url: Config.url.address + '&session=' + Cookies.get('_session') })
			// 	.then(function (data) {
			// 		console.log(data)
			// 		if (data.body.addresses.address == '') {
			// 			_v.openView('address')
			// 		} else {
			_v.openView('creatorder')
			// 		}
			// 	})
		});
		// 返回首页
		$('.back-img').off('click').on('click', function () {
			_v.openView('index')
		})
	}
	return { user: user }
})