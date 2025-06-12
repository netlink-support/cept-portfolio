
var portfolio = {
    ajax_url: 'ajax/ajax_custom.php',
    editors: new Array(),
    ajaxCustom: function (url, data, callback, callback_custom_variable_1) {
        $.ajax(
            { 
                url: url,
                data: data,
                method: 'POST',
                async: false,
                success: function (ret) {
                    if (typeof callback === "function") {
                        if (typeof callback_custom_variable_1 !== "undefined") {
                            callback(ret, callback_custom_variable_1);
                        } else
                        {
                            callback(ret);
                        }
                    }
                },
                error: function (err) {
                    alert('Error, Please try again later');
                }
            }
        );
    },
    createSlug: function (value, id, tablename, edit, id_value) {
        var slug = portfolio.slugify(value)
        $('#' + id).val(slug)
        portfolio.verifySlug(slug, tablename, edit, id_value)
        return false;
    },
    slugify: function (text) {
        //return text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-')
        return text.toLowerCase().replace(/[^a-zA-Z0-9-'-']+/g, '-').substring(0, 40)
    },
    verifySlug: function (slug, tablename, edit, id) {
        var data = {
            slug: slug,
            table: tablename,
            edit: edit,
            id: id,
            type: 'check_slug'
        };
        portfolio.ajaxCustom(
            portfolio.ajax_url, data, function (res) {
                if (res == 'ok') {
                    $('#submit').removeAttr('disabled');
                    portfolio.putHTML('', 'slug_error')
                    return true
                } else
                {
                    portfolio.putHTML(res, 'slug_error')
                    if ($('#submit').length) {
                        $('#submit').attr('disabled', 'disabled');
                    }
                }
            }
        )
    },
    removeImage: function (tablename, where_value, where_field, image_field, language_flag) {
        var data = {
            table: tablename,
            where_value: where_value,
            image_field: image_field,
            where_field: where_field,
            language_flag: language_flag,
            type: 'remove_image'
        };
        portfolio.ajaxCustom(
            portfolio.ajax_url, data, function () {
                window.location.reload();
            }
        )
    },
    changeLanguage: function (value) {
        if (value == '' || value == 0) {
            alert('Please select language');
            return false;
        }

        $.ajax(
            {
                url: 'ajax/ajax_change_language.php',
                data: {
                    language: value
                },
                method: 'POST',
                async: false,
                success: function (ret) {
                    window.location.reload();
                },
                error: function (err) {
                    alert('Error changing language, Please try again later');
                }
            }
        );
    },
    addEditor: function (id, height, cst) {
        var height1 = 150;
        if (typeof height !== 'undefined') {
            height1 = height
        }

        if ($('#' + id).length > 0) {
            CKEDITOR.replace(
                id, {
                    height: height1,
                    filebrowserBrowseUrl: 'finder/elfinder.html',
                    filebrowserUploadUrl: 'file/upload.php?type=Files',
                }
            );

            CKEDITOR.config.allowedContent = true;
            CKEDITOR.dtd.$removeEmpty['span'] = false
            if (typeof cst != 'undefined' && cst == 1) {
                CKEDITOR.config.toolbar = [
                    ['Bold', 'Italic', 'Underline', 'StrikeThrough', 'NumberedList', 'BulletedList', 'Table', 'Link', 'Source','Image','imageuploader']
                    //['Headings', 'Styles', 'Format', 'Font', 'FontSize', 'Bold', 'Italic', 'Underline', 'StrikeThrough', 'NumberedList', 'BulletedList', 'Table', 'Link', 'Source','Image','imageuploader']
                ];
            } else
            {
                CKEDITOR.config.toolbar = [
                    ['Headings', 'Styles', 'Format', 'Font', 'FontSize', 'Bold', 'Italic', 'Underline', 'StrikeThrough', 'NumberedList', 'BulletedList', 'Table', 'Link', 'Source','Image','imageuploader']
                ];
                //                CKEDITOR.config.toolbar = [
                //                    ['Headings', 'Styles', 'Format', 'Font', 'FontSize', 'Bold', 'Italic', 'Underline', 'StrikeThrough', '-', 'Undo', 'Redo', '-', 'Cut', 'Copy', 'Paste', 'Find', 'Replace', '-', 'Outdent', 'Indent', '-', 'Print', 'NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
                //                    ['Image', 'Table', '-', 'Link', 'Flash', 'Smiley', 'TextColor', 'BGColor', 'Source', 'btgrid', 'imageuploader']
                //                ];
            }

            CKEDITOR.instances[id].fire('btgrid');

        }
    },
    putHTML: function (html, object_id) {
        $('#' + object_id).html(html)
    },
    checkBoxToggle: function (id, div_id) {
        $('#' + id).on(
            'ifChecked', function (event) {
                $('#' + div_id).css('display', '')
            }
        );
        $('#' + id).on(
            'ifUnchecked', function (event) {
                $('#' + div_id).css('display', 'none')
            }
        );
    },
    removeProductDoc: function (doc_id, product_id) {
        var data = {
            doc_id: doc_id,
            product_id: product_id,
            type: 'remove_product_doc'
        };
        portfolio.ajaxCustom(
            portfolio.ajax_url, data, function (res) {
                $('#product_docs').html(res)
            }
        )
    },
    removeGalleryImage: function (ref_id, gallery_type, image_id) {
        var data = {
            ref_id: ref_id,
            gallery_type: gallery_type,
            image_id: image_id,
            type: 'remove_gallery_image'
        };
        portfolio.ajaxCustom(
            portfolio.ajax_url, data, function (res) {
                $('#gallery_grid').html(res)
            }
        )
    },
    openModal: function (id) {
        $('#' + id).modal('show');
    },
    closeModal: function (id) {
        $('#' + id).modal('hide');
    },
    updatePosition: function (unique_key_for_position, unique_key_value_for_position, position, old_position, table, parent, parent_value) {
        var shortorder = {
            unique_key_for_position: unique_key_for_position,
            unique_key_value_for_position: unique_key_value_for_position,
            position: position,
            old_position: old_position,
            type: 'change_position_custom',
            table: table
        };

        if (typeof parent != undefined && typeof parent_value != undefined) {
            var shortorder = {
                unique_key_for_position: unique_key_for_position,
                unique_key_value_for_position: unique_key_value_for_position,
                position: position,
                old_position: old_position,
                type: 'change_position_custom',
                table: table,
                parent_value: parent_value,
                parent: parent,
            };
        }

        $.ajaxSetup(
            {
                cache: false
            }
        );
        $.ajax(
            {
                url: portfolio.ajax_url,
                async: false,
                data: shortorder,
                dataType: "html",
                type: "GET",
                success: function (html) {
                    $("#data_grid").html(html);
                }
            }
        );
    },
    updatePosition2: function (unique_key_for_position, unique_key_value_for_position, position, old_position, table, parent, parent_value) {
        var shortorder = {
            unique_key_for_position: unique_key_for_position,
            unique_key_value_for_position: unique_key_value_for_position,
            position: position,
            old_position: old_position,
            type: 'change_position_custom',
            table: table
        };

        if (typeof parent != undefined && typeof parent_value != undefined) {
            var shortorder = {
                unique_key_for_position: unique_key_for_position,
                unique_key_value_for_position: unique_key_value_for_position,
                position: position,
                old_position: old_position,
                type: 'change_position_custom',
                table: table,
                parent_value: parent_value,
                parent: parent,
            };
        }

        $.ajaxSetup(
            {
                cache: false
            }
        );
        $.ajax(
            {
                url: portfolio.ajax_url,
                async: false,
                data: shortorder,
                dataType: "html",
                type: "GET"
            }
        );
    }

}


//$(document).ready(function()
//{
//    var loading_indicator = '<div id="loading-indicator" style="display:none;" class="loading-indicator">' +
//            '<div class="loading-overlay">&nbsp;</div>' +
//            '<div class="loading-content">' +
//            '</div>' +
//            '</div>';
//
//    $('body').prepend(loading_indicator);
//
//    $.ajaxSetup(
//            {
//                cache: true
//            });
//
//    $(document).ajaxStart(function() {
//        $('#loading-indicator').show();
//    }).ajaxStop(function()
//    {
//        $('#loading-indicator').hide();
//    });
//
//    //code to run when error has occured on page
//    window.onerror = function() {
//        $('#loading-indicator').hide();
//    }
//});





