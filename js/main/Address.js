// 修改地址页
define(['tool', 'config', 'gameLogic', 'viewsEvent', 'addresslist'], function (T, Config, gameLogic, _v, _add) {
	'use strict';
	/**
	 * 修改地址页
	 */
	var addressmine = []; //旧有地址缓存
	var addressAll = [];//所有收货人信息
	var addressAllList = [];//缓存所有地址列表
	var needAddressList = [];//缓存现有地址
	var oldAddress = [];
	var uid = null;//用户uid
	var inputList = null;

	function address() {
		getOldAddress();
		//选择地址
		$('#address-input').off('click').on('click', function () {
			needAddressList = [];
			addressmine = [];
			$('.address-wrap').show();
			getAddressParentList();
		});
		// 保存地址信息按钮
		$('#save_address').off('click').on('click', function () {
			inputNull()
			// del()
		})
		// 返回娃娃选择
		$('.back-img').off('click').on('click', function () {
			_v.openView('creatorder')
		})
		// 关闭选择地址
		$('.address-wrap').on('click', '.close', function () {
			$('.address-wrap').hide();//关闭
		})
	}

	// 获取地址列表
	_add.getList(function (d) {
		addressAllList = d;
	})

	// 旧有地址信息获取
	function getOldAddress() {
		T.server({ url: Config.url.address + '&session=' + Cookies.get('_session') })
			.then(function (data) {
				oldAddress = data.body.addresses;
				// console.log(data)
				// address = data.body.addresses;
				////获取不为零的地址
				for (var i = 0; i < oldAddress.length; i++) {
					if (parseInt(oldAddress[i].id)) {
						addressAll = oldAddress[i];
						uid = addressAll.id;
						console.log(uid)
					}
				}
				// console.log(addressAll)
				fillInput();
			})
	}

	// 旧有信息填入
	function fillInput() {
		// console.log(addressAll)
		console.log(addressAllList)
		for (var x = 0, l = addressAllList.length; x < l; x++) {
			if (addressAllList[x].id == addressAll.province) {
				var p = addressAllList[x]['name'];
				if (addressAllList[x]['price'] != 0) {
					var price_last = addressAllList[x]['price']
				}
			}
			if (addressAllList[x].id == addressAll.city) {
				var c = addressAllList[x]['name'];
				if (addressAllList[x]['price'] != 0) {
					var price_last = addressAllList[x]['price']
				}
			}
			if (addressAllList[x].id == addressAll.district) {
				var d = addressAllList[x]['name'];
				// address_list(d)
			}
		}
		var add = p + c + d;
		addressmine.push(addressAll.province);
		addressmine.push(addressAll.city);
		addressmine.push(addressAll.district);
		// console.log(add)
		// console.log(addressAll)
		if (oldAddress.length == 0) {
			add = '';
		}
		$('#address-input').val(add);
		inputList = $('.address-div').find('input');
		inputList.eq(0).val(addressAll['name']);
		inputList.eq(1).val(addressAll['mobile']);
		inputList.eq(3).val(addressAll['address'])
		inputList.eq(4).val(addressAll['zipcode'])
	}

	// 判定信息不为空
	function inputNull() {
		inputList = $('.address-div').find('input');
		var inputBlank = null;
		for (var x = 0; x < 5; x++) {
			if (inputList.eq(x).val() == '' || !inputList.eq(x).val().length) {
				T.hintView.send(inputList.eq(x).siblings('h3').html() + '不能为空');
				inputBlank = false;
				return false
			}
		}
		if(inputBlank != false){
			sendNewAddress();
		}
	}
	function del(){
    T.server({
        url: Config.url.delAddress + '&session='
            + Cookies.get('_session') + '&id=' + 1491})
            .then(function(data){
                console.log(data)
            })
}
	// 发送新地址信息
	function sendNewAddress() {
		inputList = $('.address-div').find('input');
		// console.log(oldAddress[0].address)
		// console.log(!oldAddress.length)
		// console.log(oldAddress)
		if (!oldAddress.length || oldAddress[0].address == '') {
			console.log(1)
			// 无地址时添加地址
			T.server({
				url: Config.url.addAddress + '&session='
					+ Cookies.get('_session') + '&name=' + inputList.eq(0).val() + '&mobile=' + inputList.eq(1).val()
					+ '&address=' + inputList.eq(3).val() + '&zipcode=' + inputList.eq(4).val() + '&province=' + addressmine[0] + '&city=' + addressmine[1] + '&district=' + addressmine[2]
			})
				.then(function (data) {
					if (data.head.errcode != 0 || data.body.errcode) {
						T.hintView.send('修改失败');
						return false
					} else {
						T.hintView.send('修改成功');
						_v.openView('creatorder')
					}
				})
		} else {
			console.log(uid)
			console.log(2)
			// 有地址时修改地址
			T.server({
				url: Config.url.modifyAddress + '&session='
					+ Cookies.get('_session') + '&id=' + uid + '&name=' + inputList.eq(0).val() + '&mobile=' + inputList.eq(1).val()
					+ '&address=' + inputList.eq(3).val() + '&zipcode=' + inputList.eq(4).val() + '&province=' + addressmine[0] + '&city=' + addressmine[1] + '&district=' + addressmine[2]
			})
				.then(function (t) {
					if (t.head.errcode != 0 || t.body.errcode) {
						T.hintView.send('修改失败');
						return false
					} else {
						T.hintView.send('修改成功');
						_v.openView('creatorder')
					}
				})
		}
	}




	//获取省列表
	function getAddressParentList() {
		// console.log(addressAllList)
		var list = addressAllList
		if (!list.length) return;
		$('#address-ul').html(updateAddressListHtml(getChildListByParentid(0)));
		getChildFn();

	}

	//绑定事件 > li
	function getChildFn() {
		$('#address-ul').off('click', 'li').on('click', 'li', function () {
			var dataId = $(this).attr('data-id');
			var list = getChildListByParentid(dataId);
			var html = updateAddressListHtml(list);
			addressmine.push(dataId);
			console.log(addressmine);
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

			// console.log(needAddressList)

			finalHtml();

			if (!html.length) {
				$('.address-wrap').hide();//关闭
				return;
			}
			$('#address-ul').html(html);

			//getChildFn();
		});

	}

	function finalHtml() {
		var html = '';
		for (var x = 0, l = needAddressList.length; x < l; x++) {
			html += needAddressList[x].name;
		}
		$('#address-input').val(html);
	}
	console.log(needAddressList)
	//通过地址列表更新address-ul 列表
	function updateAddressListHtml(list) {
		var html = '';
		//console.log(list)
		$.each(list, function (i, data) {
			html += '<li data-id="' + data.id + '">' + data.name + '</li>';
		});
		return html;
	}

	//通过父级id获取对应的地址列表
	function getChildListByParentid(id) {
		var list = [];
		for (var x = 0, l = addressAllList.length; x < l; x++) {
			if (addressAllList[x].parentId == id) {
				list.push(addressAllList[x]);
			}
		}
		return list;
	}

	//通过id获取地址信息
	function getAddressMsgById(id) {
		for (var x = 0, l = addressAllList.length; x < l; x++) {
			if (addressAllList[x].id == id) {
				return addressAllList[x];
			}
		}
	}

	return { address: address }
})