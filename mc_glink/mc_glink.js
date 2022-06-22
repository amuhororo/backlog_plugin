//【glinkログプラグイン】
// Ver.1.00 2022/6/
// by hororo https://memocho.no-tenki.me/

(function(){

	//パラメータ保存
	TYRANO.kag.tmp.memocho = TYRANO.kag.tmp.memocho || {};
	TYRANO.kag.tmp.memocho.log = TYRANO.kag.tmp.memocho.log || {};

	TYRANO.kag.tmp.memocho.log.glink_name = TYRANO.kag.stat.mp.log_name || "";
	TYRANO.kag.tmp.memocho.log.glink_mark = TYRANO.kag.stat.mp.glink_mark || TYRANO.kag.stat.mp.mark || "";

	if(typeof window.MEMOCHO === "undefined") window.MEMOCHO = {};
	MEMOCHO.glink_log = function(pm){
		let log_text = "";
		const name = pm.log_name || TYRANO.kag.tmp.memocho.log.glink_name;
		let mark = pm.mark || TYRANO.kag.tmp.memocho.log.glink_mark;
		if(mark) mark = " data-mark='" + mark + "'";
		if(TYRANO.kag.tmp.memocho.log.glink_name){
			log_text = "<b class='backlog_chara_name glink' " + mark + ">" + name + "</b>";
		}
		log_text += "<span class='backlog_text glink'>"+ pm.text + "</span>";
		TYRANO.kag.variable.tf.system.backlog.push(log_text);
	}

}());
