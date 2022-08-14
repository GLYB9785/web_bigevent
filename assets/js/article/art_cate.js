$(function () {
    const layer = layui.layer
    const form = layui.form

    initArtCateList()

    // 发起ajax请求 获取列表数据并渲染
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: 'my/article/cates',
            success: function (res) {

                //  使用模板引擎渲染表格数据
                // template('模板标签的id'，要渲染的表单数据)
                let htmlStr = template('tpl-table', res)
                // 将结果替换到DOM标签中
                $('tbody').html(htmlStr)


            }
        })
    }

    // 点击实现添加分类弹出层效果
    let indexAdd = null
    $('#btnAddCate').on('click', function () {
        // 调用layer.open方法 实现弹出层效果
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过代理的形式，为页面中动态添加的元素绑定事件
    // 为弹出层表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        // console.log('ok')

        // 发起添加请求
        $.ajax({
            method: 'POST',
            url: 'my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加分类失败！')
                }

                // 请求成功 需要重新渲染表单
                initArtCateList()
                layer.msg('添加分类成功！')
                // console.log(indexAdd) 1

                // 关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式 为动态添加的 btn-edit 按钮绑定事件
    // 为编辑按钮绑定点击事件
    let indexEdit = null
    $('tbody').on('click', '.btn-edit', function (e) {
        e.preventDefault()
        // console.log('ok')

        // 添加修改弹出层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改分类',
            content: $('#dialog-edit').html()
        })

        let id = $(this).attr('data-id')
        // console.log(id)

        // 发起请求获取Id对应的数据
        $.ajax({
            method: 'GET',
            url: 'my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    console.log('获取数据失败！')
                }
                // console.log(res)

                // 调用for.val()方法给指定表单填充数据
                form.val('form-edit', res.data)
            }
        })

    })

    // 通过代理的形式 为form-edit 绑定submit事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: 'my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类失败！')
                }

                layer.msg('更新分类成功！')
                // 关闭弹出层
                layer.close(indexEdit)
                // 更新表单数据
                initArtCateList()
            }
        })
    })

    // 通过代理为删除按钮绑定点击事件
    $('tbody').on('click','.btn-delete', function () {
        // 获取id属性
        let id = $(this).attr('data-id')

        // 弹出层提示
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            // 发起删除请求
            $.ajax({
                method: 'GET',
                url: 'my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章类别失败！')
                    }

                    layer.msg('删除文章类别成功！')
                    console.log(index)

                    // 关闭弹出层
                    layer.close(index)
                    // 更新表单数据
                    initArtCateList()
                }
            })

        })
    })

})