//【バックログプラグイン】
// Ver.3.50 2022/6/
// by hororo https://memocho.no-tenki.me/

(function(){

	//パラメータ保存
	TYRANO.kag.tmp.memocho = TYRANO.kag.tmp.memocho || {};
	TYRANO.kag.tmp.memocho.log = TYRANO.kag.tmp.memocho.log || {};

	TYRANO.kag.tmp.memocho.log.mark = TYRANO.kag.stat.mp.mark || "：";
	TYRANO.kag.tmp.memocho.log.name_color = TYRANO.kag.stat.mp.name_color || "false";
	TYRANO.kag.tmp.memocho.log.name_none = TYRANO.kag.stat.mp.name_none || "false";
	TYRANO.kag.tmp.memocho.log.name_repeat = TYRANO.kag.stat.mp.name_repeat || "true";
	TYRANO.kag.tmp.memocho.log.text_center = TYRANO.kag.stat.mp.text_center || "false";
	TYRANO.kag.tmp.memocho.log.vertical = TYRANO.kag.stat.mp.vertical || TYRANO.kag.config.vertical;


	// [l]でaddにならないように。
	if(TYRANO.kag.stat.mp.l_join == "true") tyrano.plugin.kag.tag.l.log_join = "true";

	//displayLog
	tyrano.plugin.kag.menu.displayLog = function() {

		var that = this;
		this.kag.stat.is_skip = false;

		var j_save = $("<div></div>");

		this.kag.html("backlog", {
			"novel": $.novel
		}, function(html_str) {

			var j_menu = $(html_str);

			var layer_menu = that.kag.layer.getMenuLayer();
			layer_menu.empty();
			layer_menu.append(j_menu);

			layer_menu.find(".menu_close").click(function() {
				layer_menu.fadeOut(300, function() {
					layer_menu.empty();
				});
				if (that.kag.stat.visible_menu_button == true) {
					$(".button_menu").show();
				}
			});

			//スマホの場合はボタンの上下でスクロールできるようにする
			layer_menu.find(".button_smart").hide();
			if ($.userenv() != "pc") {
				layer_menu.find(".button_smart").show();
				layer_menu.find(".button_arrow_up").click(function() {
					var now = layer_menu.find(".log_body").scrollTop();
					var pos = now - 60;
					layer_menu.find(".log_body").animate({ scrollTop: pos }, { queue: false });
				});

				layer_menu.find(".button_arrow_down").click(function() {
					var now = layer_menu.find(".log_body").scrollTop();
					var pos = now + 60;
					layer_menu.find(".log_body").animate({ scrollTop: pos }, { queue: false });
				});

			}

			var log_str = "";

			var array_log = that.kag.variable.tf.system.backlog;

			// 削除 ////////////////////////////////////////////////
			//for (var i = 0; i < array_log.length; i++) {
			//	log_str += array_log[i] + "<br />";
			//}

			// 追加 ////////////////////////////////////////////////
			const log = that.kag.tmp.memocho.log;

			let chara_name = ""; //キャラ名一時保存用

			for (var i = 0; i < array_log.length; i++) {

				array_log[i] = array_log[i].replace(/\\x20|&nbsp;/g, " ");   //半角空白置換
				let new_log = array_log[i];

				let charaEName = ""; //キャラ名（英）
				let charaColor = ""; //キャラ色
				let class_name = "log"; //div用class

				//classがある場合
				let classList = ["ないよ"];
				if(new_log.indexOf("class=") > -1){
					let logHTML = $(new_log); //jQuery
					//let logHTML = $.parseHTML(new_log); //node?
					//順番に処理
					for(let i = 0; i < logHTML.length; i++){
						if(logHTML[i]["nodeName"] != "#comment"){ //コメントは無視
							classList = logHTML[i]["classList"] || classList; //classListを取得
							//glinkか
							if(logHTML[i]["className"].indexOf("glink") > -1){
								charaEName = "glink";
								new_log = new_log.replace("<span","<p class='log_text'><span") + "</p>";
							}
							//キャラ名があるか
							else if(classList[0] == "backlog_chara_name"){
								//日本語名なら英数名に
								charaEName = TYRANO.kag.stat.jcharas[classList[1]] || classList[1];
								 //名前の色
								if(log.name_color == "true"){
									charaColor = TYRANO.kag.stat.charas[charaEName].color || "";
									charaColor = " style='color:" + $.convertColor(charaColor) + "'";
									new_log = new_log.replace("<b","<b" + charaColor);
								}
								//テキストを p で囲う
								new_log = new_log.replace("</b>：","</b><p class='log_text'>") + "</p>";
							}
							//メッセージか
							else if(classList[0] == "backlog_text"){
								charaEName = "no_name"; //名前指定無し
								//名前用 b を追加してテキストを p で囲う
								new_log = "<b class='backlog_chara_name'></b><div class='log_text'>" + new_log + "</div>";
							}
							//pushLog
							else{
								charaEName = classList.value; //class全部
								new_log = "<span class='log_text'>" + new_log + "</span>";
							}
							//マーク
							if(!logHTML[i].attributes["data-mark"]){
								new_log = new_log.replace("<b ","<b data-mark='"+ log.mark +"' "); //マーク
							}
							break; //一個目のタグでやめる
						} //end コメント無視
					} //end for logHTML.length
				}else{
					new_log = "<span class='log_text'>" + new_log + "</span>";
				}
				//マーク
				if(charaEName) class_name += " " + charaEName;
				if(chara_name == charaEName) class_name += " none";
				else chara_name = charaEName;

				log_str += "<div class='" + class_name + "'>" + new_log + "</div>"; //divで囲おう

			}
			// class追加 ////////////////////////////////////////////
			if(log.name_none == "true") layer_menu.find(".log_body").addClass("name_none");
			if(log.name_repeat == "false") layer_menu.find(".log_body").addClass("name_repeat");
			else if(log.text_center == "true") layer_menu.find(".log_body").addClass("center");
			// END /////////////////////////////////////////////////

			layer_menu.find(".log_body").html(log_str);
			layer_menu.find(".log_body").css("font-family", that.kag.config.userFace);


			// 削除 ////////////////////////////////////////////////
			//$.preloadImgCallback(layer_menu, function() {
				//layer_menu.stop(true, true).fadeIn(300);
				//一番下固定させる
				//layer_menu.find(".log_body").scrollTop(9999999999);
			//}, that);

			// 縦書き用 ////////////////////////////////////////////
			if(log.name_none == "true"){
				layer_menu.find(".log_body").find(".backlog_chara_name").css("display","none");
			}
			if(log.vertical == "true"){
				//縦書き用スクロール
				if($.userenv()!="pc"){
					layer_menu.find(".button_smart").show();
					layer_menu.find(".button_arrow_up").rotate(270).click(function(){
						const now = layer_menu.find(".log_body").scrollLeft();
						const pos = now - 60;
						layer_menu.find(".log_body").animate({scrollLeft:pos},{queue:false});
					});
					layer_menu.find(".button_arrow_down").rotate(90).click(function(){
						const now = layer_menu.find(".log_body").scrollLeft();
						const pos = now + 60;
						layer_menu.find(".log_body").animate({scrollLeft:pos},{queue:false});
					});
				}

				//align 削除を追加
				layer_menu.removeAttr("align");
				layer_menu.find(".log_body").removeAttr("align").addClass("vertical_text");

				//backlog.html のCSSリセット、writing-modeは強制で入れる。
				$(".log_body").css({
					"overflow-y": "",
					"overflow-x": "scroll",
					"writing-mode": "vertical-rl",
					"-webkit-writing-mode": "vertical-rl"
				});

			}
			//上下ホールで横スクロール
			const mousewheelevent = "onwheel" in document ? "wheel" : "onmousewheel" in document ? "mousewheel" : "DOMMouseScroll";
			$(document).on(mousewheelevent,function(e){
				let num = $(".log_body").scrollLeft();
				//e.preventDefault();
				const delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
				if (delta < 0){
					num = num - 60;
					$(".log_body").scrollLeft(num);
				}else{
					num = num + 60;
					$(".log_body").scrollLeft(num);
				}
			});

			//縦書き時のスクロール処理を追加
			$.preloadImgCallback(layer_menu,function(){
				layer_menu.fadeIn(300);
				if (log.vertical == "true"){
					layer_menu.find(".log_body").scrollLeft(0);
				} else {
					layer_menu.find(".log_body").scrollTop(9999999999);
				};
			},that);
			// END /////////////////////////////////////////////////

			$(".button_menu").hide();
		});
	}


}());
