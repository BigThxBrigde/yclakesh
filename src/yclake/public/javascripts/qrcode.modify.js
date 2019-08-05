$(document).ready(function () {
  // update value
  $('#updateButton').click(function () {
    $('#errorHolder').html('');

    var startVal = $('#start').val();
    var endVal = $('#end').val();
    if (!/^\d+$/.test(startVal) || !/^\d+$/.test(endVal)) {
      $('#errorHolder').html('<div style="text-align:center" class="alert alert-danger">必须填写开始和结束位置</div>');
      return;
    }
    var start = parseInt(startVal, 10), end = parseInt(endVal, 10);
    var member = $('#members').find('option:selected').val();
    if (member !== 'default') {
      var mask = new YCMask({
        id: '#loadingMask',
        html: '<p>正在为您更新' + (end - start + 1) + '条数据</p>'
      });
      mask.show();
      // update data
      $.ajax({
        type: 'POST',
        url: '/qrcode/data/updateMember',
        data: {
          start: start,
          end: end,
          member: member
        },
        dataType: 'json',
        success: function (data) {
          if (data.success) {
            bootbox.dialog({
              size: "small",
              title: "更新成功",
              message: '<p class="alert">已经为您更新了' + (end - start + 1) + '条数据</p>',
              buttons: {
                success: {
                  label: '确定',
                  className: 'btn-success',
                  callback: function () {
                    $('#start').val('');
                    $('#end').val('');
                    $('#members').val('default')
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
            title: "更新失败",
            message: '<p class="alert">更新数据失败</p>',
            buttons: {
              success: {
                label: '确定',
                className: 'btn-danger',
                callback: function () {
                  $('#start').val('');
                  $('#end').val('');
                  $('#members').val('default')
                  mask.hide();
                }
              }
            }
          })
        }
      });
    } else {
      $('#errorHolder').html('<div style="text-align:center" class="alert alert-danger">必须选择更新会员</div>');
    }
  });

  $('#deleteButton').click(function () {
    $('#errorHolder').html('');

    var startVal = $('#start').val();
    var endVal = $('#end').val();
    if (!/^\d+$/.test(startVal) || !/^\d+$/.test(endVal)) {
      $('#errorHolder').html('<div style="text-align:center" class="alert alert-danger">必须填写开始和结束位置</div>');
      return;
    }
    var start = parseInt(startVal, 10), end = parseInt(endVal, 10);

    var mask = new YCMask({
      id: '#loadingMask',
      html: '<p>正在为您删除' + (end - start + 1) + '条数据</p>'
    });
    mask.show();
    // update data
    $.ajax({
      type: 'POST',
      url: '/qrcode/data/deleteData',
      data: {
        start: start,
        end: end
      },
      dataType: 'json',
      success: function (data) {
        if (data.success) {
          bootbox.dialog({
            size: "small",
            title: "删除成功",
            message: '<p class="alert">已经为您删除了' + (end - start + 1) + '条数据</p>',
            buttons: {
              success: {
                label: '确定',
                className: 'btn-success',
                callback: function () {
                  $('#start').val('');
                  $('#end').val('');
                  $('#members').val('default')
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
          title: "删除失败",
          message: '<p class="alert">删除数据失败</p>',
          buttons: {
            success: {
              label: '确定',
              className: 'btn-danger',
              callback: function () {
                $('#start').val('');
                $('#end').val('');
                $('#members').val('default')
                mask.hide();
              }
            }
          }
        })
      }
    });

  });
});