function trim11(str) {
    str = str.replace(/^\s+/, '');
    for (var i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return str;
}

$.validator.addMethod("lettersonly", function (value, element) {
    return this.optional(element) || /^[a-z ]+$/i.test(value);
}, "Only letters allowed");

$("#report_form").validate({
    onkeyup: false,
    rules: {
        name: {
            required: true,
            lettersonly: true
        },
        email: {
            required: true,
            email: true
        },
        rep_option: {
            required: true
        },
        comments: {
            //required: true
        }
    },
    messages: {
        email: {required: "Enter valid email address."},
        name: "Please enter your name",
        rep_option: "Please select an option from the list",
        //agree: "Please agree to the terms and conditions",
    },
    errorPlacement: function (error, element)
    {
//        if ($(element).attr('type') == 'checkbox')
//        {
//            error.insertAfter($(element).closest('.small-txt'));
//        } else
//        {
//            error.insertAfter($(element).closest('.md-form'));
//        }
        error.insertAfter($(element));
    },
    submitHandler: function (form)
    {
        $.ajax({
            url: js_base_2 + 'report_content',
            type: 'POST',
            data: $('#report_form').serialize(),
            success: function (result) {
                $("#response").text(result);

            }

        });
        $('#submit_report_button').hide();
        $('#report_div').html('<div class="col-md-12 col-sm-12 col-xs-12 "><div class="alert alert-success">We have received your report, necessary actions will be taken if needed.</div></div><div class="clearfix"></div>')
        //form.submit();
    }
});

$('#submit_report_button').on('click', function (e) {
    $("#report_form").valid();
});


