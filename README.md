# バックログプラグイン  
Ver.1　2016/8/10  
  
by hororo http://hororo.wp.xdomain.jp/

##機能
バックログ関係のプラグインです。
* ログの改行問題に対応しています。
* ルビをログに表示します。
* キャラ名が重複しないようになっています。
* [font]タグをログに反映するかしないか選択可能。※1 注意点を参照
* mtext / ptext / glink はパラメータ指定でログ表示可能。例：[mtext backlog=true]
* mtext / ptext のみ、パラメータ x=center or y=center でセンタリングができます。
* [p][er][ct][cm][s]時にログを纏めて別変数に格納する事で、段落毎の表示ができます。
* [r]にパラメーター指定で、段落分けをします。例：[r backlog=true]
* CSSで自由に整形できます。
* ログの縦書き対応。Config.tjs で vertical = true になっていれば自動で縦書き表示になります。
* ブーストプラグインに対応しやすいよう、text表示関係は別ファイルに分けてあります。
  
##動作確認  
ティラノスクリプト Ver423  
  
##使い方  
最初にbacklog.ksファイルを読み込んでください。  
[call storage="backlog/backlog.ks"]  
  
###パラメータ  
backlog : true  
　[mtext] [ptext] [glink] … textをログに表示する。  
　[r] … ログを段落に纏める。  
  
例：[mtext text=テキスト backlog=true]  
※[glink]は、選択したボタンのテキストのみログに表示されます。  
  
###[r backlog=true]の使い方  
全画面ノベルゲーの時に、好きな所でログの段落分けが出来るようにパラメータ式にしています。
```
こんにちは[r]はじめまして[r backlog=true]  
私のなまえはゆうこ[p]
```
  
ログのhtml  
```
<p>こんにちは<br>はじめまして</p>
<p>私のなまえはゆうこ</p>
```
  
###ログのHTMLタグ例  
```
<p>テキスト</p> //キャラ名なしの場合  
<p><span class="log_name">名前</span>テキスト</p> //キャラ名がある場合  
<p class="log_mtext">mtext</p> //mtext  
<p class="log_ptext">ptext</p> //ptext  
<p class="log_glink">glink</p> //glink
```
  
##注意点  
スクリプトエンジン本体を改造していますので、別Verでは動作しない可能性があります。  
かなりのタグを改造していますので、他プラグインとは併用できない場合が多いです。

### ※1 [font]タグをログに反映する場合の注意
[font]タグ情報をログに表示する場合、タグの記載方法が限定されます。  
* [Font]～[resetfont] 内には[ruby][r][l]以外いれられません。  
* [p][cm][er][ct][s][r backlog=true]を挟む場合は、再度[font]タグを記述しなければなりません。
  
#####ダメな例（ログでは色指定されません）  
```
  [font  size="30"  color="0xff0000"]  
  ＃ゆうこ  
  ゲーム制作に  
  [p]  
  興味あるの？
  [resetfont]
```
```
　<p><font style="color:#ff0000"></p>
　<p><span class="log_name">ゆうこ</span>ゲーム制作に</p>
　<p>興味あるの？</font></p>
```
#####OKな例  
```:ksファイル
  ＃ゆうこ 
  [font  size="30"  color="0xff0000"]  
  ゲーム制作に  
  [resetfont]  
  [p]  
  [font  size="30"  color="0xff0000"]  
  興味あるの？ 
  [resetfont]
```
```html:log
　<p><span class="log_name">ゆうこ</span><font style="color:#ff0000">ゲーム制作に</font></p>
　<p><font style="color:#ff0000">興味あるの？</font></p>
```

  
##Ver履歴  
1.00 ： 公開  
  
##ご協力感謝  
* [SOroom SOrow 様](http://north.undo.jp/ "SOroom SOrow 様")  
  
  
##ティラノスクリプト瞬間表示プラグインとの併用方法  
ご自身で改造をお願い致します。  
  
1. backlog.ks の`[loadjs storage="backlog/showMessage.js"]` 部分を削除  
1. boost_mode.js にバックログ用の記述を追記  
	* `current_str += str;` の下に `that.kag.pushBackLog(str);` ×2ヶ所  
	* `current_str += c;` の下に `that.kag.pushBackLog(c);` ×2ヶ所
1. boost_mode.js の `$("#glyph_image").show();` を `$(".glyph_image").show();` にしておく。  

