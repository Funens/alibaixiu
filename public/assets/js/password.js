 $('#modifyForm').on('submit', function() {
     //获取用户输入的内容
     var formData = $(this).serialize();
     console.log(formData);



     //还需判断确认密码和新密码是否一致 一样才能发送ajax请求

     //调用接口 发送ajax请求
     $.ajax({
         url: '/users/password',
         type: 'put',
         data: formData,
         success: function() {
             location.href = '/admin/login.html'
         }
     });
     //阻止表单默认提交事件
     return false;
 })