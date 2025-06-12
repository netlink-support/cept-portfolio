/*
 * Method resize image
 */
var height_new;
function TzTemplateResizeImage(obj)
{

    var widthStage;
    var heightStage;
    var widthImage;
    var heightImage;
    var icr = 0;
    obj.each(
        function (i, el) {
            heightStage = jQuery(this).height();
            widthStage = jQuery(this).width();
            var img_url = jQuery(this).find('img').attr('src');
            var image = new Image();
            image.src = img_url;
            image.onload = function () {
            }
            widthImage = image.naturalWidth;
            heightImage = image.naturalHeight;
            var tzimg = new resizeImage(widthImage, heightImage, widthStage, heightStage);
            if (icr == 0) {
                height_new = get_height(tzimg.height);
            }
            jQuery(this).find('img').css({top: tzimg.top, left: tzimg.left, width: tzimg.width, height: height_new});
            icr++;
        }
    );
}

function get_height(h)
{
    return ((parseInt(114) * parseInt(h)) / parseInt(194));
}

/*
 * Method portfolio column
 * @variables Desktop
 * @variables tabletlandscape
 * @variables tabletportrait
 * @variables mobilelandscape
 * @variables mobileportrait
 */
function tz_init(Desktop, tabletlandscape, tabletportrait, mobilelandscape, mobileportrait)
{
    var contentWidth = jQuery('.tz-portfolio-content').width();
    var numberItem = 2;
    var newColWidth = 0;
    var heightElement = 112;
    var landscape = 0;
    var portrait = 0;
    var featureColWidth = 0;
    var widthWindwow = jQuery(window).width();
    if (widthWindwow > 1199) {
        numberItem = Desktop;
    } else if (widthWindwow >= 1024) {
        numberItem = tabletlandscape;
    } else if (widthWindwow >= 768) {
        numberItem = tabletportrait;

    } else if (widthWindwow < 600) {
        numberItem = mobilelandscape;

    } else if (widthWindwow >= 600) {
        numberItem = mobilelandscape;
    } else if (widthWindwow < 480) {
        numberItem = mobileportrait;
    }
    newColWidth = Math.floor(contentWidth / numberItem);
    heightElement = jQuery('.element').height();
    //landscape = newColWidth * 2;
    //  portrait = 57 * 2;
    landscape = 260;
    portrait = 112;

    jQuery('.element').css(
        {
            width: newColWidth + 'px'
        }
    );
    jQuery('.tz_feature_item, .tz-landscape').width(landscape);
    jQuery('.tz-portrait').css('height', portrait + 'px');
    var $container = jQuery('.tz-portfolio-content');
    $container.imagesLoaded(
        function () {
            $container.isotope(
                {
                    itemSelector: '.isoitem',
                    masonry: {
                        columnWidth: newColWidth
                    }
                }
            );

        }
    );
    TzTemplateResizeImage(jQuery('.element'));
}

/*
 * Method reize
 */
jQuery(window).bind(
    'load resize', function () {
        if (resizeTimer) {
            clearTimeout(resizeTimer);
        }
        resizeTimer = setTimeout("tz_init(Desktop, tabletlandscape, tabletportrait, mobilelandscape, mobileportrait)", 100);
    }
);

/*
 * Method Filter
 */
function loadPortfolio()
{
    var $container = jQuery('.tz-portfolio-content');
    var $optionSets = jQuery('.tzfilter'),
            $optionLinks = $optionSets.find('a');
    $optionLinks.click(
        function (event) {
            event.preventDefault();
            var $this = jQuery(this);
            // don't proceed if already selected
            if ($this.hasClass('selected')) {
                return false;
            }
            var $optionSet = $this.parents('.tzfilter');
            $optionSet.find('.selected').removeClass('selected');
            $this.addClass('selected');

            window.location.hash = $(this).attr('data-option-value').split('.').join("");

            // make option object dynamically, i.e. { filter: '.my-filter-class' }
            var options = {},
                key = $optionSet.attr('data-option-key'),
                value = $this.attr('data-option-value');

            // parse 'false' as false boolean
            value = value === 'false' ? false : value;
            options[ key ] = value;

            if (key === 'layoutMode' && typeof changeLayoutMode === 'function') {
                // changes in layout modes need extra logic
                changeLayoutMode($this, options);
            } else {
                // otherwise, apply new options
                $container.isotope(options);
            }
            return false;
        }
    );
    tz_init(Desktop, tabletlandscape, tabletportrait, mobilelandscape, mobileportrait);
}

jQuery(document).ready(
    function () {
        loadPortfolio();

        if (window.location.hash) {
            var hash = window.location.hash.substring(1);
            hash = '.' + hash;
            var $container = jQuery('.tz-portfolio-content');
            var $optionSets = jQuery('.tzfilter');
            $optionLinks = $optionSets.find('a');

            var $this = jQuery($optionSets.find("a[data-option-value='" + hash + "']"));
            // don't proceed if already selected
            if ($this.hasClass('selected')) {

            }
            var $optionSet = $this.parents('.tzfilter');
            $optionSet.find('.selected').removeClass('selected');
            $this.addClass('selected');

            var options = {},
                key = $optionSet.attr('data-option-key'),
                value = $this.attr('data-option-value');

            // parse 'false' as false boolean
            value = value === 'false' ? false : value;
            options[ key ] = value;

            if (key === 'layoutMode' && typeof changeLayoutMode === 'function') {
                // changes in layout modes need extra logic
                changeLayoutMode($this, options);
            } else {
                // otherwise, apply new options
                $container.isotope(options);
            }
            tz_init(Desktop, tabletlandscape, tabletportrait, mobilelandscape, mobileportrait);
        }
    }
);


