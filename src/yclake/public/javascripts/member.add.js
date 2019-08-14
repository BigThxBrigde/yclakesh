$(document).ready(function () {
  var mask = new YCMask({
    id: '#loadingMask',
    html: '<p>正在上传图片</p>'
  });

  var fileUpload1 = new YCUpload({
    id: '#brandCert',
    renderTo: '#brandCertImage',
    placeholder: '请您上传您的商标认证',
    accept: 'image/jpeg',
    mask: mask
  });

  var fileUpload2 = new YCUpload({
    id: '#businessCert',
    renderTo: '#businessCertImage',
    placeholder: '请您上传您的营业执照',
    accept: 'image/jpeg',
    mask: mask
  });

  var fileUpload3 = new YCUpload({
    id: '#commCert',
    renderTo: '#commCertImage',
    placeholder: '请您上传您的商会认证',
    accept: 'image/jpeg',
    mask: mask
  });


  $('#addButton').click(function () {
    $('#errorHolder').html('');
    var name = $('#name').val();
    var telephone = $('#telephone').val();
    var data = [];

    if (!name) {
      $('#errorHolder').html('<div style="text-align:center" class="alert alert-danger">会员名字不能为空</div>');
      return;
    }
    if (telephone !== undefined && !/(^(\d{3,4}-)?\d{7,8})$|(13[0-9]{9})/.test(telephone)) {
      $('#errorHolder').html('<div style="text-align:center" class="alert alert-danger">请填写正确的手机号码或者固定电话号码区号请用-分割</div>');
      return;
    }

    data.push(fileUpload1.data)
    data.push(fileUpload2.data)
    data.push(fileUpload3.data)

    mask.setText('<p>正在添加会员</p>');
    mask.show();

    $.ajax({
      type: 'POST',
      url: '/member/data/add',
      data: {
        name: name,
        telephone: telephone,
        comment: $('#comment').val(),
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
                fileUpload1.clear();
                fileUpload2.clear();
                fileUpload3.clear();
                $('#telephone').val('');
                $('#comment').val('');
                $('#name').val('');
                mask.hide();
              }
            }
          }
        });

      },
      error: function (xhr, status) {
        bootbox.dialog({
          size: "small",
          title: "添加失败",
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