/**
 * The Modal jQuery plugin
 *
 * @author  Alexander Makarov <sam@rmcreative.ru>
 * @link    https://github.com/samdark/the-modal1
 * @version 1.0
 */

/*global jQuery, window, document*/
;(function ($, window, document, undefined) {
    "use strict";
    /*jshint smarttabs:true*/

    var pluginNamespace = 'the-modal1',
    // global defaults
    defaults = {
        overlayClass: 'themodal1-overlay',

        closeOnEsc: true,
        closeOnOverlayClick: true,

        onClose: null,
        onOpen: null
    };

    function lockContainer()
    {
        $('html,body').addClass('lock');
    }

    function unlockContainer()
    {
        $('html,body').removeClass('lock');
    }

    function init(els, options)
    {
        var modal1Options = options, _this;

        if(els.length) {
            els.each(
                function () {
                    $(this).data(pluginNamespace+'.options', modal1Options);
                }
            );
        }
        else {
            $.extend(defaults, modal1Options);
        }

        return _this = {
            open: function (options) {
                var el = els.get(0);
                var localOptions = $.extend({}, defaults, $(el).data(pluginNamespace+'.options'), options);

                // close modal1 if opened
                if($('.'+localOptions.overlayClass).length) {
                    $.modal1().close();
                }

                lockContainer();

                var overlay = $('<div/>').addClass(localOptions.overlayClass).prependTo('body');
                overlay.data(pluginNamespace+'.options', options);

                if(el) {
                     el = $(el).clone(true).appendTo(overlay).show();
                }

                if(localOptions.closeOnEsc) {
                        $(document).bind(
                            'keyup.'+pluginNamespace, function (e) {
                                if(e.keyCode === 27) {
                                    _this.close();
                                }
                            }
                        );
                }

                if(localOptions.closeOnOverlayClick) {
                    $('.' + localOptions.overlayClass).on(
                        'click.' + pluginNamespace, function (e) {
                            if (e.target === this) {
                                _this.close();
                            }
                        }
                    );
                }

                $(document).bind(
                    'touchmove.'+pluginNamespace,function (e) {
                        if(!$(e).parents('.' + localOptions.overlayClass)) {
                            e.preventDefault();
                        }
                    }
                );

                if(localOptions.onOpen) {
                    localOptions.onOpen(overlay, localOptions);
                }

                el.on(
                    'resize', function () {
                        el.css('marginLeft', ($(window).width() - el.outerWidth())/2);
                    }
                ).triggerHandler('resize');
            },
            close: function () {
                var el = els.get(0);

                var localOptions = $.extend({}, defaults, options);
                var overlay = $('.' + localOptions.overlayClass);
                $.extend(localOptions, overlay.data(pluginNamespace+'.options'));

                if(localOptions.onClose) {
                    localOptions.onClose(overlay, localOptions);
                }

                overlay.remove();
                unlockContainer();

                if(localOptions.closeOnEsc) {
                    $(document).unbind('keyup.'+pluginNamespace);
                }
            }
        };
    }

    $.modal1 = function (options) {
        return init($(), options);
    };

    $.fn.modal1 = function (options) {
        return init(this, options);
    };


    $.modal1.getAvailableWidth = function (width) {
        return    Math.min($(window).width() - 100, width);
    };

    $.modal1.getAvailableHeight = function (height) {
        return    Math.min($(window).height() - 100, height);
    };

})(jQuery, window, document);
