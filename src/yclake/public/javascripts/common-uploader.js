if (!window.__COMMON_UPLOADER_ID &&
  !window.YCCommonUploader) {
  var __COMMON_UPLOADER_ID = __COMMON_UPLOADER_ID || 0;

  var YCCommonUploader = YCCommonUploader || function (options) {
    var MAX_SIZE = 2 * 1024 * 1024;
    var _ = {};
    var container = $(options.id);
    var accept = options.accept;
    var mask = options.mask;
    var callback = options.callback || function () { }
    var file = null;
    var id = ++__COMMON_UPLOADER_ID;
    var _uploaders = options.collection || [];
    var innerHtml = '<div class="form-group" id="cmUploader' + id + '">'
      + '<label class="col-xs-2 control-label">文件</label>'
      + '<div class="col-xs-6">'
      + '<input class="form-control" id="cmUploadText' + id + '" disabled type="text" style="float: left;width: 38%"/>'
      + ' <a class="btn-success form-control" id="cmBrowse' + id + '" style="float: left; width: 12%; margin-left: 10px; text-align:center;">浏览</a>'
      + ' <a class="btn-success form-control" id="cmDelete' + id + '" style="float: left; width: 12%; margin-left: 10px; text-align:center;">删除</a>'
      + '<input class="form-control" id="cmUploadFile' + id + '" type="file" accept="' + accept + '" style="display: none"/></div>';
    + '</div>';

    container.append(innerHtml);
    _uploaders.push(_);
    console.log(_uploaders);
    $('#cmUploadFile' + id + '').change(function () {
      file = $('#cmUploadFile' + id + '')[0].files[0];
      if (!file || file.size > MAX_SIZE) {
        bootbox.dialog({
          size: "small",
          title: '上传失败',
          message: '<p class="alert">文件不能超过2M</p>',
          buttons: {
            success: {
              label: '确定',
              className: 'btn-danger',
              callback: function () {
                $('#cmUploadText' + id + '').val('');
              }
            }
          }
        });
        return;
      }

      $('#cmUploadText' + id + '').val(file.name);

      if (window.FileReader) {

        var reader = new FileReader();

        if (file) {
          if (mask) {
            mask.show();
          }
          reader.onload = function () {

            $.extend(_, {
              container: container,
              settings: options,
              mask, mask,
              file: file,
              data: reader.result
            });
            mask.hide();
            console.log(_.data);
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

    $('#cmBrowse' + id + '').click(function () {
      $('#cmUploadFile' + id + '').click();
    });

    $('#cmDelete' + id + '').click(function () {
      _uploaders.splice($.inArray(_, _uploaders), 1);
      $('#cmUploader' + id + '').remove();
      console.log(_uploaders);
    });

    return _;

  }
  window.__COMMON_UPLOADER_ID = __COMMON_UPLOADER_ID;
  window.YCCommonUploader = YCCommonUploader;
}