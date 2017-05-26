// ==UserScript==
// @name         Douyu in video player
// @namespace    caoyue
// @version      0.1
// @description  open stream in video player
// @downloadURL	https://github.com/caoyue/userjs/raw/master/douyu_in_video_player.user.js
// @updateURL	https://github.com/caoyue/userjs/raw/master/douyu_in_video_player.meta.js
// @author       caoyue
// @match        https://www.douyu.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
	'use strict';
	var PLAYER_PROTOCOL = "potplayer://";

	function getUrl(){
		var room = unsafeWindow.$ROOM.room_id;
		GM_xmlhttpRequest({
			method: 'GET',
			url: 'https://m.douyu.com/html5/live?roomId=' + room,
			onload: function (response) {
				var json = JSON.parse(response.responseText);
				insertUrl(json.data.hls_url);
			}
		});
	}

	function insertUrl(url){
		var a = document.createElement("a");
		a.className = "r-com-btn follow-btn fl";
		a.style.borderRadius = 0;
		a.href = PLAYER_PROTOCOL + url;
		a.text = "Play";
		var x = document.getElementsByClassName("focus-box-con");
		x[0].appendChild(a);
	}

	getUrl();


})();
