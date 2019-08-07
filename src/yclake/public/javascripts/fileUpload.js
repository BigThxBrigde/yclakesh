var YCUpload = function (options) {
  var MAX_SIZE = 2 * 1024 * 1024
  var _ = {}
  var container = $(options.id);
  var renderTo = $(options.renderTo);
  var placeholder = options.placeholder || '';
  var accept = options.accept;
  var mask = options.mask;
  var callback = options.callback || function () { }
  var file = null;
  var innerHtml = '<input class="form-control" id="ycUploadText" disabled type="text" placeholder="' + placeholder + '" style="float: left;width: 73%">'
    + ' <a class="btn-success form-control" id="ycBrowseBtn" style="float: left; width: 20%; margin-left: 10px; text-algin"center>浏览</a>'
    + '<input class="form-control" id="ycUploadFile" type="file" accept="' + accept + '" style="display: none"></div>';

  container.html(innerHtml);

  $.extend(_, {
    clear: function () {
      $('#ycUploadText').val('');
      $('#ycUploadFile').val('');
      if (options.renderTo) {
        $(options.renderTo).html('');
      }
    }
  })

  $('#ycUploadFile').change(function () {
    file = $('#ycUploadFile')[0].files[0];
    if (!file || file.size > MAX_SIZE) {
      bootbox.dialog({
        size: "small",
        title: '上传失败',
        message: '<p class="alert">图片不能超过2M</p>',
        buttons: {
          success: {
            label: '确定',
            className: 'btn-danger',
            callback: function () {
              $('#ycUploadText').val('');
            }
          }
        }
      });
      return;
    }

    $('#ycUploadText').val(file.name);

    if (window.FileReader) {

      var reader = new FileReader();

      if (options.renderTo && file) {
        if (mask) {
          mask.show();
        }


       
        reader.onload = function () {

          $.extend(_, {
            container: container,
            renderTo: renderTo,
            settings: options,
            mask, mask,
            file: file,
            data: reader.result.replace('data:image/jpeg;base64,','')
          });

          var html = '<img class="responsive" style="width:85%" src="' + reader.result + '"></img>';
          renderTo.html(html);
          mask.hide();
          callback();
        }
        reader.readAsDataURL(file);

      }
    } else {
      bootbox.dialog({
        size: "small",
        title: '错误',
        message: '浏览器支持',
        buttons: {
          success: {
            label: '确定',
            className: 'btn-danger'
          }
        }
      });
    }
  });

  $('#ycBrowseBtn').click(function () {
    $('#ycUploadFile').click();
  });

  return _;

}