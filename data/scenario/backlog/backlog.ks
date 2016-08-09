[iscript]
//■設定
var log_conf = {

//バックログにConfig.tjsで指定したデフォルトのフォントスタイルを反映させる。しない場合は false
"def_style" : true
,
//バックログに[font]タグで指定したフォントスタイルを反映させる。しない場合は false
"font_style" : true

};
sf.log_conf = log_conf;
$('head link:last').after('<link rel="stylesheet" href="./data/others/backlog/backlog.css">');
console.log(TG.variable.sf.log_conf);
[endscript]
[loadjs storage="backlog/backlog.js"]
[loadjs storage="backlog/showMessage.js"]

[return]