$(function () {
    const layer = layui.layer
    const form = layui.form
    const laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss


    }

    // 定义补零函数
    function padZero(d) {
        return d > 9 ? d : '0' + d
    }


    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    initTable()
    initCate()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: 'my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化分类方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: 'my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类列表失败！')
                }
                // 调用模板引擎渲染分类的可选项
                let htmlStr = template('tpl-cate', res)
                // console.log(htmlStr)
                $('[name=cate_id]').html(htmlStr)

                // 通过 layui重新渲染UI结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()

        // 获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()

        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state

        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {

        // 调用layui中方法渲染分页
        laypage.render({
            elem: 'pageBox', // 分页区的Id
            count: total, // 数据的总数
            limit: q.pagesize, // 每页显示的条数
            curr: q.pagenum, //起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],

            // 页面发生切换的时候，可触发jump回调
            // 触发jump回调：1.页面切换 2.调用laypage.render
            jump: function (obj, first) {

                // console.log(obj.curr) //当前页码值
                // console.log(obj.limit) //当前条目数
                // 将最新的页码值 赋值给查询参数 q.pagenum
                q.pagenum = obj.curr
                // 将最新的条目数，赋值给查询参数 q.pagesize
                q.pagesize = obj.limit

                // 通过first值可以判断是通过哪种方式触发的回调函数
                // true:2
                // undefined:1
                // console.log(first)
                // console.log(!first)

                if (!first) {
                    initTable()
                }

            }
        })
    }

    // 通过代理为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // console.log('ok')

        // 获取删除按钮的个数，用于判断页面中是否还有值
        let len = $('.btn-delete').length

        // 获取要删除数据的那个Id
        let id = $(this).attr('data-id')

        // 弹出层
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            //发起删除请求
            $.ajax({
                method: 'GET',
                url: 'my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除文章成功！')

                    // 当数据删除完成之后，需要判断当前这一页中，是否还有剩余数据
                    // 如果没有剩余数据，则让页码值-1
                    // 再重新渲染表单
                    if (len === 1) {
                        // 页码值最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            // 关闭弹出层
            layer.close(index)
        })
    })

    //编辑文章功能
    // 6. 监听编辑按钮的点击事件
    $('tbody').on('click', '.btn-edit', function () {
        //1.获取文章ID
        location.href = './art_edit.html?id=' + $(this).attr('data-id')
        // 6. 监听编辑按钮的点击事件

        // 2.发送ajax请求



    })



})
