 //获取退出按钮 添加点击事件
 $('#logout').on('click', function() {
     //confirm 用户弹出选项框  防止用户误点退出按钮  返回值点击确定为true  取消false
     var isConfirm = confirm('您真的要退出吗');
     console.log(isConfirm);
     if (isConfirm) {
         //点击确认 调用退出接口 发送ajax请求
         $.ajax({
             type: 'post',
             url: '/logout',
             success: function() {
                 //退出成公 跳转登陆页面
                 location.href = 'login.html'
             },
             error: function() {
                 alert('退出失败')
             }
         });
     }
 });