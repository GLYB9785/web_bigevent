$(function () {
    //    获取layui对象
    let form = layui.form
    let layer = layui.layer

    // 自定义验证规则
    form.verify({
        // nickname 验证规则
        nickname: function (value) {
            // value 就是nickname输入框中的内容
            if (value.length >= 6) {
                return '名称长度必须小于6！'
            }
        }
    })


    initUserInfo()

    // 初始化用户基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: 'my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // console.log(res)

                // 调用val快速为表单赋值 表单必须要有lay-filter属性值
                //formUserInfo 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置用户信息
    $('#btnReset').on('click', function (e) {
        // 阻止表单默认重置行为
        e.preventDefault()

        // 重新获取信息，填充表单
        initUserInfo()
    })

    // 监听表单的提交事件
    $('.layui-form').submit(function (e) {
        // 阻止默认行为
        e.preventDefault()

        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: 'my/userinfo',
            // 快速获取表单值
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')

                // 调用父页面中的方法，重新渲染用户头像和信息
                // window就是当前的ifram页面 
                // window.parent 就是 index.html页面
                window.parent.getUserInfo()
            }

        })
    })
})