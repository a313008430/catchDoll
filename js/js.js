$(function () {
	//抓取
	// var code = "<div id=\'d\' style=\'width:100%;height:100%;background:#fff;position:fixed;top:0;left:0;z-index:999;opacity:0;-webkit-user-select:none;pointer-events:none;\'></div>";
	// $('body').append(code);
	// var dh = $('#d').height();
	// $('body').attr('data-height', dh)
	// // $('#d').remove();
	// var hh = $('body').attr('data-height');
	// $('.grab-wrap').css('height', Number(hh));
	//
	// setViewSize();
	// window.addEventListener('resize', function () {
	// 	setViewSize();
	// });
	//
	// function setViewSize () {
	// 	$('.grab-wrap').css('height', Number($(window).height()));
	// 	var w = $('#shootBox').width(),
	// 		h = $('#shootBox').height();
	//
	// 	//临时写的视频尺寸匹配
	// 	$('#mpeg_video_main').css({
	// 		width: w,
	// 		height: h,
	// 		// margin: (h - w) / 2 + 'px 0 0 ' + -(h - w) / 2 + 'px'
	// 	});
	// }
	
	//弹窗关闭---夏州修改，删除pop-close（暂时不管）
	$('.pop-close, .play-again').on('click', function () {
		$(this).parents('.pop-box').css('display', 'none');
		if (timeCode) clearInterval(timeCode);
	});
	
	/**
	 *  关闭充值层
	 * @author Created by Xiazhou on 2017年12月19日 16:49.
	 */
	// var payListNode = $('#payList');
	// $('#popClose').on('click', function () {
	// 	payListNode.fadeOut(300);
	// });
	
	//充值
	// $('.recharge').on('click', function () {
	// 	$('.pop-pay').parent('.pop-box').css('display', 'block');
	// });
	
	//抓取 旋转
	// $('#shooting-angle').on('click',function(){
	//     if( $('.direction-arr').css('transform') == 'rotate(90deg)'){
	//         $('.direction-arr').css({
	//             'transform':'rotate(0)',
	//             '-ms-transform':'rotate(0)',
	//             '-moz-transform':'rotate(0)',
	//             '-webkit-transform':'rotate(0)',
	//             '-o-transform':'rotate(0)'
	//         })
	//     }else{
	//         $('.direction-arr').css({
	//             'transform':'rotate(90deg)',
	//             '-ms-transform':'rotate(90deg)',
	//             '-moz-transform':'rotate(90deg)',
	//             '-webkit-transform':'rotate(90deg)',
	//             '-o-transform':'rotate(90deg)'
	//         })
	//     }
	//
	// })
	
	//抓取 4个角度
	// $('.direction-arr').find('.arr-left').on('touchstart',function(){
	//     $(this).css('background-position','0 -60px');
	// })
	// $('.direction-arr').find('.arr-left').on('touchend',function(){
	//     $(this).css('background-position','0 0');
	// })
	//
	// $('.direction-arr').find('.arr-right').on('touchstart',function(){
	//     $(this).css('background-position','-60px -60px');
	// })
	// $('.direction-arr').find('.arr-right').on('touchend',function(){
	//     $(this).css('background-position','-60px 0');
	// })
	//
	// $('.direction-arr').find('.arr-top').on('touchstart',function(){
	//     $(this).css('background-position','-120px -60px');
	// })
	// $('.direction-arr').find('.arr-top').on('touchend',function(){
	//     $(this).css('background-position','-120px 0');
	// })
	//
	// $('.direction-arr').find('.arr-bottom').on('touchstart',function(){
	//     $(this).css('background-position','-180px -60px');
	// })
	// $('.direction-arr').find('.arr-bottom').on('touchend',function(){
	//     $(this).css('background-position','-180px 0');
	// })
	
	//抓取 按下颜色
	// $('.catch-ico').on('touchstart',function(){
	//     $(this).css('background','#d42e2c');
	// })
	// $('.catch-ico').on('touchend',function(){
	//     $(this).css('background','#e74d4b');
	// })
	
	
	//延迟关闭
	var identifyingCodeTime = 0,
		identifyingCode = $('.pop-delay-close'),
		timeCode = null;
	
	// identifyingCodeTime = 5;
	// if( identifyingCode.parents('.pop-box').css('display')=='none' ){
	//     timeCode = null;
	// }else{
	//     setIdentifyingCodeTime();
	// }
	window.setIdentifyingCodeTime = setIdentifyingCodeTime;
	function setIdentifyingCodeTime (fn) {
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
	
	//音效开关
	// $('.switch').on('click',function(){
	//     if($(this).attr('class') == 'switch switch-open'){
	//         $(this).attr('class','switch switch-close');
	//     }else{
	//         $(this).attr('class','switch switch-open');
	//     }
	// });
	//夏州修改 2017-12-19
	(function () {
		var setBackgroundMusic = $('#setBackgroundMusic'),
			setBackgroundSound = $('#setBackgroundSound');
		if(!setBackgroundMusic.length || !setBackgroundSound.length) return;
		setBackgroundMusic.on('click', function () {
			if(parseInt(Cookies.get('musicStateClose'))){
				setSoundState(1, 0);
			}else{
				setSoundState(1, 1);
			}
		});
		setBackgroundSound.on('click', function () {
			if(parseInt(Cookies.get('musicStateClose'))){
				setSoundState(1, 0);
			}else{
				setSoundState(1, 1);
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
		function setSoundState (type, state) {
		
			switch (type){
				case 1:
					if(state){
						console.log(1)
						Cookies.set('musicStateClose',1);
						setBackgroundMusic[0].className = 'switch switch-close';
					}else{
						console.log(2)
						Cookies.set('musicStateClose',0);
						setBackgroundMusic[0].className = 'switch switch-open';
					}
					break;
				case 2:
					if(state){
						Cookies.set('soundStateClose','false');
					}else{
						Cookies.set('soundStateClose','true');
					}
					break;
			}
		}
	}());
	
	
	// 选择数量上限为5
	var ci1 = $('[name="ci1"]');
	ci1.change(function () {
		if (this.checked && ci1.filter(':checked').length > 5) {
			this.checked = false;
			this.parentNode.setAttribute("class", "");
		}
		;
	});
	// 复选框样式
	$('.choose-list input').on('click', function () {
		if ($(this).prop('checked') === true) {
			this.parentNode.setAttribute("class", "choose-tick");
		} else {
			this.parentNode.setAttribute("class", "");
		}
	});
	
	$('.surplus-pay input').on('click', function () {
		if ($(this).prop('checked') === true) {
			$(this).parent('label').addClass('tick-on');
		} else {
			$(this).parent('label').removeClass('tick-on');
		}
	});
	// 选中2个及以上激活支付按钮
	$('.choose-list input').on('click', function () {
		var tick_num = $('.choose-list .choose-tick').length;
		if (tick_num >= '2') {
			$('.confirm-box input').removeAttr('disabled');
		} else {
			$('.confirm-box input').attr('disabled', 'disabled');
		}
		if (tick_num > '5') {
			tick_num = '5';
		}
		$('.confirm-box em').text(tick_num);
	});
	
	//订单自动关闭
	setTimeout(function () {
		$('.pop-order-black').hide();
	}, 2000);
	
	//地址
	var addressAllList = [];//缓存所有地址
	var needAddressList = [];//缓存现有地址
	$('#address-input').on('click', function () {
		needAddressList = [];
		$('.address-wrap').show();
		if (addressAllList.length) {
			getAddressParentList(addressAllList);
		} else {
			$.getJSON("/Post/getRegions", function (result) {
				addressAllList = result;
				getAddressParentList(addressAllList);
			});
		}
	});
	
	
	//获取省列表
	function getAddressParentList (list) {
		if (!list.length)return;
		$('#address-ul').html(updateAddressListHtml(getChildListByParentid(0)));
		getChildFn();
		
	}
	
	//绑定事件 > li
	function getChildFn () {
		$('#address-ul').off('click', 'li').on('click', 'li', function () {
			var dataId = $(this).attr('data-id');
			var list = getChildListByParentid(dataId);
			var html = updateAddressListHtml(list);
			
			//获取现有地址路径
			var isHas = 0;
			var obj = getAddressMsgById(dataId);
			for (var x = 0, l = needAddressList.length; x < l; x++) {
				if (needAddressList[x].parentId == obj.parentId) {
					isHas++;
					needAddressList[x] = obj;
				}
			}
			if (!isHas) needAddressList.push(getAddressMsgById(dataId));
			
			//  console.log(html);
			
			finalHtml();
			
			if (!html.length) {
				$('.address-wrap').hide();//关闭
				return;
			}
			$('#address-ul').html(html);
			
			//getChildFn();
		});
		
	}
	
	function finalHtml () {
		var html = '';
		for (var x = 0, l = needAddressList.length; x < l; x++) {
			html += needAddressList[x].name;
		}
		$('#address-input').val(html);
	}
	
	//通过地址列表更新address-ul 列表
	function updateAddressListHtml (list) {
		var html = '';
		//console.log(list)
		$.each(list, function (i, data) {
			html += '<li data-id="' + data.id + '">' + data.name + '</li>';
		});
		return html;
	}
	
	//通过父级id获取对应的地址列表
	function getChildListByParentid (id) {
		var list = [];
		for (var x = 0, l = addressAllList.length; x < l; x++) {
			if (addressAllList[x].parentId == id) {
				list.push(addressAllList[x]);
			}
		}
		return list;
	}
	
	//通过id获取地址信息
	function getAddressMsgById (id) {
		for (var x = 0, l = addressAllList.length; x < l; x++) {
			if (addressAllList[x].id == id) {
				if (addressAllList[x]['parentId'].indexOf('0000') > 0) {
					$('#city').val(addressAllList[x]['id']);
				} else if (addressAllList[x]['parentId'].indexOf('00') > 0) {
					$('#district').val(addressAllList[x]['id']);
				} else {
					$('#province').val(addressAllList[x]['id']);
				}
				return addressAllList[x];
			}
		}
	}
	
	$('.address-wrap').on('click', '.close', function () {
		$('.address-wrap').hide();//关闭
	})
})