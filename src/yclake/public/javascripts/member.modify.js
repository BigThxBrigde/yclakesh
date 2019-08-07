$(document).ready(function () {

  var fileUpload = new YCUpload({
    id: '#cert',
    renderTo: '#certImage',
    placeholder: '请您上传您的证书',
    accept: 'image/jpeg',
    mask: new YCMask({
      id: '#loadingMask',
      html: '<p>正在上传图片</p>'
    }),
    callback: function () {
      $('#updateButton').attr({
        'disabled': false
      })
    }
  });

  var bindImage = function (name) {
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
          var html = '<img class="responsive" style="width:85%" src="' + data.data + '"></img>';
          $('#certImage').html(html);
        } else {
          $('#certImage').html('');
          console.log('No certification found');
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

  // bind image
  bindImage($('#members').find('option:selected').val());

  $('#members').change(function () {
    var name = $('#members').find('option:selected').val();
    fileUpload.reset();
    if (name) {
      bindImage(name);
    }
  });

  $('#updateButton').click(function () {
    if (!fileUpload.data) {
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
    var mask = fileUpload.mask;
    mask.show();

    $.ajax({
      type: 'POST',
      url: '/member/data/updateData',
      data: {
        name: $('#members').find('option:selected').val(),
        data: fileUpload.data
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
                fileUpload.reset();
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
                    bindImage($('#members').find('option:selected').val());
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