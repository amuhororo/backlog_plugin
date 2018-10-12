;【バックログプラグイン Ver.2.05】
; 2018/10/12更新　by hororo http://hororo.wp.xdomain.jp/118/
[iscript]
TG.kag.tmp.backlog = {
	def_style   : mp.def_style   || 'false',
	font_style  : mp.font_style  || 'false',
	font_flag   : false,
	font_tag    : "",
	name_repeat : mp.name_repeat || 'true',
	name_none   : mp.name_none   || 'false',
	glink_log   : mp.glink_log   || 'false',
	glink_flag  : false
};
TG.kag.tmp.tcy = false;
//$('head link:last').after('<link rel="stylesheet" href="./data/others/plugin/backlog/backlog.css">');
[endscript]
[loadjs storage="plugin/backlog/backlog.js"]
[loadcss file="./data/others/plugin/backlog/backlog.css" ]
[return]
