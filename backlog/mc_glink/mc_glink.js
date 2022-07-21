//【バックログプラグイン】glinkログ機能
// Ver.3.51 2022/7/21
// by hororo https://memocho.no-tenki.me/

(function(){

	//パラメータ保存
	TYRANO.kag.tmp.memocho = TYRANO.kag.tmp.memocho || {};
	TYRANO.kag.tmp.memocho.log = TYRANO.kag.tmp.memocho.log || {};

	TYRANO.kag.tmp.memocho.log.glink_name = TYRANO.kag.stat.mp.log_name || "";
	TYRANO.kag.tmp.memocho.log.glink_mark = TYRANO.kag.stat.mp.glink_mark || TYRANO.kag.stat.mp.mark || TYRANO.kag.tmp.memocho.log.mark || "：";

	if(typeof window.MEMOCHO === "undefined") window.MEMOCHO = {};

	MEMOCHO.glink_log = function(pm){
		let log_text = "";
		const name = pm.log_name || TYRANO.kag.tmp.memocho.log.glink_name;
		let mark = pm.mark || TYRANO.kag.tmp.memocho.log.glink_mark;

		//ログの名前部分を入れるか
		if(TYRANO.kag.tmp.memocho.log.glink_name){
			if(mark) mark = ' data-mark="' + mark + '"';
			log_text = '<b class="backlog_chara_name glink" ' + mark + '>' + name + '</b>';
		}

		//テキスト
		log_text += '<span class="backlog_text glink">'+ pm.text + '</span>';

		//ログに入れる
		TYRANO.kag.variable.tf.system.backlog.push(log_text);
	}

}());