//【ルビをバックログに入れるプラグイン】
// Ver.1.00 2022/6/
// by hororo https://memocho.no-tenki.me/

(function(){

	const tag = {}; //タグ確認用…
	//パラメータ保存
	TYRANO.kag.tmp.memocho = TYRANO.kag.tmp.memocho || {}; //memocho専用領域
	TYRANO.kag.tmp.memocho.log = TYRANO.kag.tmp.memocho.log || {};


	//mc_rubyタグ
	tag.mc_ruby = {
		pm :{
			text: ""
		},
		log_join: "true",
		start : function(pm) {
			//カスタムルビプラグインがあったら優先
			if(TYRANO.kag.tmp.custom_ruby){
				TYRANO.kag.ftag.startTag("ruby",pm); //rubyタグ実行
				let selecter = ($(".current_span").html()) ? $(".current_span") : $(".current_span").prev();//空だったら一個前見る
				let ruby_html = selecter.find("ruby:last").next("span").prop("outerHTML");//ルビ用のタグを拾う
				//ログ入れる
				let last_log = $(TYRANO.kag.variable.tf.system.backlog.pop()); //ログの最後の配列切り取る
				let text = last_log.last().html();
				last_log.last().html(text.replace(/(^.)/,"$1" +ruby_html));
				last_log = jQuery("<div>").append(last_log.clone(true)).html();
				TYRANO.kag.variable.tf.system.backlog.push(last_log); //ログに戻す
				//console.log("mc_ruby(custom_ruby)：",TYRANO.kag.tmp.memocho.log.ruby_str,ruby_html);
				TYRANO.kag.tmp.memocho.log.ruby_str = ""; //念のためクリア
			}else{
				TYRANO.kag.stat.ruby_str = ""; //念のためクリア
				TYRANO.kag.tmp.memocho.log.ruby_str = "<ruby class='mc_ruby' data-ruby='" + pm.text + "'>";
				console.log("mc_ruby：",TYRANO.kag.tmp.memocho.log.ruby_str);
				TYRANO.kag.ftag.nextOrder(); //次のタグへ
			}
		}
	}

	tag.endruby = {
		log_join: "true",
		start : function(pm) {
			//カスタムルビプラグインがある時とmc_ruby使ってない時はendrubyを無視
			if(TYRANO.kag.tmp.custom_ruby || !TYRANO.kag.tmp.memocho.log.ruby_str){
				//console.log("endruby：無視");
				TYRANO.kag.ftag.nextOrder(); //次のタグへ
			}else{
				//あまり意味ないけどefect待ってみる
				let time = (TYRANO.kag.stat.font.effect) ? parseFloat(TYRANO.kag.stat.font.effect_speed)*600 : 0;
				time = (!TYRANO.kag.stat.is_click_text || !TYRANO.kag.stat.is_nowait || !TYRANO.kag.stat.is_skip) ? time : 0;
				setTimeout(function(){
					let selecter = ($(".current_span").html()) ? $(".current_span") : $(".current_span").prev();//メッセージ空だったら一個前見る
					selecter.children("span:last-child").wrapInner(TYRANO.kag.tmp.memocho.log.ruby_str); //ルビ付ける
					let last_log = TYRANO.kag.variable.tf.system.backlog.pop(); //ログの最後の配列切り取る
					let log = $(last_log);                                     //jQueryドキュメントに
					log.last().wrapInner(TYRANO.kag.tmp.memocho.log.ruby_str); //ルビ付ける
					last_log = jQuery("<div>").append(log.clone(true)).html(); //文字列に戻す
					//console.log("endruby：",last_log);
					TYRANO.kag.variable.tf.system.backlog.push(last_log); //ログに戻す
					TYRANO.kag.tmp.memocho.log.ruby_str = ""; //クリア
					TYRANO.kag.ftag.nextOrder(); //次のタグへ
				},time);
			}
		}
	}

	//ティラノのタグに登録
	for (var tag_name in tag) {
		TYRANO.kag.ftag.master_tag[tag_name] = object(tag[tag_name]);
		TYRANO.kag.ftag.master_tag[tag_name].kag = TYRANO.kag;
	}

}());
