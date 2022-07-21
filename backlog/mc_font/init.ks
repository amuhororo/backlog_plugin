;【バックログプラグイン】fontログ機能
; by hororo https://memocho.no-tenki.me/

[iscript]
	tf.dir = (tf.mclog) ? tf.mclog.dir : "";
[endscript]
[loadjs storage="&'plugin/' + tf.dir + 'mc_font/mc_font.js'"]
[clearvar exp="tf.dir"]
[return]
