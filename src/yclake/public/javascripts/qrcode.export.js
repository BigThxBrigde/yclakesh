$(document).ready(function () {
  $('#exportButton').click(function () {
    $('#errorHolder').html('');
    var startVal = $('#start').val();
    var endVal = $('#end').val();
    if (!/^\d+$/.test(startVal) || !/^\d+$/.test(endVal)) {
      $('#errorHolder').html('<div style="text-align:center" class="alert alert-danger">必须填写开始和结束位置</div>');
      return;
    }
    var start = parseInt(startVal, 10), end = parseInt(endVal, 10);
    var member = $('#members').find('option:selected').val();
    
    var exportData = function () {
      window.location.href = '/qrcode/data/exportData/?start=' + start + '&end=' + end;
    };
    if (member) {
      var mask = new YCMask({
        id: '#loadingMask',
        html: '<p>正在为您更新' + (end - start + 1) + '条数据</p>'
      });
      mask.show();
      $.ajax({
        type: 'POST',
        url: '/qrcode/data/updateMember',
        data: {
          start: start,
          end: end,
          member: member === 'default' ? '' : member
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
                    exportData();
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
      exportData();
    }
  });
});