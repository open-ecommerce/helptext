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
 * window.yii.sample = (function($) {
 *     var pub = {
 *         // whether this module is currently active. If false, init() will not be called for this module
 *         // it will also not be called for all its child modules. If this property is undefined, it means true.
 *         isActive: true,
 *         init: function() {
 *             // ... module initialization code goes here ...
 *         },
 *
 *         // ... other public functions and properties go here ...
 *     };
 *
 *     // ... private functions and properties go here ...
 *
 *     return pub;
 * })(window.jQuery);
 * ```
 *
 * Using this structure, you can define public and private functions/properties for a module.
 * Private functions/properties are only visible within the module, while public functions/properties
 * may be accessed outside of the module. For example, you can access "yii.sample.isActive".
 *
 * You must call "yii.initModule()" once for the root module of all your modules.
 */
window.yii = (function ($) {
    var pub = {
        /**
         * List of JS or CSS URLs that can be loaded multiple times via AJAX requests.
         * Each item may be represented as either an absolute URL or a relative one.
         * Each item may contain a wildcard matching character `*`, that means one or more
         * any characters on the position. For example:
         *  - `/css/*.css` will match any file ending with `.css` in the `css` directory of the current web site
         *  - `http*://cdn.example.com/*` will match any files on domain `cdn.example.com`, loaded with HTTP or HTTPS
         *  - `/js/myCustomScript.js?realm=*` will match file `/js/myCustomScript.js` with defined `realm` parameter
         */
        reloadableScripts: [],
        /**
         * The selector for clickable elements that need to support confirmation and form submission.
         */
        clickableSelector: 'a, button, input[type="submit"], input[type="button"], input[type="reset"], ' +
        'input[type="image"]',
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
            if (window.confirm(message)) {
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
         * ]);
         * ```
         *
         * @param $e the jQuery representation of the element
         * @param event Related event
         */
        handleAction: function ($e, event) {
            var $form = $e.attr('data-form') ? $('#' + $e.attr('data-form')) : $e.closest('form'),
                method = !$e.data('method') && $form ? $form.attr('method') : $e.data('method'),
                action = $e.attr('href'),
                isValidAction = action && action !== '#',
                params = $e.data('params'),
                areValidParams = params && $.isPlainObject(params),
                pjax = $e.data('pjax'),
                usePjax = pjax !== undefined && pjax !== 0 && $.support.pjax,
                pjaxContainer,
                pjaxOptions = {};

            if (usePjax) {
                pjaxContainer = $e.data('pjax-container') || $e.closest('[data-pjax-container]');
                if (!pjaxContainer.length) {
                    pjaxContainer = $('body');
                }
                pjaxOptions = {
                    container: pjaxContainer,
                    push: !!$e.data('pjax-push-state'),
                    replace: !!$e.data('pjax-replace-state'),
                    scrollTo: $e.data('pjax-scrollto'),
                    pushRedirect: $e.data('pjax-push-redirect'),
                    replaceRedirect: $e.data('pjax-replace-redirect'),
                    skipOuterContainers: $e.data('pjax-skip-outer-containers'),
                    timeout: $e.data('pjax-timeout'),
                    originalEvent: event,
                    originalTarget: $e
                };
            }

            if (method === undefined) {
                if (isValidAction) {
                    usePjax ? $.pjax.click(event, pjaxOptions) : window.location.assign(action);
                } else if ($e.is(':submit') && $form.length) {
                    if (usePjax) {
                        $form.on('submit', function (e) {
                            $.pjax.submit(e, pjaxOptions);
                        });
                    }
                    $form.trigger('submit');
                }
                return;
            }

            var oldMethod,
                oldAction,
                newForm = !$form.length;
            if (!newForm) {
                oldMethod = $form.attr('method');
                $form.attr('method', method);
                if (isValidAction) {
                    oldAction = $form.attr('action');
                    $form.attr('action', action);
                }
            } else {
                if (!isValidAction) {
                    action = pub.getCurrentUrl();
                }
                $form = $('<form/>', {method: method, action: action});
                var target = $e.attr('target');
                if (target) {
                    $form.attr('target', target);
                }
                if (!/(get|post)/i.test(method)) {
                    $form.append($('<input/>', {name: '_method', value: method, type: 'hidden'}));
                    method = 'post';
                    $form.attr('method', method);
                }
                if (/post/i.test(method)) {
                    var csrfParam = pub.getCsrfParam();
                    if (csrfParam) {
                        $form.append($('<input/>', {name: csrfParam, value: pub.getCsrfToken(), type: 'hidden'}));
                    }
                }
                $form.hide().appendTo('body');
            }

            var activeFormData = $form.data('yiiActiveForm');
            if (activeFormData) {
                // Remember the element triggered the form submission. This is used by yii.activeForm.js.
                activeFormData.submitObject = $e;
            }

            if (areValidParams) {
                $.each(params, function (name, value) {
                    $form.append($('<input/>').attr({name: name, value: value, type: 'hidden'}));
                });
            }

            if (usePjax) {
                $form.on('submit', function (e) {
                    $.pjax.submit(e, pjaxOptions);
                });
            }

            $form.trigger('submit');

            $.when($form.data('yiiSubmitFinalizePromise')).then(function () {
                if (newForm) {
                    $form.remove();
                    return;
                }

                if (oldAction !== undefined) {
                    $form.attr('action', oldAction);
                }
                $form.attr('method', oldMethod);

                if (areValidParams) {
                    $.each(params, function (name) {
                        $('input[name="' + name + '"]', $form).remove();
                    });
                }
            });
        },

        getQueryParams: function (url) {
            var pos = url.indexOf('?');
            if (pos < 0) {
                return {};
            }

            var pairs = url.substring(pos + 1).split('#')[0].split('&'),
                params = {};

            for (var i = 0, len = pairs.length; i < len; i++) {
                var pair = pairs[i].split('=');
                var name = decodeURIComponent(pair[0].replace(/\+/g, '%20'));
                var value = decodeURIComponent(pair[1].replace(/\+/g, '%20'));
                if (!name.length) {
                    continue;
                }
                if (params[name] === undefined) {
                    params[name] = value || '';
                } else {
                    if (!$.isArray(params[name])) {
                        params[name] = [params[name]];
                    }
                    params[name].push(value || '');
                }
            }
            return params;
        },

        initModule: function (module) {
            if (module.isActive !== undefined && !module.isActive) {
                return;
            }
            if ($.isFunction(module.init)) {
                module.init();
            }
            $.each(module, function () {
                if ($.isPlainObject(this)) {
                    pub.initModule(this);
                }
            });
        },

        init: function () {
            initCsrfHandler();
            initRedirectHandler();
            initAssetFilters();
            initDataMethods();
        },

        /**
         * Returns the URL of the current page without params and trailing slash. Separated and made public for testing.
         * @returns {string}
         */
        getBaseCurrentUrl: function () {
            return window.location.protocol + '//' + window.location.host;
        },

        /**
         * Returns the URL of the current page. Used for testing, you can always call `window.location.href` manually
         * instead.
         * @returns {string}
         */
        getCurrentUrl: function () {
            return window.location.href;
        }
    };

    function initCsrfHandler() {
        // automatically send CSRF token for all AJAX requests
        $.ajaxPrefilter(function (options, originalOptions, xhr) {
            if (!options.crossDomain && pub.getCsrfParam()) {
                xhr.setRequestHeader('X-CSRF-Token', pub.getCsrfToken());
            }
        });
        pub.refreshCsrfToken();
    }

    function initRedirectHandler() {
        // handle AJAX redirection
        $(document).ajaxComplete(function (event, xhr) {
            var url = xhr && xhr.getResponseHeader('X-Redirect');
            if (url) {
                window.location.assign(url);
            }
        });
    }

    function initAssetFilters() {
        /**
         * Used for storing loaded scripts and information about loading each script if it's in the process of loading.
         * A single script can have one of the following values:
         *
         * - `undefined` - script was not loaded at all before or was loaded with error last time.
         * - `true` (boolean) -  script was successfully loaded.
         * - object - script is currently loading.
         *
         * In case of a value being an object the properties are:
         * - `xhrList` - represents a queue of XHR requests sent to the same URL (related with this script) in the same
         * small period of time.
         * - `xhrDone` - boolean, acts like a locking mechanism. When one of the XHR requests in the queue is
         * successfully completed, it will abort the rest of concurrent requests to the same URL until cleanup is done
         * to prevent possible errors and race conditions.
         * @type {{}}
         */
        var loadedScripts = {};

        $('script[src]').each(function () {
            var url = getAbsoluteUrl(this.src);
            loadedScripts[url] = true;
        });

        $.ajaxPrefilter('script', function (options, originalOptions, xhr) {
            if (options.dataType == 'jsonp') {
                return;
            }

            var url = getAbsoluteUrl(options.url),
                forbiddenRepeatedLoad = loadedScripts[url] === true && !isReloadableAsset(url),
                cleanupRunning = loadedScripts[url] !== undefined && loadedScripts[url]['xhrDone'] === true;

            if (forbiddenRepeatedLoad || cleanupRunning) {
                xhr.abort();
                return;
            }

            if (loadedScripts[url] === undefined || loadedScripts[url] === true) {
                loadedScripts[url] = {
                    xhrList: [],
                    xhrDone: false
                };
            }

            xhr.done(function (data, textStatus, jqXHR) {
                // If multiple requests were successfully loaded, perform cleanup only once
                if (loadedScripts[jqXHR.yiiUrl]['xhrDone'] === true) {
                    return;
                }

                loadedScripts[jqXHR.yiiUrl]['xhrDone'] = true;

                for (var i = 0, len = loadedScripts[jqXHR.yiiUrl]['xhrList'].length; i < len; i++) {
                    var singleXhr = loadedScripts[jqXHR.yiiUrl]['xhrList'][i];
                    if (singleXhr && singleXhr.readyState !== XMLHttpRequest.DONE) {
                        singleXhr.abort();
                    }
                }

                loadedScripts[jqXHR.yiiUrl] = true;
            }).fail(function (jqXHR, textStatus) {
                if (textStatus === 'abort') {
                    return;
                }

                delete loadedScripts[jqXHR.yiiUrl]['xhrList'][jqXHR.yiiIndex];

                var allFailed = true;
                for (var i = 0, len = loadedScripts[jqXHR.yiiUrl]['xhrList'].length; i < len; i++) {
                    if (loadedScripts[jqXHR.yiiUrl]['xhrList'][i]) {
                        allFailed = false;
                    }
                }

                if (allFailed) {
                    delete loadedScripts[jqXHR.yiiUrl];
                }
            });
            // Use prefix for custom XHR properties to avoid possible conflicts with existing properties
            xhr.yiiIndex = loadedScripts[url]['xhrList'].length;
            xhr.yiiUrl = url;

            loadedScripts[url]['xhrList'][xhr.yiiIndex] = xhr;
        });

        $(document).ajaxComplete(function () {
            var styleSheets = [];
            $('link[rel=stylesheet]').each(function () {
                var url = getAbsoluteUrl(this.href);
                if (isReloadableAsset(url)) {
                    return;
                }

                $.inArray(url, styleSheets) === -1 ? styleSheets.push(url) : $(this).remove();
            });
        });
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

    function isReloadableAsset(url) {
        for (var i = 0; i < pub.reloadableScripts.length; i++) {
            var rule = getAbsoluteUrl(pub.reloadableScripts[i]);
            var match = new RegExp("^" + escapeRegExp(rule).split('\\*').join('.*') + "$").test(url);
            if (match === true) {
                return true;
            }
        }

        return false;
    }

    // http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
    function escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    /**
     * Returns absolute URL based on the given URL
     * @param {string} url Initial URL
     * @returns {string}
     */
    function getAbsoluteUrl(url) {
        return url.charAt(0) === '/' ? pub.getBaseCurrentUrl() + url : url;
    }

    return pub;
})(window.jQuery);

window.jQuery(function () {
    window.yii.initModule(window.yii);
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
            return value === null || value === undefined || ($.isArray(value) && value.length === 0) || value === '';
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

        // "boolean" is a reserved keyword in older versions of ES so it's quoted for IE < 9 support
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

            if (options.is !== undefined && value.length != options.is) {
                pub.addMessage(messages, options.notEqual, value);
                return;
            }
            if (options.min !== undefined && value.length < options.min) {
                pub.addMessage(messages, options.tooShort, value);
            }
            if (options.max !== undefined && value.length > options.max) {
                pub.addMessage(messages, options.tooLong, value);
            }
        },

        file: function (attribute, messages, options) {
            var files = getUploadedFiles(attribute, messages, options);
            $.each(files, function (i, file) {
                validateFile(file, messages, options);
            });
        },

        image: function (attribute, messages, options, deferredList) {
            var files = getUploadedFiles(attribute, messages, options);
            $.each(files, function (i, file) {
                validateFile(file, messages, options);

                // Skip image validation if FileReader API is not available
                if (typeof FileReader === "undefined") {
                    return;
                }

                var deferred = $.Deferred();
                pub.validateImage(file, messages, options, deferred, new FileReader(), new Image());
                deferredList.push(deferred);
            });
        },

        validateImage: function (file, messages, options, deferred, fileReader, image) {
            image.onload = function() {
                validateImageSize(file, image, messages, options);
                deferred.resolve();
            };

            image.onerror = function () {
                messages.push(options.notImage.replace(/\{file\}/g, file.name));
                deferred.resolve();
            };

            fileReader.onload = function () {
                image.src = this.result;
            };

            // Resolve deferred if there was error while reading data
            fileReader.onerror = function () {
                deferred.resolve();
            };

            fileReader.readAsDataURL(file);
        },

        number: function (value, messages, options) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            if (typeof value === 'string' && !options.pattern.test(value)) {
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

            if (options.not === undefined) {
                options.not = false;
            }

            if (options.not === inArray) {
                pub.addMessage(messages, options.message, value);
            }
        },

        regularExpression: function (value, messages, options) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            if (!options.not && !options.pattern.test(value) || options.not && options.pattern.test(value)) {
                pub.addMessage(messages, options.message, value);
            }
        },

        email: function (value, messages, options) {
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            var valid = true,
                regexp = /^((?:"?([^"]*)"?\s)?)(?:\s+)?(?:(<?)((.+)@([^>]+))(>?))$/,
                matches = regexp.exec(value);

            if (matches === null) {
                valid = false;
            } else {
                var localPart = matches[5],
                    domain = matches[6];

                if (options.enableIDN) {
                    localPart = punycode.toASCII(localPart);
                    domain = punycode.toASCII(domain);

                    value = matches[1] + matches[3] + localPart + '@' + domain + matches[7];
                }

                if (localPart.length > 64) {
                    valid = false;
                } else if ((localPart + '@' + domain).length > 254) {
                    valid = false;
                } else {
                    valid = options.pattern.test(value) || (options.allowName && options.fullPattern.test(value));
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

            if (options.defaultScheme && !/:\/\//.test(value)) {
                value = options.defaultScheme + '://' + value;
            }

            var valid = true;

            if (options.enableIDN) {
                var matches = /^([^:]+):\/\/([^\/]+)(.*)$/.exec(value);
                if (matches === null) {
                    valid = false;
                } else {
                    value = matches[1] + '://' + punycode.toASCII(matches[2]) + matches[3];
                }
            }

            if (!valid || !options.pattern.test(value)) {
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
            hash = hash == null ? options.hash : hash[options.caseSensitive ? 0 : 1];
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

            var compareValue,
                valid = true;
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
            if (options.skipOnEmpty && pub.isEmpty(value)) {
                return;
            }

            var negation = null,
                cidr = null,
                matches = new RegExp(options.ipParsePattern).exec(value);
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

            var ipVersion = value.indexOf(':') === -1 ? 4 : 6;
            if (ipVersion == 6) {
                if (!(new RegExp(options.ipv6Pattern)).test(value)) {
                    pub.addMessage(messages, options.messages.message, value);
                }
                if (!options.ipv6) {
                    pub.addMessage(messages, options.messages.ipv6NotAllowed, value);
                }
            } else {
                if (!(new RegExp(options.ipv4Pattern)).test(value)) {
                    pub.addMessage(messages, options.messages.message, value);
                }
                if (!options.ipv4) {
                    pub.addMessage(messages, options.messages.ipv4NotAllowed, value);
                }
            }
        }
    };

    function getUploadedFiles(attribute, messages, options) {
        // Skip validation if File API is not available
        if (typeof File === "undefined") {
            return [];
        }

        var files = $(attribute.input, attribute.$form).get(0).files;
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
            var index = file.name.lastIndexOf('.');
            var ext = !~index ? '' : file.name.substr(index + 1, file.name.length).toLowerCase();

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

    function validateImageSize(file, image, messages, options) {
        if (options.minWidth && image.width < options.minWidth) {
            messages.push(options.underWidth.replace(/\{file\}/g, file.name));
        }

        if (options.maxWidth && image.width > options.maxWidth) {
            messages.push(options.overWidth.replace(/\{file\}/g, file.name));
        }

        if (options.minHeight && image.height < options.minHeight) {
            messages.push(options.underHeight.replace(/\{file\}/g, file.name));
        }

        if (options.maxHeight && image.height > options.maxHeight) {
            messages.push(options.overHeight.replace(/\{file\}/g, file.name));
        }
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
        ajaxComplete: 'ajaxComplete',
        /**
         * afterInit event is triggered after yii activeForm init.
         * The signature of the event handler should be:
         *     function (event)
         * where
         *  - event: an Event object.
         */        
        afterInit: 'afterInit'
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
        scrollToError: true,
        // offset in pixels that should be added when scrolling to the first error.
        scrollToErrorOffset: 0
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
        value: undefined,
        // whether to update aria-invalid attribute after validation
        updateAriaInvalid: true
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
                    options: getFormOptions($form)
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
                var event = $.Event(events.afterInit);
                $form.trigger(event);
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
        validate: function (forceValidate) {
            if (forceValidate) {
                $(this).data('yiiActiveForm').submitting = true;
            }

            var $form = $(this),
                data = $form.data('yiiActiveForm'),
                needAjaxValidation = false,
                messages = {},
                deferreds = deferredArray(),
                submitting = data.submitting && !forceValidate;

            if (data.submitting) {
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
                this.$form = $form;
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
                if (needAjaxValidation && ($.isEmptyObject(messages) || data.submitting)) {
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

    var buttonOptions = ['action', 'target', 'method', 'enctype'];

    /**
     * Returns current form options
     * @param $form
     * @returns object Object with button of form options
     */
    var getFormOptions = function ($form) {
        var attributes = {};
        for (var i = 0; i < buttonOptions.length; i++) {
            attributes[buttonOptions[i]] = $form.attr(buttonOptions[i]);
        }
        return attributes;
    };

    /**
     * Applies temporary form options related to submit button
     * @param $form the form jQuery object
     * @param $button the button jQuery object
     */
    var applyButtonOptions = function ($form, $button) {
        for (var i = 0; i < buttonOptions.length; i++) {
            var value = $button.attr('form' + buttonOptions[i]);
            if (value) {
                $form.attr(buttonOptions[i], value);
            }
        }
    };

    /**
     * Restores original form options
     * @param $form the form jQuery object
     */
    var restoreButtonOptions = function ($form) {
        var data = $form.data('yiiActiveForm');

        for (var i = 0; i < buttonOptions.length; i++) {
            $form.attr(buttonOptions[i], data.options[buttonOptions[i]] || null);
        }
    };

    /**
     * Updates the error messages and the input containers for all applicable attributes
     * @param $form the form jQuery object
     * @param messages array the validation error messages
     * @param submitting whether this method is called after validation triggered by form submission
     */
    var updateInputs = function ($form, messages, submitting) {
        var data = $form.data('yiiActiveForm');

        if (data === undefined) {
            return false;
        }

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
                    }).join(',')).first().closest(':visible').offset().top - data.settings.scrollToErrorOffset;
                    if (top < 0) {
                        top = 0;
                    } else if (top > $(document).height()) {
                        top = $(document).height();
                    }
                    var wtop = $(window).scrollTop();
                    if (top < wtop || top > wtop + $(window).height()) {
                        $(window).scrollTop(top);
                    }
                }
                data.submitting = false;
            } else {
                data.validated = true;
                if (data.submitObject) {
                    applyButtonOptions($form, data.submitObject);
                }
                $form.submit();
                if (data.submitObject) {
                    restoreButtonOptions($form);
                }
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
            updateAriaInvalid($form, attribute, hasError);
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

    var updateAriaInvalid = function ($form, attribute, hasError) {
        if (attribute.updateAriaInvalid) {
            $form.find(attribute.input).attr('aria-invalid', hasError ? 'true' : 'false');
        }
    }
})(window.jQuery);

$(document).ready(function () {
    console.log('ready');
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInlpaS5qcyIsInlpaS52YWxpZGF0aW9uLmpzIiwieWlpLmFjdGl2ZUZvcm0uanMiLCJhcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2x4QkE7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBZaWkgSmF2YVNjcmlwdCBtb2R1bGUuXG4gKlxuICogQGxpbmsgaHR0cDovL3d3dy55aWlmcmFtZXdvcmsuY29tL1xuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMDggWWlpIFNvZnR3YXJlIExMQ1xuICogQGxpY2Vuc2UgaHR0cDovL3d3dy55aWlmcmFtZXdvcmsuY29tL2xpY2Vuc2UvXG4gKiBAYXV0aG9yIFFpYW5nIFh1ZSA8cWlhbmcueHVlQGdtYWlsLmNvbT5cbiAqIEBzaW5jZSAyLjBcbiAqL1xuXG4vKipcbiAqIHlpaSBpcyB0aGUgcm9vdCBtb2R1bGUgZm9yIGFsbCBZaWkgSmF2YVNjcmlwdCBtb2R1bGVzLlxuICogSXQgaW1wbGVtZW50cyBhIG1lY2hhbmlzbSBvZiBvcmdhbml6aW5nIEphdmFTY3JpcHQgY29kZSBpbiBtb2R1bGVzIHRocm91Z2ggdGhlIGZ1bmN0aW9uIFwieWlpLmluaXRNb2R1bGUoKVwiLlxuICpcbiAqIEVhY2ggbW9kdWxlIHNob3VsZCBiZSBuYW1lZCBhcyBcIngueS56XCIsIHdoZXJlIFwieFwiIHN0YW5kcyBmb3IgdGhlIHJvb3QgbW9kdWxlIChmb3IgdGhlIFlpaSBjb3JlIGNvZGUsIHRoaXMgaXMgXCJ5aWlcIikuXG4gKlxuICogQSBtb2R1bGUgbWF5IGJlIHN0cnVjdHVyZWQgYXMgZm9sbG93czpcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiB3aW5kb3cueWlpLnNhbXBsZSA9IChmdW5jdGlvbigkKSB7XG4gKiAgICAgdmFyIHB1YiA9IHtcbiAqICAgICAgICAgLy8gd2hldGhlciB0aGlzIG1vZHVsZSBpcyBjdXJyZW50bHkgYWN0aXZlLiBJZiBmYWxzZSwgaW5pdCgpIHdpbGwgbm90IGJlIGNhbGxlZCBmb3IgdGhpcyBtb2R1bGVcbiAqICAgICAgICAgLy8gaXQgd2lsbCBhbHNvIG5vdCBiZSBjYWxsZWQgZm9yIGFsbCBpdHMgY2hpbGQgbW9kdWxlcy4gSWYgdGhpcyBwcm9wZXJ0eSBpcyB1bmRlZmluZWQsIGl0IG1lYW5zIHRydWUuXG4gKiAgICAgICAgIGlzQWN0aXZlOiB0cnVlLFxuICogICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAqICAgICAgICAgICAgIC8vIC4uLiBtb2R1bGUgaW5pdGlhbGl6YXRpb24gY29kZSBnb2VzIGhlcmUgLi4uXG4gKiAgICAgICAgIH0sXG4gKlxuICogICAgICAgICAvLyAuLi4gb3RoZXIgcHVibGljIGZ1bmN0aW9ucyBhbmQgcHJvcGVydGllcyBnbyBoZXJlIC4uLlxuICogICAgIH07XG4gKlxuICogICAgIC8vIC4uLiBwcml2YXRlIGZ1bmN0aW9ucyBhbmQgcHJvcGVydGllcyBnbyBoZXJlIC4uLlxuICpcbiAqICAgICByZXR1cm4gcHViO1xuICogfSkod2luZG93LmpRdWVyeSk7XG4gKiBgYGBcbiAqXG4gKiBVc2luZyB0aGlzIHN0cnVjdHVyZSwgeW91IGNhbiBkZWZpbmUgcHVibGljIGFuZCBwcml2YXRlIGZ1bmN0aW9ucy9wcm9wZXJ0aWVzIGZvciBhIG1vZHVsZS5cbiAqIFByaXZhdGUgZnVuY3Rpb25zL3Byb3BlcnRpZXMgYXJlIG9ubHkgdmlzaWJsZSB3aXRoaW4gdGhlIG1vZHVsZSwgd2hpbGUgcHVibGljIGZ1bmN0aW9ucy9wcm9wZXJ0aWVzXG4gKiBtYXkgYmUgYWNjZXNzZWQgb3V0c2lkZSBvZiB0aGUgbW9kdWxlLiBGb3IgZXhhbXBsZSwgeW91IGNhbiBhY2Nlc3MgXCJ5aWkuc2FtcGxlLmlzQWN0aXZlXCIuXG4gKlxuICogWW91IG11c3QgY2FsbCBcInlpaS5pbml0TW9kdWxlKClcIiBvbmNlIGZvciB0aGUgcm9vdCBtb2R1bGUgb2YgYWxsIHlvdXIgbW9kdWxlcy5cbiAqL1xud2luZG93LnlpaSA9IChmdW5jdGlvbiAoJCkge1xuICAgIHZhciBwdWIgPSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBMaXN0IG9mIEpTIG9yIENTUyBVUkxzIHRoYXQgY2FuIGJlIGxvYWRlZCBtdWx0aXBsZSB0aW1lcyB2aWEgQUpBWCByZXF1ZXN0cy5cbiAgICAgICAgICogRWFjaCBpdGVtIG1heSBiZSByZXByZXNlbnRlZCBhcyBlaXRoZXIgYW4gYWJzb2x1dGUgVVJMIG9yIGEgcmVsYXRpdmUgb25lLlxuICAgICAgICAgKiBFYWNoIGl0ZW0gbWF5IGNvbnRhaW4gYSB3aWxkY2FyZCBtYXRjaGluZyBjaGFyYWN0ZXIgYCpgLCB0aGF0IG1lYW5zIG9uZSBvciBtb3JlXG4gICAgICAgICAqIGFueSBjaGFyYWN0ZXJzIG9uIHRoZSBwb3NpdGlvbi4gRm9yIGV4YW1wbGU6XG4gICAgICAgICAqICAtIGAvY3NzLyouY3NzYCB3aWxsIG1hdGNoIGFueSBmaWxlIGVuZGluZyB3aXRoIGAuY3NzYCBpbiB0aGUgYGNzc2AgZGlyZWN0b3J5IG9mIHRoZSBjdXJyZW50IHdlYiBzaXRlXG4gICAgICAgICAqICAtIGBodHRwKjovL2Nkbi5leGFtcGxlLmNvbS8qYCB3aWxsIG1hdGNoIGFueSBmaWxlcyBvbiBkb21haW4gYGNkbi5leGFtcGxlLmNvbWAsIGxvYWRlZCB3aXRoIEhUVFAgb3IgSFRUUFNcbiAgICAgICAgICogIC0gYC9qcy9teUN1c3RvbVNjcmlwdC5qcz9yZWFsbT0qYCB3aWxsIG1hdGNoIGZpbGUgYC9qcy9teUN1c3RvbVNjcmlwdC5qc2Agd2l0aCBkZWZpbmVkIGByZWFsbWAgcGFyYW1ldGVyXG4gICAgICAgICAqL1xuICAgICAgICByZWxvYWRhYmxlU2NyaXB0czogW10sXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgc2VsZWN0b3IgZm9yIGNsaWNrYWJsZSBlbGVtZW50cyB0aGF0IG5lZWQgdG8gc3VwcG9ydCBjb25maXJtYXRpb24gYW5kIGZvcm0gc3VibWlzc2lvbi5cbiAgICAgICAgICovXG4gICAgICAgIGNsaWNrYWJsZVNlbGVjdG9yOiAnYSwgYnV0dG9uLCBpbnB1dFt0eXBlPVwic3VibWl0XCJdLCBpbnB1dFt0eXBlPVwiYnV0dG9uXCJdLCBpbnB1dFt0eXBlPVwicmVzZXRcIl0sICcgK1xuICAgICAgICAnaW5wdXRbdHlwZT1cImltYWdlXCJdJyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBzZWxlY3RvciBmb3IgY2hhbmdlYWJsZSBlbGVtZW50cyB0aGF0IG5lZWQgdG8gc3VwcG9ydCBjb25maXJtYXRpb24gYW5kIGZvcm0gc3VibWlzc2lvbi5cbiAgICAgICAgICovXG4gICAgICAgIGNoYW5nZWFibGVTZWxlY3RvcjogJ3NlbGVjdCwgaW5wdXQsIHRleHRhcmVhJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHJldHVybiBzdHJpbmd8dW5kZWZpbmVkIHRoZSBDU1JGIHBhcmFtZXRlciBuYW1lLiBVbmRlZmluZWQgaXMgcmV0dXJuZWQgaWYgQ1NSRiB2YWxpZGF0aW9uIGlzIG5vdCBlbmFibGVkLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0Q3NyZlBhcmFtOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJCgnbWV0YVtuYW1lPWNzcmYtcGFyYW1dJykuYXR0cignY29udGVudCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcmV0dXJuIHN0cmluZ3x1bmRlZmluZWQgdGhlIENTUkYgdG9rZW4uIFVuZGVmaW5lZCBpcyByZXR1cm5lZCBpZiBDU1JGIHZhbGlkYXRpb24gaXMgbm90IGVuYWJsZWQuXG4gICAgICAgICAqL1xuICAgICAgICBnZXRDc3JmVG9rZW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkKCdtZXRhW25hbWU9Y3NyZi10b2tlbl0nKS5hdHRyKCdjb250ZW50Jyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIENTUkYgdG9rZW4gaW4gdGhlIG1ldGEgZWxlbWVudHMuXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIGlzIHByb3ZpZGVkIHNvIHRoYXQgeW91IGNhbiB1cGRhdGUgdGhlIENTUkYgdG9rZW4gd2l0aCB0aGUgbGF0ZXN0IG9uZSB5b3Ugb2J0YWluIGZyb20gdGhlIHNlcnZlci5cbiAgICAgICAgICogQHBhcmFtIG5hbWUgdGhlIENTUkYgdG9rZW4gbmFtZVxuICAgICAgICAgKiBAcGFyYW0gdmFsdWUgdGhlIENTUkYgdG9rZW4gdmFsdWVcbiAgICAgICAgICovXG4gICAgICAgIHNldENzcmZUb2tlbjogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICAkKCdtZXRhW25hbWU9Y3NyZi1wYXJhbV0nKS5hdHRyKCdjb250ZW50JywgbmFtZSk7XG4gICAgICAgICAgICAkKCdtZXRhW25hbWU9Y3NyZi10b2tlbl0nKS5hdHRyKCdjb250ZW50JywgdmFsdWUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGVzIGFsbCBmb3JtIENTUkYgaW5wdXQgZmllbGRzIHdpdGggdGhlIGxhdGVzdCBDU1JGIHRva2VuLlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCBpcyBwcm92aWRlZCB0byBhdm9pZCBjYWNoZWQgZm9ybXMgY29udGFpbmluZyBvdXRkYXRlZCBDU1JGIHRva2Vucy5cbiAgICAgICAgICovXG4gICAgICAgIHJlZnJlc2hDc3JmVG9rZW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0b2tlbiA9IHB1Yi5nZXRDc3JmVG9rZW4oKTtcbiAgICAgICAgICAgIGlmICh0b2tlbikge1xuICAgICAgICAgICAgICAgICQoJ2Zvcm0gaW5wdXRbbmFtZT1cIicgKyBwdWIuZ2V0Q3NyZlBhcmFtKCkgKyAnXCJdJykudmFsKHRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzcGxheXMgYSBjb25maXJtYXRpb24gZGlhbG9nLlxuICAgICAgICAgKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBzaW1wbHkgZGlzcGxheXMgYSBqcyBjb25maXJtYXRpb24gZGlhbG9nLlxuICAgICAgICAgKiBZb3UgbWF5IG92ZXJyaWRlIHRoaXMgYnkgc2V0dGluZyBgeWlpLmNvbmZpcm1gLlxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZSB0aGUgY29uZmlybWF0aW9uIG1lc3NhZ2UuXG4gICAgICAgICAqIEBwYXJhbSBvayBhIGNhbGxiYWNrIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSB1c2VyIGNvbmZpcm1zIHRoZSBtZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSBjYW5jZWwgYSBjYWxsYmFjayB0byBiZSBjYWxsZWQgd2hlbiB0aGUgdXNlciBjYW5jZWxzIHRoZSBjb25maXJtYXRpb25cbiAgICAgICAgICovXG4gICAgICAgIGNvbmZpcm06IGZ1bmN0aW9uIChtZXNzYWdlLCBvaywgY2FuY2VsKSB7XG4gICAgICAgICAgICBpZiAod2luZG93LmNvbmZpcm0obWVzc2FnZSkpIHtcbiAgICAgICAgICAgICAgICAhb2sgfHwgb2soKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgIWNhbmNlbCB8fCBjYW5jZWwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogSGFuZGxlcyB0aGUgYWN0aW9uIHRyaWdnZXJlZCBieSB1c2VyLlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCByZWNvZ25pemVzIHRoZSBgZGF0YS1tZXRob2RgIGF0dHJpYnV0ZSBvZiB0aGUgZWxlbWVudC4gSWYgdGhlIGF0dHJpYnV0ZSBleGlzdHMsXG4gICAgICAgICAqIHRoZSBtZXRob2Qgd2lsbCBzdWJtaXQgdGhlIGZvcm0gY29udGFpbmluZyB0aGlzIGVsZW1lbnQuIElmIHRoZXJlIGlzIG5vIGNvbnRhaW5pbmcgZm9ybSwgYSBmb3JtXG4gICAgICAgICAqIHdpbGwgYmUgY3JlYXRlZCBhbmQgc3VibWl0dGVkIHVzaW5nIHRoZSBtZXRob2QgZ2l2ZW4gYnkgdGhpcyBhdHRyaWJ1dGUgdmFsdWUgKGUuZy4gXCJwb3N0XCIsIFwicHV0XCIpLlxuICAgICAgICAgKiBGb3IgaHlwZXJsaW5rcywgdGhlIGZvcm0gYWN0aW9uIHdpbGwgdGFrZSB0aGUgdmFsdWUgb2YgdGhlIFwiaHJlZlwiIGF0dHJpYnV0ZSBvZiB0aGUgbGluay5cbiAgICAgICAgICogRm9yIG90aGVyIGVsZW1lbnRzLCBlaXRoZXIgdGhlIGNvbnRhaW5pbmcgZm9ybSBhY3Rpb24gb3IgdGhlIGN1cnJlbnQgcGFnZSBVUkwgd2lsbCBiZSB1c2VkXG4gICAgICAgICAqIGFzIHRoZSBmb3JtIGFjdGlvbiBVUkwuXG4gICAgICAgICAqXG4gICAgICAgICAqIElmIHRoZSBgZGF0YS1tZXRob2RgIGF0dHJpYnV0ZSBpcyBub3QgZGVmaW5lZCwgdGhlIGBocmVmYCBhdHRyaWJ1dGUgKGlmIGFueSkgb2YgdGhlIGVsZW1lbnRcbiAgICAgICAgICogd2lsbCBiZSBhc3NpZ25lZCB0byBgd2luZG93LmxvY2F0aW9uYC5cbiAgICAgICAgICpcbiAgICAgICAgICogU3RhcnRpbmcgZnJvbSB2ZXJzaW9uIDIuMC4zLCB0aGUgYGRhdGEtcGFyYW1zYCBhdHRyaWJ1dGUgaXMgYWxzbyByZWNvZ25pemVkIHdoZW4geW91IHNwZWNpZnlcbiAgICAgICAgICogYGRhdGEtbWV0aG9kYC4gVGhlIHZhbHVlIG9mIGBkYXRhLXBhcmFtc2Agc2hvdWxkIGJlIGEgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgZGF0YSAobmFtZS12YWx1ZSBwYWlycylcbiAgICAgICAgICogdGhhdCBzaG91bGQgYmUgc3VibWl0dGVkIGFzIGhpZGRlbiBpbnB1dHMuIEZvciBleGFtcGxlLCB5b3UgbWF5IHVzZSB0aGUgZm9sbG93aW5nIGNvZGUgdG8gZ2VuZXJhdGVcbiAgICAgICAgICogc3VjaCBhIGxpbms6XG4gICAgICAgICAqXG4gICAgICAgICAqIGBgYHBocFxuICAgICAgICAgKiB1c2UgeWlpXFxoZWxwZXJzXFxIdG1sO1xuICAgICAgICAgKiB1c2UgeWlpXFxoZWxwZXJzXFxKc29uO1xuICAgICAgICAgKlxuICAgICAgICAgKiBlY2hvIEh0bWw6OmEoJ3N1Ym1pdCcsIFsnc2l0ZS9mb29iYXInXSwgW1xuICAgICAgICAgKiAgICAgJ2RhdGEnID0+IFtcbiAgICAgICAgICogICAgICAgICAnbWV0aG9kJyA9PiAncG9zdCcsXG4gICAgICAgICAqICAgICAgICAgJ3BhcmFtcycgPT4gW1xuICAgICAgICAgKiAgICAgICAgICAgICAnbmFtZTEnID0+ICd2YWx1ZTEnLFxuICAgICAgICAgKiAgICAgICAgICAgICAnbmFtZTInID0+ICd2YWx1ZTInLFxuICAgICAgICAgKiAgICAgICAgIF0sXG4gICAgICAgICAqICAgICBdLFxuICAgICAgICAgKiBdKTtcbiAgICAgICAgICogYGBgXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSAkZSB0aGUgalF1ZXJ5IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBlbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSBldmVudCBSZWxhdGVkIGV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICBoYW5kbGVBY3Rpb246IGZ1bmN0aW9uICgkZSwgZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICRlLmF0dHIoJ2RhdGEtZm9ybScpID8gJCgnIycgKyAkZS5hdHRyKCdkYXRhLWZvcm0nKSkgOiAkZS5jbG9zZXN0KCdmb3JtJyksXG4gICAgICAgICAgICAgICAgbWV0aG9kID0gISRlLmRhdGEoJ21ldGhvZCcpICYmICRmb3JtID8gJGZvcm0uYXR0cignbWV0aG9kJykgOiAkZS5kYXRhKCdtZXRob2QnKSxcbiAgICAgICAgICAgICAgICBhY3Rpb24gPSAkZS5hdHRyKCdocmVmJyksXG4gICAgICAgICAgICAgICAgaXNWYWxpZEFjdGlvbiA9IGFjdGlvbiAmJiBhY3Rpb24gIT09ICcjJyxcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSAkZS5kYXRhKCdwYXJhbXMnKSxcbiAgICAgICAgICAgICAgICBhcmVWYWxpZFBhcmFtcyA9IHBhcmFtcyAmJiAkLmlzUGxhaW5PYmplY3QocGFyYW1zKSxcbiAgICAgICAgICAgICAgICBwamF4ID0gJGUuZGF0YSgncGpheCcpLFxuICAgICAgICAgICAgICAgIHVzZVBqYXggPSBwamF4ICE9PSB1bmRlZmluZWQgJiYgcGpheCAhPT0gMCAmJiAkLnN1cHBvcnQucGpheCxcbiAgICAgICAgICAgICAgICBwamF4Q29udGFpbmVyLFxuICAgICAgICAgICAgICAgIHBqYXhPcHRpb25zID0ge307XG5cbiAgICAgICAgICAgIGlmICh1c2VQamF4KSB7XG4gICAgICAgICAgICAgICAgcGpheENvbnRhaW5lciA9ICRlLmRhdGEoJ3BqYXgtY29udGFpbmVyJykgfHwgJGUuY2xvc2VzdCgnW2RhdGEtcGpheC1jb250YWluZXJdJyk7XG4gICAgICAgICAgICAgICAgaWYgKCFwamF4Q29udGFpbmVyLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBwamF4Q29udGFpbmVyID0gJCgnYm9keScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwamF4T3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyOiBwamF4Q29udGFpbmVyLFxuICAgICAgICAgICAgICAgICAgICBwdXNoOiAhISRlLmRhdGEoJ3BqYXgtcHVzaC1zdGF0ZScpLFxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlOiAhISRlLmRhdGEoJ3BqYXgtcmVwbGFjZS1zdGF0ZScpLFxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUbzogJGUuZGF0YSgncGpheC1zY3JvbGx0bycpLFxuICAgICAgICAgICAgICAgICAgICBwdXNoUmVkaXJlY3Q6ICRlLmRhdGEoJ3BqYXgtcHVzaC1yZWRpcmVjdCcpLFxuICAgICAgICAgICAgICAgICAgICByZXBsYWNlUmVkaXJlY3Q6ICRlLmRhdGEoJ3BqYXgtcmVwbGFjZS1yZWRpcmVjdCcpLFxuICAgICAgICAgICAgICAgICAgICBza2lwT3V0ZXJDb250YWluZXJzOiAkZS5kYXRhKCdwamF4LXNraXAtb3V0ZXItY29udGFpbmVycycpLFxuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiAkZS5kYXRhKCdwamF4LXRpbWVvdXQnKSxcbiAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsVGFyZ2V0OiAkZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmIChpc1ZhbGlkQWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHVzZVBqYXggPyAkLnBqYXguY2xpY2soZXZlbnQsIHBqYXhPcHRpb25zKSA6IHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24oYWN0aW9uKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCRlLmlzKCc6c3VibWl0JykgJiYgJGZvcm0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1c2VQamF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5vbignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLnBqYXguc3VibWl0KGUsIHBqYXhPcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICRmb3JtLnRyaWdnZXIoJ3N1Ym1pdCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBvbGRNZXRob2QsXG4gICAgICAgICAgICAgICAgb2xkQWN0aW9uLFxuICAgICAgICAgICAgICAgIG5ld0Zvcm0gPSAhJGZvcm0ubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKCFuZXdGb3JtKSB7XG4gICAgICAgICAgICAgICAgb2xkTWV0aG9kID0gJGZvcm0uYXR0cignbWV0aG9kJyk7XG4gICAgICAgICAgICAgICAgJGZvcm0uYXR0cignbWV0aG9kJywgbWV0aG9kKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNWYWxpZEFjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBvbGRBY3Rpb24gPSAkZm9ybS5hdHRyKCdhY3Rpb24nKTtcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0uYXR0cignYWN0aW9uJywgYWN0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghaXNWYWxpZEFjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb24gPSBwdWIuZ2V0Q3VycmVudFVybCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkZm9ybSA9ICQoJzxmb3JtLz4nLCB7bWV0aG9kOiBtZXRob2QsIGFjdGlvbjogYWN0aW9ufSk7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9ICRlLmF0dHIoJ3RhcmdldCcpO1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0uYXR0cigndGFyZ2V0JywgdGFyZ2V0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCEvKGdldHxwb3N0KS9pLnRlc3QobWV0aG9kKSkge1xuICAgICAgICAgICAgICAgICAgICAkZm9ybS5hcHBlbmQoJCgnPGlucHV0Lz4nLCB7bmFtZTogJ19tZXRob2QnLCB2YWx1ZTogbWV0aG9kLCB0eXBlOiAnaGlkZGVuJ30pKTtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kID0gJ3Bvc3QnO1xuICAgICAgICAgICAgICAgICAgICAkZm9ybS5hdHRyKCdtZXRob2QnLCBtZXRob2QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoL3Bvc3QvaS50ZXN0KG1ldGhvZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNzcmZQYXJhbSA9IHB1Yi5nZXRDc3JmUGFyYW0oKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNzcmZQYXJhbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0uYXBwZW5kKCQoJzxpbnB1dC8+Jywge25hbWU6IGNzcmZQYXJhbSwgdmFsdWU6IHB1Yi5nZXRDc3JmVG9rZW4oKSwgdHlwZTogJ2hpZGRlbid9KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJGZvcm0uaGlkZSgpLmFwcGVuZFRvKCdib2R5Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhY3RpdmVGb3JtRGF0YSA9ICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKTtcbiAgICAgICAgICAgIGlmIChhY3RpdmVGb3JtRGF0YSkge1xuICAgICAgICAgICAgICAgIC8vIFJlbWVtYmVyIHRoZSBlbGVtZW50IHRyaWdnZXJlZCB0aGUgZm9ybSBzdWJtaXNzaW9uLiBUaGlzIGlzIHVzZWQgYnkgeWlpLmFjdGl2ZUZvcm0uanMuXG4gICAgICAgICAgICAgICAgYWN0aXZlRm9ybURhdGEuc3VibWl0T2JqZWN0ID0gJGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhcmVWYWxpZFBhcmFtcykge1xuICAgICAgICAgICAgICAgICQuZWFjaChwYXJhbXMsIGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAkZm9ybS5hcHBlbmQoJCgnPGlucHV0Lz4nKS5hdHRyKHtuYW1lOiBuYW1lLCB2YWx1ZTogdmFsdWUsIHR5cGU6ICdoaWRkZW4nfSkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodXNlUGpheCkge1xuICAgICAgICAgICAgICAgICRmb3JtLm9uKCdzdWJtaXQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAkLnBqYXguc3VibWl0KGUsIHBqYXhPcHRpb25zKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGZvcm0udHJpZ2dlcignc3VibWl0Jyk7XG5cbiAgICAgICAgICAgICQud2hlbigkZm9ybS5kYXRhKCd5aWlTdWJtaXRGaW5hbGl6ZVByb21pc2UnKSkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5ld0Zvcm0pIHtcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAob2xkQWN0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0uYXR0cignYWN0aW9uJywgb2xkQWN0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJGZvcm0uYXR0cignbWV0aG9kJywgb2xkTWV0aG9kKTtcblxuICAgICAgICAgICAgICAgIGlmIChhcmVWYWxpZFBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICAkLmVhY2gocGFyYW1zLCBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnaW5wdXRbbmFtZT1cIicgKyBuYW1lICsgJ1wiXScsICRmb3JtKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UXVlcnlQYXJhbXM6IGZ1bmN0aW9uICh1cmwpIHtcbiAgICAgICAgICAgIHZhciBwb3MgPSB1cmwuaW5kZXhPZignPycpO1xuICAgICAgICAgICAgaWYgKHBvcyA8IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBwYWlycyA9IHVybC5zdWJzdHJpbmcocG9zICsgMSkuc3BsaXQoJyMnKVswXS5zcGxpdCgnJicpLFxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHt9O1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gcGFpcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFpciA9IHBhaXJzW2ldLnNwbGl0KCc9Jyk7XG4gICAgICAgICAgICAgICAgdmFyIG5hbWUgPSBkZWNvZGVVUklDb21wb25lbnQocGFpclswXS5yZXBsYWNlKC9cXCsvZywgJyUyMCcpKTtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBkZWNvZGVVUklDb21wb25lbnQocGFpclsxXS5yZXBsYWNlKC9cXCsvZywgJyUyMCcpKTtcbiAgICAgICAgICAgICAgICBpZiAoIW5hbWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocGFyYW1zW25hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zW25hbWVdID0gdmFsdWUgfHwgJyc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkLmlzQXJyYXkocGFyYW1zW25hbWVdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zW25hbWVdID0gW3BhcmFtc1tuYW1lXV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zW25hbWVdLnB1c2godmFsdWUgfHwgJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwYXJhbXM7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdE1vZHVsZTogZnVuY3Rpb24gKG1vZHVsZSkge1xuICAgICAgICAgICAgaWYgKG1vZHVsZS5pc0FjdGl2ZSAhPT0gdW5kZWZpbmVkICYmICFtb2R1bGUuaXNBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJC5pc0Z1bmN0aW9uKG1vZHVsZS5pbml0KSkge1xuICAgICAgICAgICAgICAgIG1vZHVsZS5pbml0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkLmVhY2gobW9kdWxlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQuaXNQbGFpbk9iamVjdCh0aGlzKSkge1xuICAgICAgICAgICAgICAgICAgICBwdWIuaW5pdE1vZHVsZSh0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpbml0Q3NyZkhhbmRsZXIoKTtcbiAgICAgICAgICAgIGluaXRSZWRpcmVjdEhhbmRsZXIoKTtcbiAgICAgICAgICAgIGluaXRBc3NldEZpbHRlcnMoKTtcbiAgICAgICAgICAgIGluaXREYXRhTWV0aG9kcygpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBVUkwgb2YgdGhlIGN1cnJlbnQgcGFnZSB3aXRob3V0IHBhcmFtcyBhbmQgdHJhaWxpbmcgc2xhc2guIFNlcGFyYXRlZCBhbmQgbWFkZSBwdWJsaWMgZm9yIHRlc3RpbmcuXG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICBnZXRCYXNlQ3VycmVudFVybDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyB3aW5kb3cubG9jYXRpb24uaG9zdDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgVVJMIG9mIHRoZSBjdXJyZW50IHBhZ2UuIFVzZWQgZm9yIHRlc3RpbmcsIHlvdSBjYW4gYWx3YXlzIGNhbGwgYHdpbmRvdy5sb2NhdGlvbi5ocmVmYCBtYW51YWxseVxuICAgICAgICAgKiBpbnN0ZWFkLlxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0Q3VycmVudFVybDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGluaXRDc3JmSGFuZGxlcigpIHtcbiAgICAgICAgLy8gYXV0b21hdGljYWxseSBzZW5kIENTUkYgdG9rZW4gZm9yIGFsbCBBSkFYIHJlcXVlc3RzXG4gICAgICAgICQuYWpheFByZWZpbHRlcihmdW5jdGlvbiAob3B0aW9ucywgb3JpZ2luYWxPcHRpb25zLCB4aHIpIHtcbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5jcm9zc0RvbWFpbiAmJiBwdWIuZ2V0Q3NyZlBhcmFtKCkpIHtcbiAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignWC1DU1JGLVRva2VuJywgcHViLmdldENzcmZUb2tlbigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHB1Yi5yZWZyZXNoQ3NyZlRva2VuKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdFJlZGlyZWN0SGFuZGxlcigpIHtcbiAgICAgICAgLy8gaGFuZGxlIEFKQVggcmVkaXJlY3Rpb25cbiAgICAgICAgJChkb2N1bWVudCkuYWpheENvbXBsZXRlKGZ1bmN0aW9uIChldmVudCwgeGhyKSB7XG4gICAgICAgICAgICB2YXIgdXJsID0geGhyICYmIHhoci5nZXRSZXNwb25zZUhlYWRlcignWC1SZWRpcmVjdCcpO1xuICAgICAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24odXJsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdEFzc2V0RmlsdGVycygpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVzZWQgZm9yIHN0b3JpbmcgbG9hZGVkIHNjcmlwdHMgYW5kIGluZm9ybWF0aW9uIGFib3V0IGxvYWRpbmcgZWFjaCBzY3JpcHQgaWYgaXQncyBpbiB0aGUgcHJvY2VzcyBvZiBsb2FkaW5nLlxuICAgICAgICAgKiBBIHNpbmdsZSBzY3JpcHQgY2FuIGhhdmUgb25lIG9mIHRoZSBmb2xsb3dpbmcgdmFsdWVzOlxuICAgICAgICAgKlxuICAgICAgICAgKiAtIGB1bmRlZmluZWRgIC0gc2NyaXB0IHdhcyBub3QgbG9hZGVkIGF0IGFsbCBiZWZvcmUgb3Igd2FzIGxvYWRlZCB3aXRoIGVycm9yIGxhc3QgdGltZS5cbiAgICAgICAgICogLSBgdHJ1ZWAgKGJvb2xlYW4pIC0gIHNjcmlwdCB3YXMgc3VjY2Vzc2Z1bGx5IGxvYWRlZC5cbiAgICAgICAgICogLSBvYmplY3QgLSBzY3JpcHQgaXMgY3VycmVudGx5IGxvYWRpbmcuXG4gICAgICAgICAqXG4gICAgICAgICAqIEluIGNhc2Ugb2YgYSB2YWx1ZSBiZWluZyBhbiBvYmplY3QgdGhlIHByb3BlcnRpZXMgYXJlOlxuICAgICAgICAgKiAtIGB4aHJMaXN0YCAtIHJlcHJlc2VudHMgYSBxdWV1ZSBvZiBYSFIgcmVxdWVzdHMgc2VudCB0byB0aGUgc2FtZSBVUkwgKHJlbGF0ZWQgd2l0aCB0aGlzIHNjcmlwdCkgaW4gdGhlIHNhbWVcbiAgICAgICAgICogc21hbGwgcGVyaW9kIG9mIHRpbWUuXG4gICAgICAgICAqIC0gYHhockRvbmVgIC0gYm9vbGVhbiwgYWN0cyBsaWtlIGEgbG9ja2luZyBtZWNoYW5pc20uIFdoZW4gb25lIG9mIHRoZSBYSFIgcmVxdWVzdHMgaW4gdGhlIHF1ZXVlIGlzXG4gICAgICAgICAqIHN1Y2Nlc3NmdWxseSBjb21wbGV0ZWQsIGl0IHdpbGwgYWJvcnQgdGhlIHJlc3Qgb2YgY29uY3VycmVudCByZXF1ZXN0cyB0byB0aGUgc2FtZSBVUkwgdW50aWwgY2xlYW51cCBpcyBkb25lXG4gICAgICAgICAqIHRvIHByZXZlbnQgcG9zc2libGUgZXJyb3JzIGFuZCByYWNlIGNvbmRpdGlvbnMuXG4gICAgICAgICAqIEB0eXBlIHt7fX1cbiAgICAgICAgICovXG4gICAgICAgIHZhciBsb2FkZWRTY3JpcHRzID0ge307XG5cbiAgICAgICAgJCgnc2NyaXB0W3NyY10nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB1cmwgPSBnZXRBYnNvbHV0ZVVybCh0aGlzLnNyYyk7XG4gICAgICAgICAgICBsb2FkZWRTY3JpcHRzW3VybF0gPSB0cnVlO1xuICAgICAgICB9KTtcblxuICAgICAgICAkLmFqYXhQcmVmaWx0ZXIoJ3NjcmlwdCcsIGZ1bmN0aW9uIChvcHRpb25zLCBvcmlnaW5hbE9wdGlvbnMsIHhocikge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZGF0YVR5cGUgPT0gJ2pzb25wJykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHVybCA9IGdldEFic29sdXRlVXJsKG9wdGlvbnMudXJsKSxcbiAgICAgICAgICAgICAgICBmb3JiaWRkZW5SZXBlYXRlZExvYWQgPSBsb2FkZWRTY3JpcHRzW3VybF0gPT09IHRydWUgJiYgIWlzUmVsb2FkYWJsZUFzc2V0KHVybCksXG4gICAgICAgICAgICAgICAgY2xlYW51cFJ1bm5pbmcgPSBsb2FkZWRTY3JpcHRzW3VybF0gIT09IHVuZGVmaW5lZCAmJiBsb2FkZWRTY3JpcHRzW3VybF1bJ3hockRvbmUnXSA9PT0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKGZvcmJpZGRlblJlcGVhdGVkTG9hZCB8fCBjbGVhbnVwUnVubmluZykge1xuICAgICAgICAgICAgICAgIHhoci5hYm9ydCgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGxvYWRlZFNjcmlwdHNbdXJsXSA9PT0gdW5kZWZpbmVkIHx8IGxvYWRlZFNjcmlwdHNbdXJsXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGxvYWRlZFNjcmlwdHNbdXJsXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgeGhyTGlzdDogW10sXG4gICAgICAgICAgICAgICAgICAgIHhockRvbmU6IGZhbHNlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgeGhyLmRvbmUoZnVuY3Rpb24gKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgbXVsdGlwbGUgcmVxdWVzdHMgd2VyZSBzdWNjZXNzZnVsbHkgbG9hZGVkLCBwZXJmb3JtIGNsZWFudXAgb25seSBvbmNlXG4gICAgICAgICAgICAgICAgaWYgKGxvYWRlZFNjcmlwdHNbanFYSFIueWlpVXJsXVsneGhyRG9uZSddID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsb2FkZWRTY3JpcHRzW2pxWEhSLnlpaVVybF1bJ3hockRvbmUnXSA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbG9hZGVkU2NyaXB0c1tqcVhIUi55aWlVcmxdWyd4aHJMaXN0J10ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNpbmdsZVhociA9IGxvYWRlZFNjcmlwdHNbanFYSFIueWlpVXJsXVsneGhyTGlzdCddW2ldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2luZ2xlWGhyICYmIHNpbmdsZVhoci5yZWFkeVN0YXRlICE9PSBYTUxIdHRwUmVxdWVzdC5ET05FKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaW5nbGVYaHIuYWJvcnQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxvYWRlZFNjcmlwdHNbanFYSFIueWlpVXJsXSA9IHRydWU7XG4gICAgICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uIChqcVhIUiwgdGV4dFN0YXR1cykge1xuICAgICAgICAgICAgICAgIGlmICh0ZXh0U3RhdHVzID09PSAnYWJvcnQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBkZWxldGUgbG9hZGVkU2NyaXB0c1tqcVhIUi55aWlVcmxdWyd4aHJMaXN0J11banFYSFIueWlpSW5kZXhdO1xuXG4gICAgICAgICAgICAgICAgdmFyIGFsbEZhaWxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxvYWRlZFNjcmlwdHNbanFYSFIueWlpVXJsXVsneGhyTGlzdCddLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsb2FkZWRTY3JpcHRzW2pxWEhSLnlpaVVybF1bJ3hockxpc3QnXVtpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxsRmFpbGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYWxsRmFpbGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBsb2FkZWRTY3JpcHRzW2pxWEhSLnlpaVVybF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBVc2UgcHJlZml4IGZvciBjdXN0b20gWEhSIHByb3BlcnRpZXMgdG8gYXZvaWQgcG9zc2libGUgY29uZmxpY3RzIHdpdGggZXhpc3RpbmcgcHJvcGVydGllc1xuICAgICAgICAgICAgeGhyLnlpaUluZGV4ID0gbG9hZGVkU2NyaXB0c1t1cmxdWyd4aHJMaXN0J10ubGVuZ3RoO1xuICAgICAgICAgICAgeGhyLnlpaVVybCA9IHVybDtcblxuICAgICAgICAgICAgbG9hZGVkU2NyaXB0c1t1cmxdWyd4aHJMaXN0J11beGhyLnlpaUluZGV4XSA9IHhocjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChkb2N1bWVudCkuYWpheENvbXBsZXRlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzdHlsZVNoZWV0cyA9IFtdO1xuICAgICAgICAgICAgJCgnbGlua1tyZWw9c3R5bGVzaGVldF0nKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgdXJsID0gZ2V0QWJzb2x1dGVVcmwodGhpcy5ocmVmKTtcbiAgICAgICAgICAgICAgICBpZiAoaXNSZWxvYWRhYmxlQXNzZXQodXJsKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJC5pbkFycmF5KHVybCwgc3R5bGVTaGVldHMpID09PSAtMSA/IHN0eWxlU2hlZXRzLnB1c2godXJsKSA6ICQodGhpcykucmVtb3ZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5pdERhdGFNZXRob2RzKCkge1xuICAgICAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBtZXRob2QgPSAkdGhpcy5kYXRhKCdtZXRob2QnKSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlID0gJHRoaXMuZGF0YSgnY29uZmlybScpLFxuICAgICAgICAgICAgICAgIGZvcm0gPSAkdGhpcy5kYXRhKCdmb3JtJyk7XG5cbiAgICAgICAgICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCAmJiBtZXNzYWdlID09PSB1bmRlZmluZWQgJiYgZm9ybSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtZXNzYWdlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAkLnByb3h5KHB1Yi5jb25maXJtLCB0aGlzKShtZXNzYWdlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHB1Yi5oYW5kbGVBY3Rpb24oJHRoaXMsIGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcHViLmhhbmRsZUFjdGlvbigkdGhpcywgZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gaGFuZGxlIGRhdGEtY29uZmlybSBhbmQgZGF0YS1tZXRob2QgZm9yIGNsaWNrYWJsZSBhbmQgY2hhbmdlYWJsZSBlbGVtZW50c1xuICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2sueWlpJywgcHViLmNsaWNrYWJsZVNlbGVjdG9yLCBoYW5kbGVyKVxuICAgICAgICAgICAgLm9uKCdjaGFuZ2UueWlpJywgcHViLmNoYW5nZWFibGVTZWxlY3RvciwgaGFuZGxlcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNSZWxvYWRhYmxlQXNzZXQodXJsKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHViLnJlbG9hZGFibGVTY3JpcHRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgcnVsZSA9IGdldEFic29sdXRlVXJsKHB1Yi5yZWxvYWRhYmxlU2NyaXB0c1tpXSk7XG4gICAgICAgICAgICB2YXIgbWF0Y2ggPSBuZXcgUmVnRXhwKFwiXlwiICsgZXNjYXBlUmVnRXhwKHJ1bGUpLnNwbGl0KCdcXFxcKicpLmpvaW4oJy4qJykgKyBcIiRcIikudGVzdCh1cmwpO1xuICAgICAgICAgICAgaWYgKG1hdGNoID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8zNDQ2MTcwL2VzY2FwZS1zdHJpbmctZm9yLXVzZS1pbi1qYXZhc2NyaXB0LXJlZ2V4XG4gICAgZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cikge1xuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFwkXFx8XS9nLCBcIlxcXFwkJlwiKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFic29sdXRlIFVSTCBiYXNlZCBvbiB0aGUgZ2l2ZW4gVVJMXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCBJbml0aWFsIFVSTFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZnVuY3Rpb24gZ2V0QWJzb2x1dGVVcmwodXJsKSB7XG4gICAgICAgIHJldHVybiB1cmwuY2hhckF0KDApID09PSAnLycgPyBwdWIuZ2V0QmFzZUN1cnJlbnRVcmwoKSArIHVybCA6IHVybDtcbiAgICB9XG5cbiAgICByZXR1cm4gcHViO1xufSkod2luZG93LmpRdWVyeSk7XG5cbndpbmRvdy5qUXVlcnkoZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy55aWkuaW5pdE1vZHVsZSh3aW5kb3cueWlpKTtcbn0pO1xuIiwiLyoqXG4gKiBZaWkgdmFsaWRhdGlvbiBtb2R1bGUuXG4gKlxuICogVGhpcyBKYXZhU2NyaXB0IG1vZHVsZSBwcm92aWRlcyB0aGUgdmFsaWRhdGlvbiBtZXRob2RzIGZvciB0aGUgYnVpbHQtaW4gdmFsaWRhdG9ycy5cbiAqXG4gKiBAbGluayBodHRwOi8vd3d3LnlpaWZyYW1ld29yay5jb20vXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAwOCBZaWkgU29mdHdhcmUgTExDXG4gKiBAbGljZW5zZSBodHRwOi8vd3d3LnlpaWZyYW1ld29yay5jb20vbGljZW5zZS9cbiAqIEBhdXRob3IgUWlhbmcgWHVlIDxxaWFuZy54dWVAZ21haWwuY29tPlxuICogQHNpbmNlIDIuMFxuICovXG5cbnlpaS52YWxpZGF0aW9uID0gKGZ1bmN0aW9uICgkKSB7XG4gICAgdmFyIHB1YiA9IHtcbiAgICAgICAgaXNFbXB0eTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCB8fCAoJC5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHx8IHZhbHVlID09PSAnJztcbiAgICAgICAgfSxcblxuICAgICAgICBhZGRNZXNzYWdlOiBmdW5jdGlvbiAobWVzc2FnZXMsIG1lc3NhZ2UsIHZhbHVlKSB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG1lc3NhZ2UucmVwbGFjZSgvXFx7dmFsdWVcXH0vZywgdmFsdWUpKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZXF1aXJlZDogZnVuY3Rpb24gKHZhbHVlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIHZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5yZXF1aXJlZFZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgaXNTdHJpbmcgPSB0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgfHwgdmFsdWUgaW5zdGFuY2VvZiBTdHJpbmc7XG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuc3RyaWN0ICYmIHZhbHVlICE9PSB1bmRlZmluZWQgfHwgIW9wdGlvbnMuc3RyaWN0ICYmICFwdWIuaXNFbXB0eShpc1N0cmluZyA/ICQudHJpbSh2YWx1ZSkgOiB2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIW9wdGlvbnMuc3RyaWN0ICYmIHZhbHVlID09IG9wdGlvbnMucmVxdWlyZWRWYWx1ZSB8fCBvcHRpb25zLnN0cmljdCAmJiB2YWx1ZSA9PT0gb3B0aW9ucy5yZXF1aXJlZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFwiYm9vbGVhblwiIGlzIGEgcmVzZXJ2ZWQga2V5d29yZCBpbiBvbGRlciB2ZXJzaW9ucyBvZiBFUyBzbyBpdCdzIHF1b3RlZCBmb3IgSUUgPCA5IHN1cHBvcnRcbiAgICAgICAgJ2Jvb2xlYW4nOiBmdW5jdGlvbiAodmFsdWUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5za2lwT25FbXB0eSAmJiBwdWIuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgdmFsaWQgPSAhb3B0aW9ucy5zdHJpY3QgJiYgKHZhbHVlID09IG9wdGlvbnMudHJ1ZVZhbHVlIHx8IHZhbHVlID09IG9wdGlvbnMuZmFsc2VWYWx1ZSlcbiAgICAgICAgICAgICAgICB8fCBvcHRpb25zLnN0cmljdCAmJiAodmFsdWUgPT09IG9wdGlvbnMudHJ1ZVZhbHVlIHx8IHZhbHVlID09PSBvcHRpb25zLmZhbHNlVmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAoIXZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHN0cmluZzogZnVuY3Rpb24gKHZhbHVlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2tpcE9uRW1wdHkgJiYgcHViLmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmlzICE9PSB1bmRlZmluZWQgJiYgdmFsdWUubGVuZ3RoICE9IG9wdGlvbnMuaXMpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5ub3RFcXVhbCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1pbiAhPT0gdW5kZWZpbmVkICYmIHZhbHVlLmxlbmd0aCA8IG9wdGlvbnMubWluKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMudG9vU2hvcnQsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1heCAhPT0gdW5kZWZpbmVkICYmIHZhbHVlLmxlbmd0aCA+IG9wdGlvbnMubWF4KSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMudG9vTG9uZywgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGZpbGU6IGZ1bmN0aW9uIChhdHRyaWJ1dGUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICB2YXIgZmlsZXMgPSBnZXRVcGxvYWRlZEZpbGVzKGF0dHJpYnV0ZSwgbWVzc2FnZXMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgJC5lYWNoKGZpbGVzLCBmdW5jdGlvbiAoaSwgZmlsZSkge1xuICAgICAgICAgICAgICAgIHZhbGlkYXRlRmlsZShmaWxlLCBtZXNzYWdlcywgb3B0aW9ucyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBpbWFnZTogZnVuY3Rpb24gKGF0dHJpYnV0ZSwgbWVzc2FnZXMsIG9wdGlvbnMsIGRlZmVycmVkTGlzdCkge1xuICAgICAgICAgICAgdmFyIGZpbGVzID0gZ2V0VXBsb2FkZWRGaWxlcyhhdHRyaWJ1dGUsIG1lc3NhZ2VzLCBvcHRpb25zKTtcbiAgICAgICAgICAgICQuZWFjaChmaWxlcywgZnVuY3Rpb24gKGksIGZpbGUpIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZUZpbGUoZmlsZSwgbWVzc2FnZXMsIG9wdGlvbnMpO1xuXG4gICAgICAgICAgICAgICAgLy8gU2tpcCBpbWFnZSB2YWxpZGF0aW9uIGlmIEZpbGVSZWFkZXIgQVBJIGlzIG5vdCBhdmFpbGFibGVcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIEZpbGVSZWFkZXIgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9ICQuRGVmZXJyZWQoKTtcbiAgICAgICAgICAgICAgICBwdWIudmFsaWRhdGVJbWFnZShmaWxlLCBtZXNzYWdlcywgb3B0aW9ucywgZGVmZXJyZWQsIG5ldyBGaWxlUmVhZGVyKCksIG5ldyBJbWFnZSgpKTtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZExpc3QucHVzaChkZWZlcnJlZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICB2YWxpZGF0ZUltYWdlOiBmdW5jdGlvbiAoZmlsZSwgbWVzc2FnZXMsIG9wdGlvbnMsIGRlZmVycmVkLCBmaWxlUmVhZGVyLCBpbWFnZSkge1xuICAgICAgICAgICAgaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdGVJbWFnZVNpemUoZmlsZSwgaW1hZ2UsIG1lc3NhZ2VzLCBvcHRpb25zKTtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpbWFnZS5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy5ub3RJbWFnZS5yZXBsYWNlKC9cXHtmaWxlXFx9L2csIGZpbGUubmFtZSkpO1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZpbGVSZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGltYWdlLnNyYyA9IHRoaXMucmVzdWx0O1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gUmVzb2x2ZSBkZWZlcnJlZCBpZiB0aGVyZSB3YXMgZXJyb3Igd2hpbGUgcmVhZGluZyBkYXRhXG4gICAgICAgICAgICBmaWxlUmVhZGVyLm9uZXJyb3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIG51bWJlcjogZnVuY3Rpb24gKHZhbHVlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2tpcE9uRW1wdHkgJiYgcHViLmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiAhb3B0aW9ucy5wYXR0ZXJuLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubWluICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgPCBvcHRpb25zLm1pbikge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLnRvb1NtYWxsLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5tYXggIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSA+IG9wdGlvbnMubWF4KSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMudG9vQmlnLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmFuZ2U6IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNraXBPbkVtcHR5ICYmIHB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFvcHRpb25zLmFsbG93QXJyYXkgJiYgJC5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpbkFycmF5ID0gdHJ1ZTtcblxuICAgICAgICAgICAgJC5lYWNoKCQuaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZSA6IFt2YWx1ZV0sIGZ1bmN0aW9uIChpLCB2KSB7XG4gICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheSh2LCBvcHRpb25zLnJhbmdlKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBpbkFycmF5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubm90ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLm5vdCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5ub3QgPT09IGluQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVndWxhckV4cHJlc3Npb246IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNraXBPbkVtcHR5ICYmIHB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFvcHRpb25zLm5vdCAmJiAhb3B0aW9ucy5wYXR0ZXJuLnRlc3QodmFsdWUpIHx8IG9wdGlvbnMubm90ICYmIG9wdGlvbnMucGF0dGVybi50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBlbWFpbDogZnVuY3Rpb24gKHZhbHVlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2tpcE9uRW1wdHkgJiYgcHViLmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgdmFsaWQgPSB0cnVlLFxuICAgICAgICAgICAgICAgIHJlZ2V4cCA9IC9eKCg/OlwiPyhbXlwiXSopXCI/XFxzKT8pKD86XFxzKyk/KD86KDw/KSgoLispQChbXj5dKykpKD4/KSkkLyxcbiAgICAgICAgICAgICAgICBtYXRjaGVzID0gcmVnZXhwLmV4ZWModmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAobWF0Y2hlcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBsb2NhbFBhcnQgPSBtYXRjaGVzWzVdLFxuICAgICAgICAgICAgICAgICAgICBkb21haW4gPSBtYXRjaGVzWzZdO1xuXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMuZW5hYmxlSUROKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvY2FsUGFydCA9IHB1bnljb2RlLnRvQVNDSUkobG9jYWxQYXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgZG9tYWluID0gcHVueWNvZGUudG9BU0NJSShkb21haW4pO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbWF0Y2hlc1sxXSArIG1hdGNoZXNbM10gKyBsb2NhbFBhcnQgKyAnQCcgKyBkb21haW4gKyBtYXRjaGVzWzddO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChsb2NhbFBhcnQubGVuZ3RoID4gNjQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKChsb2NhbFBhcnQgKyAnQCcgKyBkb21haW4pLmxlbmd0aCA+IDI1NCkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gb3B0aW9ucy5wYXR0ZXJuLnRlc3QodmFsdWUpIHx8IChvcHRpb25zLmFsbG93TmFtZSAmJiBvcHRpb25zLmZ1bGxQYXR0ZXJuLnRlc3QodmFsdWUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdmFsaWQpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdXJsOiBmdW5jdGlvbiAodmFsdWUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5za2lwT25FbXB0eSAmJiBwdWIuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmRlZmF1bHRTY2hlbWUgJiYgIS86XFwvXFwvLy50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gb3B0aW9ucy5kZWZhdWx0U2NoZW1lICsgJzovLycgKyB2YWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHZhbGlkID0gdHJ1ZTtcblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuZW5hYmxlSUROKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoZXMgPSAvXihbXjpdKyk6XFwvXFwvKFteXFwvXSspKC4qKSQvLmV4ZWModmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmIChtYXRjaGVzID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBtYXRjaGVzWzFdICsgJzovLycgKyBwdW55Y29kZS50b0FTQ0lJKG1hdGNoZXNbMl0pICsgbWF0Y2hlc1szXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdmFsaWQgfHwgIW9wdGlvbnMucGF0dGVybi50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICB0cmltOiBmdW5jdGlvbiAoJGZvcm0sIGF0dHJpYnV0ZSwgb3B0aW9ucykge1xuICAgICAgICAgICAgdmFyICRpbnB1dCA9ICRmb3JtLmZpbmQoYXR0cmlidXRlLmlucHV0KTtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9ICRpbnB1dC52YWwoKTtcbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5za2lwT25FbXB0eSB8fCAhcHViLmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSAkLnRyaW0odmFsdWUpO1xuICAgICAgICAgICAgICAgICRpbnB1dC52YWwodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNhcHRjaGE6IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNraXBPbkVtcHR5ICYmIHB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ0FQVENIQSBtYXkgYmUgdXBkYXRlZCB2aWEgQUpBWCBhbmQgdGhlIHVwZGF0ZWQgaGFzaCBpcyBzdG9yZWQgaW4gYm9keSBkYXRhXG4gICAgICAgICAgICB2YXIgaGFzaCA9ICQoJ2JvZHknKS5kYXRhKG9wdGlvbnMuaGFzaEtleSk7XG4gICAgICAgICAgICBoYXNoID0gaGFzaCA9PSBudWxsID8gb3B0aW9ucy5oYXNoIDogaGFzaFtvcHRpb25zLmNhc2VTZW5zaXRpdmUgPyAwIDogMV07XG4gICAgICAgICAgICB2YXIgdiA9IG9wdGlvbnMuY2FzZVNlbnNpdGl2ZSA/IHZhbHVlIDogdmFsdWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSB2Lmxlbmd0aCAtIDEsIGggPSAwOyBpID49IDA7IC0taSkge1xuICAgICAgICAgICAgICAgIGggKz0gdi5jaGFyQ29kZUF0KGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGggIT0gaGFzaCkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBjb21wYXJlOiBmdW5jdGlvbiAodmFsdWUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5za2lwT25FbXB0eSAmJiBwdWIuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjb21wYXJlVmFsdWUsXG4gICAgICAgICAgICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuY29tcGFyZUF0dHJpYnV0ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgY29tcGFyZVZhbHVlID0gb3B0aW9ucy5jb21wYXJlVmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbXBhcmVWYWx1ZSA9ICQoJyMnICsgb3B0aW9ucy5jb21wYXJlQXR0cmlidXRlKS52YWwoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMudHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQodmFsdWUpO1xuICAgICAgICAgICAgICAgIGNvbXBhcmVWYWx1ZSA9IHBhcnNlRmxvYXQoY29tcGFyZVZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAob3B0aW9ucy5vcGVyYXRvcikge1xuICAgICAgICAgICAgICAgIGNhc2UgJz09JzpcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB2YWx1ZSA9PSBjb21wYXJlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJz09PSc6XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdmFsdWUgPT09IGNvbXBhcmVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnIT0nOlxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHZhbHVlICE9IGNvbXBhcmVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnIT09JzpcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB2YWx1ZSAhPT0gY29tcGFyZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICc+JzpcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB2YWx1ZSA+IGNvbXBhcmVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnPj0nOlxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHZhbHVlID49IGNvbXBhcmVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnPCc6XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdmFsdWUgPCBjb21wYXJlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJzw9JzpcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB2YWx1ZSA8PSBjb21wYXJlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGlwOiBmdW5jdGlvbiAodmFsdWUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5za2lwT25FbXB0eSAmJiBwdWIuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBuZWdhdGlvbiA9IG51bGwsXG4gICAgICAgICAgICAgICAgY2lkciA9IG51bGwsXG4gICAgICAgICAgICAgICAgbWF0Y2hlcyA9IG5ldyBSZWdFeHAob3B0aW9ucy5pcFBhcnNlUGF0dGVybikuZXhlYyh2YWx1ZSk7XG4gICAgICAgICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICAgICAgICAgIG5lZ2F0aW9uID0gbWF0Y2hlc1sxXSB8fCBudWxsO1xuICAgICAgICAgICAgICAgIHZhbHVlID0gbWF0Y2hlc1syXTtcbiAgICAgICAgICAgICAgICBjaWRyID0gbWF0Y2hlc1s0XSB8fCBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5zdWJuZXQgPT09IHRydWUgJiYgY2lkciA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2VzLm5vU3VibmV0LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc3VibmV0ID09PSBmYWxzZSAmJiBjaWRyICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZXMuaGFzU3VibmV0LCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubmVnYXRpb24gPT09IGZhbHNlICYmIG5lZ2F0aW9uICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZXMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGlwVmVyc2lvbiA9IHZhbHVlLmluZGV4T2YoJzonKSA9PT0gLTEgPyA0IDogNjtcbiAgICAgICAgICAgIGlmIChpcFZlcnNpb24gPT0gNikge1xuICAgICAgICAgICAgICAgIGlmICghKG5ldyBSZWdFeHAob3B0aW9ucy5pcHY2UGF0dGVybikpLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2VzLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLmlwdjYpIHtcbiAgICAgICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZXMuaXB2Nk5vdEFsbG93ZWQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghKG5ldyBSZWdFeHAob3B0aW9ucy5pcHY0UGF0dGVybikpLnRlc3QodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2VzLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLmlwdjQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZXMuaXB2NE5vdEFsbG93ZWQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0VXBsb2FkZWRGaWxlcyhhdHRyaWJ1dGUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgIC8vIFNraXAgdmFsaWRhdGlvbiBpZiBGaWxlIEFQSSBpcyBub3QgYXZhaWxhYmxlXG4gICAgICAgIGlmICh0eXBlb2YgRmlsZSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZpbGVzID0gJChhdHRyaWJ1dGUuaW5wdXQsIGF0dHJpYnV0ZS4kZm9ybSkuZ2V0KDApLmZpbGVzO1xuICAgICAgICBpZiAoIWZpbGVzKSB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMubWVzc2FnZSk7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZmlsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuc2tpcE9uRW1wdHkpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMudXBsb2FkUmVxdWlyZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubWF4RmlsZXMgJiYgb3B0aW9ucy5tYXhGaWxlcyA8IGZpbGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgbWVzc2FnZXMucHVzaChvcHRpb25zLnRvb01hbnkpO1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbGVzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlRmlsZShmaWxlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICBpZiAob3B0aW9ucy5leHRlbnNpb25zICYmIG9wdGlvbnMuZXh0ZW5zaW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBmaWxlLm5hbWUubGFzdEluZGV4T2YoJy4nKTtcbiAgICAgICAgICAgIHZhciBleHQgPSAhfmluZGV4ID8gJycgOiBmaWxlLm5hbWUuc3Vic3RyKGluZGV4ICsgMSwgZmlsZS5uYW1lLmxlbmd0aCkudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgaWYgKCF+b3B0aW9ucy5leHRlbnNpb25zLmluZGV4T2YoZXh0KSkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy53cm9uZ0V4dGVuc2lvbi5yZXBsYWNlKC9cXHtmaWxlXFx9L2csIGZpbGUubmFtZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubWltZVR5cGVzICYmIG9wdGlvbnMubWltZVR5cGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICghdmFsaWRhdGVNaW1lVHlwZShvcHRpb25zLm1pbWVUeXBlcywgZmlsZS50eXBlKSkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy53cm9uZ01pbWVUeXBlLnJlcGxhY2UoL1xce2ZpbGVcXH0vZywgZmlsZS5uYW1lKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5tYXhTaXplICYmIG9wdGlvbnMubWF4U2l6ZSA8IGZpbGUuc2l6ZSkge1xuICAgICAgICAgICAgbWVzc2FnZXMucHVzaChvcHRpb25zLnRvb0JpZy5yZXBsYWNlKC9cXHtmaWxlXFx9L2csIGZpbGUubmFtZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubWluU2l6ZSAmJiBvcHRpb25zLm1pblNpemUgPiBmaWxlLnNpemUpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy50b29TbWFsbC5yZXBsYWNlKC9cXHtmaWxlXFx9L2csIGZpbGUubmFtZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGVNaW1lVHlwZShtaW1lVHlwZXMsIGZpbGVUeXBlKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBtaW1lVHlwZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChuZXcgUmVnRXhwKG1pbWVUeXBlc1tpXSkudGVzdChmaWxlVHlwZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZUltYWdlU2l6ZShmaWxlLCBpbWFnZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMubWluV2lkdGggJiYgaW1hZ2Uud2lkdGggPCBvcHRpb25zLm1pbldpZHRoKSB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMudW5kZXJXaWR0aC5yZXBsYWNlKC9cXHtmaWxlXFx9L2csIGZpbGUubmFtZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubWF4V2lkdGggJiYgaW1hZ2Uud2lkdGggPiBvcHRpb25zLm1heFdpZHRoKSB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMub3ZlcldpZHRoLnJlcGxhY2UoL1xce2ZpbGVcXH0vZywgZmlsZS5uYW1lKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5taW5IZWlnaHQgJiYgaW1hZ2UuaGVpZ2h0IDwgb3B0aW9ucy5taW5IZWlnaHQpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy51bmRlckhlaWdodC5yZXBsYWNlKC9cXHtmaWxlXFx9L2csIGZpbGUubmFtZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubWF4SGVpZ2h0ICYmIGltYWdlLmhlaWdodCA+IG9wdGlvbnMubWF4SGVpZ2h0KSB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMub3ZlckhlaWdodC5yZXBsYWNlKC9cXHtmaWxlXFx9L2csIGZpbGUubmFtZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHB1Yjtcbn0pKGpRdWVyeSk7XG4iLCIvKipcbiAqIFlpaSBmb3JtIHdpZGdldC5cbiAqXG4gKiBUaGlzIGlzIHRoZSBKYXZhU2NyaXB0IHdpZGdldCB1c2VkIGJ5IHRoZSB5aWlcXHdpZGdldHNcXEFjdGl2ZUZvcm0gd2lkZ2V0LlxuICpcbiAqIEBsaW5rIGh0dHA6Ly93d3cueWlpZnJhbWV3b3JrLmNvbS9cbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDA4IFlpaSBTb2Z0d2FyZSBMTENcbiAqIEBsaWNlbnNlIGh0dHA6Ly93d3cueWlpZnJhbWV3b3JrLmNvbS9saWNlbnNlL1xuICogQGF1dGhvciBRaWFuZyBYdWUgPHFpYW5nLnh1ZUBnbWFpbC5jb20+XG4gKiBAc2luY2UgMi4wXG4gKi9cbihmdW5jdGlvbiAoJCkge1xuXG4gICAgJC5mbi55aWlBY3RpdmVGb3JtID0gZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgICAgICBpZiAobWV0aG9kc1ttZXRob2RdKSB7XG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kc1ttZXRob2RdLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBtZXRob2QgPT09ICdvYmplY3QnIHx8ICFtZXRob2QpIHtcbiAgICAgICAgICAgIHJldHVybiBtZXRob2RzLmluaXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQuZXJyb3IoJ01ldGhvZCAnICsgbWV0aG9kICsgJyBkb2VzIG5vdCBleGlzdCBvbiBqUXVlcnkueWlpQWN0aXZlRm9ybScpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBldmVudHMgPSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBiZWZvcmVWYWxpZGF0ZSBldmVudCBpcyB0cmlnZ2VyZWQgYmVmb3JlIHZhbGlkYXRpbmcgdGhlIHdob2xlIGZvcm0uXG4gICAgICAgICAqIFRoZSBzaWduYXR1cmUgb2YgdGhlIGV2ZW50IGhhbmRsZXIgc2hvdWxkIGJlOlxuICAgICAgICAgKiAgICAgZnVuY3Rpb24gKGV2ZW50LCBtZXNzYWdlcywgZGVmZXJyZWRzKVxuICAgICAgICAgKiB3aGVyZVxuICAgICAgICAgKiAgLSBldmVudDogYW4gRXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiAgLSBtZXNzYWdlczogYW4gYXNzb2NpYXRpdmUgYXJyYXkgd2l0aCBrZXlzIGJlaW5nIGF0dHJpYnV0ZSBJRHMgYW5kIHZhbHVlcyBiZWluZyBlcnJvciBtZXNzYWdlIGFycmF5c1xuICAgICAgICAgKiAgICBmb3IgdGhlIGNvcnJlc3BvbmRpbmcgYXR0cmlidXRlcy5cbiAgICAgICAgICogIC0gZGVmZXJyZWRzOiBhbiBhcnJheSBvZiBEZWZlcnJlZCBvYmplY3RzLiBZb3UgY2FuIHVzZSBkZWZlcnJlZHMuYWRkKGNhbGxiYWNrKSB0byBhZGQgYSBuZXcgZGVmZXJyZWQgdmFsaWRhdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogSWYgdGhlIGhhbmRsZXIgcmV0dXJucyBhIGJvb2xlYW4gZmFsc2UsIGl0IHdpbGwgc3RvcCBmdXJ0aGVyIGZvcm0gdmFsaWRhdGlvbiBhZnRlciB0aGlzIGV2ZW50LiBBbmQgYXNcbiAgICAgICAgICogYSByZXN1bHQsIGFmdGVyVmFsaWRhdGUgZXZlbnQgd2lsbCBub3QgYmUgdHJpZ2dlcmVkLlxuICAgICAgICAgKi9cbiAgICAgICAgYmVmb3JlVmFsaWRhdGU6ICdiZWZvcmVWYWxpZGF0ZScsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBhZnRlclZhbGlkYXRlIGV2ZW50IGlzIHRyaWdnZXJlZCBhZnRlciB2YWxpZGF0aW5nIHRoZSB3aG9sZSBmb3JtLlxuICAgICAgICAgKiBUaGUgc2lnbmF0dXJlIG9mIHRoZSBldmVudCBoYW5kbGVyIHNob3VsZCBiZTpcbiAgICAgICAgICogICAgIGZ1bmN0aW9uIChldmVudCwgbWVzc2FnZXMsIGVycm9yQXR0cmlidXRlcylcbiAgICAgICAgICogd2hlcmVcbiAgICAgICAgICogIC0gZXZlbnQ6IGFuIEV2ZW50IG9iamVjdC5cbiAgICAgICAgICogIC0gbWVzc2FnZXM6IGFuIGFzc29jaWF0aXZlIGFycmF5IHdpdGgga2V5cyBiZWluZyBhdHRyaWJ1dGUgSURzIGFuZCB2YWx1ZXMgYmVpbmcgZXJyb3IgbWVzc2FnZSBhcnJheXNcbiAgICAgICAgICogICAgZm9yIHRoZSBjb3JyZXNwb25kaW5nIGF0dHJpYnV0ZXMuXG4gICAgICAgICAqICAtIGVycm9yQXR0cmlidXRlczogYW4gYXJyYXkgb2YgYXR0cmlidXRlcyB0aGF0IGhhdmUgdmFsaWRhdGlvbiBlcnJvcnMuIFBsZWFzZSByZWZlciB0byBhdHRyaWJ1dGVEZWZhdWx0cyBmb3IgdGhlIHN0cnVjdHVyZSBvZiB0aGlzIHBhcmFtZXRlci5cbiAgICAgICAgICovXG4gICAgICAgIGFmdGVyVmFsaWRhdGU6ICdhZnRlclZhbGlkYXRlJyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGJlZm9yZVZhbGlkYXRlQXR0cmlidXRlIGV2ZW50IGlzIHRyaWdnZXJlZCBiZWZvcmUgdmFsaWRhdGluZyBhbiBhdHRyaWJ1dGUuXG4gICAgICAgICAqIFRoZSBzaWduYXR1cmUgb2YgdGhlIGV2ZW50IGhhbmRsZXIgc2hvdWxkIGJlOlxuICAgICAgICAgKiAgICAgZnVuY3Rpb24gKGV2ZW50LCBhdHRyaWJ1dGUsIG1lc3NhZ2VzLCBkZWZlcnJlZHMpXG4gICAgICAgICAqIHdoZXJlXG4gICAgICAgICAqICAtIGV2ZW50OiBhbiBFdmVudCBvYmplY3QuXG4gICAgICAgICAqICAtIGF0dHJpYnV0ZTogdGhlIGF0dHJpYnV0ZSB0byBiZSB2YWxpZGF0ZWQuIFBsZWFzZSByZWZlciB0byBhdHRyaWJ1dGVEZWZhdWx0cyBmb3IgdGhlIHN0cnVjdHVyZSBvZiB0aGlzIHBhcmFtZXRlci5cbiAgICAgICAgICogIC0gbWVzc2FnZXM6IGFuIGFycmF5IHRvIHdoaWNoIHlvdSBjYW4gYWRkIHZhbGlkYXRpb24gZXJyb3IgbWVzc2FnZXMgZm9yIHRoZSBzcGVjaWZpZWQgYXR0cmlidXRlLlxuICAgICAgICAgKiAgLSBkZWZlcnJlZHM6IGFuIGFycmF5IG9mIERlZmVycmVkIG9iamVjdHMuIFlvdSBjYW4gdXNlIGRlZmVycmVkcy5hZGQoY2FsbGJhY2spIHRvIGFkZCBhIG5ldyBkZWZlcnJlZCB2YWxpZGF0aW9uLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJZiB0aGUgaGFuZGxlciByZXR1cm5zIGEgYm9vbGVhbiBmYWxzZSwgaXQgd2lsbCBzdG9wIGZ1cnRoZXIgdmFsaWRhdGlvbiBvZiB0aGUgc3BlY2lmaWVkIGF0dHJpYnV0ZS5cbiAgICAgICAgICogQW5kIGFzIGEgcmVzdWx0LCBhZnRlclZhbGlkYXRlQXR0cmlidXRlIGV2ZW50IHdpbGwgbm90IGJlIHRyaWdnZXJlZC5cbiAgICAgICAgICovXG4gICAgICAgIGJlZm9yZVZhbGlkYXRlQXR0cmlidXRlOiAnYmVmb3JlVmFsaWRhdGVBdHRyaWJ1dGUnLFxuICAgICAgICAvKipcbiAgICAgICAgICogYWZ0ZXJWYWxpZGF0ZUF0dHJpYnV0ZSBldmVudCBpcyB0cmlnZ2VyZWQgYWZ0ZXIgdmFsaWRhdGluZyB0aGUgd2hvbGUgZm9ybSBhbmQgZWFjaCBhdHRyaWJ1dGUuXG4gICAgICAgICAqIFRoZSBzaWduYXR1cmUgb2YgdGhlIGV2ZW50IGhhbmRsZXIgc2hvdWxkIGJlOlxuICAgICAgICAgKiAgICAgZnVuY3Rpb24gKGV2ZW50LCBhdHRyaWJ1dGUsIG1lc3NhZ2VzKVxuICAgICAgICAgKiB3aGVyZVxuICAgICAgICAgKiAgLSBldmVudDogYW4gRXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiAgLSBhdHRyaWJ1dGU6IHRoZSBhdHRyaWJ1dGUgYmVpbmcgdmFsaWRhdGVkLiBQbGVhc2UgcmVmZXIgdG8gYXR0cmlidXRlRGVmYXVsdHMgZm9yIHRoZSBzdHJ1Y3R1cmUgb2YgdGhpcyBwYXJhbWV0ZXIuXG4gICAgICAgICAqICAtIG1lc3NhZ2VzOiBhbiBhcnJheSB0byB3aGljaCB5b3UgY2FuIGFkZCBhZGRpdGlvbmFsIHZhbGlkYXRpb24gZXJyb3IgbWVzc2FnZXMgZm9yIHRoZSBzcGVjaWZpZWQgYXR0cmlidXRlLlxuICAgICAgICAgKi9cbiAgICAgICAgYWZ0ZXJWYWxpZGF0ZUF0dHJpYnV0ZTogJ2FmdGVyVmFsaWRhdGVBdHRyaWJ1dGUnLFxuICAgICAgICAvKipcbiAgICAgICAgICogYmVmb3JlU3VibWl0IGV2ZW50IGlzIHRyaWdnZXJlZCBiZWZvcmUgc3VibWl0dGluZyB0aGUgZm9ybSBhZnRlciBhbGwgdmFsaWRhdGlvbnMgaGF2ZSBwYXNzZWQuXG4gICAgICAgICAqIFRoZSBzaWduYXR1cmUgb2YgdGhlIGV2ZW50IGhhbmRsZXIgc2hvdWxkIGJlOlxuICAgICAgICAgKiAgICAgZnVuY3Rpb24gKGV2ZW50KVxuICAgICAgICAgKiB3aGVyZSBldmVudCBpcyBhbiBFdmVudCBvYmplY3QuXG4gICAgICAgICAqXG4gICAgICAgICAqIElmIHRoZSBoYW5kbGVyIHJldHVybnMgYSBib29sZWFuIGZhbHNlLCBpdCB3aWxsIHN0b3AgZm9ybSBzdWJtaXNzaW9uLlxuICAgICAgICAgKi9cbiAgICAgICAgYmVmb3JlU3VibWl0OiAnYmVmb3JlU3VibWl0JyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGFqYXhCZWZvcmVTZW5kIGV2ZW50IGlzIHRyaWdnZXJlZCBiZWZvcmUgc2VuZGluZyBhbiBBSkFYIHJlcXVlc3QgZm9yIEFKQVgtYmFzZWQgdmFsaWRhdGlvbi5cbiAgICAgICAgICogVGhlIHNpZ25hdHVyZSBvZiB0aGUgZXZlbnQgaGFuZGxlciBzaG91bGQgYmU6XG4gICAgICAgICAqICAgICBmdW5jdGlvbiAoZXZlbnQsIGpxWEhSLCBzZXR0aW5ncylcbiAgICAgICAgICogd2hlcmVcbiAgICAgICAgICogIC0gZXZlbnQ6IGFuIEV2ZW50IG9iamVjdC5cbiAgICAgICAgICogIC0ganFYSFI6IGEganFYSFIgb2JqZWN0XG4gICAgICAgICAqICAtIHNldHRpbmdzOiB0aGUgc2V0dGluZ3MgZm9yIHRoZSBBSkFYIHJlcXVlc3RcbiAgICAgICAgICovXG4gICAgICAgIGFqYXhCZWZvcmVTZW5kOiAnYWpheEJlZm9yZVNlbmQnLFxuICAgICAgICAvKipcbiAgICAgICAgICogYWpheENvbXBsZXRlIGV2ZW50IGlzIHRyaWdnZXJlZCBhZnRlciBjb21wbGV0aW5nIGFuIEFKQVggcmVxdWVzdCBmb3IgQUpBWC1iYXNlZCB2YWxpZGF0aW9uLlxuICAgICAgICAgKiBUaGUgc2lnbmF0dXJlIG9mIHRoZSBldmVudCBoYW5kbGVyIHNob3VsZCBiZTpcbiAgICAgICAgICogICAgIGZ1bmN0aW9uIChldmVudCwganFYSFIsIHRleHRTdGF0dXMpXG4gICAgICAgICAqIHdoZXJlXG4gICAgICAgICAqICAtIGV2ZW50OiBhbiBFdmVudCBvYmplY3QuXG4gICAgICAgICAqICAtIGpxWEhSOiBhIGpxWEhSIG9iamVjdFxuICAgICAgICAgKiAgLSB0ZXh0U3RhdHVzOiB0aGUgc3RhdHVzIG9mIHRoZSByZXF1ZXN0IChcInN1Y2Nlc3NcIiwgXCJub3Rtb2RpZmllZFwiLCBcImVycm9yXCIsIFwidGltZW91dFwiLCBcImFib3J0XCIsIG9yIFwicGFyc2VyZXJyb3JcIikuXG4gICAgICAgICAqL1xuICAgICAgICBhamF4Q29tcGxldGU6ICdhamF4Q29tcGxldGUnLFxuICAgICAgICAvKipcbiAgICAgICAgICogYWZ0ZXJJbml0IGV2ZW50IGlzIHRyaWdnZXJlZCBhZnRlciB5aWkgYWN0aXZlRm9ybSBpbml0LlxuICAgICAgICAgKiBUaGUgc2lnbmF0dXJlIG9mIHRoZSBldmVudCBoYW5kbGVyIHNob3VsZCBiZTpcbiAgICAgICAgICogICAgIGZ1bmN0aW9uIChldmVudClcbiAgICAgICAgICogd2hlcmVcbiAgICAgICAgICogIC0gZXZlbnQ6IGFuIEV2ZW50IG9iamVjdC5cbiAgICAgICAgICovICAgICAgICBcbiAgICAgICAgYWZ0ZXJJbml0OiAnYWZ0ZXJJbml0J1xuICAgIH07XG5cbiAgICAvLyBOT1RFOiBJZiB5b3UgY2hhbmdlIGFueSBvZiB0aGVzZSBkZWZhdWx0cywgbWFrZSBzdXJlIHlvdSB1cGRhdGUgeWlpXFx3aWRnZXRzXFxBY3RpdmVGb3JtOjpnZXRDbGllbnRPcHRpb25zKCkgYXMgd2VsbFxuICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgLy8gd2hldGhlciB0byBlbmNvZGUgdGhlIGVycm9yIHN1bW1hcnlcbiAgICAgICAgZW5jb2RlRXJyb3JTdW1tYXJ5OiB0cnVlLFxuICAgICAgICAvLyB0aGUgalF1ZXJ5IHNlbGVjdG9yIGZvciB0aGUgZXJyb3Igc3VtbWFyeVxuICAgICAgICBlcnJvclN1bW1hcnk6ICcuZXJyb3Itc3VtbWFyeScsXG4gICAgICAgIC8vIHdoZXRoZXIgdG8gcGVyZm9ybSB2YWxpZGF0aW9uIGJlZm9yZSBzdWJtaXR0aW5nIHRoZSBmb3JtLlxuICAgICAgICB2YWxpZGF0ZU9uU3VibWl0OiB0cnVlLFxuICAgICAgICAvLyB0aGUgY29udGFpbmVyIENTUyBjbGFzcyByZXByZXNlbnRpbmcgdGhlIGNvcnJlc3BvbmRpbmcgYXR0cmlidXRlIGhhcyB2YWxpZGF0aW9uIGVycm9yXG4gICAgICAgIGVycm9yQ3NzQ2xhc3M6ICdoYXMtZXJyb3InLFxuICAgICAgICAvLyB0aGUgY29udGFpbmVyIENTUyBjbGFzcyByZXByZXNlbnRpbmcgdGhlIGNvcnJlc3BvbmRpbmcgYXR0cmlidXRlIHBhc3NlcyB2YWxpZGF0aW9uXG4gICAgICAgIHN1Y2Nlc3NDc3NDbGFzczogJ2hhcy1zdWNjZXNzJyxcbiAgICAgICAgLy8gdGhlIGNvbnRhaW5lciBDU1MgY2xhc3MgcmVwcmVzZW50aW5nIHRoZSBjb3JyZXNwb25kaW5nIGF0dHJpYnV0ZSBpcyBiZWluZyB2YWxpZGF0ZWRcbiAgICAgICAgdmFsaWRhdGluZ0Nzc0NsYXNzOiAndmFsaWRhdGluZycsXG4gICAgICAgIC8vIHRoZSBHRVQgcGFyYW1ldGVyIG5hbWUgaW5kaWNhdGluZyBhbiBBSkFYLWJhc2VkIHZhbGlkYXRpb25cbiAgICAgICAgYWpheFBhcmFtOiAnYWpheCcsXG4gICAgICAgIC8vIHRoZSB0eXBlIG9mIGRhdGEgdGhhdCB5b3UncmUgZXhwZWN0aW5nIGJhY2sgZnJvbSB0aGUgc2VydmVyXG4gICAgICAgIGFqYXhEYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAvLyB0aGUgVVJMIGZvciBwZXJmb3JtaW5nIEFKQVgtYmFzZWQgdmFsaWRhdGlvbi4gSWYgbm90IHNldCwgaXQgd2lsbCB1c2UgdGhlIHRoZSBmb3JtJ3MgYWN0aW9uXG4gICAgICAgIHZhbGlkYXRpb25Vcmw6IHVuZGVmaW5lZCxcbiAgICAgICAgLy8gd2hldGhlciB0byBzY3JvbGwgdG8gZmlyc3QgdmlzaWJsZSBlcnJvciBhZnRlciB2YWxpZGF0aW9uLlxuICAgICAgICBzY3JvbGxUb0Vycm9yOiB0cnVlLFxuICAgICAgICAvLyBvZmZzZXQgaW4gcGl4ZWxzIHRoYXQgc2hvdWxkIGJlIGFkZGVkIHdoZW4gc2Nyb2xsaW5nIHRvIHRoZSBmaXJzdCBlcnJvci5cbiAgICAgICAgc2Nyb2xsVG9FcnJvck9mZnNldDogMFxuICAgIH07XG5cbiAgICAvLyBOT1RFOiBJZiB5b3UgY2hhbmdlIGFueSBvZiB0aGVzZSBkZWZhdWx0cywgbWFrZSBzdXJlIHlvdSB1cGRhdGUgeWlpXFx3aWRnZXRzXFxBY3RpdmVGaWVsZDo6Z2V0Q2xpZW50T3B0aW9ucygpIGFzIHdlbGxcbiAgICB2YXIgYXR0cmlidXRlRGVmYXVsdHMgPSB7XG4gICAgICAgIC8vIGEgdW5pcXVlIElEIGlkZW50aWZ5aW5nIGFuIGF0dHJpYnV0ZSAoZS5nLiBcImxvZ2luZm9ybS11c2VybmFtZVwiKSBpbiBhIGZvcm1cbiAgICAgICAgaWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgLy8gYXR0cmlidXRlIG5hbWUgb3IgZXhwcmVzc2lvbiAoZS5nLiBcIlswXWNvbnRlbnRcIiBmb3IgdGFidWxhciBpbnB1dClcbiAgICAgICAgbmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAvLyB0aGUgalF1ZXJ5IHNlbGVjdG9yIG9mIHRoZSBjb250YWluZXIgb2YgdGhlIGlucHV0IGZpZWxkXG4gICAgICAgIGNvbnRhaW5lcjogdW5kZWZpbmVkLFxuICAgICAgICAvLyB0aGUgalF1ZXJ5IHNlbGVjdG9yIG9mIHRoZSBpbnB1dCBmaWVsZCB1bmRlciB0aGUgY29udGV4dCBvZiB0aGUgZm9ybVxuICAgICAgICBpbnB1dDogdW5kZWZpbmVkLFxuICAgICAgICAvLyB0aGUgalF1ZXJ5IHNlbGVjdG9yIG9mIHRoZSBlcnJvciB0YWcgdW5kZXIgdGhlIGNvbnRleHQgb2YgdGhlIGNvbnRhaW5lclxuICAgICAgICBlcnJvcjogJy5oZWxwLWJsb2NrJyxcbiAgICAgICAgLy8gd2hldGhlciB0byBlbmNvZGUgdGhlIGVycm9yXG4gICAgICAgIGVuY29kZUVycm9yOiB0cnVlLFxuICAgICAgICAvLyB3aGV0aGVyIHRvIHBlcmZvcm0gdmFsaWRhdGlvbiB3aGVuIGEgY2hhbmdlIGlzIGRldGVjdGVkIG9uIHRoZSBpbnB1dFxuICAgICAgICB2YWxpZGF0ZU9uQ2hhbmdlOiB0cnVlLFxuICAgICAgICAvLyB3aGV0aGVyIHRvIHBlcmZvcm0gdmFsaWRhdGlvbiB3aGVuIHRoZSBpbnB1dCBsb3NlcyBmb2N1c1xuICAgICAgICB2YWxpZGF0ZU9uQmx1cjogdHJ1ZSxcbiAgICAgICAgLy8gd2hldGhlciB0byBwZXJmb3JtIHZhbGlkYXRpb24gd2hlbiB0aGUgdXNlciBpcyB0eXBpbmcuXG4gICAgICAgIHZhbGlkYXRlT25UeXBlOiBmYWxzZSxcbiAgICAgICAgLy8gbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0aGF0IHRoZSB2YWxpZGF0aW9uIHNob3VsZCBiZSBkZWxheWVkIHdoZW4gYSB1c2VyIGlzIHR5cGluZyBpbiB0aGUgaW5wdXQgZmllbGQuXG4gICAgICAgIHZhbGlkYXRpb25EZWxheTogNTAwLFxuICAgICAgICAvLyB3aGV0aGVyIHRvIGVuYWJsZSBBSkFYLWJhc2VkIHZhbGlkYXRpb24uXG4gICAgICAgIGVuYWJsZUFqYXhWYWxpZGF0aW9uOiBmYWxzZSxcbiAgICAgICAgLy8gZnVuY3Rpb24gKGF0dHJpYnV0ZSwgdmFsdWUsIG1lc3NhZ2VzLCBkZWZlcnJlZCwgJGZvcm0pLCB0aGUgY2xpZW50LXNpZGUgdmFsaWRhdGlvbiBmdW5jdGlvbi5cbiAgICAgICAgdmFsaWRhdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgLy8gc3RhdHVzIG9mIHRoZSBpbnB1dCBmaWVsZCwgMDogZW1wdHksIG5vdCBlbnRlcmVkIGJlZm9yZSwgMTogdmFsaWRhdGVkLCAyOiBwZW5kaW5nIHZhbGlkYXRpb24sIDM6IHZhbGlkYXRpbmdcbiAgICAgICAgc3RhdHVzOiAwLFxuICAgICAgICAvLyB3aGV0aGVyIHRoZSB2YWxpZGF0aW9uIGlzIGNhbmNlbGxlZCBieSBiZWZvcmVWYWxpZGF0ZUF0dHJpYnV0ZSBldmVudCBoYW5kbGVyXG4gICAgICAgIGNhbmNlbGxlZDogZmFsc2UsXG4gICAgICAgIC8vIHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXRcbiAgICAgICAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgICAgICAgLy8gd2hldGhlciB0byB1cGRhdGUgYXJpYS1pbnZhbGlkIGF0dHJpYnV0ZSBhZnRlciB2YWxpZGF0aW9uXG4gICAgICAgIHVwZGF0ZUFyaWFJbnZhbGlkOiB0cnVlXG4gICAgfTtcblxuXG4gICAgdmFyIHN1Ym1pdERlZmVyO1xuXG4gICAgdmFyIHNldFN1Ym1pdEZpbmFsaXplRGVmZXIgPSBmdW5jdGlvbigkZm9ybSkge1xuICAgICAgICBzdWJtaXREZWZlciA9ICQuRGVmZXJyZWQoKTtcbiAgICAgICAgJGZvcm0uZGF0YSgneWlpU3VibWl0RmluYWxpemVQcm9taXNlJywgc3VibWl0RGVmZXIucHJvbWlzZSgpKTtcbiAgICB9O1xuXG4gICAgLy8gZmluYWxpemUgeWlpLmpzICRmb3JtLnN1Ym1pdFxuICAgIHZhciBzdWJtaXRGaW5hbGl6ZSA9IGZ1bmN0aW9uKCRmb3JtKSB7XG4gICAgICAgIGlmKHN1Ym1pdERlZmVyKSB7XG4gICAgICAgICAgICBzdWJtaXREZWZlci5yZXNvbHZlKCk7XG4gICAgICAgICAgICBzdWJtaXREZWZlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICRmb3JtLnJlbW92ZURhdGEoJ3lpaVN1Ym1pdEZpbmFsaXplUHJvbWlzZScpO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgdmFyIG1ldGhvZHMgPSB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uIChhdHRyaWJ1dGVzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgJGZvcm0gPSAkKHRoaXMpO1xuICAgICAgICAgICAgICAgIGlmICgkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBzZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgb3B0aW9ucyB8fCB7fSk7XG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLnZhbGlkYXRpb25VcmwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy52YWxpZGF0aW9uVXJsID0gJGZvcm0uYXR0cignYWN0aW9uJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJC5lYWNoKGF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXNbaV0gPSAkLmV4dGVuZCh7dmFsdWU6IGdldFZhbHVlKCRmb3JtLCB0aGlzKX0sIGF0dHJpYnV0ZURlZmF1bHRzLCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgd2F0Y2hBdHRyaWJ1dGUoJGZvcm0sIGF0dHJpYnV0ZXNbaV0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScsIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHNldHRpbmdzLFxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiBhdHRyaWJ1dGVzLFxuICAgICAgICAgICAgICAgICAgICBzdWJtaXR0aW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogZ2V0Rm9ybU9wdGlvbnMoJGZvcm0pXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBDbGVhbiB1cCBlcnJvciBzdGF0dXMgd2hlbiB0aGUgZm9ybSBpcyByZXNldC5cbiAgICAgICAgICAgICAgICAgKiBOb3RlIHRoYXQgJGZvcm0ub24oJ3Jlc2V0JywgLi4uKSBkb2VzIHdvcmsgYmVjYXVzZSB0aGUgXCJyZXNldFwiIGV2ZW50IGRvZXMgbm90IGJ1YmJsZSBvbiBJRS5cbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICAkZm9ybS5iaW5kKCdyZXNldC55aWlBY3RpdmVGb3JtJywgbWV0aG9kcy5yZXNldEZvcm0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNldHRpbmdzLnZhbGlkYXRlT25TdWJtaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0ub24oJ21vdXNldXAueWlpQWN0aXZlRm9ybSBrZXl1cC55aWlBY3RpdmVGb3JtJywgJzpzdWJtaXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJykuc3VibWl0T2JqZWN0ID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICRmb3JtLm9uKCdzdWJtaXQueWlpQWN0aXZlRm9ybScsIG1ldGhvZHMuc3VibWl0Rm9ybSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBldmVudCA9ICQuRXZlbnQoZXZlbnRzLmFmdGVySW5pdCk7XG4gICAgICAgICAgICAgICAgJGZvcm0udHJpZ2dlcihldmVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBhZGQgYSBuZXcgYXR0cmlidXRlIHRvIHRoZSBmb3JtIGR5bmFtaWNhbGx5LlxuICAgICAgICAvLyBwbGVhc2UgcmVmZXIgdG8gYXR0cmlidXRlRGVmYXVsdHMgZm9yIHRoZSBzdHJ1Y3R1cmUgb2YgYXR0cmlidXRlXG4gICAgICAgIGFkZDogZnVuY3Rpb24gKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgdmFyICRmb3JtID0gJCh0aGlzKTtcbiAgICAgICAgICAgIGF0dHJpYnV0ZSA9ICQuZXh0ZW5kKHt2YWx1ZTogZ2V0VmFsdWUoJGZvcm0sIGF0dHJpYnV0ZSl9LCBhdHRyaWJ1dGVEZWZhdWx0cywgYXR0cmlidXRlKTtcbiAgICAgICAgICAgICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKS5hdHRyaWJ1dGVzLnB1c2goYXR0cmlidXRlKTtcbiAgICAgICAgICAgIHdhdGNoQXR0cmlidXRlKCRmb3JtLCBhdHRyaWJ1dGUpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHJlbW92ZSB0aGUgYXR0cmlidXRlIHdpdGggdGhlIHNwZWNpZmllZCBJRCBmcm9tIHRoZSBmb3JtXG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICB2YXIgJGZvcm0gPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJykuYXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICQuZWFjaChhdHRyaWJ1dGVzLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzW2ldWydpZCddID09IGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlID0gYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgdW53YXRjaEF0dHJpYnV0ZSgkZm9ybSwgYXR0cmlidXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gbWFudWFsbHkgdHJpZ2dlciB0aGUgdmFsaWRhdGlvbiBvZiB0aGUgYXR0cmlidXRlIHdpdGggdGhlIHNwZWNpZmllZCBJRFxuICAgICAgICB2YWxpZGF0ZUF0dHJpYnV0ZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlID0gbWV0aG9kcy5maW5kLmNhbGwodGhpcywgaWQpO1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZUF0dHJpYnV0ZSgkKHRoaXMpLCBhdHRyaWJ1dGUsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIGZpbmQgYW4gYXR0cmlidXRlIGNvbmZpZyBiYXNlZCBvbiB0aGUgc3BlY2lmaWVkIGF0dHJpYnV0ZSBJRFxuICAgICAgICBmaW5kOiBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVzID0gJCh0aGlzKS5kYXRhKCd5aWlBY3RpdmVGb3JtJykuYXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAkLmVhY2goYXR0cmlidXRlcywgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlc1tpXVsnaWQnXSA9PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBhdHRyaWJ1dGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQodGhpcykudW5iaW5kKCcueWlpQWN0aXZlRm9ybScpO1xuICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlRGF0YSgneWlpQWN0aXZlRm9ybScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZGF0YTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YSgneWlpQWN0aXZlRm9ybScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHZhbGlkYXRlIGFsbCBhcHBsaWNhYmxlIGlucHV0cyBpbiB0aGUgZm9ybVxuICAgICAgICB2YWxpZGF0ZTogZnVuY3Rpb24gKGZvcmNlVmFsaWRhdGUpIHtcbiAgICAgICAgICAgIGlmIChmb3JjZVZhbGlkYXRlKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5kYXRhKCd5aWlBY3RpdmVGb3JtJykuc3VibWl0dGluZyA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgZGF0YSA9ICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKSxcbiAgICAgICAgICAgICAgICBuZWVkQWpheFZhbGlkYXRpb24gPSBmYWxzZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlcyA9IHt9LFxuICAgICAgICAgICAgICAgIGRlZmVycmVkcyA9IGRlZmVycmVkQXJyYXkoKSxcbiAgICAgICAgICAgICAgICBzdWJtaXR0aW5nID0gZGF0YS5zdWJtaXR0aW5nICYmICFmb3JjZVZhbGlkYXRlO1xuXG4gICAgICAgICAgICBpZiAoZGF0YS5zdWJtaXR0aW5nKSB7XG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50ID0gJC5FdmVudChldmVudHMuYmVmb3JlVmFsaWRhdGUpO1xuICAgICAgICAgICAgICAgICRmb3JtLnRyaWdnZXIoZXZlbnQsIFttZXNzYWdlcywgZGVmZXJyZWRzXSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQucmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLnN1Ym1pdHRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc3VibWl0RmluYWxpemUoJGZvcm0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBjbGllbnQtc2lkZSB2YWxpZGF0aW9uXG4gICAgICAgICAgICAkLmVhY2goZGF0YS5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kZm9ybSA9ICRmb3JtO1xuICAgICAgICAgICAgICAgIGlmICghJCh0aGlzLmlucHV0KS5pcyhcIjpkaXNhYmxlZFwiKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbmNlbGxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAvLyBwZXJmb3JtIHZhbGlkYXRpb24gb25seSBpZiB0aGUgZm9ybSBpcyBiZWluZyBzdWJtaXR0ZWQgb3IgaWYgYW4gYXR0cmlidXRlIGlzIHBlbmRpbmcgdmFsaWRhdGlvblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWJtaXR0aW5nIHx8IHRoaXMuc3RhdHVzID09PSAyIHx8IHRoaXMuc3RhdHVzID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbXNnID0gbWVzc2FnZXNbdGhpcy5pZF07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobXNnID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtc2cgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlc1t0aGlzLmlkXSA9IG1zZztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBldmVudCA9ICQuRXZlbnQoZXZlbnRzLmJlZm9yZVZhbGlkYXRlQXR0cmlidXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnRyaWdnZXIoZXZlbnQsIFt0aGlzLCBtc2csIGRlZmVycmVkc10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnJlc3VsdCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52YWxpZGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbGlkYXRlKHRoaXMsIGdldFZhbHVlKCRmb3JtLCB0aGlzKSwgbXNnLCBkZWZlcnJlZHMsICRmb3JtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZW5hYmxlQWpheFZhbGlkYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmVlZEFqYXhWYWxpZGF0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBhamF4IHZhbGlkYXRpb25cbiAgICAgICAgICAgICQud2hlbi5hcHBseSh0aGlzLCBkZWZlcnJlZHMpLmFsd2F5cyhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgZW1wdHkgbWVzc2FnZSBhcnJheXNcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG1lc3NhZ2VzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgwID09PSBtZXNzYWdlc1tpXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBtZXNzYWdlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobmVlZEFqYXhWYWxpZGF0aW9uICYmICgkLmlzRW1wdHlPYmplY3QobWVzc2FnZXMpIHx8IGRhdGEuc3VibWl0dGluZykpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRidXR0b24gPSBkYXRhLnN1Ym1pdE9iamVjdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dERhdGEgPSAnJicgKyBkYXRhLnNldHRpbmdzLmFqYXhQYXJhbSArICc9JyArICRmb3JtLmF0dHIoJ2lkJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkYnV0dG9uICYmICRidXR0b24ubGVuZ3RoICYmICRidXR0b24uYXR0cignbmFtZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHREYXRhICs9ICcmJyArICRidXR0b24uYXR0cignbmFtZScpICsgJz0nICsgJGJ1dHRvbi5hdHRyKCd2YWx1ZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGRhdGEuc2V0dGluZ3MudmFsaWRhdGlvblVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICRmb3JtLmF0dHIoJ21ldGhvZCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogJGZvcm0uc2VyaWFsaXplKCkgKyBleHREYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IGRhdGEuc2V0dGluZ3MuYWpheERhdGFUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uIChqcVhIUiwgdGV4dFN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnRyaWdnZXIoZXZlbnRzLmFqYXhDb21wbGV0ZSwgW2pxWEhSLCB0ZXh0U3RhdHVzXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24gKGpxWEhSLCBzZXR0aW5ncykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLnRyaWdnZXIoZXZlbnRzLmFqYXhCZWZvcmVTZW5kLCBbanFYSFIsIHNldHRpbmdzXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKG1zZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobXNncyAhPT0gbnVsbCAmJiB0eXBlb2YgbXNncyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGRhdGEuYXR0cmlidXRlcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmVuYWJsZUFqYXhWYWxpZGF0aW9uIHx8IHRoaXMuY2FuY2VsbGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG1zZ3NbdGhpcy5pZF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVJbnB1dHMoJGZvcm0sICQuZXh0ZW5kKG1lc3NhZ2VzLCBtc2dzKSwgc3VibWl0dGluZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlSW5wdXRzKCRmb3JtLCBtZXNzYWdlcywgc3VibWl0dGluZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5zdWJtaXR0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VibWl0RmluYWxpemUoJGZvcm0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEuc3VibWl0dGluZykge1xuICAgICAgICAgICAgICAgICAgICAvLyBkZWxheSBjYWxsYmFjayBzbyB0aGF0IHRoZSBmb3JtIGNhbiBiZSBzdWJtaXR0ZWQgd2l0aG91dCBwcm9ibGVtXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlSW5wdXRzKCRmb3JtLCBtZXNzYWdlcywgc3VibWl0dGluZyk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlSW5wdXRzKCRmb3JtLCBtZXNzYWdlcywgc3VibWl0dGluZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgc3VibWl0Rm9ybTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRmb3JtID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBkYXRhID0gJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScpO1xuXG4gICAgICAgICAgICBpZiAoZGF0YS52YWxpZGF0ZWQpIHtcbiAgICAgICAgICAgICAgICAvLyBTZWNvbmQgc3VibWl0J3MgY2FsbCAoZnJvbSB2YWxpZGF0ZS91cGRhdGVJbnB1dHMpXG4gICAgICAgICAgICAgICAgZGF0YS5zdWJtaXR0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50ID0gJC5FdmVudChldmVudHMuYmVmb3JlU3VibWl0KTtcbiAgICAgICAgICAgICAgICAkZm9ybS50cmlnZ2VyKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQucmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhLnZhbGlkYXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzdWJtaXRGaW5hbGl6ZSgkZm9ybSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdXBkYXRlSGlkZGVuQnV0dG9uKCRmb3JtKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTsgICAvLyBjb250aW51ZSBzdWJtaXR0aW5nIHRoZSBmb3JtIHNpbmNlIHZhbGlkYXRpb24gcGFzc2VzXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEZpcnN0IHN1Ym1pdCdzIGNhbGwgKGZyb20geWlpLmpzL2hhbmRsZUFjdGlvbikgLSBleGVjdXRlIHZhbGlkYXRpbmdcbiAgICAgICAgICAgICAgICBzZXRTdWJtaXRGaW5hbGl6ZURlZmVyKCRmb3JtKTtcblxuICAgICAgICAgICAgICAgIGlmIChkYXRhLnNldHRpbmdzLnRpbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGRhdGEuc2V0dGluZ3MudGltZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkYXRhLnN1Ym1pdHRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIG1ldGhvZHMudmFsaWRhdGUuY2FsbCgkZm9ybSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHJlc2V0Rm9ybTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyICRmb3JtID0gJCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBkYXRhID0gJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScpO1xuICAgICAgICAgICAgLy8gQmVjYXVzZSB3ZSBiaW5kIGRpcmVjdGx5IHRvIGEgZm9ybSByZXNldCBldmVudCBpbnN0ZWFkIG9mIGEgcmVzZXQgYnV0dG9uICh0aGF0IG1heSBub3QgZXhpc3QpLFxuICAgICAgICAgICAgLy8gd2hlbiB0aGlzIGZ1bmN0aW9uIGlzIGV4ZWN1dGVkIGZvcm0gaW5wdXQgdmFsdWVzIGhhdmUgbm90IGJlZW4gcmVzZXQgeWV0LlxuICAgICAgICAgICAgLy8gVGhlcmVmb3JlIHdlIGRvIHRoZSBhY3R1YWwgcmVzZXQgd29yayB0aHJvdWdoIHNldFRpbWVvdXQuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkLmVhY2goZGF0YS5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFdpdGhvdXQgc2V0VGltZW91dCgpIHdlIHdvdWxkIGdldCB0aGUgaW5wdXQgdmFsdWVzIHRoYXQgYXJlIG5vdCByZXNldCB5ZXQuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBnZXRWYWx1ZSgkZm9ybSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRjb250YWluZXIgPSAkZm9ybS5maW5kKHRoaXMuY29udGFpbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5yZW1vdmVDbGFzcyhcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuc2V0dGluZ3MudmFsaWRhdGluZ0Nzc0NsYXNzICsgJyAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnNldHRpbmdzLmVycm9yQ3NzQ2xhc3MgKyAnICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuc2V0dGluZ3Muc3VjY2Vzc0Nzc0NsYXNzXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICRjb250YWluZXIuZmluZCh0aGlzLmVycm9yKS5odG1sKCcnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkZm9ybS5maW5kKGRhdGEuc2V0dGluZ3MuZXJyb3JTdW1tYXJ5KS5oaWRlKCkuZmluZCgndWwnKS5odG1sKCcnKTtcbiAgICAgICAgICAgIH0sIDEpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVcGRhdGVzIGVycm9yIG1lc3NhZ2VzLCBpbnB1dCBjb250YWluZXJzLCBhbmQgb3B0aW9uYWxseSBzdW1tYXJ5IGFzIHdlbGwuXG4gICAgICAgICAqIElmIGFuIGF0dHJpYnV0ZSBpcyBtaXNzaW5nIGZyb20gbWVzc2FnZXMsIGl0IGlzIGNvbnNpZGVyZWQgdmFsaWQuXG4gICAgICAgICAqIEBwYXJhbSBtZXNzYWdlcyBhcnJheSB0aGUgdmFsaWRhdGlvbiBlcnJvciBtZXNzYWdlcywgaW5kZXhlZCBieSBhdHRyaWJ1dGUgSURzXG4gICAgICAgICAqIEBwYXJhbSBzdW1tYXJ5IHdoZXRoZXIgdG8gdXBkYXRlIHN1bW1hcnkgYXMgd2VsbC5cbiAgICAgICAgICovXG4gICAgICAgIHVwZGF0ZU1lc3NhZ2VzOiBmdW5jdGlvbiAobWVzc2FnZXMsIHN1bW1hcnkpIHtcbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICQodGhpcyk7XG4gICAgICAgICAgICB2YXIgZGF0YSA9ICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKTtcbiAgICAgICAgICAgICQuZWFjaChkYXRhLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVJbnB1dCgkZm9ybSwgdGhpcywgbWVzc2FnZXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAoc3VtbWFyeSkge1xuICAgICAgICAgICAgICAgIHVwZGF0ZVN1bW1hcnkoJGZvcm0sIG1lc3NhZ2VzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlcyBlcnJvciBtZXNzYWdlcyBhbmQgaW5wdXQgY29udGFpbmVyIG9mIGEgc2luZ2xlIGF0dHJpYnV0ZS5cbiAgICAgICAgICogSWYgbWVzc2FnZXMgaXMgZW1wdHksIHRoZSBhdHRyaWJ1dGUgaXMgY29uc2lkZXJlZCB2YWxpZC5cbiAgICAgICAgICogQHBhcmFtIGlkIGF0dHJpYnV0ZSBJRFxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZXMgYXJyYXkgd2l0aCBlcnJvciBtZXNzYWdlc1xuICAgICAgICAgKi9cbiAgICAgICAgdXBkYXRlQXR0cmlidXRlOiBmdW5jdGlvbihpZCwgbWVzc2FnZXMpIHtcbiAgICAgICAgICAgIHZhciBhdHRyaWJ1dGUgPSBtZXRob2RzLmZpbmQuY2FsbCh0aGlzLCBpZCk7XG4gICAgICAgICAgICBpZiAoYXR0cmlidXRlICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHZhciBtc2cgPSB7fTtcbiAgICAgICAgICAgICAgICBtc2dbaWRdID0gbWVzc2FnZXM7XG4gICAgICAgICAgICAgICAgdXBkYXRlSW5wdXQoJCh0aGlzKSwgYXR0cmlidXRlLCBtc2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgdmFyIHdhdGNoQXR0cmlidXRlID0gZnVuY3Rpb24gKCRmb3JtLCBhdHRyaWJ1dGUpIHtcbiAgICAgICAgdmFyICRpbnB1dCA9IGZpbmRJbnB1dCgkZm9ybSwgYXR0cmlidXRlKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZS52YWxpZGF0ZU9uQ2hhbmdlKSB7XG4gICAgICAgICAgICAkaW5wdXQub24oJ2NoYW5nZS55aWlBY3RpdmVGb3JtJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhbGlkYXRlQXR0cmlidXRlKCRmb3JtLCBhdHRyaWJ1dGUsIGZhbHNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhdHRyaWJ1dGUudmFsaWRhdGVPbkJsdXIpIHtcbiAgICAgICAgICAgICRpbnB1dC5vbignYmx1ci55aWlBY3RpdmVGb3JtJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUuc3RhdHVzID09IDAgfHwgYXR0cmlidXRlLnN0YXR1cyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlQXR0cmlidXRlKCRmb3JtLCBhdHRyaWJ1dGUsIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhdHRyaWJ1dGUudmFsaWRhdGVPblR5cGUpIHtcbiAgICAgICAgICAgICRpbnB1dC5vbigna2V5dXAueWlpQWN0aXZlRm9ybScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQuaW5BcnJheShlLndoaWNoLCBbMTYsIDE3LCAxOCwgMzcsIDM4LCAzOSwgNDBdKSAhPT0gLTEgKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZS52YWx1ZSAhPT0gZ2V0VmFsdWUoJGZvcm0sIGF0dHJpYnV0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRhdGVBdHRyaWJ1dGUoJGZvcm0sIGF0dHJpYnV0ZSwgZmFsc2UsIGF0dHJpYnV0ZS52YWxpZGF0aW9uRGVsYXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciB1bndhdGNoQXR0cmlidXRlID0gZnVuY3Rpb24gKCRmb3JtLCBhdHRyaWJ1dGUpIHtcbiAgICAgICAgZmluZElucHV0KCRmb3JtLCBhdHRyaWJ1dGUpLm9mZignLnlpaUFjdGl2ZUZvcm0nKTtcbiAgICB9O1xuXG4gICAgdmFyIHZhbGlkYXRlQXR0cmlidXRlID0gZnVuY3Rpb24gKCRmb3JtLCBhdHRyaWJ1dGUsIGZvcmNlVmFsaWRhdGUsIHZhbGlkYXRpb25EZWxheSkge1xuICAgICAgICB2YXIgZGF0YSA9ICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKTtcblxuICAgICAgICBpZiAoZm9yY2VWYWxpZGF0ZSkge1xuICAgICAgICAgICAgYXR0cmlidXRlLnN0YXR1cyA9IDI7XG4gICAgICAgIH1cbiAgICAgICAgJC5lYWNoKGRhdGEuYXR0cmlidXRlcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgIT09IGdldFZhbHVlKCRmb3JtLCB0aGlzKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gMjtcbiAgICAgICAgICAgICAgICBmb3JjZVZhbGlkYXRlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghZm9yY2VWYWxpZGF0ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRhdGEuc2V0dGluZ3MudGltZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGRhdGEuc2V0dGluZ3MudGltZXIpO1xuICAgICAgICB9XG4gICAgICAgIGRhdGEuc2V0dGluZ3MudGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChkYXRhLnN1Ym1pdHRpbmcgfHwgJGZvcm0uaXMoJzpoaWRkZW4nKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQuZWFjaChkYXRhLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSAzO1xuICAgICAgICAgICAgICAgICAgICAkZm9ybS5maW5kKHRoaXMuY29udGFpbmVyKS5hZGRDbGFzcyhkYXRhLnNldHRpbmdzLnZhbGlkYXRpbmdDc3NDbGFzcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBtZXRob2RzLnZhbGlkYXRlLmNhbGwoJGZvcm0pO1xuICAgICAgICB9LCB2YWxpZGF0aW9uRGVsYXkgPyB2YWxpZGF0aW9uRGVsYXkgOiAyMDApO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IHByb3RvdHlwZSB3aXRoIGEgc2hvcnRjdXQgbWV0aG9kIGZvciBhZGRpbmcgYSBuZXcgZGVmZXJyZWQuXG4gICAgICogVGhlIGNvbnRleHQgb2YgdGhlIGNhbGxiYWNrIHdpbGwgYmUgdGhlIGRlZmVycmVkIG9iamVjdCBzbyBpdCBjYW4gYmUgcmVzb2x2ZWQgbGlrZSBgYGB0aGlzLnJlc29sdmUoKWBgYFxuICAgICAqIEByZXR1cm5zIEFycmF5XG4gICAgICovXG4gICAgdmFyIGRlZmVycmVkQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcnJheSA9IFtdO1xuICAgICAgICBhcnJheS5hZGQgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5wdXNoKG5ldyAkLkRlZmVycmVkKGNhbGxiYWNrKSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICB9O1xuXG4gICAgdmFyIGJ1dHRvbk9wdGlvbnMgPSBbJ2FjdGlvbicsICd0YXJnZXQnLCAnbWV0aG9kJywgJ2VuY3R5cGUnXTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgY3VycmVudCBmb3JtIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0gJGZvcm1cbiAgICAgKiBAcmV0dXJucyBvYmplY3QgT2JqZWN0IHdpdGggYnV0dG9uIG9mIGZvcm0gb3B0aW9uc1xuICAgICAqL1xuICAgIHZhciBnZXRGb3JtT3B0aW9ucyA9IGZ1bmN0aW9uICgkZm9ybSkge1xuICAgICAgICB2YXIgYXR0cmlidXRlcyA9IHt9O1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1dHRvbk9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXNbYnV0dG9uT3B0aW9uc1tpXV0gPSAkZm9ybS5hdHRyKGJ1dHRvbk9wdGlvbnNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhdHRyaWJ1dGVzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBcHBsaWVzIHRlbXBvcmFyeSBmb3JtIG9wdGlvbnMgcmVsYXRlZCB0byBzdWJtaXQgYnV0dG9uXG4gICAgICogQHBhcmFtICRmb3JtIHRoZSBmb3JtIGpRdWVyeSBvYmplY3RcbiAgICAgKiBAcGFyYW0gJGJ1dHRvbiB0aGUgYnV0dG9uIGpRdWVyeSBvYmplY3RcbiAgICAgKi9cbiAgICB2YXIgYXBwbHlCdXR0b25PcHRpb25zID0gZnVuY3Rpb24gKCRmb3JtLCAkYnV0dG9uKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnV0dG9uT3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gJGJ1dHRvbi5hdHRyKCdmb3JtJyArIGJ1dHRvbk9wdGlvbnNbaV0pO1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgJGZvcm0uYXR0cihidXR0b25PcHRpb25zW2ldLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVzdG9yZXMgb3JpZ2luYWwgZm9ybSBvcHRpb25zXG4gICAgICogQHBhcmFtICRmb3JtIHRoZSBmb3JtIGpRdWVyeSBvYmplY3RcbiAgICAgKi9cbiAgICB2YXIgcmVzdG9yZUJ1dHRvbk9wdGlvbnMgPSBmdW5jdGlvbiAoJGZvcm0pIHtcbiAgICAgICAgdmFyIGRhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBidXR0b25PcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAkZm9ybS5hdHRyKGJ1dHRvbk9wdGlvbnNbaV0sIGRhdGEub3B0aW9uc1tidXR0b25PcHRpb25zW2ldXSB8fCBudWxsKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBlcnJvciBtZXNzYWdlcyBhbmQgdGhlIGlucHV0IGNvbnRhaW5lcnMgZm9yIGFsbCBhcHBsaWNhYmxlIGF0dHJpYnV0ZXNcbiAgICAgKiBAcGFyYW0gJGZvcm0gdGhlIGZvcm0galF1ZXJ5IG9iamVjdFxuICAgICAqIEBwYXJhbSBtZXNzYWdlcyBhcnJheSB0aGUgdmFsaWRhdGlvbiBlcnJvciBtZXNzYWdlc1xuICAgICAqIEBwYXJhbSBzdWJtaXR0aW5nIHdoZXRoZXIgdGhpcyBtZXRob2QgaXMgY2FsbGVkIGFmdGVyIHZhbGlkYXRpb24gdHJpZ2dlcmVkIGJ5IGZvcm0gc3VibWlzc2lvblxuICAgICAqL1xuICAgIHZhciB1cGRhdGVJbnB1dHMgPSBmdW5jdGlvbiAoJGZvcm0sIG1lc3NhZ2VzLCBzdWJtaXR0aW5nKSB7XG4gICAgICAgIHZhciBkYXRhID0gJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScpO1xuXG4gICAgICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzdWJtaXR0aW5nKSB7XG4gICAgICAgICAgICB2YXIgZXJyb3JBdHRyaWJ1dGVzID0gW107XG4gICAgICAgICAgICAkLmVhY2goZGF0YS5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEkKHRoaXMuaW5wdXQpLmlzKFwiOmRpc2FibGVkXCIpICYmICF0aGlzLmNhbmNlbGxlZCAmJiB1cGRhdGVJbnB1dCgkZm9ybSwgdGhpcywgbWVzc2FnZXMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yQXR0cmlidXRlcy5wdXNoKHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkZm9ybS50cmlnZ2VyKGV2ZW50cy5hZnRlclZhbGlkYXRlLCBbbWVzc2FnZXMsIGVycm9yQXR0cmlidXRlc10pO1xuXG4gICAgICAgICAgICB1cGRhdGVTdW1tYXJ5KCRmb3JtLCBtZXNzYWdlcyk7XG5cbiAgICAgICAgICAgIGlmIChlcnJvckF0dHJpYnV0ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuc2V0dGluZ3Muc2Nyb2xsVG9FcnJvcikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG9wID0gJGZvcm0uZmluZCgkLm1hcChlcnJvckF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGF0dHJpYnV0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF0dHJpYnV0ZS5pbnB1dDtcbiAgICAgICAgICAgICAgICAgICAgfSkuam9pbignLCcpKS5maXJzdCgpLmNsb3Nlc3QoJzp2aXNpYmxlJykub2Zmc2V0KCkudG9wIC0gZGF0YS5zZXR0aW5ncy5zY3JvbGxUb0Vycm9yT2Zmc2V0O1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9wIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9wID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0b3AgPiAkKGRvY3VtZW50KS5oZWlnaHQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9wID0gJChkb2N1bWVudCkuaGVpZ2h0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHd0b3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0b3AgPCB3dG9wIHx8IHRvcCA+IHd0b3AgKyAkKHdpbmRvdykuaGVpZ2h0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQod2luZG93KS5zY3JvbGxUb3AodG9wKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkYXRhLnN1Ym1pdHRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGF0YS52YWxpZGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Ym1pdE9iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICBhcHBseUJ1dHRvbk9wdGlvbnMoJGZvcm0sIGRhdGEuc3VibWl0T2JqZWN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJGZvcm0uc3VibWl0KCk7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VibWl0T2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3RvcmVCdXR0b25PcHRpb25zKCRmb3JtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkLmVhY2goZGF0YS5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNhbmNlbGxlZCAmJiAodGhpcy5zdGF0dXMgPT09IDIgfHwgdGhpcy5zdGF0dXMgPT09IDMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUlucHV0KCRmb3JtLCB0aGlzLCBtZXNzYWdlcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc3VibWl0RmluYWxpemUoJGZvcm0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIGhpZGRlbiBmaWVsZCB0aGF0IHJlcHJlc2VudHMgY2xpY2tlZCBzdWJtaXQgYnV0dG9uLlxuICAgICAqIEBwYXJhbSAkZm9ybSB0aGUgZm9ybSBqUXVlcnkgb2JqZWN0LlxuICAgICAqL1xuICAgIHZhciB1cGRhdGVIaWRkZW5CdXR0b24gPSBmdW5jdGlvbiAoJGZvcm0pIHtcbiAgICAgICAgdmFyIGRhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyk7XG4gICAgICAgIHZhciAkYnV0dG9uID0gZGF0YS5zdWJtaXRPYmplY3QgfHwgJGZvcm0uZmluZCgnOnN1Ym1pdDpmaXJzdCcpO1xuICAgICAgICAvLyBUT0RPOiBpZiB0aGUgc3VibWlzc2lvbiBpcyBjYXVzZWQgYnkgXCJjaGFuZ2VcIiBldmVudCwgaXQgd2lsbCBub3Qgd29ya1xuICAgICAgICBpZiAoJGJ1dHRvbi5sZW5ndGggJiYgJGJ1dHRvbi5hdHRyKCd0eXBlJykgPT0gJ3N1Ym1pdCcgJiYgJGJ1dHRvbi5hdHRyKCduYW1lJykpIHtcbiAgICAgICAgICAgIC8vIHNpbXVsYXRlIGJ1dHRvbiBpbnB1dCB2YWx1ZVxuICAgICAgICAgICAgdmFyICRoaWRkZW5CdXR0b24gPSAkKCdpbnB1dFt0eXBlPVwiaGlkZGVuXCJdW25hbWU9XCInICsgJGJ1dHRvbi5hdHRyKCduYW1lJykgKyAnXCJdJywgJGZvcm0pO1xuICAgICAgICAgICAgaWYgKCEkaGlkZGVuQnV0dG9uLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICQoJzxpbnB1dD4nKS5hdHRyKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2hpZGRlbicsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICRidXR0b24uYXR0cignbmFtZScpLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJGJ1dHRvbi5hdHRyKCd2YWx1ZScpXG4gICAgICAgICAgICAgICAgfSkuYXBwZW5kVG8oJGZvcm0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkaGlkZGVuQnV0dG9uLmF0dHIoJ3ZhbHVlJywgJGJ1dHRvbi5hdHRyKCd2YWx1ZScpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBlcnJvciBtZXNzYWdlIGFuZCB0aGUgaW5wdXQgY29udGFpbmVyIGZvciBhIHBhcnRpY3VsYXIgYXR0cmlidXRlLlxuICAgICAqIEBwYXJhbSAkZm9ybSB0aGUgZm9ybSBqUXVlcnkgb2JqZWN0XG4gICAgICogQHBhcmFtIGF0dHJpYnV0ZSBvYmplY3QgdGhlIGNvbmZpZ3VyYXRpb24gZm9yIGEgcGFydGljdWxhciBhdHRyaWJ1dGUuXG4gICAgICogQHBhcmFtIG1lc3NhZ2VzIGFycmF5IHRoZSB2YWxpZGF0aW9uIGVycm9yIG1lc3NhZ2VzXG4gICAgICogQHJldHVybiBib29sZWFuIHdoZXRoZXIgdGhlcmUgaXMgYSB2YWxpZGF0aW9uIGVycm9yIGZvciB0aGUgc3BlY2lmaWVkIGF0dHJpYnV0ZVxuICAgICAqL1xuICAgIHZhciB1cGRhdGVJbnB1dCA9IGZ1bmN0aW9uICgkZm9ybSwgYXR0cmlidXRlLCBtZXNzYWdlcykge1xuICAgICAgICB2YXIgZGF0YSA9ICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKSxcbiAgICAgICAgICAgICRpbnB1dCA9IGZpbmRJbnB1dCgkZm9ybSwgYXR0cmlidXRlKSxcbiAgICAgICAgICAgIGhhc0Vycm9yID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKCEkLmlzQXJyYXkobWVzc2FnZXNbYXR0cmlidXRlLmlkXSkpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzW2F0dHJpYnV0ZS5pZF0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICAkZm9ybS50cmlnZ2VyKGV2ZW50cy5hZnRlclZhbGlkYXRlQXR0cmlidXRlLCBbYXR0cmlidXRlLCBtZXNzYWdlc1thdHRyaWJ1dGUuaWRdXSk7XG5cbiAgICAgICAgYXR0cmlidXRlLnN0YXR1cyA9IDE7XG4gICAgICAgIGlmICgkaW5wdXQubGVuZ3RoKSB7XG4gICAgICAgICAgICBoYXNFcnJvciA9IG1lc3NhZ2VzW2F0dHJpYnV0ZS5pZF0ubGVuZ3RoID4gMDtcbiAgICAgICAgICAgIHZhciAkY29udGFpbmVyID0gJGZvcm0uZmluZChhdHRyaWJ1dGUuY29udGFpbmVyKTtcbiAgICAgICAgICAgIHZhciAkZXJyb3IgPSAkY29udGFpbmVyLmZpbmQoYXR0cmlidXRlLmVycm9yKTtcbiAgICAgICAgICAgIHVwZGF0ZUFyaWFJbnZhbGlkKCRmb3JtLCBhdHRyaWJ1dGUsIGhhc0Vycm9yKTtcbiAgICAgICAgICAgIGlmIChoYXNFcnJvcikge1xuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUuZW5jb2RlRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgJGVycm9yLnRleHQobWVzc2FnZXNbYXR0cmlidXRlLmlkXVswXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJGVycm9yLmh0bWwobWVzc2FnZXNbYXR0cmlidXRlLmlkXVswXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRjb250YWluZXIucmVtb3ZlQ2xhc3MoZGF0YS5zZXR0aW5ncy52YWxpZGF0aW5nQ3NzQ2xhc3MgKyAnICcgKyBkYXRhLnNldHRpbmdzLnN1Y2Nlc3NDc3NDbGFzcylcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKGRhdGEuc2V0dGluZ3MuZXJyb3JDc3NDbGFzcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRlcnJvci5lbXB0eSgpO1xuICAgICAgICAgICAgICAgICRjb250YWluZXIucmVtb3ZlQ2xhc3MoZGF0YS5zZXR0aW5ncy52YWxpZGF0aW5nQ3NzQ2xhc3MgKyAnICcgKyBkYXRhLnNldHRpbmdzLmVycm9yQ3NzQ2xhc3MgKyAnICcpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhkYXRhLnNldHRpbmdzLnN1Y2Nlc3NDc3NDbGFzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhdHRyaWJ1dGUudmFsdWUgPSBnZXRWYWx1ZSgkZm9ybSwgYXR0cmlidXRlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFzRXJyb3I7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZXMgdGhlIGVycm9yIHN1bW1hcnkuXG4gICAgICogQHBhcmFtICRmb3JtIHRoZSBmb3JtIGpRdWVyeSBvYmplY3RcbiAgICAgKiBAcGFyYW0gbWVzc2FnZXMgYXJyYXkgdGhlIHZhbGlkYXRpb24gZXJyb3IgbWVzc2FnZXNcbiAgICAgKi9cbiAgICB2YXIgdXBkYXRlU3VtbWFyeSA9IGZ1bmN0aW9uICgkZm9ybSwgbWVzc2FnZXMpIHtcbiAgICAgICAgdmFyIGRhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyksXG4gICAgICAgICAgICAkc3VtbWFyeSA9ICRmb3JtLmZpbmQoZGF0YS5zZXR0aW5ncy5lcnJvclN1bW1hcnkpLFxuICAgICAgICAgICAgJHVsID0gJHN1bW1hcnkuZmluZCgndWwnKS5lbXB0eSgpO1xuXG4gICAgICAgIGlmICgkc3VtbWFyeS5sZW5ndGggJiYgbWVzc2FnZXMpIHtcbiAgICAgICAgICAgICQuZWFjaChkYXRhLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoJC5pc0FycmF5KG1lc3NhZ2VzW3RoaXMuaWRdKSAmJiBtZXNzYWdlc1t0aGlzLmlkXS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0gJCgnPGxpLz4nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc2V0dGluZ3MuZW5jb2RlRXJyb3JTdW1tYXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvci50ZXh0KG1lc3NhZ2VzW3RoaXMuaWRdWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yLmh0bWwobWVzc2FnZXNbdGhpcy5pZF1bMF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICR1bC5hcHBlbmQoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHN1bW1hcnkudG9nZ2xlKCR1bC5maW5kKCdsaScpLmxlbmd0aCA+IDApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBnZXRWYWx1ZSA9IGZ1bmN0aW9uICgkZm9ybSwgYXR0cmlidXRlKSB7XG4gICAgICAgIHZhciAkaW5wdXQgPSBmaW5kSW5wdXQoJGZvcm0sIGF0dHJpYnV0ZSk7XG4gICAgICAgIHZhciB0eXBlID0gJGlucHV0LmF0dHIoJ3R5cGUnKTtcbiAgICAgICAgaWYgKHR5cGUgPT09ICdjaGVja2JveCcgfHwgdHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgICAgICAgdmFyICRyZWFsSW5wdXQgPSAkaW5wdXQuZmlsdGVyKCc6Y2hlY2tlZCcpO1xuICAgICAgICAgICAgaWYgKCEkcmVhbElucHV0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICRyZWFsSW5wdXQgPSAkZm9ybS5maW5kKCdpbnB1dFt0eXBlPWhpZGRlbl1bbmFtZT1cIicgKyAkaW5wdXQuYXR0cignbmFtZScpICsgJ1wiXScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICRyZWFsSW5wdXQudmFsKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJGlucHV0LnZhbCgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBmaW5kSW5wdXQgPSBmdW5jdGlvbiAoJGZvcm0sIGF0dHJpYnV0ZSkge1xuICAgICAgICB2YXIgJGlucHV0ID0gJGZvcm0uZmluZChhdHRyaWJ1dGUuaW5wdXQpO1xuICAgICAgICBpZiAoJGlucHV0Lmxlbmd0aCAmJiAkaW5wdXRbMF0udGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnZGl2Jykge1xuICAgICAgICAgICAgLy8gY2hlY2tib3ggbGlzdCBvciByYWRpbyBsaXN0XG4gICAgICAgICAgICByZXR1cm4gJGlucHV0LmZpbmQoJ2lucHV0Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gJGlucHV0O1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciB1cGRhdGVBcmlhSW52YWxpZCA9IGZ1bmN0aW9uICgkZm9ybSwgYXR0cmlidXRlLCBoYXNFcnJvcikge1xuICAgICAgICBpZiAoYXR0cmlidXRlLnVwZGF0ZUFyaWFJbnZhbGlkKSB7XG4gICAgICAgICAgICAkZm9ybS5maW5kKGF0dHJpYnV0ZS5pbnB1dCkuYXR0cignYXJpYS1pbnZhbGlkJywgaGFzRXJyb3IgPyAndHJ1ZScgOiAnZmFsc2UnKTtcbiAgICAgICAgfVxuICAgIH1cbn0pKHdpbmRvdy5qUXVlcnkpO1xuIiwiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUubG9nKCdyZWFkeScpO1xufSk7XG4iXX0=
