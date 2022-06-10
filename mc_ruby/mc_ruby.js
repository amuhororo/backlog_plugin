//【ルビをバックログに入れるプラグイン】
// Ver.1.00 2022/6/10
// by hororo https://memocho.no-tenki.me/

(function(){

	const tag = {}; //タグ確認用…
	//パラメータ保存
	TYRANO.kag.tmp.memocho = TYRANO.kag.tmp.memocho || {}; //memocho専用領域
	TYRANO.kag.stat.memocho = TYRANO.kag.stat.memocho || {}; //memocho専用領域

	//mc_rubyタグ
	tag.mc_ruby = {
		pm :{
			text: ""
		},
		log_join: "true",
		start : function(pm) {
			if(TYRANO.kag.tmp.custom_ruby){
				TYRANO.kag.ftag.startTag("ruby",pm); //カスタムルビプラグインがあったら優先
				let selecter = ($(".current_span").html()) ? $(".current_span") : $(".current_span").prev();//メッセージ空だったら一個前見る
				let ruby_html = selecter.find("ruby:last").next("span").prop('outerHTML');//メッセージ欄からルビ拾う
				let style = (TYRANO.kag.stat.vertical == "true") ? "top: 1em" : "left: 1em";//ログは前に入るので1文字分ずらす
				TYRANO.kag.tmp.memocho.ruby_str = "<span class='mc_ruby' style='" + style + "'>" + ruby_html + "</span>";//調整用にさらにspanで囲う。囲み過ぎ。
				//次のテキスト読んでからログ入れる
				let last_log = TYRANO.kag.variable.tf.system.backlog.pop(); //ログの最後の配列切り取る
				last_log = last_log.replace(/(.*)\'>/,"$1'>" + TYRANO.kag.tmp.memocho.ruby_str); //最初のタグの次にねじ込む
				TYRANO.kag.pushBackLog(last_log,"join"); //ログに戻す
				TYRANO.kag.tmp.memocho.ruby_str = "";
			}else{
				//TYRANO.kag.stat.ruby_str = "<span class='mc_ruby' data-ruby='"+pm.text+"'></span>";
				//TYRANO.kag.tmp.memocho.ruby_str = TYRANO.kag.stat.ruby_str;
				TYRANO.kag.stat.ruby_str = "";
				TYRANO.kag.tmp.memocho.ruby_str = "<span class='mc_ruby' data-ruby='" + pm.text + "'>";
				TYRANO.kag.ftag.nextOrder(); //次のタグへ
			}
		}
	}

	tag.endruby = {
		log_join: "true",
		start : function(pm) {
			//カスタムルビプラグインがあったらendrubyは無視
			if(!TYRANO.kag.tmp.custom_ruby){
				let selecter = ($(".current_span").html()) ? $(".current_span") : $(".current_span").prev();//メッセージ空だったら一個前見る
				selecter.children('span:last-child').wrapInner(TYRANO.kag.tmp.memocho.ruby_str);
				let last_log = TYRANO.kag.variable.tf.system.backlog.pop(); //ログの最後の配列切り取る
				last_log = last_log.replace(/(.*)\'>/,"$1 '>" + TYRANO.kag.tmp.memocho.ruby_str).replace(/(.*)<\/span>/,"$1</span></span>");
				TYRANO.kag.pushBackLog(last_log,"join"); //ログに戻す
				TYRANO.kag.tmp.memocho.ruby_str = "";
			}
			TYRANO.kag.ftag.nextOrder(); //次のタグへ
		}
	}

	//ティラノのタグに登録
	for (var tag_name in tag) {
		TYRANO.kag.ftag.master_tag[tag_name] = object(tag[tag_name]);
		TYRANO.kag.ftag.master_tag[tag_name].kag = TYRANO.kag;
	}

}());
