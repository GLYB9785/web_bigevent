$(function () {
    let form = layui.form
    let layer = layui.layer

    // 密码验证规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新密码不能与原密码相同！'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次输入的密码不一致！'
            }
        }
    })

    // 发起ajax请求
    $('.layui-form').on('submit', function(e) {
        // 阻止默认行为
        e.preventDefault()

        // 发起请求
        $.ajax({
            method: 'POST',
            url: 'my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
              if (res.status !== 0) {
                return layer.msg('更新密码失败！')
              }
                layer.msg('更新密码成功！')

                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })


})