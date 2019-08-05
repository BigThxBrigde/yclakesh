$(document).ready(function () {
  // update value
  $('#addButton').click(function () {
    $('#errorHolder').html('');

    var userName = $('#userName').val();
    var password = $('#password').val();
    if (!userName || !password) {
      $('#errorHolder').html('<div style="text-align:center" class="alert alert-danger">用户名和密码不能为空</div>');
      return;
    }
    if (!/^[a-zA-Z][0-9a-zA-Z_]{3,10}$/.test(userName)) {
      $('#errorHolder').html('<div style="text-align:center" class="alert alert-danger">用户名必须字母开头的3到10位的字符串(可以是字母数字下划线)</div>');
      return;
    }
    if (!/^[0-9a-zA-Z_]{5,16}$/.test(userName)) {
      $('#errorHolder').html('<div style="text-align:center" class="alert alert-danger">密码必须是5到16位字母数字下划线的组合</div>');
      return;
    }


    var mask = new YCMask({
      id: '#loadingMask',
      html: '<p>正在为您添加新用户</p>'
    });
    mask.show();
    // update data
    $.ajax({
      type: 'POST',
      url: '/user/data/add',
      data: {
        userName: userName,
        password: password
      },
      dataType: 'json',
      success: function (data) {

        bootbox.dialog({
          size: "small",
          title: data.success ? '添加成功' : '添加失败',
          message: '<p class="alert">' + data.message + '</p>',
          buttons: {
            success: {
              label: '确定',
              className: data.success ? 'btn-success' : 'btn-danger',
              callback: function () {
                $('#userName').val('');
                $('#password').val('');
                mask.hide();
              }
            }
          }
        });

      },
      error: function (xhr, status) {
        bootbox.dialog({
          size: "small",
          title: "更新失败",
          message: '<p class="alert">添加失败服务器内部错误</p>',
          buttons: {
            success: {
              label: '确定',
              className: 'btn-danger',
              callback: function () {
                $('#userName').val('');
                $('#password').val('');
                mask.hide();
              }
            }
          }
        })
      }
    });

  });
});