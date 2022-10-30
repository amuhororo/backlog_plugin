;【バックログプラグイン 一括導入用】
; by hororo https://memocho.no-tenki.me/

[iscript]
	const set = ["backlog", "mc_ruby", "mc_font", "mc_glink", "mc_tcy"];
	tf.mclog = {};
	tf.mclog.dir = "backlog/";

	set.forEach(function(elem){
		$.get("./data/others/plugin/backlog/" + elem + "/init.ks",function(){
			tf.mclog[elem] = true; //init.ksがあったらtrue
		});
	});
[endscript]

;ちょっと待たないと↑が終わらない
[wait time="150"]

[call storage="../others/plugin/backlog/backlog/init.ks" cond="tf.mclog.backlog"]
[call storage="../others/plugin/backlog/mc_ruby/init.ks" cond="tf.mclog.mc_ruby"]
[call storage="../others/plugin/backlog/mc_font/init.ks" cond="tf.mclog.mc_font"]
[call storage="../others/plugin/backlog/mc_glink/init.ks" cond="tf.mclog.mc_glink"]
[call storage="../others/plugin/backlog/mc_tcy/init.ks" cond="tf.mclog.mc_tcy"]

[clearvar exp="tf.mclog"]
[return]