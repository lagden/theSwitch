/**
 * jquery.theSwitch.js
 * Thiago Lagden | @thiagolagden | lagden@gmail.com
 */

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {

    'use strict';

    var pluginName = 'theSwitch',
        defaults = {
            theCss: null
        },
        prefixes = 'Webkit Moz ms Ms O'.split(' '),
        docElemStyle = document.documentElement.style;

    function Plugin(element, options) {
        this.element = element;
        this.$element = $(element);
        this.$span = null;
        this.opts = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.proxy = {};
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            if (this.$element.is(':checkbox'))
                this.custom();
        },
        custom: function() {
            // Create the custom element
            var span = document.createElement('span');
            span.className = this.element.className;

            // Instance jQuery
            this.$span = $(span);
            if (this.opts.theCss)
                this.$span.addClass(this.opts.theCss);

            this.proxy.clica = $.proxy(_onClick, this);
            this.proxy.reseta = $.proxy(_onReset, this);

            // Some style and listener click
            this.$element
                .css({
                    'top': 0,
                    'left': 0,
                    'opacity': 0,
                    'position': 'absolute',
                    'width': '100%'
                })
                .on('click.' + this._name, this.proxy.clica)
                .after(this.$span)
                .appendTo(this.$span);

            // Listener Form Reset
            var frm = this.$element.closest('form');
            if (frm.length === 1)
                frm.on('reset', this.proxy.reseta);

            // Verify initial status
            this.proxy.clica();
        }
    };

    // Private methods
    function _onReset(event) {
        this.element.checked = true;
        this.$span.removeClass('checked');
    }

    function _onClick(event) {
        var method = (this.element.checked) ? 'addClass' : 'removeClass';
        this.$span[method]('checked');
    }

    // https://github.com/desandro/get-style-property/blob/master/get-style-property.js
    function getStyleProperty(propName) {
        if (!propName) {
            return;
        }

        // test standard property first
        if (typeof docElemStyle[propName] === 'string') {
            return propName;
        }

        // capitalize
        propName = propName.charAt(0).toUpperCase() + propName.slice(1);

        // test vendor specific properties
        var prefixed;
        for (var i = 0, len = prefixes.length; i < len; i++) {
            prefixed = prefixes[i] + propName;
            if (typeof docElemStyle[prefixed] === 'string') {
                return prefixed;
            }
        }
    }

    $.fn[pluginName] = function(options) {
        var args = arguments;
        var hasSupport = (/^Webkit/).test(getStyleProperty('appearance'));
        if (hasSupport === false) {
            if (options === undefined || typeof options === 'object') {
                return this.each(function() {
                    if (!$.data(this, pluginName))
                        $.data(this, pluginName, new Plugin(this, options));
                });
            } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
                var returns;

                this.each(function() {
                    var instance = $.data(this, pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function')
                        returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                });

                return returns !== undefined ? returns : this;
            }
        }
        return null;
    };
}));