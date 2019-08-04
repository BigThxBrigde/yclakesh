var YCMask = function (options) {
  var _ = {};
  var container = $(options.id);
  container.html('');
  container.attr({
    'class': 'modal fade',
    'backdrop': 'static',
    'keyboard': 'false'
  });
  var html = '<div style="width: 200px;height:20px; z-index: 20000; position: absolute; text-align: center; left: 50%; top: 50%;margin-left:-100px;margin-top:-10px">'
    + '<div class="progress progress-striped active" style="margin-bottom: 0;">'
    + '<div class="progress-bar" style="width: 100%;"></div>'
    + '</div>'
    + '<h5 id="ycloadText" style="color:white"></h5>'
    + '</div>';
  container.html(html);
  var t = $('#ycloadText');
  t.html(options.html);

  $.extend(_, {
    container: container,
    showCallback: options.showCallback || function () { },
    hideCallback: options.hideCallback || function () { },
    show: function () {
      this.container.modal({ backdrop: 'static', keyboard: false });
      this.showCallback();
    },
    hide: function () {
      this.container.modal('hide');
      this.hideCallback();
    }
  });
  return _;
};