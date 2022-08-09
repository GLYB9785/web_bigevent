$(function () {
    // 调用getUserInfo获取用户基本信息
    getUserInfo()

    let layer = layui.layer
    // 给退出按钮绑定退出事件 layui内置模块
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {

            // console.log(index)
            // 1.清空本地存储的token
            localStorage.removeItem('token')
            // 2.重新跳转到登录页面
            location.href = '/login.html'
            // 3.关闭confirm询问框
            layer.close(index);
        });
    })
})

// 获取用户基本信息

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: 'my/userinfo',
        // 以/my 开头的API接口有请求权限
        // 在请求头中添加Authorization属性和对应的token值
        // token值在locostorage中取
        /*  headers: {
             Authorization: localStorage.getItem('token') || ''
         }, */
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }

            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        }
    })
}

function renderAvatar(user) {
    // 1. 获取用户名称 nickname:管理名称 
    let name = user.nickname || user.username

    // 2. 设置欢迎文本
    $('#welcome').html('欢迎 &nbsp' + name)

    // 3. 按需渲染头像 若有头像，user中会包含一个user_pic属性
    if (user.user_pic !== null) {
        // 渲染图片头像 $.attr('属性',值)
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avater').hide()
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide()
        // 获取name中的第一个字母并将其转成大写
        let first = name[0].toUpperCase()
        $('.text-avater').html(first).show()
    }


}