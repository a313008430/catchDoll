function slide_on(){
	var box = $(".banner_imgs").find("li").first().clone();
	$(".banner_imgs").append(box);
	var banner_width = $('.banner').width();
	var li_num = $('.banner_imgs li').length;
	$(".banner_imgs").find("li").last().css('opacity',0);
	$('.banner_imgs').width(banner_width * li_num);
	for (var i_num = 0; i_num < li_num-1; i_num++){$(".banner_index").append("<i></i>");}
	$(".banner_index").find("i").first().addClass('current');
}


$(function () {
	var banner_width = $('#banner').width();
	var moveUl = $('.banner_imgs');
	var index_li = $('.banner_index i');

	var isDreg = false,
		touchStartX = 0,
		touchMoveX = 0,
		moveIndex = 0;
	moveUl.on('touchstart touchmove touchend touchcancel', function (e) {
		var type = e.type,
			self = $(this);
		if(type === 'touchstart'){
			clearInterval(time_go);
			isDreg = true;
			touchStartX = e.changedTouches[0].pageX;
			console.log(touchStartX);
		}else if(type === 'touchmove'){
			if (isDreg) {
				touchMoveX = e.changedTouches[0].pageX - touchStartX;
				console.log(touchMoveX);
				self.css('transform', 'translateX(' + (-moveIndex * $('#banner').width() + touchMoveX) + 'px)');
			}
		}else if(type === 'touchend' || type === 'touchcancel'){
			isDreg = false;
			if (touchMoveX > banner_width/3 ) {
				moveIndex--;
			} else if(touchMoveX < banner_width/3 *-1){
				moveIndex++;
			}
			setMove();
			time_go = setInterval(function(){
				if(moveIndex == moveUl.find('li').length -2){
					$(".banner_imgs").find("li").last().css('opacity',1);
					moveIndex++;
					moveUl.animate({ "transform": 'translateX(-' + moveIndex* $('#banner').width() + 'px)' },300);
					$('.banner_index').find('i').eq(0).addClass('current').siblings().removeClass('current');
					time_back=setTimeout(function(){    
						moveIndex=0;
						moveUl.css({"transform":"translate(0)"});
						$(".banner_imgs").find("li").last().css('opacity',0);
					},300);
					return false;
				}
				moveIndex++;
				setMove();
			},4000);
		}
		// console.log(e)
		// console.log(e.changedTouches[0].pageX)
		
	});
	function setMove() {
		if(moveIndex >= moveUl.find('li').length - 1){
			moveIndex = moveUl.find('li').length - 2
		}else if(moveIndex <= 0){
			moveIndex = 0
		}
		// console.log(moveIndex)
		moveUl.animate({ "transform": 'translateX(-' + moveIndex * $('.banner').width() + 'px)' }, 300);
		$('.banner_index').find('i').eq(moveIndex).addClass('current').siblings().removeClass('current'); 
	}
	moveUl.on('touchstart', 'li', function () {
		moveIndex = $(this).index();
	});
	var time_go =setInterval(function(){
		if(moveIndex == moveUl.find('li').length -2){
			$(".banner_imgs").find("li").last().css('opacity',1);
			moveIndex++;
			moveUl.animate({ "transform": 'translateX(-' + moveIndex* $('.banner').width() + 'px)' },300);
			$('.banner_index').find('i').eq(0).addClass('current').siblings().removeClass('current');
			time_back=setTimeout(function(){    
				moveIndex=0;
				moveUl.css({"transform":"translate(0)"});
				$(".banner_imgs").find("li").last().css('opacity',0);
			},400);
			return false;
		}
		moveIndex++;
		setMove();
	},4000);
	// $('.index-list li a img').css('height',($('body').width() + 5)/2 - 25 +'px');
	$(window).resize(function() {
		var banner_width = $('#banner').width();
		var li_num = $('.banner_imgs li').length;
		$('.banner_imgs').width(banner_width * li_num);
		$('.banner_imgs').css({'transform':'translateX(-' + moveIndex * $('.banner').width() + 'px)'});
	});
})
