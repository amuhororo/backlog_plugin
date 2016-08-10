;【バックログプラグイン Ver.1】2016/8/10
; by hororo http://hororo.wp.xdomain.jp/
;
; ＜機能＞
;　　バックログ関係のプラグインです。
;　　・ログの改行問題に対応しています。
;　　・ルビをログに表示します。
;　　・キャラ名が重複しないようになっています。
;　　・ログの縦書き対応。Config.tjs で vertical=true になっていれば自動で縦書き表示になります。
;　　・[font] タグをログに反映するかしないか選択可能。※注意点を参照
;　　・[p] [er] [ct] [cm] [s] 時にログを纏めて別変数に格納する事で段落表示をします。
;　　・[r]にパラメーターを指定する事で、ログの段落分けをします。例：[r backlog=true]
;　　・[mtext] [ptext] [glink] にパラメータ指定する事でログ表示ができます。例：[mtext backlog=true]
;　　・[mtext] [ptext] は、パラメータ x=center or y=center でセンタリングができます。
;　　・CSSで自由に整形できます。
;
; ＜動作確認＞
;　　ティラノスクリプト Ver4.23
;
; ＜使い方＞
;　　最初にbacklog.ksファイルを読み込んでください。
;　　[call storage="backlog/backlog.ks"]
;
; ＜パラメータ＞
;　　backlog : true
;　　　　[mtext] [ptext] [glink] … textをログに表示する。
;　　　　[r] … ログ段落にする。
;
; ＜注意点＞
;　　スクリプトエンジン本体を改造していますので、別Verでは動作しない可能性があります。
;　　複数のタグを改造していますので、他プラグインとは併用できない場合があります。
;
;　　[font]の指定をログに反映する場合は、タグの記述方法が限定されます。
;　　・[Font]～[resetfont] 内には [ruby] [r] [l] 以外いれられません。
;　　・[p] [cm] [er] [ct] [s] [r backlog=true] を挟む場合は、
;　　　再度[font]タグを記述しなければなりません。
;
;　　※詳しくは、添付の README.md か、プラグインページ（http://hororo.wp.xdomain.jp/）をご覧ください。
;
[iscript]
var log_conf = {

//■設定
//◆ バックログにConfig.tjsで指定したデフォルトのフォントスタイルを反映させる。しない場合は false
"def_style" : true
,
//◆ バックログに[font]タグで指定したフォントスタイルを反映させる。しない場合は false
"font_style" : true

};
sf.log_conf = log_conf;
$('head link:last').after('<link rel="stylesheet" href="./data/others/backlog/backlog.css">');
[endscript]
[loadjs storage="backlog/backlog.js"]
[loadjs storage="backlog/showMessage.js"]

[return]