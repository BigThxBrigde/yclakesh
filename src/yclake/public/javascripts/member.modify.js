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
    mask: mask,
    callback: function () {
      $('#updateButton').attr({
        'disabled': false
      })
    }
  });

  var fileUpload2 = new YCUpload({
    id: '#businessCert',
    renderTo: '#businessCertImage',
    placeholder: '请您上传您的营业执照',
    accept: 'image/jpeg',
    mask: mask,
    callback: function () {
      $('#updateButton').attr({
        'disabled': false
      })
    }
  });

  var fileUpload3 = new YCUpload({
    id: '#commCert',
    renderTo: '#commCertImage',
    placeholder: '请您上传您的商会认证',
    accept: 'image/jpeg',
    mask: mask,
    callback: function () {
      $('#updateButton').attr({
        'disabled': false
      })
    }
  });

  var bindData = function (name) {
    if (!name) {
      return;
    }

    $.ajax({
      type: 'POST',
      url: '/member/data/find',
      data: {
        name: name
      },
      dataType: 'json',
      success: function (data) {
        if (data.success) {
          var r = data.data;
          if (r.telephone) {
            $('#telephone').val(r.telephone);
          }
          if (r.comment) {
            $('#comment').val(r.comment);
          }
          if (r.images[0]) {
            var html = '<img class="responsive" style="width:45%" src="' + r.images[0] + '"></img>';
            $('#brandCertImage').html(html);
          } else {
            $('#brandCertImage').html('');
          }
          if (r.images[1]) {
            var html = '<img class="responsive" style="width:45%" src="' + r.images[1] + '"></img>';
            $('#businessCertImage').html(html);
          } else {
            $('#businessCertImage').html('');
          }
          if (r.images[2]) {
            var html = '<img class="responsive" style="width:45%" src="' + r.images[2] + '"></img>';
            $('#commCertImage').html(html);
          } else {
            $('#commCertImage').html('');
          }

        } else {

          console.log('No data found');
        }
      },
      error: function (xhr, status) {
        bootbox.dialog({
          size: "small",
          title: "错误",
          message: '<p class="alert">服务器内部错误</p>',
          buttons: {
            success: {
              label: '确定',
              className: 'btn-danger'
            }
          }
        })
      }
    });
  }

  $('#telephone').change(function () {
    $('#updateButton').attr({
      'disabled': false
    })
  });

  // bind image
  bindData($('#members').find('option:selected').val());

  $('#members').change(function () {
    var name = $('#members').find('option:selected').val();
    fileUpload1.clear();
    fileUpload2.clear();
    fileUpload3.clear();
    if (name) {
      bindData(name);
    }
  });

  $('#updateButton').click(function () {
    if (!fileUpload1.data
      && !fileUpload2.data
      && !fileUpload3.data
      && !$('#telephone').val()
      && !$('#comment').val()) {
      bootbox.dialog({
        size: "small",
        title: "错误",
        message: '<p class="alert">数据无须更新</p>',
        buttons: {
          success: {
            label: '确定',
            className: 'btn-danger'
          }
        }
      })
      return;
    }
    var telephone = $('#telephone').val();
    if (telephone !== undefined && !/(^(\d{3,4}-)?\d{7,8})$|(13[0-9]{9})/.test(telephone)) {
      $('#errorHolder').html('<div style="text-align:center" class="alert alert-danger">请填写正确的手机号码或者固定电话号码区号请用-分割</div>');
      return;
    }
    mask.show();

    $.ajax({
      type: 'POST',
      url: '/member/data/updateData',
      data: {
        name: $('#members').find('option:selected').val(),
        telephone: telephone,
        data: [fileUpload1.data, fileUpload2.data, fileUpload3.data],
        comment: $('#comment').val()
      },
      dataType: 'json',
      success: function (data) {
        bootbox.dialog({
          size: "small",
          title: data.success ? '更新成功' : '更新失败',
          message: '<p class="alert">' + data.message + '</p>',
          buttons: {
            success: {
              label: '确定',
              className: data.success ? 'btn-success' : 'btn-danger',
              callback: function () {
                fileUpload1.reset();
                fileUpload2.reset();
                fileUpload3.reset();
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
          message: '<p class="alert">更新失败, 服务器内部错误</p>',
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
  })

  $('#deleteButton').click(function () {
    var name = $('#members').find('option:selected').val();
    if (!name) {
      return;
    }
    bootbox.confirm({
      title: '确认删除',
      message: '确定要删除会员' + name + '吗?',
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
          url: '/member/data/deleteData',
          data: {
            name: name
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
                    $('#members').find('option:selected').remove();
                    $("#members").find('option:eq(1)').attr({
                      'selected': true
                    });
                    bindData($('#members').find('option:selected').val());
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
                  className: 'btn-danger'
                }
              }
            });
          }
        })
      }

    })
  })

});