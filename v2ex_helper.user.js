// ==UserScript==
// @id             caoyue@v2ex
// @name           V2EX_Helper
// @version        1.7
// @namespace      caoyue
// @author         caoyue
// @description    v2ex helper
// @include        http://www.v2ex.com/*
// @include        https://*.v2ex.com/*
// @include        http://*.v2ex.com/*
// @include        https://v2ex.com/*
// @include        http://v2ex.com/*
// @downloadURL	   https://github.com/caoyue/userjs/raw/master/v2ex_helper.user.js
// @grant          none


// ==/UserScript==
// Author: caoyue
// Created: 2012-04-11
// Version: 1.6 2013-02-05
// Updated: 2015-01-17

var REPLY_TYPE = 1; //TODO:评论显示方式.
var REPLY_COUNT = 2; //只显示最靠近的两条评论
var MAX_LENGTH = 300; //引用评论超过长度则截断
var HIDE_TOPIC_CONTENT = false; //翻页后隐藏主题内容
var REDIRECT = false; // www 自动跳转到裸域

//var SEARCH = "http://www.google.com/search?q=site:v2ex.com/t%20{{0}}"; //default
var SEARCH = 'https://www.bing.com/search?q=site%3Av2ex.com%2Ft+{{0}}'; //自定义搜索引擎

(function () {
    if (REDIRECT && location.host == 'www.v2ex.com') {
        location.href = location.href.replace(/www./, '');
    }
}) ();

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
                if (contentArray.length > REPLY_COUNT) {
                    for (var i = 0; i < REPLY_COUNT; i++) {
                        content = content + '<p style=\'padding-bottom:5px;border-bottom:1px solid rgb(226, 226, 226);\'>' + contentArray[contentArray.length - REPLY_COUNT + i] + '</p>';
                    }
                }
                else {
                    for (var x in contentArray) {
                        content = content + '<p style=\'padding-bottom:5px;border-bottom:1px solid rgb(226, 226, 226);\'>' + contentArray[x] + '</p>';
                    }
                }
                var layer = creatDiv(content);
                layer.style.display = 'block';
                layer.style.left = e.pageX - 60 + 'px';
                layer.style.top = e.pageY - layer.offsetHeight - 15 + 'px';
            }
        }
    });
    document.addEventListener('mouseout', function (e) {
        if (document.getElementById('ReplyToolTip') != null) {
            document.getElementById('ReplyToolTip').style.display = 'none';
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
    var layer = document.getElementById('ReplyToolTip');
    if (layer != null) {
        layer.innerHTML = content;
    }
    else {
        layer = document.createElement('div');
        document.body.appendChild(layer);
        layer.setAttribute('id', 'ReplyToolTip');
        layer.setAttribute('style', 'font-size:14px;background-color:rgba(255,255,255,0.9);box-shadow:0 0 10px rgba(0, 0, 0, 0.8);max-width:550px;max-height:500px;padding:6px 10px;position:absolute;')
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
    var func = thankareas[x].getAttribute('onclick');
    thankareas[x].setAttribute('onclick', 'if(confirm(\'予人玫瑰，手有余香\')){ ' + func + '}');
}
