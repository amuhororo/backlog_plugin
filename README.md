# backlog_plugin
バックログ関係のプラグイン  

* ログの改行対応
* ルビをログに保存
* キャラ名重複しないように
* [font]タグなどの情報を保存するかしないか。
* mtext / ptext / glink もパラメーターでログ保存可能に。例：[mtext backlog=true]
* [p][er][ct][cm][s]時にログを纏めて、別配列に格納。
* 整形はCSS
* ブースタープラグインに対応出来るよう、text関係は別ファイルに分けとく。

マークアップ ルールがガチガチになっちゃう・・・。  
[Font]～[resetfont] 内に[p]とかキャラ名とか入れられない  
  
ダメ  
[font  size="30"  color="0xffffff"]  
＃?  
ちょっとまったーーーーー[p]  
[resetfont]  

OK  
＃?  
[font  size="30"  color="0xffffff"]  
ちょっとまったーーーーー  
[resetfont]  
[p]
