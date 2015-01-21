
Greasemonkey Scripts
===============================

### Image_Info.user.js
快速查看图片信息
![Image_Info.user.js](http://ww2.sinaimg.cn/large/3e69b0ccgw1eoh0xsws5sj20l90a83z5.jpg)

### simple_search_jump.user.js
搜索引擎快速跳转

### v2ex_helper.user.js
- 显示引用的评论<br/>
  选项：
  
  ```javascript
  var REPLY_COUNT = 2; //只显示最靠近的两条评论
  var MAX_LENGTH = 300; //引用评论超过长度则截断
  ```
- 翻页后隐藏主题<br/>

  ```javascript
  var HIDE_TOPIC_CONTENT = false; //默认不启用
  ```
- 自动跳转到裸域<br/>

  ```javascript
  var REDIRECT = false; //默认不启用
  ```
- 自定义搜索引擎<br/>

  ```javascript
  var CUSTOM_SEARCH = false; //默认不启用
  var SEARCH = "http://www.google.com/search?q=site:v2ex.com/t%20{{0}}"; //修改搜索引擎，关键字用{{0}}替换

  ```
- 感谢回复增加一个确认弹出框<br/>
