$(function () {
//Add Sections

    $(".newsletter-builder-area-center-frame-buttons-content-tab").hover(
            function () {
                $(this).append('<div class="newsletter-builder-area-center-frame-buttons-content-tab-add"><i title="Insert" class="fa fa-plus"></i>&nbsp;Insert</div>');
                $('.newsletter-builder-area-center-frame-buttons-content-tab-add').click(function () {

                    $("#newsletter-builder-area-center-frame-content").prepend($("#newsletter-preloaded-rows .sim-row[data-id='" + $(this).parent().attr("data-id") + "']").clone());
                    hover_edit();
                    perform_delete();
                    $("#newsletter-builder-area-center-frame-buttons-dropdown").fadeOut(200);
                })
            }, function () {
        $(this).children(".newsletter-builder-area-center-frame-buttons-content-tab-add").remove();
    });

    function hover_edit() {


        $(".sim-row-edit").hover(
                function () {
                    $(this).append('<div class="sim-row-edit-hover"><i class="fa fa-pencil" style="line-height:30px;"></i></div>');
                    $(".sim-row-edit-hover").click(function (e) {
                        e.preventDefault()
                    })
                    $(".sim-row-edit-hover i").click(function (e) {
                        e.preventDefault();
                        big_parent = $(this).parent().parent();

                        if (big_parent.attr("data-type") == 'image') {
                            $('#image_change').val('');
                            //$("#sim-edit-image .image").val(big_parent.children('img').attr("src"));
                            $("#sim-edit-image").fadeIn(500);
                            $("#sim-edit-image .sim-edit-box").slideDown(500);

                            $("#sim-edit-image .sim-edit-box-buttons-save").click(function (e) {
                                e.preventDefault();
                                var form = $('#upload_image_form')[0];
                                var formData = new FormData(form);
                                dhs = $(this);
                                $.ajax({
                                    type: 'POST',
                                    url: dissertation_url,
                                    data: formData,
                                    cache: false,
                                    contentType: false,
                                    processData: false,
                                    success: function (htm) {
                                        htm = htm.replace(/\\/g, "");
                                        htm = JSON.parse(htm);
                                        big_parent.children('img').attr("src", htm.url);
                                        $("#sim-edit-image").fadeOut(500)
                                        $("#sim-edit-image .sim-edit-box").slideUp(500)
                                    },
                                    error: function (data) {
                                        $("#sim-edit-image").fadeOut(500)
                                        $("#sim-edit-image .sim-edit-box").slideUp(500)
                                    }
                                });
                            });

                        }


                        if (big_parent.attr("data-type") == 'title') {

                            $("#sim-edit-title .title").val(big_parent.text());
                            $("#sim-edit-title").fadeIn(500);
                            $("#sim-edit-title .sim-edit-box").slideDown(500);

                            $("#sim-edit-title .sim-edit-box-buttons-save").click(function () {
                                $(this).parent().parent().parent().fadeOut(500)
                                $(this).parent().parent().slideUp(500)

                                big_parent.text($("#sim-edit-title .title").val());

                            });

                        }

                        //edit text
                        if (big_parent.attr("data-type") == 'text') {

                            CKEDITOR.instances['editor'].setData(big_parent.html());
                            //$("#sim-edit-text .text").val(big_parent.text());
                            $("#sim-edit-text").fadeIn(500);
                            $("#sim-edit-text .sim-edit-box").slideDown(500);

                            $("#sim-edit-text .sim-edit-box-buttons-save").click(function () {
                                $(this).parent().parent().parent().fadeOut(500)
                                $(this).parent().parent().slideUp(500)

                                //big_parent.text($("#sim-edit-text .text").val());
                                big_parent.html(CKEDITOR.instances['editor'].getData());

                            });

                        }
                    });
                }, function () {
            $(this).children(".sim-row-edit-hover").remove();
        }
        );
    }
    hover_edit();






    $(".drag-image").hover(
            function () {
                id_ins = $(this).data('cid');
                $(this).append('<div class="sim-row-insert-hover"><i class="fa fa-plus" style="line-height:30px;"></i></div>');
                $(".sim-row-insert-hover").click(function (e) {
                    e.preventDefault();
                    if (typeof id_ins !== 'undefined')
                    {
                        $('#newsletter-builder-area-center-frame-content').append('<div class="sim-row ui-draggable">' + $("#newsletter-preloaded-rows").find("[data-id='" + id_ins + "']").html() + '<div class="sim-row-delete"><i class="fa fa-times" ></i></div><div class="sim-row-sort"><i class="fa fa-bars" ></i></div></div>');
                        hover_edit();
                        $("html, body").delay(500).animate({scrollTop: $(document).height() - $(window).height()});
                    }
                });
            }, function () {
        $(this).children(".sim-row-insert-hover").remove();
    });

//close edit
    $(".sim-edit-box-buttons-cancel").click(function () {
        $(this).parent().parent().parent().fadeOut(500)
        $(this).parent().parent().slideUp(500)
    });

    $(".sim-edit-box-buttons-cancel-image").click(function () {
        $("#sim-edit-image").fadeOut(500);
        $("#sim-edit-image .sim-edit-box").slideUp(500);
    });

    $("#newsletter-builder-area-center-frame-content").sortable({
        axis: 'y',
        revert: true,
        handle: '.sim-row-sort',
        change: function (event, ui) {
            ui.placeholder.css({visibility: 'visible', border: '2px solid grey'});
        }
    });


    $(document).on('click', '.sim-row-delete', function () {
        $(this).parent('.sim-row').remove();
    });


    $("#newsletter-builder-sidebar-buttons-abutton").click(function () {

        $("#newsletter-preloaded-export").html($("#newsletter-builder-area-center-frame-content").html());
        $("#newsletter-preloaded-export .sim-row-delete").remove();
        $("#newsletter-preloaded-export .sim-row").removeClass("ui-draggable");
        $("#newsletter-preloaded-export .sim-row-edit").removeAttr("data-type");
        $("#newsletter-preloaded-export .sim-row-edit").removeClass("sim-row-edit");

        export_content = $("#newsletter-preloaded-export").html();

        $("#export-textarea").val(export_content)
        $("#export-form").submit();
        $("#export-textarea").val(' ');

    });


    $("#newsletter-builder-sidebar-buttons-bbutton").click(function () {

        $("#sim-edit-export").fadeIn(500);
        $("#sim-edit-export .sim-edit-box").slideDown(500);

        $("#newsletter-preloaded-export").html($("#newsletter-builder-area-center-frame-content").html());
        $("#newsletter-preloaded-export .sim-row-delete").remove();
        $("#newsletter-preloaded-export .sim-row").removeClass("ui-draggable");
        $("#newsletter-preloaded-export .sim-row-edit").removeAttr("data-type");
        $("#newsletter-preloaded-export .sim-row-edit").removeClass("sim-row-edit");

        preload_export_html = $("#newsletter-preloaded-export").html();
        $.ajax({
            url: "_css/newsletter.css"
        }).done(function (data) {
            export_content = preload_export_html;
            $("#sim-edit-export .text").val(export_content);
        });

        $("#newsletter-preloaded-export").html(' ');
    });


    $('#image_change').bind('change', function (e) {
        var img_size = this.files[0].size / 1024;
        if (img_size > 200)
        {
            alert('Max image size allowed is 200KB');
            e.preventDefault;
            $(this).val('');
            return false;
        }
    });
});