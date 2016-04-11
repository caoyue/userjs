// ==UserScript==
// @name            simple search jump
// @namespace       @caoyue
// @license         MIT License
// @description     搜索引擎快捷跳转
// @version         0.5.4
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
            instant: true,
            keyword: function () {
                var s = document.getElementsByName('q') [0];
                return s !== null ? encodeURIComponent(s.value)  : '';
            },
            init: function () {
                word = this.keyword();
                var t = document.getElementById('hdtb-msb');
                for (var i in search_dict) {
                    var k = search_dict[i];
                    if (k.name != this.name) {
                        var jump = document.getElementById(k.name + 'Jump');
                        var rUrl = k.search.replace(/\{0\}/g, word);
                        if (jump !== null) {
                            jump.href = rUrl;
                        }
                        else if (t !== null) {
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
            instant: true,
            keyword: function () {
                var t = document.getElementById('kw');
                if (t !== null && t.value !== '') {
                    return encodeURIComponent(t.value);
                }
                var re = /wd=([\s\S]+?)&/i;
                var r = url.match(re);
                return r !== null ? r[1] : '';
            },
            init: function () {
                var word = this.keyword();
                var t = document.getElementById('s_tab');
                for (var i in search_dict) {
                    var k = search_dict[i];
                    if (k.name != this.name) {
                        var rUrl = k.search.replace(/\{0\}/g, word);
                        var jump = document.getElementById(k.name + 'Jump');
                        if (jump !== null) {
                            jump.href = rUrl;
                        }
                        else {
                            jump = document.createElement('a');
                            jump.id = k.name + 'Jump';
                            jump.text = k.name;
                            jump.target = '_blank';
                            jump.href = rUrl;
                            jump.style = 'margin-left:15px;';
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
            instant: false,
            keyword: function () {
                var s = document.getElementById('sb_form_q');
                return s !== null ? encodeURIComponent(s.value)  : '';
            },
            init: function () {
                GM_addStyle('#id_h {top: -35px !important;}');
                var word = this.keyword();
                var t = document.getElementsByClassName('b_scopebar')[0].childNodes[0];
                console.log(t);
                for (var i in search_dict) {
                    var k = search_dict[i];
                    if (k.name != this.name) {
                        var jump = document.getElementById(k.name + 'Jump');
                        var rUrl = k.search.replace(/\{0\}/g, word);
                        if (jump !== null) {
                            jump.href = rUrl;
                        }
                        else {
                            if (t !== null) {
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
            instant: undefined,
            keyword: undefined,
            init: undefined
        },
        {
            name: 'SO',
            search: 'http://stackoverflow.com/search?q={0}',
            url: undefined,
            instant: undefined,
            keyword: undefined,
            init: undefined
        },
        {
            name: 'Weibo',
            search: 'http://s.weibo.com/weibo/{0}',
            url: undefined,
            instant: undefined,
            keyword: undefined,
            init: undefined
        },
        {
            name: 'Twitter',
            search: 'https://twitter.com/search?q={0}',
            url: undefined,
            instant: undefined,
            keyword: undefined,
            init: undefined
        },
        {
            name: 'Zhihu',
            search: 'http://www.zhihu.com/search?q={0}&type=question',
            url: undefined,
            instant: undefined,
            keyword: undefined,
            init: undefined
        }
    ];

    function Init(time) {
        var location = window.location;
        for (var i in search_dict) {
            var d = search_dict[i];
            if (d.url !== undefined && d.init !== undefined && d.url.test(location)) {
                if (d.instant) {
                    setInterval(function (j) {
                        search_dict[j].init();
                    }, time, i);
                }
                else {
                    d.init();
                }
                break;
            }
        }
    }

    Init(2000);

}) ();
