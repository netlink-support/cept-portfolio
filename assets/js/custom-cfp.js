$(document).ready(
    function () {

        //Example 2
        $("#filer_input2").filer(
            {
                limit: visual_limit,
                maxSize: null,
                extensions: ['jpg', 'png', 'jpeg', 'gif'],
                changeInput: '<div class="jFiler-input-dragDrop"><div class="jFiler-input-inner"><div class="jFiler-input-icon"><i class="icon-jfi-cloud-up-o"></i></div><div class="jFiler-input-text"><h3>Drag & Drop images here</h3> <span style="display:inline-block; margin: 15px 0">or</span></div><a class="jFiler-input-choose-btn blue">Browse Images</a></div></div>',
                showThumbs: true,
                theme: "dragdropbox",
                templates: {
                    box: '<ul class="jFiler-items-list jFiler-items-grid row" id="sortable"></ul>',
                    item: '<li class="jFiler-item col-lg-3 col-md-4 col-sm-4 col-xs-6 col-xxs-12">\
						<div class="jFiler-item-container">\
							<div class="jFiler-item-inner">\
								<div class="jFiler-item-thumb">\
									<div class="jFiler-item-status"></div>\
									<div class="jFiler-item-thumb-overlay">\
										<div class="jFiler-item-info">\
											<div style="display:table-cell;vertical-align: middle;">\
												<span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name}}</b></span>\
												<span class="jFiler-item-others">{{fi-size2}}</span>\
											</div>\
										</div>\
									</div>\
									{{fi-image}}\
								</div>\
								<div class="jFiler-item-assets jFiler-row">\
									<ul class="list-inline pull-left">\
										<li>{{fi-progressBar}}</li>\
									</ul>\
									<ul class="list-inline pull-right">\
										<li><a class="fa fa-trash-o jFiler-item-trash-action"></a></li>\
									</ul>\
								</div>\
								<div class="jFiler-item-text">\
									\
								</div>\
							</div>\
						</div>\
					</li>',
                    itemAppend: '<li class="jFiler-item col-lg-3 col-md-4 col-sm-4 col-xs-6 col-xxs-12">\
						<div class="jFiler-item-container">\
							<div class="jFiler-item-inner">\
								<div class="jFiler-item-thumb">\
									<div class="jFiler-item-status"></div>\
									<div class="jFiler-item-thumb-overlay">\
										<div class="jFiler-item-info">\
											<div style="display:table-cell;vertical-align: middle;">\
												<span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name}}</b></span>\
												<span class="jFiler-item-others">{{fi-size2}}</span>\
											</div>\
										</div>\
									</div>\
									{{fi-image}}\
								</div>\
								<div class="jFiler-item-assets jFiler-row">\
									<ul class="list-inline pull-left">\
										<li>{{fi-progressBar}}</li>\
									</ul>\
									<ul class="list-inline pull-right">\
										<li><a class="fa fa-trash-o jFiler-item-trash-action"></a></li>\
									</ul>\
								</div>\
								<div class="jFiler-item-text">\
									<textarea placeholder="Image caption" name="caption_{{fi-intval}}" id="caption_{{fi-intval}}" rows="2" width="100%">{{fi-caption}}</textarea>\
                                                                        {{fi-groupwork}}&nbsp;<label style="display:none" for="group_work_{{fi-intval}}">Part of group excercise</label><br/>\
                                                                        {{fi-reftextbox}}\
                                                                        <input type="hidden" name="visual_image_{{fi-intval}}" value="{{fi-name}}" id="visual_image_{{fi-intval}}"  />\
                                                                        <input type="hidden" class="pos_text" value="" name="visual_position_{{fi-intval}}" id="visual_position_{{fi-intval}}"  />\
								</div>\
							</div>\
						</div>\
					</li>',
                    //itemAppend: null,
                    progressBar: '<div class="bar"></div>',
                    itemAppendToEnd: true,
                    canvasImage: false,
                    removeConfirmation: true,
                    _selectors: {
                        list: '.jFiler-items-list',
                        item: '.jFiler-item',
                        progressBar: '.bar',
                        remove: '.jFiler-item-trash-action'
                    }
                },
                dragDrop: {
                    dragEnter: null,
                    dragLeave: null,
                    drop: null,
                    dragContainer: null,
                },
                uploadFile: {
                    url: visual_url,
                    data: null,
                    type: 'POST',
                    enctype: 'multipart/form-data',
                    synchron: true,
                    beforeSend: function () {
                        //alert('start');

                    },
                    success: function (data, itemEl, listEl, boxEl, newInputEl, inputEl, id) {

                        var dt = JSON.parse(data);
                        if (dt.type == 'error') {
                            var parent = itemEl.find(".jFiler-jProgressBar").parent(),
                            new_file_name = JSON.parse(data),
                            filerKit = inputEl.prop("jFiler");
                            filerKit.files_list[id].name = new_file_name;
                            itemEl.find(".jFiler-jProgressBar").fadeOut(
                                "slow", function () {
                                    $("<div class=\"jFiler-item-others text-error\"><i class=\"icon-jfi-check-circle\"></i> " + dt.msg + "</div>").hide().appendTo(parent).fadeIn("slow");
                                }
                            );

                        } else
                        {
                            var parent = itemEl.find(".jFiler-jProgressBar").parent(),
                            new_file_name = JSON.parse(data),
                            filerKit = inputEl.prop("jFiler");
                            filerKit.files_list[id].name = new_file_name;
                            itemEl.find(".jFiler-jProgressBar").fadeOut(
                                "slow", function () {
                                    $("<div class=\"jFiler-item-others text-success\"><i class=\"icon-jfi-check-circle\"></i> Success</div>").hide().appendTo(parent).fadeIn("slow");
                                }
                            );
                            $("#sortable").sortable(
                                {
                                    revert: true,
                                    connectWith: ".jFiler-item",
                                    start: function (e, ui) {
                                        $(this).attr('data-previndex', ui.item.index());
                                    },
                                    stop: function (event, ui) {
                                        var oldIndex = $(this).attr('data-previndex');
                                        var newIndex = $(this).data("ui-sortable").currentItem.index();
                                        var new_pos = parseInt(newIndex) + parseInt(1);
                                        var old_pos = parseInt(oldIndex) + parseInt(1);
                                        //var current_pos = $(this).data("ui-sortable").currentItem.find('.pos_text').val();
                                        if (old_pos > new_pos) {
                                            $.each(
                                                $('#sortable .jFiler-item'), function () {
                                                    var this_pos = $(this).find('.pos_text').val();

                                                    if (this_pos >= new_pos && this_pos < old_pos) {
                                                        this_pos = parseInt(this_pos) + parseInt(1);
                                                        $(this).find('.pos_text').val(this_pos);
                                                        //$(this).find('textarea').html(this_pos);
                                                    }

                                                }
                                            );
                                        } else if (new_pos >= old_pos) {
                                            $.each(
                                                $('#sortable .jFiler-item'), function () {
                                                    var this_pos = $(this).find('.pos_text').val();

                                                    if (this_pos <= new_pos && this_pos > old_pos) {
                                                        this_pos = parseInt(this_pos) - parseInt(1);
                                                        $(this).find('.pos_text').val(this_pos);
                                                        //$(this).find('textarea').html(this_pos);
                                                    }

                                                }
                                            );
                                        }
                                        $(this).data("ui-sortable").currentItem.find('.pos_text').val(new_pos);
                                        //$(this).data("ui-sortable").currentItem.find('textarea').html(new_pos);
                                        $(this).removeAttr('data-previndex');
                                    }
                                }
                            );
                            //$("#sortable").disableSelection();
                            total_visuals++;
                            $('#total_visuals').val(total_visuals);
                            //itemEl.find(".jFiler-item-text").append('<textarea required="required" name="caption_' + total_visuals + '" id="caption_' + total_visuals + '" rows="2" type="text" width="100%"></textarea><input type="hidden" name="visual_image_' + total_visuals + '" value="' + new_file_name + '" id="visual_image_' + total_visuals + '"  /><input class="pos_text"  type="hidden" name="visual_position_' + total_visuals + '" value="' + total_visuals + '" id="visual_position_' + total_visuals + '"  />');
                            itemEl.find(".jFiler-item-text").append('<textarea placeholder="Image caption" name="caption_' + total_visuals + '" id="caption_' + total_visuals + '" rows="2" width="100%"></textarea><input  style="display:none" type="checkbox" name="group_work_' + total_visuals + '" id="group_work_' + total_visuals + '" value="1" />&nbsp;<label  style="display:none" for="group_work_' + total_visuals + '">Part of group excercise</label><br/><a  style="display:none" href="javascript:void(0)" class="open_ref_pop" data-ref-id="' + total_visuals + '" id="ref_btn_' + total_visuals + '" ><i class="fa fa-image"></i>  Add image references</a><textarea style="display:none" name="ref_text_' + total_visuals + '" id="ref_text_' + total_visuals + '"></textarea><input style="display:none" type="checkbox" value="1" name="ref_chk_' + total_visuals + '" id="ref_chk_' + total_visuals + '" /><input type="hidden" name="visual_image_' + total_visuals + '" value="' + new_file_name + '" id="visual_image_' + total_visuals + '"  /><input class="pos_text" value="' + total_visuals + '" type="hidden" name="visual_position_' + total_visuals + '" id="visual_position_' + total_visuals + '"  />');
                            //alert('end');
                        }
                    },
                    error: function (el) {
                        var parent = el.find(".jFiler-jProgressBar").parent();
                        el.find(".jFiler-jProgressBar").fadeOut(
                            "slow", function () {
                                $("<div class=\"jFiler-item-others text-error\"><i class=\"icon-jfi-minus-circle\"></i> Error, File not supported or image too large</div>").hide().appendTo(parent).fadeIn("slow");
                            }
                        );
                    },
                    statusCode: null,
                    onProgress: null,
                    onComplete: null
                },
                files: img1(),
                allowDuplicates: false,
                clipBoardPaste: true,
                excludeName: null,
                beforeRender: null,
                afterRender: null,
                beforeShow: null,
                beforeSelect: null,
                onSelect: null,
                afterShow: null,
                onRemove: function (itemEl, file, id, listEl, boxEl, newInputEl, inputEl) {

                    var filerKit = inputEl.prop("jFiler"),
                    file_name = filerKit.files_list[id].name;

                    if (typeof file_name == 'undefined') {
                        file_name = file.name;
                    }
                    $.post(js_base + "remove-slide", {file: file_name});
                    //total_visuals--;
                    //$('#total_visuals').val(total_visuals);


                    setTimeout(
                        function () {
                            $.each(
                                $('#sortable .jFiler-item'), function () {
                                    var ind = $(this).index();
                                    ind = parseInt(ind) + parseInt(1);

                                    var this_pos = $(this).find('.pos_text').val();
                                    if (this_pos > ind) {
                                        this_pos = parseInt(this_pos) - parseInt(1);
                                        $(this).find('.pos_text').val(this_pos);
                                        //$(this).find('textarea').html(this_pos);
                                    }
                                }
                            );
                        }, 500
                    );
                },
                onEmpty: null,
                options: null,
                dialogs: {
                    alert: function (text) {
                        return alert(text);
                    },
                    confirm: function (text, callback) {
                        confirm(text) ? callback() : null;
                    }
                },
                captions: {
                    button: "Choose Files",
                    feedback: "Choose files To Upload",
                    feedback2: "files were chosen",
                    drop: "Drop file here to Upload",
                    removeConfirmation: "Are you sure you want to remove this file?",
                    errors: {
                        filesLimit: "Only {{fi-limit}} files are allowed to be uploaded.",
                        filesType: "Only Images are allowed to be uploaded.",
                        filesSize: "{{fi-name}} is too large! Please upload file up to {{fi-maxSize}} MB.",
                        filesSizeAll: "Files you've choosed are too large! Please upload files up to {{fi-maxSize}} MB."
                    }
                }
            }
        );
    }
);

