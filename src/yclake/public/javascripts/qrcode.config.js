$(document).ready(function () {
  // truncate table
  $('#truncateButton').click(function () {
    $('#errorHolder').html('');
    bootbox.confirm({
      title: '确认清空',
      message: '确定要清空表数据吗?',
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
        
        var mask = new YCMask({
          id: '#loadingMask',
          html: '<p>正在为您清空表数据</p>'
        });
        mask.show();
        // truncate data
        $.ajax({
          type: 'POST',
          url: '/qrcode/data/truncateData',
          dataType: 'json',
          success: function (data) {
            if (data.success) {
              bootbox.dialog({
                size: "small",
                title: "清空成功",
                message: '成功为您清空表数据',
                buttons: {
                  success: {
                    label: '确定',
                    className: 'btn-success',
                    callback: function () {
                      $('.form-group input').each(function (i, e) {
                        $(e).attr('disabled', false);
                      });
                      $('.form-group button').each(function (i, e) {
                        $(e).attr('disabled', false);
                      });
                      $('#truncateButton').attr('disabled', true);
                      mask.hide();
                    }
                  }
                }
              });
            }
          },
          error: function (xhr, status) {
            console.log(status);
            bootbox.dialog({
              size: "small",
              title: "清空",
              message: '<p class="alert">清空表数据失败</p>',
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
      }
    });
  });

  $('#configButton').click(function () {
    $('#errorHolder').html('');
    var prefix = $('#serialIdPrefix').val();
    if (!prefix) {
      $('#errorHolder').html('<div style="text-align:center" class="alert alert-danger">前缀必填可以是两至三位的数字或者字母</div>');
      return;
    }
    var serialIdLengthVal = $('#serialIdLength').val() || 10;
    var codeLengthVal = $('#codeLength').val() || 10;
    if (!/^\d+$/.test(serialIdLengthVal) || !/^\d+$/.test(codeLengthVal)) {
      $('#errorHolder').html('<div style="text-align:center" class="alert alert-danger">长度必须为数字</div>');
      return;
    }
    var _serialIdLength = parseInt(serialIdLengthVal, 10),
      _codeLength = parseInt(codeLengthVal, 10);

    var mask = new YCMask({
      id: '#loadingMask',
      html: '<p>正在为您配置数据</p>'
    });
    mask.show();

    $.ajax({
      type: 'POST',
      url: '/qrcode/data/configData',
      data: {
        serialIdPrefix: prefix,
        serialIdLength: _serialIdLength,
        codeLength: _codeLength
      },
      dataType: 'json',
      success: function (data) {
        if (data.success) {
          bootbox.dialog({
            size: "small",
            title: "配置成功",
            message: '<p class="alert">已经成功为您更新配置</p>',
            buttons: {
              success: {
                label: '确定',
                className: 'btn-success',
                callback: function () {
                  $('#serialIdPrefix').val('');
                  $('#serialIdLength').val('');
                  $('#codeLength').val('')
                  mask.hide();
                }
              }
            }
          });
        }
      },
      error: function (xhr, status) {
        bootbox.dialog({
          size: "small",
          title: "配置失败",
          message: '<p class="alert">配置失败</p>',
          buttons: {
            success: {
              label: '确定',
              className: 'btn-danger',
              callback: function () {
                $('#serialIdPrefix').val('');
                $('#serialIdLength').val('');
                $('#codeLength').val('');
                mask.hide();
              }
            }
          }
        })
      }
    });
  });
});