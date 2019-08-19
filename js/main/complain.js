define(['tool', 'config', 'viewsEvent'], function (T, Config, _v) {
    'use strict';
    var systemMessages = [];//留言缓存
    // var mineMessages = [];//用户留言缓存
    var messageBox = '';//
    var playerImg = '';//用户头像
    var systemImg = '';//客服头像
    function complain() {
        messageBox = $('.message_box');//留言主体块
        // 返回设置
        $('.back-img').off('click').on('click', function () {
            clearInterval(messageTime);
            _v.openView('set')
        })
        peopleImg();
        historyMessage();
        // $('.sendMessageBottom').find('input').off('click').on('click',function(){
        //     $(window).scrollTop(0);
        //     $('body,html').scrollTop(0);
        // })
        $('.sendMessageBottom').find('input').on('input propertychange',function(){
            console.log(!$(this).val().length)
            if(!$(this).val().length){
                $('.sendMessageBtn').removeClass('readysend');
            }else if($(this).val() == 10109085){
                $('.sendMessageBtn').off('click').on('click',function(){
                    _v.openView('inviteFriends');
                })
            }else{
                $('.sendMessageBtn').addClass('readysend');
            }
        })
        $('.sendMessageBtn').off('click').on('click', function () {
            sendMessage();
            $('.sendMessageBottom').find('input').focus();
        })
        var messageTime = setInterval(function () {
            backMessage()
        }, 5000)
    }
    function peopleImg() {
        T.server({ url: Config.url.playerInfo + '&session=' + Cookies.get('_session') })
            .then(function (data) {
                console.log(data)
                playerImg = data.body.player.pic;
            })
        T.server({ url: Config.url.configInfo + '&session=' + Cookies.get('_session') })
            .then(function (data) {
                systemImg = data.body.customerUrl
            })
    }
    function sendMessage() {
        var messageInfo = $('.sendMessageBottom').find('input').val();
        T.server({ url: Config.url.chatGo + '&session=' + Cookies.get('_session') + '&message=' + messageInfo })
            .then(function (data) {
                console.log(messageInfo)
                console.log(data)
                if (data.body.status == true) {
                    $('.sendMessageBottom').find('input').val('')
                    // messageBox.append('<p class="mine_message"><img src="#" alt=""><i></i><span>' + messageInfo + '</span></p>')
                    // mine_messages.push({'message':messageInfo,'createTime':0})
                    backMessage();
                }
            })
    }
    function backMessage() {
        T.server({ url: Config.url.chatBack + '&session=' + Cookies.get('_session') })
            .then(function (data) {
                console.log(data)
                if (!data.body.errcode) {
                    if (data.body.messages != null) {
                        for (var x = 0; x < data.body.messages.length; x++) {
                            if (data.body.messages[x].type == 0) {
                                systemMessages.push({ 'message': data.body.messages[x].message, 'createTime': data.body.messages[x].createTime, 'type': 0 })
                                messageBox.append('<p class="mine_message" date-time="' + data.body.messages[x].createTime + '"><img src="' + playerImg + '" alt=""><i></i><span>' + data.body.messages[x].message + '</span></p>')
                            } else if (data.body.messages[x].type == 1) {
                                messageBox.append('<p class="system_message" date-time="' + data.body.messages[x].createTime + '"><img src="' + systemImg + '" alt=""><i></i><span>' + data.body.messages[x].message + '</span></p>')
                                systemMessages.push({ 'message': data.body.messages[x].message, 'createTime': data.body.messages[x].createTime, 'type': 1 })
                            }
                        }
                    }
                    console.log(systemMessages)
                }
            })
    }

    function sortCreateTime(a, b) {
        return a.createTime - b.createTime
    }
    function historyMessage() {
        systemMessages.sort(sortCreateTime)
        // console.log(systemMessages)
        var messageBoxList = '';
        for (var n = 0; n < systemMessages.length; n++) {
            if (systemMessages[n].type == 0) {
                messageBoxList += '<p class="mine_message" date-time="' + systemMessages[n].createTime + '"><img src="' + playerImg + '" alt=""><i></i><span>' + systemMessages[n].message + '</span></p>';
            } else if (systemMessages[n].type == 1) {
                messageBoxList += '<p class="system_message" date-time="' + systemMessages[n].createTime + '"><img src="' + systemImg + '" alt=""><i></i><span>' + systemMessages[n].message + '</span></p>';
            }
        }
        messageBox.html(messageBoxList);
    }

    return { complain: complain }
})