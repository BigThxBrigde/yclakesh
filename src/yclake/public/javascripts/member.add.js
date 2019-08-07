$(document).ready(function () {
  var fileUpload = new YCUpload({
    id: '#cert',
    renderTo: '#certImage',
    placeholder: '请您上传您的证书',
    accept: 'image/jpeg',
    mask: new YCMask({
      id: '#loadingMask',
      html: '<p>正在上传图片</p>'
    })
  });

  $('#addButton').click(function () {
    $('#errorHolder').html('');
    var name = $('#name').val();
    var data = fileUpload.data;
    var mask = fileUpload.mask;
    if (!name) {
      $('#errorHolder').html('<div style="text-align:center" class="alert alert-danger">会员名字不能为空</div>');
      return;
    }

    mask.setText('<p>正在添加会员</p>');
    mask.show();

    $.ajax({
      type: 'POST',
      url: '/member/data/add',
      data: {
        name: name,
        data: data
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
                fileUpload.clear();
                $('#name').val()
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
          message: '<p class="alert">添加失败, 服务器内部错误</p>',
          buttons: {
            success: {
              label: '确定',
              className: 'btn-danger',
              callback: function () {
                mask.hide();
              }
            }
          }
        })
      }
    });

  });
})