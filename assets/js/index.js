$(function () {
    // 调用getUserInfo获取用户基本信息
    getUserInfo()
})

// 获取用户基本信息

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: 'my/userinfo',
        // 以/my 开头的API接口有请求权限
        // 在请求头中添加Authorization属性和对应的token值
        // token值在locostorage中取
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: function (res) {
            console.log(res)
        }
    })
}