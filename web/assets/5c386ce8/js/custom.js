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

jQuery(document).ready(function () {
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

            if (submitting) {
                var event = $.Event(events.beforeValidate);
                $form.trigger(event, [messages, deferreds]);
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

$(document).ready(function () {
    console.log('ready');
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInlpaS5qcyIsInlpaS52YWxpZGF0aW9uLmpzIiwieWlpLmFjdGl2ZUZvcm0uanMiLCJhcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2c0JBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImN1c3RvbS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogWWlpIEphdmFTY3JpcHQgbW9kdWxlLlxuICpcbiAqIEBsaW5rIGh0dHA6Ly93d3cueWlpZnJhbWV3b3JrLmNvbS9cbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDA4IFlpaSBTb2Z0d2FyZSBMTENcbiAqIEBsaWNlbnNlIGh0dHA6Ly93d3cueWlpZnJhbWV3b3JrLmNvbS9saWNlbnNlL1xuICogQGF1dGhvciBRaWFuZyBYdWUgPHFpYW5nLnh1ZUBnbWFpbC5jb20+XG4gKiBAc2luY2UgMi4wXG4gKi9cblxuLyoqXG4gKiB5aWkgaXMgdGhlIHJvb3QgbW9kdWxlIGZvciBhbGwgWWlpIEphdmFTY3JpcHQgbW9kdWxlcy5cbiAqIEl0IGltcGxlbWVudHMgYSBtZWNoYW5pc20gb2Ygb3JnYW5pemluZyBKYXZhU2NyaXB0IGNvZGUgaW4gbW9kdWxlcyB0aHJvdWdoIHRoZSBmdW5jdGlvbiBcInlpaS5pbml0TW9kdWxlKClcIi5cbiAqXG4gKiBFYWNoIG1vZHVsZSBzaG91bGQgYmUgbmFtZWQgYXMgXCJ4LnkuelwiLCB3aGVyZSBcInhcIiBzdGFuZHMgZm9yIHRoZSByb290IG1vZHVsZSAoZm9yIHRoZSBZaWkgY29yZSBjb2RlLCB0aGlzIGlzIFwieWlpXCIpLlxuICpcbiAqIEEgbW9kdWxlIG1heSBiZSBzdHJ1Y3R1cmVkIGFzIGZvbGxvd3M6XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogeWlpLnNhbXBsZSA9IChmdW5jdGlvbigkKSB7XG4gKiAgICAgdmFyIHB1YiA9IHtcbiAqICAgICAgICAgLy8gd2hldGhlciB0aGlzIG1vZHVsZSBpcyBjdXJyZW50bHkgYWN0aXZlLiBJZiBmYWxzZSwgaW5pdCgpIHdpbGwgbm90IGJlIGNhbGxlZCBmb3IgdGhpcyBtb2R1bGVcbiAqICAgICAgICAgLy8gaXQgd2lsbCBhbHNvIG5vdCBiZSBjYWxsZWQgZm9yIGFsbCBpdHMgY2hpbGQgbW9kdWxlcy4gSWYgdGhpcyBwcm9wZXJ0eSBpcyB1bmRlZmluZWQsIGl0IG1lYW5zIHRydWUuXG4gKiAgICAgICAgIGlzQWN0aXZlOiB0cnVlLFxuICogICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAqICAgICAgICAgICAgIC8vIC4uLiBtb2R1bGUgaW5pdGlhbGl6YXRpb24gY29kZSBnbyBoZXJlIC4uLlxuICogICAgICAgICB9LFxuICpcbiAqICAgICAgICAgLy8gLi4uIG90aGVyIHB1YmxpYyBmdW5jdGlvbnMgYW5kIHByb3BlcnRpZXMgZ28gaGVyZSAuLi5cbiAqICAgICB9O1xuICpcbiAqICAgICAvLyAuLi4gcHJpdmF0ZSBmdW5jdGlvbnMgYW5kIHByb3BlcnRpZXMgZ28gaGVyZSAuLi5cbiAqXG4gKiAgICAgcmV0dXJuIHB1YjtcbiAqIH0pKGpRdWVyeSk7XG4gKiBgYGBcbiAqXG4gKiBVc2luZyB0aGlzIHN0cnVjdHVyZSwgeW91IGNhbiBkZWZpbmUgcHVibGljIGFuZCBwcml2YXRlIGZ1bmN0aW9ucy9wcm9wZXJ0aWVzIGZvciBhIG1vZHVsZS5cbiAqIFByaXZhdGUgZnVuY3Rpb25zL3Byb3BlcnRpZXMgYXJlIG9ubHkgdmlzaWJsZSB3aXRoaW4gdGhlIG1vZHVsZSwgd2hpbGUgcHVibGljIGZ1bmN0aW9ucy9wcm9wZXJ0aWVzXG4gKiBtYXkgYmUgYWNjZXNzZWQgb3V0c2lkZSBvZiB0aGUgbW9kdWxlLiBGb3IgZXhhbXBsZSwgeW91IGNhbiBhY2Nlc3MgXCJ5aWkuc2FtcGxlLmlzQWN0aXZlXCIuXG4gKlxuICogWW91IG11c3QgY2FsbCBcInlpaS5pbml0TW9kdWxlKClcIiBvbmNlIGZvciB0aGUgcm9vdCBtb2R1bGUgb2YgYWxsIHlvdXIgbW9kdWxlcy5cbiAqL1xueWlpID0gKGZ1bmN0aW9uICgkKSB7XG4gICAgdmFyIHB1YiA9IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIExpc3Qgb2YgSlMgb3IgQ1NTIFVSTHMgdGhhdCBjYW4gYmUgbG9hZGVkIG11bHRpcGxlIHRpbWVzIHZpYSBBSkFYIHJlcXVlc3RzLiBFYWNoIHNjcmlwdCBjYW4gYmUgcmVwcmVzZW50ZWRcbiAgICAgICAgICogYXMgZWl0aGVyIGFuIGFic29sdXRlIFVSTCBvciBhIHJlbGF0aXZlIG9uZS5cbiAgICAgICAgICovXG4gICAgICAgIHJlbG9hZGFibGVTY3JpcHRzOiBbXSxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBzZWxlY3RvciBmb3IgY2xpY2thYmxlIGVsZW1lbnRzIHRoYXQgbmVlZCB0byBzdXBwb3J0IGNvbmZpcm1hdGlvbiBhbmQgZm9ybSBzdWJtaXNzaW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgY2xpY2thYmxlU2VsZWN0b3I6ICdhLCBidXR0b24sIGlucHV0W3R5cGU9XCJzdWJtaXRcIl0sIGlucHV0W3R5cGU9XCJidXR0b25cIl0sIGlucHV0W3R5cGU9XCJyZXNldFwiXSwgaW5wdXRbdHlwZT1cImltYWdlXCJdJyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBzZWxlY3RvciBmb3IgY2hhbmdlYWJsZSBlbGVtZW50cyB0aGF0IG5lZWQgdG8gc3VwcG9ydCBjb25maXJtYXRpb24gYW5kIGZvcm0gc3VibWlzc2lvbi5cbiAgICAgICAgICovXG4gICAgICAgIGNoYW5nZWFibGVTZWxlY3RvcjogJ3NlbGVjdCwgaW5wdXQsIHRleHRhcmVhJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHJldHVybiBzdHJpbmd8dW5kZWZpbmVkIHRoZSBDU1JGIHBhcmFtZXRlciBuYW1lLiBVbmRlZmluZWQgaXMgcmV0dXJuZWQgaWYgQ1NSRiB2YWxpZGF0aW9uIGlzIG5vdCBlbmFibGVkLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0Q3NyZlBhcmFtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJCgnbWV0YVtuYW1lPWNzcmYtcGFyYW1dJykuYXR0cignY29udGVudCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJuIHN0cmluZ3x1bmRlZmluZWQgdGhlIENTUkYgdG9rZW4uIFVuZGVmaW5lZCBpcyByZXR1cm5lZCBpZiBDU1JGIHZhbGlkYXRpb24gaXMgbm90IGVuYWJsZWQuXG4gICAgICAgICAqL1xuICAgICAgICBnZXRDc3JmVG9rZW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkKCdtZXRhW25hbWU9Y3NyZi10b2tlbl0nKS5hdHRyKCdjb250ZW50Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIENTUkYgdG9rZW4gaW4gdGhlIG1ldGEgZWxlbWVudHMuXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIGlzIHByb3ZpZGVkIHNvIHRoYXQgeW91IGNhbiB1cGRhdGUgdGhlIENTUkYgdG9rZW4gd2l0aCB0aGUgbGF0ZXN0IG9uZSB5b3Ugb2J0YWluIGZyb20gdGhlIHNlcnZlci5cbiAgICAgICAgICogQHBhcmFtIG5hbWUgdGhlIENTUkYgdG9rZW4gbmFtZVxuICAgICAgICAgKiBAcGFyYW0gdmFsdWUgdGhlIENTUkYgdG9rZW4gdmFsdWVcbiAgICAgICAgICovXG4gICAgICAgIHNldENzcmZUb2tlbjogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICAkKCdtZXRhW25hbWU9Y3NyZi1wYXJhbV0nKS5hdHRyKCdjb250ZW50JywgbmFtZSk7XG4gICAgICAgICAgICAkKCdtZXRhW25hbWU9Y3NyZi10b2tlbl0nKS5hdHRyKCdjb250ZW50JywgdmFsdWUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGVzIGFsbCBmb3JtIENTUkYgaW5wdXQgZmllbGRzIHdpdGggdGhlIGxhdGVzdCBDU1JGIHRva2VuLlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCBpcyBwcm92aWRlZCB0byBhdm9pZCBjYWNoZWQgZm9ybXMgY29udGFpbmluZyBvdXRkYXRlZCBDU1JGIHRva2Vucy5cbiAgICAgICAgICovXG4gICAgICAgIHJlZnJlc2hDc3JmVG9rZW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IHB1Yi5nZXRDc3JmVG9rZW4oKTtcbiAgICAgICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgICAgICQoJ2Zvcm0gaW5wdXRbbmFtZT1cIicgKyBwdWIuZ2V0Q3NyZlBhcmFtKCkgKyAnXCJdJykudmFsKHRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzcGxheXMgYSBjb25maXJtYXRpb24gZGlhbG9nLlxuICAgICAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBzaW1wbHkgZGlzcGxheXMgYSBqcyBjb25maXJtYXRpb24gZGlhbG9nLlxuICAgICAgICAgKiBZb3UgbWF5IG92ZXJyaWRlIHRoaXMgYnkgc2V0dGluZyBgeWlpLmNvbmZpcm1gLlxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZSB0aGUgY29uZmlybWF0aW9uIG1lc3NhZ2UuXG4gICAgICAgICAqIEBwYXJhbSBvayBhIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSB1c2VyIGNvbmZpcm1zIHRoZSBtZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSBjYW5jZWwgYSBjYWxsYmFjayB0byBiZSBjYWxsZWQgd2hlbiB0aGUgdXNlciBjYW5jZWxzIHRoZSBjb25maXJtYXRpb25cbiAgICAgICAgICovXG4gICAgICAgIGNvbmZpcm06IGZ1bmN0aW9uIChtZXNzYWdlLCBvaywgY2FuY2VsKSB7XG4gICAgICAgICAgICBpZiAoY29uZmlybShtZXNzYWdlKSkge1xuICAgICAgICAgICAgICAgICFvayB8fCBvaygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAhY2FuY2VsIHx8IGNhbmNlbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBIYW5kbGVzIHRoZSBhY3Rpb24gdHJpZ2dlcmVkIGJ5IHVzZXIuXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIHJlY29nbml6ZXMgdGhlIGBkYXRhLW1ldGhvZGAgYXR0cmlidXRlIG9mIHRoZSBlbGVtZW50LiBJZiB0aGUgYXR0cmlidXRlIGV4aXN0cyxcbiAgICAgICAgICogdGhlIG1ldGhvZCB3aWxsIHN1Ym1pdCB0aGUgZm9ybSBjb250YWluaW5nIHRoaXMgZWxlbWVudC4gSWYgdGhlcmUgaXMgbm8gY29udGFpbmluZyBmb3JtLCBhIGZvcm1cbiAgICAgICAgICogd2lsbCBiZSBjcmVhdGVkIGFuZCBzdWJtaXR0ZWQgdXNpbmcgdGhlIG1ldGhvZCBnaXZlbiBieSB0aGlzIGF0dHJpYnV0ZSB2YWx1ZSAoZS5nLiBcInBvc3RcIiwgXCJwdXRcIikuXG4gICAgICAgICAqIEZvciBoeXBlcmxpbmtzLCB0aGUgZm9ybSBhY3Rpb24gd2lsbCB0YWtlIHRoZSB2YWx1ZSBvZiB0aGUgXCJocmVmXCIgYXR0cmlidXRlIG9mIHRoZSBsaW5rLlxuICAgICAgICAgKiBGb3Igb3RoZXIgZWxlbWVudHMsIGVpdGhlciB0aGUgY29udGFpbmluZyBmb3JtIGFjdGlvbiBvciB0aGUgY3VycmVudCBwYWdlIFVSTCB3aWxsIGJlIHVzZWRcbiAgICAgICAgICogYXMgdGhlIGZvcm0gYWN0aW9uIFVSTC5cbiAgICAgICAgICpcbiAgICAgICAgICogSWYgdGhlIGBkYXRhLW1ldGhvZGAgYXR0cmlidXRlIGlzIG5vdCBkZWZpbmVkLCB0aGUgYGhyZWZgIGF0dHJpYnV0ZSAoaWYgYW55KSBvZiB0aGUgZWxlbWVudFxuICAgICAgICAgKiB3aWxsIGJlIGFzc2lnbmVkIHRvIGB3aW5kb3cubG9jYXRpb25gLlxuICAgICAgICAgKlxuICAgICAgICAgKiBTdGFydGluZyBmcm9tIHZlcnNpb24gMi4wLjMsIHRoZSBgZGF0YS1wYXJhbXNgIGF0dHJpYnV0ZSBpcyBhbHNvIHJlY29nbml6ZWQgd2hlbiB5b3Ugc3BlY2lmeVxuICAgICAgICAgKiBgZGF0YS1tZXRob2RgLiBUaGUgdmFsdWUgb2YgYGRhdGEtcGFyYW1zYCBzaG91bGQgYmUgYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBkYXRhIChuYW1lLXZhbHVlIHBhaXJzKVxuICAgICAgICAgKiB0aGF0IHNob3VsZCBiZSBzdWJtaXR0ZWQgYXMgaGlkZGVuIGlucHV0cy4gRm9yIGV4YW1wbGUsIHlvdSBtYXkgdXNlIHRoZSBmb2xsb3dpbmcgY29kZSB0byBnZW5lcmF0ZVxuICAgICAgICAgKiBzdWNoIGEgbGluazpcbiAgICAgICAgICpcbiAgICAgICAgICogYGBgcGhwXG4gICAgICAgICAqIHVzZSB5aWlcXGhlbHBlcnNcXEh0bWw7XG4gICAgICAgICAqIHVzZSB5aWlcXGhlbHBlcnNcXEpzb247XG4gICAgICAgICAqXG4gICAgICAgICAqIGVjaG8gSHRtbDo6YSgnc3VibWl0JywgWydzaXRlL2Zvb2JhciddLCBbXG4gICAgICAgICAqICAgICAnZGF0YScgPT4gW1xuICAgICAgICAgKiAgICAgICAgICdtZXRob2QnID0+ICdwb3N0JyxcbiAgICAgICAgICogICAgICAgICAncGFyYW1zJyA9PiBbXG4gICAgICAgICAqICAgICAgICAgICAgICduYW1lMScgPT4gJ3ZhbHVlMScsXG4gICAgICAgICAqICAgICAgICAgICAgICduYW1lMicgPT4gJ3ZhbHVlMicsXG4gICAgICAgICAqICAgICAgICAgXSxcbiAgICAgICAgICogICAgIF0sXG4gICAgICAgICAqIF07XG4gICAgICAgICAqIGBgYFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gJGUgdGhlIGpRdWVyeSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZWxlbWVudFxuICAgICAgICAgKi9cbiAgICAgICAgaGFuZGxlQWN0aW9uOiBmdW5jdGlvbiAoJGUsIGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgJGZvcm0gPSAkZS5hdHRyKCdkYXRhLWZvcm0nKSA/ICQoJyMnICsgJGUuYXR0cignZGF0YS1mb3JtJykpIDogJGUuY2xvc2VzdCgnZm9ybScpLFxuICAgICAgICAgICAgICAgIG1ldGhvZCA9ICEkZS5kYXRhKCdtZXRob2QnKSAmJiAkZm9ybSA/ICRmb3JtLmF0dHIoJ21ldGhvZCcpIDogJGUuZGF0YSgnbWV0aG9kJyksXG4gICAgICAgICAgICAgICAgYWN0aW9uID0gJGUuYXR0cignaHJlZicpLFxuICAgICAgICAgICAgICAgIHBhcmFtcyA9ICRlLmRhdGEoJ3BhcmFtcycpLFxuICAgICAgICAgICAgICAgIHBqYXggPSAkZS5kYXRhKCdwamF4JyksXG4gICAgICAgICAgICAgICAgcGpheFB1c2hTdGF0ZSA9ICEhJGUuZGF0YSgncGpheC1wdXNoLXN0YXRlJyksXG4gICAgICAgICAgICAgICAgcGpheFJlcGxhY2VTdGF0ZSA9ICEhJGUuZGF0YSgncGpheC1yZXBsYWNlLXN0YXRlJyksXG4gICAgICAgICAgICAgICAgcGpheFRpbWVvdXQgPSAkZS5kYXRhKCdwamF4LXRpbWVvdXQnKSxcbiAgICAgICAgICAgICAgICBwamF4U2Nyb2xsVG8gPSAkZS5kYXRhKCdwamF4LXNjcm9sbHRvJyksXG4gICAgICAgICAgICAgICAgcGpheFB1c2hSZWRpcmVjdCA9ICRlLmRhdGEoJ3BqYXgtcHVzaC1yZWRpcmVjdCcpLFxuICAgICAgICAgICAgICAgIHBqYXhSZXBsYWNlUmVkaXJlY3QgPSAkZS5kYXRhKCdwamF4LXJlcGxhY2UtcmVkaXJlY3QnKSxcbiAgICAgICAgICAgICAgICBwamF4U2tpcE91dGVyQ29udGFpbmVycyA9ICRlLmRhdGEoJ3BqYXgtc2tpcC1vdXRlci1jb250YWluZXJzJyksXG4gICAgICAgICAgICAgICAgcGpheENvbnRhaW5lcixcbiAgICAgICAgICAgICAgICBwamF4T3B0aW9ucyA9IHt9O1xuXG4gICAgICAgICAgICBpZiAocGpheCAhPT0gdW5kZWZpbmVkICYmICQuc3VwcG9ydC5wamF4KSB7XG4gICAgICAgICAgICAgICAgaWYgKCRlLmRhdGEoJ3BqYXgtY29udGFpbmVyJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcGpheENvbnRhaW5lciA9ICRlLmRhdGEoJ3BqYXgtY29udGFpbmVyJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcGpheENvbnRhaW5lciA9ICRlLmNsb3Nlc3QoJ1tkYXRhLXBqYXgtY29udGFpbmVyPVwiXCJdJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQgdG8gYm9keSBpZiBwamF4IGNvbnRhaW5lciBub3QgZm91bmRcbiAgICAgICAgICAgICAgICBpZiAoIXBqYXhDb250YWluZXIubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHBqYXhDb250YWluZXIgPSAkKCdib2R5Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBqYXhPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBjb250YWluZXI6IHBqYXhDb250YWluZXIsXG4gICAgICAgICAgICAgICAgICAgIHB1c2g6IHBqYXhQdXNoU3RhdGUsXG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2U6IHBqYXhSZXBsYWNlU3RhdGUsXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvOiBwamF4U2Nyb2xsVG8sXG4gICAgICAgICAgICAgICAgICAgIHB1c2hSZWRpcmVjdDogcGpheFB1c2hSZWRpcmVjdCxcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZVJlZGlyZWN0OiBwamF4UmVwbGFjZVJlZGlyZWN0LFxuICAgICAgICAgICAgICAgICAgICBwamF4U2tpcE91dGVyQ29udGFpbmVyczogcGpheFNraXBPdXRlckNvbnRhaW5lcnMsXG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IHBqYXhUaW1lb3V0LFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudCxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxUYXJnZXQ6ICRlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uICYmIGFjdGlvbiAhPSAnIycpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBqYXggIT09IHVuZGVmaW5lZCAmJiAkLnN1cHBvcnQucGpheCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5wamF4LmNsaWNrKGV2ZW50LCBwamF4T3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBhY3Rpb247XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCRlLmlzKCc6c3VibWl0JykgJiYgJGZvcm0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwamF4ICE9PSB1bmRlZmluZWQgJiYgJC5zdXBwb3J0LnBqYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLm9uKCdzdWJtaXQnLGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQucGpheC5zdWJtaXQoZSwgcGpheE9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkZm9ybS50cmlnZ2VyKCdzdWJtaXQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbmV3Rm9ybSA9ICEkZm9ybS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAobmV3Rm9ybSkge1xuICAgICAgICAgICAgICAgIGlmICghYWN0aW9uIHx8ICFhY3Rpb24ubWF0Y2goLyheXFwvfDpcXC9cXC8pLykpIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRmb3JtID0gJCgnPGZvcm0vPicsIHttZXRob2Q6IG1ldGhvZCwgYWN0aW9uOiBhY3Rpb259KTtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gJGUuYXR0cigndGFyZ2V0Jyk7XG4gICAgICAgICAgICAgICAgaWYgKHRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICAkZm9ybS5hdHRyKCd0YXJnZXQnLCB0YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIW1ldGhvZC5tYXRjaCgvKGdldHxwb3N0KS9pKSkge1xuICAgICAgICAgICAgICAgICAgICAkZm9ybS5hcHBlbmQoJCgnPGlucHV0Lz4nLCB7bmFtZTogJ19tZXRob2QnLCB2YWx1ZTogbWV0aG9kLCB0eXBlOiAnaGlkZGVuJ30pKTtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kID0gJ1BPU1QnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIW1ldGhvZC5tYXRjaCgvKGdldHxoZWFkfG9wdGlvbnMpL2kpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjc3JmUGFyYW0gPSBwdWIuZ2V0Q3NyZlBhcmFtKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjc3JmUGFyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLmFwcGVuZCgkKCc8aW5wdXQvPicsIHtuYW1lOiBjc3JmUGFyYW0sIHZhbHVlOiBwdWIuZ2V0Q3NyZlRva2VuKCksIHR5cGU6ICdoaWRkZW4nfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRmb3JtLmhpZGUoKS5hcHBlbmRUbygnYm9keScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYWN0aXZlRm9ybURhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyk7XG4gICAgICAgICAgICBpZiAoYWN0aXZlRm9ybURhdGEpIHtcbiAgICAgICAgICAgICAgICAvLyByZW1lbWJlciB3aG8gdHJpZ2dlcnMgdGhlIGZvcm0gc3VibWlzc2lvbi4gVGhpcyBpcyB1c2VkIGJ5IHlpaS5hY3RpdmVGb3JtLmpzXG4gICAgICAgICAgICAgICAgYWN0aXZlRm9ybURhdGEuc3VibWl0T2JqZWN0ID0gJGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHRlbXBvcmFyaWx5IGFkZCBoaWRkZW4gaW5wdXRzIGFjY29yZGluZyB0byBkYXRhLXBhcmFtc1xuICAgICAgICAgICAgaWYgKHBhcmFtcyAmJiAkLmlzUGxhaW5PYmplY3QocGFyYW1zKSkge1xuICAgICAgICAgICAgICAgICQuZWFjaChwYXJhbXMsIGZ1bmN0aW9uIChpZHgsIG9iaikge1xuICAgICAgICAgICAgICAgICAgICAkZm9ybS5hcHBlbmQoJCgnPGlucHV0Lz4nKS5hdHRyKHtuYW1lOiBpZHgsIHZhbHVlOiBvYmosIHR5cGU6ICdoaWRkZW4nfSkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgb2xkTWV0aG9kID0gJGZvcm0uYXR0cignbWV0aG9kJyk7XG4gICAgICAgICAgICAkZm9ybS5hdHRyKCdtZXRob2QnLCBtZXRob2QpO1xuICAgICAgICAgICAgdmFyIG9sZEFjdGlvbiA9IG51bGw7XG4gICAgICAgICAgICBpZiAoYWN0aW9uICYmIGFjdGlvbiAhPSAnIycpIHtcbiAgICAgICAgICAgICAgICBvbGRBY3Rpb24gPSAkZm9ybS5hdHRyKCdhY3Rpb24nKTtcbiAgICAgICAgICAgICAgICAkZm9ybS5hdHRyKCdhY3Rpb24nLCBhY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBqYXggIT09IHVuZGVmaW5lZCAmJiAkLnN1cHBvcnQucGpheCkge1xuICAgICAgICAgICAgICAgICRmb3JtLm9uKCdzdWJtaXQnLGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgICAgICAkLnBqYXguc3VibWl0KGUsIHBqYXhPcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJGZvcm0udHJpZ2dlcignc3VibWl0Jyk7XG4gICAgICAgICAgICAkLndoZW4oJGZvcm0uZGF0YSgneWlpU3VibWl0RmluYWxpemVQcm9taXNlJykpLnRoZW4oXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2xkQWN0aW9uICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLmF0dHIoJ2FjdGlvbicsIG9sZEFjdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJGZvcm0uYXR0cignbWV0aG9kJywgb2xkTWV0aG9kKTtcblxuICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmUgdGhlIHRlbXBvcmFyaWx5IGFkZGVkIGhpZGRlbiBpbnB1dHNcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtcyAmJiAkLmlzUGxhaW5PYmplY3QocGFyYW1zKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKHBhcmFtcywgZnVuY3Rpb24gKGlkeCwgb2JqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cIicgKyBpZHggKyAnXCJdJywgJGZvcm0pLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAobmV3Rm9ybSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFF1ZXJ5UGFyYW1zOiBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgICAgICB2YXIgcG9zID0gdXJsLmluZGV4T2YoJz8nKTtcbiAgICAgICAgICAgIGlmIChwb3MgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcGFpcnMgPSB1cmwuc3Vic3RyaW5nKHBvcyArIDEpLnNwbGl0KCcjJylbMF0uc3BsaXQoJyYnKSxcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSB7fSxcbiAgICAgICAgICAgICAgICBwYWlyLFxuICAgICAgICAgICAgICAgIGk7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwYWlycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIHBhaXIgPSBwYWlyc1tpXS5zcGxpdCgnPScpO1xuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMF0pO1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGRlY29kZVVSSUNvbXBvbmVudChwYWlyWzFdKTtcbiAgICAgICAgICAgICAgICBpZiAobmFtZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtc1tuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISQuaXNBcnJheShwYXJhbXNbbmFtZV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zW25hbWVdID0gW3BhcmFtc1tuYW1lXV07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXNbbmFtZV0ucHVzaCh2YWx1ZSB8fCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXNbbmFtZV0gPSB2YWx1ZSB8fCAnJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwYXJhbXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdE1vZHVsZTogZnVuY3Rpb24gKG1vZHVsZSkge1xuICAgICAgICAgICAgaWYgKG1vZHVsZS5pc0FjdGl2ZSA9PT0gdW5kZWZpbmVkIHx8IG1vZHVsZS5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgICAgIGlmICgkLmlzRnVuY3Rpb24obW9kdWxlLmluaXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZS5pbml0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQuZWFjaChtb2R1bGUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQuaXNQbGFpbk9iamVjdCh0aGlzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHViLmluaXRNb2R1bGUodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpbml0Q3NyZkhhbmRsZXIoKTtcbiAgICAgICAgICAgIGluaXRSZWRpcmVjdEhhbmRsZXIoKTtcbiAgICAgICAgICAgIGluaXRTY3JpcHRGaWx0ZXIoKTtcbiAgICAgICAgICAgIGluaXREYXRhTWV0aG9kcygpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGluaXRSZWRpcmVjdEhhbmRsZXIoKSB7XG4gICAgICAgIC8vIGhhbmRsZSBBSkFYIHJlZGlyZWN0aW9uXG4gICAgICAgICQoZG9jdW1lbnQpLmFqYXhDb21wbGV0ZShmdW5jdGlvbiAoZXZlbnQsIHhociwgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSB4aHIgJiYgeGhyLmdldFJlc3BvbnNlSGVhZGVyKCdYLVJlZGlyZWN0Jyk7XG4gICAgICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gdXJsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0Q3NyZkhhbmRsZXIoKSB7XG4gICAgICAgIC8vIGF1dG9tYXRpY2FsbHkgc2VuZCBDU1JGIHRva2VuIGZvciBhbGwgQUpBWCByZXF1ZXN0c1xuICAgICAgICAkLmFqYXhQcmVmaWx0ZXIoZnVuY3Rpb24gKG9wdGlvbnMsIG9yaWdpbmFsT3B0aW9ucywgeGhyKSB7XG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuY3Jvc3NEb21haW4gJiYgcHViLmdldENzcmZQYXJhbSgpKSB7XG4gICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtQ1NSRi1Ub2tlbicsIHB1Yi5nZXRDc3JmVG9rZW4oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBwdWIucmVmcmVzaENzcmZUb2tlbigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXREYXRhTWV0aG9kcygpIHtcbiAgICAgICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgbWV0aG9kID0gJHRoaXMuZGF0YSgnbWV0aG9kJyksXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9ICR0aGlzLmRhdGEoJ2NvbmZpcm0nKSxcbiAgICAgICAgICAgICAgICBmb3JtID0gJHRoaXMuZGF0YSgnZm9ybScpO1xuXG4gICAgICAgICAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQgJiYgbWVzc2FnZSA9PT0gdW5kZWZpbmVkICYmIGZvcm0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWVzc2FnZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgJC5wcm94eShwdWIuY29uZmlybSwgdGhpcykobWVzc2FnZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBwdWIuaGFuZGxlQWN0aW9uKCR0aGlzLCBldmVudCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHB1Yi5oYW5kbGVBY3Rpb24oJHRoaXMsIGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGhhbmRsZSBkYXRhLWNvbmZpcm0gYW5kIGRhdGEtbWV0aG9kIGZvciBjbGlja2FibGUgYW5kIGNoYW5nZWFibGUgZWxlbWVudHNcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrLnlpaScsIHB1Yi5jbGlja2FibGVTZWxlY3RvciwgaGFuZGxlcilcbiAgICAgICAgICAgIC5vbignY2hhbmdlLnlpaScsIHB1Yi5jaGFuZ2VhYmxlU2VsZWN0b3IsIGhhbmRsZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXRTY3JpcHRGaWx0ZXIoKSB7XG4gICAgICAgIHZhciBob3N0SW5mbyA9IGxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIGxvY2F0aW9uLmhvc3Q7XG5cbiAgICAgICAgdmFyIGxvYWRlZFNjcmlwdHMgPSAkKCdzY3JpcHRbc3JjXScpLm1hcChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zcmMuY2hhckF0KDApID09PSAnLycgPyBob3N0SW5mbyArIHRoaXMuc3JjIDogdGhpcy5zcmM7XG4gICAgICAgIH0pLnRvQXJyYXkoKTtcblxuICAgICAgICAkLmFqYXhQcmVmaWx0ZXIoJ3NjcmlwdCcsIGZ1bmN0aW9uIChvcHRpb25zLCBvcmlnaW5hbE9wdGlvbnMsIHhocikge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZGF0YVR5cGUgPT0gJ2pzb25wJykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHVybCA9IG9wdGlvbnMudXJsLmNoYXJBdCgwKSA9PT0gJy8nID8gaG9zdEluZm8gKyBvcHRpb25zLnVybCA6IG9wdGlvbnMudXJsO1xuICAgICAgICAgICAgaWYgKCQuaW5BcnJheSh1cmwsIGxvYWRlZFNjcmlwdHMpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGxvYWRlZFNjcmlwdHMucHVzaCh1cmwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgaXNSZWxvYWRhYmxlID0gJC5pbkFycmF5KHVybCwgJC5tYXAocHViLnJlbG9hZGFibGVTY3JpcHRzLCBmdW5jdGlvbiAoc2NyaXB0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2NyaXB0LmNoYXJBdCgwKSA9PT0gJy8nID8gaG9zdEluZm8gKyBzY3JpcHQgOiBzY3JpcHQ7XG4gICAgICAgICAgICAgICAgICAgIH0pKSAhPT0gLTE7XG4gICAgICAgICAgICAgICAgaWYgKCFpc1JlbG9hZGFibGUpIHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLmFib3J0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkKGRvY3VtZW50KS5hamF4Q29tcGxldGUoZnVuY3Rpb24gKGV2ZW50LCB4aHIsIHNldHRpbmdzKSB7XG4gICAgICAgICAgICB2YXIgc3R5bGVTaGVldHMgPSBbXTtcbiAgICAgICAgICAgICQoJ2xpbmtbcmVsPXN0eWxlc2hlZXRdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheSh0aGlzLmhyZWYsIHB1Yi5yZWxvYWRhYmxlU2NyaXB0cykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheSh0aGlzLmhyZWYsIHN0eWxlU2hlZXRzKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBzdHlsZVNoZWV0cy5wdXNoKHRoaXMuaHJlZilcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBwdWI7XG59KShqUXVlcnkpO1xuXG5qUXVlcnkoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICB5aWkuaW5pdE1vZHVsZSh5aWkpO1xufSk7XG5cbiIsIi8qKlxuICogWWlpIHZhbGlkYXRpb24gbW9kdWxlLlxuICpcbiAqIFRoaXMgSmF2YVNjcmlwdCBtb2R1bGUgcHJvdmlkZXMgdGhlIHZhbGlkYXRpb24gbWV0aG9kcyBmb3IgdGhlIGJ1aWx0LWluIHZhbGlkYXRvcnMuXG4gKlxuICogQGxpbmsgaHR0cDovL3d3dy55aWlmcmFtZXdvcmsuY29tL1xuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMDggWWlpIFNvZnR3YXJlIExMQ1xuICogQGxpY2Vuc2UgaHR0cDovL3d3dy55aWlmcmFtZXdvcmsuY29tL2xpY2Vuc2UvXG4gKiBAYXV0aG9yIFFpYW5nIFh1ZSA8cWlhbmcueHVlQGdtYWlsLmNvbT5cbiAqIEBzaW5jZSAyLjBcbiAqL1xuXG55aWkudmFsaWRhdGlvbiA9IChmdW5jdGlvbiAoJCkge1xuICAgIHZhciBwdWIgPSB7XG4gICAgICAgIGlzRW1wdHk6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT0gW10gfHwgdmFsdWUgPT09ICcnO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFkZE1lc3NhZ2U6IGZ1bmN0aW9uIChtZXNzYWdlcywgbWVzc2FnZSwgdmFsdWUpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gobWVzc2FnZS5yZXBsYWNlKC9cXHt2YWx1ZVxcfS9nLCB2YWx1ZSkpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlcXVpcmVkOiBmdW5jdGlvbiAodmFsdWUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnJlcXVpcmVkVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHZhciBpc1N0cmluZyA9IHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCB2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZztcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5zdHJpY3QgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCB8fCAhb3B0aW9ucy5zdHJpY3QgJiYgIXB1Yi5pc0VtcHR5KGlzU3RyaW5nID8gJC50cmltKHZhbHVlKSA6IHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICghb3B0aW9ucy5zdHJpY3QgJiYgdmFsdWUgPT0gb3B0aW9ucy5yZXF1aXJlZFZhbHVlIHx8IG9wdGlvbnMuc3RyaWN0ICYmIHZhbHVlID09PSBvcHRpb25zLnJlcXVpcmVkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICB2YWxpZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdmFsaWQpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgJ2Jvb2xlYW4nOiBmdW5jdGlvbiAodmFsdWUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5za2lwT25FbXB0eSAmJiBwdWIuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdmFsaWQgPSAhb3B0aW9ucy5zdHJpY3QgJiYgKHZhbHVlID09IG9wdGlvbnMudHJ1ZVZhbHVlIHx8IHZhbHVlID09IG9wdGlvbnMuZmFsc2VWYWx1ZSlcbiAgICAgICAgICAgICAgICB8fCBvcHRpb25zLnN0cmljdCAmJiAodmFsdWUgPT09IG9wdGlvbnMudHJ1ZVZhbHVlIHx8IHZhbHVlID09PSBvcHRpb25zLmZhbHNlVmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAoIXZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHN0cmluZzogZnVuY3Rpb24gKHZhbHVlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2tpcE9uRW1wdHkgJiYgcHViLmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1pbiAhPT0gdW5kZWZpbmVkICYmIHZhbHVlLmxlbmd0aCA8IG9wdGlvbnMubWluKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMudG9vU2hvcnQsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1heCAhPT0gdW5kZWZpbmVkICYmIHZhbHVlLmxlbmd0aCA+IG9wdGlvbnMubWF4KSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMudG9vTG9uZywgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuaXMgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZS5sZW5ndGggIT0gb3B0aW9ucy5pcykge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm5vdEVxdWFsLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZmlsZTogZnVuY3Rpb24gKGF0dHJpYnV0ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBmaWxlcyA9IGdldFVwbG9hZGVkRmlsZXMoYXR0cmlidXRlLCBtZXNzYWdlcywgb3B0aW9ucyk7XG4gICAgICAgICAgICAkLmVhY2goZmlsZXMsIGZ1bmN0aW9uIChpLCBmaWxlKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdGVGaWxlKGZpbGUsIG1lc3NhZ2VzLCBvcHRpb25zKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGltYWdlOiBmdW5jdGlvbiAoYXR0cmlidXRlLCBtZXNzYWdlcywgb3B0aW9ucywgZGVmZXJyZWQpIHtcbiAgICAgICAgICAgIHZhciBmaWxlcyA9IGdldFVwbG9hZGVkRmlsZXMoYXR0cmlidXRlLCBtZXNzYWdlcywgb3B0aW9ucyk7XG5cbiAgICAgICAgICAgICQuZWFjaChmaWxlcywgZnVuY3Rpb24gKGksIGZpbGUpIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZUZpbGUoZmlsZSwgbWVzc2FnZXMsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICAgICAgLy8gU2tpcCBpbWFnZSB2YWxpZGF0aW9uIGlmIEZpbGVSZWFkZXIgQVBJIGlzIG5vdCBhdmFpbGFibGVcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIEZpbGVSZWFkZXIgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBkZWYgPSAkLkRlZmVycmVkKCksXG4gICAgICAgICAgICAgICAgICAgIGZyID0gbmV3IEZpbGVSZWFkZXIoKSxcbiAgICAgICAgICAgICAgICAgICAgaW1nID0gbmV3IEltYWdlKCk7XG5cbiAgICAgICAgICAgICAgICBpbWcub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5taW5XaWR0aCAmJiB0aGlzLndpZHRoIDwgb3B0aW9ucy5taW5XaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZXMucHVzaChvcHRpb25zLnVuZGVyV2lkdGgucmVwbGFjZSgvXFx7ZmlsZVxcfS9nLCBmaWxlLm5hbWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLm1heFdpZHRoICYmIHRoaXMud2lkdGggPiBvcHRpb25zLm1heFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMub3ZlcldpZHRoLnJlcGxhY2UoL1xce2ZpbGVcXH0vZywgZmlsZS5uYW1lKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5taW5IZWlnaHQgJiYgdGhpcy5oZWlnaHQgPCBvcHRpb25zLm1pbkhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZXMucHVzaChvcHRpb25zLnVuZGVySGVpZ2h0LnJlcGxhY2UoL1xce2ZpbGVcXH0vZywgZmlsZS5uYW1lKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5tYXhIZWlnaHQgJiYgdGhpcy5oZWlnaHQgPiBvcHRpb25zLm1heEhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZXMucHVzaChvcHRpb25zLm92ZXJIZWlnaHQucmVwbGFjZSgvXFx7ZmlsZVxcfS9nLCBmaWxlLm5hbWUpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBkZWYucmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBpbWcub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZXMucHVzaChvcHRpb25zLm5vdEltYWdlLnJlcGxhY2UoL1xce2ZpbGVcXH0vZywgZmlsZS5uYW1lKSk7XG4gICAgICAgICAgICAgICAgICAgIGRlZi5yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGZyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaW1nLnNyYyA9IGZyLnJlc3VsdDtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLy8gUmVzb2x2ZSBkZWZlcnJlZCBpZiB0aGVyZSB3YXMgZXJyb3Igd2hpbGUgcmVhZGluZyBkYXRhXG4gICAgICAgICAgICAgICAgZnIub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVmLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgZnIucmVhZEFzRGF0YVVSTChmaWxlKTtcblxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnB1c2goZGVmKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0sXG5cbiAgICAgICAgbnVtYmVyOiBmdW5jdGlvbiAodmFsdWUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5za2lwT25FbXB0eSAmJiBwdWIuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmICF2YWx1ZS5tYXRjaChvcHRpb25zLnBhdHRlcm4pKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubWluICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgPCBvcHRpb25zLm1pbikge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLnRvb1NtYWxsLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5tYXggIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSA+IG9wdGlvbnMubWF4KSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMudG9vQmlnLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmFuZ2U6IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNraXBPbkVtcHR5ICYmIHB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFvcHRpb25zLmFsbG93QXJyYXkgJiYgJC5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpbkFycmF5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgJC5lYWNoKCQuaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZSA6IFt2YWx1ZV0sIGZ1bmN0aW9uIChpLCB2KSB7XG4gICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheSh2LCBvcHRpb25zLnJhbmdlKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBpbkFycmF5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubm90ID09PSBpbkFycmF5KSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHJlZ3VsYXJFeHByZXNzaW9uOiBmdW5jdGlvbiAodmFsdWUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5za2lwT25FbXB0eSAmJiBwdWIuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5ub3QgJiYgIXZhbHVlLm1hdGNoKG9wdGlvbnMucGF0dGVybikgfHwgb3B0aW9ucy5ub3QgJiYgdmFsdWUubWF0Y2gob3B0aW9ucy5wYXR0ZXJuKSkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBlbWFpbDogZnVuY3Rpb24gKHZhbHVlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2tpcE9uRW1wdHkgJiYgcHViLmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdmFsaWQgPSB0cnVlO1xuXG5cbiAgICAgICAgICAgIHZhciByZWdleHAgPSAvXigoPzpcIj8oW15cIl0qKVwiP1xccyk/KSg/OlxccyspPyg/Oig8PykoKC4rKUAoW14+XSspKSg+PykpJC8sXG4gICAgICAgICAgICAgICAgbWF0Y2hlcyA9IHJlZ2V4cC5leGVjKHZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKG1hdGNoZXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB2YWxpZCA9IGZhbHNlXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmVuYWJsZUlETikge1xuICAgICAgICAgICAgICAgICAgICBtYXRjaGVzWzVdID0gcHVueWNvZGUudG9BU0NJSShtYXRjaGVzWzVdKTtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlc1s2XSA9IHB1bnljb2RlLnRvQVNDSUkobWF0Y2hlc1s2XSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBtYXRjaGVzWzFdICsgbWF0Y2hlc1szXSArIG1hdGNoZXNbNV0gKyAnQCcgKyBtYXRjaGVzWzZdICsgbWF0Y2hlc1s3XTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hlc1s1XS5sZW5ndGggPiA2NCkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoKG1hdGNoZXNbNV0gKyAnQCcgKyBtYXRjaGVzWzZdKS5sZW5ndGggPiAyNTQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHZhbHVlLm1hdGNoKG9wdGlvbnMucGF0dGVybikgfHwgKG9wdGlvbnMuYWxsb3dOYW1lICYmIHZhbHVlLm1hdGNoKG9wdGlvbnMuZnVsbFBhdHRlcm4pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdmFsaWQpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdXJsOiBmdW5jdGlvbiAodmFsdWUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5za2lwT25FbXB0eSAmJiBwdWIuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmRlZmF1bHRTY2hlbWUgJiYgIXZhbHVlLm1hdGNoKC86XFwvXFwvLykpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG9wdGlvbnMuZGVmYXVsdFNjaGVtZSArICc6Ly8nICsgdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB2YWxpZCA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmVuYWJsZUlETikge1xuICAgICAgICAgICAgICAgIHZhciByZWdleHAgPSAvXihbXjpdKyk6XFwvXFwvKFteXFwvXSspKC4qKSQvLFxuICAgICAgICAgICAgICAgICAgICBtYXRjaGVzID0gcmVnZXhwLmV4ZWModmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaGVzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBtYXRjaGVzWzFdICsgJzovLycgKyBwdW55Y29kZS50b0FTQ0lJKG1hdGNoZXNbMl0pICsgbWF0Y2hlc1szXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdmFsaWQgfHwgIXZhbHVlLm1hdGNoKG9wdGlvbnMucGF0dGVybikpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdHJpbTogZnVuY3Rpb24gKCRmb3JtLCBhdHRyaWJ1dGUsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciAkaW5wdXQgPSAkZm9ybS5maW5kKGF0dHJpYnV0ZS5pbnB1dCk7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSAkaW5wdXQudmFsKCk7XG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuc2tpcE9uRW1wdHkgfHwgIXB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gJC50cmltKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAkaW5wdXQudmFsKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBjYXB0Y2hhOiBmdW5jdGlvbiAodmFsdWUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5za2lwT25FbXB0eSAmJiBwdWIuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENBUFRDSEEgbWF5IGJlIHVwZGF0ZWQgdmlhIEFKQVggYW5kIHRoZSB1cGRhdGVkIGhhc2ggaXMgc3RvcmVkIGluIGJvZHkgZGF0YVxuICAgICAgICAgICAgdmFyIGhhc2ggPSAkKCdib2R5JykuZGF0YShvcHRpb25zLmhhc2hLZXkpO1xuICAgICAgICAgICAgaWYgKGhhc2ggPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGhhc2ggPSBvcHRpb25zLmhhc2g7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGhhc2ggPSBoYXNoW29wdGlvbnMuY2FzZVNlbnNpdGl2ZSA/IDAgOiAxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB2ID0gb3B0aW9ucy5jYXNlU2Vuc2l0aXZlID8gdmFsdWUgOiB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IHYubGVuZ3RoIC0gMSwgaCA9IDA7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICAgICAgaCArPSB2LmNoYXJDb2RlQXQoaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaCAhPSBoYXNoKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGNvbXBhcmU6IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNraXBPbkVtcHR5ICYmIHB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGNvbXBhcmVWYWx1ZSwgdmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuY29tcGFyZUF0dHJpYnV0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29tcGFyZVZhbHVlID0gb3B0aW9ucy5jb21wYXJlVmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbXBhcmVWYWx1ZSA9ICQoJyMnICsgb3B0aW9ucy5jb21wYXJlQXR0cmlidXRlKS52YWwoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMudHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgICAgICAgICAgICAgIGNvbXBhcmVWYWx1ZSA9IHBhcnNlRmxvYXQoY29tcGFyZVZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAob3B0aW9ucy5vcGVyYXRvcikge1xuICAgICAgICAgICAgICAgIGNhc2UgJz09JzpcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB2YWx1ZSA9PSBjb21wYXJlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJz09PSc6XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdmFsdWUgPT09IGNvbXBhcmVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnIT0nOlxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHZhbHVlICE9IGNvbXBhcmVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnIT09JzpcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB2YWx1ZSAhPT0gY29tcGFyZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICc+JzpcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB2YWx1ZSA+IGNvbXBhcmVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnPj0nOlxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHZhbHVlID49IGNvbXBhcmVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnPCc6XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdmFsdWUgPCBjb21wYXJlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJzw9JzpcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB2YWx1ZSA8PSBjb21wYXJlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGlwOiBmdW5jdGlvbiAodmFsdWUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgZ2V0SXBWZXJzaW9uID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmluZGV4T2YoJzonKSA9PT0gLTEgPyA0IDogNjtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciBuZWdhdGlvbiA9IG51bGwsIGNpZHIgPSBudWxsO1xuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5za2lwT25FbXB0eSAmJiBwdWIuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBtYXRjaGVzID0gbmV3IFJlZ0V4cChvcHRpb25zLmlwUGFyc2VQYXR0ZXJuKS5leGVjKHZhbHVlKTtcbiAgICAgICAgICAgIGlmIChtYXRjaGVzKSB7XG4gICAgICAgICAgICAgICAgbmVnYXRpb24gPSBtYXRjaGVzWzFdIHx8IG51bGw7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBtYXRjaGVzWzJdO1xuICAgICAgICAgICAgICAgIGNpZHIgPSBtYXRjaGVzWzRdIHx8IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLnN1Ym5ldCA9PT0gdHJ1ZSAmJiBjaWRyID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZXMubm9TdWJuZXQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5zdWJuZXQgPT09IGZhbHNlICYmIGNpZHIgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlcy5oYXNTdWJuZXQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5uZWdhdGlvbiA9PT0gZmFsc2UgJiYgbmVnYXRpb24gIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlcy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZ2V0SXBWZXJzaW9uKHZhbHVlKSA9PSA2KSB7XG4gICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLmlwdjYpIHtcbiAgICAgICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZXMuaXB2Nk5vdEFsbG93ZWQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCEobmV3IFJlZ0V4cChvcHRpb25zLmlwdjZQYXR0ZXJuKSkudGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZXMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLmlwdjQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZXMuaXB2NE5vdEFsbG93ZWQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCEobmV3IFJlZ0V4cChvcHRpb25zLmlwdjRQYXR0ZXJuKSkudGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZXMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRVcGxvYWRlZEZpbGVzKGF0dHJpYnV0ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgLy8gU2tpcCB2YWxpZGF0aW9uIGlmIEZpbGUgQVBJIGlzIG5vdCBhdmFpbGFibGVcbiAgICAgICAgaWYgKHR5cGVvZiBGaWxlID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmlsZXMgPSAkKGF0dHJpYnV0ZS5pbnB1dCkuZ2V0KDApLmZpbGVzO1xuICAgICAgICBpZiAoIWZpbGVzKSB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMubWVzc2FnZSk7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZmlsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuc2tpcE9uRW1wdHkpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMudXBsb2FkUmVxdWlyZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubWF4RmlsZXMgJiYgb3B0aW9ucy5tYXhGaWxlcyA8IGZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgbWVzc2FnZXMucHVzaChvcHRpb25zLnRvb01hbnkpO1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbGVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlRmlsZShmaWxlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICBpZiAob3B0aW9ucy5leHRlbnNpb25zICYmIG9wdGlvbnMuZXh0ZW5zaW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXgsIGV4dDtcblxuICAgICAgICAgICAgaW5kZXggPSBmaWxlLm5hbWUubGFzdEluZGV4T2YoJy4nKTtcblxuICAgICAgICAgICAgaWYgKCF+aW5kZXgpIHtcbiAgICAgICAgICAgICAgICBleHQgPSAnJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZXh0ID0gZmlsZS5uYW1lLnN1YnN0cihpbmRleCArIDEsIGZpbGUubmFtZS5sZW5ndGgpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghfm9wdGlvbnMuZXh0ZW5zaW9ucy5pbmRleE9mKGV4dCkpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMud3JvbmdFeHRlbnNpb24ucmVwbGFjZSgvXFx7ZmlsZVxcfS9nLCBmaWxlLm5hbWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLm1pbWVUeXBlcyAmJiBvcHRpb25zLm1pbWVUeXBlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoIXZhbGlkYXRlTWltZVR5cGUob3B0aW9ucy5taW1lVHlwZXMsIGZpbGUudHlwZSkpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMud3JvbmdNaW1lVHlwZS5yZXBsYWNlKC9cXHtmaWxlXFx9L2csIGZpbGUubmFtZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubWF4U2l6ZSAmJiBvcHRpb25zLm1heFNpemUgPCBmaWxlLnNpemUpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy50b29CaWcucmVwbGFjZSgvXFx7ZmlsZVxcfS9nLCBmaWxlLm5hbWUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLm1pblNpemUgJiYgb3B0aW9ucy5taW5TaXplID4gZmlsZS5zaXplKSB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMudG9vU21hbGwucmVwbGFjZSgvXFx7ZmlsZVxcfS9nLCBmaWxlLm5hbWUpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlTWltZVR5cGUobWltZVR5cGVzLCBmaWxlVHlwZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbWltZVR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAobmV3IFJlZ0V4cChtaW1lVHlwZXNbaV0pLnRlc3QoZmlsZVR5cGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHB1Yjtcbn0pKGpRdWVyeSk7XG4iLCIvKipcbiAqIFlpaSBmb3JtIHdpZGdldC5cbiAqXG4gKiBUaGlzIGlzIHRoZSBKYXZhU2NyaXB0IHdpZGdldCB1c2VkIGJ5IHRoZSB5aWlcXHdpZGdldHNcXEFjdGl2ZUZvcm0gd2lkZ2V0LlxuICpcbiAqIEBsaW5rIGh0dHA6Ly93d3cueWlpZnJhbWV3b3JrLmNvbS9cbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDA4IFlpaSBTb2Z0d2FyZSBMTENcbiAqIEBsaWNlbnNlIGh0dHA6Ly93d3cueWlpZnJhbWV3b3JrLmNvbS9saWNlbnNlL1xuICogQGF1dGhvciBRaWFuZyBYdWUgPHFpYW5nLnh1ZUBnbWFpbC5jb20+XG4gKiBAc2luY2UgMi4wXG4gKi9cbihmdW5jdGlvbiAoJCkge1xuXG4gICAgJC5mbi55aWlBY3RpdmVGb3JtID0gZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgICAgICBpZiAobWV0aG9kc1ttZXRob2RdKSB7XG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kc1ttZXRob2RdLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdvYmplY3QnIHx8ICFtZXRob2QpIHtcbiAgICAgICAgICAgIHJldHVybiBtZXRob2RzLmluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQuZXJyb3IoJ01ldGhvZCAnICsgbWV0aG9kICsgJyBkb2VzIG5vdCBleGlzdCBvbiBqUXVlcnkueWlpQWN0aXZlRm9ybScpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBldmVudHMgPSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBiZWZvcmVWYWxpZGF0ZSBldmVudCBpcyB0cmlnZ2VyZWQgYmVmb3JlIHZhbGlkYXRpbmcgdGhlIHdob2xlIGZvcm0uXG4gICAgICAgICAqIFRoZSBzaWduYXR1cmUgb2YgdGhlIGV2ZW50IGhhbmRsZXIgc2hvdWxkIGJlOlxuICAgICAgICAgKiAgICAgZnVuY3Rpb24gKGV2ZW50LCBtZXNzYWdlcywgZGVmZXJyZWRzKVxuICAgICAgICAgKiB3aGVyZVxuICAgICAgICAgKiAgLSBldmVudDogYW4gRXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiAgLSBtZXNzYWdlczogYW4gYXNzb2NpYXRpdmUgYXJyYXkgd2l0aCBrZXlzIGJlaW5nIGF0dHJpYnV0ZSBJRHMgYW5kIHZhbHVlcyBiZWluZyBlcnJvciBtZXNzYWdlIGFycmF5c1xuICAgICAgICAgKiAgICBmb3IgdGhlIGNvcnJlc3BvbmRpbmcgYXR0cmlidXRlcy5cbiAgICAgICAgICogIC0gZGVmZXJyZWRzOiBhbiBhcnJheSBvZiBEZWZlcnJlZCBvYmplY3RzLiBZb3UgY2FuIHVzZSBkZWZlcnJlZHMuYWRkKGNhbGxiYWNrKSB0byBhZGQgYSBuZXcgZGVmZXJyZWQgdmFsaWRhdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogSWYgdGhlIGhhbmRsZXIgcmV0dXJucyBhIGJvb2xlYW4gZmFsc2UsIGl0IHdpbGwgc3RvcCBmdXJ0aGVyIGZvcm0gdmFsaWRhdGlvbiBhZnRlciB0aGlzIGV2ZW50LiBBbmQgYXNcbiAgICAgICAgICogYSByZXN1bHQsIGFmdGVyVmFsaWRhdGUgZXZlbnQgd2lsbCBub3QgYmUgdHJpZ2dlcmVkLlxuICAgICAgICAgKi9cbiAgICAgICAgYmVmb3JlVmFsaWRhdGU6ICdiZWZvcmVWYWxpZGF0ZScsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBhZnRlclZhbGlkYXRlIGV2ZW50IGlzIHRyaWdnZXJlZCBhZnRlciB2YWxpZGF0aW5nIHRoZSB3aG9sZSBmb3JtLlxuICAgICAgICAgKiBUaGUgc2lnbmF0dXJlIG9mIHRoZSBldmVudCBoYW5kbGVyIHNob3VsZCBiZTpcbiAgICAgICAgICogICAgIGZ1bmN0aW9uIChldmVudCwgbWVzc2FnZXMsIGVycm9yQXR0cmlidXRlcylcbiAgICAgICAgICogd2hlcmVcbiAgICAgICAgICogIC0gZXZlbnQ6IGFuIEV2ZW50IG9iamVjdC5cbiAgICAgICAgICogIC0gbWVzc2FnZXM6IGFuIGFzc29jaWF0aXZlIGFycmF5IHdpdGgga2V5cyBiZWluZyBhdHRyaWJ1dGUgSURzIGFuZCB2YWx1ZXMgYmVpbmcgZXJyb3IgbWVzc2FnZSBhcnJheXNcbiAgICAgICAgICogICAgZm9yIHRoZSBjb3JyZXNwb25kaW5nIGF0dHJpYnV0ZXMuXG4gICAgICAgICAqICAtIGVycm9yQXR0cmlidXRlczogYW4gYXJyYXkgb2YgYXR0cmlidXRlcyB0aGF0IGhhdmUgdmFsaWRhdGlvbiBlcnJvcnMuIFBsZWFzZSByZWZlciB0byBhdHRyaWJ1dGVEZWZhdWx0cyBmb3IgdGhlIHN0cnVjdHVyZSBvZiB0aGlzIHBhcmFtZXRlci5cbiAgICAgICAgICovXG4gICAgICAgIGFmdGVyVmFsaWRhdGU6ICdhZnRlclZhbGlkYXRlJyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGJlZm9yZVZhbGlkYXRlQXR0cmlidXRlIGV2ZW50IGlzIHRyaWdnZXJlZCBiZWZvcmUgdmFsaWRhdGluZyBhbiBhdHRyaWJ1dGUuXG4gICAgICAgICAqIFRoZSBzaWduYXR1cmUgb2YgdGhlIGV2ZW50IGhhbmRsZXIgc2hvdWxkIGJlOlxuICAgICAgICAgKiAgICAgZnVuY3Rpb24gKGV2ZW50LCBhdHRyaWJ1dGUsIG1lc3NhZ2VzLCBkZWZlcnJlZHMpXG4gICAgICAgICAqIHdoZXJlXG4gICAgICAgICAqICAtIGV2ZW50OiBhbiBFdmVudCBvYmplY3QuXG4gICAgICAgICAqICAtIGF0dHJpYnV0ZTogdGhlIGF0dHJpYnV0ZSB0byBiZSB2YWxpZGF0ZWQuIFBsZWFzZSByZWZlciB0byBhdHRyaWJ1dGVEZWZhdWx0cyBmb3IgdGhlIHN0cnVjdHVyZSBvZiB0aGlzIHBhcmFtZXRlci5cbiAgICAgICAgICogIC0gbWVzc2FnZXM6IGFuIGFycmF5IHRvIHdoaWNoIHlvdSBjYW4gYWRkIHZhbGlkYXRpb24gZXJyb3IgbWVzc2FnZXMgZm9yIHRoZSBzcGVjaWZpZWQgYXR0cmlidXRlLlxuICAgICAgICAgKiAgLSBkZWZlcnJlZHM6IGFuIGFycmF5IG9mIERlZmVycmVkIG9iamVjdHMuIFlvdSBjYW4gdXNlIGRlZmVycmVkcy5hZGQoY2FsbGJhY2spIHRvIGFkZCBhIG5ldyBkZWZlcnJlZCB2YWxpZGF0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJZiB0aGUgaGFuZGxlciByZXR1cm5zIGEgYm9vbGVhbiBmYWxzZSwgaXQgd2lsbCBzdG9wIGZ1cnRoZXIgdmFsaWRhdGlvbiBvZiB0aGUgc3BlY2lmaWVkIGF0dHJpYnV0ZS5cbiAgICAgICAgICogQW5kIGFzIGEgcmVzdWx0LCBhZnRlclZhbGlkYXRlQXR0cmlidXRlIGV2ZW50IHdpbGwgbm90IGJlIHRyaWdnZXJlZC5cbiAgICAgICAgICovXG4gICAgICAgIGJlZm9yZVZhbGlkYXRlQXR0cmlidXRlOiAnYmVmb3JlVmFsaWRhdGVBdHRyaWJ1dGUnLFxuICAgICAgICAvKipcbiAgICAgICAgICogYWZ0ZXJWYWxpZGF0ZUF0dHJpYnV0ZSBldmVudCBpcyB0cmlnZ2VyZWQgYWZ0ZXIgdmFsaWRhdGluZyB0aGUgd2hvbGUgZm9ybSBhbmQgZWFjaCBhdHRyaWJ1dGUuXG4gICAgICAgICAqIFRoZSBzaWduYXR1cmUgb2YgdGhlIGV2ZW50IGhhbmRsZXIgc2hvdWxkIGJlOlxuICAgICAgICAgKiAgICAgZnVuY3Rpb24gKGV2ZW50LCBhdHRyaWJ1dGUsIG1lc3NhZ2VzKVxuICAgICAgICAgKiB3aGVyZVxuICAgICAgICAgKiAgLSBldmVudDogYW4gRXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiAgLSBhdHRyaWJ1dGU6IHRoZSBhdHRyaWJ1dGUgYmVpbmcgdmFsaWRhdGVkLiBQbGVhc2UgcmVmZXIgdG8gYXR0cmlidXRlRGVmYXVsdHMgZm9yIHRoZSBzdHJ1Y3R1cmUgb2YgdGhpcyBwYXJhbWV0ZXIuXG4gICAgICAgICAqICAtIG1lc3NhZ2VzOiBhbiBhcnJheSB0byB3aGljaCB5b3UgY2FuIGFkZCBhZGRpdGlvbmFsIHZhbGlkYXRpb24gZXJyb3IgbWVzc2FnZXMgZm9yIHRoZSBzcGVjaWZpZWQgYXR0cmlidXRlLlxuICAgICAgICAgKi9cbiAgICAgICAgYWZ0ZXJWYWxpZGF0ZUF0dHJpYnV0ZTogJ2FmdGVyVmFsaWRhdGVBdHRyaWJ1dGUnLFxuICAgICAgICAvKipcbiAgICAgICAgICogYmVmb3JlU3VibWl0IGV2ZW50IGlzIHRyaWdnZXJlZCBiZWZvcmUgc3VibWl0dGluZyB0aGUgZm9ybSBhZnRlciBhbGwgdmFsaWRhdGlvbnMgaGF2ZSBwYXNzZWQuXG4gICAgICAgICAqIFRoZSBzaWduYXR1cmUgb2YgdGhlIGV2ZW50IGhhbmRsZXIgc2hvdWxkIGJlOlxuICAgICAgICAgKiAgICAgZnVuY3Rpb24gKGV2ZW50KVxuICAgICAgICAgKiB3aGVyZSBldmVudCBpcyBhbiBFdmVudCBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIElmIHRoZSBoYW5kbGVyIHJldHVybnMgYSBib29sZWFuIGZhbHNlLCBpdCB3aWxsIHN0b3AgZm9ybSBzdWJtaXNzaW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgYmVmb3JlU3VibWl0OiAnYmVmb3JlU3VibWl0JyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGFqYXhCZWZvcmVTZW5kIGV2ZW50IGlzIHRyaWdnZXJlZCBiZWZvcmUgc2VuZGluZyBhbiBBSkFYIHJlcXVlc3QgZm9yIEFKQVgtYmFzZWQgdmFsaWRhdGlvbi5cbiAgICAgICAgICogVGhlIHNpZ25hdHVyZSBvZiB0aGUgZXZlbnQgaGFuZGxlciBzaG91bGQgYmU6XG4gICAgICAgICAqICAgICBmdW5jdGlvbiAoZXZlbnQsIGpxWEhSLCBzZXR0aW5ncylcbiAgICAgICAgICogd2hlcmVcbiAgICAgICAgICogIC0gZXZlbnQ6IGFuIEV2ZW50IG9iamVjdC5cbiAgICAgICAgICogIC0ganFYSFI6IGEganFYSFIgb2JqZWN0XG4gICAgICAgICAqICAtIHNldHRpbmdzOiB0aGUgc2V0dGluZ3MgZm9yIHRoZSBBSkFYIHJlcXVlc3RcbiAgICAgICAgICovXG4gICAgICAgIGFqYXhCZWZvcmVTZW5kOiAnYWpheEJlZm9yZVNlbmQnLFxuICAgICAgICAvKipcbiAgICAgICAgICogYWpheENvbXBsZXRlIGV2ZW50IGlzIHRyaWdnZXJlZCBhZnRlciBjb21wbGV0aW5nIGFuIEFKQVggcmVxdWVzdCBmb3IgQUpBWC1iYXNlZCB2YWxpZGF0aW9uLlxuICAgICAgICAgKiBUaGUgc2lnbmF0dXJlIG9mIHRoZSBldmVudCBoYW5kbGVyIHNob3VsZCBiZTpcbiAgICAgICAgICogICAgIGZ1bmN0aW9uIChldmVudCwganFYSFIsIHRleHRTdGF0dXMpXG4gICAgICAgICAqIHdoZXJlXG4gICAgICAgICAqICAtIGV2ZW50OiBhbiBFdmVudCBvYmplY3QuXG4gICAgICAgICAqICAtIGpxWEhSOiBhIGpxWEhSIG9iamVjdFxuICAgICAgICAgKiAgLSB0ZXh0U3RhdHVzOiB0aGUgc3RhdHVzIG9mIHRoZSByZXF1ZXN0IChcInN1Y2Nlc3NcIiwgXCJub3Rtb2RpZmllZFwiLCBcImVycm9yXCIsIFwidGltZW91dFwiLCBcImFib3J0XCIsIG9yIFwicGFyc2VyZXJyb3JcIikuXG4gICAgICAgICAqL1xuICAgICAgICBhamF4Q29tcGxldGU6ICdhamF4Q29tcGxldGUnXG4gICAgfTtcblxuICAgIC8vIE5PVEU6IElmIHlvdSBjaGFuZ2UgYW55IG9mIHRoZXNlIGRlZmF1bHRzLCBtYWtlIHN1cmUgeW91IHVwZGF0ZSB5aWlcXHdpZGdldHNcXEFjdGl2ZUZvcm06OmdldENsaWVudE9wdGlvbnMoKSBhcyB3ZWxsXG4gICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICAvLyB3aGV0aGVyIHRvIGVuY29kZSB0aGUgZXJyb3Igc3VtbWFyeVxuICAgICAgICBlbmNvZGVFcnJvclN1bW1hcnk6IHRydWUsXG4gICAgICAgIC8vIHRoZSBqUXVlcnkgc2VsZWN0b3IgZm9yIHRoZSBlcnJvciBzdW1tYXJ5XG4gICAgICAgIGVycm9yU3VtbWFyeTogJy5lcnJvci1zdW1tYXJ5JyxcbiAgICAgICAgLy8gd2hldGhlciB0byBwZXJmb3JtIHZhbGlkYXRpb24gYmVmb3JlIHN1Ym1pdHRpbmcgdGhlIGZvcm0uXG4gICAgICAgIHZhbGlkYXRlT25TdWJtaXQ6IHRydWUsXG4gICAgICAgIC8vIHRoZSBjb250YWluZXIgQ1NTIGNsYXNzIHJlcHJlc2VudGluZyB0aGUgY29ycmVzcG9uZGluZyBhdHRyaWJ1dGUgaGFzIHZhbGlkYXRpb24gZXJyb3JcbiAgICAgICAgZXJyb3JDc3NDbGFzczogJ2hhcy1lcnJvcicsXG4gICAgICAgIC8vIHRoZSBjb250YWluZXIgQ1NTIGNsYXNzIHJlcHJlc2VudGluZyB0aGUgY29ycmVzcG9uZGluZyBhdHRyaWJ1dGUgcGFzc2VzIHZhbGlkYXRpb25cbiAgICAgICAgc3VjY2Vzc0Nzc0NsYXNzOiAnaGFzLXN1Y2Nlc3MnLFxuICAgICAgICAvLyB0aGUgY29udGFpbmVyIENTUyBjbGFzcyByZXByZXNlbnRpbmcgdGhlIGNvcnJlc3BvbmRpbmcgYXR0cmlidXRlIGlzIGJlaW5nIHZhbGlkYXRlZFxuICAgICAgICB2YWxpZGF0aW5nQ3NzQ2xhc3M6ICd2YWxpZGF0aW5nJyxcbiAgICAgICAgLy8gdGhlIEdFVCBwYXJhbWV0ZXIgbmFtZSBpbmRpY2F0aW5nIGFuIEFKQVgtYmFzZWQgdmFsaWRhdGlvblxuICAgICAgICBhamF4UGFyYW06ICdhamF4JyxcbiAgICAgICAgLy8gdGhlIHR5cGUgb2YgZGF0YSB0aGF0IHlvdSdyZSBleHBlY3RpbmcgYmFjayBmcm9tIHRoZSBzZXJ2ZXJcbiAgICAgICAgYWpheERhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIC8vIHRoZSBVUkwgZm9yIHBlcmZvcm1pbmcgQUpBWC1iYXNlZCB2YWxpZGF0aW9uLiBJZiBub3Qgc2V0LCBpdCB3aWxsIHVzZSB0aGUgdGhlIGZvcm0ncyBhY3Rpb25cbiAgICAgICAgdmFsaWRhdGlvblVybDogdW5kZWZpbmVkLFxuICAgICAgICAvLyB3aGV0aGVyIHRvIHNjcm9sbCB0byBmaXJzdCB2aXNpYmxlIGVycm9yIGFmdGVyIHZhbGlkYXRpb24uXG4gICAgICAgIHNjcm9sbFRvRXJyb3I6IHRydWVcbiAgICB9O1xuXG4gICAgLy8gTk9URTogSWYgeW91IGNoYW5nZSBhbnkgb2YgdGhlc2UgZGVmYXVsdHMsIG1ha2Ugc3VyZSB5b3UgdXBkYXRlIHlpaVxcd2lkZ2V0c1xcQWN0aXZlRmllbGQ6OmdldENsaWVudE9wdGlvbnMoKSBhcyB3ZWxsXG4gICAgdmFyIGF0dHJpYnV0ZURlZmF1bHRzID0ge1xuICAgICAgICAvLyBhIHVuaXF1ZSBJRCBpZGVudGlmeWluZyBhbiBhdHRyaWJ1dGUgKGUuZy4gXCJsb2dpbmZvcm0tdXNlcm5hbWVcIikgaW4gYSBmb3JtXG4gICAgICAgIGlkOiB1bmRlZmluZWQsXG4gICAgICAgIC8vIGF0dHJpYnV0ZSBuYW1lIG9yIGV4cHJlc3Npb24gKGUuZy4gXCJbMF1jb250ZW50XCIgZm9yIHRhYnVsYXIgaW5wdXQpXG4gICAgICAgIG5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgLy8gdGhlIGpRdWVyeSBzZWxlY3RvciBvZiB0aGUgY29udGFpbmVyIG9mIHRoZSBpbnB1dCBmaWVsZFxuICAgICAgICBjb250YWluZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgLy8gdGhlIGpRdWVyeSBzZWxlY3RvciBvZiB0aGUgaW5wdXQgZmllbGQgdW5kZXIgdGhlIGNvbnRleHQgb2YgdGhlIGZvcm1cbiAgICAgICAgaW5wdXQ6IHVuZGVmaW5lZCxcbiAgICAgICAgLy8gdGhlIGpRdWVyeSBzZWxlY3RvciBvZiB0aGUgZXJyb3IgdGFnIHVuZGVyIHRoZSBjb250ZXh0IG9mIHRoZSBjb250YWluZXJcbiAgICAgICAgZXJyb3I6ICcuaGVscC1ibG9jaycsXG4gICAgICAgIC8vIHdoZXRoZXIgdG8gZW5jb2RlIHRoZSBlcnJvclxuICAgICAgICBlbmNvZGVFcnJvcjogdHJ1ZSxcbiAgICAgICAgLy8gd2hldGhlciB0byBwZXJmb3JtIHZhbGlkYXRpb24gd2hlbiBhIGNoYW5nZSBpcyBkZXRlY3RlZCBvbiB0aGUgaW5wdXRcbiAgICAgICAgdmFsaWRhdGVPbkNoYW5nZTogdHJ1ZSxcbiAgICAgICAgLy8gd2hldGhlciB0byBwZXJmb3JtIHZhbGlkYXRpb24gd2hlbiB0aGUgaW5wdXQgbG9zZXMgZm9jdXNcbiAgICAgICAgdmFsaWRhdGVPbkJsdXI6IHRydWUsXG4gICAgICAgIC8vIHdoZXRoZXIgdG8gcGVyZm9ybSB2YWxpZGF0aW9uIHdoZW4gdGhlIHVzZXIgaXMgdHlwaW5nLlxuICAgICAgICB2YWxpZGF0ZU9uVHlwZTogZmFsc2UsXG4gICAgICAgIC8vIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCB0aGUgdmFsaWRhdGlvbiBzaG91bGQgYmUgZGVsYXllZCB3aGVuIGEgdXNlciBpcyB0eXBpbmcgaW4gdGhlIGlucHV0IGZpZWxkLlxuICAgICAgICB2YWxpZGF0aW9uRGVsYXk6IDUwMCxcbiAgICAgICAgLy8gd2hldGhlciB0byBlbmFibGUgQUpBWC1iYXNlZCB2YWxpZGF0aW9uLlxuICAgICAgICBlbmFibGVBamF4VmFsaWRhdGlvbjogZmFsc2UsXG4gICAgICAgIC8vIGZ1bmN0aW9uIChhdHRyaWJ1dGUsIHZhbHVlLCBtZXNzYWdlcywgZGVmZXJyZWQsICRmb3JtKSwgdGhlIGNsaWVudC1zaWRlIHZhbGlkYXRpb24gZnVuY3Rpb24uXG4gICAgICAgIHZhbGlkYXRlOiB1bmRlZmluZWQsXG4gICAgICAgIC8vIHN0YXR1cyBvZiB0aGUgaW5wdXQgZmllbGQsIDA6IGVtcHR5LCBub3QgZW50ZXJlZCBiZWZvcmUsIDE6IHZhbGlkYXRlZCwgMjogcGVuZGluZyB2YWxpZGF0aW9uLCAzOiB2YWxpZGF0aW5nXG4gICAgICAgIHN0YXR1czogMCxcbiAgICAgICAgLy8gd2hldGhlciB0aGUgdmFsaWRhdGlvbiBpcyBjYW5jZWxsZWQgYnkgYmVmb3JlVmFsaWRhdGVBdHRyaWJ1dGUgZXZlbnQgaGFuZGxlclxuICAgICAgICBjYW5jZWxsZWQ6IGZhbHNlLFxuICAgICAgICAvLyB0aGUgdmFsdWUgb2YgdGhlIGlucHV0XG4gICAgICAgIHZhbHVlOiB1bmRlZmluZWRcbiAgICB9O1xuXG5cbiAgICB2YXIgc3VibWl0RGVmZXI7XG5cbiAgICB2YXIgc2V0U3VibWl0RmluYWxpemVEZWZlciA9IGZ1bmN0aW9uKCRmb3JtKSB7XG4gICAgICAgIHN1Ym1pdERlZmVyID0gJC5EZWZlcnJlZCgpO1xuICAgICAgICAkZm9ybS5kYXRhKCd5aWlTdWJtaXRGaW5hbGl6ZVByb21pc2UnLCBzdWJtaXREZWZlci5wcm9taXNlKCkpO1xuICAgIH07XG5cbiAgICAvLyBmaW5hbGl6ZSB5aWkuanMgJGZvcm0uc3VibWl0XG4gICAgdmFyIHN1Ym1pdEZpbmFsaXplID0gZnVuY3Rpb24oJGZvcm0pIHtcbiAgICAgICAgaWYoc3VibWl0RGVmZXIpIHtcbiAgICAgICAgICAgIHN1Ym1pdERlZmVyLnJlc29sdmUoKTtcbiAgICAgICAgICAgIHN1Ym1pdERlZmVyID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgJGZvcm0ucmVtb3ZlRGF0YSgneWlpU3VibWl0RmluYWxpemVQcm9taXNlJyk7XG4gICAgICAgIH1cbiAgICB9O1xuXG5cbiAgICB2YXIgbWV0aG9kcyA9IHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKGF0dHJpYnV0ZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciAkZm9ybSA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgaWYgKCRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHNldHRpbmdzID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zIHx8IHt9KTtcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MudmFsaWRhdGlvblVybCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLnZhbGlkYXRpb25VcmwgPSAkZm9ybS5hdHRyKCdhY3Rpb24nKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkLmVhY2goYXR0cmlidXRlcywgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlc1tpXSA9ICQuZXh0ZW5kKHt2YWx1ZTogZ2V0VmFsdWUoJGZvcm0sIHRoaXMpfSwgYXR0cmlidXRlRGVmYXVsdHMsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB3YXRjaEF0dHJpYnV0ZSgkZm9ybSwgYXR0cmlidXRlc1tpXSk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJywge1xuICAgICAgICAgICAgICAgICAgICBzZXR0aW5nczogc2V0dGluZ3MsXG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IGF0dHJpYnV0ZXMsXG4gICAgICAgICAgICAgICAgICAgIHN1Ym1pdHRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6ICRmb3JtLmF0dHIoJ3RhcmdldCcpXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBDbGVhbiB1cCBlcnJvciBzdGF0dXMgd2hlbiB0aGUgZm9ybSBpcyByZXNldC5cbiAgICAgICAgICAgICAgICAgKiBOb3RlIHRoYXQgJGZvcm0ub24oJ3Jlc2V0JywgLi4uKSBkb2VzIHdvcmsgYmVjYXVzZSB0aGUgXCJyZXNldFwiIGV2ZW50IGRvZXMgbm90IGJ1YmJsZSBvbiBJRS5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAkZm9ybS5iaW5kKCdyZXNldC55aWlBY3RpdmVGb3JtJywgbWV0aG9kcy5yZXNldEZvcm0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLnZhbGlkYXRlT25TdWJtaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0ub24oJ21vdXNldXAueWlpQWN0aXZlRm9ybSBrZXl1cC55aWlBY3RpdmVGb3JtJywgJzpzdWJtaXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJykuc3VibWl0T2JqZWN0ID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICRmb3JtLm9uKCdzdWJtaXQueWlpQWN0aXZlRm9ybScsIG1ldGhvZHMuc3VibWl0Rm9ybSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gYWRkIGEgbmV3IGF0dHJpYnV0ZSB0byB0aGUgZm9ybSBkeW5hbWljYWxseS5cbiAgICAgICAgLy8gcGxlYXNlIHJlZmVyIHRvIGF0dHJpYnV0ZURlZmF1bHRzIGZvciB0aGUgc3RydWN0dXJlIG9mIGF0dHJpYnV0ZVxuICAgICAgICBhZGQ6IGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICQodGhpcyk7XG4gICAgICAgICAgICBhdHRyaWJ1dGUgPSAkLmV4dGVuZCh7dmFsdWU6IGdldFZhbHVlKCRmb3JtLCBhdHRyaWJ1dGUpfSwgYXR0cmlidXRlRGVmYXVsdHMsIGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJykuYXR0cmlidXRlcy5wdXNoKGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICB3YXRjaEF0dHJpYnV0ZSgkZm9ybSwgYXR0cmlidXRlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyByZW1vdmUgdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBzcGVjaWZpZWQgSUQgZnJvbSB0aGUgZm9ybVxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgdmFyICRmb3JtID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzID0gJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScpLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAkLmVhY2goYXR0cmlidXRlcywgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlc1tpXVsnaWQnXSA9PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIHVud2F0Y2hBdHRyaWJ1dGUoJGZvcm0sIGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXR0cmlidXRlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIG1hbnVhbGx5IHRyaWdnZXIgdGhlIHZhbGlkYXRpb24gb2YgdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBzcGVjaWZpZWQgSURcbiAgICAgICAgdmFsaWRhdGVBdHRyaWJ1dGU6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZSA9IG1ldGhvZHMuZmluZC5jYWxsKHRoaXMsIGlkKTtcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdGVBdHRyaWJ1dGUoJCh0aGlzKSwgYXR0cmlidXRlLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyBmaW5kIGFuIGF0dHJpYnV0ZSBjb25maWcgYmFzZWQgb24gdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGUgSURcbiAgICAgICAgZmluZDogZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9ICQodGhpcykuZGF0YSgneWlpQWN0aXZlRm9ybScpLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgJC5lYWNoKGF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXNbaV1bJ2lkJ10gPT0gaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnVuYmluZCgnLnlpaUFjdGl2ZUZvcm0nKTtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZURhdGEoJ3lpaUFjdGl2ZUZvcm0nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyB2YWxpZGF0ZSBhbGwgYXBwbGljYWJsZSBpbnB1dHMgaW4gdGhlIGZvcm1cbiAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgZGF0YSA9ICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKSxcbiAgICAgICAgICAgICAgICBuZWVkQWpheFZhbGlkYXRpb24gPSBmYWxzZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlcyA9IHt9LFxuICAgICAgICAgICAgICAgIGRlZmVycmVkcyA9IGRlZmVycmVkQXJyYXkoKSxcbiAgICAgICAgICAgICAgICBzdWJtaXR0aW5nID0gZGF0YS5zdWJtaXR0aW5nO1xuXG4gICAgICAgICAgICBpZiAoc3VibWl0dGluZykge1xuICAgICAgICAgICAgICAgIHZhciBldmVudCA9ICQuRXZlbnQoZXZlbnRzLmJlZm9yZVZhbGlkYXRlKTtcbiAgICAgICAgICAgICAgICAkZm9ybS50cmlnZ2VyKGV2ZW50LCBbbWVzc2FnZXMsIGRlZmVycmVkc10pO1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5yZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuc3VibWl0dGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzdWJtaXRGaW5hbGl6ZSgkZm9ybSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNsaWVudC1zaWRlIHZhbGlkYXRpb25cbiAgICAgICAgICAgICQuZWFjaChkYXRhLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoISQodGhpcy5pbnB1dCkuaXMoXCI6ZGlzYWJsZWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW5jZWxsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gcGVyZm9ybSB2YWxpZGF0aW9uIG9ubHkgaWYgdGhlIGZvcm0gaXMgYmVpbmcgc3VibWl0dGVkIG9yIGlmIGFuIGF0dHJpYnV0ZSBpcyBwZW5kaW5nIHZhbGlkYXRpb25cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VibWl0dGluZyB8fCB0aGlzLnN0YXR1cyA9PT0gMiB8fCB0aGlzLnN0YXR1cyA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1zZyA9IG1lc3NhZ2VzW3RoaXMuaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1zZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNnID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZXNbdGhpcy5pZF0gPSBtc2c7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXZlbnQgPSAkLkV2ZW50KGV2ZW50cy5iZWZvcmVWYWxpZGF0ZUF0dHJpYnV0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS50cmlnZ2VyKGV2ZW50LCBbdGhpcywgbXNnLCBkZWZlcnJlZHNdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5yZXN1bHQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsaWRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZSh0aGlzLCBnZXRWYWx1ZSgkZm9ybSwgdGhpcyksIG1zZywgZGVmZXJyZWRzLCAkZm9ybSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmVuYWJsZUFqYXhWYWxpZGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5lZWRBamF4VmFsaWRhdGlvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbmNlbGxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gYWpheCB2YWxpZGF0aW9uXG4gICAgICAgICAgICAkLndoZW4uYXBwbHkodGhpcywgZGVmZXJyZWRzKS5hbHdheXMoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGVtcHR5IG1lc3NhZ2UgYXJyYXlzXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBtZXNzYWdlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoMCA9PT0gbWVzc2FnZXNbaV0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgbWVzc2FnZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCQuaXNFbXB0eU9iamVjdChtZXNzYWdlcykgJiYgbmVlZEFqYXhWYWxpZGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkYnV0dG9uID0gZGF0YS5zdWJtaXRPYmplY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICBleHREYXRhID0gJyYnICsgZGF0YS5zZXR0aW5ncy5hamF4UGFyYW0gKyAnPScgKyAkZm9ybS5hdHRyKCdpZCcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoJGJ1dHRvbiAmJiAkYnV0dG9uLmxlbmd0aCAmJiAkYnV0dG9uLmF0dHIoJ25hbWUnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXh0RGF0YSArPSAnJicgKyAkYnV0dG9uLmF0dHIoJ25hbWUnKSArICc9JyArICRidXR0b24uYXR0cigndmFsdWUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBkYXRhLnNldHRpbmdzLnZhbGlkYXRpb25VcmwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAkZm9ybS5hdHRyKCdtZXRob2QnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6ICRmb3JtLnNlcmlhbGl6ZSgpICsgZXh0RGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBkYXRhLnNldHRpbmdzLmFqYXhEYXRhVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoanFYSFIsIHRleHRTdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS50cmlnZ2VyKGV2ZW50cy5hamF4Q29tcGxldGUsIFtqcVhIUiwgdGV4dFN0YXR1c10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uIChqcVhIUiwgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS50cmlnZ2VyKGV2ZW50cy5hamF4QmVmb3JlU2VuZCwgW2pxWEhSLCBzZXR0aW5nc10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChtc2dzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1zZ3MgIT09IG51bGwgJiYgdHlwZW9mIG1zZ3MgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChkYXRhLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5lbmFibGVBamF4VmFsaWRhdGlvbiB8fCB0aGlzLmNhbmNlbGxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBtc2dzW3RoaXMuaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlSW5wdXRzKCRmb3JtLCAkLmV4dGVuZChtZXNzYWdlcywgbXNncyksIHN1Ym1pdHRpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZUlucHV0cygkZm9ybSwgbWVzc2FnZXMsIHN1Ym1pdHRpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuc3VibWl0dGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Ym1pdEZpbmFsaXplKCRmb3JtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLnN1Ym1pdHRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZGVsYXkgY2FsbGJhY2sgc28gdGhhdCB0aGUgZm9ybSBjYW4gYmUgc3VibWl0dGVkIHdpdGhvdXQgcHJvYmxlbVxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZUlucHV0cygkZm9ybSwgbWVzc2FnZXMsIHN1Ym1pdHRpbmcpO1xuICAgICAgICAgICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUlucHV0cygkZm9ybSwgbWVzc2FnZXMsIHN1Ym1pdHRpbmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIHN1Ym1pdEZvcm06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgZGF0YSA9ICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKTtcblxuICAgICAgICAgICAgaWYgKGRhdGEudmFsaWRhdGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gU2Vjb25kIHN1Ym1pdCdzIGNhbGwgKGZyb20gdmFsaWRhdGUvdXBkYXRlSW5wdXRzKVxuICAgICAgICAgICAgICAgIGRhdGEuc3VibWl0dGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciBldmVudCA9ICQuRXZlbnQoZXZlbnRzLmJlZm9yZVN1Ym1pdCk7XG4gICAgICAgICAgICAgICAgJGZvcm0udHJpZ2dlcihldmVudCk7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS52YWxpZGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc3VibWl0RmluYWxpemUoJGZvcm0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHVwZGF0ZUhpZGRlbkJ1dHRvbigkZm9ybSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7ICAgLy8gY29udGludWUgc3VibWl0dGluZyB0aGUgZm9ybSBzaW5jZSB2YWxpZGF0aW9uIHBhc3Nlc1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBGaXJzdCBzdWJtaXQncyBjYWxsIChmcm9tIHlpaS5qcy9oYW5kbGVBY3Rpb24pIC0gZXhlY3V0ZSB2YWxpZGF0aW5nXG4gICAgICAgICAgICAgICAgc2V0U3VibWl0RmluYWxpemVEZWZlcigkZm9ybSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5zZXR0aW5ncy50aW1lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChkYXRhLnNldHRpbmdzLnRpbWVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGF0YS5zdWJtaXR0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBtZXRob2RzLnZhbGlkYXRlLmNhbGwoJGZvcm0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICByZXNldEZvcm06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICQodGhpcyk7XG4gICAgICAgICAgICB2YXIgZGF0YSA9ICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKTtcbiAgICAgICAgICAgIC8vIEJlY2F1c2Ugd2UgYmluZCBkaXJlY3RseSB0byBhIGZvcm0gcmVzZXQgZXZlbnQgaW5zdGVhZCBvZiBhIHJlc2V0IGJ1dHRvbiAodGhhdCBtYXkgbm90IGV4aXN0KSxcbiAgICAgICAgICAgIC8vIHdoZW4gdGhpcyBmdW5jdGlvbiBpcyBleGVjdXRlZCBmb3JtIGlucHV0IHZhbHVlcyBoYXZlIG5vdCBiZWVuIHJlc2V0IHlldC5cbiAgICAgICAgICAgIC8vIFRoZXJlZm9yZSB3ZSBkbyB0aGUgYWN0dWFsIHJlc2V0IHdvcmsgdGhyb3VnaCBzZXRUaW1lb3V0LlxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJC5lYWNoKGRhdGEuYXR0cmlidXRlcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXaXRob3V0IHNldFRpbWVvdXQoKSB3ZSB3b3VsZCBnZXQgdGhlIGlucHV0IHZhbHVlcyB0aGF0IGFyZSBub3QgcmVzZXQgeWV0LlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gZ2V0VmFsdWUoJGZvcm0sIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXR1cyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkY29udGFpbmVyID0gJGZvcm0uZmluZCh0aGlzLmNvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgICAgICRjb250YWluZXIucmVtb3ZlQ2xhc3MoXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnNldHRpbmdzLnZhbGlkYXRpbmdDc3NDbGFzcyArICcgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5zZXR0aW5ncy5lcnJvckNzc0NsYXNzICsgJyAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnNldHRpbmdzLnN1Y2Nlc3NDc3NDbGFzc1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAkY29udGFpbmVyLmZpbmQodGhpcy5lcnJvcikuaHRtbCgnJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJGZvcm0uZmluZChkYXRhLnNldHRpbmdzLmVycm9yU3VtbWFyeSkuaGlkZSgpLmZpbmQoJ3VsJykuaHRtbCgnJyk7XG4gICAgICAgICAgICB9LCAxKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlcyBlcnJvciBtZXNzYWdlcywgaW5wdXQgY29udGFpbmVycywgYW5kIG9wdGlvbmFsbHkgc3VtbWFyeSBhcyB3ZWxsLlxuICAgICAgICAgKiBJZiBhbiBhdHRyaWJ1dGUgaXMgbWlzc2luZyBmcm9tIG1lc3NhZ2VzLCBpdCBpcyBjb25zaWRlcmVkIHZhbGlkLlxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZXMgYXJyYXkgdGhlIHZhbGlkYXRpb24gZXJyb3IgbWVzc2FnZXMsIGluZGV4ZWQgYnkgYXR0cmlidXRlIElEc1xuICAgICAgICAgKiBAcGFyYW0gc3VtbWFyeSB3aGV0aGVyIHRvIHVwZGF0ZSBzdW1tYXJ5IGFzIHdlbGwuXG4gICAgICAgICAqL1xuICAgICAgICB1cGRhdGVNZXNzYWdlczogZnVuY3Rpb24gKG1lc3NhZ2VzLCBzdW1tYXJ5KSB7XG4gICAgICAgICAgICB2YXIgJGZvcm0gPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyIGRhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyk7XG4gICAgICAgICAgICAkLmVhY2goZGF0YS5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlSW5wdXQoJGZvcm0sIHRoaXMsIG1lc3NhZ2VzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHN1bW1hcnkpIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVTdW1tYXJ5KCRmb3JtLCBtZXNzYWdlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwZGF0ZXMgZXJyb3IgbWVzc2FnZXMgYW5kIGlucHV0IGNvbnRhaW5lciBvZiBhIHNpbmdsZSBhdHRyaWJ1dGUuXG4gICAgICAgICAqIElmIG1lc3NhZ2VzIGlzIGVtcHR5LCB0aGUgYXR0cmlidXRlIGlzIGNvbnNpZGVyZWQgdmFsaWQuXG4gICAgICAgICAqIEBwYXJhbSBpZCBhdHRyaWJ1dGUgSURcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VzIGFycmF5IHdpdGggZXJyb3IgbWVzc2FnZXNcbiAgICAgICAgICovXG4gICAgICAgIHVwZGF0ZUF0dHJpYnV0ZTogZnVuY3Rpb24oaWQsIG1lc3NhZ2VzKSB7XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlID0gbWV0aG9kcy5maW5kLmNhbGwodGhpcywgaWQpO1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbXNnID0ge307XG4gICAgICAgICAgICAgICAgbXNnW2lkXSA9IG1lc3NhZ2VzO1xuICAgICAgICAgICAgICAgIHVwZGF0ZUlucHV0KCQodGhpcyksIGF0dHJpYnV0ZSwgbXNnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIHZhciB3YXRjaEF0dHJpYnV0ZSA9IGZ1bmN0aW9uICgkZm9ybSwgYXR0cmlidXRlKSB7XG4gICAgICAgIHZhciAkaW5wdXQgPSBmaW5kSW5wdXQoJGZvcm0sIGF0dHJpYnV0ZSk7XG4gICAgICAgIGlmIChhdHRyaWJ1dGUudmFsaWRhdGVPbkNoYW5nZSkge1xuICAgICAgICAgICAgJGlucHV0Lm9uKCdjaGFuZ2UueWlpQWN0aXZlRm9ybScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZUF0dHJpYnV0ZSgkZm9ybSwgYXR0cmlidXRlLCBmYWxzZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cmlidXRlLnZhbGlkYXRlT25CbHVyKSB7XG4gICAgICAgICAgICAkaW5wdXQub24oJ2JsdXIueWlpQWN0aXZlRm9ybScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlLnN0YXR1cyA9PSAwIHx8IGF0dHJpYnV0ZS5zdGF0dXMgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZUF0dHJpYnV0ZSgkZm9ybSwgYXR0cmlidXRlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cmlidXRlLnZhbGlkYXRlT25UeXBlKSB7XG4gICAgICAgICAgICAkaW5wdXQub24oJ2tleXVwLnlpaUFjdGl2ZUZvcm0nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmICgkLmluQXJyYXkoZS53aGljaCwgWzE2LCAxNywgMTgsIDM3LCAzOCwgMzksIDQwXSkgIT09IC0xICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUudmFsdWUgIT09IGdldFZhbHVlKCRmb3JtLCBhdHRyaWJ1dGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlQXR0cmlidXRlKCRmb3JtLCBhdHRyaWJ1dGUsIGZhbHNlLCBhdHRyaWJ1dGUudmFsaWRhdGlvbkRlbGF5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgdW53YXRjaEF0dHJpYnV0ZSA9IGZ1bmN0aW9uICgkZm9ybSwgYXR0cmlidXRlKSB7XG4gICAgICAgIGZpbmRJbnB1dCgkZm9ybSwgYXR0cmlidXRlKS5vZmYoJy55aWlBY3RpdmVGb3JtJyk7XG4gICAgfTtcblxuICAgIHZhciB2YWxpZGF0ZUF0dHJpYnV0ZSA9IGZ1bmN0aW9uICgkZm9ybSwgYXR0cmlidXRlLCBmb3JjZVZhbGlkYXRlLCB2YWxpZGF0aW9uRGVsYXkpIHtcbiAgICAgICAgdmFyIGRhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyk7XG5cbiAgICAgICAgaWYgKGZvcmNlVmFsaWRhdGUpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZS5zdGF0dXMgPSAyO1xuICAgICAgICB9XG4gICAgICAgICQuZWFjaChkYXRhLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlICE9PSBnZXRWYWx1ZSgkZm9ybSwgdGhpcykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXR1cyA9IDI7XG4gICAgICAgICAgICAgICAgZm9yY2VWYWxpZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIWZvcmNlVmFsaWRhdGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkYXRhLnNldHRpbmdzLnRpbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChkYXRhLnNldHRpbmdzLnRpbWVyKTtcbiAgICAgICAgfVxuICAgICAgICBkYXRhLnNldHRpbmdzLnRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoZGF0YS5zdWJtaXR0aW5nIHx8ICRmb3JtLmlzKCc6aGlkZGVuJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkLmVhY2goZGF0YS5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gMztcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0uZmluZCh0aGlzLmNvbnRhaW5lcikuYWRkQ2xhc3MoZGF0YS5zZXR0aW5ncy52YWxpZGF0aW5nQ3NzQ2xhc3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbWV0aG9kcy52YWxpZGF0ZS5jYWxsKCRmb3JtKTtcbiAgICAgICAgfSwgdmFsaWRhdGlvbkRlbGF5ID8gdmFsaWRhdGlvbkRlbGF5IDogMjAwKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBwcm90b3R5cGUgd2l0aCBhIHNob3J0Y3V0IG1ldGhvZCBmb3IgYWRkaW5nIGEgbmV3IGRlZmVycmVkLlxuICAgICAqIFRoZSBjb250ZXh0IG9mIHRoZSBjYWxsYmFjayB3aWxsIGJlIHRoZSBkZWZlcnJlZCBvYmplY3Qgc28gaXQgY2FuIGJlIHJlc29sdmVkIGxpa2UgYGBgdGhpcy5yZXNvbHZlKClgYGBcbiAgICAgKiBAcmV0dXJucyBBcnJheVxuICAgICAqL1xuICAgIHZhciBkZWZlcnJlZEFycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICAgICAgYXJyYXkuYWRkID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMucHVzaChuZXcgJC5EZWZlcnJlZChjYWxsYmFjaykpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIGVycm9yIG1lc3NhZ2VzIGFuZCB0aGUgaW5wdXQgY29udGFpbmVycyBmb3IgYWxsIGFwcGxpY2FibGUgYXR0cmlidXRlc1xuICAgICAqIEBwYXJhbSAkZm9ybSB0aGUgZm9ybSBqUXVlcnkgb2JqZWN0XG4gICAgICogQHBhcmFtIG1lc3NhZ2VzIGFycmF5IHRoZSB2YWxpZGF0aW9uIGVycm9yIG1lc3NhZ2VzXG4gICAgICogQHBhcmFtIHN1Ym1pdHRpbmcgd2hldGhlciB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgYWZ0ZXIgdmFsaWRhdGlvbiB0cmlnZ2VyZWQgYnkgZm9ybSBzdWJtaXNzaW9uXG4gICAgICovXG4gICAgdmFyIHVwZGF0ZUlucHV0cyA9IGZ1bmN0aW9uICgkZm9ybSwgbWVzc2FnZXMsIHN1Ym1pdHRpbmcpIHtcbiAgICAgICAgdmFyIGRhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyk7XG5cbiAgICAgICAgaWYgKHN1Ym1pdHRpbmcpIHtcbiAgICAgICAgICAgIHZhciBlcnJvckF0dHJpYnV0ZXMgPSBbXTtcbiAgICAgICAgICAgICQuZWFjaChkYXRhLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoISQodGhpcy5pbnB1dCkuaXMoXCI6ZGlzYWJsZWRcIikgJiYgIXRoaXMuY2FuY2VsbGVkICYmIHVwZGF0ZUlucHV0KCRmb3JtLCB0aGlzLCBtZXNzYWdlcykpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JBdHRyaWJ1dGVzLnB1c2godGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRmb3JtLnRyaWdnZXIoZXZlbnRzLmFmdGVyVmFsaWRhdGUsIFttZXNzYWdlcywgZXJyb3JBdHRyaWJ1dGVzXSk7XG5cbiAgICAgICAgICAgIHVwZGF0ZVN1bW1hcnkoJGZvcm0sIG1lc3NhZ2VzKTtcblxuICAgICAgICAgICAgaWYgKGVycm9yQXR0cmlidXRlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5zZXR0aW5ncy5zY3JvbGxUb0Vycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0b3AgPSAkZm9ybS5maW5kKCQubWFwKGVycm9yQXR0cmlidXRlcywgZnVuY3Rpb24oYXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXR0cmlidXRlLmlucHV0O1xuICAgICAgICAgICAgICAgICAgICB9KS5qb2luKCcsJykpLmZpcnN0KCkuY2xvc2VzdCgnOnZpc2libGUnKS5vZmZzZXQoKS50b3A7XG4gICAgICAgICAgICAgICAgICAgIHZhciB3dG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9wIDwgd3RvcCB8fCB0b3AgPiB3dG9wICsgJCh3aW5kb3cpLmhlaWdodCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKHRvcCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGF0YS5zdWJtaXR0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRhdGEudmFsaWRhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB2YXIgYnV0dG9uVGFyZ2V0ID0gZGF0YS5zdWJtaXRPYmplY3QgPyBkYXRhLnN1Ym1pdE9iamVjdC5hdHRyKCdmb3JtdGFyZ2V0JykgOiBudWxsO1xuICAgICAgICAgICAgICAgIGlmIChidXR0b25UYXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0IHRhcmdldCBhdHRyaWJ1dGUgdG8gZm9ybSB0YWcgYmVmb3JlIHN1Ym1pdFxuICAgICAgICAgICAgICAgICAgICAkZm9ybS5hdHRyKCd0YXJnZXQnLCBidXR0b25UYXJnZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkZm9ybS5zdWJtaXQoKTtcbiAgICAgICAgICAgICAgICAvLyByZXN0b3JlIG9yaWdpbmFsIHRhcmdldCBhdHRyaWJ1dGUgdmFsdWVcbiAgICAgICAgICAgICAgICAkZm9ybS5hdHRyKCd0YXJnZXQnLCBkYXRhLnRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkLmVhY2goZGF0YS5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNhbmNlbGxlZCAmJiAodGhpcy5zdGF0dXMgPT09IDIgfHwgdGhpcy5zdGF0dXMgPT09IDMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUlucHV0KCRmb3JtLCB0aGlzLCBtZXNzYWdlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc3VibWl0RmluYWxpemUoJGZvcm0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIGhpZGRlbiBmaWVsZCB0aGF0IHJlcHJlc2VudHMgY2xpY2tlZCBzdWJtaXQgYnV0dG9uLlxuICAgICAqIEBwYXJhbSAkZm9ybSB0aGUgZm9ybSBqUXVlcnkgb2JqZWN0LlxuICAgICAqL1xuICAgIHZhciB1cGRhdGVIaWRkZW5CdXR0b24gPSBmdW5jdGlvbiAoJGZvcm0pIHtcbiAgICAgICAgdmFyIGRhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyk7XG4gICAgICAgIHZhciAkYnV0dG9uID0gZGF0YS5zdWJtaXRPYmplY3QgfHwgJGZvcm0uZmluZCgnOnN1Ym1pdDpmaXJzdCcpO1xuICAgICAgICAvLyBUT0RPOiBpZiB0aGUgc3VibWlzc2lvbiBpcyBjYXVzZWQgYnkgXCJjaGFuZ2VcIiBldmVudCwgaXQgd2lsbCBub3Qgd29ya1xuICAgICAgICBpZiAoJGJ1dHRvbi5sZW5ndGggJiYgJGJ1dHRvbi5hdHRyKCd0eXBlJykgPT0gJ3N1Ym1pdCcgJiYgJGJ1dHRvbi5hdHRyKCduYW1lJykpIHtcbiAgICAgICAgICAgIC8vIHNpbXVsYXRlIGJ1dHRvbiBpbnB1dCB2YWx1ZVxuICAgICAgICAgICAgdmFyICRoaWRkZW5CdXR0b24gPSAkKCdpbnB1dFt0eXBlPVwiaGlkZGVuXCJdW25hbWU9XCInICsgJGJ1dHRvbi5hdHRyKCduYW1lJykgKyAnXCJdJywgJGZvcm0pO1xuICAgICAgICAgICAgaWYgKCEkaGlkZGVuQnV0dG9uLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICQoJzxpbnB1dD4nKS5hdHRyKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2hpZGRlbicsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICRidXR0b24uYXR0cignbmFtZScpLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJGJ1dHRvbi5hdHRyKCd2YWx1ZScpXG4gICAgICAgICAgICAgICAgfSkuYXBwZW5kVG8oJGZvcm0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkaGlkZGVuQnV0dG9uLmF0dHIoJ3ZhbHVlJywgJGJ1dHRvbi5hdHRyKCd2YWx1ZScpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBlcnJvciBtZXNzYWdlIGFuZCB0aGUgaW5wdXQgY29udGFpbmVyIGZvciBhIHBhcnRpY3VsYXIgYXR0cmlidXRlLlxuICAgICAqIEBwYXJhbSAkZm9ybSB0aGUgZm9ybSBqUXVlcnkgb2JqZWN0XG4gICAgICogQHBhcmFtIGF0dHJpYnV0ZSBvYmplY3QgdGhlIGNvbmZpZ3VyYXRpb24gZm9yIGEgcGFydGljdWxhciBhdHRyaWJ1dGUuXG4gICAgICogQHBhcmFtIG1lc3NhZ2VzIGFycmF5IHRoZSB2YWxpZGF0aW9uIGVycm9yIG1lc3NhZ2VzXG4gICAgICogQHJldHVybiBib29sZWFuIHdoZXRoZXIgdGhlcmUgaXMgYSB2YWxpZGF0aW9uIGVycm9yIGZvciB0aGUgc3BlY2lmaWVkIGF0dHJpYnV0ZVxuICAgICAqL1xuICAgIHZhciB1cGRhdGVJbnB1dCA9IGZ1bmN0aW9uICgkZm9ybSwgYXR0cmlidXRlLCBtZXNzYWdlcykge1xuICAgICAgICB2YXIgZGF0YSA9ICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKSxcbiAgICAgICAgICAgICRpbnB1dCA9IGZpbmRJbnB1dCgkZm9ybSwgYXR0cmlidXRlKSxcbiAgICAgICAgICAgIGhhc0Vycm9yID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKCEkLmlzQXJyYXkobWVzc2FnZXNbYXR0cmlidXRlLmlkXSkpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzW2F0dHJpYnV0ZS5pZF0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICAkZm9ybS50cmlnZ2VyKGV2ZW50cy5hZnRlclZhbGlkYXRlQXR0cmlidXRlLCBbYXR0cmlidXRlLCBtZXNzYWdlc1thdHRyaWJ1dGUuaWRdXSk7XG5cbiAgICAgICAgYXR0cmlidXRlLnN0YXR1cyA9IDE7XG4gICAgICAgIGlmICgkaW5wdXQubGVuZ3RoKSB7XG4gICAgICAgICAgICBoYXNFcnJvciA9IG1lc3NhZ2VzW2F0dHJpYnV0ZS5pZF0ubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIHZhciAkY29udGFpbmVyID0gJGZvcm0uZmluZChhdHRyaWJ1dGUuY29udGFpbmVyKTtcbiAgICAgICAgICAgIHZhciAkZXJyb3IgPSAkY29udGFpbmVyLmZpbmQoYXR0cmlidXRlLmVycm9yKTtcbiAgICAgICAgICAgIGlmIChoYXNFcnJvcikge1xuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUuZW5jb2RlRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgJGVycm9yLnRleHQobWVzc2FnZXNbYXR0cmlidXRlLmlkXVswXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJGVycm9yLmh0bWwobWVzc2FnZXNbYXR0cmlidXRlLmlkXVswXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRjb250YWluZXIucmVtb3ZlQ2xhc3MoZGF0YS5zZXR0aW5ncy52YWxpZGF0aW5nQ3NzQ2xhc3MgKyAnICcgKyBkYXRhLnNldHRpbmdzLnN1Y2Nlc3NDc3NDbGFzcylcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKGRhdGEuc2V0dGluZ3MuZXJyb3JDc3NDbGFzcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRlcnJvci5lbXB0eSgpO1xuICAgICAgICAgICAgICAgICRjb250YWluZXIucmVtb3ZlQ2xhc3MoZGF0YS5zZXR0aW5ncy52YWxpZGF0aW5nQ3NzQ2xhc3MgKyAnICcgKyBkYXRhLnNldHRpbmdzLmVycm9yQ3NzQ2xhc3MgKyAnICcpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhkYXRhLnNldHRpbmdzLnN1Y2Nlc3NDc3NDbGFzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhdHRyaWJ1dGUudmFsdWUgPSBnZXRWYWx1ZSgkZm9ybSwgYXR0cmlidXRlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFzRXJyb3I7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIGVycm9yIHN1bW1hcnkuXG4gICAgICogQHBhcmFtICRmb3JtIHRoZSBmb3JtIGpRdWVyeSBvYmplY3RcbiAgICAgKiBAcGFyYW0gbWVzc2FnZXMgYXJyYXkgdGhlIHZhbGlkYXRpb24gZXJyb3IgbWVzc2FnZXNcbiAgICAgKi9cbiAgICB2YXIgdXBkYXRlU3VtbWFyeSA9IGZ1bmN0aW9uICgkZm9ybSwgbWVzc2FnZXMpIHtcbiAgICAgICAgdmFyIGRhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyksXG4gICAgICAgICAgICAkc3VtbWFyeSA9ICRmb3JtLmZpbmQoZGF0YS5zZXR0aW5ncy5lcnJvclN1bW1hcnkpLFxuICAgICAgICAgICAgJHVsID0gJHN1bW1hcnkuZmluZCgndWwnKS5lbXB0eSgpO1xuXG4gICAgICAgIGlmICgkc3VtbWFyeS5sZW5ndGggJiYgbWVzc2FnZXMpIHtcbiAgICAgICAgICAgICQuZWFjaChkYXRhLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJC5pc0FycmF5KG1lc3NhZ2VzW3RoaXMuaWRdKSAmJiBtZXNzYWdlc1t0aGlzLmlkXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0gJCgnPGxpLz4nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc2V0dGluZ3MuZW5jb2RlRXJyb3JTdW1tYXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvci50ZXh0KG1lc3NhZ2VzW3RoaXMuaWRdWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yLmh0bWwobWVzc2FnZXNbdGhpcy5pZF1bMF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICR1bC5hcHBlbmQoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHN1bW1hcnkudG9nZ2xlKCR1bC5maW5kKCdsaScpLmxlbmd0aCA+IDApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBnZXRWYWx1ZSA9IGZ1bmN0aW9uICgkZm9ybSwgYXR0cmlidXRlKSB7XG4gICAgICAgIHZhciAkaW5wdXQgPSBmaW5kSW5wdXQoJGZvcm0sIGF0dHJpYnV0ZSk7XG4gICAgICAgIHZhciB0eXBlID0gJGlucHV0LmF0dHIoJ3R5cGUnKTtcbiAgICAgICAgaWYgKHR5cGUgPT09ICdjaGVja2JveCcgfHwgdHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgICAgICAgdmFyICRyZWFsSW5wdXQgPSAkaW5wdXQuZmlsdGVyKCc6Y2hlY2tlZCcpO1xuICAgICAgICAgICAgaWYgKCEkcmVhbElucHV0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRyZWFsSW5wdXQgPSAkZm9ybS5maW5kKCdpbnB1dFt0eXBlPWhpZGRlbl1bbmFtZT1cIicgKyAkaW5wdXQuYXR0cignbmFtZScpICsgJ1wiXScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICRyZWFsSW5wdXQudmFsKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJGlucHV0LnZhbCgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBmaW5kSW5wdXQgPSBmdW5jdGlvbiAoJGZvcm0sIGF0dHJpYnV0ZSkge1xuICAgICAgICB2YXIgJGlucHV0ID0gJGZvcm0uZmluZChhdHRyaWJ1dGUuaW5wdXQpO1xuICAgICAgICBpZiAoJGlucHV0Lmxlbmd0aCAmJiAkaW5wdXRbMF0udGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnZGl2Jykge1xuICAgICAgICAgICAgLy8gY2hlY2tib3ggbGlzdCBvciByYWRpbyBsaXN0XG4gICAgICAgICAgICByZXR1cm4gJGlucHV0LmZpbmQoJ2lucHV0Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJGlucHV0O1xuICAgICAgICB9XG4gICAgfTtcblxufSkod2luZG93LmpRdWVyeSk7XG4iLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coJ3JlYWR5Jyk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
