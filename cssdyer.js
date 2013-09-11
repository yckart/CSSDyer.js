/*!
 * cssdyer.js 0.0.1 - https://github.com/yckart/CSSDyer.js
 * Create your very own css-color
 *
 * Copyright (c) 2013 Yannick Albert (http://yckart.com)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2013/09/11
 **/

var CSSDyer = (function () {
    var CSSText = (function () {

        var styles = document.querySelectorAll('style, link');
        var xhr = (function () {
            try { return new(this.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0'); } catch (e) {}
        }());

        return function (fn) {
            for (var i = 0, sheet; (sheet = styles[i++]);)
            if (sheet.tagName === 'LINK') {
                xhr.open('GET', sheet.href, false);
                xhr.onload = function () {
                    fn(xhr.responseText);
                };
                xhr.send();
            } else {
                fn(sheet.textContent || sheet.innerHTML);
            }
        };
    }());

    var CSSRule = function (selector, styles) {
        var sheet = document.styleSheets[document.styleSheets.length-1];
        if (sheet.insertRule) return sheet.insertRule(selector + ' {' + styles + '}', sheet.cssRules.length);
        if (sheet.addRule) return sheet.addRule(selector, styles);
    };

    var CSS_REGEX = /\s*(.*?)\s*{(.*?)}+/g;
    return function (colors) {
        CSSText(function (css) {
            var block;
            css = css.replace(/\n|\r/g, '');
            while((block = CSS_REGEX.exec(css)) !== null) {
                for (var color in colors) {
                    if (block[2].indexOf(color) !== -1) {
                        var lines = block[2].split(';');
                        for (var i = 0, line; line = lines[i++];) {
                            var props = line.split(':');
                            var key = props[0].replace(/ /g, '');
                            var val = props[1].replace(/;| /g, '');
                            CSSRule(block[1], key + ':' + colors[val]);
                        }
                    }
                }
            }
        });
    };
}());