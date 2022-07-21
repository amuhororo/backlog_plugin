;【バックログプラグイン】glinkログ機能
; by hororo https://memocho.no-tenki.me/

[iscript]
	tf.dir = (tf.mclog) ? tf.mclog.dir : "";
[endscript]
[loadjs storage="&'plugin/' + tf.dir + 'mc_glink/mc_glink.js'"]
[loadcss file="&'./data/others/plugin/' + tf.dir + 'mc_glink/mc_glink.css'"]

[macro name="mc_glink"]
	[glink * preexp="mp" exp="MEMOCHO.glink_log(preexp)"]
[endmacro]

[clearvar exp="tf.dir"]
[return]
