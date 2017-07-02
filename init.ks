;【バックログプラグイン Ver.2.00】
; 2017/7/2更新　by hororo http://hororo.wp.xdomain.jp/
[iscript]
mp.def_style = mp.def_style || 'false';
mp.font_style = mp.font_style || 'false';
mp.name_repeat = mp.name_repeat || 'true';
mp.name_none = mp.name_none || 'false';
mp.glink_log = mp.glink_log || 'false';
TG.kag.tmp.backlog = {};
TG.kag.tmp.backlog.def_style = mp.def_style;
TG.kag.tmp.backlog.font_style = mp.font_style;
TG.kag.tmp.backlog.font_flag = false;
TG.kag.tmp.backlog.font_tag = "";
TG.kag.tmp.backlog.name_repeat = mp.name_repeat;
TG.kag.tmp.backlog.name_none = mp.name_none;
TG.kag.tmp.backlog.glink_log = mp.glink_log;
TG.kag.tmp.backlog.glink_flag = false;
TG.kag.tmp.tcy = false;
$('head link:last').after('<link rel="stylesheet" href="./data/others/plugin/backlog/backlog.css">');
[endscript]
[loadjs storage="plugin/backlog/backlog.js"]
[return]