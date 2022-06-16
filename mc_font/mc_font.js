//【fontをバックログに入れるプラグイン】
// Ver.1.00 2022/6/10
// by hororo https://memocho.no-tenki.me/

(function(){

	const tag = {}; //タグ確認用…
	//パラメータ保存
	TYRANO.kag.stat.memocho = TYRANO.kag.stat.memocho || {}; //memocho専用領域
	TYRANO.kag.stat.memocho.log = TYRANO.kag.stat.memocho.log || {};
	TYRANO.kag.stat.memocho.log.font = {};
	TYRANO.kag.tmp.memocho = TYRANO.kag.tmp.memocho || {};
	TYRANO.kag.tmp.memocho.log = TYRANO.kag.tmp.memocho.log || {};

	//mc_fontタグ
	tag.mc_font = {
		log_join: "true",
		start : function(pm) {
			let style = '';
			let name = ''
			if(pm.size) style += 'font-size:' + pm.size + 'px;';
			if(pm.color) style += 'color:' + $.convertColor(pm.color) + ';';
			if(pm.bold) style += 'font-weight:' + $.convertBold(pm.bold) + ';';
			if(pm.face) style += 'font-family:' + pm.face + ';';
			if(pm.italic) style += 'font-style:' + $.convertItalic(pm.italic) + ';';
			if(pm.edge){
				const edge = $.convertColor(pm.edge);
				style += 'text-shadow:' + "1px 1px 0 " + edge + ", -1px 1px 0 " + edge + ",1px -1px 0 " + edge + ",-1px -1px 0 " + edge + ";";
			}
			if(pm.shadow){
				style += 'text-shadow:' + "2px 2px 2px " + $.convertColor(pm.shadow) + ';';
			}
			if(pm.name){
				$.setName($(".current_span"), pm.name);
				name = ' ' + pm.name.replace(/,/g," ");
			}
			if(style.length) style = " style='" + style + "'";
			TYRANO.kag.stat.memocho.log.font.style = style;
			TYRANO.kag.stat.memocho.log.font.name = name;
			//let last_log = TYRANO.kag.variable.tf.system.backlog.pop();
			//console.log("ログ1",last_log);
			//last_log = last_log.replace(/(.*)<span/,"$1<span" + style).replace(/(.*)\'>/,"$1" + name + "'>");
			//last_log = last_log.replace(/(.*)<span(.*)\'>/,"$1<span" + style + "$2" + name + "'>");
			//TYRANO.kag.pushBackLog(last_log,"add");
			//console.log("ログ2",last_log);
			TYRANO.kag.ftag.startTag("font",pm);
		}
	}

	tag.mc_resetfont = {
		log_join: "true",
		start : function(pm) {
			//ログ
			TYRANO.kag.stat.memocho.log.font = {};
			//[resetfont]
			TYRANO.kag.ftag.startTag("resetfont",{});
		}
	}

	//ティラノのタグに登録
	for (var tag_name in tag) {
		TYRANO.kag.ftag.master_tag[tag_name] = object(tag[tag_name]);
		TYRANO.kag.ftag.master_tag[tag_name].kag = TYRANO.kag;
	}


	//[l]はjoinがいいな
	TYRANO.kag.tag.l.log_join = "true";


	//pushBackLog
	TYRANO.kag.pushBackLog = function(str, type) {

		//バックログを記録するか否か
		if (this.stat.log_write == false) {
			return;
		}

		type = type || "add";

		var max_back_log = parseInt(this.kag.config["maxBackLogNum"]);

		if (max_back_log < 1) return;

		//バックログを必ずクリアしてから追加。pなどの通過後
		if (this.kag.stat.log_clear == true) {
			type = "add";
			this.kag.stat.log_clear = false;
		}

		/////改造////////////////////////////////////////////////////
		//font反映
		if(TYRANO.kag.stat.memocho.log.font){
			if(str.indexOf("backlog_text") > -1){
				const style = TYRANO.kag.stat.memocho.log.font.style || "";
				const name = TYRANO.kag.stat.memocho.log.font.name || "";
				//str = str.replace(/(.*)<span(.*)\'>/,"$1<span" + style + "$2" + name + "'>");
				str = str.replace(/(.*)class=(.*)\'>/,"$1" + style + "class=" + name + "$2'>");
				//console.log("pushBackLog：",str,TYRANO.kag.stat.memocho.log.font,this.variable.tf.system.backlog);
			}
		}
		/////改造////////////////////////////////////////////////////


		if (type == "join") {

			var index = this.variable.tf.system.backlog.length - 1;
			if (index >= 0) { //配列が存在しない場合はpushだ
				var tmp = this.variable.tf["system"]["backlog"][index];
				//this.variable.tf["system"]["backlog"][this.variable.tf.system.backlog.length - 1] = tmp + str;
				this.variable.tf["system"]["backlog"][index] = tmp + str;
			} else {
				this.variable.tf["system"]["backlog"].push(str);
			}

		} else {
			this.variable.tf["system"]["backlog"].push(str);
		}

		//セーブ用のテキストファイルを保存
		this.stat.current_save_str = this.variable.tf["system"]["backlog"][this.variable.tf.system.backlog.length - 1];

		//上限を超えたらFILO で処理
		if (max_back_log < this.variable.tf["system"]["backlog"].length) {
			this.variable.tf["system"]["backlog"].shift();
		}
	}


}());
