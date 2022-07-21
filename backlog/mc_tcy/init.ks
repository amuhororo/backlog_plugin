;【バックログプラグイン】縦中横機能
; by hororo https://memocho.no-tenki.me/

[iscript]
	tf.dir = (tf.mclog) ? tf.mclog.dir : "";
[endscript]
[loadjs storage="&'plugin/' + tf.dir + 'mc_tcy/mc_tcy.js'"]
[loadcss file="&'./data/others/plugin/' + tf.dir + 'mc_tcy/mc_tcy.css'"]
[clearvar exp="tf.dir"]
[return]
