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

  var fileUpload4 = new YCUpload({
    id: '#logo',
    renderTo: '#logoImage',
    placeholder: '请上传您的logo',
    accept: 'image/jpeg',
    mask: mask
  });


  $('#addButton').click(function () {
    console.log('Click for adding member');
    $('#errorHolder').html('');
    var name = $('#name').val();
    var telephone = $('#telephone').val();

    if (!name) {
      $('#errorHolder').html('<div style="text-align:center" class="alert alert-danger">会员名字不能为空</div>');
      return;
    }
    if (telephone && !/(-|\+|\d)+/.test(telephone)) {
      $('#errorHolder').html('<div style="text-align:center" class="alert alert-danger">请填写正确的手机号码或者固定电话号码区号请用-分割</div>');
      return;
    }

    let data = {};
    if (!getUploadData('uploadImages', data, imagesUploader)
      || !getUploadData('uploadVideos', data, videosUploader)) {
      $('#errorHolder').html('<div style="text-align:center" class="alert alert-danger">请先添加图片或者视频</div>');
      return;
    }
    $.extend(data, {
      name: name,
      telephone: telephone,
      comment: $('#comment').val(),
      type: $('#type').find('option:selected').val(),
      extraInfo: $('#detailInfo').val() || '',
      data: [fileUpload1.data, fileUpload2.data, fileUpload3.data, fileUpload4.data]
    })
    mask.setText('<p>正在添加会员</p>');
    mask.show();

    $.ajax({
      type: 'POST',
      url: '/member/data/add',
      data: data,
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
                fileUpload4.clear();
                fileUpload1.reset();
                fileUpload2.reset();
                fileUpload3.reset();
                fileUpload4.reset();
                $('#telephone').val('');
                $('#comment').val('');
                $('#name').val('');
                clearAllUploadData();
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

  const imagesUploader = [];
  const __HTML_IMG = '<div class="form-group">'
    + '<label class="col-xs-2 control-label">添加图片</label>'
    + '<div class="col-xs-5">'
    + '<div style="float: left;width: 58%;border:none" class="form-control"></div>'
    + '<a id="uploadImagesBtn" class="btn-success form-control" style="float: left; width: 20%; margin-left: 10px; text-align:center;">新增</a>'
    + '</div>'
    + '</div>';
  const videosUploader = [];
  const __HTML_VID = '<div class="form-group">'
    + '<label class="col-xs-2 control-label">添加视频</label>'
    + '<div class="col-xs-5">'
    + '<div style="float: left;width: 58%;border:none" class="form-control"></div>'
    + '<a id="uploadVideosBtn" class="btn-success form-control" style="float: left; width: 20%; margin-left: 10px; text-align:center;">新增</a>'
    + '</div>'
    + '</div>'
    + '<script type="text/javascript" src="/javascripts/common-uploader.js" />';
  const __HTML_INFO = '<div class="form-group">'
    + '<label class="col-xs-2 control-label">简介</label>'
    + '<textarea id="detailInfo" class="col-xs-5" style="width:32.5%;height:100px;"/>'
    + '</div>';

  const initUploadImages = function () {
    imagesUploader.splice(imagesUploader, imagesUploader.length);
    $('#uploadImagesBtn').click(function () {
      new YCCommonUploader({
        id: '#extraImages',
        accept: 'image/gif, image/jpeg',
        mask: mask,
        collection: imagesUploader
      });
    });
  };
  const initUploadVideos = function () {
    videosUploader.splice(videosUploader, videosUploader.length);
    $('#uploadVideosBtn').click(function () {
      new YCCommonUploader({
        id: '#extraVideos',
        accept: 'video/mp4',
        mask: mask,
        collection: videosUploader
      });
    });
  };

  $('#type').change(function () {
    if ($('#type').val() == 0) {
      $('#extraImages').html(__HTML_IMG);
      $('#extraVideos').html(__HTML_VID);
      $('#extraInfo').html(__HTML_INFO);
      initUploadImages();
      initUploadVideos();
    } else {
      $('#extraImages').html('');
      $('#extraVideos').html('');
      $('#extraInfo').html('');
    }

  })

  let getUploadData = function (key, data, collection) {
    var result = [];
    for (let i = 0; i < collection.length; i++) {
      const e = collection[i];
      if (!e.data) {
        return false;
      }
      result.push(e.data)

    }
    var json = `{"${key}":"${result.join('|')}"}`;
    $.extend(data, JSON.parse(json));
    console.log(data);
    return true;
  }

  let clearAllUploadData = function () {
    let val = $('#type').val();
    $('#type').val(val === 0 ? 1 : 0);
    $('#type').val(val === 0 ? 0 : 1);
  }
})