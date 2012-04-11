// ==UserScript==
// @id             caoyue@v2ex
// @name           V2EX_Reply
// @version        1.0
// @namespace      caoyue
// @author         caoyue
// @description    v2ex reply
// @include        https://www.v2ex.com/t/*
// @include        http://www.v2ex.com/t/*
// @include        https://us.v2ex.com/t/*
// @include        http://us.v2ex.com/t/*
// @run-at         document-end
// ==/UserScript==

// Author: caoyue (http://caoyue.me)
// Created: 2012-04-11
// Version: 1.0
// Updated: 2012-4-11

var REPLY_TYPE = 1; //TODO:评论显示方式. 1；Tooltip; 2：插入到评论上方；3：点击跳转到父评论


document.addEventListener('mouseover',function(e){
	var	link = e.target;
	if(link.nodeName.toLowerCase()=='a'){
		var authorLink = getAuthor(link);
		if (authorLink.innerHTML != undefined) {
			var originID = authorLink.parentNode.parentNode.getElementsByTagName("div")[0].id.split("_")[1];
			var authorName = authorLink.innerHTML;
			var content = "<strong>" + authorName + ":</strong><br />" +  getContent(originID,authorName);
			if (content.length >2000) {
				content = content.substr(content.length - 2000 ,2000);
			}
			var layer = creatDiv(content);

			layer.style.display = 'block';
			layer.style.left = "280px";
			layer.style.top = e.pageY - layer.offsetHeight - 20 + "px";
		}
	}
});

document.addEventListener('mouseout',function(e){
	if (document.getElementById("ReplyToolTip") != null) {
		document.getElementById("ReplyToolTip").style.display = "none";
	}
});


function getAuthor(link){	
	var authorLink = "none";
	var rex = /\/member\//;
	if (rex.test(link) && link.className != "dark") {
		authorLink = link;
	}
	return authorLink;
}

function getContent(originID,authorName){
	var content = "",x;
	var replys = document.getElementById("replies").getElementsByClassName("reply_content");
	for (x in replys) {
		var reply = replys[x];
		if (reply.parentNode != undefined) {
			var replyID = reply.parentNode.getElementsByClassName("fr")[0].id.split("_")[1];
			var replyAuthor = reply.parentNode.getElementsByClassName("dark")[0].innerHTML;	
			if (replyID < originID && replyAuthor == authorName) {
				content = content + "<p style='padding-bottom:5px;border-bottom:1px dashed rgba(20,150,190,0.3);'>" + reply.innerHTML + "</p>";
			}
		}
		else
			content = content + "";
	}
	return content;
}

function creatDiv(content){
	var layer = document.getElementById("ReplyToolTip");
	if (layer != null) {
		layer.innerHTML = content;
	}
	else{
		layer = document.createElement("div");
		document.body.appendChild(layer);
		layer.setAttribute("id","ReplyToolTip");
		layer.setAttribute("style","color:rgb(20,150,190);background-color:rgba(0,0,0,0.8);max-width:550px;max-height:500px;padding:6px 10px;position:absolute;")
		layer.innerHTML = content;
	}
	return layer;
}
