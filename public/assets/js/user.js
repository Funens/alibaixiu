//用于操作用户
//新建空白数组存放数据
var userArr = new Array();
//将用户列表展示
$.ajax({
    type: 'get',
    url: '/users',
    success: function(res) {
        // console.log(res);
        userArr = res;
        //讲得到的数据
        render(userArr)
    }
})

//调用模板引擎 template方法
function render(arr) {
    var str = template('userTpl', {
        list: arr
    });
    // console.log(str);
    $('tbody').html(str);


}
//新增用户
$('#Addbtn').on('click', function() {
    // alert('阿三个傻瓜')
    //阻止表单默认提交行为
    //获取用户在表单书写的内容  serialize() 将获取到的数据格式化成字符串参数形式
    // var formData = $(this).serialize();
    // console.log(formData);
    //向服务器发送添加请求
    $.ajax({
        type: 'post',
        url: '/users',
        //等于表单数据 userForm是表单的id
        data: $('#userForm').serialize(),
        success: function(res) {
            // console.log(res);
            // 将得到的数据push到数组中
            userArr.push(res);
            //将数据渲染到页面上
            render(userArr);
        },
        error: function() {

        }
    });
    //回复初始值
    //置空表单
    // $('#userForm').find('input').val('');
    // //头像恢复默认
    // $('#preview').attr('src', '../assets/img/default.png')


});
//上传头像
$('#avatar').on('change', function() {
    //用户选择的文件
    // this.files[0]
    var formData = new FormData();
    formData.append('avatar', this.files[0]);

    //发送ajax请求
    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        //因为是二进制文件上传 不要解析成字符串
        //所以不要解析请求参数
        processData: false,
        //告诉ajax不要设置请求参数类型
        contentType: false,
        //response 存储的是上传之后的图片地址
        success: function(response) {
            // console.log(response);
            //图片预览 attr 设置自定义属性 显示用户查看
            $('#preview').attr('src', response[0].avatar);
            //选择隐藏域 保存头像地址value 提交服务器
            $('#hiddenAvatar').val(response[0].avatar);
        }
    })


});

var userId;

//编辑用户功能
//给所有编辑按钮添加点击事件 因为编辑按钮时动态生成的 所以要用事件委托
// 参数   事件类型   添加对象  回调函数
$('tbody').on('click', '.edit', function() {
    //当点击编辑按钮时 获取器=其父元素下面的所有子元素集合  然后将表格里面的数据放到对应的左侧表单中
    //获取id  且将其设置成全局变量 让后续编辑,修改,删除均可借用
    userId = $(this).parent().attr('data-id');
    //将上面添加用户 给成修改用户
    $('#userForm > h2').text('修改用户')

    //先获取当前被点击的父元素集合
    var trObj = $(this).parents('tr');

    //获取图片的地址
    var imgSrc = trObj.children(1).children('img').attr('src');
    //将图片写入隐藏域
    $('#hiddenAvatar').val(imgSrc);
    //如果imgSrc有值 将url添加到img上  jquery 中attr有一个参数表示获取 两个参数表示设置属性值
    if (imgSrc) {
        $('#preview').attr('src', imgSrc);
    } else {
        //系统默认头像
        $('#preview').attr('src', "../assets/img/default.png");
    }


    //将对应的内容写到左侧输入框里面 text匹配
    $('#email').val(trObj.children().eq(2).text());
    $('#nickName').val(trObj.children().eq(3).text());
    // 判断状态
    var status = trObj.children().eq(4).text;
    if (status == '激活') {
        $('#jh').prop('checked', true);
    } else {
        $('#wjh').prop('checked', true);

    }
    //判断角色
    var role = trObj.children().eq(5).text();
    if (role == '超级管理员') {
        $('#admin').prop('checked', true)
    } else {
        $('#normal').prop('checked', true)
    }
    //当我们点击编辑按钮时 添加按钮隐藏  修改按钮显示
    $('#Addbtn').hide();
    $('#Editbtn').show();

});
//完成修改用户功能
$('#Editbtn').on('click', function() {
    //右边的数据是有id属性的 所以在生成模板是 可以将id赋值给我某个标签添加一个自定义属性
    // <!-- 利用事件委托 将用户id保存给删除和编辑按钮的父元素身上 方便后续两者调用 -->
    //当我们鼠标点击编辑按钮时 就可以拿到其父元素身上的id属性了 我们使用一个变量来保存这个id 
    alert('啊哈哈');
    console.log(userId);
    console.log($('#userForm').serialize());

    $.ajax({
        type: 'put',
        url: '/users/' + userId,
        data: $('#userForm').serialize(),
        success: function(res) {
            // console.log(res);

            //我们这只是把数据库中数据修改了  所以我们要在数组中找到我们要修改的那一条数据 修改后重新渲染到页面
            var index = userArr.findIndex(item => item._id == userId);
            console.log(index);

            //根据这个index找到数组元素中的元素,将他的数据更新
            userArr[index] = res;
            //重新渲染页面
            render(userArr)
        }

    })

});
//删除单个元素
$('tbody').on('click', '.del', function() {
    //先弹出提示框
    if (window.confirm('真的要删除吗')) {
        var id = $(this).parent().attr('data-id');
        console.log(id);
        // return;
        //发送ajax请求
        $.ajax({
            type: 'delete',
            url: '/users/' + id,
            success: function(res) {
                console.log(res);
                var index = userArr.findIndex(item => item._id = id);
                userArr.splice(index, 1);
                render(userArr);

            }
        });

    }

});
// 获取批量删除按钮
var deleteMany = $('#deleteMany');
//获取全选按钮
var selectAll = $('#selectAll');

// 批量删除元素
selectAll.on('change', function() {
    //获取当前全选框按钮状态
    var status = $(this).prop('checked');
    if (status) {
        // 显示批量删除按钮
        deleteMany.show();
    } else {
        //隐藏批量删除按钮
        deleteMany.hide();
    }
    //获取到下面的所有复选框 并将复选框的状态与全选状态保持一致
    $('tbody').find('input').prop('checked', status);
});
//当用户前面的复选框装发生变化是 实行反选 因为用户是动态创建的 所以利用事件委托
$('tbody').on('change', '.userStatus', function() {
    //获取到所有复选框 当复选框选中的个数与所有复选框个数一样时 全选按钮被选中
    var inputs = $('tbody').find('input');
    console.log(inputs);

    if (inputs.lenght == inputs.filter(':checked').lenght) {
        //全选框选中
        selectAll.prop('checked', true);
    } else {
        selectAll.prop('checked', false);
    }
    //当用户前面的复选框选中个数大于1 显示批量删除按钮
    if ((inputs).filter(':checked').lenght > 0) {
        deleteMany.show();
    } else {
        deleteMany.hide();
    }

});
// 为批量删除按钮添加删除功能
deleteMany.on('click', function() {
    var ids = [];
    //获取所有选中的用户
    var checkedUser = $('tbody').find('input').filter(':checked');
    // 循环复选框 从复选框元素的身上获取data-id属性的值
    checkedUser.each(function(index, element) {
        ids.push($(element).attr('data-id'))
    });
    //ids.join('-') 是把id数组用-分割成字符串 应删除接口参数要求
    //发送ajax请求
    if (confirm('确定删除吗')) {
        $.ajax({
            type: 'delete',
            url: '/users/' + ids.join('-'),
            success: function(res) {
                //这个res里面放的是被删除元素的数组 元素以对象的形式存储的
                res.forEach(e => {
                    var index = userArr.findIndex(item => item._id == e._id);
                    //调用splice()方法 删除
                    userArr.splice(index, 1);
                    render(userArr);
                })

            }
        })
    }

})