// 入口函数
$(function () {
    // 点击 登录/注册 来回切换(盒子的显示与隐藏)
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 自定义校验规则
    // 从 layui中获取form对象，需要先导入layui的JS文件
    let form = layui.form
    // 通过 form.verify() 函数自定义校验规则
    form.verify({

        // name：[reg，res]
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        // 校验两次密码是否一致规则
        repwd: value => {
            // value拿到的是确认密码框中的内容
            // 通过与密码框中的内容比较
            // 若不一致，则return提示消息
            let pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) return '两次密码不一致！'

        }

    })

    // 从 layui中获取layer对象
    let layer = layui.layer
    // 监听注册表单提交事件
    $('#form_reg').on('submit', function (e) {

        // 1.阻止默认行为
        e.preventDefault()

        const data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
        // 2.发起Ajax的POST请求
        $.post('api/reguser', data, function (res) {
            if (res.status !== 0) return layer.msg(res.message)

            // 注册成功
            layer.msg('注册成功，请登录！')

            // 跳转登录
            $('#link_login').click()
        })
    })


    // 监听提交登录表单事件
    $('#form_login').submit(function (e) {
        // 1.阻止默认行为
        e.preventDefault()

        // 2.发起ajax POST请求
        $.ajax({
            url: 'api/login',
            method: 'POST',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layer.msg('登陆失败！')

                // 登录成功 
                layer.msg('登录成功！')

                // token值用于访问有权限的接口 手动通过postman添加到header中
                // console.log(res.message)
                // console.log(res.token)

                // 将登录成功得到的 token 字符串，保存到localStorage中
                localStorage.setItem('token', res.token)

                // 跳转页面
                location.href = '/index.html'
            }
        })
    })

})