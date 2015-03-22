// ==UserScript==
// @id             caoyue@v2ex
// @name           v2ex_helper
// @version        1.8.1
// @namespace      caoyue
// @author         caoyue
// @description    v2ex helper
// @include        http://www.v2ex.com/*
// @include        https://*.v2ex.com/*
// @include        http://*.v2ex.com/*
// @include        https://v2ex.com/*
// @include        http://v2ex.com/*
// @downloadURL    https://github.com/caoyue/userjs/raw/master/v2ex_helper.user.js
// @updateURL      https://github.com/caoyue/userjs/raw/master/v2ex_helper.meta.js
// @grant          GM_addStyle


// ==/UserScript==
// Author: caoyue
// Created: 2012-04-11
// Version: 1.8
// Updated: 2015-03-22

var REPLY_COUNT = 2; //只显示最靠近的两条评论
var MAX_LENGTH = 200; //引用评论超过长度则截断
var HIDE_TOPIC_CONTENT = false; //翻页后隐藏主题内容
var REDIRECT = false; // www 自动跳转到裸域
var CUSTOM_SEARCH = false;

GM_addStyle('#replyToolTip {border-radius: 4px;font-size:14px;background-color:rgba(255,255,255,0.9);box-shadow:0 0 7px rgba(0, 0, 0, 0.6);max-width:550px;max-height:500px;padding:6px 10px;position:absolute;}' +
            '#replyToolTip:after { content: "";position: absolute; width: 0;height: 0; border: 7px solid transparent;border-top-color: rgba(255,255,255,0.9);top: 100%;margin-left:10px;}' +
            '#replyToolTip img { max-width:360px !important; max-height:360px !important;}');

(function () {
    if (REDIRECT && location.host == 'www.v2ex.com') {
        location.href = location.href.replace(/www./, '');
    }
}) ();

if (CUSTOM_SEARCH) {
    //var SEARCH = "http://www.google.com/search?q=site:v2ex.com/t%20{{0}}"; //default
    var SEARCH = 'https://www.bing.com/search?q=site%3Av2ex.com%2Ft+{{0}}'; //自定义搜索引擎
    document.forms[0].onsubmit = function () {
        var q = document.getElementById('q');
        if (q.value != '') {
            var url = SEARCH.replace(/\{\{0\}\}/i, q.value);
            if (navigator.userAgent.indexOf('iPad') > - 1 || navigator.userAgent.indexOf('iPhone') > - 1 || navigator.userAgent.indexOf('iPhone') > - 1) {
                location.href = url;
            } else {
                window.open(url, '_blank');
            }
        }
        return false;
    }
};


if (location.href.indexOf('v2ex.com/t') > 0) {
    reply();
}

function reply() {
    document.addEventListener('mouseover', function (e) {
        var link = e.target;
        if (link.nodeName.toLowerCase() == 'a') {
            var authorLink = getAuthor(link);
            if (authorLink.innerHTML != undefined) {
                var originID = authorLink.parentNode.parentNode.getElementsByClassName('no') [0].innerHTML;
                var authorName = authorLink.innerHTML;
                var contentArray = getContent(originID, authorName);
                var content = '<strong>' + authorName + ':</strong><br />';
                var dash = '<p style=\'padding-bottom:5px;border-bottom:1px dashed rgb(226, 226, 226);\'>';
                if (contentArray.length > REPLY_COUNT) {
                    for (var i = 0; i < REPLY_COUNT; i++) {
                        content = content + (i == REPLY_COUNT - 1 ? '<p>' : dash) + contentArray[contentArray.length - REPLY_COUNT + i] + '</p>';
                    }
                }
                else {
                    for (var x in contentArray) {
                        content = content +  (x == contentArray.length - 1 ? '<p>' : dash) + contentArray[x] + '</p>';
                    }
                }
                var layer = creatDiv(content);
                layer.style.display = 'block';
                var abs = getPosition(link);
                layer.style.left = abs.left - 15 + 'px';
                layer.style.top = abs.top - layer.offsetHeight - link.offsetHeight/2 - 3 + 'px';
            }
        }
    });
    document.addEventListener('mouseout', function (e) {
        if (document.getElementById('replyToolTip') != null) {
            document.getElementById('replyToolTip').style.display = 'none';
        }
    });
}

function getAuthor(link) {
    var authorLink = 'none';
    var rex = /\/member\//;
    if (rex.test(link) && link.className != 'dark') {
        authorLink = link;
    }
    return authorLink;
}

function getContent(originID, authorName) {
    var contentArray = new Array(),
        x;
    var replys = document.getElementById('Main').getElementsByClassName('reply_content');
    for (x in replys) {
        var reply = replys[x];
        if (reply.parentNode != undefined) {
            var replyID = reply.parentNode.getElementsByClassName('no') [0].innerHTML;
            var replyAuthor = reply.parentNode.getElementsByClassName('dark') [0].innerHTML;
            if (parseInt(replyID) < parseInt(originID) && replyAuthor.toLowerCase() == authorName.toLowerCase()) {
                if (reply.innerHTML != '') {
                    if (reply.innerHTML.length > MAX_LENGTH) {
                        contentArray.push(reply.innerHTML.substring(0, MAX_LENGTH) + '<br /><span style=\'color:gray;\'> ……</span>');
                    }
                    else
                        contentArray.push(reply.innerHTML);
                }
            }
        }
    }
    return contentArray;
}

function creatDiv(content) {
    var layer = document.getElementById('replyToolTip');
    if (layer != null) {
        layer.innerHTML = content;
    }
    else {
        layer = document.createElement('div');
        document.body.appendChild(layer);
        layer.setAttribute('id', 'replyToolTip');
        layer.innerHTML = content;
    }
    return layer;
}

// 翻页后隐藏主题内容
if (HIDE_TOPIC_CONTENT && window.location.href.indexOf('?p=') > 0 && window.location.href.indexOf('?p=1') == - 1) {
    document.getElementsByClassName('topic_content') [0].setAttribute('style', 'display:none;');
}

// 感谢回复者时先确认
var thankareas = document.getElementsByClassName('thank');
for (var x in thankareas) {
    if(thankareas[x].text == "感谢回复者") {
        var func = thankareas[x].getAttribute('onclick');
        thankareas[x].setAttribute('onclick', 'if(confirm(\'予人玫瑰，手有余香\')){ ' + func + '}');
    }
}

function getPosition(obj) {
    var w = obj.offsetWidth, h = obj.offsetHeight;
    for (var t = obj.offsetTop, l = obj.offsetLeft; obj = obj.offsetParent;) {
        t += obj.offsetTop;
        l += obj.offsetLeft;
    }
    return {left:l,top:t};
}
