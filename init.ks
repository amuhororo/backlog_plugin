;【バックログプラグイン Ver.3.00】
; 2020/9/3更新  v504対応版
; by hororo http://hororo.wp.xdomain.jp/

[iscript]
TG.kag.tmp.backlog = {
	def_style   : mp.def_style   || "false",         //デフォルトフォントスタイルをログに反映させる場合は "true"
	font_style  : mp.font_style  || "false",         //[font]をログにログに反映させる場合は "true"
	name_repeat : mp.name_repeat || "true",          //同じキャラのセリフが続く場合、毎行キャラ名を入れる場合は "true"
	name_none   : mp.name_none   || "false",         //ログにキャラ名を入れない場合は "true"
	name_color  : mp.name_color  || "false",         //[chara_new]タグで指定した色をバックログに反映させる場合は "true"
	glink_log   : mp.glink_log   || "false",         //[glink]の選択をログに表示する場合は "true"
	glink_name  : mp.glink_name  || "≪選択肢≫",     //[glink]の名前部分
	mark        : mp.mark        || "：",            //名前とテキストの間の記号
	vertical    : mp.vertical    || "false",         //バックログを縦書きにする場合は "true"



	font_flag   : "false",
	glink_flag  : "false",
	name_count  : 0,
	chara_name  : "",
	font        : {}
};
[endscript]
[loadjs storage="plugin/backlog/backlog.js"]
[loadcss file="./data/others/plugin/backlog/backlog.css" ]
[return]
