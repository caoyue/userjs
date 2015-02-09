// ==UserScript==
// @id             caoyue@v2ex
// @name           v2ex.k
// @version        0.0.1
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
// @noframes
// @grant          GM_addStyle
// ==/UserScript==

// 原作者 kokdemo@v2ex
// 修改自 https://github.com/kokdemo/v2ex.k commit 0ced0afb76
// 一切权利归原作者所有
// Updated: 2015-02-09

var navbar = $('#Top .content a');
var tabbar = $('#Tabs a');
var newNavbar = '<div id=\'k_navbar\' class=\'bars k_color_dark\'></div><div id=\'k_tabbar\' class=\'bars k_color_light\'></div>';
$('.bars').css('height', window.screen.height);
$('#Wrapper').css('width', document.body.clientWidth - 150).addClass('k_color_background');
$('body').prepend(newNavbar);
$('#k_navbar').append(navbar);
$('#k_tabbar').append(tabbar);
var avater = $('#Rightbar .box .cell table tbody tr td') [0].innerHTML;
var search = $('#Search');
var notificationText = $('.inner a').text();
var notificationStart = notificationText.indexOf('未读提醒');
notificationText = notificationText.substr(notificationStart - 3, 5);
var notification = '<a href="http://www.v2ex.com/notifications">' + notificationText + '</a>';
$('#Rightbar').prepend(search);
$($('#k_navbar a') [0]).remove();
$('#k_navbar').prepend(notification).prepend(avater);
$($('#k_navbar a') [3]).attr('href', 'http://www.v2ex.com/new').text('写新主题');
$('#k_navbar a img').css('border-radius', '50%');
$('#k_navbar a,#k_tabbar a').addClass('k_color_hover');
$('a.count_livid').addClass('k_color_count');
$('a.node').addClass('k_color_node');
$('#Main .item,#TopicsNode .cell').addClass('k_color_item').click(function () {
  $($('#Rightbar iframe')).remove();
  $('#Main .item,#TopicsNode .cell').removeClass('k_color_choosen');
  $(this).addClass('k_color_choosen');
  var iframeUrl = $(this).find('.item_title a').attr('href');
  var iframe = '<iframe frameborder=0 seamless allowtransparency="true" width="100%" scrolling="auto" style="margin-bottom:10px; margin-top:-64px" src="' + iframeUrl + ' " height="' + (window.screen.height - 10) + '">' + '</iframe>';
  $('#Main').css('width', document.body.clientWidth - 690 - 170);
  $('#Rightbar').css('width', 690).css('position', 'fixed').css('right', 0).prepend(iframe);
});

var GM_addStyle = GM_addStyle || function (css) {
  var style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.textContent = css;
  document.head.appendChild(style);
};
GM_addStyle(
  '#Top,#Bottom,#Tabs{display:none}#k_navbar{display:inline-block;position:fixed;top:0;left:0;width:80px;height:100%;vertical-align:top;text-align:center}#k_navbar a{display:block;vertical-align:middle;padding:15px 0;color:#fff}#k_navbar a img{width:100%}#k_tabbar{display:inline-block;position:fixed;top:0;left:80px;width:60px;height:100%;vertical-align:top;text-align:center}#k_tabbar a{display:block;vertical-align:middle;padding:15px 0;color:#fff;margin-right:0}#k_tabbar a.tab_current:link,#k_tabbar a.tab_current:visited,#k_tabbar a.tab_current:active{background-color:#3c7300;border-top-left-radius:0;border-bottom-left-radius:0}.k_color_dark{background-color:#3c7300}.k_color_light{background-color:#5cb000}span a.node.k_color_node{background-color:#b9d998;color:#FFF}td a.count_livid.k_color_count,span.no{background-color:#3c7300}#Wrapper.k_color_background{background-color:#e2f1d0}.k_color_hover:hover{background-color:#2980b9}.k_color_item{background-color:#FFF}.k_color_choosen{background-color:#eee}body #Wrapper{display:inline-block;width:auto;height:100%;margin-left:140px;background-image:none;padding:10px 0 0 10px}#Search{width:90%}#Search form div{width:250px;!important}#Wrapper .content{width:auto;margin:0 10px 0 auto}#Wrapper .sep20{display:none}#Main{width:auto;margin:0 275px 0 0}#Main img.avatar{width:40px;height:40px;max-width:50px!important;max-height:50px!important;-webkit-border-radius:50%;-moz-border-radius:50%;border-radius:50%;margin-left:-10px;margin-bottom:-5px}#Main .cell table tr td:nth-child(3),#Main .cell table tr td:nth-child(4){min-height:60px;padding-top:15px}#Main .box .inner{padding:10px 24px 20px 24px;border-bottom:0}#Main .box:nth-child(2) .cell:nth-child(2){padding:10px 28px!important}#Main .box:nth-child(2) .cell:nth-child(n+2),#Main .cell{padding:10px 24px 20px 24px}#Main .box .topic_buttons{border-top:1px solid #e6e6e6;background:#f3f3f3;margin-top:20px}#Main div[id*="r_"].cell table tr td:nth-child(3){padding-top:0}#Rightbar div:nth-child(3) .cell:first-child table:nth-child(1) tr td:nth-child(1){text-align:center}#Rightbar div:nth-child(3) .cell:first-child table:nth-child(1) tr td:nth-child(2),#Rightbar div:nth-child(3) .cell:first-child table:nth-child(1) tr td:nth-child(3),.sep20,img[src*="flat_compose.png"]{display:none}#Rightbar div:nth-child(3) .cell:first-child table:nth-child(3){padding-bottom:15px;padding-top:15px}#Rightbar .box div:nth-child(1){border-bottom:0}.box{border-radius:0;box-shadow:none;border:1px solid #DDD;margin-bottom:-1px}.box .inner{border-radius:0}.cell{border-bottom:1px solid #e2e2e2}.cell table tr td:nth-child(1){vertical-align:middle!important}.cell table tr td:nth-child(3) a[href="/new"]{padding:7px 20px;background:#eee;border-radius:20px;margin:0 78px 0 0;float:right;margin-bottom:20px}.cell>table{table-layout:fixed}.fade{color:#AAA}.inner{padding-top:10px;padding-bottom:10px}.item_title{padding-top:10px}.msl{width:615px}.no{color:#BBB;padding:4px 5px}.snow{color:#CCC}.topic_content{margin-bottom:50px}.topic_buttons{border-top:1px solid #e6e6e6;background:#f3f3f3;margin-top:20px}a:link,a:visited,a:active{color:#666e74}a.top:link,a.top:visited{color:#BBB;font-size:14px}a.top:hover{color:#333}a.balance_area:link,a.balance_area:visited,.balance_area{background:#FFF}a.item_node{background:#FFF;border:1px #FFF solid}textarea.mll{width:625px}div[id*="r_"].cell table tr td:nth-child(1){vertical-align:baseline!important}div.header h1{margin-right:80px}div.fr a[href*="member"] img{margin-top:30px}td[width="32"]{padding-right:20px}#Rightbar .box .cell table:first-child tbody tr td:first-child{display:none}img.circle-img{border-radius:50%;!important}#reply_content{width:100%}iframe[seamless]{background-color:transparent;border:0 none transparent;padding:0;overflow:hidden}.box{margin:10px 0}'
);
