$(document).ready(function () {
  $('#mainLink').click(function () {
    $('#headerImgPanel').show();
    $('#queryPanel').show();
    $('#navPanel').show();
    $('#companyIntro').hide();
    $('#someCerts').hide();
    $('#somePics').hide();
    $('#someVideos').hide();
    $('#mapPanel').show();
    $('#mainLink').hide();
  });

  $('#companyIntroBtn').click(function () {
    $('#headerImgPanel').hide();
    $('#queryPanel').hide();
    $('#navPanel').hide();
    $('#companyIntro').show();
    $('#someCerts').hide();
    $('#somePics').hide();
    $('#someVideos').hide();
    $('#mapPanel').hide();
    $('#mainLink').show();
  })

  $('#someVideosBtn').click(function () {
    $('#headerImgPanel').hide();
    $('#queryPanel').hide();
    $('#navPanel').hide();
    $('#companyIntro').hide();
    $('#someCerts').hide();
    $('#somePics').hide();
    $('#someVideos').show();
    $('#mapPanel').hide();
    $('#mainLink').show();
  })

  $('#somePicsBtn').click(function () {
    $('#headerImgPanel').hide();
    $('#queryPanel').hide();
    $('#navPanel').hide();
    $('#companyIntro').hide();
    $('#someCerts').hide();
    $('#somePics').show();
    $('#someVideos').hide();
    $('#mapPanel').hide();
    $('#mainLink').show();
  })

  $('#someCertsBtn').click(function () {
    $('#headerImgPanel').hide();
    $('#queryPanel').hide();
    $('#navPanel').hide();
    $('#companyIntro').hide();
    $('#someCerts').show();
    $('#somePics').hide();
    $('#someVideos').hide();
    $('#mapPanel').hide();
    $('#mainLink').show();
  })

  $('#companyIntro').hide();
  $('#someCerts').hide();
  $('#somePics').hide();
  $('#someVideos').hide();
  $('#mainLink').hide();
})