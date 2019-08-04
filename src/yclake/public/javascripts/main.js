$(document).ready(function () {
    $('.treeview-menu a').each(function (i, e) {
        var url = $(e).attr('url');
        if (url) {
            $(e).click(function () {

                $('.treeview-menu li').each(function (i, _e) {
                    $(_e).removeClass('active')
                })
                $(e).parent().addClass('active')
                $.ajax({
                    type: 'POST',
                    url: url,
                    dataType: 'html',
                    success: function (data) {
                        $('#mainContent').html(data);
                    },
                    error: function (error) {
                        $('#mainContent').html('加载错误')
                    }
                });
            });
        }
    });

    $('#logoutButton').click(function () {
        $.ajax({
            type: 'POST',
            url: '/logout',
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    window.location.href = '/login';
                }
            }
        });
    });
});

