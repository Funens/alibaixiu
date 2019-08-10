var cArr = new Array();

//将用户列表展示
$.ajax({
    type: 'get',
    url: '/categories',
    success: function(res) {
        // console.log(res);
        cArr = res;
        //讲得到的数据
        render(cArr);
    }
});

//添加用户分类
$('#cAdd').on('click', function() {
    $.ajax({
        type: 'post',
        url: '/categories',
        data: $('#cForm').serialize(),
        success: function(res) {
            console.log(res);

            cArr.push(res);
            render(cArr)
        }
    });
});
//调用模板引擎 template方法
function render(arr) {
    var str = template('cTpl', {
        list: arr
    });
    // console.log(str);
    $('tbody').html(str);

};

//编辑功能
var cId;
$('tbody').on('click', '.edit', function() {

    cId = $(this).parent().attr('data-id');
    console.log(cId);

    //先找到相对应的值
    // alert('发发发');
    $('#cForm > h2').text('修改分类');


    var title = $(this).parents('tr').children().eq(1).text();
    var className = $(this).parents('tr').children().eq(2).text();
    // console.log(title);

    //将值添加到左侧相对应input表单里面
    $('#title').val(title);
    $('#className').val(className)
        //显示修改按钮 隐藏添加按钮
    $('#cAdd').hide();
    $('#cEdit').show();

});
//修改分类
$('#cEdit').on('click', function() {
    //获取数据传输过来的id
})