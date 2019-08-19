// 地址列表获取
define(['tool', 'config'], function (T, Config) {
    // function addresslist() {
        var addressAllList = [];//缓存所有地址
        var needAddressList = [];//缓存现有地址


        function getList (fn){
            if(addressAllList.length){
                if(fn) fn(addressAllList);
            }else{
                T.server({ url: Config.url.getRegions + '&session=' + Cookies.get('_session') })
                .then(function(r) {
                    addressAllList = r.body.regions;
                    if(fn) fn(addressAllList);
                })
            }
        // }
    }
    return { getList: getList }
})

// dfs.getList(function(d){
//     console.log(d)
// })