//【バックログプラグイン】fontルビ機能
// Ver.3.52 2022/7/24
// by hororo https://memocho.no-tenki.me/


(function(){

	const tag = {}; //タグ確認用…

	//パラメータ保存
	//fontはstatで
	TYRANO.kag.stat.memocho = TYRANO.kag.stat.memocho || {}; //memocho専用領域
	TYRANO.kag.stat.memocho.log = TYRANO.kag.stat.memocho.log || {};
	TYRANO.kag.stat.memocho.log.font = {};
	//セーブタイトル用（※v515以降不要）
	TYRANO.kag.tmp.memocho = TYRANO.kag.tmp.memocho || {};
	TYRANO.kag.tmp.memocho.log = TYRANO.kag.tmp.memocho.log || {};
	TYRANO.kag.tmp.memocho.log.save_text = TYRANO.kag.stat.mp.save_text || "false";


	//スタイル ※edge/shadowはv515未対応
	const font_style = function(current) {
		let style = "";

		let font = TYRANO.kag.stat.memocho.log.font;
		if(current) font = TYRANO.kag.stat.font; //currentはmc_resetfontで戻す用

		if(font.size) style += "font-size:" + font.size + "px;";
		if(font.color) style += "color:" + font.color + ";";
		if(font.bold) style += "font-weight:" + font.bold + ";";
		if(font.face) style += "font-family:" + font.face + ";";
		if(font.italic) style += "font-style:" + font.italic + ";";
		if(font.edge){
			const edge = "1px 1px 0 " + font.edge + ", -1px 1px 0 " + font.edge + ",1px -1px 0 " + font.edge + ",-1px -1px 0 " + font.edge;
			style += "text-shadow:" + edge + ";";
		}
		else if(font.shadow) style += "text-shadow:" + "2px 2px 2px " + font.shadow + ";";

		if(style.length){
			if(current){
				return style;
			}else{
				style = ' style="' + style + '"';
				TYRANO.kag.stat.memocho.log.font.style = style;
			}
		}

	}


	//[mc_font]タグ
	tag.mc_font = {
		log_join: "true",
		start : function(pm) {

			//パラメータ保存
			if(pm.size) TYRANO.kag.stat.memocho.log.font.size = pm.size;
			if(pm.color) TYRANO.kag.stat.memocho.log.font.color = $.convertColor(pm.color);
			if(pm.bold) TYRANO.kag.stat.memocho.log.font.bold = $.convertBold(pm.bold);
			if(pm.face) TYRANO.kag.stat.memocho.log.font.face = pm.face;
			if(pm.italic) TYRANO.kag.stat.memocho.log.font.italic = $.convertItalic(pm.italic);
			if(pm.edge) TYRANO.kag.stat.memocho.log.font.edge = $.convertColor(pm.edge);
			if(pm.shadow) TYRANO.kag.stat.memocho.log.font.shadow = $.convertColor(pm.shadow);
			if(pm.effect){
				if(pm.effect == "none") TYRANO.kag.stat.memocho.log.font.effect = "";
				else TYRANO.kag.stat.memocho.log.font.effect = pm.effect;
			}
			if(pm.effect_speed) TYRANO.kag.stat.memocho.log.font.effect_speed = pm.effect_speed;

			//ログ用スタイル文字列作成
			font_style();

			//[font]タグ実行
			TYRANO.kag.ftag.startTag("font",pm);

			//nameを追加
			if(pm.name){
				$.setName($(".current_span"), pm.name);
				TYRANO.kag.stat.memocho.log.font.name = " " + pm.name.replace(/,/g," ");
			}
		}
	}


	//[mc_resetfont]タグ
	tag.mc_resetfont = {
		log_join: "true",
		start : function(pm) {
			//ログ用クリア
			if(Object.keys(pm).length == 1){
				TYRANO.kag.stat.memocho.log.font = {};
			}else{
				//パラメータがある分だけクリア
				Object.keys(pm).forEach(function (key){
					TYRANO.kag.stat.memocho.log.font[key] = "";
				});
				font_style(); //ログ用スタイル
			}

			//[resetfont]
			TYRANO.kag.ftag.startTag("resetfont",{});

			//フォント再指定
			Object.keys(TYRANO.kag.stat.memocho.log.font).forEach(function (key){
				if(key != "name" && key != "_tag" && key != "style"){
					if(!TYRANO.kag.stat.memocho.log.font[key]){
						TYRANO.kag.stat.font[key] = TYRANO.kag.stat.default_font[key];
					}else{
						TYRANO.kag.stat.font[key] = TYRANO.kag.stat.memocho.log.font[key];
					}
				}
			});
			//current_spanにスタイル付けないと駄目でした
			let font = font_style(true);
			$(".current_span").attr("style",font);
		}
	}

	//ティラノのタグに登録
	for (var tag_name in tag) {
		TYRANO.kag.ftag.master_tag[tag_name] = object(tag[tag_name]);
		TYRANO.kag.ftag.master_tag[tag_name].kag = TYRANO.kag;
	}


	//pushBackLog
	tyrano.plugin.kag.pushBackLog = function(str, type){

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
		const index = this.variable.tf.system.backlog.length - 1;
		//fontをログに反映
		if(TYRANO.kag.stat.memocho.log.font){
			if(str.indexOf("backlog_text") > -1){
				const style = TYRANO.kag.stat.memocho.log.font.style || "";
				let name = TYRANO.kag.stat.memocho.log.font.name || "";
				name = " " + name.replace(/,/g," ");
				str = str.replace(/(.*) class=(.*)(\"|\')>/,"$1" + style + " class=" + name + "$2$3>");
			}
		}
		//メッセージエリアへname反映
		if(TYRANO.kag.stat.memocho.log.font.name){
			const isLayer = TYRANO.kag.getMessageInnerLayer();
			if (isLayer.find("p").find(".current_span").length == 0) {
				//current_spanが無かったら新しく作っとく
				$.setName(TYRANO.kag.setMessageCurrentSpan(), TYRANO.kag.stat.memocho.log.font.name);
			}
		}
		/////end////////////////////////////////////////////////////


		if (type == "join") {

			//var index = this.variable.tf.system.backlog.length - 1;
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

		/////改造////////////////////////////////////////////////////
		//v515以前対応
		if (TYRANO.kag.version < 515) {
			if(TYRANO.kag.tmp.memocho.log.save_text == "false"){
				this.stat.current_save_str = $(this.variable.tf.system.backlog[index]).text(); //textのみいれる<br>も消える
			}	
		}
		/////end////////////////////////////////////////////////////

		//上限を超えたらFILO で処理
		if (max_back_log < this.variable.tf["system"]["backlog"].length) {
			this.variable.tf["system"]["backlog"].shift();
		}
	}


}());
