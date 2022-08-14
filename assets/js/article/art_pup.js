$(function () {
    // 导入layui
    const layer = layui.layer
    const form = layui.form

    // 初始化富文本编辑器
    initEditor()

    initCate()
    // 定义加载分类选项方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: 'my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }
                // layer.msg('获取文章分类成功！')
                // console.log(res)

                // 渲染模板引擎
                let htmlStr = template('cate_id', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 封面图片
    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取用户选择列表
        let files = e.target.files
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return layer.msg('请选择文件！')
        }

        // 根据文件 创建URL地址
        let newImgURL = URL.createObjectURL(files[0])

        // 为裁剪区重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章发布状态
    let art_state = '已发布' //默认为已发布状态

    // 为存为草稿绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 为表单绑定submit事件
    $('#form-pup').on('submit', function (e) {

        // 1.阻止表单的默认提交行为
        e.preventDefault()

        // 2.基于form表单，快速创建一个 FormData对象
        let fd = new FormData($(this)[0])

        // 3.将文章的状态保存到fd中
        fd.append('state', art_state)


        // 4.将裁剪后的图片输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将图片追加到 fd中
                fd.append('cover_img', blob)
                puplishArticle(fd)
                editArticle(fd)
            })

        /* fd.forEach(function (value, key) {
            console.log(value, key)
        }) */
    })

    // 定义发布文章的方法
    function puplishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: 'my/article/add',
            data: fd,
            // 注意：向服务器提交FormData格式数据
            // 必须添加以下两个配置
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 跳转页面
                location.href = '/article/art_list.html'
            }
        })
    }


})