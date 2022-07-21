;【バックログプラグイン】ルビログ機能
; by hororo https://memocho.no-tenki.me/

[iscript]
	tf.dir = (tf.mclog) ? tf.mclog.dir : "";
[endscript]
[loadjs storage="&'plugin/' + tf.dir + 'mc_ruby/mc_ruby.js'"]
[loadcss file="&'./data/others/plugin/' + tf.dir + 'mc_ruby/mc_ruby.css'"]
[clearvar exp="tf.dir"]
[return]
