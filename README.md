# バックログプラグイン  
Ver.1　2016/8/10  
  
by hororo http://hororo.wp.xdomain.jp/

##機能
バックログ回りの機能を追加するプラグインです。
* ログの改行問題に対応しています。
* ルビをログに表示します。
* キャラ名が重複しないようになっています。
* [font]タグをログに反映するかしないか選択可能。※1 注意点を参照
* mtext / ptext / glink はパラメータ指定でログ表示可能。例：[mtext backlog=true]
* mtext / ptext のみ、パラメータ x=center or y=center でセンタリングができます。
* [p][er][ct][cm][s]時にログを纏めて別変数に格納する事で、段落毎の表示ができます。
* CSSで自由に整形できます。
* ログの縦書き対応。Config.tjs で vertical = true になっていれば自動で縦書き表示になります。
* ブーストプラグインに対応しやすいよう、text関係は別ファイルに分けてあります。
  
##動作確認  
ティラノスクリプト Ver423  
  
##使い方  
最初にbacklog.ksファイルを読み込んでください。  
[call storage="sbacklog/backlog.ks"]  
  
[mtext] [ptext] [glink] のtextをログに表示するには、backlog=true を追記します。  
例：[mtext text=テキスト backlog=true]  
※[glink]は、選択したボタンのテキストのみログに表示されます。  
  
ログのHTMLタグ例  
&lt;p&gt;テキスト&lt;/p&gt; //キャラ名なしの場合  
&lt;p&gt;&lt;span class="chara_name"&gt;名前&lt;/span&gt;テキスト&lt;/p&gt; //キャラ名がある場合  
&lt;p class="mtext"&gt;mtext&lt;/p&gt; //mtext  
&lt;p class="ptext"&gt;ptext&lt;/p&gt; //ptext  
&lt;p class="glink"&gt;glink&lt;/p&gt; //glink
  
##注意点  
スクリプトエンジン本体を改造していますので、別Verでは動作しない可能性があります。  
かなりのタグを改造していますので、他プラグインとは併用できない場合が多いです。

### ※1 [font]タグをログに反映する場合の注意
font]タグ情報をログに表示する場合、タグの記載方法が限定されます。  
* [Font]～[resetfont] 内には[ruby]以外いれられません。  
* [p][cm][er][ct][s]を挟む場合は、再度[font]タグを記述しなければなりません。
  
・ダメな例（ログでは色指定されません）  
```
  [font  size="30"  color="0xff0000"]  
  ＃ゆうこ  
  ゲーム制作に  
  [p]  
  興味あるの？
  [resetfont]
``` 

・OKな例  
```
  ＃ゆうこ 
  [font  size="30"  color="0xff0000"]  
  ゲーム制作に  
  [resetfont]  
  [p]  
  [font  size="30"  color="0xff0000"]  
  興味あるの？ 
  [resetfont]
```
  
##Ver履歴  
1.00 ： 公開  
  
##ご協力感謝  
* [SOroom SOrow 様](http://north.undo.jp/ "SOroom SOrow 様")
