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

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function textCounter(field,field2,maxlimit)
{
 var countfield = document.getElementById(field2);
 if ( field.value.length > maxlimit ) {
  field.value = field.value.substring( 0, maxlimit );
  return false;
 } else {
  countfield.value = maxlimit - field.value.length;
 }
}
$(document).ready(function () {
    console.log('ready');
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInlpaS5qcyIsInlpaS52YWxpZGF0aW9uLmpzIiwieWlpLmFjdGl2ZUZvcm0uanMiLCJjYXNlLXNtcy5qcyIsImFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbGdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbHhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogWWlpIEphdmFTY3JpcHQgbW9kdWxlLlxuICpcbiAqIEBsaW5rIGh0dHA6Ly93d3cueWlpZnJhbWV3b3JrLmNvbS9cbiAqIEBjb3B5cmlnaHQgQ29weXJpZ2h0IChjKSAyMDA4IFlpaSBTb2Z0d2FyZSBMTENcbiAqIEBsaWNlbnNlIGh0dHA6Ly93d3cueWlpZnJhbWV3b3JrLmNvbS9saWNlbnNlL1xuICogQGF1dGhvciBRaWFuZyBYdWUgPHFpYW5nLnh1ZUBnbWFpbC5jb20+XG4gKiBAc2luY2UgMi4wXG4gKi9cblxuLyoqXG4gKiB5aWkgaXMgdGhlIHJvb3QgbW9kdWxlIGZvciBhbGwgWWlpIEphdmFTY3JpcHQgbW9kdWxlcy5cbiAqIEl0IGltcGxlbWVudHMgYSBtZWNoYW5pc20gb2Ygb3JnYW5pemluZyBKYXZhU2NyaXB0IGNvZGUgaW4gbW9kdWxlcyB0aHJvdWdoIHRoZSBmdW5jdGlvbiBcInlpaS5pbml0TW9kdWxlKClcIi5cbiAqXG4gKiBFYWNoIG1vZHVsZSBzaG91bGQgYmUgbmFtZWQgYXMgXCJ4LnkuelwiLCB3aGVyZSBcInhcIiBzdGFuZHMgZm9yIHRoZSByb290IG1vZHVsZSAoZm9yIHRoZSBZaWkgY29yZSBjb2RlLCB0aGlzIGlzIFwieWlpXCIpLlxuICpcbiAqIEEgbW9kdWxlIG1heSBiZSBzdHJ1Y3R1cmVkIGFzIGZvbGxvd3M6XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogd2luZG93LnlpaS5zYW1wbGUgPSAoZnVuY3Rpb24oJCkge1xuICogICAgIHZhciBwdWIgPSB7XG4gKiAgICAgICAgIC8vIHdoZXRoZXIgdGhpcyBtb2R1bGUgaXMgY3VycmVudGx5IGFjdGl2ZS4gSWYgZmFsc2UsIGluaXQoKSB3aWxsIG5vdCBiZSBjYWxsZWQgZm9yIHRoaXMgbW9kdWxlXG4gKiAgICAgICAgIC8vIGl0IHdpbGwgYWxzbyBub3QgYmUgY2FsbGVkIGZvciBhbGwgaXRzIGNoaWxkIG1vZHVsZXMuIElmIHRoaXMgcHJvcGVydHkgaXMgdW5kZWZpbmVkLCBpdCBtZWFucyB0cnVlLlxuICogICAgICAgICBpc0FjdGl2ZTogdHJ1ZSxcbiAqICAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gKiAgICAgICAgICAgICAvLyAuLi4gbW9kdWxlIGluaXRpYWxpemF0aW9uIGNvZGUgZ29lcyBoZXJlIC4uLlxuICogICAgICAgICB9LFxuICpcbiAqICAgICAgICAgLy8gLi4uIG90aGVyIHB1YmxpYyBmdW5jdGlvbnMgYW5kIHByb3BlcnRpZXMgZ28gaGVyZSAuLi5cbiAqICAgICB9O1xuICpcbiAqICAgICAvLyAuLi4gcHJpdmF0ZSBmdW5jdGlvbnMgYW5kIHByb3BlcnRpZXMgZ28gaGVyZSAuLi5cbiAqXG4gKiAgICAgcmV0dXJuIHB1YjtcbiAqIH0pKHdpbmRvdy5qUXVlcnkpO1xuICogYGBgXG4gKlxuICogVXNpbmcgdGhpcyBzdHJ1Y3R1cmUsIHlvdSBjYW4gZGVmaW5lIHB1YmxpYyBhbmQgcHJpdmF0ZSBmdW5jdGlvbnMvcHJvcGVydGllcyBmb3IgYSBtb2R1bGUuXG4gKiBQcml2YXRlIGZ1bmN0aW9ucy9wcm9wZXJ0aWVzIGFyZSBvbmx5IHZpc2libGUgd2l0aGluIHRoZSBtb2R1bGUsIHdoaWxlIHB1YmxpYyBmdW5jdGlvbnMvcHJvcGVydGllc1xuICogbWF5IGJlIGFjY2Vzc2VkIG91dHNpZGUgb2YgdGhlIG1vZHVsZS4gRm9yIGV4YW1wbGUsIHlvdSBjYW4gYWNjZXNzIFwieWlpLnNhbXBsZS5pc0FjdGl2ZVwiLlxuICpcbiAqIFlvdSBtdXN0IGNhbGwgXCJ5aWkuaW5pdE1vZHVsZSgpXCIgb25jZSBmb3IgdGhlIHJvb3QgbW9kdWxlIG9mIGFsbCB5b3VyIG1vZHVsZXMuXG4gKi9cbndpbmRvdy55aWkgPSAoZnVuY3Rpb24gKCQpIHtcbiAgICB2YXIgcHViID0ge1xuICAgICAgICAvKipcbiAgICAgICAgICogTGlzdCBvZiBKUyBvciBDU1MgVVJMcyB0aGF0IGNhbiBiZSBsb2FkZWQgbXVsdGlwbGUgdGltZXMgdmlhIEFKQVggcmVxdWVzdHMuXG4gICAgICAgICAqIEVhY2ggaXRlbSBtYXkgYmUgcmVwcmVzZW50ZWQgYXMgZWl0aGVyIGFuIGFic29sdXRlIFVSTCBvciBhIHJlbGF0aXZlIG9uZS5cbiAgICAgICAgICogRWFjaCBpdGVtIG1heSBjb250YWluIGEgd2lsZGNhcmQgbWF0Y2hpbmcgY2hhcmFjdGVyIGAqYCwgdGhhdCBtZWFucyBvbmUgb3IgbW9yZVxuICAgICAgICAgKiBhbnkgY2hhcmFjdGVycyBvbiB0aGUgcG9zaXRpb24uIEZvciBleGFtcGxlOlxuICAgICAgICAgKiAgLSBgL2Nzcy8qLmNzc2Agd2lsbCBtYXRjaCBhbnkgZmlsZSBlbmRpbmcgd2l0aCBgLmNzc2AgaW4gdGhlIGBjc3NgIGRpcmVjdG9yeSBvZiB0aGUgY3VycmVudCB3ZWIgc2l0ZVxuICAgICAgICAgKiAgLSBgaHR0cCo6Ly9jZG4uZXhhbXBsZS5jb20vKmAgd2lsbCBtYXRjaCBhbnkgZmlsZXMgb24gZG9tYWluIGBjZG4uZXhhbXBsZS5jb21gLCBsb2FkZWQgd2l0aCBIVFRQIG9yIEhUVFBTXG4gICAgICAgICAqICAtIGAvanMvbXlDdXN0b21TY3JpcHQuanM/cmVhbG09KmAgd2lsbCBtYXRjaCBmaWxlIGAvanMvbXlDdXN0b21TY3JpcHQuanNgIHdpdGggZGVmaW5lZCBgcmVhbG1gIHBhcmFtZXRlclxuICAgICAgICAgKi9cbiAgICAgICAgcmVsb2FkYWJsZVNjcmlwdHM6IFtdLFxuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHNlbGVjdG9yIGZvciBjbGlja2FibGUgZWxlbWVudHMgdGhhdCBuZWVkIHRvIHN1cHBvcnQgY29uZmlybWF0aW9uIGFuZCBmb3JtIHN1Ym1pc3Npb24uXG4gICAgICAgICAqL1xuICAgICAgICBjbGlja2FibGVTZWxlY3RvcjogJ2EsIGJ1dHRvbiwgaW5wdXRbdHlwZT1cInN1Ym1pdFwiXSwgaW5wdXRbdHlwZT1cImJ1dHRvblwiXSwgaW5wdXRbdHlwZT1cInJlc2V0XCJdLCAnICtcbiAgICAgICAgJ2lucHV0W3R5cGU9XCJpbWFnZVwiXScsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgc2VsZWN0b3IgZm9yIGNoYW5nZWFibGUgZWxlbWVudHMgdGhhdCBuZWVkIHRvIHN1cHBvcnQgY29uZmlybWF0aW9uIGFuZCBmb3JtIHN1Ym1pc3Npb24uXG4gICAgICAgICAqL1xuICAgICAgICBjaGFuZ2VhYmxlU2VsZWN0b3I6ICdzZWxlY3QsIGlucHV0LCB0ZXh0YXJlYScsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEByZXR1cm4gc3RyaW5nfHVuZGVmaW5lZCB0aGUgQ1NSRiBwYXJhbWV0ZXIgbmFtZS4gVW5kZWZpbmVkIGlzIHJldHVybmVkIGlmIENTUkYgdmFsaWRhdGlvbiBpcyBub3QgZW5hYmxlZC5cbiAgICAgICAgICovXG4gICAgICAgIGdldENzcmZQYXJhbTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICQoJ21ldGFbbmFtZT1jc3JmLXBhcmFtXScpLmF0dHIoJ2NvbnRlbnQnKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHJldHVybiBzdHJpbmd8dW5kZWZpbmVkIHRoZSBDU1JGIHRva2VuLiBVbmRlZmluZWQgaXMgcmV0dXJuZWQgaWYgQ1NSRiB2YWxpZGF0aW9uIGlzIG5vdCBlbmFibGVkLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0Q3NyZlRva2VuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJCgnbWV0YVtuYW1lPWNzcmYtdG9rZW5dJykuYXR0cignY29udGVudCcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTZXRzIHRoZSBDU1JGIHRva2VuIGluIHRoZSBtZXRhIGVsZW1lbnRzLlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCBpcyBwcm92aWRlZCBzbyB0aGF0IHlvdSBjYW4gdXBkYXRlIHRoZSBDU1JGIHRva2VuIHdpdGggdGhlIGxhdGVzdCBvbmUgeW91IG9idGFpbiBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAgICAgICAqIEBwYXJhbSBuYW1lIHRoZSBDU1JGIHRva2VuIG5hbWVcbiAgICAgICAgICogQHBhcmFtIHZhbHVlIHRoZSBDU1JGIHRva2VuIHZhbHVlXG4gICAgICAgICAqL1xuICAgICAgICBzZXRDc3JmVG9rZW46IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgJCgnbWV0YVtuYW1lPWNzcmYtcGFyYW1dJykuYXR0cignY29udGVudCcsIG5hbWUpO1xuICAgICAgICAgICAgJCgnbWV0YVtuYW1lPWNzcmYtdG9rZW5dJykuYXR0cignY29udGVudCcsIHZhbHVlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlcyBhbGwgZm9ybSBDU1JGIGlucHV0IGZpZWxkcyB3aXRoIHRoZSBsYXRlc3QgQ1NSRiB0b2tlbi5cbiAgICAgICAgICogVGhpcyBtZXRob2QgaXMgcHJvdmlkZWQgdG8gYXZvaWQgY2FjaGVkIGZvcm1zIGNvbnRhaW5pbmcgb3V0ZGF0ZWQgQ1NSRiB0b2tlbnMuXG4gICAgICAgICAqL1xuICAgICAgICByZWZyZXNoQ3NyZlRva2VuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdG9rZW4gPSBwdWIuZ2V0Q3NyZlRva2VuKCk7XG4gICAgICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICAkKCdmb3JtIGlucHV0W25hbWU9XCInICsgcHViLmdldENzcmZQYXJhbSgpICsgJ1wiXScpLnZhbCh0b2tlbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERpc3BsYXlzIGEgY29uZmlybWF0aW9uIGRpYWxvZy5cbiAgICAgICAgICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gc2ltcGx5IGRpc3BsYXlzIGEganMgY29uZmlybWF0aW9uIGRpYWxvZy5cbiAgICAgICAgICogWW91IG1heSBvdmVycmlkZSB0aGlzIGJ5IHNldHRpbmcgYHlpaS5jb25maXJtYC5cbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2UgdGhlIGNvbmZpcm1hdGlvbiBtZXNzYWdlLlxuICAgICAgICAgKiBAcGFyYW0gb2sgYSBjYWxsYmFjayB0byBiZSBjYWxsZWQgd2hlbiB0aGUgdXNlciBjb25maXJtcyB0aGUgbWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0gY2FuY2VsIGEgY2FsbGJhY2sgdG8gYmUgY2FsbGVkIHdoZW4gdGhlIHVzZXIgY2FuY2VscyB0aGUgY29uZmlybWF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICBjb25maXJtOiBmdW5jdGlvbiAobWVzc2FnZSwgb2ssIGNhbmNlbCkge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5jb25maXJtKG1lc3NhZ2UpKSB7XG4gICAgICAgICAgICAgICAgIW9rIHx8IG9rKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICFjYW5jZWwgfHwgY2FuY2VsKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEhhbmRsZXMgdGhlIGFjdGlvbiB0cmlnZ2VyZWQgYnkgdXNlci5cbiAgICAgICAgICogVGhpcyBtZXRob2QgcmVjb2duaXplcyB0aGUgYGRhdGEtbWV0aG9kYCBhdHRyaWJ1dGUgb2YgdGhlIGVsZW1lbnQuIElmIHRoZSBhdHRyaWJ1dGUgZXhpc3RzLFxuICAgICAgICAgKiB0aGUgbWV0aG9kIHdpbGwgc3VibWl0IHRoZSBmb3JtIGNvbnRhaW5pbmcgdGhpcyBlbGVtZW50LiBJZiB0aGVyZSBpcyBubyBjb250YWluaW5nIGZvcm0sIGEgZm9ybVxuICAgICAgICAgKiB3aWxsIGJlIGNyZWF0ZWQgYW5kIHN1Ym1pdHRlZCB1c2luZyB0aGUgbWV0aG9kIGdpdmVuIGJ5IHRoaXMgYXR0cmlidXRlIHZhbHVlIChlLmcuIFwicG9zdFwiLCBcInB1dFwiKS5cbiAgICAgICAgICogRm9yIGh5cGVybGlua3MsIHRoZSBmb3JtIGFjdGlvbiB3aWxsIHRha2UgdGhlIHZhbHVlIG9mIHRoZSBcImhyZWZcIiBhdHRyaWJ1dGUgb2YgdGhlIGxpbmsuXG4gICAgICAgICAqIEZvciBvdGhlciBlbGVtZW50cywgZWl0aGVyIHRoZSBjb250YWluaW5nIGZvcm0gYWN0aW9uIG9yIHRoZSBjdXJyZW50IHBhZ2UgVVJMIHdpbGwgYmUgdXNlZFxuICAgICAgICAgKiBhcyB0aGUgZm9ybSBhY3Rpb24gVVJMLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJZiB0aGUgYGRhdGEtbWV0aG9kYCBhdHRyaWJ1dGUgaXMgbm90IGRlZmluZWQsIHRoZSBgaHJlZmAgYXR0cmlidXRlIChpZiBhbnkpIG9mIHRoZSBlbGVtZW50XG4gICAgICAgICAqIHdpbGwgYmUgYXNzaWduZWQgdG8gYHdpbmRvdy5sb2NhdGlvbmAuXG4gICAgICAgICAqXG4gICAgICAgICAqIFN0YXJ0aW5nIGZyb20gdmVyc2lvbiAyLjAuMywgdGhlIGBkYXRhLXBhcmFtc2AgYXR0cmlidXRlIGlzIGFsc28gcmVjb2duaXplZCB3aGVuIHlvdSBzcGVjaWZ5XG4gICAgICAgICAqIGBkYXRhLW1ldGhvZGAuIFRoZSB2YWx1ZSBvZiBgZGF0YS1wYXJhbXNgIHNob3VsZCBiZSBhIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIGRhdGEgKG5hbWUtdmFsdWUgcGFpcnMpXG4gICAgICAgICAqIHRoYXQgc2hvdWxkIGJlIHN1Ym1pdHRlZCBhcyBoaWRkZW4gaW5wdXRzLiBGb3IgZXhhbXBsZSwgeW91IG1heSB1c2UgdGhlIGZvbGxvd2luZyBjb2RlIHRvIGdlbmVyYXRlXG4gICAgICAgICAqIHN1Y2ggYSBsaW5rOlxuICAgICAgICAgKlxuICAgICAgICAgKiBgYGBwaHBcbiAgICAgICAgICogdXNlIHlpaVxcaGVscGVyc1xcSHRtbDtcbiAgICAgICAgICogdXNlIHlpaVxcaGVscGVyc1xcSnNvbjtcbiAgICAgICAgICpcbiAgICAgICAgICogZWNobyBIdG1sOjphKCdzdWJtaXQnLCBbJ3NpdGUvZm9vYmFyJ10sIFtcbiAgICAgICAgICogICAgICdkYXRhJyA9PiBbXG4gICAgICAgICAqICAgICAgICAgJ21ldGhvZCcgPT4gJ3Bvc3QnLFxuICAgICAgICAgKiAgICAgICAgICdwYXJhbXMnID0+IFtcbiAgICAgICAgICogICAgICAgICAgICAgJ25hbWUxJyA9PiAndmFsdWUxJyxcbiAgICAgICAgICogICAgICAgICAgICAgJ25hbWUyJyA9PiAndmFsdWUyJyxcbiAgICAgICAgICogICAgICAgICBdLFxuICAgICAgICAgKiAgICAgXSxcbiAgICAgICAgICogXSk7XG4gICAgICAgICAqIGBgYFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gJGUgdGhlIGpRdWVyeSByZXByZXNlbnRhdGlvbiBvZiB0aGUgZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQgUmVsYXRlZCBldmVudFxuICAgICAgICAgKi9cbiAgICAgICAgaGFuZGxlQWN0aW9uOiBmdW5jdGlvbiAoJGUsIGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgJGZvcm0gPSAkZS5hdHRyKCdkYXRhLWZvcm0nKSA/ICQoJyMnICsgJGUuYXR0cignZGF0YS1mb3JtJykpIDogJGUuY2xvc2VzdCgnZm9ybScpLFxuICAgICAgICAgICAgICAgIG1ldGhvZCA9ICEkZS5kYXRhKCdtZXRob2QnKSAmJiAkZm9ybSA/ICRmb3JtLmF0dHIoJ21ldGhvZCcpIDogJGUuZGF0YSgnbWV0aG9kJyksXG4gICAgICAgICAgICAgICAgYWN0aW9uID0gJGUuYXR0cignaHJlZicpLFxuICAgICAgICAgICAgICAgIGlzVmFsaWRBY3Rpb24gPSBhY3Rpb24gJiYgYWN0aW9uICE9PSAnIycsXG4gICAgICAgICAgICAgICAgcGFyYW1zID0gJGUuZGF0YSgncGFyYW1zJyksXG4gICAgICAgICAgICAgICAgYXJlVmFsaWRQYXJhbXMgPSBwYXJhbXMgJiYgJC5pc1BsYWluT2JqZWN0KHBhcmFtcyksXG4gICAgICAgICAgICAgICAgcGpheCA9ICRlLmRhdGEoJ3BqYXgnKSxcbiAgICAgICAgICAgICAgICB1c2VQamF4ID0gcGpheCAhPT0gdW5kZWZpbmVkICYmIHBqYXggIT09IDAgJiYgJC5zdXBwb3J0LnBqYXgsXG4gICAgICAgICAgICAgICAgcGpheENvbnRhaW5lcixcbiAgICAgICAgICAgICAgICBwamF4T3B0aW9ucyA9IHt9O1xuXG4gICAgICAgICAgICBpZiAodXNlUGpheCkge1xuICAgICAgICAgICAgICAgIHBqYXhDb250YWluZXIgPSAkZS5kYXRhKCdwamF4LWNvbnRhaW5lcicpIHx8ICRlLmNsb3Nlc3QoJ1tkYXRhLXBqYXgtY29udGFpbmVyXScpO1xuICAgICAgICAgICAgICAgIGlmICghcGpheENvbnRhaW5lci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcGpheENvbnRhaW5lciA9ICQoJ2JvZHknKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGpheE9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcjogcGpheENvbnRhaW5lcixcbiAgICAgICAgICAgICAgICAgICAgcHVzaDogISEkZS5kYXRhKCdwamF4LXB1c2gtc3RhdGUnKSxcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZTogISEkZS5kYXRhKCdwamF4LXJlcGxhY2Utc3RhdGUnKSxcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG86ICRlLmRhdGEoJ3BqYXgtc2Nyb2xsdG8nKSxcbiAgICAgICAgICAgICAgICAgICAgcHVzaFJlZGlyZWN0OiAkZS5kYXRhKCdwamF4LXB1c2gtcmVkaXJlY3QnKSxcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZVJlZGlyZWN0OiAkZS5kYXRhKCdwamF4LXJlcGxhY2UtcmVkaXJlY3QnKSxcbiAgICAgICAgICAgICAgICAgICAgc2tpcE91dGVyQ29udGFpbmVyczogJGUuZGF0YSgncGpheC1za2lwLW91dGVyLWNvbnRhaW5lcnMnKSxcbiAgICAgICAgICAgICAgICAgICAgdGltZW91dDogJGUuZGF0YSgncGpheC10aW1lb3V0JyksXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFRhcmdldDogJGVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNWYWxpZEFjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB1c2VQamF4ID8gJC5wamF4LmNsaWNrKGV2ZW50LCBwamF4T3B0aW9ucykgOiB3aW5kb3cubG9jYXRpb24uYXNzaWduKGFjdGlvbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkZS5pcygnOnN1Ym1pdCcpICYmICRmb3JtLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodXNlUGpheCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0ub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5wamF4LnN1Ym1pdChlLCBwamF4T3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkZm9ybS50cmlnZ2VyKCdzdWJtaXQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgb2xkTWV0aG9kLFxuICAgICAgICAgICAgICAgIG9sZEFjdGlvbixcbiAgICAgICAgICAgICAgICBuZXdGb3JtID0gISRmb3JtLmxlbmd0aDtcbiAgICAgICAgICAgIGlmICghbmV3Rm9ybSkge1xuICAgICAgICAgICAgICAgIG9sZE1ldGhvZCA9ICRmb3JtLmF0dHIoJ21ldGhvZCcpO1xuICAgICAgICAgICAgICAgICRmb3JtLmF0dHIoJ21ldGhvZCcsIG1ldGhvZCk7XG4gICAgICAgICAgICAgICAgaWYgKGlzVmFsaWRBY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgb2xkQWN0aW9uID0gJGZvcm0uYXR0cignYWN0aW9uJyk7XG4gICAgICAgICAgICAgICAgICAgICRmb3JtLmF0dHIoJ2FjdGlvbicsIGFjdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlzVmFsaWRBY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uID0gcHViLmdldEN1cnJlbnRVcmwoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJGZvcm0gPSAkKCc8Zm9ybS8+Jywge21ldGhvZDogbWV0aG9kLCBhY3Rpb246IGFjdGlvbn0pO1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkZS5hdHRyKCd0YXJnZXQnKTtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICRmb3JtLmF0dHIoJ3RhcmdldCcsIHRhcmdldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghLyhnZXR8cG9zdCkvaS50ZXN0KG1ldGhvZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0uYXBwZW5kKCQoJzxpbnB1dC8+Jywge25hbWU6ICdfbWV0aG9kJywgdmFsdWU6IG1ldGhvZCwgdHlwZTogJ2hpZGRlbid9KSk7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZCA9ICdwb3N0JztcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0uYXR0cignbWV0aG9kJywgbWV0aG9kKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKC9wb3N0L2kudGVzdChtZXRob2QpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjc3JmUGFyYW0gPSBwdWIuZ2V0Q3NyZlBhcmFtKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjc3JmUGFyYW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRmb3JtLmFwcGVuZCgkKCc8aW5wdXQvPicsIHtuYW1lOiBjc3JmUGFyYW0sIHZhbHVlOiBwdWIuZ2V0Q3NyZlRva2VuKCksIHR5cGU6ICdoaWRkZW4nfSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRmb3JtLmhpZGUoKS5hcHBlbmRUbygnYm9keScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYWN0aXZlRm9ybURhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyk7XG4gICAgICAgICAgICBpZiAoYWN0aXZlRm9ybURhdGEpIHtcbiAgICAgICAgICAgICAgICAvLyBSZW1lbWJlciB0aGUgZWxlbWVudCB0cmlnZ2VyZWQgdGhlIGZvcm0gc3VibWlzc2lvbi4gVGhpcyBpcyB1c2VkIGJ5IHlpaS5hY3RpdmVGb3JtLmpzLlxuICAgICAgICAgICAgICAgIGFjdGl2ZUZvcm1EYXRhLnN1Ym1pdE9iamVjdCA9ICRlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYXJlVmFsaWRQYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAkLmVhY2gocGFyYW1zLCBmdW5jdGlvbiAobmFtZSwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0uYXBwZW5kKCQoJzxpbnB1dC8+JykuYXR0cih7bmFtZTogbmFtZSwgdmFsdWU6IHZhbHVlLCB0eXBlOiAnaGlkZGVuJ30pKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHVzZVBqYXgpIHtcbiAgICAgICAgICAgICAgICAkZm9ybS5vbignc3VibWl0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgJC5wamF4LnN1Ym1pdChlLCBwamF4T3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRmb3JtLnRyaWdnZXIoJ3N1Ym1pdCcpO1xuXG4gICAgICAgICAgICAkLndoZW4oJGZvcm0uZGF0YSgneWlpU3VibWl0RmluYWxpemVQcm9taXNlJykpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmIChuZXdGb3JtKSB7XG4gICAgICAgICAgICAgICAgICAgICRmb3JtLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG9sZEFjdGlvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICRmb3JtLmF0dHIoJ2FjdGlvbicsIG9sZEFjdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRmb3JtLmF0dHIoJ21ldGhvZCcsIG9sZE1ldGhvZCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoYXJlVmFsaWRQYXJhbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKHBhcmFtcywgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJ2lucHV0W25hbWU9XCInICsgbmFtZSArICdcIl0nLCAkZm9ybSkucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldFF1ZXJ5UGFyYW1zOiBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgICAgICB2YXIgcG9zID0gdXJsLmluZGV4T2YoJz8nKTtcbiAgICAgICAgICAgIGlmIChwb3MgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcGFpcnMgPSB1cmwuc3Vic3RyaW5nKHBvcyArIDEpLnNwbGl0KCcjJylbMF0uc3BsaXQoJyYnKSxcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSB7fTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHBhaXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhaXIgPSBwYWlyc1tpXS5zcGxpdCgnPScpO1xuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMF0ucmVwbGFjZSgvXFwrL2csICclMjAnKSk7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMV0ucmVwbGFjZSgvXFwrL2csICclMjAnKSk7XG4gICAgICAgICAgICAgICAgaWYgKCFuYW1lLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHBhcmFtc1tuYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtc1tuYW1lXSA9IHZhbHVlIHx8ICcnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghJC5pc0FycmF5KHBhcmFtc1tuYW1lXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmFtc1tuYW1lXSA9IFtwYXJhbXNbbmFtZV1dO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHBhcmFtc1tuYW1lXS5wdXNoKHZhbHVlIHx8ICcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcGFyYW1zO1xuICAgICAgICB9LFxuXG4gICAgICAgIGluaXRNb2R1bGU6IGZ1bmN0aW9uIChtb2R1bGUpIHtcbiAgICAgICAgICAgIGlmIChtb2R1bGUuaXNBY3RpdmUgIT09IHVuZGVmaW5lZCAmJiAhbW9kdWxlLmlzQWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCQuaXNGdW5jdGlvbihtb2R1bGUuaW5pdCkpIHtcbiAgICAgICAgICAgICAgICBtb2R1bGUuaW5pdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJC5lYWNoKG1vZHVsZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICgkLmlzUGxhaW5PYmplY3QodGhpcykpIHtcbiAgICAgICAgICAgICAgICAgICAgcHViLmluaXRNb2R1bGUodGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaW5pdENzcmZIYW5kbGVyKCk7XG4gICAgICAgICAgICBpbml0UmVkaXJlY3RIYW5kbGVyKCk7XG4gICAgICAgICAgICBpbml0QXNzZXRGaWx0ZXJzKCk7XG4gICAgICAgICAgICBpbml0RGF0YU1ldGhvZHMoKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgVVJMIG9mIHRoZSBjdXJyZW50IHBhZ2Ugd2l0aG91dCBwYXJhbXMgYW5kIHRyYWlsaW5nIHNsYXNoLiBTZXBhcmF0ZWQgYW5kIG1hZGUgcHVibGljIGZvciB0ZXN0aW5nLlxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0QmFzZUN1cnJlbnRVcmw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgd2luZG93LmxvY2F0aW9uLmhvc3Q7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIFVSTCBvZiB0aGUgY3VycmVudCBwYWdlLiBVc2VkIGZvciB0ZXN0aW5nLCB5b3UgY2FuIGFsd2F5cyBjYWxsIGB3aW5kb3cubG9jYXRpb24uaHJlZmAgbWFudWFsbHlcbiAgICAgICAgICogaW5zdGVhZC5cbiAgICAgICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGdldEN1cnJlbnRVcmw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBpbml0Q3NyZkhhbmRsZXIoKSB7XG4gICAgICAgIC8vIGF1dG9tYXRpY2FsbHkgc2VuZCBDU1JGIHRva2VuIGZvciBhbGwgQUpBWCByZXF1ZXN0c1xuICAgICAgICAkLmFqYXhQcmVmaWx0ZXIoZnVuY3Rpb24gKG9wdGlvbnMsIG9yaWdpbmFsT3B0aW9ucywgeGhyKSB7XG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuY3Jvc3NEb21haW4gJiYgcHViLmdldENzcmZQYXJhbSgpKSB7XG4gICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ1gtQ1NSRi1Ub2tlbicsIHB1Yi5nZXRDc3JmVG9rZW4oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBwdWIucmVmcmVzaENzcmZUb2tlbigpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXRSZWRpcmVjdEhhbmRsZXIoKSB7XG4gICAgICAgIC8vIGhhbmRsZSBBSkFYIHJlZGlyZWN0aW9uXG4gICAgICAgICQoZG9jdW1lbnQpLmFqYXhDb21wbGV0ZShmdW5jdGlvbiAoZXZlbnQsIHhocikge1xuICAgICAgICAgICAgdmFyIHVybCA9IHhociAmJiB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ1gtUmVkaXJlY3QnKTtcbiAgICAgICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uYXNzaWduKHVybCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXRBc3NldEZpbHRlcnMoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBVc2VkIGZvciBzdG9yaW5nIGxvYWRlZCBzY3JpcHRzIGFuZCBpbmZvcm1hdGlvbiBhYm91dCBsb2FkaW5nIGVhY2ggc2NyaXB0IGlmIGl0J3MgaW4gdGhlIHByb2Nlc3Mgb2YgbG9hZGluZy5cbiAgICAgICAgICogQSBzaW5nbGUgc2NyaXB0IGNhbiBoYXZlIG9uZSBvZiB0aGUgZm9sbG93aW5nIHZhbHVlczpcbiAgICAgICAgICpcbiAgICAgICAgICogLSBgdW5kZWZpbmVkYCAtIHNjcmlwdCB3YXMgbm90IGxvYWRlZCBhdCBhbGwgYmVmb3JlIG9yIHdhcyBsb2FkZWQgd2l0aCBlcnJvciBsYXN0IHRpbWUuXG4gICAgICAgICAqIC0gYHRydWVgIChib29sZWFuKSAtICBzY3JpcHQgd2FzIHN1Y2Nlc3NmdWxseSBsb2FkZWQuXG4gICAgICAgICAqIC0gb2JqZWN0IC0gc2NyaXB0IGlzIGN1cnJlbnRseSBsb2FkaW5nLlxuICAgICAgICAgKlxuICAgICAgICAgKiBJbiBjYXNlIG9mIGEgdmFsdWUgYmVpbmcgYW4gb2JqZWN0IHRoZSBwcm9wZXJ0aWVzIGFyZTpcbiAgICAgICAgICogLSBgeGhyTGlzdGAgLSByZXByZXNlbnRzIGEgcXVldWUgb2YgWEhSIHJlcXVlc3RzIHNlbnQgdG8gdGhlIHNhbWUgVVJMIChyZWxhdGVkIHdpdGggdGhpcyBzY3JpcHQpIGluIHRoZSBzYW1lXG4gICAgICAgICAqIHNtYWxsIHBlcmlvZCBvZiB0aW1lLlxuICAgICAgICAgKiAtIGB4aHJEb25lYCAtIGJvb2xlYW4sIGFjdHMgbGlrZSBhIGxvY2tpbmcgbWVjaGFuaXNtLiBXaGVuIG9uZSBvZiB0aGUgWEhSIHJlcXVlc3RzIGluIHRoZSBxdWV1ZSBpc1xuICAgICAgICAgKiBzdWNjZXNzZnVsbHkgY29tcGxldGVkLCBpdCB3aWxsIGFib3J0IHRoZSByZXN0IG9mIGNvbmN1cnJlbnQgcmVxdWVzdHMgdG8gdGhlIHNhbWUgVVJMIHVudGlsIGNsZWFudXAgaXMgZG9uZVxuICAgICAgICAgKiB0byBwcmV2ZW50IHBvc3NpYmxlIGVycm9ycyBhbmQgcmFjZSBjb25kaXRpb25zLlxuICAgICAgICAgKiBAdHlwZSB7e319XG4gICAgICAgICAqL1xuICAgICAgICB2YXIgbG9hZGVkU2NyaXB0cyA9IHt9O1xuXG4gICAgICAgICQoJ3NjcmlwdFtzcmNdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdXJsID0gZ2V0QWJzb2x1dGVVcmwodGhpcy5zcmMpO1xuICAgICAgICAgICAgbG9hZGVkU2NyaXB0c1t1cmxdID0gdHJ1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJC5hamF4UHJlZmlsdGVyKCdzY3JpcHQnLCBmdW5jdGlvbiAob3B0aW9ucywgb3JpZ2luYWxPcHRpb25zLCB4aHIpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmRhdGFUeXBlID09ICdqc29ucCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB1cmwgPSBnZXRBYnNvbHV0ZVVybChvcHRpb25zLnVybCksXG4gICAgICAgICAgICAgICAgZm9yYmlkZGVuUmVwZWF0ZWRMb2FkID0gbG9hZGVkU2NyaXB0c1t1cmxdID09PSB0cnVlICYmICFpc1JlbG9hZGFibGVBc3NldCh1cmwpLFxuICAgICAgICAgICAgICAgIGNsZWFudXBSdW5uaW5nID0gbG9hZGVkU2NyaXB0c1t1cmxdICE9PSB1bmRlZmluZWQgJiYgbG9hZGVkU2NyaXB0c1t1cmxdWyd4aHJEb25lJ10gPT09IHRydWU7XG5cbiAgICAgICAgICAgIGlmIChmb3JiaWRkZW5SZXBlYXRlZExvYWQgfHwgY2xlYW51cFJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICB4aHIuYWJvcnQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChsb2FkZWRTY3JpcHRzW3VybF0gPT09IHVuZGVmaW5lZCB8fCBsb2FkZWRTY3JpcHRzW3VybF0gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBsb2FkZWRTY3JpcHRzW3VybF0gPSB7XG4gICAgICAgICAgICAgICAgICAgIHhockxpc3Q6IFtdLFxuICAgICAgICAgICAgICAgICAgICB4aHJEb25lOiBmYWxzZVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHhoci5kb25lKGZ1bmN0aW9uIChkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUikge1xuICAgICAgICAgICAgICAgIC8vIElmIG11bHRpcGxlIHJlcXVlc3RzIHdlcmUgc3VjY2Vzc2Z1bGx5IGxvYWRlZCwgcGVyZm9ybSBjbGVhbnVwIG9ubHkgb25jZVxuICAgICAgICAgICAgICAgIGlmIChsb2FkZWRTY3JpcHRzW2pxWEhSLnlpaVVybF1bJ3hockRvbmUnXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbG9hZGVkU2NyaXB0c1tqcVhIUi55aWlVcmxdWyd4aHJEb25lJ10gPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGxvYWRlZFNjcmlwdHNbanFYSFIueWlpVXJsXVsneGhyTGlzdCddLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzaW5nbGVYaHIgPSBsb2FkZWRTY3JpcHRzW2pxWEhSLnlpaVVybF1bJ3hockxpc3QnXVtpXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpbmdsZVhociAmJiBzaW5nbGVYaHIucmVhZHlTdGF0ZSAhPT0gWE1MSHR0cFJlcXVlc3QuRE9ORSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2luZ2xlWGhyLmFib3J0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsb2FkZWRTY3JpcHRzW2pxWEhSLnlpaVVybF0gPSB0cnVlO1xuICAgICAgICAgICAgfSkuZmFpbChmdW5jdGlvbiAoanFYSFIsIHRleHRTdGF0dXMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGV4dFN0YXR1cyA9PT0gJ2Fib3J0Jykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgZGVsZXRlIGxvYWRlZFNjcmlwdHNbanFYSFIueWlpVXJsXVsneGhyTGlzdCddW2pxWEhSLnlpaUluZGV4XTtcblxuICAgICAgICAgICAgICAgIHZhciBhbGxGYWlsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsb2FkZWRTY3JpcHRzW2pxWEhSLnlpaVVybF1bJ3hockxpc3QnXS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobG9hZGVkU2NyaXB0c1tqcVhIUi55aWlVcmxdWyd4aHJMaXN0J11baV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsbEZhaWxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGFsbEZhaWxlZCkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbG9hZGVkU2NyaXB0c1tqcVhIUi55aWlVcmxdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gVXNlIHByZWZpeCBmb3IgY3VzdG9tIFhIUiBwcm9wZXJ0aWVzIHRvIGF2b2lkIHBvc3NpYmxlIGNvbmZsaWN0cyB3aXRoIGV4aXN0aW5nIHByb3BlcnRpZXNcbiAgICAgICAgICAgIHhoci55aWlJbmRleCA9IGxvYWRlZFNjcmlwdHNbdXJsXVsneGhyTGlzdCddLmxlbmd0aDtcbiAgICAgICAgICAgIHhoci55aWlVcmwgPSB1cmw7XG5cbiAgICAgICAgICAgIGxvYWRlZFNjcmlwdHNbdXJsXVsneGhyTGlzdCddW3hoci55aWlJbmRleF0gPSB4aHI7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoZG9jdW1lbnQpLmFqYXhDb21wbGV0ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc3R5bGVTaGVldHMgPSBbXTtcbiAgICAgICAgICAgICQoJ2xpbmtbcmVsPXN0eWxlc2hlZXRdJykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHVybCA9IGdldEFic29sdXRlVXJsKHRoaXMuaHJlZik7XG4gICAgICAgICAgICAgICAgaWYgKGlzUmVsb2FkYWJsZUFzc2V0KHVybCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICQuaW5BcnJheSh1cmwsIHN0eWxlU2hlZXRzKSA9PT0gLTEgPyBzdHlsZVNoZWV0cy5wdXNoKHVybCkgOiAkKHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXREYXRhTWV0aG9kcygpIHtcbiAgICAgICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgbWV0aG9kID0gJHRoaXMuZGF0YSgnbWV0aG9kJyksXG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9ICR0aGlzLmRhdGEoJ2NvbmZpcm0nKSxcbiAgICAgICAgICAgICAgICBmb3JtID0gJHRoaXMuZGF0YSgnZm9ybScpO1xuXG4gICAgICAgICAgICBpZiAobWV0aG9kID09PSB1bmRlZmluZWQgJiYgbWVzc2FnZSA9PT0gdW5kZWZpbmVkICYmIGZvcm0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWVzc2FnZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgJC5wcm94eShwdWIuY29uZmlybSwgdGhpcykobWVzc2FnZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBwdWIuaGFuZGxlQWN0aW9uKCR0aGlzLCBldmVudCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHB1Yi5oYW5kbGVBY3Rpb24oJHRoaXMsIGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGhhbmRsZSBkYXRhLWNvbmZpcm0gYW5kIGRhdGEtbWV0aG9kIGZvciBjbGlja2FibGUgYW5kIGNoYW5nZWFibGUgZWxlbWVudHNcbiAgICAgICAgJChkb2N1bWVudCkub24oJ2NsaWNrLnlpaScsIHB1Yi5jbGlja2FibGVTZWxlY3RvciwgaGFuZGxlcilcbiAgICAgICAgICAgIC5vbignY2hhbmdlLnlpaScsIHB1Yi5jaGFuZ2VhYmxlU2VsZWN0b3IsIGhhbmRsZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzUmVsb2FkYWJsZUFzc2V0KHVybCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHB1Yi5yZWxvYWRhYmxlU2NyaXB0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIHJ1bGUgPSBnZXRBYnNvbHV0ZVVybChwdWIucmVsb2FkYWJsZVNjcmlwdHNbaV0pO1xuICAgICAgICAgICAgdmFyIG1hdGNoID0gbmV3IFJlZ0V4cChcIl5cIiArIGVzY2FwZVJlZ0V4cChydWxlKS5zcGxpdCgnXFxcXConKS5qb2luKCcuKicpICsgXCIkXCIpLnRlc3QodXJsKTtcbiAgICAgICAgICAgIGlmIChtYXRjaCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzQ0NjE3MC9lc2NhcGUtc3RyaW5nLWZvci11c2UtaW4tamF2YXNjcmlwdC1yZWdleFxuICAgIGZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzdHIpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bXFwtXFxbXFxdXFwvXFx7XFx9XFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcXlxcJFxcfF0vZywgXCJcXFxcJCZcIik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhYnNvbHV0ZSBVUkwgYmFzZWQgb24gdGhlIGdpdmVuIFVSTFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgSW5pdGlhbCBVUkxcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldEFic29sdXRlVXJsKHVybCkge1xuICAgICAgICByZXR1cm4gdXJsLmNoYXJBdCgwKSA9PT0gJy8nID8gcHViLmdldEJhc2VDdXJyZW50VXJsKCkgKyB1cmwgOiB1cmw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHB1Yjtcbn0pKHdpbmRvdy5qUXVlcnkpO1xuXG53aW5kb3cualF1ZXJ5KGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cueWlpLmluaXRNb2R1bGUod2luZG93LnlpaSk7XG59KTtcbiIsIi8qKlxuICogWWlpIHZhbGlkYXRpb24gbW9kdWxlLlxuICpcbiAqIFRoaXMgSmF2YVNjcmlwdCBtb2R1bGUgcHJvdmlkZXMgdGhlIHZhbGlkYXRpb24gbWV0aG9kcyBmb3IgdGhlIGJ1aWx0LWluIHZhbGlkYXRvcnMuXG4gKlxuICogQGxpbmsgaHR0cDovL3d3dy55aWlmcmFtZXdvcmsuY29tL1xuICogQGNvcHlyaWdodCBDb3B5cmlnaHQgKGMpIDIwMDggWWlpIFNvZnR3YXJlIExMQ1xuICogQGxpY2Vuc2UgaHR0cDovL3d3dy55aWlmcmFtZXdvcmsuY29tL2xpY2Vuc2UvXG4gKiBAYXV0aG9yIFFpYW5nIFh1ZSA8cWlhbmcueHVlQGdtYWlsLmNvbT5cbiAqIEBzaW5jZSAyLjBcbiAqL1xuXG55aWkudmFsaWRhdGlvbiA9IChmdW5jdGlvbiAoJCkge1xuICAgIHZhciBwdWIgPSB7XG4gICAgICAgIGlzRW1wdHk6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgfHwgKCQuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAwKSB8fCB2YWx1ZSA9PT0gJyc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYWRkTWVzc2FnZTogZnVuY3Rpb24gKG1lc3NhZ2VzLCBtZXNzYWdlLCB2YWx1ZSkge1xuICAgICAgICAgICAgbWVzc2FnZXMucHVzaChtZXNzYWdlLnJlcGxhY2UoL1xce3ZhbHVlXFx9L2csIHZhbHVlKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcmVxdWlyZWQ6IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciB2YWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMucmVxdWlyZWRWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlzU3RyaW5nID0gdHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8IHZhbHVlIGluc3RhbmNlb2YgU3RyaW5nO1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLnN0cmljdCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkIHx8ICFvcHRpb25zLnN0cmljdCAmJiAhcHViLmlzRW1wdHkoaXNTdHJpbmcgPyAkLnRyaW0odmFsdWUpIDogdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCFvcHRpb25zLnN0cmljdCAmJiB2YWx1ZSA9PSBvcHRpb25zLnJlcXVpcmVkVmFsdWUgfHwgb3B0aW9ucy5zdHJpY3QgJiYgdmFsdWUgPT09IG9wdGlvbnMucmVxdWlyZWRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF2YWxpZCkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyBcImJvb2xlYW5cIiBpcyBhIHJlc2VydmVkIGtleXdvcmQgaW4gb2xkZXIgdmVyc2lvbnMgb2YgRVMgc28gaXQncyBxdW90ZWQgZm9yIElFIDwgOSBzdXBwb3J0XG4gICAgICAgICdib29sZWFuJzogZnVuY3Rpb24gKHZhbHVlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2tpcE9uRW1wdHkgJiYgcHViLmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIHZhbGlkID0gIW9wdGlvbnMuc3RyaWN0ICYmICh2YWx1ZSA9PSBvcHRpb25zLnRydWVWYWx1ZSB8fCB2YWx1ZSA9PSBvcHRpb25zLmZhbHNlVmFsdWUpXG4gICAgICAgICAgICAgICAgfHwgb3B0aW9ucy5zdHJpY3QgJiYgKHZhbHVlID09PSBvcHRpb25zLnRydWVWYWx1ZSB8fCB2YWx1ZSA9PT0gb3B0aW9ucy5mYWxzZVZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKCF2YWxpZCkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBzdHJpbmc6IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNraXBPbkVtcHR5ICYmIHB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5pcyAhPT0gdW5kZWZpbmVkICYmIHZhbHVlLmxlbmd0aCAhPSBvcHRpb25zLmlzKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubm90RXF1YWwsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5taW4gIT09IHVuZGVmaW5lZCAmJiB2YWx1ZS5sZW5ndGggPCBvcHRpb25zLm1pbikge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLnRvb1Nob3J0LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5tYXggIT09IHVuZGVmaW5lZCAmJiB2YWx1ZS5sZW5ndGggPiBvcHRpb25zLm1heCkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLnRvb0xvbmcsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBmaWxlOiBmdW5jdGlvbiAoYXR0cmlidXRlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgdmFyIGZpbGVzID0gZ2V0VXBsb2FkZWRGaWxlcyhhdHRyaWJ1dGUsIG1lc3NhZ2VzLCBvcHRpb25zKTtcbiAgICAgICAgICAgICQuZWFjaChmaWxlcywgZnVuY3Rpb24gKGksIGZpbGUpIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZUZpbGUoZmlsZSwgbWVzc2FnZXMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW1hZ2U6IGZ1bmN0aW9uIChhdHRyaWJ1dGUsIG1lc3NhZ2VzLCBvcHRpb25zLCBkZWZlcnJlZExpc3QpIHtcbiAgICAgICAgICAgIHZhciBmaWxlcyA9IGdldFVwbG9hZGVkRmlsZXMoYXR0cmlidXRlLCBtZXNzYWdlcywgb3B0aW9ucyk7XG4gICAgICAgICAgICAkLmVhY2goZmlsZXMsIGZ1bmN0aW9uIChpLCBmaWxlKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdGVGaWxlKGZpbGUsIG1lc3NhZ2VzLCBvcHRpb25zKTtcblxuICAgICAgICAgICAgICAgIC8vIFNraXAgaW1hZ2UgdmFsaWRhdGlvbiBpZiBGaWxlUmVhZGVyIEFQSSBpcyBub3QgYXZhaWxhYmxlXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBGaWxlUmVhZGVyID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgZGVmZXJyZWQgPSAkLkRlZmVycmVkKCk7XG4gICAgICAgICAgICAgICAgcHViLnZhbGlkYXRlSW1hZ2UoZmlsZSwgbWVzc2FnZXMsIG9wdGlvbnMsIGRlZmVycmVkLCBuZXcgRmlsZVJlYWRlcigpLCBuZXcgSW1hZ2UoKSk7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWRMaXN0LnB1c2goZGVmZXJyZWQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgdmFsaWRhdGVJbWFnZTogZnVuY3Rpb24gKGZpbGUsIG1lc3NhZ2VzLCBvcHRpb25zLCBkZWZlcnJlZCwgZmlsZVJlYWRlciwgaW1hZ2UpIHtcbiAgICAgICAgICAgIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhbGlkYXRlSW1hZ2VTaXplKGZpbGUsIGltYWdlLCBtZXNzYWdlcywgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaW1hZ2Uub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMubm90SW1hZ2UucmVwbGFjZSgvXFx7ZmlsZVxcfS9nLCBmaWxlLm5hbWUpKTtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBmaWxlUmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpbWFnZS5zcmMgPSB0aGlzLnJlc3VsdDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIFJlc29sdmUgZGVmZXJyZWQgaWYgdGhlcmUgd2FzIGVycm9yIHdoaWxlIHJlYWRpbmcgZGF0YVxuICAgICAgICAgICAgZmlsZVJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZpbGVSZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTtcbiAgICAgICAgfSxcblxuICAgICAgICBudW1iZXI6IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNraXBPbkVtcHR5ICYmIHB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgIW9wdGlvbnMucGF0dGVybi50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1pbiAhPT0gdW5kZWZpbmVkICYmIHZhbHVlIDwgb3B0aW9ucy5taW4pIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy50b29TbWFsbCwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubWF4ICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgPiBvcHRpb25zLm1heCkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLnRvb0JpZywgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHJhbmdlOiBmdW5jdGlvbiAodmFsdWUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5za2lwT25FbXB0eSAmJiBwdWIuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5hbGxvd0FycmF5ICYmICQuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaW5BcnJheSA9IHRydWU7XG5cbiAgICAgICAgICAgICQuZWFjaCgkLmlzQXJyYXkodmFsdWUpID8gdmFsdWUgOiBbdmFsdWVdLCBmdW5jdGlvbiAoaSwgdikge1xuICAgICAgICAgICAgICAgIGlmICgkLmluQXJyYXkodiwgb3B0aW9ucy5yYW5nZSkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5BcnJheSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm5vdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5ub3QgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMubm90ID09PSBpbkFycmF5KSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHJlZ3VsYXJFeHByZXNzaW9uOiBmdW5jdGlvbiAodmFsdWUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5za2lwT25FbXB0eSAmJiBwdWIuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5ub3QgJiYgIW9wdGlvbnMucGF0dGVybi50ZXN0KHZhbHVlKSB8fCBvcHRpb25zLm5vdCAmJiBvcHRpb25zLnBhdHRlcm4udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgZW1haWw6IGZ1bmN0aW9uICh2YWx1ZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLnNraXBPbkVtcHR5ICYmIHB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHZhbGlkID0gdHJ1ZSxcbiAgICAgICAgICAgICAgICByZWdleHAgPSAvXigoPzpcIj8oW15cIl0qKVwiP1xccyk/KSg/OlxccyspPyg/Oig8PykoKC4rKUAoW14+XSspKSg+PykpJC8sXG4gICAgICAgICAgICAgICAgbWF0Y2hlcyA9IHJlZ2V4cC5leGVjKHZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKG1hdGNoZXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgbG9jYWxQYXJ0ID0gbWF0Y2hlc1s1XSxcbiAgICAgICAgICAgICAgICAgICAgZG9tYWluID0gbWF0Y2hlc1s2XTtcblxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmVuYWJsZUlETikge1xuICAgICAgICAgICAgICAgICAgICBsb2NhbFBhcnQgPSBwdW55Y29kZS50b0FTQ0lJKGxvY2FsUGFydCk7XG4gICAgICAgICAgICAgICAgICAgIGRvbWFpbiA9IHB1bnljb2RlLnRvQVNDSUkoZG9tYWluKTtcblxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IG1hdGNoZXNbMV0gKyBtYXRjaGVzWzNdICsgbG9jYWxQYXJ0ICsgJ0AnICsgZG9tYWluICsgbWF0Y2hlc1s3XTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobG9jYWxQYXJ0Lmxlbmd0aCA+IDY0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgobG9jYWxQYXJ0ICsgJ0AnICsgZG9tYWluKS5sZW5ndGggPiAyNTQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IG9wdGlvbnMucGF0dGVybi50ZXN0KHZhbHVlKSB8fCAob3B0aW9ucy5hbGxvd05hbWUgJiYgb3B0aW9ucy5mdWxsUGF0dGVybi50ZXN0KHZhbHVlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXZhbGlkKSB7XG4gICAgICAgICAgICAgICAgcHViLmFkZE1lc3NhZ2UobWVzc2FnZXMsIG9wdGlvbnMubWVzc2FnZSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIHVybDogZnVuY3Rpb24gKHZhbHVlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2tpcE9uRW1wdHkgJiYgcHViLmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5kZWZhdWx0U2NoZW1lICYmICEvOlxcL1xcLy8udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG9wdGlvbnMuZGVmYXVsdFNjaGVtZSArICc6Ly8nICsgdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB2YWxpZCA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLmVuYWJsZUlETikge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaGVzID0gL14oW146XSspOlxcL1xcLyhbXlxcL10rKSguKikkLy5leGVjKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hlcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gbWF0Y2hlc1sxXSArICc6Ly8nICsgcHVueWNvZGUudG9BU0NJSShtYXRjaGVzWzJdKSArIG1hdGNoZXNbM107XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXZhbGlkIHx8ICFvcHRpb25zLnBhdHRlcm4udGVzdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgdHJpbTogZnVuY3Rpb24gKCRmb3JtLCBhdHRyaWJ1dGUsIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciAkaW5wdXQgPSAkZm9ybS5maW5kKGF0dHJpYnV0ZS5pbnB1dCk7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSAkaW5wdXQudmFsKCk7XG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuc2tpcE9uRW1wdHkgfHwgIXB1Yi5pc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gJC50cmltKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAkaW5wdXQudmFsKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSxcblxuICAgICAgICBjYXB0Y2hhOiBmdW5jdGlvbiAodmFsdWUsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5za2lwT25FbXB0eSAmJiBwdWIuaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENBUFRDSEEgbWF5IGJlIHVwZGF0ZWQgdmlhIEFKQVggYW5kIHRoZSB1cGRhdGVkIGhhc2ggaXMgc3RvcmVkIGluIGJvZHkgZGF0YVxuICAgICAgICAgICAgdmFyIGhhc2ggPSAkKCdib2R5JykuZGF0YShvcHRpb25zLmhhc2hLZXkpO1xuICAgICAgICAgICAgaGFzaCA9IGhhc2ggPT0gbnVsbCA/IG9wdGlvbnMuaGFzaCA6IGhhc2hbb3B0aW9ucy5jYXNlU2Vuc2l0aXZlID8gMCA6IDFdO1xuICAgICAgICAgICAgdmFyIHYgPSBvcHRpb25zLmNhc2VTZW5zaXRpdmUgPyB2YWx1ZSA6IHZhbHVlLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gdi5sZW5ndGggLSAxLCBoID0gMDsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgICAgICAgICBoICs9IHYuY2hhckNvZGVBdChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoICE9IGhhc2gpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY29tcGFyZTogZnVuY3Rpb24gKHZhbHVlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2tpcE9uRW1wdHkgJiYgcHViLmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY29tcGFyZVZhbHVlLFxuICAgICAgICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmNvbXBhcmVBdHRyaWJ1dGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbXBhcmVWYWx1ZSA9IG9wdGlvbnMuY29tcGFyZVZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb21wYXJlVmFsdWUgPSAkKCcjJyArIG9wdGlvbnMuY29tcGFyZUF0dHJpYnV0ZSkudmFsKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRpb25zLnR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICBjb21wYXJlVmFsdWUgPSBwYXJzZUZsb2F0KGNvbXBhcmVWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzd2l0Y2ggKG9wdGlvbnMub3BlcmF0b3IpIHtcbiAgICAgICAgICAgICAgICBjYXNlICc9PSc6XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdmFsdWUgPT0gY29tcGFyZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICc9PT0nOlxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHZhbHVlID09PSBjb21wYXJlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJyE9JzpcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB2YWx1ZSAhPSBjb21wYXJlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJyE9PSc6XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdmFsdWUgIT09IGNvbXBhcmVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnPic6XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdmFsdWUgPiBjb21wYXJlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJz49JzpcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSB2YWx1ZSA+PSBjb21wYXJlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJzwnOlxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IHZhbHVlIDwgY29tcGFyZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICc8PSc6XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdmFsdWUgPD0gY29tcGFyZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF2YWxpZCkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBpcDogZnVuY3Rpb24gKHZhbHVlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc2tpcE9uRW1wdHkgJiYgcHViLmlzRW1wdHkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbmVnYXRpb24gPSBudWxsLFxuICAgICAgICAgICAgICAgIGNpZHIgPSBudWxsLFxuICAgICAgICAgICAgICAgIG1hdGNoZXMgPSBuZXcgUmVnRXhwKG9wdGlvbnMuaXBQYXJzZVBhdHRlcm4pLmV4ZWModmFsdWUpO1xuICAgICAgICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgICAgICAgICBuZWdhdGlvbiA9IG1hdGNoZXNbMV0gfHwgbnVsbDtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG1hdGNoZXNbMl07XG4gICAgICAgICAgICAgICAgY2lkciA9IG1hdGNoZXNbNF0gfHwgbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuc3VibmV0ID09PSB0cnVlICYmIGNpZHIgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlcy5ub1N1Ym5ldCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLnN1Ym5ldCA9PT0gZmFsc2UgJiYgY2lkciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2VzLmhhc1N1Ym5ldCwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvcHRpb25zLm5lZ2F0aW9uID09PSBmYWxzZSAmJiBuZWdhdGlvbiAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2VzLm1lc3NhZ2UsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpcFZlcnNpb24gPSB2YWx1ZS5pbmRleE9mKCc6JykgPT09IC0xID8gNCA6IDY7XG4gICAgICAgICAgICBpZiAoaXBWZXJzaW9uID09IDYpIHtcbiAgICAgICAgICAgICAgICBpZiAoIShuZXcgUmVnRXhwKG9wdGlvbnMuaXB2NlBhdHRlcm4pKS50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlcy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghb3B0aW9ucy5pcHY2KSB7XG4gICAgICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2VzLmlwdjZOb3RBbGxvd2VkLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIShuZXcgUmVnRXhwKG9wdGlvbnMuaXB2NFBhdHRlcm4pKS50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICBwdWIuYWRkTWVzc2FnZShtZXNzYWdlcywgb3B0aW9ucy5tZXNzYWdlcy5tZXNzYWdlLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghb3B0aW9ucy5pcHY0KSB7XG4gICAgICAgICAgICAgICAgICAgIHB1Yi5hZGRNZXNzYWdlKG1lc3NhZ2VzLCBvcHRpb25zLm1lc3NhZ2VzLmlwdjROb3RBbGxvd2VkLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldFVwbG9hZGVkRmlsZXMoYXR0cmlidXRlLCBtZXNzYWdlcywgb3B0aW9ucykge1xuICAgICAgICAvLyBTa2lwIHZhbGlkYXRpb24gaWYgRmlsZSBBUEkgaXMgbm90IGF2YWlsYWJsZVxuICAgICAgICBpZiAodHlwZW9mIEZpbGUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmaWxlcyA9ICQoYXR0cmlidXRlLmlucHV0LCBhdHRyaWJ1dGUuJGZvcm0pLmdldCgwKS5maWxlcztcbiAgICAgICAgaWYgKCFmaWxlcykge1xuICAgICAgICAgICAgbWVzc2FnZXMucHVzaChvcHRpb25zLm1lc3NhZ2UpO1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpbGVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgaWYgKCFvcHRpb25zLnNraXBPbkVtcHR5KSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZXMucHVzaChvcHRpb25zLnVwbG9hZFJlcXVpcmVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLm1heEZpbGVzICYmIG9wdGlvbnMubWF4RmlsZXMgPCBmaWxlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy50b29NYW55KTtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWxlcztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB2YWxpZGF0ZUZpbGUoZmlsZSwgbWVzc2FnZXMsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuZXh0ZW5zaW9ucyAmJiBvcHRpb25zLmV4dGVuc2lvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gZmlsZS5uYW1lLmxhc3RJbmRleE9mKCcuJyk7XG4gICAgICAgICAgICB2YXIgZXh0ID0gIX5pbmRleCA/ICcnIDogZmlsZS5uYW1lLnN1YnN0cihpbmRleCArIDEsIGZpbGUubmFtZS5sZW5ndGgpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgIGlmICghfm9wdGlvbnMuZXh0ZW5zaW9ucy5pbmRleE9mKGV4dCkpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMud3JvbmdFeHRlbnNpb24ucmVwbGFjZSgvXFx7ZmlsZVxcfS9nLCBmaWxlLm5hbWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLm1pbWVUeXBlcyAmJiBvcHRpb25zLm1pbWVUeXBlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoIXZhbGlkYXRlTWltZVR5cGUob3B0aW9ucy5taW1lVHlwZXMsIGZpbGUudHlwZSkpIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMud3JvbmdNaW1lVHlwZS5yZXBsYWNlKC9cXHtmaWxlXFx9L2csIGZpbGUubmFtZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubWF4U2l6ZSAmJiBvcHRpb25zLm1heFNpemUgPCBmaWxlLnNpemUpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2gob3B0aW9ucy50b29CaWcucmVwbGFjZSgvXFx7ZmlsZVxcfS9nLCBmaWxlLm5hbWUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLm1pblNpemUgJiYgb3B0aW9ucy5taW5TaXplID4gZmlsZS5zaXplKSB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMudG9vU21hbGwucmVwbGFjZSgvXFx7ZmlsZVxcfS9nLCBmaWxlLm5hbWUpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlTWltZVR5cGUobWltZVR5cGVzLCBmaWxlVHlwZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbWltZVR5cGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpZiAobmV3IFJlZ0V4cChtaW1lVHlwZXNbaV0pLnRlc3QoZmlsZVR5cGUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdmFsaWRhdGVJbWFnZVNpemUoZmlsZSwgaW1hZ2UsIG1lc3NhZ2VzLCBvcHRpb25zKSB7XG4gICAgICAgIGlmIChvcHRpb25zLm1pbldpZHRoICYmIGltYWdlLndpZHRoIDwgb3B0aW9ucy5taW5XaWR0aCkge1xuICAgICAgICAgICAgbWVzc2FnZXMucHVzaChvcHRpb25zLnVuZGVyV2lkdGgucmVwbGFjZSgvXFx7ZmlsZVxcfS9nLCBmaWxlLm5hbWUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLm1heFdpZHRoICYmIGltYWdlLndpZHRoID4gb3B0aW9ucy5tYXhXaWR0aCkge1xuICAgICAgICAgICAgbWVzc2FnZXMucHVzaChvcHRpb25zLm92ZXJXaWR0aC5yZXBsYWNlKC9cXHtmaWxlXFx9L2csIGZpbGUubmFtZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubWluSGVpZ2h0ICYmIGltYWdlLmhlaWdodCA8IG9wdGlvbnMubWluSGVpZ2h0KSB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKG9wdGlvbnMudW5kZXJIZWlnaHQucmVwbGFjZSgvXFx7ZmlsZVxcfS9nLCBmaWxlLm5hbWUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLm1heEhlaWdodCAmJiBpbWFnZS5oZWlnaHQgPiBvcHRpb25zLm1heEhlaWdodCkge1xuICAgICAgICAgICAgbWVzc2FnZXMucHVzaChvcHRpb25zLm92ZXJIZWlnaHQucmVwbGFjZSgvXFx7ZmlsZVxcfS9nLCBmaWxlLm5hbWUpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwdWI7XG59KShqUXVlcnkpO1xuIiwiLyoqXG4gKiBZaWkgZm9ybSB3aWRnZXQuXG4gKlxuICogVGhpcyBpcyB0aGUgSmF2YVNjcmlwdCB3aWRnZXQgdXNlZCBieSB0aGUgeWlpXFx3aWRnZXRzXFxBY3RpdmVGb3JtIHdpZGdldC5cbiAqXG4gKiBAbGluayBodHRwOi8vd3d3LnlpaWZyYW1ld29yay5jb20vXG4gKiBAY29weXJpZ2h0IENvcHlyaWdodCAoYykgMjAwOCBZaWkgU29mdHdhcmUgTExDXG4gKiBAbGljZW5zZSBodHRwOi8vd3d3LnlpaWZyYW1ld29yay5jb20vbGljZW5zZS9cbiAqIEBhdXRob3IgUWlhbmcgWHVlIDxxaWFuZy54dWVAZ21haWwuY29tPlxuICogQHNpbmNlIDIuMFxuICovXG4oZnVuY3Rpb24gKCQpIHtcblxuICAgICQuZm4ueWlpQWN0aXZlRm9ybSA9IGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICAgICAgaWYgKG1ldGhvZHNbbWV0aG9kXSkge1xuICAgICAgICAgICAgcmV0dXJuIG1ldGhvZHNbbWV0aG9kXS5hcHBseSh0aGlzLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbWV0aG9kID09PSAnb2JqZWN0JyB8fCAhbWV0aG9kKSB7XG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kcy5pbml0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkLmVycm9yKCdNZXRob2QgJyArIG1ldGhvZCArICcgZG9lcyBub3QgZXhpc3Qgb24galF1ZXJ5LnlpaUFjdGl2ZUZvcm0nKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZXZlbnRzID0ge1xuICAgICAgICAvKipcbiAgICAgICAgICogYmVmb3JlVmFsaWRhdGUgZXZlbnQgaXMgdHJpZ2dlcmVkIGJlZm9yZSB2YWxpZGF0aW5nIHRoZSB3aG9sZSBmb3JtLlxuICAgICAgICAgKiBUaGUgc2lnbmF0dXJlIG9mIHRoZSBldmVudCBoYW5kbGVyIHNob3VsZCBiZTpcbiAgICAgICAgICogICAgIGZ1bmN0aW9uIChldmVudCwgbWVzc2FnZXMsIGRlZmVycmVkcylcbiAgICAgICAgICogd2hlcmVcbiAgICAgICAgICogIC0gZXZlbnQ6IGFuIEV2ZW50IG9iamVjdC5cbiAgICAgICAgICogIC0gbWVzc2FnZXM6IGFuIGFzc29jaWF0aXZlIGFycmF5IHdpdGgga2V5cyBiZWluZyBhdHRyaWJ1dGUgSURzIGFuZCB2YWx1ZXMgYmVpbmcgZXJyb3IgbWVzc2FnZSBhcnJheXNcbiAgICAgICAgICogICAgZm9yIHRoZSBjb3JyZXNwb25kaW5nIGF0dHJpYnV0ZXMuXG4gICAgICAgICAqICAtIGRlZmVycmVkczogYW4gYXJyYXkgb2YgRGVmZXJyZWQgb2JqZWN0cy4gWW91IGNhbiB1c2UgZGVmZXJyZWRzLmFkZChjYWxsYmFjaykgdG8gYWRkIGEgbmV3IGRlZmVycmVkIHZhbGlkYXRpb24uXG4gICAgICAgICAqXG4gICAgICAgICAqIElmIHRoZSBoYW5kbGVyIHJldHVybnMgYSBib29sZWFuIGZhbHNlLCBpdCB3aWxsIHN0b3AgZnVydGhlciBmb3JtIHZhbGlkYXRpb24gYWZ0ZXIgdGhpcyBldmVudC4gQW5kIGFzXG4gICAgICAgICAqIGEgcmVzdWx0LCBhZnRlclZhbGlkYXRlIGV2ZW50IHdpbGwgbm90IGJlIHRyaWdnZXJlZC5cbiAgICAgICAgICovXG4gICAgICAgIGJlZm9yZVZhbGlkYXRlOiAnYmVmb3JlVmFsaWRhdGUnLFxuICAgICAgICAvKipcbiAgICAgICAgICogYWZ0ZXJWYWxpZGF0ZSBldmVudCBpcyB0cmlnZ2VyZWQgYWZ0ZXIgdmFsaWRhdGluZyB0aGUgd2hvbGUgZm9ybS5cbiAgICAgICAgICogVGhlIHNpZ25hdHVyZSBvZiB0aGUgZXZlbnQgaGFuZGxlciBzaG91bGQgYmU6XG4gICAgICAgICAqICAgICBmdW5jdGlvbiAoZXZlbnQsIG1lc3NhZ2VzLCBlcnJvckF0dHJpYnV0ZXMpXG4gICAgICAgICAqIHdoZXJlXG4gICAgICAgICAqICAtIGV2ZW50OiBhbiBFdmVudCBvYmplY3QuXG4gICAgICAgICAqICAtIG1lc3NhZ2VzOiBhbiBhc3NvY2lhdGl2ZSBhcnJheSB3aXRoIGtleXMgYmVpbmcgYXR0cmlidXRlIElEcyBhbmQgdmFsdWVzIGJlaW5nIGVycm9yIG1lc3NhZ2UgYXJyYXlzXG4gICAgICAgICAqICAgIGZvciB0aGUgY29ycmVzcG9uZGluZyBhdHRyaWJ1dGVzLlxuICAgICAgICAgKiAgLSBlcnJvckF0dHJpYnV0ZXM6IGFuIGFycmF5IG9mIGF0dHJpYnV0ZXMgdGhhdCBoYXZlIHZhbGlkYXRpb24gZXJyb3JzLiBQbGVhc2UgcmVmZXIgdG8gYXR0cmlidXRlRGVmYXVsdHMgZm9yIHRoZSBzdHJ1Y3R1cmUgb2YgdGhpcyBwYXJhbWV0ZXIuXG4gICAgICAgICAqL1xuICAgICAgICBhZnRlclZhbGlkYXRlOiAnYWZ0ZXJWYWxpZGF0ZScsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBiZWZvcmVWYWxpZGF0ZUF0dHJpYnV0ZSBldmVudCBpcyB0cmlnZ2VyZWQgYmVmb3JlIHZhbGlkYXRpbmcgYW4gYXR0cmlidXRlLlxuICAgICAgICAgKiBUaGUgc2lnbmF0dXJlIG9mIHRoZSBldmVudCBoYW5kbGVyIHNob3VsZCBiZTpcbiAgICAgICAgICogICAgIGZ1bmN0aW9uIChldmVudCwgYXR0cmlidXRlLCBtZXNzYWdlcywgZGVmZXJyZWRzKVxuICAgICAgICAgKiB3aGVyZVxuICAgICAgICAgKiAgLSBldmVudDogYW4gRXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiAgLSBhdHRyaWJ1dGU6IHRoZSBhdHRyaWJ1dGUgdG8gYmUgdmFsaWRhdGVkLiBQbGVhc2UgcmVmZXIgdG8gYXR0cmlidXRlRGVmYXVsdHMgZm9yIHRoZSBzdHJ1Y3R1cmUgb2YgdGhpcyBwYXJhbWV0ZXIuXG4gICAgICAgICAqICAtIG1lc3NhZ2VzOiBhbiBhcnJheSB0byB3aGljaCB5b3UgY2FuIGFkZCB2YWxpZGF0aW9uIGVycm9yIG1lc3NhZ2VzIGZvciB0aGUgc3BlY2lmaWVkIGF0dHJpYnV0ZS5cbiAgICAgICAgICogIC0gZGVmZXJyZWRzOiBhbiBhcnJheSBvZiBEZWZlcnJlZCBvYmplY3RzLiBZb3UgY2FuIHVzZSBkZWZlcnJlZHMuYWRkKGNhbGxiYWNrKSB0byBhZGQgYSBuZXcgZGVmZXJyZWQgdmFsaWRhdGlvbi5cbiAgICAgICAgICpcbiAgICAgICAgICogSWYgdGhlIGhhbmRsZXIgcmV0dXJucyBhIGJvb2xlYW4gZmFsc2UsIGl0IHdpbGwgc3RvcCBmdXJ0aGVyIHZhbGlkYXRpb24gb2YgdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGUuXG4gICAgICAgICAqIEFuZCBhcyBhIHJlc3VsdCwgYWZ0ZXJWYWxpZGF0ZUF0dHJpYnV0ZSBldmVudCB3aWxsIG5vdCBiZSB0cmlnZ2VyZWQuXG4gICAgICAgICAqL1xuICAgICAgICBiZWZvcmVWYWxpZGF0ZUF0dHJpYnV0ZTogJ2JlZm9yZVZhbGlkYXRlQXR0cmlidXRlJyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGFmdGVyVmFsaWRhdGVBdHRyaWJ1dGUgZXZlbnQgaXMgdHJpZ2dlcmVkIGFmdGVyIHZhbGlkYXRpbmcgdGhlIHdob2xlIGZvcm0gYW5kIGVhY2ggYXR0cmlidXRlLlxuICAgICAgICAgKiBUaGUgc2lnbmF0dXJlIG9mIHRoZSBldmVudCBoYW5kbGVyIHNob3VsZCBiZTpcbiAgICAgICAgICogICAgIGZ1bmN0aW9uIChldmVudCwgYXR0cmlidXRlLCBtZXNzYWdlcylcbiAgICAgICAgICogd2hlcmVcbiAgICAgICAgICogIC0gZXZlbnQ6IGFuIEV2ZW50IG9iamVjdC5cbiAgICAgICAgICogIC0gYXR0cmlidXRlOiB0aGUgYXR0cmlidXRlIGJlaW5nIHZhbGlkYXRlZC4gUGxlYXNlIHJlZmVyIHRvIGF0dHJpYnV0ZURlZmF1bHRzIGZvciB0aGUgc3RydWN0dXJlIG9mIHRoaXMgcGFyYW1ldGVyLlxuICAgICAgICAgKiAgLSBtZXNzYWdlczogYW4gYXJyYXkgdG8gd2hpY2ggeW91IGNhbiBhZGQgYWRkaXRpb25hbCB2YWxpZGF0aW9uIGVycm9yIG1lc3NhZ2VzIGZvciB0aGUgc3BlY2lmaWVkIGF0dHJpYnV0ZS5cbiAgICAgICAgICovXG4gICAgICAgIGFmdGVyVmFsaWRhdGVBdHRyaWJ1dGU6ICdhZnRlclZhbGlkYXRlQXR0cmlidXRlJyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGJlZm9yZVN1Ym1pdCBldmVudCBpcyB0cmlnZ2VyZWQgYmVmb3JlIHN1Ym1pdHRpbmcgdGhlIGZvcm0gYWZ0ZXIgYWxsIHZhbGlkYXRpb25zIGhhdmUgcGFzc2VkLlxuICAgICAgICAgKiBUaGUgc2lnbmF0dXJlIG9mIHRoZSBldmVudCBoYW5kbGVyIHNob3VsZCBiZTpcbiAgICAgICAgICogICAgIGZ1bmN0aW9uIChldmVudClcbiAgICAgICAgICogd2hlcmUgZXZlbnQgaXMgYW4gRXZlbnQgb2JqZWN0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBJZiB0aGUgaGFuZGxlciByZXR1cm5zIGEgYm9vbGVhbiBmYWxzZSwgaXQgd2lsbCBzdG9wIGZvcm0gc3VibWlzc2lvbi5cbiAgICAgICAgICovXG4gICAgICAgIGJlZm9yZVN1Ym1pdDogJ2JlZm9yZVN1Ym1pdCcsXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBhamF4QmVmb3JlU2VuZCBldmVudCBpcyB0cmlnZ2VyZWQgYmVmb3JlIHNlbmRpbmcgYW4gQUpBWCByZXF1ZXN0IGZvciBBSkFYLWJhc2VkIHZhbGlkYXRpb24uXG4gICAgICAgICAqIFRoZSBzaWduYXR1cmUgb2YgdGhlIGV2ZW50IGhhbmRsZXIgc2hvdWxkIGJlOlxuICAgICAgICAgKiAgICAgZnVuY3Rpb24gKGV2ZW50LCBqcVhIUiwgc2V0dGluZ3MpXG4gICAgICAgICAqIHdoZXJlXG4gICAgICAgICAqICAtIGV2ZW50OiBhbiBFdmVudCBvYmplY3QuXG4gICAgICAgICAqICAtIGpxWEhSOiBhIGpxWEhSIG9iamVjdFxuICAgICAgICAgKiAgLSBzZXR0aW5nczogdGhlIHNldHRpbmdzIGZvciB0aGUgQUpBWCByZXF1ZXN0XG4gICAgICAgICAqL1xuICAgICAgICBhamF4QmVmb3JlU2VuZDogJ2FqYXhCZWZvcmVTZW5kJyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGFqYXhDb21wbGV0ZSBldmVudCBpcyB0cmlnZ2VyZWQgYWZ0ZXIgY29tcGxldGluZyBhbiBBSkFYIHJlcXVlc3QgZm9yIEFKQVgtYmFzZWQgdmFsaWRhdGlvbi5cbiAgICAgICAgICogVGhlIHNpZ25hdHVyZSBvZiB0aGUgZXZlbnQgaGFuZGxlciBzaG91bGQgYmU6XG4gICAgICAgICAqICAgICBmdW5jdGlvbiAoZXZlbnQsIGpxWEhSLCB0ZXh0U3RhdHVzKVxuICAgICAgICAgKiB3aGVyZVxuICAgICAgICAgKiAgLSBldmVudDogYW4gRXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiAgLSBqcVhIUjogYSBqcVhIUiBvYmplY3RcbiAgICAgICAgICogIC0gdGV4dFN0YXR1czogdGhlIHN0YXR1cyBvZiB0aGUgcmVxdWVzdCAoXCJzdWNjZXNzXCIsIFwibm90bW9kaWZpZWRcIiwgXCJlcnJvclwiLCBcInRpbWVvdXRcIiwgXCJhYm9ydFwiLCBvciBcInBhcnNlcmVycm9yXCIpLlxuICAgICAgICAgKi9cbiAgICAgICAgYWpheENvbXBsZXRlOiAnYWpheENvbXBsZXRlJyxcbiAgICAgICAgLyoqXG4gICAgICAgICAqIGFmdGVySW5pdCBldmVudCBpcyB0cmlnZ2VyZWQgYWZ0ZXIgeWlpIGFjdGl2ZUZvcm0gaW5pdC5cbiAgICAgICAgICogVGhlIHNpZ25hdHVyZSBvZiB0aGUgZXZlbnQgaGFuZGxlciBzaG91bGQgYmU6XG4gICAgICAgICAqICAgICBmdW5jdGlvbiAoZXZlbnQpXG4gICAgICAgICAqIHdoZXJlXG4gICAgICAgICAqICAtIGV2ZW50OiBhbiBFdmVudCBvYmplY3QuXG4gICAgICAgICAqLyAgICAgICAgXG4gICAgICAgIGFmdGVySW5pdDogJ2FmdGVySW5pdCdcbiAgICB9O1xuXG4gICAgLy8gTk9URTogSWYgeW91IGNoYW5nZSBhbnkgb2YgdGhlc2UgZGVmYXVsdHMsIG1ha2Ugc3VyZSB5b3UgdXBkYXRlIHlpaVxcd2lkZ2V0c1xcQWN0aXZlRm9ybTo6Z2V0Q2xpZW50T3B0aW9ucygpIGFzIHdlbGxcbiAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgIC8vIHdoZXRoZXIgdG8gZW5jb2RlIHRoZSBlcnJvciBzdW1tYXJ5XG4gICAgICAgIGVuY29kZUVycm9yU3VtbWFyeTogdHJ1ZSxcbiAgICAgICAgLy8gdGhlIGpRdWVyeSBzZWxlY3RvciBmb3IgdGhlIGVycm9yIHN1bW1hcnlcbiAgICAgICAgZXJyb3JTdW1tYXJ5OiAnLmVycm9yLXN1bW1hcnknLFxuICAgICAgICAvLyB3aGV0aGVyIHRvIHBlcmZvcm0gdmFsaWRhdGlvbiBiZWZvcmUgc3VibWl0dGluZyB0aGUgZm9ybS5cbiAgICAgICAgdmFsaWRhdGVPblN1Ym1pdDogdHJ1ZSxcbiAgICAgICAgLy8gdGhlIGNvbnRhaW5lciBDU1MgY2xhc3MgcmVwcmVzZW50aW5nIHRoZSBjb3JyZXNwb25kaW5nIGF0dHJpYnV0ZSBoYXMgdmFsaWRhdGlvbiBlcnJvclxuICAgICAgICBlcnJvckNzc0NsYXNzOiAnaGFzLWVycm9yJyxcbiAgICAgICAgLy8gdGhlIGNvbnRhaW5lciBDU1MgY2xhc3MgcmVwcmVzZW50aW5nIHRoZSBjb3JyZXNwb25kaW5nIGF0dHJpYnV0ZSBwYXNzZXMgdmFsaWRhdGlvblxuICAgICAgICBzdWNjZXNzQ3NzQ2xhc3M6ICdoYXMtc3VjY2VzcycsXG4gICAgICAgIC8vIHRoZSBjb250YWluZXIgQ1NTIGNsYXNzIHJlcHJlc2VudGluZyB0aGUgY29ycmVzcG9uZGluZyBhdHRyaWJ1dGUgaXMgYmVpbmcgdmFsaWRhdGVkXG4gICAgICAgIHZhbGlkYXRpbmdDc3NDbGFzczogJ3ZhbGlkYXRpbmcnLFxuICAgICAgICAvLyB0aGUgR0VUIHBhcmFtZXRlciBuYW1lIGluZGljYXRpbmcgYW4gQUpBWC1iYXNlZCB2YWxpZGF0aW9uXG4gICAgICAgIGFqYXhQYXJhbTogJ2FqYXgnLFxuICAgICAgICAvLyB0aGUgdHlwZSBvZiBkYXRhIHRoYXQgeW91J3JlIGV4cGVjdGluZyBiYWNrIGZyb20gdGhlIHNlcnZlclxuICAgICAgICBhamF4RGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgLy8gdGhlIFVSTCBmb3IgcGVyZm9ybWluZyBBSkFYLWJhc2VkIHZhbGlkYXRpb24uIElmIG5vdCBzZXQsIGl0IHdpbGwgdXNlIHRoZSB0aGUgZm9ybSdzIGFjdGlvblxuICAgICAgICB2YWxpZGF0aW9uVXJsOiB1bmRlZmluZWQsXG4gICAgICAgIC8vIHdoZXRoZXIgdG8gc2Nyb2xsIHRvIGZpcnN0IHZpc2libGUgZXJyb3IgYWZ0ZXIgdmFsaWRhdGlvbi5cbiAgICAgICAgc2Nyb2xsVG9FcnJvcjogdHJ1ZSxcbiAgICAgICAgLy8gb2Zmc2V0IGluIHBpeGVscyB0aGF0IHNob3VsZCBiZSBhZGRlZCB3aGVuIHNjcm9sbGluZyB0byB0aGUgZmlyc3QgZXJyb3IuXG4gICAgICAgIHNjcm9sbFRvRXJyb3JPZmZzZXQ6IDBcbiAgICB9O1xuXG4gICAgLy8gTk9URTogSWYgeW91IGNoYW5nZSBhbnkgb2YgdGhlc2UgZGVmYXVsdHMsIG1ha2Ugc3VyZSB5b3UgdXBkYXRlIHlpaVxcd2lkZ2V0c1xcQWN0aXZlRmllbGQ6OmdldENsaWVudE9wdGlvbnMoKSBhcyB3ZWxsXG4gICAgdmFyIGF0dHJpYnV0ZURlZmF1bHRzID0ge1xuICAgICAgICAvLyBhIHVuaXF1ZSBJRCBpZGVudGlmeWluZyBhbiBhdHRyaWJ1dGUgKGUuZy4gXCJsb2dpbmZvcm0tdXNlcm5hbWVcIikgaW4gYSBmb3JtXG4gICAgICAgIGlkOiB1bmRlZmluZWQsXG4gICAgICAgIC8vIGF0dHJpYnV0ZSBuYW1lIG9yIGV4cHJlc3Npb24gKGUuZy4gXCJbMF1jb250ZW50XCIgZm9yIHRhYnVsYXIgaW5wdXQpXG4gICAgICAgIG5hbWU6IHVuZGVmaW5lZCxcbiAgICAgICAgLy8gdGhlIGpRdWVyeSBzZWxlY3RvciBvZiB0aGUgY29udGFpbmVyIG9mIHRoZSBpbnB1dCBmaWVsZFxuICAgICAgICBjb250YWluZXI6IHVuZGVmaW5lZCxcbiAgICAgICAgLy8gdGhlIGpRdWVyeSBzZWxlY3RvciBvZiB0aGUgaW5wdXQgZmllbGQgdW5kZXIgdGhlIGNvbnRleHQgb2YgdGhlIGZvcm1cbiAgICAgICAgaW5wdXQ6IHVuZGVmaW5lZCxcbiAgICAgICAgLy8gdGhlIGpRdWVyeSBzZWxlY3RvciBvZiB0aGUgZXJyb3IgdGFnIHVuZGVyIHRoZSBjb250ZXh0IG9mIHRoZSBjb250YWluZXJcbiAgICAgICAgZXJyb3I6ICcuaGVscC1ibG9jaycsXG4gICAgICAgIC8vIHdoZXRoZXIgdG8gZW5jb2RlIHRoZSBlcnJvclxuICAgICAgICBlbmNvZGVFcnJvcjogdHJ1ZSxcbiAgICAgICAgLy8gd2hldGhlciB0byBwZXJmb3JtIHZhbGlkYXRpb24gd2hlbiBhIGNoYW5nZSBpcyBkZXRlY3RlZCBvbiB0aGUgaW5wdXRcbiAgICAgICAgdmFsaWRhdGVPbkNoYW5nZTogdHJ1ZSxcbiAgICAgICAgLy8gd2hldGhlciB0byBwZXJmb3JtIHZhbGlkYXRpb24gd2hlbiB0aGUgaW5wdXQgbG9zZXMgZm9jdXNcbiAgICAgICAgdmFsaWRhdGVPbkJsdXI6IHRydWUsXG4gICAgICAgIC8vIHdoZXRoZXIgdG8gcGVyZm9ybSB2YWxpZGF0aW9uIHdoZW4gdGhlIHVzZXIgaXMgdHlwaW5nLlxuICAgICAgICB2YWxpZGF0ZU9uVHlwZTogZmFsc2UsXG4gICAgICAgIC8vIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCB0aGUgdmFsaWRhdGlvbiBzaG91bGQgYmUgZGVsYXllZCB3aGVuIGEgdXNlciBpcyB0eXBpbmcgaW4gdGhlIGlucHV0IGZpZWxkLlxuICAgICAgICB2YWxpZGF0aW9uRGVsYXk6IDUwMCxcbiAgICAgICAgLy8gd2hldGhlciB0byBlbmFibGUgQUpBWC1iYXNlZCB2YWxpZGF0aW9uLlxuICAgICAgICBlbmFibGVBamF4VmFsaWRhdGlvbjogZmFsc2UsXG4gICAgICAgIC8vIGZ1bmN0aW9uIChhdHRyaWJ1dGUsIHZhbHVlLCBtZXNzYWdlcywgZGVmZXJyZWQsICRmb3JtKSwgdGhlIGNsaWVudC1zaWRlIHZhbGlkYXRpb24gZnVuY3Rpb24uXG4gICAgICAgIHZhbGlkYXRlOiB1bmRlZmluZWQsXG4gICAgICAgIC8vIHN0YXR1cyBvZiB0aGUgaW5wdXQgZmllbGQsIDA6IGVtcHR5LCBub3QgZW50ZXJlZCBiZWZvcmUsIDE6IHZhbGlkYXRlZCwgMjogcGVuZGluZyB2YWxpZGF0aW9uLCAzOiB2YWxpZGF0aW5nXG4gICAgICAgIHN0YXR1czogMCxcbiAgICAgICAgLy8gd2hldGhlciB0aGUgdmFsaWRhdGlvbiBpcyBjYW5jZWxsZWQgYnkgYmVmb3JlVmFsaWRhdGVBdHRyaWJ1dGUgZXZlbnQgaGFuZGxlclxuICAgICAgICBjYW5jZWxsZWQ6IGZhbHNlLFxuICAgICAgICAvLyB0aGUgdmFsdWUgb2YgdGhlIGlucHV0XG4gICAgICAgIHZhbHVlOiB1bmRlZmluZWQsXG4gICAgICAgIC8vIHdoZXRoZXIgdG8gdXBkYXRlIGFyaWEtaW52YWxpZCBhdHRyaWJ1dGUgYWZ0ZXIgdmFsaWRhdGlvblxuICAgICAgICB1cGRhdGVBcmlhSW52YWxpZDogdHJ1ZVxuICAgIH07XG5cblxuICAgIHZhciBzdWJtaXREZWZlcjtcblxuICAgIHZhciBzZXRTdWJtaXRGaW5hbGl6ZURlZmVyID0gZnVuY3Rpb24oJGZvcm0pIHtcbiAgICAgICAgc3VibWl0RGVmZXIgPSAkLkRlZmVycmVkKCk7XG4gICAgICAgICRmb3JtLmRhdGEoJ3lpaVN1Ym1pdEZpbmFsaXplUHJvbWlzZScsIHN1Ym1pdERlZmVyLnByb21pc2UoKSk7XG4gICAgfTtcblxuICAgIC8vIGZpbmFsaXplIHlpaS5qcyAkZm9ybS5zdWJtaXRcbiAgICB2YXIgc3VibWl0RmluYWxpemUgPSBmdW5jdGlvbigkZm9ybSkge1xuICAgICAgICBpZihzdWJtaXREZWZlcikge1xuICAgICAgICAgICAgc3VibWl0RGVmZXIucmVzb2x2ZSgpO1xuICAgICAgICAgICAgc3VibWl0RGVmZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAkZm9ybS5yZW1vdmVEYXRhKCd5aWlTdWJtaXRGaW5hbGl6ZVByb21pc2UnKTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIHZhciBtZXRob2RzID0ge1xuICAgICAgICBpbml0OiBmdW5jdGlvbiAoYXR0cmlidXRlcywgb3B0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyICRmb3JtID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICBpZiAoJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMgfHwge30pO1xuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy52YWxpZGF0aW9uVXJsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MudmFsaWRhdGlvblVybCA9ICRmb3JtLmF0dHIoJ2FjdGlvbicpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICQuZWFjaChhdHRyaWJ1dGVzLCBmdW5jdGlvbiAoaSkge1xuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzW2ldID0gJC5leHRlbmQoe3ZhbHVlOiBnZXRWYWx1ZSgkZm9ybSwgdGhpcyl9LCBhdHRyaWJ1dGVEZWZhdWx0cywgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIHdhdGNoQXR0cmlidXRlKCRmb3JtLCBhdHRyaWJ1dGVzW2ldKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nLCB7XG4gICAgICAgICAgICAgICAgICAgIHNldHRpbmdzOiBzZXR0aW5ncyxcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczogYXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICAgICAgc3VibWl0dGluZzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IGdldEZvcm1PcHRpb25zKCRmb3JtKVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgICAgICogQ2xlYW4gdXAgZXJyb3Igc3RhdHVzIHdoZW4gdGhlIGZvcm0gaXMgcmVzZXQuXG4gICAgICAgICAgICAgICAgICogTm90ZSB0aGF0ICRmb3JtLm9uKCdyZXNldCcsIC4uLikgZG9lcyB3b3JrIGJlY2F1c2UgdGhlIFwicmVzZXRcIiBldmVudCBkb2VzIG5vdCBidWJibGUgb24gSUUuXG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgJGZvcm0uYmluZCgncmVzZXQueWlpQWN0aXZlRm9ybScsIG1ldGhvZHMucmVzZXRGb3JtKTtcblxuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy52YWxpZGF0ZU9uU3VibWl0KSB7XG4gICAgICAgICAgICAgICAgICAgICRmb3JtLm9uKCdtb3VzZXVwLnlpaUFjdGl2ZUZvcm0ga2V5dXAueWlpQWN0aXZlRm9ybScsICc6c3VibWl0JywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScpLnN1Ym1pdE9iamVjdCA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAkZm9ybS5vbignc3VibWl0LnlpaUFjdGl2ZUZvcm0nLCBtZXRob2RzLnN1Ym1pdEZvcm0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgZXZlbnQgPSAkLkV2ZW50KGV2ZW50cy5hZnRlckluaXQpO1xuICAgICAgICAgICAgICAgICRmb3JtLnRyaWdnZXIoZXZlbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gYWRkIGEgbmV3IGF0dHJpYnV0ZSB0byB0aGUgZm9ybSBkeW5hbWljYWxseS5cbiAgICAgICAgLy8gcGxlYXNlIHJlZmVyIHRvIGF0dHJpYnV0ZURlZmF1bHRzIGZvciB0aGUgc3RydWN0dXJlIG9mIGF0dHJpYnV0ZVxuICAgICAgICBhZGQ6IGZ1bmN0aW9uIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICQodGhpcyk7XG4gICAgICAgICAgICBhdHRyaWJ1dGUgPSAkLmV4dGVuZCh7dmFsdWU6IGdldFZhbHVlKCRmb3JtLCBhdHRyaWJ1dGUpfSwgYXR0cmlidXRlRGVmYXVsdHMsIGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJykuYXR0cmlidXRlcy5wdXNoKGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICB3YXRjaEF0dHJpYnV0ZSgkZm9ybSwgYXR0cmlidXRlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyByZW1vdmUgdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBzcGVjaWZpZWQgSUQgZnJvbSB0aGUgZm9ybVxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgdmFyICRmb3JtID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzID0gJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScpLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAkLmVhY2goYXR0cmlidXRlcywgZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlc1tpXVsnaWQnXSA9PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgYXR0cmlidXRlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIHVud2F0Y2hBdHRyaWJ1dGUoJGZvcm0sIGF0dHJpYnV0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXR0cmlidXRlO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIG1hbnVhbGx5IHRyaWdnZXIgdGhlIHZhbGlkYXRpb24gb2YgdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBzcGVjaWZpZWQgSURcbiAgICAgICAgdmFsaWRhdGVBdHRyaWJ1dGU6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZSA9IG1ldGhvZHMuZmluZC5jYWxsKHRoaXMsIGlkKTtcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdmFsaWRhdGVBdHRyaWJ1dGUoJCh0aGlzKSwgYXR0cmlidXRlLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyBmaW5kIGFuIGF0dHJpYnV0ZSBjb25maWcgYmFzZWQgb24gdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGUgSURcbiAgICAgICAgZmluZDogZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlcyA9ICQodGhpcykuZGF0YSgneWlpQWN0aXZlRm9ybScpLmF0dHJpYnV0ZXMsXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgJC5lYWNoKGF0dHJpYnV0ZXMsIGZ1bmN0aW9uIChpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZXNbaV1bJ2lkJ10gPT0gaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gYXR0cmlidXRlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSxcblxuICAgICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnVuYmluZCgnLnlpaUFjdGl2ZUZvcm0nKTtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZURhdGEoJ3lpaUFjdGl2ZUZvcm0nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGRhdGE6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyB2YWxpZGF0ZSBhbGwgYXBwbGljYWJsZSBpbnB1dHMgaW4gdGhlIGZvcm1cbiAgICAgICAgdmFsaWRhdGU6IGZ1bmN0aW9uIChmb3JjZVZhbGlkYXRlKSB7XG4gICAgICAgICAgICBpZiAoZm9yY2VWYWxpZGF0ZSkge1xuICAgICAgICAgICAgICAgICQodGhpcykuZGF0YSgneWlpQWN0aXZlRm9ybScpLnN1Ym1pdHRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgJGZvcm0gPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgIGRhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyksXG4gICAgICAgICAgICAgICAgbmVlZEFqYXhWYWxpZGF0aW9uID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgbWVzc2FnZXMgPSB7fSxcbiAgICAgICAgICAgICAgICBkZWZlcnJlZHMgPSBkZWZlcnJlZEFycmF5KCksXG4gICAgICAgICAgICAgICAgc3VibWl0dGluZyA9IGRhdGEuc3VibWl0dGluZyAmJiAhZm9yY2VWYWxpZGF0ZTtcblxuICAgICAgICAgICAgaWYgKGRhdGEuc3VibWl0dGluZykge1xuICAgICAgICAgICAgICAgIHZhciBldmVudCA9ICQuRXZlbnQoZXZlbnRzLmJlZm9yZVZhbGlkYXRlKTtcbiAgICAgICAgICAgICAgICAkZm9ybS50cmlnZ2VyKGV2ZW50LCBbbWVzc2FnZXMsIGRlZmVycmVkc10pO1xuXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5zdWJtaXR0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHN1Ym1pdEZpbmFsaXplKCRmb3JtKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gY2xpZW50LXNpZGUgdmFsaWRhdGlvblxuICAgICAgICAgICAgJC5lYWNoKGRhdGEuYXR0cmlidXRlcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuJGZvcm0gPSAkZm9ybTtcbiAgICAgICAgICAgICAgICBpZiAoISQodGhpcy5pbnB1dCkuaXMoXCI6ZGlzYWJsZWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW5jZWxsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gcGVyZm9ybSB2YWxpZGF0aW9uIG9ubHkgaWYgdGhlIGZvcm0gaXMgYmVpbmcgc3VibWl0dGVkIG9yIGlmIGFuIGF0dHJpYnV0ZSBpcyBwZW5kaW5nIHZhbGlkYXRpb25cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VibWl0dGluZyB8fCB0aGlzLnN0YXR1cyA9PT0gMiB8fCB0aGlzLnN0YXR1cyA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1zZyA9IG1lc3NhZ2VzW3RoaXMuaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1zZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNnID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZXNbdGhpcy5pZF0gPSBtc2c7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXZlbnQgPSAkLkV2ZW50KGV2ZW50cy5iZWZvcmVWYWxpZGF0ZUF0dHJpYnV0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS50cmlnZ2VyKGV2ZW50LCBbdGhpcywgbXNnLCBkZWZlcnJlZHNdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudC5yZXN1bHQgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsaWRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YWxpZGF0ZSh0aGlzLCBnZXRWYWx1ZSgkZm9ybSwgdGhpcyksIG1zZywgZGVmZXJyZWRzLCAkZm9ybSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmVuYWJsZUFqYXhWYWxpZGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5lZWRBamF4VmFsaWRhdGlvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbmNlbGxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gYWpheCB2YWxpZGF0aW9uXG4gICAgICAgICAgICAkLndoZW4uYXBwbHkodGhpcywgZGVmZXJyZWRzKS5hbHdheXMoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8gUmVtb3ZlIGVtcHR5IG1lc3NhZ2UgYXJyYXlzXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBtZXNzYWdlcykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoMCA9PT0gbWVzc2FnZXNbaV0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgbWVzc2FnZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5lZWRBamF4VmFsaWRhdGlvbiAmJiAoJC5pc0VtcHR5T2JqZWN0KG1lc3NhZ2VzKSB8fCBkYXRhLnN1Ym1pdHRpbmcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkYnV0dG9uID0gZGF0YS5zdWJtaXRPYmplY3QsXG4gICAgICAgICAgICAgICAgICAgICAgICBleHREYXRhID0gJyYnICsgZGF0YS5zZXR0aW5ncy5hamF4UGFyYW0gKyAnPScgKyAkZm9ybS5hdHRyKCdpZCcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoJGJ1dHRvbiAmJiAkYnV0dG9uLmxlbmd0aCAmJiAkYnV0dG9uLmF0dHIoJ25hbWUnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXh0RGF0YSArPSAnJicgKyAkYnV0dG9uLmF0dHIoJ25hbWUnKSArICc9JyArICRidXR0b24uYXR0cigndmFsdWUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBkYXRhLnNldHRpbmdzLnZhbGlkYXRpb25VcmwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAkZm9ybS5hdHRyKCdtZXRob2QnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6ICRmb3JtLnNlcmlhbGl6ZSgpICsgZXh0RGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBkYXRhLnNldHRpbmdzLmFqYXhEYXRhVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiAoanFYSFIsIHRleHRTdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS50cmlnZ2VyKGV2ZW50cy5hamF4Q29tcGxldGUsIFtqcVhIUiwgdGV4dFN0YXR1c10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uIChqcVhIUiwgc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZm9ybS50cmlnZ2VyKGV2ZW50cy5hamF4QmVmb3JlU2VuZCwgW2pxWEhSLCBzZXR0aW5nc10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChtc2dzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1zZ3MgIT09IG51bGwgJiYgdHlwZW9mIG1zZ3MgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChkYXRhLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5lbmFibGVBamF4VmFsaWRhdGlvbiB8fCB0aGlzLmNhbmNlbGxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBtc2dzW3RoaXMuaWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlSW5wdXRzKCRmb3JtLCAkLmV4dGVuZChtZXNzYWdlcywgbXNncyksIHN1Ym1pdHRpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZUlucHV0cygkZm9ybSwgbWVzc2FnZXMsIHN1Ym1pdHRpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuc3VibWl0dGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Ym1pdEZpbmFsaXplKCRmb3JtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLnN1Ym1pdHRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZGVsYXkgY2FsbGJhY2sgc28gdGhhdCB0aGUgZm9ybSBjYW4gYmUgc3VibWl0dGVkIHdpdGhvdXQgcHJvYmxlbVxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZUlucHV0cygkZm9ybSwgbWVzc2FnZXMsIHN1Ym1pdHRpbmcpO1xuICAgICAgICAgICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUlucHV0cygkZm9ybSwgbWVzc2FnZXMsIHN1Ym1pdHRpbmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIHN1Ym1pdEZvcm06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgZGF0YSA9ICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKTtcblxuICAgICAgICAgICAgaWYgKGRhdGEudmFsaWRhdGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gU2Vjb25kIHN1Ym1pdCdzIGNhbGwgKGZyb20gdmFsaWRhdGUvdXBkYXRlSW5wdXRzKVxuICAgICAgICAgICAgICAgIGRhdGEuc3VibWl0dGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHZhciBldmVudCA9ICQuRXZlbnQoZXZlbnRzLmJlZm9yZVN1Ym1pdCk7XG4gICAgICAgICAgICAgICAgJGZvcm0udHJpZ2dlcihldmVudCk7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS52YWxpZGF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgc3VibWl0RmluYWxpemUoJGZvcm0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHVwZGF0ZUhpZGRlbkJ1dHRvbigkZm9ybSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7ICAgLy8gY29udGludWUgc3VibWl0dGluZyB0aGUgZm9ybSBzaW5jZSB2YWxpZGF0aW9uIHBhc3Nlc1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBGaXJzdCBzdWJtaXQncyBjYWxsIChmcm9tIHlpaS5qcy9oYW5kbGVBY3Rpb24pIC0gZXhlY3V0ZSB2YWxpZGF0aW5nXG4gICAgICAgICAgICAgICAgc2V0U3VibWl0RmluYWxpemVEZWZlcigkZm9ybSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5zZXR0aW5ncy50aW1lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChkYXRhLnNldHRpbmdzLnRpbWVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGF0YS5zdWJtaXR0aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBtZXRob2RzLnZhbGlkYXRlLmNhbGwoJGZvcm0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICByZXNldEZvcm06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICQodGhpcyk7XG4gICAgICAgICAgICB2YXIgZGF0YSA9ICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKTtcbiAgICAgICAgICAgIC8vIEJlY2F1c2Ugd2UgYmluZCBkaXJlY3RseSB0byBhIGZvcm0gcmVzZXQgZXZlbnQgaW5zdGVhZCBvZiBhIHJlc2V0IGJ1dHRvbiAodGhhdCBtYXkgbm90IGV4aXN0KSxcbiAgICAgICAgICAgIC8vIHdoZW4gdGhpcyBmdW5jdGlvbiBpcyBleGVjdXRlZCBmb3JtIGlucHV0IHZhbHVlcyBoYXZlIG5vdCBiZWVuIHJlc2V0IHlldC5cbiAgICAgICAgICAgIC8vIFRoZXJlZm9yZSB3ZSBkbyB0aGUgYWN0dWFsIHJlc2V0IHdvcmsgdGhyb3VnaCBzZXRUaW1lb3V0LlxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgJC5lYWNoKGRhdGEuYXR0cmlidXRlcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXaXRob3V0IHNldFRpbWVvdXQoKSB3ZSB3b3VsZCBnZXQgdGhlIGlucHV0IHZhbHVlcyB0aGF0IGFyZSBub3QgcmVzZXQgeWV0LlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gZ2V0VmFsdWUoJGZvcm0sIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXR1cyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkY29udGFpbmVyID0gJGZvcm0uZmluZCh0aGlzLmNvbnRhaW5lcik7XG4gICAgICAgICAgICAgICAgICAgICRjb250YWluZXIucmVtb3ZlQ2xhc3MoXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnNldHRpbmdzLnZhbGlkYXRpbmdDc3NDbGFzcyArICcgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5zZXR0aW5ncy5lcnJvckNzc0NsYXNzICsgJyAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLnNldHRpbmdzLnN1Y2Nlc3NDc3NDbGFzc1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAkY29udGFpbmVyLmZpbmQodGhpcy5lcnJvcikuaHRtbCgnJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJGZvcm0uZmluZChkYXRhLnNldHRpbmdzLmVycm9yU3VtbWFyeSkuaGlkZSgpLmZpbmQoJ3VsJykuaHRtbCgnJyk7XG4gICAgICAgICAgICB9LCAxKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogVXBkYXRlcyBlcnJvciBtZXNzYWdlcywgaW5wdXQgY29udGFpbmVycywgYW5kIG9wdGlvbmFsbHkgc3VtbWFyeSBhcyB3ZWxsLlxuICAgICAgICAgKiBJZiBhbiBhdHRyaWJ1dGUgaXMgbWlzc2luZyBmcm9tIG1lc3NhZ2VzLCBpdCBpcyBjb25zaWRlcmVkIHZhbGlkLlxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZXMgYXJyYXkgdGhlIHZhbGlkYXRpb24gZXJyb3IgbWVzc2FnZXMsIGluZGV4ZWQgYnkgYXR0cmlidXRlIElEc1xuICAgICAgICAgKiBAcGFyYW0gc3VtbWFyeSB3aGV0aGVyIHRvIHVwZGF0ZSBzdW1tYXJ5IGFzIHdlbGwuXG4gICAgICAgICAqL1xuICAgICAgICB1cGRhdGVNZXNzYWdlczogZnVuY3Rpb24gKG1lc3NhZ2VzLCBzdW1tYXJ5KSB7XG4gICAgICAgICAgICB2YXIgJGZvcm0gPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyIGRhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyk7XG4gICAgICAgICAgICAkLmVhY2goZGF0YS5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdXBkYXRlSW5wdXQoJGZvcm0sIHRoaXMsIG1lc3NhZ2VzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHN1bW1hcnkpIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVTdW1tYXJ5KCRmb3JtLCBtZXNzYWdlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFVwZGF0ZXMgZXJyb3IgbWVzc2FnZXMgYW5kIGlucHV0IGNvbnRhaW5lciBvZiBhIHNpbmdsZSBhdHRyaWJ1dGUuXG4gICAgICAgICAqIElmIG1lc3NhZ2VzIGlzIGVtcHR5LCB0aGUgYXR0cmlidXRlIGlzIGNvbnNpZGVyZWQgdmFsaWQuXG4gICAgICAgICAqIEBwYXJhbSBpZCBhdHRyaWJ1dGUgSURcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2VzIGFycmF5IHdpdGggZXJyb3IgbWVzc2FnZXNcbiAgICAgICAgICovXG4gICAgICAgIHVwZGF0ZUF0dHJpYnV0ZTogZnVuY3Rpb24oaWQsIG1lc3NhZ2VzKSB7XG4gICAgICAgICAgICB2YXIgYXR0cmlidXRlID0gbWV0aG9kcy5maW5kLmNhbGwodGhpcywgaWQpO1xuICAgICAgICAgICAgaWYgKGF0dHJpYnV0ZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbXNnID0ge307XG4gICAgICAgICAgICAgICAgbXNnW2lkXSA9IG1lc3NhZ2VzO1xuICAgICAgICAgICAgICAgIHVwZGF0ZUlucHV0KCQodGhpcyksIGF0dHJpYnV0ZSwgbXNnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIHZhciB3YXRjaEF0dHJpYnV0ZSA9IGZ1bmN0aW9uICgkZm9ybSwgYXR0cmlidXRlKSB7XG4gICAgICAgIHZhciAkaW5wdXQgPSBmaW5kSW5wdXQoJGZvcm0sIGF0dHJpYnV0ZSk7XG4gICAgICAgIGlmIChhdHRyaWJ1dGUudmFsaWRhdGVPbkNoYW5nZSkge1xuICAgICAgICAgICAgJGlucHV0Lm9uKCdjaGFuZ2UueWlpQWN0aXZlRm9ybScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YWxpZGF0ZUF0dHJpYnV0ZSgkZm9ybSwgYXR0cmlidXRlLCBmYWxzZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cmlidXRlLnZhbGlkYXRlT25CbHVyKSB7XG4gICAgICAgICAgICAkaW5wdXQub24oJ2JsdXIueWlpQWN0aXZlRm9ybScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlLnN0YXR1cyA9PSAwIHx8IGF0dHJpYnV0ZS5zdGF0dXMgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZGF0ZUF0dHJpYnV0ZSgkZm9ybSwgYXR0cmlidXRlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXR0cmlidXRlLnZhbGlkYXRlT25UeXBlKSB7XG4gICAgICAgICAgICAkaW5wdXQub24oJ2tleXVwLnlpaUFjdGl2ZUZvcm0nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGlmICgkLmluQXJyYXkoZS53aGljaCwgWzE2LCAxNywgMTgsIDM3LCAzOCwgMzksIDQwXSkgIT09IC0xICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChhdHRyaWJ1dGUudmFsdWUgIT09IGdldFZhbHVlKCRmb3JtLCBhdHRyaWJ1dGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlQXR0cmlidXRlKCRmb3JtLCBhdHRyaWJ1dGUsIGZhbHNlLCBhdHRyaWJ1dGUudmFsaWRhdGlvbkRlbGF5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgdW53YXRjaEF0dHJpYnV0ZSA9IGZ1bmN0aW9uICgkZm9ybSwgYXR0cmlidXRlKSB7XG4gICAgICAgIGZpbmRJbnB1dCgkZm9ybSwgYXR0cmlidXRlKS5vZmYoJy55aWlBY3RpdmVGb3JtJyk7XG4gICAgfTtcblxuICAgIHZhciB2YWxpZGF0ZUF0dHJpYnV0ZSA9IGZ1bmN0aW9uICgkZm9ybSwgYXR0cmlidXRlLCBmb3JjZVZhbGlkYXRlLCB2YWxpZGF0aW9uRGVsYXkpIHtcbiAgICAgICAgdmFyIGRhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyk7XG5cbiAgICAgICAgaWYgKGZvcmNlVmFsaWRhdGUpIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZS5zdGF0dXMgPSAyO1xuICAgICAgICB9XG4gICAgICAgICQuZWFjaChkYXRhLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlICE9PSBnZXRWYWx1ZSgkZm9ybSwgdGhpcykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXR1cyA9IDI7XG4gICAgICAgICAgICAgICAgZm9yY2VWYWxpZGF0ZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIWZvcmNlVmFsaWRhdGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkYXRhLnNldHRpbmdzLnRpbWVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChkYXRhLnNldHRpbmdzLnRpbWVyKTtcbiAgICAgICAgfVxuICAgICAgICBkYXRhLnNldHRpbmdzLnRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoZGF0YS5zdWJtaXR0aW5nIHx8ICRmb3JtLmlzKCc6aGlkZGVuJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkLmVhY2goZGF0YS5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gMztcbiAgICAgICAgICAgICAgICAgICAgJGZvcm0uZmluZCh0aGlzLmNvbnRhaW5lcikuYWRkQ2xhc3MoZGF0YS5zZXR0aW5ncy52YWxpZGF0aW5nQ3NzQ2xhc3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbWV0aG9kcy52YWxpZGF0ZS5jYWxsKCRmb3JtKTtcbiAgICAgICAgfSwgdmFsaWRhdGlvbkRlbGF5ID8gdmFsaWRhdGlvbkRlbGF5IDogMjAwKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBhcnJheSBwcm90b3R5cGUgd2l0aCBhIHNob3J0Y3V0IG1ldGhvZCBmb3IgYWRkaW5nIGEgbmV3IGRlZmVycmVkLlxuICAgICAqIFRoZSBjb250ZXh0IG9mIHRoZSBjYWxsYmFjayB3aWxsIGJlIHRoZSBkZWZlcnJlZCBvYmplY3Qgc28gaXQgY2FuIGJlIHJlc29sdmVkIGxpa2UgYGBgdGhpcy5yZXNvbHZlKClgYGBcbiAgICAgKiBAcmV0dXJucyBBcnJheVxuICAgICAqL1xuICAgIHZhciBkZWZlcnJlZEFycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJyYXkgPSBbXTtcbiAgICAgICAgYXJyYXkuYWRkID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMucHVzaChuZXcgJC5EZWZlcnJlZChjYWxsYmFjaykpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgfTtcblxuICAgIHZhciBidXR0b25PcHRpb25zID0gWydhY3Rpb24nLCAndGFyZ2V0JywgJ21ldGhvZCcsICdlbmN0eXBlJ107XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGN1cnJlbnQgZm9ybSBvcHRpb25zXG4gICAgICogQHBhcmFtICRmb3JtXG4gICAgICogQHJldHVybnMgb2JqZWN0IE9iamVjdCB3aXRoIGJ1dHRvbiBvZiBmb3JtIG9wdGlvbnNcbiAgICAgKi9cbiAgICB2YXIgZ2V0Rm9ybU9wdGlvbnMgPSBmdW5jdGlvbiAoJGZvcm0pIHtcbiAgICAgICAgdmFyIGF0dHJpYnV0ZXMgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBidXR0b25PcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzW2J1dHRvbk9wdGlvbnNbaV1dID0gJGZvcm0uYXR0cihidXR0b25PcHRpb25zW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXR0cmlidXRlcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQXBwbGllcyB0ZW1wb3JhcnkgZm9ybSBvcHRpb25zIHJlbGF0ZWQgdG8gc3VibWl0IGJ1dHRvblxuICAgICAqIEBwYXJhbSAkZm9ybSB0aGUgZm9ybSBqUXVlcnkgb2JqZWN0XG4gICAgICogQHBhcmFtICRidXR0b24gdGhlIGJ1dHRvbiBqUXVlcnkgb2JqZWN0XG4gICAgICovXG4gICAgdmFyIGFwcGx5QnV0dG9uT3B0aW9ucyA9IGZ1bmN0aW9uICgkZm9ybSwgJGJ1dHRvbikge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJ1dHRvbk9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9ICRidXR0b24uYXR0cignZm9ybScgKyBidXR0b25PcHRpb25zW2ldKTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICRmb3JtLmF0dHIoYnV0dG9uT3B0aW9uc1tpXSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlc3RvcmVzIG9yaWdpbmFsIGZvcm0gb3B0aW9uc1xuICAgICAqIEBwYXJhbSAkZm9ybSB0aGUgZm9ybSBqUXVlcnkgb2JqZWN0XG4gICAgICovXG4gICAgdmFyIHJlc3RvcmVCdXR0b25PcHRpb25zID0gZnVuY3Rpb24gKCRmb3JtKSB7XG4gICAgICAgIHZhciBkYXRhID0gJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnV0dG9uT3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgJGZvcm0uYXR0cihidXR0b25PcHRpb25zW2ldLCBkYXRhLm9wdGlvbnNbYnV0dG9uT3B0aW9uc1tpXV0gfHwgbnVsbCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgZXJyb3IgbWVzc2FnZXMgYW5kIHRoZSBpbnB1dCBjb250YWluZXJzIGZvciBhbGwgYXBwbGljYWJsZSBhdHRyaWJ1dGVzXG4gICAgICogQHBhcmFtICRmb3JtIHRoZSBmb3JtIGpRdWVyeSBvYmplY3RcbiAgICAgKiBAcGFyYW0gbWVzc2FnZXMgYXJyYXkgdGhlIHZhbGlkYXRpb24gZXJyb3IgbWVzc2FnZXNcbiAgICAgKiBAcGFyYW0gc3VibWl0dGluZyB3aGV0aGVyIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCBhZnRlciB2YWxpZGF0aW9uIHRyaWdnZXJlZCBieSBmb3JtIHN1Ym1pc3Npb25cbiAgICAgKi9cbiAgICB2YXIgdXBkYXRlSW5wdXRzID0gZnVuY3Rpb24gKCRmb3JtLCBtZXNzYWdlcywgc3VibWl0dGluZykge1xuICAgICAgICB2YXIgZGF0YSA9ICRmb3JtLmRhdGEoJ3lpaUFjdGl2ZUZvcm0nKTtcblxuICAgICAgICBpZiAoZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3VibWl0dGluZykge1xuICAgICAgICAgICAgdmFyIGVycm9yQXR0cmlidXRlcyA9IFtdO1xuICAgICAgICAgICAgJC5lYWNoKGRhdGEuYXR0cmlidXRlcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghJCh0aGlzLmlucHV0KS5pcyhcIjpkaXNhYmxlZFwiKSAmJiAhdGhpcy5jYW5jZWxsZWQgJiYgdXBkYXRlSW5wdXQoJGZvcm0sIHRoaXMsIG1lc3NhZ2VzKSkge1xuICAgICAgICAgICAgICAgICAgICBlcnJvckF0dHJpYnV0ZXMucHVzaCh0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJGZvcm0udHJpZ2dlcihldmVudHMuYWZ0ZXJWYWxpZGF0ZSwgW21lc3NhZ2VzLCBlcnJvckF0dHJpYnV0ZXNdKTtcblxuICAgICAgICAgICAgdXBkYXRlU3VtbWFyeSgkZm9ybSwgbWVzc2FnZXMpO1xuXG4gICAgICAgICAgICBpZiAoZXJyb3JBdHRyaWJ1dGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnNldHRpbmdzLnNjcm9sbFRvRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRvcCA9ICRmb3JtLmZpbmQoJC5tYXAoZXJyb3JBdHRyaWJ1dGVzLCBmdW5jdGlvbihhdHRyaWJ1dGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhdHRyaWJ1dGUuaW5wdXQ7XG4gICAgICAgICAgICAgICAgICAgIH0pLmpvaW4oJywnKSkuZmlyc3QoKS5jbG9zZXN0KCc6dmlzaWJsZScpLm9mZnNldCgpLnRvcCAtIGRhdGEuc2V0dGluZ3Muc2Nyb2xsVG9FcnJvck9mZnNldDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRvcCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodG9wID4gJChkb2N1bWVudCkuaGVpZ2h0KCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcCA9ICQoZG9jdW1lbnQpLmhlaWdodCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHZhciB3dG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodG9wIDwgd3RvcCB8fCB0b3AgPiB3dG9wICsgJCh3aW5kb3cpLmhlaWdodCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykuc2Nyb2xsVG9wKHRvcCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGF0YS5zdWJtaXR0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRhdGEudmFsaWRhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWJtaXRPYmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgYXBwbHlCdXR0b25PcHRpb25zKCRmb3JtLCBkYXRhLnN1Ym1pdE9iamVjdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICRmb3JtLnN1Ym1pdCgpO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Ym1pdE9iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICByZXN0b3JlQnV0dG9uT3B0aW9ucygkZm9ybSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJC5lYWNoKGRhdGEuYXR0cmlidXRlcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jYW5jZWxsZWQgJiYgKHRoaXMuc3RhdHVzID09PSAyIHx8IHRoaXMuc3RhdHVzID09PSAzKSkge1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVJbnB1dCgkZm9ybSwgdGhpcywgbWVzc2FnZXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHN1Ym1pdEZpbmFsaXplKCRmb3JtKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyBoaWRkZW4gZmllbGQgdGhhdCByZXByZXNlbnRzIGNsaWNrZWQgc3VibWl0IGJ1dHRvbi5cbiAgICAgKiBAcGFyYW0gJGZvcm0gdGhlIGZvcm0galF1ZXJ5IG9iamVjdC5cbiAgICAgKi9cbiAgICB2YXIgdXBkYXRlSGlkZGVuQnV0dG9uID0gZnVuY3Rpb24gKCRmb3JtKSB7XG4gICAgICAgIHZhciBkYXRhID0gJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScpO1xuICAgICAgICB2YXIgJGJ1dHRvbiA9IGRhdGEuc3VibWl0T2JqZWN0IHx8ICRmb3JtLmZpbmQoJzpzdWJtaXQ6Zmlyc3QnKTtcbiAgICAgICAgLy8gVE9ETzogaWYgdGhlIHN1Ym1pc3Npb24gaXMgY2F1c2VkIGJ5IFwiY2hhbmdlXCIgZXZlbnQsIGl0IHdpbGwgbm90IHdvcmtcbiAgICAgICAgaWYgKCRidXR0b24ubGVuZ3RoICYmICRidXR0b24uYXR0cigndHlwZScpID09ICdzdWJtaXQnICYmICRidXR0b24uYXR0cignbmFtZScpKSB7XG4gICAgICAgICAgICAvLyBzaW11bGF0ZSBidXR0b24gaW5wdXQgdmFsdWVcbiAgICAgICAgICAgIHZhciAkaGlkZGVuQnV0dG9uID0gJCgnaW5wdXRbdHlwZT1cImhpZGRlblwiXVtuYW1lPVwiJyArICRidXR0b24uYXR0cignbmFtZScpICsgJ1wiXScsICRmb3JtKTtcbiAgICAgICAgICAgIGlmICghJGhpZGRlbkJ1dHRvbi5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkKCc8aW5wdXQ+JykuYXR0cih7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdoaWRkZW4nLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAkYnV0dG9uLmF0dHIoJ25hbWUnKSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6ICRidXR0b24uYXR0cigndmFsdWUnKVxuICAgICAgICAgICAgICAgIH0pLmFwcGVuZFRvKCRmb3JtKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGhpZGRlbkJ1dHRvbi5hdHRyKCd2YWx1ZScsICRidXR0b24uYXR0cigndmFsdWUnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVXBkYXRlcyB0aGUgZXJyb3IgbWVzc2FnZSBhbmQgdGhlIGlucHV0IGNvbnRhaW5lciBmb3IgYSBwYXJ0aWN1bGFyIGF0dHJpYnV0ZS5cbiAgICAgKiBAcGFyYW0gJGZvcm0gdGhlIGZvcm0galF1ZXJ5IG9iamVjdFxuICAgICAqIEBwYXJhbSBhdHRyaWJ1dGUgb2JqZWN0IHRoZSBjb25maWd1cmF0aW9uIGZvciBhIHBhcnRpY3VsYXIgYXR0cmlidXRlLlxuICAgICAqIEBwYXJhbSBtZXNzYWdlcyBhcnJheSB0aGUgdmFsaWRhdGlvbiBlcnJvciBtZXNzYWdlc1xuICAgICAqIEByZXR1cm4gYm9vbGVhbiB3aGV0aGVyIHRoZXJlIGlzIGEgdmFsaWRhdGlvbiBlcnJvciBmb3IgdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGVcbiAgICAgKi9cbiAgICB2YXIgdXBkYXRlSW5wdXQgPSBmdW5jdGlvbiAoJGZvcm0sIGF0dHJpYnV0ZSwgbWVzc2FnZXMpIHtcbiAgICAgICAgdmFyIGRhdGEgPSAkZm9ybS5kYXRhKCd5aWlBY3RpdmVGb3JtJyksXG4gICAgICAgICAgICAkaW5wdXQgPSBmaW5kSW5wdXQoJGZvcm0sIGF0dHJpYnV0ZSksXG4gICAgICAgICAgICBoYXNFcnJvciA9IGZhbHNlO1xuXG4gICAgICAgIGlmICghJC5pc0FycmF5KG1lc3NhZ2VzW2F0dHJpYnV0ZS5pZF0pKSB7XG4gICAgICAgICAgICBtZXNzYWdlc1thdHRyaWJ1dGUuaWRdID0gW107XG4gICAgICAgIH1cbiAgICAgICAgJGZvcm0udHJpZ2dlcihldmVudHMuYWZ0ZXJWYWxpZGF0ZUF0dHJpYnV0ZSwgW2F0dHJpYnV0ZSwgbWVzc2FnZXNbYXR0cmlidXRlLmlkXV0pO1xuXG4gICAgICAgIGF0dHJpYnV0ZS5zdGF0dXMgPSAxO1xuICAgICAgICBpZiAoJGlucHV0Lmxlbmd0aCkge1xuICAgICAgICAgICAgaGFzRXJyb3IgPSBtZXNzYWdlc1thdHRyaWJ1dGUuaWRdLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICB2YXIgJGNvbnRhaW5lciA9ICRmb3JtLmZpbmQoYXR0cmlidXRlLmNvbnRhaW5lcik7XG4gICAgICAgICAgICB2YXIgJGVycm9yID0gJGNvbnRhaW5lci5maW5kKGF0dHJpYnV0ZS5lcnJvcik7XG4gICAgICAgICAgICB1cGRhdGVBcmlhSW52YWxpZCgkZm9ybSwgYXR0cmlidXRlLCBoYXNFcnJvcik7XG4gICAgICAgICAgICBpZiAoaGFzRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXR0cmlidXRlLmVuY29kZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICRlcnJvci50ZXh0KG1lc3NhZ2VzW2F0dHJpYnV0ZS5pZF1bMF0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRlcnJvci5odG1sKG1lc3NhZ2VzW2F0dHJpYnV0ZS5pZF1bMF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkY29udGFpbmVyLnJlbW92ZUNsYXNzKGRhdGEuc2V0dGluZ3MudmFsaWRhdGluZ0Nzc0NsYXNzICsgJyAnICsgZGF0YS5zZXR0aW5ncy5zdWNjZXNzQ3NzQ2xhc3MpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhkYXRhLnNldHRpbmdzLmVycm9yQ3NzQ2xhc3MpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkZXJyb3IuZW1wdHkoKTtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyLnJlbW92ZUNsYXNzKGRhdGEuc2V0dGluZ3MudmFsaWRhdGluZ0Nzc0NsYXNzICsgJyAnICsgZGF0YS5zZXR0aW5ncy5lcnJvckNzc0NsYXNzICsgJyAnKVxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoZGF0YS5zZXR0aW5ncy5zdWNjZXNzQ3NzQ2xhc3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYXR0cmlidXRlLnZhbHVlID0gZ2V0VmFsdWUoJGZvcm0sIGF0dHJpYnV0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhhc0Vycm9yO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIHRoZSBlcnJvciBzdW1tYXJ5LlxuICAgICAqIEBwYXJhbSAkZm9ybSB0aGUgZm9ybSBqUXVlcnkgb2JqZWN0XG4gICAgICogQHBhcmFtIG1lc3NhZ2VzIGFycmF5IHRoZSB2YWxpZGF0aW9uIGVycm9yIG1lc3NhZ2VzXG4gICAgICovXG4gICAgdmFyIHVwZGF0ZVN1bW1hcnkgPSBmdW5jdGlvbiAoJGZvcm0sIG1lc3NhZ2VzKSB7XG4gICAgICAgIHZhciBkYXRhID0gJGZvcm0uZGF0YSgneWlpQWN0aXZlRm9ybScpLFxuICAgICAgICAgICAgJHN1bW1hcnkgPSAkZm9ybS5maW5kKGRhdGEuc2V0dGluZ3MuZXJyb3JTdW1tYXJ5KSxcbiAgICAgICAgICAgICR1bCA9ICRzdW1tYXJ5LmZpbmQoJ3VsJykuZW1wdHkoKTtcblxuICAgICAgICBpZiAoJHN1bW1hcnkubGVuZ3RoICYmIG1lc3NhZ2VzKSB7XG4gICAgICAgICAgICAkLmVhY2goZGF0YS5hdHRyaWJ1dGVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQuaXNBcnJheShtZXNzYWdlc1t0aGlzLmlkXSkgJiYgbWVzc2FnZXNbdGhpcy5pZF0ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9ICQoJzxsaS8+Jyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnNldHRpbmdzLmVuY29kZUVycm9yU3VtbWFyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IudGV4dChtZXNzYWdlc1t0aGlzLmlkXVswXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvci5odG1sKG1lc3NhZ2VzW3RoaXMuaWRdWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkdWwuYXBwZW5kKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICRzdW1tYXJ5LnRvZ2dsZSgkdWwuZmluZCgnbGknKS5sZW5ndGggPiAwKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZ2V0VmFsdWUgPSBmdW5jdGlvbiAoJGZvcm0sIGF0dHJpYnV0ZSkge1xuICAgICAgICB2YXIgJGlucHV0ID0gZmluZElucHV0KCRmb3JtLCBhdHRyaWJ1dGUpO1xuICAgICAgICB2YXIgdHlwZSA9ICRpbnB1dC5hdHRyKCd0eXBlJyk7XG4gICAgICAgIGlmICh0eXBlID09PSAnY2hlY2tib3gnIHx8IHR5cGUgPT09ICdyYWRpbycpIHtcbiAgICAgICAgICAgIHZhciAkcmVhbElucHV0ID0gJGlucHV0LmZpbHRlcignOmNoZWNrZWQnKTtcbiAgICAgICAgICAgIGlmICghJHJlYWxJbnB1dC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAkcmVhbElucHV0ID0gJGZvcm0uZmluZCgnaW5wdXRbdHlwZT1oaWRkZW5dW25hbWU9XCInICsgJGlucHV0LmF0dHIoJ25hbWUnKSArICdcIl0nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAkcmVhbElucHV0LnZhbCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICRpbnB1dC52YWwoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZmluZElucHV0ID0gZnVuY3Rpb24gKCRmb3JtLCBhdHRyaWJ1dGUpIHtcbiAgICAgICAgdmFyICRpbnB1dCA9ICRmb3JtLmZpbmQoYXR0cmlidXRlLmlucHV0KTtcbiAgICAgICAgaWYgKCRpbnB1dC5sZW5ndGggJiYgJGlucHV0WzBdLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2RpdicpIHtcbiAgICAgICAgICAgIC8vIGNoZWNrYm94IGxpc3Qgb3IgcmFkaW8gbGlzdFxuICAgICAgICAgICAgcmV0dXJuICRpbnB1dC5maW5kKCdpbnB1dCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuICRpbnB1dDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgdXBkYXRlQXJpYUludmFsaWQgPSBmdW5jdGlvbiAoJGZvcm0sIGF0dHJpYnV0ZSwgaGFzRXJyb3IpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZS51cGRhdGVBcmlhSW52YWxpZCkge1xuICAgICAgICAgICAgJGZvcm0uZmluZChhdHRyaWJ1dGUuaW5wdXQpLmF0dHIoJ2FyaWEtaW52YWxpZCcsIGhhc0Vycm9yID8gJ3RydWUnIDogJ2ZhbHNlJyk7XG4gICAgICAgIH1cbiAgICB9XG59KSh3aW5kb3cualF1ZXJ5KTtcbiIsIi8qIFxuICogVG8gY2hhbmdlIHRoaXMgbGljZW5zZSBoZWFkZXIsIGNob29zZSBMaWNlbnNlIEhlYWRlcnMgaW4gUHJvamVjdCBQcm9wZXJ0aWVzLlxuICogVG8gY2hhbmdlIHRoaXMgdGVtcGxhdGUgZmlsZSwgY2hvb3NlIFRvb2xzIHwgVGVtcGxhdGVzXG4gKiBhbmQgb3BlbiB0aGUgdGVtcGxhdGUgaW4gdGhlIGVkaXRvci5cbiAqL1xuXG5mdW5jdGlvbiB0ZXh0Q291bnRlcihmaWVsZCxmaWVsZDIsbWF4bGltaXQpXG57XG4gdmFyIGNvdW50ZmllbGQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChmaWVsZDIpO1xuIGlmICggZmllbGQudmFsdWUubGVuZ3RoID4gbWF4bGltaXQgKSB7XG4gIGZpZWxkLnZhbHVlID0gZmllbGQudmFsdWUuc3Vic3RyaW5nKCAwLCBtYXhsaW1pdCApO1xuICByZXR1cm4gZmFsc2U7XG4gfSBlbHNlIHtcbiAgY291bnRmaWVsZC52YWx1ZSA9IG1heGxpbWl0IC0gZmllbGQudmFsdWUubGVuZ3RoO1xuIH1cbn0iLCIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5sb2coJ3JlYWR5Jyk7XG59KTtcbiJdfQ==
