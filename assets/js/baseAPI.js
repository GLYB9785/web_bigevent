// ajax发起请求时会默认优先调用改函数（.get/.post/.ajax
// 该函数会拦截每一次ajax请求，拿到里面的配置对象
// options 就是拿到的那个配置对象
$.ajaxPrefilter(function (options) {

    // console.log(options.url) // api/login

    // 1.在发起真正的ajax请求之前，统一拼接请求路径
    options.url = 'http://api-breakingnews-web.itheima.net/' + options.url
    console.log(options.url)

    // 2.统一为有权限的接口，设置header请求头
    if (options.url.indexOf('my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 3.全局统一挂载 complete 回调函数
    options.complete = function (res) {
        // 在complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据

        if (res.responseJSON.status === 1 && res.responseJSON.message == '身份认证失败！') {
            // 1.强制清空 token
            localStorage.removeItem('token')

            // 2.强制跳转到登录页面
            location.href = './login.html'
        }
    }

})


