// ==UserScript==
// @name            simple search jump
// @namespace       @caoyue
// @license         MIT License
// @description     百度、Google快捷跳转
// @version         0.5.2
// @author          @caoyue
// @include         *
// @downloadURL     https://github.com/caoyue/userjs/raw/master/simple_search_jump.user.js
// @updateURL       https://github.com/caoyue/userjs/raw/master/simple_search_jump.meta.js
// @grant       GM_addStyle
// @note        tested on Chrome 40 + Tampermonkey， Firefox 35 + GreaseMonkey
// ==/UserScript==

(function () {

    var search_dict = [
        {
            name: 'Google',
            search: 'https://www.google.com/search?newwindow=1&q={0}&oq={0}',
            url: /https?:\/\/(www|encrypted)\.google.(com|com\.hk|co\.jp)\//i,
            keyword: function () {
                var s = document.getElementsByName('q') [0];
                return s != null ? encodeURIComponent(s.value)  : '';
            },
            init: function () {
                word = this.keyword();
                var t = document.getElementById('hdtb-msb');
                for (var i in search_dict) {
                    var k = search_dict[i];
                    if (k.name != this.name) {
                        var jump = document.getElementById(k.name + 'Jump');
                        var rUrl = k.search.replace(/\{0\}/g, word);
                        if (jump != null) {
                            jump.href = rUrl;
                        }
                        else if (t != null) {
                            jump = document.createElement('a');
                            jump.id = k.name + 'Jump';
                            jump.text = k.name;
                            jump.target = '_blank';
                            jump.href = rUrl;
                            jump.title = k.name;
                            jump.setAttribute('style', 'margin:0 10px;padding:0;text-decoration:none;color:#777;');
                            t.appendChild(jump);
                        }
                    }
                }
            }
        },
        {
            name: 'baidu',
            search: 'https://www.baidu.com/#wd={0}&ie=utf-8',
            url: /https?:\/\/www.baidu.com\//i,
            keyword: function () {
                var t = document.getElementById('kw');
                if (t != null && t.value != '') {
                    return encodeURIComponent(t.value);
                }
                var re = /wd=([\s\S]+?)&/i;
                var r = url.match(re);
                return r != null ? r[1] : '';
                var s = document.getElementsByName('wd') [0];
                return s != null ? encodeURIComponent(s.value)  : '';
            },
            init: function () {
                var word = this.keyword();
                var t = document.getElementById('s_tab');
                for (var i in search_dict) {
                    var k = search_dict[i];
                    if (k.name != this.name) {
                        var rUrl = k.search.replace(/\{0\}/g, word);
                        var jump = document.getElementById(k.name + 'Jump');
                        if (jump != null) {
                            jump.href = rUrl;
                        }
                        else {
                            jump = document.createElement('a');
                            jump.id = k.name + 'Jump';
                            jump.text = k.name;
                            jump.target = '_blank';
                            jump.href = rUrl;
                            jump.style = 'margin-left:15px;'
                            t.appendChild(jump);
                        }
                    }
                }
            }
        },
        {
            name: 'Bing',
            search: 'https://bing.com/search?q={0}',
            url: /https?:\/\/(www|global|cn).bing.com\//i,
            keyword: function () {
                var s = document.getElementById('sb_form_q');
                return s != null ? encodeURIComponent(s.value)  : '';
            },
            init: function () {
                GM_addStyle('#b_header .b_scopebar, #b_header #id_h { top: 0; }');
                var word = this.keyword();
                var t = document.getElementsByClassName('b_scopebar')[0].childNodes[0];
                for (var i in search_dict) {
                    var k = search_dict[i];
                    if (k.name != this.name) {
                        var jump = document.getElementById(k.name + 'Jump');
                        var rUrl = k.search.replace(/\{0\}/g, word);
                        if (jump != null) {
                            jump.href = rUrl;
                        }
                        else {
                            if (t != null) {
                                var d = document.createElement('li');
                                t.appendChild(d);
                                jump = document.createElement('a');
                                jump.id = k.name + 'Jump';
                                jump.text = k.name;
                                jump.target = '_blank';
                                jump.href = rUrl;
                                d.appendChild(jump);
                            }
                        }
                    }
                }
            }
        },
        {
            name: 'DDG',
            search: 'https://duckduckgo.com/?q={0}',
            url: undefined,
            keyword: undefined,
            init: undefined
        },
        {
            name: 'SO',
            search: 'http://stackoverflow.com/search?q={0}',
            url: undefined,
            keyword: undefined,
            init: undefined
        },
        {
            name: 'Weibo',
            search: 'http://s.weibo.com/weibo/{0}',
            url: undefined,
            keyword: undefined,
            init: undefined
        },
        {
            name: 'Twitter',
            search: 'https://twitter.com/search?q={0}',
            url: undefined,
            keyword: undefined,
            init: undefined
        },
        {
            name: 'Zhihu',
            search: 'http://www.zhihu.com/search?q={0}&type=question',
            url: undefined,
            keyword: undefined,
            init: undefined
        }
    ];

    /*********************************************************************
    * Baidu 使用了 Ajax 无刷新加载页面，探测页面刷新比较麻烦；
    * 而且同时存在几种刷新方式，尝试过了 onhashchange / history.pushState /
    * 监视 DOMNodeInserted / 监视页面 TitleObserver 等，没有找到通用高效的处理方法；
    * 于是使用了简单暴力无脑的 setInterval (￣△￣|||)
    * 求其他方法XD
    *********************************************************************/

    function Init(time) {
        var location = window.location;
        for (var i in search_dict) {
            var d = search_dict[i];
            if (d.url != undefined && d.init != undefined && d.url.test(location)) {
                if (d.name == 'baidu') {
                    setInterval(function (j) {
                        search_dict[j].init();
                    }, time, i);
                }
                else {
                    d.init();
                }
            }
        }
    }

    Init(2000);

}) ();
