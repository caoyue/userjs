// ==UserScript==
// @name            simple search jump
// @namespace       @caoyue
// @license         MIT License
// @description     百度、Google快捷跳转
// @version         0.4
// @author          @caoyue
// @include        *www.baidu.com/*
// @include        *.google.*
// @include        *bing.com/*
// @downloadURL    https://github.com/caoyue/userjs/raw/master/simple_search_jump.user.js
// @updateURL      https://github.com/caoyue/userjs/raw/master/simple_search_jump.meta.js
// @grant       none
// @note        last updated 2015-03-20
// @note        tested on Chrome 40 + Tampermonkey， Firefox 35 + GreaseMonkey
// ==/UserScript==


(function () {

    SEARCH_DICT = {
        'Google': 'https://google.com/search?newwindow=1&q={0}&oq={0}',
        'DDG': 'https://duckduckgo.com/?q={0}',
        'Bing': 'https://bing.com/search?q={0}',
        'Baidu': 'https://www.baidu.com/#wd={0}&ie=utf-8',
        'SO': 'http://stackoverflow.com/search?q={0}',
        'Weibo': 'http://s.weibo.com/weibo/{0}',
        'Twitter': 'https://twitter.com/search?q={0}'
    }

/*********************************************************************
* Google 和 Baidu 使用了 Ajax 无刷新加载页面，探测页面刷新比较麻烦；
* 而且同时存在几种刷新方式，尝试过了 onhashchange / history.pushState /
* 监视 DOMNodeInserted / 监视页面 TitleObserver 等，没有找到通用高效的处理方法；
* 于是使用了简单暴力无脑的 setInterval (￣△￣|||)
* 求其他方法XD
*********************************************************************/
    Init(2000);

//     window.addEventListener("load", TitleObserver, false);

//     window.onhashchange = function(){
//         Init();
//     }


}) ();

// function TitleObserver() {
//     //observer title change to check if that is a new ajax search
//     var observer = new MutationObserver(Init2);
//     var config = {
//         attributes: false,
//         childList: true,
//         characterData: false,
//         subtree: false
//     };
//     observer.observe(document.title, config);
// }

function Init(time) {
  var host = window.location.host;
  if (host.indexOf('baidu.com') > 1) {
    BaiduInit();
    setInterval(function () {
      BaiduInit();
    }, time);
  }
  else if (host.indexOf('.google.') > 0) {
    setInterval(function () {
      GoogleInit();
    }, time);
  }
  else if (host.indexOf('bing.com') > 0) {
    BingInit();
  }
  else {
    //
  }
}

// function Init() {
//     console.log(document.title);
//     setTimeout(function () {

//         var host = window.location.host;
//         if (host.indexOf('baidu.com') > 1) {
//             BaiduInit();
//         }
//         else if (host.indexOf('.google.') > 0) {
//             GoogleInit();
//         }
//             else if (host.indexOf('bing.com') > 0) {
//                 BingInit();
//             }
//             else {
//                 //
//             }

//     },1000);

// }


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
                var d = document.createElement('div');
                if (t != null) {
                    d.className = 'hdtb_mitem';
                    t.appendChild(d);
                    jump = document.createElement('a');
                    jump.id = key + 'Jump';
                    jump.text = key;
                    jump.target = '_blank';
                    jump.href = url;
                    jump.title = key;
                    d.appendChild(jump);
                }
            }
        }
    }
}

function BingInit() {
    var keyword = getBingKeyword(window.location.href);
    var t = document.getElementsByClassName('b_scopebar') [0].childNodes[0];
    for (var key in SEARCH_DICT) {
        if (key != 'Bing') {
            var jump = document.getElementById(key + 'Jump');
            var url = SEARCH_DICT[key].replace(/\{0\}/g, keyword);
            if (jump != null) {
                jump.href = url;
            }
            else {
                if (t != null) {
                    var d = document.createElement('li');
                    t.appendChild(d);
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
    if (t != null && t.value != '') {
        return encodeURIComponent(t.value);
    }
    var re = /wd=([\s\S]+?)&/i;
    var r = url.match(re);
    return r != null ? r[1] : '';
}

function getGoogleKeyword(url) {
    //     var re = /&q=([\s\S]+?)&oq=/i;
    //     var r = url.match(re);
    //     return decodeURIComponent(r[1]);
    var s = document.getElementById('lst-ib');
    return s != null ? encodeURIComponent(s.value)  : '';
}

function getBingKeyword(url) {
    var s = document.getElementById('sb_form_q');
    return s != null ? encodeURIComponent(s.value)  : '';
}
