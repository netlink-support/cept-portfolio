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
var modalTemplate = '<div  class="modal"><div style="max-width:70% !important" class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="modalLabel">Crop image</h4></div><div class="modal-body"><div class="image-container"></div></div><div class="modal-footer"><input class="form-control" style="width: 250px;display: none;float: left" type="text" id="caption" name="caption" placeholder="Caption"><button type="button" class="btn btn-default crop-upload" data-dismiss="modal">Crop</button><button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button></div></div></div></div>';

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


//$('#dropzone').sortable({
//    revert: true,
//    placeHolder: 'test-placeholder',
//    update: function(event, ui) {
//        alert(JSON.stringify(ui))
//    }
//});




// listen to thumbnail event
myDropzone.on(
    'thumbnail', function (file) {

        //    $('.dz-preview').draggable({
        //        connectWith: ".dz-preview",
        //        connectToSortable: "#dropzone",
        //        revert: "invalid"
        //    });

        // ignore files which were already cropped and re-rendered
        // to prevent infinite loop
        if (file.cropped) {
            return;
        }
        if (file.width < 100) {
            // validate width to prevent too small files to be uploaded
            // .. add some error message here
            return;
        }
        // cache filename to re-assign it to cropped file
        var cachedFilename = file.name;
        // remove not cropped file from dropzone (we will replace it later)
        myDropzone.removeFile(file);

        // dynamically create modals to allow multiple files processing
        var $cropperModal = $(modalTemplate);
        // 'Crop and Upload' button in a modal
        var $uploadCrop = $cropperModal.find('.crop-upload');

        var $img = $('<img />');

        // initialize FileReader which reads uploaded file
        //    var reader = new FileReader();
        //
        //
        //    reader.onloadend = function() {
        //        // add uploaded and read image to modal
        //        $cropperModal.find('.image-container').html($img);
        //
        //
        //        $img.attr('src', reader.result);
        //
        //        // initialize cropper for uploaded image
        //        $img.cropper1({
        //            autoCropArea: 0.5,
        //            responsive: true,
        //            dragMode:'move',
        //            built: function() {
        //                $img.cropper1('setCanvasData', {
        //                    left: 0,
        //                    top: 0
        //                });
        //                $img.cropper1('setCropBoxData', {
        //                    left: 0,
        //                    top: 0,
        //                    width: 500,
        //                    height: 300
        //                });
        //            }
        //        });
        //    };
        //
        //    // read uploaded file (triggers code above)
        //    reader.readAsDataURL(file);




        $cropperModal.modal('show');

        // listener for 'Crop and Upload' button in modal
        $uploadCrop.on(
            'click', function () {

                //        if($("#caption").val()=='')
                //        {
                //            alert('Please add caption');
                //            $("#caption").focus()
                //            return false;
                //        }

                // get cropped image data
                var blob = $img.cropper1('getCroppedCanvas').toDataURL();
                // transform it to Blob object
                var newFile = dataURItoBlob(blob);
                // set 'cropped to true' (so that we don't get to that listener again)
                newFile.cropped = true;
                // assign original filename
                newFile.name = cachedFilename;

                // add cropped file to dropzone
                myDropzone.addFile(newFile);
                // upload cropped file with dropzone
                myDropzone.processQueue();

                $cropperModal.modal('hide');
            }
        );
    }
);