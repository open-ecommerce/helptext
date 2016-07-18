/**
 * Yii JavaScript module.
 *
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */

/**
 * yii is the root module for all Yii JavaScript modules.
 * It implements a mechanism of organizing JavaScript code in modules through the function "yii.initModule()".
 *
 * Each module should be named as "x.y.z", where "x" stands for the root module (for the Yii core code, this is "yii").
 *
 * A module may be structured as follows:
 *
 * ```javascript
 * yii.sample = (function($) {
 *     var pub = {
 *         // whether this module is currently active. If false, init() will not be called for this module
 *         // it will also not be called for all its child modules. If this property is undefined, it means true.
 *         isActive: true,
 *         init: function() {
 *             // ... module initialization code go here ...
 *         },
 *
 *         // ... other public functions and properties go here ...
 *     };
 *
 *     // ... private functions and properties go here ...
 *
 *     return pub;
 * })(jQuery);
 * ```
 *
 * Using this structure, you can define public and private functions/properties for a module.
 * Private functions/properties are only visible within the module, while public functions/properties
 * may be accessed outside of the module. For example, you can access "yii.sample.isActive".
 *
 * You must call "yii.initModule()" once for the root module of all your modules.
 */
yii = (function ($) {
    var pub = {
        /**
         * List of JS or CSS URLs that can be loaded multiple times via AJAX requests. Each script can be represented
         * as either an absolute URL or a relative one.
         */
        reloadableScripts: [],
        /**
         * The selector for clickable elements that need to support confirmation and form submission.
         */
        clickableSelector: 'a, button, input[type="submit"], input[type="button"], input[type="reset"], input[type="image"]',
        /**
         * The selector for changeable elements that need to support confirmation and form submission.
         */
        changeableSelector: 'select, input, textarea',

        /**
         * @return string|undefined the CSRF parameter name. Undefined is returned if CSRF validation is not enabled.
         */
        getCsrfParam: function () {
            return $('meta[name=csrf-param]').attr('content');
        },

        /**
         * @return string|undefined the CSRF token. Undefined is returned if CSRF validation is not enabled.
         */
        getCsrfToken: function () {
            return $('meta[name=csrf-token]').attr('content');
        },

        /**
         * Sets the CSRF token in the meta elements.
         * This method is provided so that you can update the CSRF token with the latest one you obtain from the server.
         * @param name the CSRF token name
         * @param value the CSRF token value
         */
        setCsrfToken: function (name, value) {
            $('meta[name=csrf-param]').attr('content', name);
            $('meta[name=csrf-token]').attr('content', value);
        },

        /**
         * Updates all form CSRF input fields with the latest CSRF token.
         * This method is provided to avoid cached forms containing outdated CSRF tokens.
         */
        refreshCsrfToken: function () {
            var token = pub.getCsrfToken();
            if (token) {
                $('form input[name="' + pub.getCsrfParam() + '"]').val(token);
            }
        },

        /**
         * Displays a confirmation dialog.
         * The default implementation simply displays a js confirmation dialog.
         * You may override this by setting `yii.confirm`.
         * @param message the confirmation message.
         * @param ok a callback to be called when the user confirms the message
         * @param cancel a callback to be called when the user cancels the confirmation
         */
        confirm: function (message, ok, cancel) {
            if (confirm(message)) {
                !ok || ok();
            } else {
                !cancel || cancel();
            }
        },

        /**
         * Handles the action triggered by user.
         * This method recognizes the `data-method` attribute of the element. If the attribute exists,
         * the method will submit the form containing this element. If there is no containing form, a form
         * will be created and submitted using the method given by this attribute value (e.g. "post", "put").
         * For hyperlinks, the form action will take the value of the "href" attribute of the link.
         * For other elements, either the containing form action or the current page URL will be used
         * as the form action URL.
         *
         * If the `data-method` attribute is not defined, the `href` attribute (if any) of the element
         * will be assigned to `window.location`.
         *
         * Starting from version 2.0.3, the `data-params` attribute is also recognized when you specify
         * `data-method`. The value of `data-params` should be a JSON representation of the data (name-value pairs)
         * that should be submitted as hidden inputs. For example, you may use the following code to generate
         * such a link:
         *
         * ```php
         * use yii\helpers\Html;
         * use yii\helpers\Json;
         *
         * echo Html::a('submit', ['site/foobar'], [
         *     'data' => [
         *         'method' => 'post',
         *         'params' => [
         *             'name1' => 'value1',
         *             'name2' => 'value2',
         *         ],
         *     ],
         * ];
         * ```
         *
         * @param $e the jQuery representation of the element
         */
        handleAction: function ($e, event) {
            var $form = $e.attr('data-form') ? $('#' + $e.attr('data-form')) : $e.closest('form'),
                method = !$e.data('method') && $form ? $form.attr('method') : $e.data('method'),
                action = $e.attr('href'),
                params = $e.data('params'),
                pjax = $e.data('pjax'),
                pjaxPushState = !!$e.data('pjax-push-state'),
                pjaxReplaceState = !!$e.data('pjax-replace-state'),
                pjaxTimeout = $e.data('pjax-timeout'),
                pjaxScrollTo = $e.data('pjax-scrollto'),
                pjaxPushRedirect = $e.data('pjax-push-redirect'),
                pjaxReplaceRedirect = $e.data('pjax-replace-redirect'),
                pjaxSkipOuterContainers = $e.data('pjax-skip-outer-containers'),
                pjaxContainer,
                pjaxOptions = {};

            if (pjax !== undefined && $.support.pjax) {
                if ($e.data('pjax-container')) {
                    pjaxContainer = $e.data('pjax-container');
                } else {
                    pjaxContainer = $e.closest('[data-pjax-container=""]');
                }
                // default to body if pjax container not found
                if (!pjaxContainer.length) {
                    pjaxContainer = $('body');
                }
                pjaxOptions = {
                    container: pjaxContainer,
                    push: pjaxPushState,
                    replace: pjaxReplaceState,
                    scrollTo: pjaxScrollTo,
                    pushRedirect: pjaxPushRedirect,
                    replaceRedirect: pjaxReplaceRedirect,
                    pjaxSkipOuterContainers: pjaxSkipOuterContainers,
                    timeout: pjaxTimeout,
                    originalEvent: event,
                    originalTarget: $e
                }
            }

            if (method === undefined) {
                if (action && action != '#') {
                    if (pjax !== undefined && $.support.pjax) {
                        $.pjax.click(event, pjaxOptions);
                    } else {
                        window.location = action;
                    }
                } else if ($e.is(':submit') && $form.length) {
                    if (pjax !== undefined && $.support.pjax) {
                        $form.on('submit',function(e){
                            $.pjax.submit(e, pjaxOptions);
                        })
                    }
                    $form.trigger('submit');
                }
                return;
            }

            var newForm = !$form.length;
            if (newForm) {
                if (!action || !action.match(/(^\/|:\/\/)/)) {
                    action = window.location.href;
                }
                $form = $('<form/>', {method: method, action: action});
                var target = $e.attr('target');
                if (target) {
                    $form.attr('target', target);
                }
                if (!method.match(/(get|post)/i)) {
                    $form.append($('<input/>', {name: '_method', value: method, type: 'hidden'}));
                    method = 'POST';
                }
                if (!method.match(/(get|head|options)/i)) {
                    var csrfParam = pub.getCsrfParam();
                    if (csrfParam) {
                        $form.append($('<input/>', {name: csrfParam, value: pub.getCsrfToken(), type: 'hidden'}));
                    }
                }
                $form.hide().appendTo('body');
            }

            var activeFormData = $form.data('yiiActiveForm');
            if (activeFormData) {
                // remember who triggers the form submission. This is used by yii.activeForm.js
                activeFormData.submitObject = $e;
            }

            // temporarily add hidden inputs according to data-params
            if (params && $.isPlainObject(params)) {
                $.each(params, function (idx, obj) {
                    $form.append($('<input/>').attr({name: idx, value: obj, type: 'hidden'}));
                });
            }

            var oldMethod = $form.attr('method');
            $form.attr('method', method);
            var oldAction = null;
            if (action && action != '#') {
                oldAction = $form.attr('action');
                $form.attr('action', action);
            }
            if (pjax !== undefined && $.support.pjax) {
                $form.on('submit',function(e){
                    $.pjax.submit(e, pjaxOptions);
                })
            }
            $form.trigger('submit');
            $.when($form.data('yiiSubmitFinalizePromise')).then(
                function () {
                    if (oldAction != null) {
                        $form.attr('action', oldAction);
                    }
                    $form.attr('method', oldMethod);

                    // remove the temporarily added hidden inputs
                    if (params && $.isPlainObject(params)) {
                        $.each(params, function (idx, obj) {
                            $('input[name="' + idx + '"]', $form).remove();
                        });
                    }

                    if (newForm) {
                        $form.remove();
                    }
                }
            );
        },

        getQueryParams: function (url) {
            var pos = url.indexOf('?');
            if (pos < 0) {
                return {};
            }

            var pairs = url.substring(pos + 1).split('#')[0].split('&'),
                params = {},
                pair,
                i;

            for (i = 0; i < pairs.length; i++) {
                pair = pairs[i].split('=');
                var name = decodeURIComponent(pair[0]);
                var value = decodeURIComponent(pair[1]);
                if (name.length) {
                    if (params[name] !== undefined) {
                        if (!$.isArray(params[name])) {
                            params[name] = [params[name]];
                        }
                        params[name].push(value || '');
                    } else {
                        params[name] = value || '';
                    }
                }
            }
            return params;
        },

        initModule: function (module) {
            if (module.isActive === undefined || module.isActive) {
                if ($.isFunction(module.init)) {
                    module.init();
                }
                $.each(module, function () {
                    if ($.isPlainObject(this)) {
                        pub.initModule(this);
                    }
                });
            }
        },

        init: function () {
            initCsrfHandler();
            initRedirectHandler();
            initScriptFilter();
            initDataMethods();
        }
    };

    function initRedirectHandler() {
        // handle AJAX redirection
        $(document).ajaxComplete(function (event, xhr, settings) {
            var url = xhr && xhr.getResponseHeader('X-Redirect');
            if (url) {
                window.location = url;
            }
        });
    }

    function initCsrfHandler() {
        // automatically send CSRF token for all AJAX requests
        $.ajaxPrefilter(function (options, originalOptions, xhr) {
            if (!options.crossDomain && pub.getCsrfParam()) {
                xhr.setRequestHeader('X-CSRF-Token', pub.getCsrfToken());
            }
        });
        pub.refreshCsrfToken();
    }

    function initDataMethods() {
        var handler = function (event) {
            var $this = $(this),
                method = $this.data('method'),
                message = $this.data('confirm'),
                form = $this.data('form');

            if (method === undefined && message === undefined && form === undefined) {
                return true;
            }

            if (message !== undefined) {
                $.proxy(pub.confirm, this)(message, function () {
                    pub.handleAction($this, event);
                });
            } else {
                pub.handleAction($this, event);
            }
            event.stopImmediatePropagation();
            return false;
        };

        // handle data-confirm and data-method for clickable and changeable elements
        $(document).on('click.yii', pub.clickableSelector, handler)
            .on('change.yii', pub.changeableSelector, handler);
    }

    function initScriptFilter() {
        var hostInfo = location.protocol + '//' + location.host;

        var loadedScripts = $('script[src]').map(function () {
            return this.src.charAt(0) === '/' ? hostInfo + this.src : this.src;
        }).toArray();

        $.ajaxPrefilter('script', function (options, originalOptions, xhr) {
            if (options.dataType == 'jsonp') {
                return;
            }

            var url = options.url.charAt(0) === '/' ? hostInfo + options.url : options.url;
            if ($.inArray(url, loadedScripts) === -1) {
                loadedScripts.push(url);
            } else {
                var isReloadable = $.inArray(url, $.map(pub.reloadableScripts, function (script) {
                        return script.charAt(0) === '/' ? hostInfo + script : script;
                    })) !== -1;
                if (!isReloadable) {
                    xhr.abort();
                }
            }
        });

        $(document).ajaxComplete(function (event, xhr, settings) {
            var styleSheets = [];
            $('link[rel=stylesheet]').each(function () {
                if ($.inArray(this.href, pub.reloadableScripts) !== -1) {
                    return;
                }
                if ($.inArray(this.href, styleSheets) == -1) {
                    styleSheets.push(this.href)
                } else {
                    $(this).remove();
                }
            })
        });
    }

    return pub;
})(jQuery);

jQuery(function () {
    yii.initModule(yii);
});


/**
 * Yii validation module.
 *
 * This JavaScript module provides the validation methods for the built-in validators.
 *
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */

yii.validation = (function ($) {
    var pub = {
        isEmpty: function (value) {
            return value === null || value === undefined || value == [] || value === '';
        },

        addMessage: function (messages, message, value) {
            messages.push(message.replace(/\{value\}/g, value));
        },

        required: function (value, messages, options) {
            var valid = false;
            if (options.requiredValue === undefined) {
                var isString = typeof value == 'string' || value instanceof String;
                if (options.strict && value !== undefined || !options.strict && !pub.isEmpty(isString ? $.trim(value) : value)) {
                    valid = true;
                }
            } else if (!options.strict && value == options.requiredValue || options.strict && value === options.requiredValue) {
                valid = true;
            }

            if (!valid) {
                pub.addMessage(messages, options.message, value);
            }
        },

        'boolean': function (value, messages, options) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }
            var valid = !options.strict && (value == options.trueValue || value == options.falseValue)
                || options.strict && (value === options.trueValue || value === options.falseValue);

            if (!valid) {
                pub.addMessage(messages, options.message, value);
            }
        },

        string: function (value, messages, options) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            if (typeof value !== 'string') {
                pub.addMessage(messages, options.message, value);
                return;
            }

            if (options.min !== undefined && value.length < options.min) {
                pub.addMessage(messages, options.tooShort, value);
            }
            if (options.max !== undefined && value.length > options.max) {
                pub.addMessage(messages, options.tooLong, value);
            }
            if (options.is !== undefined && value.length != options.is) {
                pub.addMessage(messages, options.notEqual, value);
            }
        },

        file: function (attribute, messages, options) {
            var files = getUploadedFiles(attribute, messages, options);
            $.each(files, function (i, file) {
                validateFile(file, messages, options);
            });
        },

        image: function (attribute, messages, options, deferred) {
            var files = getUploadedFiles(attribute, messages, options);

            $.each(files, function (i, file) {
                validateFile(file, messages, options);

                // Skip image validation if FileReader API is not available
                if (typeof FileReader === "undefined") {
                    return;
                }

                var def = $.Deferred(),
                    fr = new FileReader(),
                    img = new Image();

                img.onload = function () {
                    if (options.minWidth && this.width < options.minWidth) {
                        messages.push(options.underWidth.replace(/\{file\}/g, file.name));
                    }

                    if (options.maxWidth && this.width > options.maxWidth) {
                        messages.push(options.overWidth.replace(/\{file\}/g, file.name));
                    }

                    if (options.minHeight && this.height < options.minHeight) {
                        messages.push(options.underHeight.replace(/\{file\}/g, file.name));
                    }

                    if (options.maxHeight && this.height > options.maxHeight) {
                        messages.push(options.overHeight.replace(/\{file\}/g, file.name));
                    }
                    def.resolve();
                };

                img.onerror = function () {
                    messages.push(options.notImage.replace(/\{file\}/g, file.name));
                    def.resolve();
                };

                fr.onload = function () {
                    img.src = fr.result;
                };

                // Resolve deferred if there was error while reading data
                fr.onerror = function () {
                    def.resolve();
                };

                fr.readAsDataURL(file);

                deferred.push(def);
            });

        },

        number: function (value, messages, options) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            if (typeof value === 'string' && !value.match(options.pattern)) {
                pub.addMessage(messages, options.message, value);
                return;
            }

            if (options.min !== undefined && value < options.min) {
                pub.addMessage(messages, options.tooSmall, value);
            }
            if (options.max !== undefined && value > options.max) {
                pub.addMessage(messages, options.tooBig, value);
            }
        },

        range: function (value, messages, options) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            if (!options.allowArray && $.isArray(value)) {
                pub.addMessage(messages, options.message, value);
                return;
            }

            var inArray = true;

            $.each($.isArray(value) ? value : [value], function (i, v) {
                if ($.inArray(v, options.range) == -1) {
                    inArray = false;
                    return false;
                } else {
                    return true;
                }
            });

            if (options.not === inArray) {
                pub.addMessage(messages, options.message, value);
            }
        },

        regularExpression: function (value, messages, options) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            if (!options.not && !value.match(options.pattern) || options.not && value.match(options.pattern)) {
                pub.addMessage(messages, options.message, value);
            }
        },

        email: function (value, messages, options) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            var valid = true;


            var regexp = /^((?:"?([^"]*)"?\s)?)(?:\s+)?(?:(<?)((.+)@([^>]+))(>?))$/,
                matches = regexp.exec(value);

            if (matches === null) {
                valid = false
            } else {
                if (options.enableIDN) {
                    matches[5] = punycode.toASCII(matches[5]);
                    matches[6] = punycode.toASCII(matches[6]);

                    value = matches[1] + matches[3] + matches[5] + '@' + matches[6] + matches[7];
                }

                if (matches[5].length > 64) {
                    valid = false;
                } else if ((matches[5] + '@' + matches[6]).length > 254) {
                    valid = false;
                } else {
                    valid = value.match(options.pattern) || (options.allowName && value.match(options.fullPattern));
                }
            }

            if (!valid) {
                pub.addMessage(messages, options.message, value);
            }
        },

        url: function (value, messages, options) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            if (options.defaultScheme && !value.match(/:\/\//)) {
                value = options.defaultScheme + '://' + value;
            }

            var valid = true;

            if (options.enableIDN) {
                var regexp = /^([^:]+):\/\/([^\/]+)(.*)$/,
                    matches = regexp.exec(value);
                if (matches === null) {
                    valid = false;
                } else {
                    value = matches[1] + '://' + punycode.toASCII(matches[2]) + matches[3];
                }
            }

            if (!valid || !value.match(options.pattern)) {
                pub.addMessage(messages, options.message, value);
            }
        },

        trim: function ($form, attribute, options) {
            var $input = $form.find(attribute.input);
            var value = $input.val();
            if (!options.skipOnEmpty || !pub.isEmpty(value)) {
                value = $.trim(value);
                $input.val(value);
            }
            return value;
        },

        captcha: function (value, messages, options) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            // CAPTCHA may be updated via AJAX and the updated hash is stored in body data
            var hash = $('body').data(options.hashKey);
            if (hash == null) {
                hash = options.hash;
            } else {
                hash = hash[options.caseSensitive ? 0 : 1];
            }
            var v = options.caseSensitive ? value : value.toLowerCase();
            for (var i = v.length - 1, h = 0; i >= 0; --i) {
                h += v.charCodeAt(i);
            }
            if (h != hash) {
                pub.addMessage(messages, options.message, value);
            }
        },

        compare: function (value, messages, options) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            var compareValue, valid = true;
            if (options.compareAttribute === undefined) {
                compareValue = options.compareValue;
            } else {
                compareValue = $('#' + options.compareAttribute).val();
            }

            if (options.type === 'number') {
                value = parseFloat(value);
                compareValue = parseFloat(compareValue);
            }
            switch (options.operator) {
                case '==':
                    valid = value == compareValue;
                    break;
                case '===':
                    valid = value === compareValue;
                    break;
                case '!=':
                    valid = value != compareValue;
                    break;
                case '!==':
                    valid = value !== compareValue;
                    break;
                case '>':
                    valid = value > compareValue;
                    break;
                case '>=':
                    valid = value >= compareValue;
                    break;
                case '<':
                    valid = value < compareValue;
                    break;
                case '<=':
                    valid = value <= compareValue;
                    break;
                default:
                    valid = false;
                    break;
            }

            if (!valid) {
                pub.addMessage(messages, options.message, value);
            }
        },

        ip: function (value, messages, options) {
            var getIpVersion = function (value) {
                return value.indexOf(':') === -1 ? 4 : 6;
            };

            var negation = null, cidr = null;

            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            var matches = new RegExp(options.ipParsePattern).exec(value);
            if (matches) {
                negation = matches[1] || null;
                value = matches[2];
                cidr = matches[4] || null;
            }

            if (options.subnet === true && cidr === null) {
                pub.addMessage(messages, options.messages.noSubnet, value);
                return;
            }
            if (options.subnet === false && cidr !== null) {
                pub.addMessage(messages, options.messages.hasSubnet, value);
                return;
            }
            if (options.negation === false && negation !== null) {
                pub.addMessage(messages, options.messages.message, value);
                return;
            }

            if (getIpVersion(value) == 6) {
                if (!options.ipv6) {
                    pub.addMessage(messages, options.messages.ipv6NotAllowed, value);
                }
                if (!(new RegExp(options.ipv6Pattern)).test(value)) {
                    pub.addMessage(messages, options.messages.message, value);
                }
            } else {
                if (!options.ipv4) {
                    pub.addMessage(messages, options.messages.ipv4NotAllowed, value);
                }
                if (!(new RegExp(options.ipv4Pattern)).test(value)) {
                    pub.addMessage(messages, options.messages.message, value);
                }
            }
        }
    };

    function getUploadedFiles(attribute, messages, options) {
        // Skip validation if File API is not available
        if (typeof File === "undefined") {
            return [];
        }

        var files = $(attribute.input).get(0).files;
        if (!files) {
            messages.push(options.message);
            return [];
        }

        if (files.length === 0) {
            if (!options.skipOnEmpty) {
                messages.push(options.uploadRequired);
            }
            return [];
        }

        if (options.maxFiles && options.maxFiles < files.length) {
            messages.push(options.tooMany);
            return [];
        }

        return files;
    }

    function validateFile(file, messages, options) {
        if (options.extensions && options.extensions.length > 0) {
            var index, ext;

            index = file.name.lastIndexOf('.');

            if (!~index) {
                ext = '';
            } else {
                ext = file.name.substr(index + 1, file.name.length).toLowerCase();
            }

            if (!~options.extensions.indexOf(ext)) {
                messages.push(options.wrongExtension.replace(/\{file\}/g, file.name));
            }
        }

        if (options.mimeTypes && options.mimeTypes.length > 0) {
            if (!validateMimeType(options.mimeTypes, file.type)) {
                messages.push(options.wrongMimeType.replace(/\{file\}/g, file.name));
            }
        }

        if (options.maxSize && options.maxSize < file.size) {
            messages.push(options.tooBig.replace(/\{file\}/g, file.name));
        }

        if (options.minSize && options.minSize > file.size) {
            messages.push(options.tooSmall.replace(/\{file\}/g, file.name));
        }
    }

    function validateMimeType(mimeTypes, fileType) {
        for (var i = 0, len = mimeTypes.length; i < len; i++) {
            if (new RegExp(mimeTypes[i]).test(fileType)) {
                return true;
            }
        }

        return false;
    }

    return pub;
})(jQuery);

/**
 * Yii form widget.
 *
 * This is the JavaScript widget used by the yii\widgets\ActiveForm widget.
 *
 * @link http://www.yiiframework.com/
 * @copyright Copyright (c) 2008 Yii Software LLC
 * @license http://www.yiiframework.com/license/
 * @author Qiang Xue <qiang.xue@gmail.com>
 * @since 2.0
 */
(function ($) {

    $.fn.yiiActiveForm = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.yiiActiveForm');
            return false;
        }
    };

    var events = {
        /**
         * beforeValidate event is triggered before validating the whole form.
         * The signature of the event handler should be:
         *     function (event, messages, deferreds)
         * where
         *  - event: an Event object.
         *  - messages: an associative array with keys being attribute IDs and values being error message arrays
         *    for the corresponding attributes.
         *  - deferreds: an array of Deferred objects. You can use deferreds.add(callback) to add a new deferred validation.
         *
         * If the handler returns a boolean false, it will stop further form validation after this event. And as
         * a result, afterValidate event will not be triggered.
         */
        beforeValidate: 'beforeValidate',
        /**
         * afterValidate event is triggered after validating the whole form.
         * The signature of the event handler should be:
         *     function (event, messages, errorAttributes)
         * where
         *  - event: an Event object.
         *  - messages: an associative array with keys being attribute IDs and values being error message arrays
         *    for the corresponding attributes.
         *  - errorAttributes: an array of attributes that have validation errors. Please refer to attributeDefaults for the structure of this parameter.
         */
        afterValidate: 'afterValidate',
        /**
         * beforeValidateAttribute event is triggered before validating an attribute.
         * The signature of the event handler should be:
         *     function (event, attribute, messages, deferreds)
         * where
         *  - event: an Event object.
         *  - attribute: the attribute to be validated. Please refer to attributeDefaults for the structure of this parameter.
         *  - messages: an array to which you can add validation error messages for the specified attribute.
         *  - deferreds: an array of Deferred objects. You can use deferreds.add(callback) to add a new deferred validation.
         *
         * If the handler returns a boolean false, it will stop further validation of the specified attribute.
         * And as a result, afterValidateAttribute event will not be triggered.
         */
        beforeValidateAttribute: 'beforeValidateAttribute',
        /**
         * afterValidateAttribute event is triggered after validating the whole form and each attribute.
         * The signature of the event handler should be:
         *     function (event, attribute, messages)
         * where
         *  - event: an Event object.
         *  - attribute: the attribute being validated. Please refer to attributeDefaults for the structure of this parameter.
         *  - messages: an array to which you can add additional validation error messages for the specified attribute.
         */
        afterValidateAttribute: 'afterValidateAttribute',
        /**
         * beforeSubmit event is triggered before submitting the form after all validations have passed.
         * The signature of the event handler should be:
         *     function (event)
         * where event is an Event object.
         *
         * If the handler returns a boolean false, it will stop form submission.
         */
        beforeSubmit: 'beforeSubmit',
        /**
         * ajaxBeforeSend event is triggered before sending an AJAX request for AJAX-based validation.
         * The signature of the event handler should be:
         *     function (event, jqXHR, settings)
         * where
         *  - event: an Event object.
         *  - jqXHR: a jqXHR object
         *  - settings: the settings for the AJAX request
         */
        ajaxBeforeSend: 'ajaxBeforeSend',
        /**
         * ajaxComplete event is triggered after completing an AJAX request for AJAX-based validation.
         * The signature of the event handler should be:
         *     function (event, jqXHR, textStatus)
         * where
         *  - event: an Event object.
         *  - jqXHR: a jqXHR object
         *  - textStatus: the status of the request ("success", "notmodified", "error", "timeout", "abort", or "parsererror").
         */
        ajaxComplete: 'ajaxComplete'
    };

    // NOTE: If you change any of these defaults, make sure you update yii\widgets\ActiveForm::getClientOptions() as well
    var defaults = {
        // whether to encode the error summary
        encodeErrorSummary: true,
        // the jQuery selector for the error summary
        errorSummary: '.error-summary',
        // whether to perform validation before submitting the form.
        validateOnSubmit: true,
        // the container CSS class representing the corresponding attribute has validation error
        errorCssClass: 'has-error',
        // the container CSS class representing the corresponding attribute passes validation
        successCssClass: 'has-success',
        // the container CSS class representing the corresponding attribute is being validated
        validatingCssClass: 'validating',
        // the GET parameter name indicating an AJAX-based validation
        ajaxParam: 'ajax',
        // the type of data that you're expecting back from the server
        ajaxDataType: 'json',
        // the URL for performing AJAX-based validation. If not set, it will use the the form's action
        validationUrl: undefined,
        // whether to scroll to first visible error after validation.
        scrollToError: true
    };

    // NOTE: If you change any of these defaults, make sure you update yii\widgets\ActiveField::getClientOptions() as well
    var attributeDefaults = {
        // a unique ID identifying an attribute (e.g. "loginform-username") in a form
        id: undefined,
        // attribute name or expression (e.g. "[0]content" for tabular input)
        name: undefined,
        // the jQuery selector of the container of the input field
        container: undefined,
        // the jQuery selector of the input field under the context of the form
        input: undefined,
        // the jQuery selector of the error tag under the context of the container
        error: '.help-block',
        // whether to encode the error
        encodeError: true,
        // whether to perform validation when a change is detected on the input
        validateOnChange: true,
        // whether to perform validation when the input loses focus
        validateOnBlur: true,
        // whether to perform validation when the user is typing.
        validateOnType: false,
        // number of milliseconds that the validation should be delayed when a user is typing in the input field.
        validationDelay: 500,
        // whether to enable AJAX-based validation.
        enableAjaxValidation: false,
        // function (attribute, value, messages, deferred, $form), the client-side validation function.
        validate: undefined,
        // status of the input field, 0: empty, not entered before, 1: validated, 2: pending validation, 3: validating
        status: 0,
        // whether the validation is cancelled by beforeValidateAttribute event handler
        cancelled: false,
        // the value of the input
        value: undefined
    };


    var submitDefer;

    var setSubmitFinalizeDefer = function($form) {
        submitDefer = $.Deferred();
        $form.data('yiiSubmitFinalizePromise', submitDefer.promise());
    };

    // finalize yii.js $form.submit
    var submitFinalize = function($form) {
        if(submitDefer) {
            submitDefer.resolve();
            submitDefer = undefined;
            $form.removeData('yiiSubmitFinalizePromise');
        }
    };


    var methods = {
        init: function (attributes, options) {
            return this.each(function () {
                var $form = $(this);
                if ($form.data('yiiActiveForm')) {
                    return;
                }

                var settings = $.extend({}, defaults, options || {});
                if (settings.validationUrl === undefined) {
                    settings.validationUrl = $form.attr('action');
                }

                $.each(attributes, function (i) {
                    attributes[i] = $.extend({value: getValue($form, this)}, attributeDefaults, this);
                    watchAttribute($form, attributes[i]);
                });

                $form.data('yiiActiveForm', {
                    settings: settings,
                    attributes: attributes,
                    submitting: false,
                    validated: false,
                    target: $form.attr('target')
                });

                /**
                 * Clean up error status when the form is reset.
                 * Note that $form.on('reset', ...) does work because the "reset" event does not bubble on IE.
                 */
                $form.bind('reset.yiiActiveForm', methods.resetForm);

                if (settings.validateOnSubmit) {
                    $form.on('mouseup.yiiActiveForm keyup.yiiActiveForm', ':submit', function () {
                        $form.data('yiiActiveForm').submitObject = $(this);
                    });
                    $form.on('submit.yiiActiveForm', methods.submitForm);
                }
            });
        },

        // add a new attribute to the form dynamically.
        // please refer to attributeDefaults for the structure of attribute
        add: function (attribute) {
            var $form = $(this);
            attribute = $.extend({value: getValue($form, attribute)}, attributeDefaults, attribute);
            $form.data('yiiActiveForm').attributes.push(attribute);
            watchAttribute($form, attribute);
        },

        // remove the attribute with the specified ID from the form
        remove: function (id) {
            var $form = $(this),
                attributes = $form.data('yiiActiveForm').attributes,
                index = -1,
                attribute = undefined;
            $.each(attributes, function (i) {
                if (attributes[i]['id'] == id) {
                    index = i;
                    attribute = attributes[i];
                    return false;
                }
            });
            if (index >= 0) {
                attributes.splice(index, 1);
                unwatchAttribute($form, attribute);
            }
            return attribute;
        },

        // manually trigger the validation of the attribute with the specified ID
        validateAttribute: function (id) {
            var attribute = methods.find.call(this, id);
            if (attribute != undefined) {
                validateAttribute($(this), attribute, true);
            }
        },

        // find an attribute config based on the specified attribute ID
        find: function (id) {
            var attributes = $(this).data('yiiActiveForm').attributes,
                result = undefined;
            $.each(attributes, function (i) {
                if (attributes[i]['id'] == id) {
                    result = attributes[i];
                    return false;
                }
            });
            return result;
        },

        destroy: function () {
            return this.each(function () {
                $(this).unbind('.yiiActiveForm');
                $(this).removeData('yiiActiveForm');
            });
        },

        data: function () {
            return this.data('yiiActiveForm');
        },

        // validate all applicable inputs in the form
        validate: function () {
            var $form = $(this),
                data = $form.data('yiiActiveForm'),
                needAjaxValidation = false,
                messages = {},
                deferreds = deferredArray(),
                submitting = data.submitting;

            var event = $.Event(events.beforeValidate);
            $form.trigger(event, [messages, deferreds]);
            if (submitting) {
                if (event.result === false) {
                    data.submitting = false;
                    submitFinalize($form);
                    return;
                }
            }

            // client-side validation
            $.each(data.attributes, function () {
                if (!$(this.input).is(":disabled")) {
                    this.cancelled = false;
                    // perform validation only if the form is being submitted or if an attribute is pending validation
                    if (data.submitting || this.status === 2 || this.status === 3) {
                        var msg = messages[this.id];
                        if (msg === undefined) {
                            msg = [];
                            messages[this.id] = msg;
                        }
                        var event = $.Event(events.beforeValidateAttribute);
                        $form.trigger(event, [this, msg, deferreds]);
                        if (event.result !== false) {
                            if (this.validate) {
                                this.validate(this, getValue($form, this), msg, deferreds, $form);
                            }
                            if (this.enableAjaxValidation) {
                                needAjaxValidation = true;
                            }
                        } else {
                            this.cancelled = true;
                        }
                    }
                }
            });

            // ajax validation
            $.when.apply(this, deferreds).always(function() {
                // Remove empty message arrays
                for (var i in messages) {
                    if (0 === messages[i].length) {
                        delete messages[i];
                    }
                }
                if ($.isEmptyObject(messages) && needAjaxValidation) {
                    var $button = data.submitObject,
                        extData = '&' + data.settings.ajaxParam + '=' + $form.attr('id');
                    if ($button && $button.length && $button.attr('name')) {
                        extData += '&' + $button.attr('name') + '=' + $button.attr('value');
                    }
                    $.ajax({
                        url: data.settings.validationUrl,
                        type: $form.attr('method'),
                        data: $form.serialize() + extData,
                        dataType: data.settings.ajaxDataType,
                        complete: function (jqXHR, textStatus) {
                            $form.trigger(events.ajaxComplete, [jqXHR, textStatus]);
                        },
                        beforeSend: function (jqXHR, settings) {
                            $form.trigger(events.ajaxBeforeSend, [jqXHR, settings]);
                        },
                        success: function (msgs) {
                            if (msgs !== null && typeof msgs === 'object') {
                                $.each(data.attributes, function () {
                                    if (!this.enableAjaxValidation || this.cancelled) {
                                        delete msgs[this.id];
                                    }
                                });
                                updateInputs($form, $.extend(messages, msgs), submitting);
                            } else {
                                updateInputs($form, messages, submitting);
                            }
                        },
                        error: function () {
                            data.submitting = false;
                            submitFinalize($form);
                        }
                    });
                } else if (data.submitting) {
                    // delay callback so that the form can be submitted without problem
                    setTimeout(function () {
                        updateInputs($form, messages, submitting);
                    }, 200);
                } else {
                    updateInputs($form, messages, submitting);
                }
            });
        },

        submitForm: function () {
            var $form = $(this),
                data = $form.data('yiiActiveForm');

            if (data.validated) {
                // Second submit's call (from validate/updateInputs)
                data.submitting = false;
                var event = $.Event(events.beforeSubmit);
                $form.trigger(event);
                if (event.result === false) {
                    data.validated = false;
                    submitFinalize($form);
                    return false;
                }
                updateHiddenButton($form);
                return true;   // continue submitting the form since validation passes
            } else {
                // First submit's call (from yii.js/handleAction) - execute validating
                setSubmitFinalizeDefer($form);

                if (data.settings.timer !== undefined) {
                    clearTimeout(data.settings.timer);
                }
                data.submitting = true;
                methods.validate.call($form);
                return false;
            }
        },

        resetForm: function () {
            var $form = $(this);
            var data = $form.data('yiiActiveForm');
            // Because we bind directly to a form reset event instead of a reset button (that may not exist),
            // when this function is executed form input values have not been reset yet.
            // Therefore we do the actual reset work through setTimeout.
            setTimeout(function () {
                $.each(data.attributes, function () {
                    // Without setTimeout() we would get the input values that are not reset yet.
                    this.value = getValue($form, this);
                    this.status = 0;
                    var $container = $form.find(this.container);
                    $container.removeClass(
                        data.settings.validatingCssClass + ' ' +
                            data.settings.errorCssClass + ' ' +
                            data.settings.successCssClass
                    );
                    $container.find(this.error).html('');
                });
                $form.find(data.settings.errorSummary).hide().find('ul').html('');
            }, 1);
        },

        /**
         * Updates error messages, input containers, and optionally summary as well.
         * If an attribute is missing from messages, it is considered valid.
         * @param messages array the validation error messages, indexed by attribute IDs
         * @param summary whether to update summary as well.
         */
        updateMessages: function (messages, summary) {
            var $form = $(this);
            var data = $form.data('yiiActiveForm');
            $.each(data.attributes, function () {
                updateInput($form, this, messages);
            });
            if (summary) {
                updateSummary($form, messages);
            }
        },

        /**
         * Updates error messages and input container of a single attribute.
         * If messages is empty, the attribute is considered valid.
         * @param id attribute ID
         * @param messages array with error messages
         */
        updateAttribute: function(id, messages) {
            var attribute = methods.find.call(this, id);
            if (attribute != undefined) {
                var msg = {};
                msg[id] = messages;
                updateInput($(this), attribute, msg);
            }
        }

    };

    var watchAttribute = function ($form, attribute) {
        var $input = findInput($form, attribute);
        if (attribute.validateOnChange) {
            $input.on('change.yiiActiveForm', function () {
                validateAttribute($form, attribute, false);
            });
        }
        if (attribute.validateOnBlur) {
            $input.on('blur.yiiActiveForm', function () {
                if (attribute.status == 0 || attribute.status == 1) {
                    validateAttribute($form, attribute, true);
                }
            });
        }
        if (attribute.validateOnType) {
            $input.on('keyup.yiiActiveForm', function (e) {
                if ($.inArray(e.which, [16, 17, 18, 37, 38, 39, 40]) !== -1 ) {
                    return;
                }
                if (attribute.value !== getValue($form, attribute)) {
                    validateAttribute($form, attribute, false, attribute.validationDelay);
                }
            });
        }
    };

    var unwatchAttribute = function ($form, attribute) {
        findInput($form, attribute).off('.yiiActiveForm');
    };

    var validateAttribute = function ($form, attribute, forceValidate, validationDelay) {
        var data = $form.data('yiiActiveForm');

        if (forceValidate) {
            attribute.status = 2;
        }
        $.each(data.attributes, function () {
            if (this.value !== getValue($form, this)) {
                this.status = 2;
                forceValidate = true;
            }
        });
        if (!forceValidate) {
            return;
        }

        if (data.settings.timer !== undefined) {
            clearTimeout(data.settings.timer);
        }
        data.settings.timer = setTimeout(function () {
            if (data.submitting || $form.is(':hidden')) {
                return;
            }
            $.each(data.attributes, function () {
                if (this.status === 2) {
                    this.status = 3;
                    $form.find(this.container).addClass(data.settings.validatingCssClass);
                }
            });
            methods.validate.call($form);
        }, validationDelay ? validationDelay : 200);
    };

    /**
     * Returns an array prototype with a shortcut method for adding a new deferred.
     * The context of the callback will be the deferred object so it can be resolved like ```this.resolve()```
     * @returns Array
     */
    var deferredArray = function () {
        var array = [];
        array.add = function(callback) {
            this.push(new $.Deferred(callback));
        };
        return array;
    };

    /**
     * Updates the error messages and the input containers for all applicable attributes
     * @param $form the form jQuery object
     * @param messages array the validation error messages
     * @param submitting whether this method is called after validation triggered by form submission
     */
    var updateInputs = function ($form, messages, submitting) {
        var data = $form.data('yiiActiveForm');

        if (submitting) {
            var errorAttributes = [];
            $.each(data.attributes, function () {
                if (!$(this.input).is(":disabled") && !this.cancelled && updateInput($form, this, messages)) {
                    errorAttributes.push(this);
                }
            });

            $form.trigger(events.afterValidate, [messages, errorAttributes]);

            updateSummary($form, messages);

            if (errorAttributes.length) {
                if (data.settings.scrollToError) {
                    var top = $form.find($.map(errorAttributes, function(attribute) {
                        return attribute.input;
                    }).join(',')).first().closest(':visible').offset().top;
                    var wtop = $(window).scrollTop();
                    if (top < wtop || top > wtop + $(window).height()) {
                        $(window).scrollTop(top);
                    }
                }
                data.submitting = false;
            } else {
                data.validated = true;
                var buttonTarget = data.submitObject ? data.submitObject.attr('formtarget') : null;
                if (buttonTarget) {
                    // set target attribute to form tag before submit
                    $form.attr('target', buttonTarget);
                }
                $form.submit();
                // restore original target attribute value
                $form.attr('target', data.target);
            }
        } else {
            $.each(data.attributes, function () {
                if (!this.cancelled && (this.status === 2 || this.status === 3)) {
                    updateInput($form, this, messages);
                }
            });
        }
        submitFinalize($form);
    };

    /**
     * Updates hidden field that represents clicked submit button.
     * @param $form the form jQuery object.
     */
    var updateHiddenButton = function ($form) {
        var data = $form.data('yiiActiveForm');
        var $button = data.submitObject || $form.find(':submit:first');
        // TODO: if the submission is caused by "change" event, it will not work
        if ($button.length && $button.attr('type') == 'submit' && $button.attr('name')) {
            // simulate button input value
            var $hiddenButton = $('input[type="hidden"][name="' + $button.attr('name') + '"]', $form);
            if (!$hiddenButton.length) {
                $('<input>').attr({
                    type: 'hidden',
                    name: $button.attr('name'),
                    value: $button.attr('value')
                }).appendTo($form);
            } else {
                $hiddenButton.attr('value', $button.attr('value'));
            }
        }
    };

    /**
     * Updates the error message and the input container for a particular attribute.
     * @param $form the form jQuery object
     * @param attribute object the configuration for a particular attribute.
     * @param messages array the validation error messages
     * @return boolean whether there is a validation error for the specified attribute
     */
    var updateInput = function ($form, attribute, messages) {
        var data = $form.data('yiiActiveForm'),
            $input = findInput($form, attribute),
            hasError = false;

        if (!$.isArray(messages[attribute.id])) {
            messages[attribute.id] = [];
        }
        $form.trigger(events.afterValidateAttribute, [attribute, messages[attribute.id]]);

        attribute.status = 1;
        if ($input.length) {
            hasError = messages[attribute.id].length > 0;
            var $container = $form.find(attribute.container);
            var $error = $container.find(attribute.error);
            if (hasError) {
                if (attribute.encodeError) {
                    $error.text(messages[attribute.id][0]);
                } else {
                    $error.html(messages[attribute.id][0]);
                }
                $container.removeClass(data.settings.validatingCssClass + ' ' + data.settings.successCssClass)
                    .addClass(data.settings.errorCssClass);
            } else {
                $error.empty();
                $container.removeClass(data.settings.validatingCssClass + ' ' + data.settings.errorCssClass + ' ')
                    .addClass(data.settings.successCssClass);
            }
            attribute.value = getValue($form, attribute);
        }
        return hasError;
    };

    /**
     * Updates the error summary.
     * @param $form the form jQuery object
     * @param messages array the validation error messages
     */
    var updateSummary = function ($form, messages) {
        var data = $form.data('yiiActiveForm'),
            $summary = $form.find(data.settings.errorSummary),
            $ul = $summary.find('ul').empty();

        if ($summary.length && messages) {
            $.each(data.attributes, function () {
                if ($.isArray(messages[this.id]) && messages[this.id].length) {
                    var error = $('<li/>');
                    if (data.settings.encodeErrorSummary) {
                        error.text(messages[this.id][0]);
                    } else {
                        error.html(messages[this.id][0]);
                    }
                    $ul.append(error);
                }
            });
            $summary.toggle($ul.find('li').length > 0);
        }
    };

    var getValue = function ($form, attribute) {
        var $input = findInput($form, attribute);
        var type = $input.attr('type');
        if (type === 'checkbox' || type === 'radio') {
            var $realInput = $input.filter(':checked');
            if (!$realInput.length) {
                $realInput = $form.find('input[type=hidden][name="' + $input.attr('name') + '"]');
            }
            return $realInput.val();
        } else {
            return $input.val();
        }
    };

    var findInput = function ($form, attribute) {
        var $input = $form.find(attribute.input);
        if ($input.length && $input[0].tagName.toLowerCase() === 'div') {
            // checkbox list or radio list
            return $input.find('input');
        } else {
            return $input;
        }
    };

})(window.jQuery);



//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInlpaS5qcyIsInlpaS52YWxpZGF0aW9uLmpzIiwieWlpLmFjdGl2ZUZvcm0uanMiLCJkZXBkcm9wLmpzIiwiYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDamFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbGNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdnNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImN1c3RvbS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogWWlpIEphdmFTY3JpcHQgbW9kdWxlLlxuICpcbiAqIEBsaW5rIGh0dHA6Ly93d3cueWlpZnJhbWV3b3JrLmNvbS9cbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDA4IFlpaSBTb2Z0d2FyZSBMTENcbiAqIEBsaWNlbnNlIGh0dHA6Ly93d3cueWlpZnJhbWV3b3JrLmNvbS9saWNlbnNlL1xuICogQGF1dGhvciBRaWFuZyBYdWUgPHFpYW5nLnh1ZUBnbWFpbC5jb20+XG4gKiBAc2luY2UgMi4wXG4gKi9cblxuLyoqXG4gKiB5aWkgaXMgdGhlIHJvb3QgbW9kdWxlIGZvciBhbGwgWWlpIEphdmFTY3JpcHQgbW9kdWxlcy5cbiAqIEl0IGltcGxlbWVudHMgYSBtZWNoYW5pc20gb2Ygb3JnYW5pemluZyBKYXZhU2NyaXB0IGNvZGUgaW4gbW9kdWxlcyB0aHJvdWdoIHRoZSBmdW5jdGlvbiBcInlpaS5pbml0TW9kdWxlKClcIi5cbiAqXG4gKiBFYWNoIG1vZHVsZSBzaG91bGQgYmUgbmFtZWQgYXMgXCJ4LnkuelwiLCB3aGVyZSBcInhcIiBzdGFuZHMgZm9yIHRoZSByb290IG1vZHVsZSAoZm9yIHRoZSBZaWkgY29yZSBjb2RlLCB0aGlzIGlzIFwieWlpXCIpLlxuICpcbiAqIEEgbW9kdWxlIG1heSBiZSBzdHJ1Y3R1cmVkIGFzIGZvbGxvd3M6XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogeWlpLnNhbXBsZSA9IChmdW5jdGlvbigkKSB7XG4gKiAgICAgdmFyIHB1YiA9IHtcbiAqICAgICAgICAgLy8gd2hldGhlciB0aGlzIG1vZHVsZSBpcyBjdXJyZW50bHkgYWN0aXZlLiBJZiBmYWxzZSwgaW5pdCgpIHdpbGwgbm90IGJlIGNhbGxlZCBmb3IgdGhpcyBtb2R1bGVcbiAqICAgICAgICAgLy8gaXQgd2lsbCBhbHNvIG5vdCBiZSBjYWxsZWQgZm9yIGFsbCBpdHMgY2hpbGQgbW9kdWxlcy4gSWYgdGhpcyBwcm9wZXJ0eSBpcyB1bmRlZmluZWQsIGl0IG1lYW5zIHRydWUuXG4gKiAgICAgICAgIGlzQWN0aXZlOiB0cnVlLFxuICogICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAqICAgICAgICAgICAgIC8vIC4uLiBtb2R1bGUgaW5pdGlhbGl6YXRpb24gY29kZSBnbyBoZXJlIC4uLlxuICogICAgICAgICB9LFxuICpcbiAqICAgICAgICAgLy8gLi4uIG90aGVyIHB1YmxpYyBmdW5jdGlvbnMgYW5kIHByb3BlcnRpZXMgZ28gaGVyZSAuLi5cbiAqICAgICB9O1xuICpcbiAqICAgICAvLyAuLi4gcHJpdmF0ZSBmdW5jdGlvbnMgYW5kIHByb3BlcnRpZXMgZ28gaGVyZSAuLi5cbiAqXG4gKiAgICAgcmV0dXJuIHB1YjtcbiAqIH0pKGpRdWVyeSk7XG4gKiBgYGBcbiAqXG4gKiBVc2luZyB0aGlzIHN0cnVjdHVyZSwgeW91IGNhbiBkZWZpbmUgcHVibGljIGFuZCBwcml2YXRlIGZ1bmN0aW9ucy9wcm9wZXJ0aWVzIGZvciBhIG1vZHVsZS5cbiAqIFByaXZhdGUgZnVuY3Rpb25zL3Byb3BlcnRpZXMgYXJlIG9ubHkgdmlzaWJsZSB3aXRoaW4gdGhlIG1vZHVsZSwgd2hpbGUgcHVibGljIGZ1bmN0aW9ucy9wcm9wZXJ0aWVzXG4gKiBtYXkgYmUgYWNjZXNzZWQgb3V0c2lkZSBvZiB0aGUgbW9kdWxlLiBGb3IgZXhhbXBsZSwgeW91IGNhbiBhY2Nlc3MgXCJ5aWkuc2FtcGxlLmlzQWN0aXZlXCIuXG4gKlxuICogWW91IG11c3QgY2FsbCBcInlpaS5pbml0TW9kdWxlKClcIiBvbmNlIGZvciB0aGUgcm9vdCBtb2R1bGUgb2YgYWxsIHlvdXIgbW9kdWxlcy5cbiAqL1xueWlpID0gKGZ1bmN0aW9uICgkKSB7XG4gICAgdmFyIHB1YiA9IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIExpc3Qgb2YgSlMgb3IgQ1NTIFVSTHMgdGhhdCBjYW4gYmUgbG9hZGVkIG11bHRpcGxlIHRpbWVzIHZpYSBBSkFYIHJlcXVlc3RzLiBFYWNoIHNjcmlwdCBjYW4gYmUgcmVwcmVzZW50ZWRcbiAgICAgICAgICogYXMgZWl0aGVyIGFuIGFic29sdXRlIFVSTCBvciBhIHJlbGF0aXZlIG9uZS5cbiAgICAgICAgICovXG4gICAgICAgIHJlbG9hZGFibGVTY3JpcHRzOiBbXSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBzZWxlY3RvciBmb3IgY2xpY2thYmxlIGVsZW1lbnRzIHRoYXQgbmVlZCB0byBzdXBwb3J0IGNvbmZpcm1hdGlvbiBhbmQgZm9ybSBzdWJtaXNzaW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgY2xpY2thYmxlU2VsZWN0b3I6ICdhLCBidXR0b24sIGlucHV0W3R5cGU9XCJzdWJtaXRcIl0sIGlucHV0W3R5cGU9XCJidXR0b25cIl0sIGlucHV0W3R5cGU9XCJyZXNldFwiXSwgaW5wdXRbdHlwZT1cImltYWdlXCJdJyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBzZWxlY3RvciBmb3IgY2hhbmdlYWJsZSBlbGVtZW50cyB0aGF0IG5lZWQgdG8gc3VwcG9ydCBjb25maXJtYXRpb24gYW5kIGZvcm0gc3VibWlzc2lvbi5cbiAgICAgICAgICovXG4gICAgICAgIGNoYW5nZWFibGVTZWxlY3RvcjogJ3NlbGVjdCwgaW5wdXQsIHRleHRhcmVhJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHJldHVybiBzdHJpbmd8dW5kZWZpbmVkIHRoZSBDU1JGIHBhcmFtZXRlciBuYW1lLiBVbmRlZmluZWQgaXMgcmV0dXJuZWQgaWYgQ1NSRiB2YWxpZGF0aW9uIGlzIG5vdCBlbmFibGVkLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0Q3NyZlBhcmFtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJCgnbWV0YVtuYW1lPWNzcmYtcGFyYW1dJykuYXR0cignY29udGVudCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJuIHN0cmluZ3x1bmRlZmluZWQgdGhlIENTUkYgdG9rZW4uIFVuZGVmaW5lZCBpcyByZXR1cm5lZCBpZiBDU1JGIHZhbGlkYXRpb24gaXMgbm90IGVuYWJsZWQuXG4gICAgICAgICAqL1xuICAgICAgICBnZXRDc3JmVG9rZW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkKCdtZXRhW25hbWU9Y3NyZi10b2tlbl0nKS5hdHRyKCdjb250ZW50Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIENTUkYgdG9rZW4gaW4gdGhlIG1ldGEgZWxlbWVudHMuXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIGlzIHByb3ZpZGVkIHNvIHRoYXQgeW91IGNhbiB1cGRhdGUgdGhlIENTUkYgdG9rZW4gd2l0aCB0aGUgbGF0ZXN0IG9uZSB5b3Ugb2J0YWluIGZyb20gdGhlIHNlcnZlci5cbiAgICAgICAgICogQHBhcmFtIG5hbWUgdGhlIENTUkYgdG9rZW4gbmFtZVxuICAgICAgICAgKiBAcGFyYW0gdmFsdWUgdGhlIENTUkYgdG9rZW4gdmFsdWVcbiAgICAgICAgICovXG4gICAgICAgIHNldENzcmZUb2tlbjogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICAkKCdtZXRhW25hbWU9Y3NyZi1wYXJhbV0nKS5hdHRyKCdjb250ZW50JywgbmFtZSk7XG4gICAgICAgICAgICAkKCdtZXRhW25hbWU9Y3NyZi10b2tlbl0nKS5hdHRyKCdjb250ZW50JywgdmFsdWUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGVzIGFsbCBmb3JtIENTUkYgaW5wdXQgZmllbGRzIHdpdGggdGhlIGxhdGVzdCBDU1JGIHRva2VuLlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCBpcyBwcm92aWRlZCB0byBhdm9pZCBjYWNoZWQgZm9ybXMgY29udGFpbmluZyBvdXRkYXRlZCBDU1JGIHRva2Vucy5cbiAgICAgICAgICovXG4gICAgICAgIHJlZnJlc2hDc3JmVG9rZW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IHB1Yi5nZXRDc3JmVG9rZW4oKTtcbiAgICAgICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgICAgICQoJ2Zvcm0gaW5wdXRbbmFtZT1cIicgKyBwdWIuZ2V0Q3NyZlBhcmFtKCkgKyAnXCJdJykudmFsKHRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzcGxheXMgYSBjb25maXJtYXRpb24gZGlhbG9nLlxuICAgICAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBzaW1wbHkgZGlzcGxheXMgYSBqcyBjb25maXJtYXRpb24gZGlhbG9nLlxuICAgICAgICAgKiBZb3UgbWF5IG92ZXJyaWRlIHRoaXMgYnkgc2V0dGluZyBgeWlpLmNvbmZpcm1gLlxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZSB0aGUgY29uZmlybWF0aW9uIG1lc3NhZ2UuXG4gICAgICAgICAqIEBwYXJhbSBvayBhIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSB1c2VyIGNvbmZpcm1zIHRoZSBtZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSBjYW5jZWwgYSBjYWxsYmFjayB0byBiZSBjYWxsZWQgd2hlbiB0aGUgdXNlciBjYW5jZWxzIHRoZSBjb25maXJtYXRpb25cbiAgICAgICAgICovXG4gICAgICAgIGNvbmZpcm06IGZ1bmN0aW9uIChtZXNzYWdlLCBvaywgY2FuY2VsKSB7XG4gICAgICAgICAgICBpZiAoY29uZmlybShtZXNzYWdlKSkge1xuICAgICAgICAgICAgICAgICFvayB8fCBvaygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAhY2FuY2VsIHx8IGNhbmNlbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIHRoZSBhY3Rpb24gdHJpZ2dlcmVkIGJ5IHVzZXIuXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIHJlY29nbml6ZXMgdGhlIGBkYXRhLW1ldGhvZGAgYXR0cmlidXRlIG9mIHRoZSBlbGVtZW50LiBJZiB0aGUgYXR0cmlidXRlIGV4aXN0cyxcbiAgICAgICAgICogdGhlIG1ldGhvZCB3aWxsIHN1Ym1pdCB0aGUgZm9ybSBjb250YWluaW5nIHRoaXMgZWxlbWVudC4gSWYgdGhlcmUgaXMgbm8gY29udGFpbmluZyBmb3JtLCBhIGZvcm1cbiAgICAgICAgICogd2lsbCBiZSBjcmVhdGVkIGFuZCBzdWJtaXR0ZWQgdXNpbmcgdGhlIG1ldGhvZCBnaXZlbiBieSB0aGlzIGF0dHJpYnV0ZSB2YWx1ZSAoZS5nLiBcInBvc3RcIiwgXCJwdXRcIikuXG4gICAgICAgICAqIEZvciBoeXBlcmxpbmtzLCB0aGUgZm9ybSBhY3Rpb24gd2lsbCB0YWtlIHRoZSB2YWx1ZSBvZiB0aGUgXCJocmVmXCIgYXR0cmlidXRlIG9mIHRoZSBsaW5rLlxuICAgICAgICAgKiBGb3Igb3RoZXIgZWxlbWVudHMsIGVpdGhlciB0aGUgY29udGFpbmluZyBmb3JtIGFjdGlvbiBvciB0aGUgY3VycmVudCBwYWdlIFVSTCB3aWxsIGJlIHVzZWRcbiAgICAgICAgICogYXMgdGhlIGZvcm0gYWN0aW9uIFVSTC5cbiAgICAgICAgICpcbiAgICAgICAgICogSWYgdGhlIGBkYXRhLW1ldGhvZGAgYXR0cmlidXRlIGlzIG5vdCBkZWZpbmVkLCB0aGUgYGhyZWZgIGF0dHJpYnV0ZSAoaWYgYW55KSBvZiB0aGUgZWxlbWVudFxuICAgICAgICAgKiB3aWxsIGJlIGFzc2lnbmVkIHRvIGB3aW5kb3cubG9jYXRpb25gLlxuICAgICAgICAgKlxuICAgICAgICAgKiBTdGFydGluZyBmcm9tIHZlcnNpb24gMi4wLjMsIHRoZSBgZGF0YS1wYXJhbXNgIGF0dHJpYnV0ZSBpcyBhbHNvIHJlY29nbml6ZWQgd2hlbiB5b3Ugc3BlY2lmeVxuICAgICAgICAgKiBgZGF0YS1tZXRob2RgLiBUaGUgdmFsdWUgb2YgYGRhdGEtcGFyYW1zYCBzaG91bGQgYmUgYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBkYXRhIChuYW1lLXZhbHVlIHBhaXJzKVxuICAgICAgICAgKiB0aGF0IHNob3VsZCBiZSBzdWJtaXR0ZWQgYXMgaGlkZGVuIGlucHV0cy4gRm9yIGV4YW1wbGUsIHlvdSBtYXkgdXNlIHRoZSBmb2xsb3dpbmcgY29kZSB0byBnZW5lcmF0ZVxuICAgICAgICAgKiBzdWNoIGEgbGluazpcbiAgICAgICAgICpcbiAgICAgICAgICogYGBgcGhwXG4gICAgICAgICAqIHVzZSB5aWlcXGhlbHBlcnNcXEh0bWw7XG4gICAgICAgICAqIHVzZSB5aWlcXGhlbHBlcnNcXEpzb247XG4gICAgICAgICAqXG4gICAgICAgICAqIGVjaG8gSHRtbDo6YSgnc3VibWl0JywgWydzaXRlL2Zvb2JhciddLCBbXG4gICAgICAgICAqICAgICAnZGF0YScgPT4gW1xuICAgICAgICAgKiAgICAgICAgICdtZXRob2QnID0+ICdwb3N0JyxcbiAgICAgICAgICogICAgICAgICAncGFyYW1zJyA9PiBbXG4gICAgICAgICAqICAgICAgICAgICAgICduYW1lMScgPT4gJ3ZhbHVlMScsXG4gICAgICAgICAqICAgICAgICAgICAgICduYW1lMicgPT4gJ3ZhbHVlMicsXG4gICAgICAgICAqICAgICAgICAgXSxcbiAgICAgICAgICogICAgIF0sXG4gICAgICAgICAqIF07XG4gICAgICAgICAqIGBgYFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gJGUgdGhlIGpRdWVyeSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZWxlbWVudFxuICAgICAgICAgKi9cbiAgICAgICAgaGFuZGxlQWN0aW9uOiBmdW5jdGlvbiAoJGUsIGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgJGZvcm0gPSAkZS5hdHRyKCdkYXRhLWZvcm0nKSA/ICQoJyMnICsgJGUuYXR0cignZGF0YS1mb3JtJykpIDogJGUuY2xvc2VzdCgnZm9ybScpLFxuICAgICAgICAgICAgICAgIG1ldGhvZCA9ICEkZS5kYXRhKCdtZXRob2QnKSAmJiAkZm9ybSA/ICRmb3JtLmF0dHIoJ21ldGhvZCcpIDogJGUuZGF0YSgnbWV0aG9kJyksXG4gICAgICAgICAgICAgICAgYWN0aW9uID0gJGUuYXR0cignaHJlZicpLFxuICAgICAgICAgICAgICAgIHBhcmFtcyA9ICRlLmRhdGEoJ3BhcmFtcycpLFxuICAgICAgICAgICAgICAgIHBqYXggPSAkZS5kYXRhKCdwamF4JyksXG4gICAgICAgICAgICAgICAgcGpheFB1c2hTdGF0ZSA9ICEhJGUuZGF0YSgncGpheC1wdXNoLXN0YXRlJyksXG4gICAgICAgICAgICAgICAgcGpheFJlcGxhY2VTdGF0ZSA9ICEhJGUuZGF0YSgncGpheC1yZXBsYWNlLXN0YXRlJyksXG4gICAgICAgICAgICAgICAgcGpheFRpbWVvdXQgPSAkZS5kYXRhKCdwamF4LXRpbWVvdXQnKSxcbiAgICAgICAgICAgICAgICBwamF4U2Nyb2xsVG8gPSAkZS5kYXRhKCdwamF4LXNjcm9sbHRvJyksXG4gICAgICAgICAgICAgICAgcGpheFB1c2hSZWRpcmVjdCA9ICRlLmRhdGEoJ3BqYXgtcHVzaC1yZWRpcmVjdCcpLFxuICAgICAgICAgICAgICAgIHBqYXhSZXBsYWNlUmVkaXJlY3QgPSAkZS5kYXRhKCdwamF4LXJlcGxhY2UtcmVkaXJlY3QnKSxcbiAgICAgICAgICAgICAgICBwamF4U2tpcE91dGVyQ29udGFpbmVycyA9ICRlLmRhdGEoJ3BqYXgtc2tpcC1vdXRlci1jb250YWluZXJzJyksXG4gICAgICAgICAgICAgICAgcGpheENvbnRhaW5lcixcbiAgICAgICAgICAgICAgICBwamF4T3B0aW9ucyA9IHt9O1xuXG4gICAgICAgICAgICBpZiAocGpheCAhPT0gdW5kZWZpbmVkICYmICQuc3VwcG9ydC5wamF4KSB7XG4gICAgICAgICAgICAgICAgaWYgKCRlLmRhdGEoJ3BqYXgtY29udGFpbmVyJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcGpheENvbnRhaW5lciA9ICRlLmRhdGEoJ3BqYXgtY29udGFpbmVyJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGpheENvbnRhaW5lciA9ICRlLmNsb3Nlc3QoJ1tkYXRhLXBqYXgtY29udGFpbmVyPVwiXCJdJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgdG8gYm9keSBpZiBwamF4IGNvbnRhaW5lciBub3QgZm91bmRcbiAgICAgICAgICAgICAgICBpZiAoIXBqYXhDb250YWluZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHBqYXhDb250YWluZXIgPSAkKCdib2R5Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBqYXhPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBjb250YWluZXI6IHBqYXhDb250YWluZXIsXG4gICAgICAgICAgICAgICAgICAgIHB1c2g6IHBqYXhQdXNoU3RhdGUsXG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2U6IHBqYXhSZXBsYWNlU3RhdGUsXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvOiBwamF4U2Nyb2xsVG8sXG4gICAgICAgICAgICAgICAgICAgIHB1c2hSZWRpcmVjdDogcGpheFB1c2hSZWRpcmVjdCxcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZVJlZGlyZWN0OiBwamF4UmVwbGFjZVJlZGlyZWN0LFxuICAgICAgICAgICAgICAgICAgICBwamF4U2tpcE91dGVyQ29udGFpbmVyczogcGpheFNraXBPdXRlckNvbnRhaW5lcnMsXG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IHBqYXhUaW1lb3V0LFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudCxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxUYXJnZXQ6ICRlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uICYmIGFjdGlvbiAhPSAnIycpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBqYXggIT09IHVuZGVmaW5lZCAmJiAkLnN1cHBvcnQucGpheCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5wamF4LmNsaWNrKGV2ZW50LCBwamF4T3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBhY3Rpb247XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCRlLmlzKCc6c3VibWl0JykgJiYgJGZvcm0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwamF4ICE9PSB1bmRlZmluZWQgJiYgJC5zdXBwb3J0LnBqYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLm9uKCdzdWJtaXQnLGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQucGpheC5zdWJtaXQoZSwgcGpheE9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkZm9ybS50cmlnZ2VyKCdzdWJtaXQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbmV3Rm9ybSA9ICEkZm9ybS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAobmV3Rm9ybSkge1xuICAgICAgICAgICAgICAgIGlmICghYWN0aW9uIHx8ICFhY3Rpb24ubWF0Y2goLyheXFwvfDpcXC9cXC8pLykpIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRmb3JtID0gJCgnPGZvcm0vPicsIHttZXRob2Q6IG1ldGhvZCwgYWN0aW9uOiBhY3Rpb259KTtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gJGUuYXR0cigndGFyZ2V0Jyk7XG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICAkZm9ybS5hdHRyKCd0YXJnZXQnLCB0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIW1ldGhvZC5tYXRjaCgvKGdldHxwb3N0KS9pKSkge1xuICAgICAgICAgICAgICAgICAgICAkZm9ybS5hcHBlbmQoJCgnPGlucHV0Lz4nLCB7bmFtZTogJ19tZXRob2QnLCB2YWx1ZTogbWV0aG9kLCB0eXBlOiAnaGlkZGVuJ30pKTtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kID0gJ1BPU1QnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIW1ldGhvZC5tYXRjaCgvKGdldHxoZWFkfG9wdGlvbnMpL2kpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjc3JmUGFyYW0gPSBwdWIuZ2V0Q3NyZlBhcmFtKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjc3JmUGFyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLmFwcGVuZCgkKCc8aW5wdXQvPicsIHtuYW1lOiBjc3JmUGFyYW0sIHZhbHVlOiBwdWIuZ2V0Q3NyZlRva2VuKCksIHR5cGU6ICdoaWRkZW4nfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRmb3JtLmhpZGUoKS5hcHBlbmRUbygnYm9keScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYWN0aXZlRm9ybURhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyk7XG4gICAgICAgICAgICBpZiAoYWN0aXZlRm9ybURhdGEpIHtcbiAgICAgICAgICAgICAgICAvLyByZW1lbWJlciB3aG8gdHJpZ2dlcnMgdGhlIGZvcm0gc3VibWlzc2lvbi4gVGhpcyBpcyB1c2VkIGJ5IHlpaS5hY3RpdmVGb3JtLmpzXG4gICAgICAgICAgICAgICAgYWN0aXZlRm9ybURhdGEuc3VibWl0T2JqZWN0ID0gJGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHRlbXBvcmFyaWx5IGFkZCBoaWRkZW4gaW5wdXRzIGFjY29yZGluZyB0byBkYXRhLXBhcmFtc1xuICAgICAgICAgICAgaWYgKHBhcmFtcyAmJiAkLmlzUGxhaW5PYmplY3QocGFyYW1zKSkge1xuICAgICAgICAgICAgICAgICQuZWFjaChwYXJhbXMsIGZ1bmN0aW9uIChpZHgsIG9iaikge1xuICAgICAgICAgICAgICAgICAgICAkZm9ybS5hcHBlbmQoJCgnPGlucHV0Lz4nKS5hdHRyKHtuYW1lOiBpZHgsIHZhbHVlOiBvYmosIHR5cGU6ICdoaWRkZW4nfSkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgb2xkTWV0aG9kID0gJGZvcm0uYXR0cignbWV0aG9kJyk7XG4gICAgICAgICAgICAkZm9ybS5hdHRyKCdtZXRob2QnLCBtZXRob2QpO1xuICAgICAgICAgICAgdmFyIG9sZEFjdGlvbiA9IG51bGw7XG4gICAgICAgICAgICBpZiAoYWN0aW9uICYmIGFjdGlvbiAhPSAnIycpIHtcbiAgICAgICAgICAgICAgICBvbGRBY3Rpb24gPSAkZm9ybS5hdHRyKCdhY3Rpb24nKTtcbiAgICAgICAgICAgICAgICAkZm9ybS5hdHRyKCdhY3Rpb24nLCBhY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBqYXggIT09IHVuZGVmaW5lZCAmJiAkLnN1cHBvcnQucGpheCkge1xuICAgICAgICAgICAgICAgICRmb3JtLm9uKCdzdWJtaXQnLGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgICAgICAkLnBqYXguc3VibWl0KGUsIHBqYXhPcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJGZvcm0udHJpZ2dlcignc3VibWl0Jyk7XG4gICAgICAgICAgICAkLndoZW4oJGZvcm0uZGF0YSgneWlpU3VibWl0RmluYWxpemVQcm9taXNlJykpLnRoZW4oXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2xkQWN0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLmF0dHIoJ2FjdGlvbicsIG9sZEFjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJGZvcm0uYXR0cignbWV0aG9kJywgb2xkTWV0aG9kKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgdGhlIHRlbXBvcmFyaWx5IGFkZGVkIGhpZGRlbiBpbnB1dHNcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtcyAmJiAkLmlzUGxhaW5PYmplY3QocGFyYW1zKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKHBhcmFtcywgZnVuY3Rpb24gKGlkeCwgb2JqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cIicgKyBpZHggKyAnXCJdJywgJGZvcm0pLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAobmV3Rm9ybSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFF1ZXJ5UGFyYW1zOiBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgICAgICB2YXIgcG9zID0gdXJsLmluZGV4T2YoJz8nKTtcbiAgICAgICAgICAgIGlmIChwb3MgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcGFpcnMgPSB1cmwuc3Vic3RyaW5nKHBvcyArIDEpLnNwbGl0KCcjJylbMF0uc3BsaXQoJyYnKSxcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSB7fSxcbiAgICAgICAgICAgICAgICBwYWlyLFxuICAgICAgICAgICAgICAgIGk7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwYWlycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHBhaXIgPSBwYWlyc1tpXS5zcGxpdCgnPScpO1xuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMF0pO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGRlY29kZVVSSUNvbXBvbmVudChwYWlyWzFdKTtcbiAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtc1tuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISQuaXNBcnJheShwYXJhbXNbbmFtZV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zW25hbWVdID0gW3BhcmFtc1tuYW1lXV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXNbbmFtZV0ucHVzaCh2YWx1ZSB8fCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXNbbmFtZV0gPSB2YWx1ZSB8fCAnJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwYXJhbXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdE1vZHVsZTogZnVuY3Rpb24gKG1vZHVsZSkge1xuICAgICAgICAgICAgaWYgKG1vZHVsZS5pc0FjdGl2ZSA9PT0gdW5kZWZpbmVkIHx8IG1vZHVsZS5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgICAgIGlmICgkLmlzRnVuY3Rpb24obW9kdWxlLmluaXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZS5pbml0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQuZWFjaChtb2R1bGUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQuaXNQbGFpbk9iamVjdCh0aGlzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHViLmluaXRNb2R1bGUodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpbml0Q3NyZkhhbmRsZXIoKTtcbiAgICAgICAgICAgIGluaXRSZWRpcmVjdEhhbmRsZXIoKTtcbiAgICAgICAgICAgIGluaXRTY3JpcHRGaWx0ZXIoKTtcbiAgICAgICAgICAgIGluaXREYXRhTWV0aG9kcygpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGluaXRSZWRpcmVjdEhhbmRsZXIoKSB7XG4gICAgICAgIC8vIGhhbmRsZSBBSkFYIHJlZGlyZWN0aW9uXG4gICAgICAgICQoZG9jdW1lbnQpLmFqYXhDb21wbGV0ZShmdW5jdGlvbiAoZXZlbnQsIHhociwgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSB4aHIgJiYgeGhyLmdldFJlc3BvbnNlSGVhZGVyKCdYLVJlZGlyZWN0Jyk7XG4gICAgICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gdXJsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0Q3NyZkhhbmRsZXIoKSB7XG4gICAgICAgIC8vIGF1dG9tYXRpY2FsbHkgc2VuZCBDU1JGIHRva2VuIGZvciBhbGwgQUpBWCByZXF1ZXN0c1xuICAgICAgICAkLmFqYXhQcmVmaWx0ZXIoZnVuY3Rpb24gKG9wdGlvbnMsIG9yaWdpbmFsT3B0aW9ucywgeGhyKSB7XG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuY3Jvc3NEb21haW4gJiYgcHViLmdldENzcmZQYXJhbSgpKSB7XG4gICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtQ1NSRi1Ub2tlbicsIHB1Yi5nZXRDc3JmVG9rZW4oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBwdWIucmVmcmVzaENzcmZUb2tlbigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXREYXRhTWV0aG9kcygpIHtcbiAgICAgICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgbWV0aG9kID0gJHRoaXMuZGF0YSgnbWV0aG9kJyksXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9ICR0aGlzLmRhdGEoJ2NvbmZpcm0nKSxcbiAgICAgICAgICAgICAgICBmb3JtID0gJHRoaXMuZGF0YSgnZm9ybScpO1xuXG4gICAgICAgICAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQgJiYgbWVzc2FnZSA9PT0gdW5kZWZpbmVkICYmIGZvcm0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWVzc2FnZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgJC5wcm94eShwdWIuY29uZmlybSwgdGhpcykobWVzc2FnZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBwdWIuaGFuZGxlQWN0aW9uKCR0aGlzLCBldmVudCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHB1Yi5oYW5kbGVBY3Rpb24oJHRoaXMsIGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGhhbmRsZSBkYXRhLWNvbmZpcm0gYW5kIGRhdGEtbWV0aG9kIGZvciBjbGlja2FibGUgYW5kIGNoYW5nZWFibGUgZWxlbWVudHNcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrLnlpaScsIHB1Yi5jbGlja2FibGVTZWxlY3RvciwgaGFuZGxlcilcbiAgICAgICAgICAgIC5vbignY2hhbmdlLnlpaScsIHB1Yi5jaGFuZ2VhYmxlU2VsZWN0b3IsIGhhbmRsZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXRTY3JpcHRGaWx0ZXIoKSB7XG4gICAgICAgIHZhciBob3N0SW5mbyA9IGxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIGxvY2F0aW9uLmhvc3Q7XG5cbiAgICAgICAgdmFyIGxvYWRlZFNjcmlwdHMgPSAkKCdzY3JpcHRbc3JjXScpLm1hcChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zcmMuY2hhckF0KDApID09PSAnLycgPyBob3N0SW5mbyArIHRoaXMuc3JjIDogdGhpcy5zcmM7XG4gICAgICAgIH0pLnRvQXJyYXkoKTtcblxuICAgICAgICAkLmFqYXhQcmVmaWx0ZXIoJ3NjcmlwdCcsIGZ1bmN0aW9uIChvcHRpb25zLCBvcmlnaW5hbE9wdGlvbnMsIHhocikge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZGF0YVR5cGUgPT0gJ2pzb25wJykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHVybCA9IG9wdGlvbnMudXJsLmNoYXJBdCgwKSA9PT0gJy8nID8gaG9zdEluZm8gKyBvcHRpb25zLnVybCA6IG9wdGlvbnMudXJsO1xuICAgICAgICAgICAgaWYgKCQuaW5BcnJheSh1cmwsIGxvYWRlZFNjcmlwdHMpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGxvYWRlZFNjcmlwdHMucHVzaCh1cmwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgaXNSZWxvYWRhYmxlID0gJC5pbkFycmF5KHVybCwgJC5tYXAocHViLnJlbG9hZGFibGVTY3JpcHRzLCBmdW5jdGlvbiAoc2NyaXB0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2NyaXB0LmNoYXJBdCgwKSA9PT0gJy8nID8gaG9zdEluZm8gKyBzY3JpcHQgOiBzY3JpcHQ7XG4gICAgICAgICAgICAgICAgICAgIH0pKSAhPT0gLTE7XG4gICAgICAgICAgICAgICAgaWYgKCFpc1JlbG9hZGFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLmFib3J0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkKGRvY3VtZW50KS5hamF4Q29tcGxldGUoZnVuY3Rpb24gKGV2ZW50LCB4aHIsIHNldHRpbmdzKSB7XG4gICAgICAgICAgICB2YXIgc3R5bGVTaGVldHMgPSBbXTtcbiAgICAgICAgICAgICQoJ2xpbmtbcmVsPXN0eWxlc2hlZXRdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheSh0aGlzLmhyZWYsIHB1Yi5yZWxvYWRhYmxlU2NyaXB0cykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheSh0aGlzLmhyZWYsIHN0eWxlU2hlZXRzKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBzdHlsZVNoZWV0cy5wdXNoKHRoaXMuaHJlZilcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBwdWI7XG59KShqUXVlcnkpO1xuXG5qUXVlcnkoZnVuY3Rpb24gKCkge1xuICAgIHlpaS5pbml0TW9kdWxlKHlpaSk7XG59KTtcblxuIiwiLyoqXG4gKiBZaWkgdmFsaWRhdGlvbiBtb2R1bGUuXG4gKlxuICogVGhpcyBKYXZhU2NyaXB0IG1vZHVsZSBwcm92aWRlcyB0aGUgdmFsaWRhdGlvbiBtZXRob2RzIGZvciB0aGUgYnVpbHQtaW4gdmFsaWRhdG9ycy5cbiAqXG4gKiBAbGluayBodHRwOi8vd3d3LnlpaWZyYW1ld29yay5jb20vXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAwOCBZaWkgU29mdHdhcmUgTExDXG4gKiBAbGljZW5zZSBodHRwOi8vd3d3LnlpaWZyYW1ld29yay5jb20vbGljZW5zZS9cbiAqIEBhdXRob3IgUWlhbmcgWHVlIDxxaWFuZy54dWVAZ21haWwuY29tPlxuICogQHNpbmNlIDIuMFxuICovXG5cbnlpaS52YWxpZGF0aW9uID0gKGZ1bmN0aW9uICgkKSB7XG4gICAgdmFyIHB1YiA9IHtcbiAgICAgICAgaXNFbXB0eTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PSBbXSB8fCB2YWx1ZSA9PT0gJyc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkTWVzc2FnZTogZnVuY3Rpb24gKG1lc3NhZ2VzLCBtZXNzYWdlLCB2YWx1ZSkge1xuICAgICAgICAgICAgbWVzc2FnZXMucHVzaChtZXNzYWdlLnJlcGxhY2UoL1xce3ZhbHVlXFx9L2csIHZhbHVlKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVxdWlyZWQ6IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciB2YWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMucmVxdWlyZWRWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlzU3RyaW5nID0gdHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8IHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nO1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnN0cmljdCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkIHx8ICFvcHRpb25zLnN0cmljdCAmJiAhcHViLmlzRW1wdHkoaXNTdHJpbmcgPyAkLnRyaW0odmFsdWUpIDogdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFvcHRpb25zLnN0cmljdCAmJiB2YWx1ZSA9PSBvcHRpb25zLnJlcXVpcmVkVmFsdWUgfHwgb3B0aW9ucy5zdHJpY3QgJiYgdmFsdWUgPT09IG9wdGlvbnMucmVxdWlyZWRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF2YWxpZCkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAnYm9vbGVhbic6IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNraXBPbkVtcHR5ICYmIHB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB2YWxpZCA9ICFvcHRpb25zLnN0cmljdCAmJiAodmFsdWUgPT0gb3B0aW9ucy50cnVlVmFsdWUgfHwgdmFsdWUgPT0gb3B0aW9ucy5mYWxzZVZhbHVlKVxuICAgICAgICAgICAgICAgIHx8IG9wdGlvbnMuc3RyaWN0ICYmICh2YWx1ZSA9PT0gb3B0aW9ucy50cnVlVmFsdWUgfHwgdmFsdWUgPT09IG9wdGlvbnMuZmFsc2VWYWx1ZSk7XG5cbiAgICAgICAgICAgIGlmICghdmFsaWQpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3RyaW5nOiBmdW5jdGlvbiAodmFsdWUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5za2lwT25FbXB0eSAmJiBwdWIuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubWluICE9PSB1bmRlZmluZWQgJiYgdmFsdWUubGVuZ3RoIDwgb3B0aW9ucy5taW4pIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy50b29TaG9ydCwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubWF4ICE9PSB1bmRlZmluZWQgJiYgdmFsdWUubGVuZ3RoID4gb3B0aW9ucy5tYXgpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy50b29Mb25nLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5pcyAhPT0gdW5kZWZpbmVkICYmIHZhbHVlLmxlbmd0aCAhPSBvcHRpb25zLmlzKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubm90RXF1YWwsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBmaWxlOiBmdW5jdGlvbiAoYXR0cmlidXRlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIGZpbGVzID0gZ2V0VXBsb2FkZWRGaWxlcyhhdHRyaWJ1dGUsIG1lc3NhZ2VzLCBvcHRpb25zKTtcbiAgICAgICAgICAgICQuZWFjaChmaWxlcywgZnVuY3Rpb24gKGksIGZpbGUpIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZUZpbGUoZmlsZSwgbWVzc2FnZXMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW1hZ2U6IGZ1bmN0aW9uIChhdHRyaWJ1dGUsIG1lc3NhZ2VzLCBvcHRpb25zLCBkZWZlcnJlZCkge1xuICAgICAgICAgICAgdmFyIGZpbGVzID0gZ2V0VXBsb2FkZWRGaWxlcyhhdHRyaWJ1dGUsIG1lc3NhZ2VzLCBvcHRpb25zKTtcblxuICAgICAgICAgICAgJC5lYWNoKGZpbGVzLCBmdW5jdGlvbiAoaSwgZmlsZSkge1xuICAgICAgICAgICAgICAgIHZhbGlkYXRlRmlsZShmaWxlLCBtZXNzYWdlcywgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgICAgICAvLyBTa2lwIGltYWdlIHZhbGlkYXRpb24gaWYgRmlsZVJlYWRlciBBUEkgaXMgbm90IGF2YWlsYWJsZVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgRmlsZVJlYWRlciA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGRlZiA9ICQuRGVmZXJyZWQoKSxcbiAgICAgICAgICAgICAgICAgICAgZnIgPSBuZXcgRmlsZVJlYWRlcigpLFxuICAgICAgICAgICAgICAgICAgICBpbWcgPSBuZXcgSW1hZ2UoKTtcblxuICAgICAgICAgICAgICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLm1pbldpZHRoICYmIHRoaXMud2lkdGggPCBvcHRpb25zLm1pbldpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMudW5kZXJXaWR0aC5yZXBsYWNlKC9cXHtmaWxlXFx9L2csIGZpbGUubmFtZSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMubWF4V2lkdGggJiYgdGhpcy53aWR0aCA+IG9wdGlvbnMubWF4V2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy5vdmVyV2lkdGgucmVwbGFjZSgvXFx7ZmlsZVxcfS9nLCBmaWxlLm5hbWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLm1pbkhlaWdodCAmJiB0aGlzLmhlaWdodCA8IG9wdGlvbnMubWluSGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMudW5kZXJIZWlnaHQucmVwbGFjZSgvXFx7ZmlsZVxcfS9nLCBmaWxlLm5hbWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLm1heEhlaWdodCAmJiB0aGlzLmhlaWdodCA+IG9wdGlvbnMubWF4SGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMub3ZlckhlaWdodC5yZXBsYWNlKC9cXHtmaWxlXFx9L2csIGZpbGUubmFtZSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGRlZi5yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGltZy5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMubm90SW1hZ2UucmVwbGFjZSgvXFx7ZmlsZVxcfS9nLCBmaWxlLm5hbWUpKTtcbiAgICAgICAgICAgICAgICAgICAgZGVmLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgZnIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpbWcuc3JjID0gZnIucmVzdWx0O1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvLyBSZXNvbHZlIGRlZmVycmVkIGlmIHRoZXJlIHdhcyBlcnJvciB3aGlsZSByZWFkaW5nIGRhdGFcbiAgICAgICAgICAgICAgICBmci5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBkZWYucmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBmci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xuXG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucHVzaChkZWYpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSxcblxuICAgICAgICBudW1iZXI6IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNraXBPbkVtcHR5ICYmIHB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgIXZhbHVlLm1hdGNoKG9wdGlvbnMucGF0dGVybikpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5taW4gIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSA8IG9wdGlvbnMubWluKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMudG9vU21hbGwsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1heCAhPT0gdW5kZWZpbmVkICYmIHZhbHVlID4gb3B0aW9ucy5tYXgpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy50b29CaWcsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICByYW5nZTogZnVuY3Rpb24gKHZhbHVlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2tpcE9uRW1wdHkgJiYgcHViLmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuYWxsb3dBcnJheSAmJiAkLmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGluQXJyYXkgPSB0cnVlO1xuXG4gICAgICAgICAgICAkLmVhY2goJC5pc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogW3ZhbHVlXSwgZnVuY3Rpb24gKGksIHYpIHtcbiAgICAgICAgICAgICAgICBpZiAoJC5pbkFycmF5KHYsIG9wdGlvbnMucmFuZ2UpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGluQXJyYXkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5ub3QgPT09IGluQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVndWxhckV4cHJlc3Npb246IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNraXBPbkVtcHR5ICYmIHB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFvcHRpb25zLm5vdCAmJiAhdmFsdWUubWF0Y2gob3B0aW9ucy5wYXR0ZXJuKSB8fCBvcHRpb25zLm5vdCAmJiB2YWx1ZS5tYXRjaChvcHRpb25zLnBhdHRlcm4pKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGVtYWlsOiBmdW5jdGlvbiAodmFsdWUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5za2lwT25FbXB0eSAmJiBwdWIuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB2YWxpZCA9IHRydWU7XG5cblxuICAgICAgICAgICAgdmFyIHJlZ2V4cCA9IC9eKCg/OlwiPyhbXlwiXSopXCI/XFxzKT8pKD86XFxzKyk/KD86KDw/KSgoLispQChbXj5dKykpKD4/KSkkLyxcbiAgICAgICAgICAgICAgICBtYXRjaGVzID0gcmVnZXhwLmV4ZWModmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAobWF0Y2hlcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHZhbGlkID0gZmFsc2VcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuZW5hYmxlSUROKSB7XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoZXNbNV0gPSBwdW55Y29kZS50b0FTQ0lJKG1hdGNoZXNbNV0pO1xuICAgICAgICAgICAgICAgICAgICBtYXRjaGVzWzZdID0gcHVueWNvZGUudG9BU0NJSShtYXRjaGVzWzZdKTtcblxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG1hdGNoZXNbMV0gKyBtYXRjaGVzWzNdICsgbWF0Y2hlc1s1XSArICdAJyArIG1hdGNoZXNbNl0gKyBtYXRjaGVzWzddO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChtYXRjaGVzWzVdLmxlbmd0aCA+IDY0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgobWF0Y2hlc1s1XSArICdAJyArIG1hdGNoZXNbNl0pLmxlbmd0aCA+IDI1NCkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdmFsdWUubWF0Y2gob3B0aW9ucy5wYXR0ZXJuKSB8fCAob3B0aW9ucy5hbGxvd05hbWUgJiYgdmFsdWUubWF0Y2gob3B0aW9ucy5mdWxsUGF0dGVybikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF2YWxpZCkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB1cmw6IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNraXBPbkVtcHR5ICYmIHB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZGVmYXVsdFNjaGVtZSAmJiAhdmFsdWUubWF0Y2goLzpcXC9cXC8vKSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gb3B0aW9ucy5kZWZhdWx0U2NoZW1lICsgJzovLycgKyB2YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHZhbGlkID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZW5hYmxlSUROKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlZ2V4cCA9IC9eKFteOl0rKTpcXC9cXC8oW15cXC9dKykoLiopJC8sXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoZXMgPSByZWdleHAuZXhlYyh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoZXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG1hdGNoZXNbMV0gKyAnOi8vJyArIHB1bnljb2RlLnRvQVNDSUkobWF0Y2hlc1syXSkgKyBtYXRjaGVzWzNdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF2YWxpZCB8fCAhdmFsdWUubWF0Y2gob3B0aW9ucy5wYXR0ZXJuKSkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB0cmltOiBmdW5jdGlvbiAoJGZvcm0sIGF0dHJpYnV0ZSwgb3B0aW9ucykge1xuICAgICAgICAgICAgdmFyICRpbnB1dCA9ICRmb3JtLmZpbmQoYXR0cmlidXRlLmlucHV0KTtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9ICRpbnB1dC52YWwoKTtcbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5za2lwT25FbXB0eSB8fCAhcHViLmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAkLnRyaW0odmFsdWUpO1xuICAgICAgICAgICAgICAgICRpbnB1dC52YWwodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNhcHRjaGE6IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNraXBPbkVtcHR5ICYmIHB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ0FQVENIQSBtYXkgYmUgdXBkYXRlZCB2aWEgQUpBWCBhbmQgdGhlIHVwZGF0ZWQgaGFzaCBpcyBzdG9yZWQgaW4gYm9keSBkYXRhXG4gICAgICAgICAgICB2YXIgaGFzaCA9ICQoJ2JvZHknKS5kYXRhKG9wdGlvbnMuaGFzaEtleSk7XG4gICAgICAgICAgICBpZiAoaGFzaCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaGFzaCA9IG9wdGlvbnMuaGFzaDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaGFzaCA9IGhhc2hbb3B0aW9ucy5jYXNlU2Vuc2l0aXZlID8gMCA6IDFdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHYgPSBvcHRpb25zLmNhc2VTZW5zaXRpdmUgPyB2YWx1ZSA6IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gdi5sZW5ndGggLSAxLCBoID0gMDsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgICAgICAgICBoICs9IHYuY2hhckNvZGVBdChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoICE9IGhhc2gpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29tcGFyZTogZnVuY3Rpb24gKHZhbHVlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2tpcE9uRW1wdHkgJiYgcHViLmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY29tcGFyZVZhbHVlLCB2YWxpZCA9IHRydWU7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5jb21wYXJlQXR0cmlidXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb21wYXJlVmFsdWUgPSBvcHRpb25zLmNvbXBhcmVWYWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29tcGFyZVZhbHVlID0gJCgnIycgKyBvcHRpb25zLmNvbXBhcmVBdHRyaWJ1dGUpLnZhbCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy50eXBlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgY29tcGFyZVZhbHVlID0gcGFyc2VGbG9hdChjb21wYXJlVmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3dpdGNoIChvcHRpb25zLm9wZXJhdG9yKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnPT0nOlxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHZhbHVlID09IGNvbXBhcmVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnPT09JzpcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB2YWx1ZSA9PT0gY29tcGFyZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICchPSc6XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdmFsdWUgIT0gY29tcGFyZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICchPT0nOlxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHZhbHVlICE9PSBjb21wYXJlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJz4nOlxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHZhbHVlID4gY29tcGFyZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICc+PSc6XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdmFsdWUgPj0gY29tcGFyZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICc8JzpcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB2YWx1ZSA8IGNvbXBhcmVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnPD0nOlxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHZhbHVlIDw9IGNvbXBhcmVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdmFsaWQpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgaXA6IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBnZXRJcFZlcnNpb24gPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuaW5kZXhPZignOicpID09PSAtMSA/IDQgOiA2O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIG5lZ2F0aW9uID0gbnVsbCwgY2lkciA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNraXBPbkVtcHR5ICYmIHB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG1hdGNoZXMgPSBuZXcgUmVnRXhwKG9wdGlvbnMuaXBQYXJzZVBhdHRlcm4pLmV4ZWModmFsdWUpO1xuICAgICAgICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICBuZWdhdGlvbiA9IG1hdGNoZXNbMV0gfHwgbnVsbDtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG1hdGNoZXNbMl07XG4gICAgICAgICAgICAgICAgY2lkciA9IG1hdGNoZXNbNF0gfHwgbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc3VibmV0ID09PSB0cnVlICYmIGNpZHIgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlcy5ub1N1Ym5ldCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLnN1Ym5ldCA9PT0gZmFsc2UgJiYgY2lkciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2VzLmhhc1N1Ym5ldCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm5lZ2F0aW9uID09PSBmYWxzZSAmJiBuZWdhdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2VzLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChnZXRJcFZlcnNpb24odmFsdWUpID09IDYpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMuaXB2Nikge1xuICAgICAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlcy5pcHY2Tm90QWxsb3dlZCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIShuZXcgUmVnRXhwKG9wdGlvbnMuaXB2NlBhdHRlcm4pKS50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlcy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMuaXB2NCkge1xuICAgICAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlcy5pcHY0Tm90QWxsb3dlZCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIShuZXcgUmVnRXhwKG9wdGlvbnMuaXB2NFBhdHRlcm4pKS50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlcy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldFVwbG9hZGVkRmlsZXMoYXR0cmlidXRlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAvLyBTa2lwIHZhbGlkYXRpb24gaWYgRmlsZSBBUEkgaXMgbm90IGF2YWlsYWJsZVxuICAgICAgICBpZiAodHlwZW9mIEZpbGUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmaWxlcyA9ICQoYXR0cmlidXRlLmlucHV0KS5nZXQoMCkuZmlsZXM7XG4gICAgICAgIGlmICghZmlsZXMpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy5tZXNzYWdlKTtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaWxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5za2lwT25FbXB0eSkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy51cGxvYWRSZXF1aXJlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5tYXhGaWxlcyAmJiBvcHRpb25zLm1heEZpbGVzIDwgZmlsZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMudG9vTWFueSk7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmlsZXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGVGaWxlKGZpbGUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmV4dGVuc2lvbnMgJiYgb3B0aW9ucy5leHRlbnNpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBpbmRleCwgZXh0O1xuXG4gICAgICAgICAgICBpbmRleCA9IGZpbGUubmFtZS5sYXN0SW5kZXhPZignLicpO1xuXG4gICAgICAgICAgICBpZiAoIX5pbmRleCkge1xuICAgICAgICAgICAgICAgIGV4dCA9ICcnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBleHQgPSBmaWxlLm5hbWUuc3Vic3RyKGluZGV4ICsgMSwgZmlsZS5uYW1lLmxlbmd0aCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF+b3B0aW9ucy5leHRlbnNpb25zLmluZGV4T2YoZXh0KSkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy53cm9uZ0V4dGVuc2lvbi5yZXBsYWNlKC9cXHtmaWxlXFx9L2csIGZpbGUubmFtZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubWltZVR5cGVzICYmIG9wdGlvbnMubWltZVR5cGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICghdmFsaWRhdGVNaW1lVHlwZShvcHRpb25zLm1pbWVUeXBlcywgZmlsZS50eXBlKSkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy53cm9uZ01pbWVUeXBlLnJlcGxhY2UoL1xce2ZpbGVcXH0vZywgZmlsZS5uYW1lKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5tYXhTaXplICYmIG9wdGlvbnMubWF4U2l6ZSA8IGZpbGUuc2l6ZSkge1xuICAgICAgICAgICAgbWVzc2FnZXMucHVzaChvcHRpb25zLnRvb0JpZy5yZXBsYWNlKC9cXHtmaWxlXFx9L2csIGZpbGUubmFtZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubWluU2l6ZSAmJiBvcHRpb25zLm1pblNpemUgPiBmaWxlLnNpemUpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy50b29TbWFsbC5yZXBsYWNlKC9cXHtmaWxlXFx9L2csIGZpbGUubmFtZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGVNaW1lVHlwZShtaW1lVHlwZXMsIGZpbGVUeXBlKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBtaW1lVHlwZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChuZXcgUmVnRXhwKG1pbWVUeXBlc1tpXSkudGVzdChmaWxlVHlwZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHViO1xufSkoalF1ZXJ5KTtcbiIsIi8qKlxuICogWWlpIGZvcm0gd2lkZ2V0LlxuICpcbiAqIFRoaXMgaXMgdGhlIEphdmFTY3JpcHQgd2lkZ2V0IHVzZWQgYnkgdGhlIHlpaVxcd2lkZ2V0c1xcQWN0aXZlRm9ybSB3aWRnZXQuXG4gKlxuICogQGxpbmsgaHR0cDovL3d3dy55aWlmcmFtZXdvcmsuY29tL1xuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMDggWWlpIFNvZnR3YXJlIExMQ1xuICogQGxpY2Vuc2UgaHR0cDovL3d3dy55aWlmcmFtZXdvcmsuY29tL2xpY2Vuc2UvXG4gKiBAYXV0aG9yIFFpYW5nIFh1ZSA8cWlhbmcueHVlQGdtYWlsLmNvbT5cbiAqIEBzaW5jZSAyLjBcbiAqL1xuKGZ1bmN0aW9uICgkKSB7XG5cbiAgICAkLmZuLnlpaUFjdGl2ZUZvcm0gPSBmdW5jdGlvbiAobWV0aG9kKSB7XG4gICAgICAgIGlmIChtZXRob2RzW21ldGhvZF0pIHtcbiAgICAgICAgICAgIHJldHVybiBtZXRob2RzW21ldGhvZF0uYXBwbHkodGhpcywgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG1ldGhvZCA9PT0gJ29iamVjdCcgfHwgIW1ldGhvZCkge1xuICAgICAgICAgICAgcmV0dXJuIG1ldGhvZHMuaW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJC5lcnJvcignTWV0aG9kICcgKyBtZXRob2QgKyAnIGRvZXMgbm90IGV4aXN0IG9uIGpRdWVyeS55aWlBY3RpdmVGb3JtJyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGV2ZW50cyA9IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGJlZm9yZVZhbGlkYXRlIGV2ZW50IGlzIHRyaWdnZXJlZCBiZWZvcmUgdmFsaWRhdGluZyB0aGUgd2hvbGUgZm9ybS5cbiAgICAgICAgICogVGhlIHNpZ25hdHVyZSBvZiB0aGUgZXZlbnQgaGFuZGxlciBzaG91bGQgYmU6XG4gICAgICAgICAqICAgICBmdW5jdGlvbiAoZXZlbnQsIG1lc3NhZ2VzLCBkZWZlcnJlZHMpXG4gICAgICAgICAqIHdoZXJlXG4gICAgICAgICAqICAtIGV2ZW50OiBhbiBFdmVudCBvYmplY3QuXG4gICAgICAgICAqICAtIG1lc3NhZ2VzOiBhbiBhc3NvY2lhdGl2ZSBhcnJheSB3aXRoIGtleXMgYmVpbmcgYXR0cmlidXRlIElEcyBhbmQgdmFsdWVzIGJlaW5nIGVycm9yIG1lc3NhZ2UgYXJyYXlzXG4gICAgICAgICAqICAgIGZvciB0aGUgY29ycmVzcG9uZGluZyBhdHRyaWJ1dGVzLlxuICAgICAgICAgKiAgLSBkZWZlcnJlZHM6IGFuIGFycmF5IG9mIERlZmVycmVkIG9iamVjdHMuIFlvdSBjYW4gdXNlIGRlZmVycmVkcy5hZGQoY2FsbGJhY2spIHRvIGFkZCBhIG5ldyBkZWZlcnJlZCB2YWxpZGF0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJZiB0aGUgaGFuZGxlciByZXR1cm5zIGEgYm9vbGVhbiBmYWxzZSwgaXQgd2lsbCBzdG9wIGZ1cnRoZXIgZm9ybSB2YWxpZGF0aW9uIGFmdGVyIHRoaXMgZXZlbnQuIEFuZCBhc1xuICAgICAgICAgKiBhIHJlc3VsdCwgYWZ0ZXJWYWxpZGF0ZSBldmVudCB3aWxsIG5vdCBiZSB0cmlnZ2VyZWQuXG4gICAgICAgICAqL1xuICAgICAgICBiZWZvcmVWYWxpZGF0ZTogJ2JlZm9yZVZhbGlkYXRlJyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGFmdGVyVmFsaWRhdGUgZXZlbnQgaXMgdHJpZ2dlcmVkIGFmdGVyIHZhbGlkYXRpbmcgdGhlIHdob2xlIGZvcm0uXG4gICAgICAgICAqIFRoZSBzaWduYXR1cmUgb2YgdGhlIGV2ZW50IGhhbmRsZXIgc2hvdWxkIGJlOlxuICAgICAgICAgKiAgICAgZnVuY3Rpb24gKGV2ZW50LCBtZXNzYWdlcywgZXJyb3JBdHRyaWJ1dGVzKVxuICAgICAgICAgKiB3aGVyZVxuICAgICAgICAgKiAgLSBldmVudDogYW4gRXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiAgLSBtZXNzYWdlczogYW4gYXNzb2NpYXRpdmUgYXJyYXkgd2l0aCBrZXlzIGJlaW5nIGF0dHJpYnV0ZSBJRHMgYW5kIHZhbHVlcyBiZWluZyBlcnJvciBtZXNzYWdlIGFycmF5c1xuICAgICAgICAgKiAgICBmb3IgdGhlIGNvcnJlc3BvbmRpbmcgYXR0cmlidXRlcy5cbiAgICAgICAgICogIC0gZXJyb3JBdHRyaWJ1dGVzOiBhbiBhcnJheSBvZiBhdHRyaWJ1dGVzIHRoYXQgaGF2ZSB2YWxpZGF0aW9uIGVycm9ycy4gUGxlYXNlIHJlZmVyIHRvIGF0dHJpYnV0ZURlZmF1bHRzIGZvciB0aGUgc3RydWN0dXJlIG9mIHRoaXMgcGFyYW1ldGVyLlxuICAgICAgICAgKi9cbiAgICAgICAgYWZ0ZXJWYWxpZGF0ZTogJ2FmdGVyVmFsaWRhdGUnLFxuICAgICAgICAvKipcbiAgICAgICAgICogYmVmb3JlVmFsaWRhdGVBdHRyaWJ1dGUgZXZlbnQgaXMgdHJpZ2dlcmVkIGJlZm9yZSB2YWxpZGF0aW5nIGFuIGF0dHJpYnV0ZS5cbiAgICAgICAgICogVGhlIHNpZ25hdHVyZSBvZiB0aGUgZXZlbnQgaGFuZGxlciBzaG91bGQgYmU6XG4gICAgICAgICAqICAgICBmdW5jdGlvbiAoZXZlbnQsIGF0dHJpYnV0ZSwgbWVzc2FnZXMsIGRlZmVycmVkcylcbiAgICAgICAgICogd2hlcmVcbiAgICAgICAgICogIC0gZXZlbnQ6IGFuIEV2ZW50IG9iamVjdC5cbiAgICAgICAgICogIC0gYXR0cmlidXRlOiB0aGUgYXR0cmlidXRlIHRvIGJlIHZhbGlkYXRlZC4gUGxlYXNlIHJlZmVyIHRvIGF0dHJpYnV0ZURlZmF1bHRzIGZvciB0aGUgc3RydWN0dXJlIG9mIHRoaXMgcGFyYW1ldGVyLlxuICAgICAgICAgKiAgLSBtZXNzYWdlczogYW4gYXJyYXkgdG8gd2hpY2ggeW91IGNhbiBhZGQgdmFsaWRhdGlvbiBlcnJvciBtZXNzYWdlcyBmb3IgdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGUuXG4gICAgICAgICAqICAtIGRlZmVycmVkczogYW4gYXJyYXkgb2YgRGVmZXJyZWQgb2JqZWN0cy4gWW91IGNhbiB1c2UgZGVmZXJyZWRzLmFkZChjYWxsYmFjaykgdG8gYWRkIGEgbmV3IGRlZmVycmVkIHZhbGlkYXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIElmIHRoZSBoYW5kbGVyIHJldHVybnMgYSBib29sZWFuIGZhbHNlLCBpdCB3aWxsIHN0b3AgZnVydGhlciB2YWxpZGF0aW9uIG9mIHRoZSBzcGVjaWZpZWQgYXR0cmlidXRlLlxuICAgICAgICAgKiBBbmQgYXMgYSByZXN1bHQsIGFmdGVyVmFsaWRhdGVBdHRyaWJ1dGUgZXZlbnQgd2lsbCBub3QgYmUgdHJpZ2dlcmVkLlxuICAgICAgICAgKi9cbiAgICAgICAgYmVmb3JlVmFsaWRhdGVBdHRyaWJ1dGU6ICdiZWZvcmVWYWxpZGF0ZUF0dHJpYnV0ZScsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBhZnRlclZhbGlkYXRlQXR0cmlidXRlIGV2ZW50IGlzIHRyaWdnZXJlZCBhZnRlciB2YWxpZGF0aW5nIHRoZSB3aG9sZSBmb3JtIGFuZCBlYWNoIGF0dHJpYnV0ZS5cbiAgICAgICAgICogVGhlIHNpZ25hdHVyZSBvZiB0aGUgZXZlbnQgaGFuZGxlciBzaG91bGQgYmU6XG4gICAgICAgICAqICAgICBmdW5jdGlvbiAoZXZlbnQsIGF0dHJpYnV0ZSwgbWVzc2FnZXMpXG4gICAgICAgICAqIHdoZXJlXG4gICAgICAgICAqICAtIGV2ZW50OiBhbiBFdmVudCBvYmplY3QuXG4gICAgICAgICAqICAtIGF0dHJpYnV0ZTogdGhlIGF0dHJpYnV0ZSBiZWluZyB2YWxpZGF0ZWQuIFBsZWFzZSByZWZlciB0byBhdHRyaWJ1dGVEZWZhdWx0cyBmb3IgdGhlIHN0cnVjdHVyZSBvZiB0aGlzIHBhcmFtZXRlci5cbiAgICAgICAgICogIC0gbWVzc2FnZXM6IGFuIGFycmF5IHRvIHdoaWNoIHlvdSBjYW4gYWRkIGFkZGl0aW9uYWwgdmFsaWRhdGlvbiBlcnJvciBtZXNzYWdlcyBmb3IgdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGUuXG4gICAgICAgICAqL1xuICAgICAgICBhZnRlclZhbGlkYXRlQXR0cmlidXRlOiAnYWZ0ZXJWYWxpZGF0ZUF0dHJpYnV0ZScsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBiZWZvcmVTdWJtaXQgZXZlbnQgaXMgdHJpZ2dlcmVkIGJlZm9yZSBzdWJtaXR0aW5nIHRoZSBmb3JtIGFmdGVyIGFsbCB2YWxpZGF0aW9ucyBoYXZlIHBhc3NlZC5cbiAgICAgICAgICogVGhlIHNpZ25hdHVyZSBvZiB0aGUgZXZlbnQgaGFuZGxlciBzaG91bGQgYmU6XG4gICAgICAgICAqICAgICBmdW5jdGlvbiAoZXZlbnQpXG4gICAgICAgICAqIHdoZXJlIGV2ZW50IGlzIGFuIEV2ZW50IG9iamVjdC5cbiAgICAgICAgICpcbiAgICAgICAgICogSWYgdGhlIGhhbmRsZXIgcmV0dXJucyBhIGJvb2xlYW4gZmFsc2UsIGl0IHdpbGwgc3RvcCBmb3JtIHN1Ym1pc3Npb24uXG4gICAgICAgICAqL1xuICAgICAgICBiZWZvcmVTdWJtaXQ6ICdiZWZvcmVTdWJtaXQnLFxuICAgICAgICAvKipcbiAgICAgICAgICogYWpheEJlZm9yZVNlbmQgZXZlbnQgaXMgdHJpZ2dlcmVkIGJlZm9yZSBzZW5kaW5nIGFuIEFKQVggcmVxdWVzdCBmb3IgQUpBWC1iYXNlZCB2YWxpZGF0aW9uLlxuICAgICAgICAgKiBUaGUgc2lnbmF0dXJlIG9mIHRoZSBldmVudCBoYW5kbGVyIHNob3VsZCBiZTpcbiAgICAgICAgICogICAgIGZ1bmN0aW9uIChldmVudCwganFYSFIsIHNldHRpbmdzKVxuICAgICAgICAgKiB3aGVyZVxuICAgICAgICAgKiAgLSBldmVudDogYW4gRXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiAgLSBqcVhIUjogYSBqcVhIUiBvYmplY3RcbiAgICAgICAgICogIC0gc2V0dGluZ3M6IHRoZSBzZXR0aW5ncyBmb3IgdGhlIEFKQVggcmVxdWVzdFxuICAgICAgICAgKi9cbiAgICAgICAgYWpheEJlZm9yZVNlbmQ6ICdhamF4QmVmb3JlU2VuZCcsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBhamF4Q29tcGxldGUgZXZlbnQgaXMgdHJpZ2dlcmVkIGFmdGVyIGNvbXBsZXRpbmcgYW4gQUpBWCByZXF1ZXN0IGZvciBBSkFYLWJhc2VkIHZhbGlkYXRpb24uXG4gICAgICAgICAqIFRoZSBzaWduYXR1cmUgb2YgdGhlIGV2ZW50IGhhbmRsZXIgc2hvdWxkIGJlOlxuICAgICAgICAgKiAgICAgZnVuY3Rpb24gKGV2ZW50LCBqcVhIUiwgdGV4dFN0YXR1cylcbiAgICAgICAgICogd2hlcmVcbiAgICAgICAgICogIC0gZXZlbnQ6IGFuIEV2ZW50IG9iamVjdC5cbiAgICAgICAgICogIC0ganFYSFI6IGEganFYSFIgb2JqZWN0XG4gICAgICAgICAqICAtIHRleHRTdGF0dXM6IHRoZSBzdGF0dXMgb2YgdGhlIHJlcXVlc3QgKFwic3VjY2Vzc1wiLCBcIm5vdG1vZGlmaWVkXCIsIFwiZXJyb3JcIiwgXCJ0aW1lb3V0XCIsIFwiYWJvcnRcIiwgb3IgXCJwYXJzZXJlcnJvclwiKS5cbiAgICAgICAgICovXG4gICAgICAgIGFqYXhDb21wbGV0ZTogJ2FqYXhDb21wbGV0ZSdcbiAgICB9O1xuXG4gICAgLy8gTk9URTogSWYgeW91IGNoYW5nZSBhbnkgb2YgdGhlc2UgZGVmYXVsdHMsIG1ha2Ugc3VyZSB5b3UgdXBkYXRlIHlpaVxcd2lkZ2V0c1xcQWN0aXZlRm9ybTo6Z2V0Q2xpZW50T3B0aW9ucygpIGFzIHdlbGxcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgIC8vIHdoZXRoZXIgdG8gZW5jb2RlIHRoZSBlcnJvciBzdW1tYXJ5XG4gICAgICAgIGVuY29kZUVycm9yU3VtbWFyeTogdHJ1ZSxcbiAgICAgICAgLy8gdGhlIGpRdWVyeSBzZWxlY3RvciBmb3IgdGhlIGVycm9yIHN1bW1hcnlcbiAgICAgICAgZXJyb3JTdW1tYXJ5OiAnLmVycm9yLXN1bW1hcnknLFxuICAgICAgICAvLyB3aGV0aGVyIHRvIHBlcmZvcm0gdmFsaWRhdGlvbiBiZWZvcmUgc3VibWl0dGluZyB0aGUgZm9ybS5cbiAgICAgICAgdmFsaWRhdGVPblN1Ym1pdDogdHJ1ZSxcbiAgICAgICAgLy8gdGhlIGNvbnRhaW5lciBDU1MgY2xhc3MgcmVwcmVzZW50aW5nIHRoZSBjb3JyZXNwb25kaW5nIGF0dHJpYnV0ZSBoYXMgdmFsaWRhdGlvbiBlcnJvclxuICAgICAgICBlcnJvckNzc0NsYXNzOiAnaGFzLWVycm9yJyxcbiAgICAgICAgLy8gdGhlIGNvbnRhaW5lciBDU1MgY2xhc3MgcmVwcmVzZW50aW5nIHRoZSBjb3JyZXNwb25kaW5nIGF0dHJpYnV0ZSBwYXNzZXMgdmFsaWRhdGlvblxuICAgICAgICBzdWNjZXNzQ3NzQ2xhc3M6ICdoYXMtc3VjY2VzcycsXG4gICAgICAgIC8vIHRoZSBjb250YWluZXIgQ1NTIGNsYXNzIHJlcHJlc2VudGluZyB0aGUgY29ycmVzcG9uZGluZyBhdHRyaWJ1dGUgaXMgYmVpbmcgdmFsaWRhdGVkXG4gICAgICAgIHZhbGlkYXRpbmdDc3NDbGFzczogJ3ZhbGlkYXRpbmcnLFxuICAgICAgICAvLyB0aGUgR0VUIHBhcmFtZXRlciBuYW1lIGluZGljYXRpbmcgYW4gQUpBWC1iYXNlZCB2YWxpZGF0aW9uXG4gICAgICAgIGFqYXhQYXJhbTogJ2FqYXgnLFxuICAgICAgICAvLyB0aGUgdHlwZSBvZiBkYXRhIHRoYXQgeW91J3JlIGV4cGVjdGluZyBiYWNrIGZyb20gdGhlIHNlcnZlclxuICAgICAgICBhamF4RGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgLy8gdGhlIFVSTCBmb3IgcGVyZm9ybWluZyBBSkFYLWJhc2VkIHZhbGlkYXRpb24uIElmIG5vdCBzZXQsIGl0IHdpbGwgdXNlIHRoZSB0aGUgZm9ybSdzIGFjdGlvblxuICAgICAgICB2YWxpZGF0aW9uVXJsOiB1bmRlZmluZWQsXG4gICAgICAgIC8vIHdoZXRoZXIgdG8gc2Nyb2xsIHRvIGZpcnN0IHZpc2libGUgZXJyb3IgYWZ0ZXIgdmFsaWRhdGlvbi5cbiAgICAgICAgc2Nyb2xsVG9FcnJvcjogdHJ1ZVxuICAgIH07XG5cbiAgICAvLyBOT1RFOiBJZiB5b3UgY2hhbmdlIGFueSBvZiB0aGVzZSBkZWZhdWx0cywgbWFrZSBzdXJlIHlvdSB1cGRhdGUgeWlpXFx3aWRnZXRzXFxBY3RpdmVGaWVsZDo6Z2V0Q2xpZW50T3B0aW9ucygpIGFzIHdlbGxcbiAgICB2YXIgYXR0cmlidXRlRGVmYXVsdHMgPSB7XG4gICAgICAgIC8vIGEgdW5pcXVlIElEIGlkZW50aWZ5aW5nIGFuIGF0dHJpYnV0ZSAoZS5nLiBcImxvZ2luZm9ybS11c2VybmFtZVwiKSBpbiBhIGZvcm1cbiAgICAgICAgaWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgLy8gYXR0cmlidXRlIG5hbWUgb3IgZXhwcmVzc2lvbiAoZS5nLiBcIlswXWNvbnRlbnRcIiBmb3IgdGFidWxhciBpbnB1dClcbiAgICAgICAgbmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAvLyB0aGUgalF1ZXJ5IHNlbGVjdG9yIG9mIHRoZSBjb250YWluZXIgb2YgdGhlIGlucHV0IGZpZWxkXG4gICAgICAgIGNvbnRhaW5lcjogdW5kZWZpbmVkLFxuICAgICAgICAvLyB0aGUgalF1ZXJ5IHNlbGVjdG9yIG9mIHRoZSBpbnB1dCBmaWVsZCB1bmRlciB0aGUgY29udGV4dCBvZiB0aGUgZm9ybVxuICAgICAgICBpbnB1dDogdW5kZWZpbmVkLFxuICAgICAgICAvLyB0aGUgalF1ZXJ5IHNlbGVjdG9yIG9mIHRoZSBlcnJvciB0YWcgdW5kZXIgdGhlIGNvbnRleHQgb2YgdGhlIGNvbnRhaW5lclxuICAgICAgICBlcnJvcjogJy5oZWxwLWJsb2NrJyxcbiAgICAgICAgLy8gd2hldGhlciB0byBlbmNvZGUgdGhlIGVycm9yXG4gICAgICAgIGVuY29kZUVycm9yOiB0cnVlLFxuICAgICAgICAvLyB3aGV0aGVyIHRvIHBlcmZvcm0gdmFsaWRhdGlvbiB3aGVuIGEgY2hhbmdlIGlzIGRldGVjdGVkIG9uIHRoZSBpbnB1dFxuICAgICAgICB2YWxpZGF0ZU9uQ2hhbmdlOiB0cnVlLFxuICAgICAgICAvLyB3aGV0aGVyIHRvIHBlcmZvcm0gdmFsaWRhdGlvbiB3aGVuIHRoZSBpbnB1dCBsb3NlcyBmb2N1c1xuICAgICAgICB2YWxpZGF0ZU9uQmx1cjogdHJ1ZSxcbiAgICAgICAgLy8gd2hldGhlciB0byBwZXJmb3JtIHZhbGlkYXRpb24gd2hlbiB0aGUgdXNlciBpcyB0eXBpbmcuXG4gICAgICAgIHZhbGlkYXRlT25UeXBlOiBmYWxzZSxcbiAgICAgICAgLy8gbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0aGF0IHRoZSB2YWxpZGF0aW9uIHNob3VsZCBiZSBkZWxheWVkIHdoZW4gYSB1c2VyIGlzIHR5cGluZyBpbiB0aGUgaW5wdXQgZmllbGQuXG4gICAgICAgIHZhbGlkYXRpb25EZWxheTogNTAwLFxuICAgICAgICAvLyB3aGV0aGVyIHRvIGVuYWJsZSBBSkFYLWJhc2VkIHZhbGlkYXRpb24uXG4gICAgICAgIGVuYWJsZUFqYXhWYWxpZGF0aW9uOiBmYWxzZSxcbiAgICAgICAgLy8gZnVuY3Rpb24gKGF0dHJpYnV0ZSwgdmFsdWUsIG1lc3NhZ2VzLCBkZWZlcnJlZCwgJGZvcm0pLCB0aGUgY2xpZW50LXNpZGUgdmFsaWRhdGlvbiBmdW5jdGlvbi5cbiAgICAgICAgdmFsaWRhdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgLy8gc3RhdHVzIG9mIHRoZSBpbnB1dCBmaWVsZCwgMDogZW1wdHksIG5vdCBlbnRlcmVkIGJlZm9yZSwgMTogdmFsaWRhdGVkLCAyOiBwZW5kaW5nIHZhbGlkYXRpb24sIDM6IHZhbGlkYXRpbmdcbiAgICAgICAgc3RhdHVzOiAwLFxuICAgICAgICAvLyB3aGV0aGVyIHRoZSB2YWxpZGF0aW9uIGlzIGNhbmNlbGxlZCBieSBiZWZvcmVWYWxpZGF0ZUF0dHJpYnV0ZSBldmVudCBoYW5kbGVyXG4gICAgICAgIGNhbmNlbGxlZDogZmFsc2UsXG4gICAgICAgIC8vIHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXRcbiAgICAgICAgdmFsdWU6IHVuZGVmaW5lZFxuICAgIH07XG5cblxuICAgIHZhciBzdWJtaXREZWZlcjtcblxuICAgIHZhciBzZXRTdWJtaXRGaW5hbGl6ZURlZmVyID0gZnVuY3Rpb24oJGZvcm0pIHtcbiAgICAgICAgc3VibWl0RGVmZXIgPSAkLkRlZmVycmVkKCk7XG4gICAgICAgICRmb3JtLmRhdGEoJ3lpaVN1Ym1pdEZpbmFsaXplUHJvbWlzZScsIHN1Ym1pdERlZmVyLnByb21pc2UoKSk7XG4gICAgfTtcblxuICAgIC8vIGZpbmFsaXplIHlpaS5qcyAkZm9ybS5zdWJtaXRcbiAgICB2YXIgc3VibWl0RmluYWxpemUgPSBmdW5jdGlvbigkZm9ybSkge1xuICAgICAgICBpZihzdWJtaXREZWZlcikge1xuICAgICAgICAgICAgc3VibWl0RGVmZXIucmVzb2x2ZSgpO1xuICAgICAgICAgICAgc3VibWl0RGVmZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAkZm9ybS5yZW1vdmVEYXRhKCd5aWlTdWJtaXRGaW5hbGl6ZVByb21pc2UnKTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIHZhciBtZXRob2RzID0ge1xuICAgICAgICBpbml0OiBmdW5jdGlvbiAoYXR0cmlidXRlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyICRmb3JtID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICBpZiAoJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMgfHwge30pO1xuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy52YWxpZGF0aW9uVXJsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MudmFsaWRhdGlvblVybCA9ICRmb3JtLmF0dHIoJ2FjdGlvbicpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICQuZWFjaChhdHRyaWJ1dGVzLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzW2ldID0gJC5leHRlbmQoe3ZhbHVlOiBnZXRWYWx1ZSgkZm9ybSwgdGhpcyl9LCBhdHRyaWJ1dGVEZWZhdWx0cywgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHdhdGNoQXR0cmlidXRlKCRmb3JtLCBhdHRyaWJ1dGVzW2ldKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nLCB7XG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiBzZXR0aW5ncyxcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczogYXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICAgICAgc3VibWl0dGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogJGZvcm0uYXR0cigndGFyZ2V0JylcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgICAqIENsZWFuIHVwIGVycm9yIHN0YXR1cyB3aGVuIHRoZSBmb3JtIGlzIHJlc2V0LlxuICAgICAgICAgICAgICAgICAqIE5vdGUgdGhhdCAkZm9ybS5vbigncmVzZXQnLCAuLi4pIGRvZXMgd29yayBiZWNhdXNlIHRoZSBcInJlc2V0XCIgZXZlbnQgZG9lcyBub3QgYnViYmxlIG9uIElFLlxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgICRmb3JtLmJpbmQoJ3Jlc2V0LnlpaUFjdGl2ZUZvcm0nLCBtZXRob2RzLnJlc2V0Rm9ybSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MudmFsaWRhdGVPblN1Ym1pdCkge1xuICAgICAgICAgICAgICAgICAgICAkZm9ybS5vbignbW91c2V1cC55aWlBY3RpdmVGb3JtIGtleXVwLnlpaUFjdGl2ZUZvcm0nLCAnOnN1Ym1pdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKS5zdWJtaXRPYmplY3QgPSAkKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0ub24oJ3N1Ym1pdC55aWlBY3RpdmVGb3JtJywgbWV0aG9kcy5zdWJtaXRGb3JtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBhZGQgYSBuZXcgYXR0cmlidXRlIHRvIHRoZSBmb3JtIGR5bmFtaWNhbGx5LlxuICAgICAgICAvLyBwbGVhc2UgcmVmZXIgdG8gYXR0cmlidXRlRGVmYXVsdHMgZm9yIHRoZSBzdHJ1Y3R1cmUgb2YgYXR0cmlidXRlXG4gICAgICAgIGFkZDogZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgdmFyICRmb3JtID0gJCh0aGlzKTtcbiAgICAgICAgICAgIGF0dHJpYnV0ZSA9ICQuZXh0ZW5kKHt2YWx1ZTogZ2V0VmFsdWUoJGZvcm0sIGF0dHJpYnV0ZSl9LCBhdHRyaWJ1dGVEZWZhdWx0cywgYXR0cmlidXRlKTtcbiAgICAgICAgICAgICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKS5hdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlKTtcbiAgICAgICAgICAgIHdhdGNoQXR0cmlidXRlKCRmb3JtLCBhdHRyaWJ1dGUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHJlbW92ZSB0aGUgYXR0cmlidXRlIHdpdGggdGhlIHNwZWNpZmllZCBJRCBmcm9tIHRoZSBmb3JtXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICB2YXIgJGZvcm0gPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJykuYXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICQuZWFjaChhdHRyaWJ1dGVzLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzW2ldWydpZCddID09IGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlID0gYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgdW53YXRjaEF0dHJpYnV0ZSgkZm9ybSwgYXR0cmlidXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gbWFudWFsbHkgdHJpZ2dlciB0aGUgdmFsaWRhdGlvbiBvZiB0aGUgYXR0cmlidXRlIHdpdGggdGhlIHNwZWNpZmllZCBJRFxuICAgICAgICB2YWxpZGF0ZUF0dHJpYnV0ZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlID0gbWV0aG9kcy5maW5kLmNhbGwodGhpcywgaWQpO1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZUF0dHJpYnV0ZSgkKHRoaXMpLCBhdHRyaWJ1dGUsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIGZpbmQgYW4gYXR0cmlidXRlIGNvbmZpZyBiYXNlZCBvbiB0aGUgc3BlY2lmaWVkIGF0dHJpYnV0ZSBJRFxuICAgICAgICBmaW5kOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVzID0gJCh0aGlzKS5kYXRhKCd5aWlBY3RpdmVGb3JtJykuYXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAkLmVhY2goYXR0cmlidXRlcywgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlc1tpXVsnaWQnXSA9PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBhdHRyaWJ1dGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQodGhpcykudW5iaW5kKCcueWlpQWN0aXZlRm9ybScpO1xuICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlRGF0YSgneWlpQWN0aXZlRm9ybScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YSgneWlpQWN0aXZlRm9ybScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHZhbGlkYXRlIGFsbCBhcHBsaWNhYmxlIGlucHV0cyBpbiB0aGUgZm9ybVxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRmb3JtID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBkYXRhID0gJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScpLFxuICAgICAgICAgICAgICAgIG5lZWRBamF4VmFsaWRhdGlvbiA9IGZhbHNlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VzID0ge30sXG4gICAgICAgICAgICAgICAgZGVmZXJyZWRzID0gZGVmZXJyZWRBcnJheSgpLFxuICAgICAgICAgICAgICAgIHN1Ym1pdHRpbmcgPSBkYXRhLnN1Ym1pdHRpbmc7XG5cbiAgICAgICAgICAgIHZhciBldmVudCA9ICQuRXZlbnQoZXZlbnRzLmJlZm9yZVZhbGlkYXRlKTtcbiAgICAgICAgICAgICRmb3JtLnRyaWdnZXIoZXZlbnQsIFttZXNzYWdlcywgZGVmZXJyZWRzXSk7XG4gICAgICAgICAgICBpZiAoc3VibWl0dGluZykge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5yZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuc3VibWl0dGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzdWJtaXRGaW5hbGl6ZSgkZm9ybSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNsaWVudC1zaWRlIHZhbGlkYXRpb25cbiAgICAgICAgICAgICQuZWFjaChkYXRhLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoISQodGhpcy5pbnB1dCkuaXMoXCI6ZGlzYWJsZWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW5jZWxsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gcGVyZm9ybSB2YWxpZGF0aW9uIG9ubHkgaWYgdGhlIGZvcm0gaXMgYmVpbmcgc3VibWl0dGVkIG9yIGlmIGFuIGF0dHJpYnV0ZSBpcyBwZW5kaW5nIHZhbGlkYXRpb25cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VibWl0dGluZyB8fCB0aGlzLnN0YXR1cyA9PT0gMiB8fCB0aGlzLnN0YXR1cyA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1zZyA9IG1lc3NhZ2VzW3RoaXMuaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1zZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNnID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZXNbdGhpcy5pZF0gPSBtc2c7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXZlbnQgPSAkLkV2ZW50KGV2ZW50cy5iZWZvcmVWYWxpZGF0ZUF0dHJpYnV0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS50cmlnZ2VyKGV2ZW50LCBbdGhpcywgbXNnLCBkZWZlcnJlZHNdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5yZXN1bHQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsaWRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZSh0aGlzLCBnZXRWYWx1ZSgkZm9ybSwgdGhpcyksIG1zZywgZGVmZXJyZWRzLCAkZm9ybSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmVuYWJsZUFqYXhWYWxpZGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5lZWRBamF4VmFsaWRhdGlvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbmNlbGxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gYWpheCB2YWxpZGF0aW9uXG4gICAgICAgICAgICAkLndoZW4uYXBwbHkodGhpcywgZGVmZXJyZWRzKS5hbHdheXMoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGVtcHR5IG1lc3NhZ2UgYXJyYXlzXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBtZXNzYWdlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoMCA9PT0gbWVzc2FnZXNbaV0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgbWVzc2FnZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCQuaXNFbXB0eU9iamVjdChtZXNzYWdlcykgJiYgbmVlZEFqYXhWYWxpZGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkYnV0dG9uID0gZGF0YS5zdWJtaXRPYmplY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICBleHREYXRhID0gJyYnICsgZGF0YS5zZXR0aW5ncy5hamF4UGFyYW0gKyAnPScgKyAkZm9ybS5hdHRyKCdpZCcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoJGJ1dHRvbiAmJiAkYnV0dG9uLmxlbmd0aCAmJiAkYnV0dG9uLmF0dHIoJ25hbWUnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXh0RGF0YSArPSAnJicgKyAkYnV0dG9uLmF0dHIoJ25hbWUnKSArICc9JyArICRidXR0b24uYXR0cigndmFsdWUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBkYXRhLnNldHRpbmdzLnZhbGlkYXRpb25VcmwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAkZm9ybS5hdHRyKCdtZXRob2QnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6ICRmb3JtLnNlcmlhbGl6ZSgpICsgZXh0RGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBkYXRhLnNldHRpbmdzLmFqYXhEYXRhVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoanFYSFIsIHRleHRTdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS50cmlnZ2VyKGV2ZW50cy5hamF4Q29tcGxldGUsIFtqcVhIUiwgdGV4dFN0YXR1c10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uIChqcVhIUiwgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS50cmlnZ2VyKGV2ZW50cy5hamF4QmVmb3JlU2VuZCwgW2pxWEhSLCBzZXR0aW5nc10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChtc2dzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1zZ3MgIT09IG51bGwgJiYgdHlwZW9mIG1zZ3MgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChkYXRhLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5lbmFibGVBamF4VmFsaWRhdGlvbiB8fCB0aGlzLmNhbmNlbGxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBtc2dzW3RoaXMuaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlSW5wdXRzKCRmb3JtLCAkLmV4dGVuZChtZXNzYWdlcywgbXNncyksIHN1Ym1pdHRpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZUlucHV0cygkZm9ybSwgbWVzc2FnZXMsIHN1Ym1pdHRpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuc3VibWl0dGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Ym1pdEZpbmFsaXplKCRmb3JtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLnN1Ym1pdHRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZGVsYXkgY2FsbGJhY2sgc28gdGhhdCB0aGUgZm9ybSBjYW4gYmUgc3VibWl0dGVkIHdpdGhvdXQgcHJvYmxlbVxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZUlucHV0cygkZm9ybSwgbWVzc2FnZXMsIHN1Ym1pdHRpbmcpO1xuICAgICAgICAgICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUlucHV0cygkZm9ybSwgbWVzc2FnZXMsIHN1Ym1pdHRpbmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIHN1Ym1pdEZvcm06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgZGF0YSA9ICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKTtcblxuICAgICAgICAgICAgaWYgKGRhdGEudmFsaWRhdGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gU2Vjb25kIHN1Ym1pdCdzIGNhbGwgKGZyb20gdmFsaWRhdGUvdXBkYXRlSW5wdXRzKVxuICAgICAgICAgICAgICAgIGRhdGEuc3VibWl0dGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciBldmVudCA9ICQuRXZlbnQoZXZlbnRzLmJlZm9yZVN1Ym1pdCk7XG4gICAgICAgICAgICAgICAgJGZvcm0udHJpZ2dlcihldmVudCk7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS52YWxpZGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc3VibWl0RmluYWxpemUoJGZvcm0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHVwZGF0ZUhpZGRlbkJ1dHRvbigkZm9ybSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7ICAgLy8gY29udGludWUgc3VibWl0dGluZyB0aGUgZm9ybSBzaW5jZSB2YWxpZGF0aW9uIHBhc3Nlc1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBGaXJzdCBzdWJtaXQncyBjYWxsIChmcm9tIHlpaS5qcy9oYW5kbGVBY3Rpb24pIC0gZXhlY3V0ZSB2YWxpZGF0aW5nXG4gICAgICAgICAgICAgICAgc2V0U3VibWl0RmluYWxpemVEZWZlcigkZm9ybSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5zZXR0aW5ncy50aW1lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChkYXRhLnNldHRpbmdzLnRpbWVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGF0YS5zdWJtaXR0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBtZXRob2RzLnZhbGlkYXRlLmNhbGwoJGZvcm0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICByZXNldEZvcm06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICQodGhpcyk7XG4gICAgICAgICAgICB2YXIgZGF0YSA9ICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKTtcbiAgICAgICAgICAgIC8vIEJlY2F1c2Ugd2UgYmluZCBkaXJlY3RseSB0byBhIGZvcm0gcmVzZXQgZXZlbnQgaW5zdGVhZCBvZiBhIHJlc2V0IGJ1dHRvbiAodGhhdCBtYXkgbm90IGV4aXN0KSxcbiAgICAgICAgICAgIC8vIHdoZW4gdGhpcyBmdW5jdGlvbiBpcyBleGVjdXRlZCBmb3JtIGlucHV0IHZhbHVlcyBoYXZlIG5vdCBiZWVuIHJlc2V0IHlldC5cbiAgICAgICAgICAgIC8vIFRoZXJlZm9yZSB3ZSBkbyB0aGUgYWN0dWFsIHJlc2V0IHdvcmsgdGhyb3VnaCBzZXRUaW1lb3V0LlxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJC5lYWNoKGRhdGEuYXR0cmlidXRlcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXaXRob3V0IHNldFRpbWVvdXQoKSB3ZSB3b3VsZCBnZXQgdGhlIGlucHV0IHZhbHVlcyB0aGF0IGFyZSBub3QgcmVzZXQgeWV0LlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gZ2V0VmFsdWUoJGZvcm0sIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXR1cyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkY29udGFpbmVyID0gJGZvcm0uZmluZCh0aGlzLmNvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgICAgICRjb250YWluZXIucmVtb3ZlQ2xhc3MoXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnNldHRpbmdzLnZhbGlkYXRpbmdDc3NDbGFzcyArICcgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5zZXR0aW5ncy5lcnJvckNzc0NsYXNzICsgJyAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnNldHRpbmdzLnN1Y2Nlc3NDc3NDbGFzc1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAkY29udGFpbmVyLmZpbmQodGhpcy5lcnJvcikuaHRtbCgnJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJGZvcm0uZmluZChkYXRhLnNldHRpbmdzLmVycm9yU3VtbWFyeSkuaGlkZSgpLmZpbmQoJ3VsJykuaHRtbCgnJyk7XG4gICAgICAgICAgICB9LCAxKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlcyBlcnJvciBtZXNzYWdlcywgaW5wdXQgY29udGFpbmVycywgYW5kIG9wdGlvbmFsbHkgc3VtbWFyeSBhcyB3ZWxsLlxuICAgICAgICAgKiBJZiBhbiBhdHRyaWJ1dGUgaXMgbWlzc2luZyBmcm9tIG1lc3NhZ2VzLCBpdCBpcyBjb25zaWRlcmVkIHZhbGlkLlxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZXMgYXJyYXkgdGhlIHZhbGlkYXRpb24gZXJyb3IgbWVzc2FnZXMsIGluZGV4ZWQgYnkgYXR0cmlidXRlIElEc1xuICAgICAgICAgKiBAcGFyYW0gc3VtbWFyeSB3aGV0aGVyIHRvIHVwZGF0ZSBzdW1tYXJ5IGFzIHdlbGwuXG4gICAgICAgICAqL1xuICAgICAgICB1cGRhdGVNZXNzYWdlczogZnVuY3Rpb24gKG1lc3NhZ2VzLCBzdW1tYXJ5KSB7XG4gICAgICAgICAgICB2YXIgJGZvcm0gPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyIGRhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyk7XG4gICAgICAgICAgICAkLmVhY2goZGF0YS5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlSW5wdXQoJGZvcm0sIHRoaXMsIG1lc3NhZ2VzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHN1bW1hcnkpIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVTdW1tYXJ5KCRmb3JtLCBtZXNzYWdlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwZGF0ZXMgZXJyb3IgbWVzc2FnZXMgYW5kIGlucHV0IGNvbnRhaW5lciBvZiBhIHNpbmdsZSBhdHRyaWJ1dGUuXG4gICAgICAgICAqIElmIG1lc3NhZ2VzIGlzIGVtcHR5LCB0aGUgYXR0cmlidXRlIGlzIGNvbnNpZGVyZWQgdmFsaWQuXG4gICAgICAgICAqIEBwYXJhbSBpZCBhdHRyaWJ1dGUgSURcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VzIGFycmF5IHdpdGggZXJyb3IgbWVzc2FnZXNcbiAgICAgICAgICovXG4gICAgICAgIHVwZGF0ZUF0dHJpYnV0ZTogZnVuY3Rpb24oaWQsIG1lc3NhZ2VzKSB7XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlID0gbWV0aG9kcy5maW5kLmNhbGwodGhpcywgaWQpO1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbXNnID0ge307XG4gICAgICAgICAgICAgICAgbXNnW2lkXSA9IG1lc3NhZ2VzO1xuICAgICAgICAgICAgICAgIHVwZGF0ZUlucHV0KCQodGhpcyksIGF0dHJpYnV0ZSwgbXNnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIHZhciB3YXRjaEF0dHJpYnV0ZSA9IGZ1bmN0aW9uICgkZm9ybSwgYXR0cmlidXRlKSB7XG4gICAgICAgIHZhciAkaW5wdXQgPSBmaW5kSW5wdXQoJGZvcm0sIGF0dHJpYnV0ZSk7XG4gICAgICAgIGlmIChhdHRyaWJ1dGUudmFsaWRhdGVPbkNoYW5nZSkge1xuICAgICAgICAgICAgJGlucHV0Lm9uKCdjaGFuZ2UueWlpQWN0aXZlRm9ybScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZUF0dHJpYnV0ZSgkZm9ybSwgYXR0cmlidXRlLCBmYWxzZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cmlidXRlLnZhbGlkYXRlT25CbHVyKSB7XG4gICAgICAgICAgICAkaW5wdXQub24oJ2JsdXIueWlpQWN0aXZlRm9ybScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlLnN0YXR1cyA9PSAwIHx8IGF0dHJpYnV0ZS5zdGF0dXMgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZUF0dHJpYnV0ZSgkZm9ybSwgYXR0cmlidXRlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cmlidXRlLnZhbGlkYXRlT25UeXBlKSB7XG4gICAgICAgICAgICAkaW5wdXQub24oJ2tleXVwLnlpaUFjdGl2ZUZvcm0nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmICgkLmluQXJyYXkoZS53aGljaCwgWzE2LCAxNywgMTgsIDM3LCAzOCwgMzksIDQwXSkgIT09IC0xICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUudmFsdWUgIT09IGdldFZhbHVlKCRmb3JtLCBhdHRyaWJ1dGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlQXR0cmlidXRlKCRmb3JtLCBhdHRyaWJ1dGUsIGZhbHNlLCBhdHRyaWJ1dGUudmFsaWRhdGlvbkRlbGF5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgdW53YXRjaEF0dHJpYnV0ZSA9IGZ1bmN0aW9uICgkZm9ybSwgYXR0cmlidXRlKSB7XG4gICAgICAgIGZpbmRJbnB1dCgkZm9ybSwgYXR0cmlidXRlKS5vZmYoJy55aWlBY3RpdmVGb3JtJyk7XG4gICAgfTtcblxuICAgIHZhciB2YWxpZGF0ZUF0dHJpYnV0ZSA9IGZ1bmN0aW9uICgkZm9ybSwgYXR0cmlidXRlLCBmb3JjZVZhbGlkYXRlLCB2YWxpZGF0aW9uRGVsYXkpIHtcbiAgICAgICAgdmFyIGRhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyk7XG5cbiAgICAgICAgaWYgKGZvcmNlVmFsaWRhdGUpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZS5zdGF0dXMgPSAyO1xuICAgICAgICB9XG4gICAgICAgICQuZWFjaChkYXRhLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlICE9PSBnZXRWYWx1ZSgkZm9ybSwgdGhpcykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXR1cyA9IDI7XG4gICAgICAgICAgICAgICAgZm9yY2VWYWxpZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIWZvcmNlVmFsaWRhdGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkYXRhLnNldHRpbmdzLnRpbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChkYXRhLnNldHRpbmdzLnRpbWVyKTtcbiAgICAgICAgfVxuICAgICAgICBkYXRhLnNldHRpbmdzLnRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoZGF0YS5zdWJtaXR0aW5nIHx8ICRmb3JtLmlzKCc6aGlkZGVuJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkLmVhY2goZGF0YS5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gMztcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0uZmluZCh0aGlzLmNvbnRhaW5lcikuYWRkQ2xhc3MoZGF0YS5zZXR0aW5ncy52YWxpZGF0aW5nQ3NzQ2xhc3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbWV0aG9kcy52YWxpZGF0ZS5jYWxsKCRmb3JtKTtcbiAgICAgICAgfSwgdmFsaWRhdGlvbkRlbGF5ID8gdmFsaWRhdGlvbkRlbGF5IDogMjAwKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBwcm90b3R5cGUgd2l0aCBhIHNob3J0Y3V0IG1ldGhvZCBmb3IgYWRkaW5nIGEgbmV3IGRlZmVycmVkLlxuICAgICAqIFRoZSBjb250ZXh0IG9mIHRoZSBjYWxsYmFjayB3aWxsIGJlIHRoZSBkZWZlcnJlZCBvYmplY3Qgc28gaXQgY2FuIGJlIHJlc29sdmVkIGxpa2UgYGBgdGhpcy5yZXNvbHZlKClgYGBcbiAgICAgKiBAcmV0dXJucyBBcnJheVxuICAgICAqL1xuICAgIHZhciBkZWZlcnJlZEFycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICAgICAgYXJyYXkuYWRkID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMucHVzaChuZXcgJC5EZWZlcnJlZChjYWxsYmFjaykpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIGVycm9yIG1lc3NhZ2VzIGFuZCB0aGUgaW5wdXQgY29udGFpbmVycyBmb3IgYWxsIGFwcGxpY2FibGUgYXR0cmlidXRlc1xuICAgICAqIEBwYXJhbSAkZm9ybSB0aGUgZm9ybSBqUXVlcnkgb2JqZWN0XG4gICAgICogQHBhcmFtIG1lc3NhZ2VzIGFycmF5IHRoZSB2YWxpZGF0aW9uIGVycm9yIG1lc3NhZ2VzXG4gICAgICogQHBhcmFtIHN1Ym1pdHRpbmcgd2hldGhlciB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgYWZ0ZXIgdmFsaWRhdGlvbiB0cmlnZ2VyZWQgYnkgZm9ybSBzdWJtaXNzaW9uXG4gICAgICovXG4gICAgdmFyIHVwZGF0ZUlucHV0cyA9IGZ1bmN0aW9uICgkZm9ybSwgbWVzc2FnZXMsIHN1Ym1pdHRpbmcpIHtcbiAgICAgICAgdmFyIGRhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyk7XG5cbiAgICAgICAgaWYgKHN1Ym1pdHRpbmcpIHtcbiAgICAgICAgICAgIHZhciBlcnJvckF0dHJpYnV0ZXMgPSBbXTtcbiAgICAgICAgICAgICQuZWFjaChkYXRhLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoISQodGhpcy5pbnB1dCkuaXMoXCI6ZGlzYWJsZWRcIikgJiYgIXRoaXMuY2FuY2VsbGVkICYmIHVwZGF0ZUlucHV0KCRmb3JtLCB0aGlzLCBtZXNzYWdlcykpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JBdHRyaWJ1dGVzLnB1c2godGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRmb3JtLnRyaWdnZXIoZXZlbnRzLmFmdGVyVmFsaWRhdGUsIFttZXNzYWdlcywgZXJyb3JBdHRyaWJ1dGVzXSk7XG5cbiAgICAgICAgICAgIHVwZGF0ZVN1bW1hcnkoJGZvcm0sIG1lc3NhZ2VzKTtcblxuICAgICAgICAgICAgaWYgKGVycm9yQXR0cmlidXRlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5zZXR0aW5ncy5zY3JvbGxUb0Vycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0b3AgPSAkZm9ybS5maW5kKCQubWFwKGVycm9yQXR0cmlidXRlcywgZnVuY3Rpb24oYXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXR0cmlidXRlLmlucHV0O1xuICAgICAgICAgICAgICAgICAgICB9KS5qb2luKCcsJykpLmZpcnN0KCkuY2xvc2VzdCgnOnZpc2libGUnKS5vZmZzZXQoKS50b3A7XG4gICAgICAgICAgICAgICAgICAgIHZhciB3dG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9wIDwgd3RvcCB8fCB0b3AgPiB3dG9wICsgJCh3aW5kb3cpLmhlaWdodCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKHRvcCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGF0YS5zdWJtaXR0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRhdGEudmFsaWRhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB2YXIgYnV0dG9uVGFyZ2V0ID0gZGF0YS5zdWJtaXRPYmplY3QgPyBkYXRhLnN1Ym1pdE9iamVjdC5hdHRyKCdmb3JtdGFyZ2V0JykgOiBudWxsO1xuICAgICAgICAgICAgICAgIGlmIChidXR0b25UYXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0IHRhcmdldCBhdHRyaWJ1dGUgdG8gZm9ybSB0YWcgYmVmb3JlIHN1Ym1pdFxuICAgICAgICAgICAgICAgICAgICAkZm9ybS5hdHRyKCd0YXJnZXQnLCBidXR0b25UYXJnZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkZm9ybS5zdWJtaXQoKTtcbiAgICAgICAgICAgICAgICAvLyByZXN0b3JlIG9yaWdpbmFsIHRhcmdldCBhdHRyaWJ1dGUgdmFsdWVcbiAgICAgICAgICAgICAgICAkZm9ybS5hdHRyKCd0YXJnZXQnLCBkYXRhLnRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkLmVhY2goZGF0YS5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNhbmNlbGxlZCAmJiAodGhpcy5zdGF0dXMgPT09IDIgfHwgdGhpcy5zdGF0dXMgPT09IDMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUlucHV0KCRmb3JtLCB0aGlzLCBtZXNzYWdlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc3VibWl0RmluYWxpemUoJGZvcm0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIGhpZGRlbiBmaWVsZCB0aGF0IHJlcHJlc2VudHMgY2xpY2tlZCBzdWJtaXQgYnV0dG9uLlxuICAgICAqIEBwYXJhbSAkZm9ybSB0aGUgZm9ybSBqUXVlcnkgb2JqZWN0LlxuICAgICAqL1xuICAgIHZhciB1cGRhdGVIaWRkZW5CdXR0b24gPSBmdW5jdGlvbiAoJGZvcm0pIHtcbiAgICAgICAgdmFyIGRhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyk7XG4gICAgICAgIHZhciAkYnV0dG9uID0gZGF0YS5zdWJtaXRPYmplY3QgfHwgJGZvcm0uZmluZCgnOnN1Ym1pdDpmaXJzdCcpO1xuICAgICAgICAvLyBUT0RPOiBpZiB0aGUgc3VibWlzc2lvbiBpcyBjYXVzZWQgYnkgXCJjaGFuZ2VcIiBldmVudCwgaXQgd2lsbCBub3Qgd29ya1xuICAgICAgICBpZiAoJGJ1dHRvbi5sZW5ndGggJiYgJGJ1dHRvbi5hdHRyKCd0eXBlJykgPT0gJ3N1Ym1pdCcgJiYgJGJ1dHRvbi5hdHRyKCduYW1lJykpIHtcbiAgICAgICAgICAgIC8vIHNpbXVsYXRlIGJ1dHRvbiBpbnB1dCB2YWx1ZVxuICAgICAgICAgICAgdmFyICRoaWRkZW5CdXR0b24gPSAkKCdpbnB1dFt0eXBlPVwiaGlkZGVuXCJdW25hbWU9XCInICsgJGJ1dHRvbi5hdHRyKCduYW1lJykgKyAnXCJdJywgJGZvcm0pO1xuICAgICAgICAgICAgaWYgKCEkaGlkZGVuQnV0dG9uLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICQoJzxpbnB1dD4nKS5hdHRyKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2hpZGRlbicsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICRidXR0b24uYXR0cignbmFtZScpLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJGJ1dHRvbi5hdHRyKCd2YWx1ZScpXG4gICAgICAgICAgICAgICAgfSkuYXBwZW5kVG8oJGZvcm0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkaGlkZGVuQnV0dG9uLmF0dHIoJ3ZhbHVlJywgJGJ1dHRvbi5hdHRyKCd2YWx1ZScpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBlcnJvciBtZXNzYWdlIGFuZCB0aGUgaW5wdXQgY29udGFpbmVyIGZvciBhIHBhcnRpY3VsYXIgYXR0cmlidXRlLlxuICAgICAqIEBwYXJhbSAkZm9ybSB0aGUgZm9ybSBqUXVlcnkgb2JqZWN0XG4gICAgICogQHBhcmFtIGF0dHJpYnV0ZSBvYmplY3QgdGhlIGNvbmZpZ3VyYXRpb24gZm9yIGEgcGFydGljdWxhciBhdHRyaWJ1dGUuXG4gICAgICogQHBhcmFtIG1lc3NhZ2VzIGFycmF5IHRoZSB2YWxpZGF0aW9uIGVycm9yIG1lc3NhZ2VzXG4gICAgICogQHJldHVybiBib29sZWFuIHdoZXRoZXIgdGhlcmUgaXMgYSB2YWxpZGF0aW9uIGVycm9yIGZvciB0aGUgc3BlY2lmaWVkIGF0dHJpYnV0ZVxuICAgICAqL1xuICAgIHZhciB1cGRhdGVJbnB1dCA9IGZ1bmN0aW9uICgkZm9ybSwgYXR0cmlidXRlLCBtZXNzYWdlcykge1xuICAgICAgICB2YXIgZGF0YSA9ICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKSxcbiAgICAgICAgICAgICRpbnB1dCA9IGZpbmRJbnB1dCgkZm9ybSwgYXR0cmlidXRlKSxcbiAgICAgICAgICAgIGhhc0Vycm9yID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKCEkLmlzQXJyYXkobWVzc2FnZXNbYXR0cmlidXRlLmlkXSkpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzW2F0dHJpYnV0ZS5pZF0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICAkZm9ybS50cmlnZ2VyKGV2ZW50cy5hZnRlclZhbGlkYXRlQXR0cmlidXRlLCBbYXR0cmlidXRlLCBtZXNzYWdlc1thdHRyaWJ1dGUuaWRdXSk7XG5cbiAgICAgICAgYXR0cmlidXRlLnN0YXR1cyA9IDE7XG4gICAgICAgIGlmICgkaW5wdXQubGVuZ3RoKSB7XG4gICAgICAgICAgICBoYXNFcnJvciA9IG1lc3NhZ2VzW2F0dHJpYnV0ZS5pZF0ubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIHZhciAkY29udGFpbmVyID0gJGZvcm0uZmluZChhdHRyaWJ1dGUuY29udGFpbmVyKTtcbiAgICAgICAgICAgIHZhciAkZXJyb3IgPSAkY29udGFpbmVyLmZpbmQoYXR0cmlidXRlLmVycm9yKTtcbiAgICAgICAgICAgIGlmIChoYXNFcnJvcikge1xuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUuZW5jb2RlRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgJGVycm9yLnRleHQobWVzc2FnZXNbYXR0cmlidXRlLmlkXVswXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJGVycm9yLmh0bWwobWVzc2FnZXNbYXR0cmlidXRlLmlkXVswXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRjb250YWluZXIucmVtb3ZlQ2xhc3MoZGF0YS5zZXR0aW5ncy52YWxpZGF0aW5nQ3NzQ2xhc3MgKyAnICcgKyBkYXRhLnNldHRpbmdzLnN1Y2Nlc3NDc3NDbGFzcylcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKGRhdGEuc2V0dGluZ3MuZXJyb3JDc3NDbGFzcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRlcnJvci5lbXB0eSgpO1xuICAgICAgICAgICAgICAgICRjb250YWluZXIucmVtb3ZlQ2xhc3MoZGF0YS5zZXR0aW5ncy52YWxpZGF0aW5nQ3NzQ2xhc3MgKyAnICcgKyBkYXRhLnNldHRpbmdzLmVycm9yQ3NzQ2xhc3MgKyAnICcpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhkYXRhLnNldHRpbmdzLnN1Y2Nlc3NDc3NDbGFzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhdHRyaWJ1dGUudmFsdWUgPSBnZXRWYWx1ZSgkZm9ybSwgYXR0cmlidXRlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFzRXJyb3I7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIGVycm9yIHN1bW1hcnkuXG4gICAgICogQHBhcmFtICRmb3JtIHRoZSBmb3JtIGpRdWVyeSBvYmplY3RcbiAgICAgKiBAcGFyYW0gbWVzc2FnZXMgYXJyYXkgdGhlIHZhbGlkYXRpb24gZXJyb3IgbWVzc2FnZXNcbiAgICAgKi9cbiAgICB2YXIgdXBkYXRlU3VtbWFyeSA9IGZ1bmN0aW9uICgkZm9ybSwgbWVzc2FnZXMpIHtcbiAgICAgICAgdmFyIGRhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyksXG4gICAgICAgICAgICAkc3VtbWFyeSA9ICRmb3JtLmZpbmQoZGF0YS5zZXR0aW5ncy5lcnJvclN1bW1hcnkpLFxuICAgICAgICAgICAgJHVsID0gJHN1bW1hcnkuZmluZCgndWwnKS5lbXB0eSgpO1xuXG4gICAgICAgIGlmICgkc3VtbWFyeS5sZW5ndGggJiYgbWVzc2FnZXMpIHtcbiAgICAgICAgICAgICQuZWFjaChkYXRhLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJC5pc0FycmF5KG1lc3NhZ2VzW3RoaXMuaWRdKSAmJiBtZXNzYWdlc1t0aGlzLmlkXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0gJCgnPGxpLz4nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc2V0dGluZ3MuZW5jb2RlRXJyb3JTdW1tYXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvci50ZXh0KG1lc3NhZ2VzW3RoaXMuaWRdWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yLmh0bWwobWVzc2FnZXNbdGhpcy5pZF1bMF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICR1bC5hcHBlbmQoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHN1bW1hcnkudG9nZ2xlKCR1bC5maW5kKCdsaScpLmxlbmd0aCA+IDApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBnZXRWYWx1ZSA9IGZ1bmN0aW9uICgkZm9ybSwgYXR0cmlidXRlKSB7XG4gICAgICAgIHZhciAkaW5wdXQgPSBmaW5kSW5wdXQoJGZvcm0sIGF0dHJpYnV0ZSk7XG4gICAgICAgIHZhciB0eXBlID0gJGlucHV0LmF0dHIoJ3R5cGUnKTtcbiAgICAgICAgaWYgKHR5cGUgPT09ICdjaGVja2JveCcgfHwgdHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgICAgICAgdmFyICRyZWFsSW5wdXQgPSAkaW5wdXQuZmlsdGVyKCc6Y2hlY2tlZCcpO1xuICAgICAgICAgICAgaWYgKCEkcmVhbElucHV0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRyZWFsSW5wdXQgPSAkZm9ybS5maW5kKCdpbnB1dFt0eXBlPWhpZGRlbl1bbmFtZT1cIicgKyAkaW5wdXQuYXR0cignbmFtZScpICsgJ1wiXScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICRyZWFsSW5wdXQudmFsKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJGlucHV0LnZhbCgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBmaW5kSW5wdXQgPSBmdW5jdGlvbiAoJGZvcm0sIGF0dHJpYnV0ZSkge1xuICAgICAgICB2YXIgJGlucHV0ID0gJGZvcm0uZmluZChhdHRyaWJ1dGUuaW5wdXQpO1xuICAgICAgICBpZiAoJGlucHV0Lmxlbmd0aCAmJiAkaW5wdXRbMF0udGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnZGl2Jykge1xuICAgICAgICAgICAgLy8gY2hlY2tib3ggbGlzdCBvciByYWRpbyBsaXN0XG4gICAgICAgICAgICByZXR1cm4gJGlucHV0LmZpbmQoJ2lucHV0Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJGlucHV0O1xuICAgICAgICB9XG4gICAgfTtcblxufSkod2luZG93LmpRdWVyeSk7XG4iLCIvKiFcbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0ICZjb3B5OyBLYXJ0aWsgVmlzd2Vzd2FyYW4sIEtyYWplZS5jb20sIDIwMTRcbiAqIEBwYWNrYWdlIHlpaTItd2lkZ2V0c1xuICogQHN1YnBhY2thZ2UgeWlpMi13aWRnZXQtZGVwZHJvcFxuICogQHZlcnNpb24gMS4wLjFcbiAqXG4gKiBFeHRlbnNpb25zIHRvIGRlcGVuZGVudCBkcm9wZG93biBmb3IgWWlpOlxuICogLSBJbml0aWFsaXplcyBkZXBlbmRlbnQgZHJvcGRvd24gZm9yIFNlbGVjdDIgd2lkZ2V0XG4gKiBcbiAqIEZvciBtb3JlIEpRdWVyeSBwbHVnaW5zIHZpc2l0IGh0dHA6Ly9wbHVnaW5zLmtyYWplZS5jb21cbiAqIEZvciBtb3JlIFlpaSByZWxhdGVkIGRlbW9zIHZpc2l0IGh0dHA6Ly9kZW1vcy5rcmFqZWUuY29tXG4gKi9cbnZhciBpbml0RGVwZHJvcFMyID0gZnVuY3Rpb24gKGlkLCB0ZXh0KSB7XG4gICAgKGZ1bmN0aW9uICgkKSB7XG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICB2YXIgJHMyID0gJCgnIycgKyBpZCksICRzMmNvbnQgPSAkKCcjc2VsZWN0Mi0nICsgaWQgKyAnLWNvbnRhaW5lcicpLCBwaCA9ICcuLi4nO1xuICAgICAgICAkczIub24oJ2RlcGRyb3AuYmVmb3JlQ2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHMyLmZpbmQoJ29wdGlvbicpLmF0dHIoJ3ZhbHVlJywgcGgpLmh0bWwodGV4dCk7XG4gICAgICAgICAgICAkczIuc2VsZWN0MigndmFsJywgcGgpO1xuICAgICAgICAgICAgJHMyY29udC5yZW1vdmVDbGFzcygna3YtbG9hZGluZycpLmFkZENsYXNzKCdrdi1sb2FkaW5nJyk7XG4gICAgICAgIH0pLm9uKCdkZXBkcm9wLmNoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRzMi5zZWxlY3QyKCd2YWwnLCAkczIudmFsKCkpO1xuICAgICAgICAgICAgJHMyY29udC5yZW1vdmVDbGFzcygna3YtbG9hZGluZycpO1xuICAgICAgICB9KTtcbiAgICB9KHdpbmRvdy5qUXVlcnkpKTtcbn07IiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKCdyZWFkeScpO1xufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
