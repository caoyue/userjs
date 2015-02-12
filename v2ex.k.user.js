// ==UserScript==
// @id             caoyue@v2ex
// @name           v2ex.k
// @version        0.1.2
// @namespace      caoyue
// @author         caoyue
// @description   Get a better UI of V2EX.
// @include        http://www.v2ex.com/*
// @include        https://*.v2ex.com/*
// @include        http://*.v2ex.com/*
// @include        https://v2ex.com/*
// @include        http://v2ex.com/*
// @require        http://cdn.v2ex.com/static/js/jquery.js
// @downloadURL    https://github.com/caoyue/userjs/raw/master/v2ex.k.user.js
// @updateURL      https://github.com/caoyue/userjs/raw/master/v2ex.k.meta.js
// @resource   v2ex.k.font  https://raw.githubusercontent.com/kokdemo/v2ex.k/64b4551ed10c9765edf3a167d1dfd4b9be5ba2aa/css/font.css
// @resource   v2ex.k.css   https://raw.githubusercontent.com/kokdemo/v2ex.k/64b4551ed10c9765edf3a167d1dfd4b9be5ba2aa/css/v2ex.k.css
// @noframes
// @grant          GM_getResourceText
// @grant          GM_addStyle
// @grant          GM_registerMenuCommand
// @grant          GM_setValue
// @grant          GM_getValue
// ==/UserScript==

// 原作者 kokdemo@v2ex
// 修改自 https://github.com/kokdemo/v2ex.k commit 64b4551ed1
// 一切权利归原作者所有
// Updated: 2015-02-12

// register command
GM_registerMenuCommand('v2ex.k - Use Ajax', useAjax, 'a');
GM_registerMenuCommand('v2ex.k - Use iframe', useIframe, 's');
function useAjax() {
  GM_setValue('useAjax', true);
  location.reload();
}
function useIframe() {
  GM_setValue('useAjax', false);
  location.reload();
}
USE_AJAX = GM_getValue('useAjax');

var GM_addStyle = GM_addStyle || function (css) {
  var style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.textContent = css;
  document.head.appendChild(style);
};
GM_addStyle(GM_getResourceText('v2ex.k.font'));
GM_addStyle(GM_getResourceText('v2ex.k.css'));
var navbar = $('#Top .content a');
var newNavbar = '<div id=\'k_navbar\' class=\'bars k_color_dark\'></div><div id=\'k_tabbar\' class=\'bars k_color_light\'></div>';
if ($('#Rightbar .box .cell table tbody tr td').length != 0) {
  var avater = $('#Rightbar .box .cell table tbody tr td') [0].innerHTML;
  var unread = $('.inner a') [0].innerHTML.replace(' 条未读提醒', '')
  var notificationText = unread == '0' ? '' : unread;
} else {
  var avater = '<a href="' + navbar[2] + '" class="top k_color_hover">' + navbar[2].innerHTML + '</a>';
  var notificationText = '';
}
var notification = '<a href="/notifications"><i class="fa fa-bell fa-2x"></i>&nbsp;&nbsp;' + notificationText + '</a>';
var k_navbar =
avater + notification +
'<a href="/" class="top k_color_hover"><i class="fa fa-home fa-2x"></i></a>' +
'<a href="/new" class="top k_color_hover"><i class="fa fa-pencil-square-o fa-2x"></i></a>' +
'<a href="https://workspace.v2ex.com/" target="_blank" class="top k_color_hover"><i class="fa fa-laptop fa-2x"></i></a>' +
'<a href="/notes" class="top k_color_hover"><i class="fa fa-book fa-2x"></i></a>' +
'<a href="/t" class="top k_color_hover"><i class="fa fa-list-alt fa-2x"></i></a>' +
'<a href="/events" class="top k_color_hover"><i class="fa fa-eye fa-2x"></i></a>' +
'<a href="/place/117.34.170.126" class="top k_color_hover"><i class="fa fa-map-marker fa-2x"></i></a>' +
'<a href="/settings" class="top k_color_hover"><i class="fa fa-cog fa-2x"></i></a>'
;

$('body').prepend(newNavbar);
$('.bars').css('height', window.screen.height);
$('#Wrapper').css('width', document.body.clientWidth - 140).addClass('k_color_background');
$('#k_navbar').append(k_navbar).append($('#Top .content a') [9]);
$($('#k_navbar a') [10]).html('<i class="fa fa-sign-out fa-2x"></i>');
$('#k_tabbar').append($('#Tabs a'));
$('#Rightbar').prepend($('#Search'));
$('#k_navbar a img').css('border-radius', '50%');
$('#k_navbar a,#k_tabbar a').addClass('k_color_hover');
$('a.count_livid').addClass('k_color_count');
$('a.node').addClass('k_color_node');

var fast = {
  changeCSS: function () {
    $('#Main').css('width', document.body.clientWidth - 690 - 140).css('height', $(window).height() + 10);
    $('#Rightbar').css('width', 690).css('position', 'fixed').css('right', 0);
  },
  keyPress: function (event) {
    var key;
    key = event.keyCode;
    //Ie使用event.keyCode获取键盘码
    var dom = $('.k_color_choosen');
    if (key == 82) {
      //R刷新
      if (dom.length != 0) {
        window.location.reload();
      }
    } else if (key == 40) {
      //方向键下
      if (dom.length == 0) {
        $('#Main .item,#TopicsNode .cell') [0].click()
      } else {
        dom.next().click();
      }
    } else if (key == 38) {
      //方向键上
      if (dom.length == 0) {
        $('#Main .item,#TopicsNode .cell') [0].click()
      } else {
        dom.prev().click();
      }
    } else if (key == 39) {
      //方向键右
      if (dom.length != 0) {
        $('#k_faster').click();
      }
    } else if (key == 37) {
      //方向键左
      var localUrl = window.location.href;
      if (localUrl.indexOf('v2ex.com/go') != - 1 || localUrl.indexOf('v2ex.com/t') != - 1) {
        window.history.go( - 1);
      }
    } else if (key == 32) {
      //空格
      if (dom.length != 0) {
        //.click();
        document.getElementById('k_faster').scrollTop = 0;
      } else {
        document.body.scrollTop = 0;
      }
    }
  }
};

document.onkeydown = fast.keyPress;
$('#Main .item,#TopicsNode .cell').addClass('k_color_item').click(function () {
  if ($('#Rightbar #k_faster').length == 0) {
    $('#Rightbar').prepend('<div id="k_faster" class="box" style="height:' + ($(window).height() - 10) + 'px">' + '</div>')
  }
  $('#Main .item,#TopicsNode .cell').removeClass('k_color_choosen');
  $(this).addClass('k_color_choosen');
  var itemUrl = $(this).find('.item_title a').attr('href');
  var itemID = itemUrl.substr(3, 6);
  var iframeUrl = $(this).find('.item_title a').attr('href');
  if (USE_AJAX) {
    $.ajax({
      type: 'get',
      url: '/api/topics/show.json?id=' + itemID,
      dataType: 'json',
      success: function (data) {
        var title = data[0]['title'];
        var contentDom = data[0]['content_rendered'];
        var url = data[0]['url'];
        var faster = '<h2>' + title + '</h2>' + contentDom;
        fast.changeCSS();
        $('#k_faster').html(faster).click(function () {
          window.location.href = url;
        });
      },
      error: function () {
        var iframe = '<iframe frameborder=0 seamless allowtransparency="true" width="100%" scrolling="auto" style="margin-bottom:10px; margin-top:-64px" src="' + itemUrl + ' " height="' + (window.screen.height - 10) + '">' + '</iframe>';
        fast.changeCSS();
        $('#k_faster').html(iframe).css('padding', 0).click(function () {
          window.location.href = url;
        });
      }
    });
  }
  else {
    var iframe = '<iframe frameborder=0 seamless allowtransparency="true" width="100%" scrolling="auto" style="margin-bottom:10px; margin-top:-64px" src="' + itemUrl + ' " height="' + (window.screen.height - 10) + '">' + '</iframe>';
    fast.changeCSS();
    $('#k_faster').html(iframe).css('padding', 0).click(function () {
      window.location.href = url;
    });
  }
});
