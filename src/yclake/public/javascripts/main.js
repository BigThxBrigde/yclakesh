$(document).ready(function () {
    $('.treeview-menu a').each(function (i, e) {
        var url = $(e).attr('url');
        if (url) {
            $(e).click(function () {
                $.ajax({
                    type: 'POST',
                    url: url,
                    dataType: 'html',
                    success: function (data) {
                        $('#mainContent').html(data);
                    },
                    error: function (error) {

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

