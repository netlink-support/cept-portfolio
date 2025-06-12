(function ($) {
  
    $("body").fadeIn();

    $("#close").click(
        function () {
            $("#notice").effect("explode");
        }
    );

    $("tr:even").addClass("alt");
    $("td").each(
        function () {
            $(this).attr("valign", "top");
        }
    );
    $("tr").hover(
        function () {
            $(this).addClass("over");
        }, function () {
            $(this).removeClass("over");
        }
    );

    // Examples
    $("#project_brief_div").counter(
        {
            type: "word",
            goal: 100
        }
    );
    $("#project_brief_div_other").counter(
        {
            type: "word",
            goal: 1000
        }
    );
    $("#student_brief_data").counter(
        {
            type: "word",
            goal: 100
        }
    );
    $("#image_ref_txt").counter(
        {
            type: "char",
            goal: 500
        }
    );

    //$("<span class='ui-icon ui-icon-newwin'>&nbsp;</span>").insertAfter($("a[target^='_blank']"));

    $("#contentEditable").counter(
        {
            goal: 100
        }
    );

})(jQuery);