$(document).ready(function () {

    $('#submitButton').click(function () {
        var name = $('#name').val(), password = $('#password').val();
        if (name == '' || password == '') {
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
            error: function (error) {
                $('#errorHolder').html('<div class="alert alert-danger" role="alert">用户名或者密码错误</div>');
            }
        });
    });


    // $.ajax({
    //     type:'POST',
    //     url:'/',
    //     data: {

    //     },
    //     dataType:'json',
    //     success:function(result){
    //         if(result.success){
    //             var data = result.data,
    //                 length = data.length,
    //                 sources = {'PTH':[],'SMD':[],'FCT':[],'HUM':[]};

    //             for(var i=0;i<length;i++){
    //                 sources[data[i].tag].push(data[i].value);
    //             }

    //             $('#content').find('input.ui-autocomplete-input').each(function(i,e){
    //                 var _e = $(e),
    //                     line = _e.parent().prev().prev().text().substr(0,3);

    //                 _e.autocomplete({
    //                     minLength: 0,
    //                     scrollHeight:220,
    //                     source:sources[line]
    //                 }).focus(function(e) {
    //                     $(_e).autocomplete('search', '');
    //                 });
    //             });
    //         }

    //     },
    //     error:function(data){
    //         report.ui.alert('服务器内部错误，请查看日志<br/>'+data.responseText);
    //     }
    // })
});