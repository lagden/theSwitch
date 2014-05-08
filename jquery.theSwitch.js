/**
 * jquery.theSwitch.js
 * Thiago Lagden | @thiagolagden | lagden@gmail.com
 */

(function(factory) {
    if (typeof define === 'function' && define.amd)
        define(['jquery'], factory);
    else
        factory(jQuery);
}(function($) {

    'use strict';

    var pluginName = 'theSwitch',
        defaults = {
            theCss: null
        };

    // Private Methods
    var events = {
        _reset: function() {
            this.element.checked = true;
            this.$span.removeClass('checked');
        },
        _click: function() {
            var method = (this.element.checked) ? 'addClass' : 'removeClass';
            this.$span[method]('checked');
        },
        _keyup: function(event) {
            var keys = [37, 39];
            if (keys.indexOf(event.which) !== -1) {
                if ((event.which === 39 && this.element.checked === false) || (event.which === 37 && this.element.checked === true))
                    this.$element.trigger('click.' + this._name);
            }
        },
        _toggle: function(event) {
            var method = (event.type === 'focus') ? 'addClass' : 'removeClass';
            this.$span[method]('focus');
        }
    };

    function Plugin(element, options) {
        this.element = element;
        this.$element = $(element);
        this.$span = null;
        this.opts = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            if (this.$element.is(':checkbox')) {
                this.element.setAttribute('tabIndex', -1);
                this.custom();
            }
        },
        custom: function() {
            // Create the custom element
            var span = document.createElement('span');
            span.className = this.element.className;
            span.setAttribute('tabIndex', 0);

            // Instance jQuery
            this.$span = $(span);
            this.$span.on('keyup.' + this._name, this.proxy(events._keyup));
            if (this.opts.theCss)
                this.$span.addClass(this.opts.theCss);

            // Some styles and listener
            this.$element
                .css({
                    'top': 0,
                    'left': 0,
                    'opacity': 0,
                    'position': 'absolute',
                    'width': '100%'
                })
                .on('click.' + this._name, this.proxy(events._click))
                .on('focus.' + this._name + ' blur.' + this._name, this.proxy(events._toggle))
                .after(this.$span)
                .appendTo(this.$span);

            // Listener Form Reset
            var frm = this.$element.closest('form');
            if (frm.length === 1)
                frm.on('reset.' + this._name, this.proxy(events._reset));

            // Verify initial status
            this.proxy(events._click)(null);

            // Another way to call a private method
            // events._click.bind(this)(null);
        },
        proxy: function(m) {
            var that = this;
            return function() {
                m.apply(that, arguments);
            };
        }
    };

    // https://github.com/desandro/get-style-property/blob/master/get-style-property.js
    function getStyleProperty(propName) {
        var prefixes = 'Webkit Moz ms Ms O'.split(' '),
            docElemStyle = document.documentElement.style;

        if (!propName)
            return;

        if (typeof docElemStyle[propName] === 'string')
            return propName;

        // capitalize
        propName = propName.charAt(0).toUpperCase() + propName.slice(1);

        // test vendor specific properties
        var prefixed;

        for (var i = 0, len = prefixes.length; i < len; i++) {
            prefixed = prefixes[i] + propName;
            if (typeof docElemStyle[prefixed] === 'string')
                return prefixed;
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