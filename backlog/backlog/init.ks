;【バックログプラグイン】
; by hororo https://memocho.no-tenki.me/

[iscript]
	tf.dir = (tf.mclog) ? tf.mclog.dir : "";
[endscript]
[loadcss file="&'./data/others/plugin/' + tf.dir + 'backlog/backlog.css'"]
[loadjs storage="&'plugin/' + tf.dir + 'backlog/backlog.js'"]

[macro name="br"]
	[pushlog text="<br>"]
	[r]
[endmacro]
[erasemacro name="br" cond="TYRANO.kag.stat.mp.r_log!='false'"]

[clearvar exp="tf.dir"]
[return]
