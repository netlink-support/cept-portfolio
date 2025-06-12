var fileList_images = new Array;
var i = 0;
var j = 0;
// transform cropper dataURI output to a Blob which Dropzone accepts
function dataURItoBlob(dataURI)
{


    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob(
        [ab], {
            type: 'image/jpeg'
        }
    );
}


// modal window template
var modalTemplate = '<div  class="modal"><div class="cropper-modal" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="modalLabel">Crop image</h4></div><div class="modal-body"><div style="height:500px;" class="image-container"></div></div><div class="modal-footer"><small  style="float:left;color:blue;font-size:13px">*minimum crop width 1280px</small><input class="form-control" style="width: 250px;display: none;float: left" type="text" id="caption" name="caption" placeholder="Caption"><button type="button" class="btn btn-default crop-upload" data-dismiss="modal">Crop</button><button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button></div></div></div></div>';
// initialize dropzone
Dropzone.autoDiscover = false;
var myDropzone = new Dropzone(
    "#dropzone",
    {
        url: "ajax/ajax_file_upload.php?action=upload&file_type=image&file_for=" + dropzone_type,
        autoProcessQueue: false,
        addRemoveLinks: true,
        acceptedFiles: 'image/*',
        maxFilesize: 10,
        success: function (file, serverFileName) {
            fileList_images[i] = {
                "serverFileName": serverFileName,
                "fileName": file.name,
                "position": i
            };
            i++;
            $('#image_file_list').val(JSON.stringify(fileList_images))
        }
        }
);
myDropzone.on(
    'removedfile', function (file) {
        var rmvFile = "";
        for (var f = 0; f < fileList_images.length; f++) {
            if (fileList_images[f].fileName == file.name) {
                rmvFile = fileList_images[f].serverFileName;
            }
        }
        if (rmvFile) {
            $.ajax(
                {
                    url: "ajax/ajax_file_upload.php?action=delete&file_type=image&file_for=" + dropzone_type,
                    type: "POST",
                    data: {
                        "fileList_images": rmvFile
                    }
                }
            );
        }
    }
);
myDropzone.on(
    'thumbnail', function (file) {

        if (file.cropped) {
            return;
        }
        if (file.width < 1280) {
            alert('Min width 1280px required')
            myDropzone.removeFile(file);
            return;
        }
        var cachedFilename = file.name;
        myDropzone.removeFile(file);
        var $cropperModal = $(modalTemplate);
        var $uploadCrop = $cropperModal.find('.crop-upload');
        var $img = $('<img />');
        var reader = new FileReader();
        reader.onloadend = function () {
            $img.attr('src', reader.result);
            $cropperModal.find('.image-container').html($img);
            $img.cropper1(
                {
                    built: function () {
                        var d2 = $img.cropper1('getImageData');
                        $cropperModal.find('.image-container').css('height', d2.height);
                        $cropperModal.find('.image-container').css('width', d2.width);
                        $img.cropper1('destroy')
                        $img.cropper1(
                            {
                                aspectRatio: 1280 / 720,
                                zoomable: false,
                                strict: true,
                                strict: true,
                                cropmove: function () {
                                    var dt = $img.cropper1('getData');
                                    if (dt.width <= 1280) {
                                        $img.cropper1(
                                            'setData', {
                                                width: 1280
                                            }
                                        );
                                    }
                                }
                            }
                        )
                    }
                }
            );
        };
        reader.readAsDataURL(file);
        $cropperModal.modal('show');
        $uploadCrop.on(
            'click', function () {
                var blob = $img.cropper1('getCroppedCanvas').toDataURL("image/jpeg", 0.7);
                var newFile = dataURItoBlob(blob);
                newFile.cropped = true;
                newFile.name = cachedFilename;
                myDropzone.addFile(newFile);
                myDropzone.processQueue();
                $cropperModal.modal('hide');
            }
        );
    }
);