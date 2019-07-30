$(document).ready(function () {

    $('#submitButton').click(function () {
        var name = $('#name').val(), password = $('#password').val();
        if (name == '' || password == '') {
            $('#errorHolder').html('<div style="text-align:center" class="alert alert-danger">用户名或者密码不能为空</div>');
            return;
        }
        $.ajax({
            type: 'POST',
            url: '/login',
            data: {
                name: name,
                password: password
            },
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    window.location.href = '/admin';
                } else {
                    $('#errorHolder').html('<div style="text-align:center" class="alert alert-danger">用户名或者密码错误</div>');
                }
            },
            error: function (error) {
                $('#errorHolder').html('<div style="text-align:center" class="alert alert-danger">服务器内部错误</div>');
            }
        });
    });
});