/**
 * Created by Xiazhou on 2018年1月6日.
 */
require.config({
	paths: {
		"eruda": "library/eruda.min",
		"swiper": "library/swiper.min",
		"crypto": "library/crypto-js.min",
		"jsmpeg": "library/jsmpeg.min",
		"text": "library/requirejs-text",

		"config": "main/config",
		"configViewBase": "main/ConfigViewBase",
		"grab": "main/grab",
		"gameLogic": "main/gameLogic",
		"index": "main/index",
		"tool": "main/tool",
		"order": "main/myOrder",
		"viewsEvent": "main/ViewsEvent",
		"setLogic": "main/SetLogic",
		"user": "main/User",
		"coin":"main/Coin",
		"CreatOrder":"main/CreatOrder",
		"record":"main/Record",
		"confirmPay":"main/ConFirmPay",
		"address":"main/Address",
		"addresslist":"main/addresslist",
		"help":"main/help",
		"helpanswer":"main/helpAnswer",
		"complain":"main/complain",
		"userTask":"main/userTask",
		"invitationCode":"main/InvitationCode",
		"inviteFriends":"main/InviteFriends",
		"share":"main/share",
		"notice":"main/Notice",

		"js": "js",
		'clipboard':'clipboard',

		"wanBa": 'SDK/WanBa',
		"meiTu": 'SDK/MeiTu',
		"leShu": 'SDK/LeShu',


	},
	urlArgs: "v=" + (new Date()).getTime()
});

// <script src="https://cdn.bootcss.com/eruda/1.3.2/eruda.min.js"></script>
//	 eruda.init();

FastClick.attach(document.body);
require(['gameLogic'], function (a, c) {
	// require(['text!views/Index.html'], function (e) {
	// 	console.log(e)
	// })
	// if(window.mqq){
	// 	c.init();
	// console.log(c)
	// }

});