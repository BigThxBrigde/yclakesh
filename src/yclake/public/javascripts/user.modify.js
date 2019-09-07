$(document).ready(function () {

  $('.selectpicker').selectpicker({
  });

  $('.selectpicker').val();
  $('.selectpicker').selectpicker('render');

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
    $('#errorHolder').html('');
    var userName = $('#users').find('option:selected').val();
    if (!userName) {
      $('#errorHolder').html('<div style="text-align:center" class="alert alert-danger">用户名不能为空</div>');
      return;
    }

    bootbox.confirm({
      title: '确认删除',
      message: '确定要删除用户' + userName + '吗?',
      buttons: {
        confirm: {
          label: "确定",
          className: 'btn-danger'
        },
        cancel: {
          label: "取消",
          className: 'btn-success'
        }
      },
      callback: function (result) {
        if (!result) return;
        $.ajax({
          type: 'POST',
          url: '/user/data/deleteData',
          data: {
            userName: userName
          },
          success: function (data) {
            bootbox.dialog({
              size: "small",
              title: data.success ? '删除成功' : '删除失败',
              message: '<p class="alert">' + data.message + '</p>',
              buttons: {
                success: {
                  label: '确定',
                  className: data.success ? 'btn-success' : 'btn-danger',
                  callback: function () {
                    $('#users').find('option:selected').remove();
                    $("#users").find('option:eq(1)').attr({
                      'selected': true
                    });
                    $('.selectpicker').selectpicker('refresh');
                  }
                }
              }
            });
          },
          error: function (xhr, status) {
            bootbox.dialog({
              size: "small",
              title: '删除失败',
              message: '<p class="alert">服务器内部错误</p>',
              buttons: {
                success: {
                  label: '确定',
                  className: 'btn-danger',
                  callback: function () {
                  }
                }
              }
            });
          }
        })
      }

    })
  })
})