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
