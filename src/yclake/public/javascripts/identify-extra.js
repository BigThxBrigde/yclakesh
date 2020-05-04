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
  })

  $('#companyIntro').hide();
  $('#someCerts').hide();
  $('#somePics').hide();
  $('#someVideos').hide();
})