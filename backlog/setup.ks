;【バックログプラグイン 一括導入用】
; by hororo https://memocho.no-tenki.me/

[iscript]
	const set = ["backlog", "mc_ruby", "mc_font", "mc_glink", "mc_tcy"];
	tf.mclog = {};

	set.forEach(function(elem){
		$.get("./data/others/plugin/" + elem + "/init.ks",function(){
			tf.mclog[elem] = true; //init.ksがあったらtrue
		});
	});
[endscript]

;ちょっと待たないと↑が終わらない
@wait time=100

@call storage="../others/plugin/backlog/init.ks" cond=tf.mclog.backlog
@call storage="../others/plugin/mc_ruby/init.ks" cond=tf.mclog.mc_ruby
@call storage="../others/plugin/mc_font/init.ks" cond=tf.mclog.mc_font
@call storage="../others/plugin/mc_glink/init.ks" cond=tf.mclog.mc_glink
@call storage="../others/plugin/mc_tcy/init.ks" cond=tf.mclog.mc_tcy

@clearvar exp=tf.mclog
[return]
