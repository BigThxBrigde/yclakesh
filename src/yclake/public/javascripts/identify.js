(function () {
  if (document.getElementById('#result') === undefined) {
    return;
  }

  var texts = [];
  $('#result p').each(function (i, e) {
    texts.push($(e).text());
  });
  var ch = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  var text = texts.join('\n');
  var code = $('#code').text();
  var converted = [];
  $(code.split('')).each(function (i, e) {
    converted.push(ch[e])
  });
  text = text.replace(code, '*' + converted.join('') + '*');
  $.ajax({
    type: 'POST',
    url: '/tts/',
    data: {
      text: text
    },
    dataType: 'json',
    success: function (data) {
      if (data.success) {
        $('#audInfo').attr({
          'src': data.data,
          'autoplay': true,
          'preload': true
        });
        var play = function () {
          var audio = document.getElementById('audInfo');
          audio.play();
          document.removeEventListener('touchstart', play, false);
        };
        document.addEventListener('touchstart', play, false);
        document.addEventListener("WeixinJSBridgeReady", play, false);
        document.addEventListener('YixinJSBridgeReady', play, false);
      }
    },
    error: function (xhr, status) {
      console.log(status);
    }
  });
})();