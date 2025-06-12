var projects = {
    showDialog: function (msg) {
        var dialog1 = $("#dialog-msg").dialog(
            {
                autoOpen: false,
                height: 150,
                width: 300,
                modal: true,
                buttons: {
                    "Ok": function () {
                        dialog1.dialog("close");
                    }
                },
                open: function () {
                    var markup = msg;
                    $(this).html(markup);
                }
            }
        );
        dialog1.dialog("open");
    },
    changeYear1: function (year) {
        $('.cs-placeholder').css('font-size', '33px');
        $('.cs-placeholder').css('margin-top', '-1px');
        if (year == 'all') {
            $('.cs-placeholder').css('font-size', '20px');
            $('.cs-placeholder').css('margin-top', '4px');
            $('.cs-placeholder').css('margin-bottom', '-4px');
        }
        $.ajax(
            {
                url: js_base_2 + "change-year",
                type: "post",
                data: {new_year: year},
                success: function (response) {
                    var new_url = js_base_2;
                    //                var chk = js_base.substring(0, js_base.length - 1);
                    //                var chk1 = chk.slice(-6);
                    //                alert(chk);
                    //                alert(chk1);
                    //                return false;
                    //                if (chk1 == parseInt(chk1))
                    //                {
                    //                    new_url = js_base.substring(0, js_base.length - 7);
                    //                }
                    //                var year_arr = year.split('-');
                    //                if (year != 'all')
                    //                {
                    var year_arr = year.split('-');
                    new_url = new_url + year_arr[1] + '/' + year_arr[0] + '/';
                    //   }
                    //curr_url = curr_url.replace(js_base, js_base + year + '/');
                    window.location = new_url;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                }
            }
        );
    },
    showCustomError: function (err, er_type) {
        if (typeof er_type !== 'undefined' && er_type !== '') {
            if (er_type == 'error') {
                $('.alert').removeClass('alert-warning');
                $('.alert').addClass('alert-danger');
            }
            if (er_type == 'info') {
                $('.alert').removeClass('alert-warning');
                $('.alert').addClass('alert-info');
            }
            if (er_type == 'success') {
                $('.alert').removeClass('alert-warning');
                $('.alert').addClass('alert-success');
            }
        } else
        {
            $('.alert').removeClass('alert-danger');
            $('.alert').removeClass('alert-info');
            $('.alert').removeClass('alert-success');
            $('.alert').removeClass('alert-warning');
            $('.alert').addClass('alert-warning');
        }
        $('#alert_text').html(err);
        $('.alert-msg').show();
        $('.alert').show();
        $('.alert-msg').delay(2000).fadeOut(500);
    },
    get_youtube_thumbnail: function (url) {
        var youtube_video_id = '';
        if (url.indexOf('youtube.com') > -1) {
            youtube_video_id = url.split('v=')[1].split('&')[0];
        } else if (url.indexOf('youtu.be') > -1) {
            youtube_video_id = url.split('/')[1];
        }

        if (youtube_video_id.length == 11) {
            return "http://img.youtube.com/vi/" + youtube_video_id + "/0.jpg";
        } else {
            return '';
        }
    }

}

