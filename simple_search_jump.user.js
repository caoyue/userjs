// ==UserScript==
// @name			simple search jump
// @namespace		@caoyue
// @license			MIT License
// @description		百度、Google快捷跳转
// @version			0.2
// @author			@caoyue
// @include        *www.baidu.com/*
// @include        *.google.*		
// @downloadURL	   https://raw.githubusercontent.com/caoyue/userjs/master/simple_search_jump.user.js
// @run-at         document-end
// ==/UserScript==
(function () {
    
    SEARCH_DICT = {
        'Google': 'https://google.com/search?newwindow=1&q={0}&oq={0}',
        'DuckDuckGo': 'https://duckduckgo.com/?q={0}',
        'Baidu': 'http://www.baidu.com/#wd={0}&ie=utf-8',
        'StackOverflow': 'http://stackoverflow.com/search?q={0}',
        'Weibo': 'http://s.weibo.com/weibo/{0}',
        'Twitter': 'https://twitter.com/search?q={0}'
    }
    
    Init();
})();

function Init() {
    var host = window.location.host;
    if (host.indexOf('baidu.com') > 1) {
        window.onhashchange = function () {
            BaiduInit();
        }
        BaiduInit();
    } 
    else if (host.indexOf('.google.') > 0) {
        GoogleInit();
    } 
    else {
    }
}

function BaiduInit() {
    var keyword = getBaiduKeyword(window.location.href);
    var t = document.getElementById('s_tab');
    for (var key in SEARCH_DICT) {
        if (key != 'Baidu') {
            var kurl = SEARCH_DICT[key].replace(/\{0\}/g, keyword);
            var jump = document.getElementById(key + 'Jump');
            if (jump != null) {
                jump.href = kurl;
            } 
            else {
                jump = document.createElement('a');
                jump.id = key + 'Jump';
                jump.text = key;
                jump.target = '_blank';
                jump.href = kurl;
                jump.style = 'margin-left:15px;'
                t.appendChild(jump);
            }
        }
    }
}

function GoogleInit() {
    var keyword = getGoogleKeyword(window.location.href);
    var t = document.getElementById('hdtb_more_mn');
    for (var key in SEARCH_DICT) {
        if (key != 'Google') {
            var jump = document.getElementById(key + 'Jump');
            var url = SEARCH_DICT[key].replace(/\{0\}/g, keyword);
            if (jump != null) {
                jump.href = url;
            } 
            else {
                var co = document.getElementById('hdtb_more_mn');
                var d = document.createElement('div');
                if (co != null) {
                    d.className = 'hdtb_mitem';
                    co.appendChild(d);
                    jump = document.createElement('a');
                    jump.id = key + 'Jump';
                    jump.text = key;
                    jump.target = '_blank';
                    jump.href = url;
                    d.appendChild(jump);
                }
            }
        }
    }
}

function getBaiduKeyword(url) {
    var t = document.getElementById('kw');
    if (t != null && t.value != '') return t.value;
    var re = /#wd=([\s\S]+?)&ie=/i;
    var r = url.match(re);
    return r != null ? r[1] : '';
}

function getGoogleKeyword(url) {
    //     var re = /&q=([\s\S]+?)&oq=/i;
    //     var r = url.match(re);
    //     return decodeURIComponent(r[1]);
    var s = document.getElementById('gbqfq');
    return s != null ? s.value : '';
}
