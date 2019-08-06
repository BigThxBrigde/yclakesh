$(document).ready(function () {
  $('#updateButton').click(function () {
    $('#errorHolder').html('');
    var userName = $('#users').find('option:selected').val();
    var password = $('#password').val();
    if (!userName || !password) {
      $('#errorHolder').html('<div style="text-align:center" class="alert alert-danger">用户名和密码不能为空</div>');
      return;
    }

    $.ajax({
      type: 'POST',
      url: '/user/data/updateData',
      data: {
        userName: userName,
        password: password
      },
      success: function (data) {
        bootbox.dialog({
          size: "small",
          title: data.success ? '修改成功' : '修改失败',
          message: '<p class="alert">' + data.message + '</p>',
          buttons: {
            success: {
              label: '确定',
              className: data.success ? 'btn-success' : 'btn-danger',
              callback: function () {
                $('#password').val('');
              }
            }
          }
        });
      },
      error: function (xhr, status) {
        bootbox.dialog({
          size: "small",
          title: '修改失败',
          message: '<p class="alert">服务器内部错误</p>',
          buttons: {
            success: {
              label: '确定',
              className: 'btn-danger',
              callback: function () {
                $('#password').val('');
              }
            }
          }
        });
      }
    })

  })

  $('#deleteButton').click(function () {
  })
})