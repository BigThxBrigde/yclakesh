$(document).ready(function () {
    $('#generateButton').click(function () {
        $('#errorHolder').html('');
        var count = $('#generateCount').val();
        if (!/^\d+$/.test(count)) {
            $('#errorHolder').html('<div style="text-align:center" class="alert alert-danger">生成个数必须为正确的数字</div>');
            return;
        }
        var num = parseInt(count, 10);
        var member = $('#members').find('option:selected').val()

        var mask = new YCMask({
            id: '#loadingMask',
            html: '<p>正在为您生成' + num + '条数据</p>'
        });
        mask.show();
        $.ajax({
            type: 'POST',
            url: '/qrcode/data/generate',
            data: {
                count: num,
                member: member === 'default' ? '' : member
            },
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    bootbox.dialog({
                        size: "small",
                        title: "生成成功",
                        message: '<p class="alert">已经为您生成' + num + '条数据</p>',
                        buttons: {
                            success: {
                                label: '确定',
                                className: 'btn-success',
                                callback: function () {
                                    $('#generateCount').val('');
                                    $('#startID').val(data.nextSerialId);
                                    $('#members').val('default')
                                    mask.hide();
                                }
                            }
                        }
                    });
                }
            },
            error: function (xhr, status) {
                console.log(status);
                bootbox.dialog({
                    size: "small",
                    title: "生成失败",
                    message: '<p class="alert">生成' + num + '条数据失败</p>',
                    buttons: {
                        success: {
                            label: '确定',
                            className: 'btn-danger',
                            callback: function () {
                                $('#generateCount').val('');
                                $('#members').val('default')
                                mask.hide();
                            }
                        }
                    }
                })
            }
        });
    });
});
