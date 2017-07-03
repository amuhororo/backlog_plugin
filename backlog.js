//■pushBackLog
tyrano.plugin.kag.pushBackLog = function(str,type){
	
	if(this.stat.log_write == false) return ;
	
	type = type || "add";
	
	var max_back_log = parseInt(this.kag.config["maxBackLogNum"]);
	if(max_back_log < 1 ) return ;
	
	
	/** ◆ ここから改変 **********************************************************/
	//一時保存ログ
	var log_text = (this.variable.tf.backlog_text) ? this.variable.tf.backlog_text : "";
	var log_name = (this.variable.tf.backlog_name) ? this.variable.tf.backlog_name : "";
	
 	//キャラ名取得
	var chara_name = $.isNull($(".chara_name_area").html());
	var log_name_tag = (this.tmp.backlog.name_none == "true") ? "" : "<dt class='name'>" + log_name + "</dt>" ;
	
	if(type=="join"){
		this.variable.tf["backlog_text"] = log_text + str;//join時は一時保存へ
		
	//p、s、cm、ct、erタグの時ログを纏める
	}else if(type=="p"){

		//Font のデータ
		var font_tag = (this.tmp.backlog.font_flag == true) ? this.tmp.backlog.font_tag : "" ;
		this.tmp.backlog.font_flag == false;
		
		if(this.kag.tmp.backlog.glink_flag == true || log_text==""){
			this.variable.tf.name_count = 0;//glinkの後は名前のカウントリセット
			this.kag.tmp.backlog.glink_flag = false;//glinkフラグ戻す
		
		}else this.variable.tf.name_count = this.variable.tf.name_count + 1;//名前のカウント
		var name_count = this.variable.tf.name_count;

		if(log_text!=""){ //ログがある
			if(this.kag.tmp.backlog.name_repeat == "false" && name_count > 1){
				//カウント2以上の時はclass=noneを入れてdisplay:noneしとく。
				//strは動作確認用だけど残しとく…
				this.variable.tf["system"]["backlog"].push( "<dl class='" + str + " none'>" + log_name_tag + "<dd class='text'>" + font_tag + log_text + "</dd></dl>");
			}else{
				this.variable.tf["system"]["backlog"].push( "<dl class='" + str + "'>" + log_name_tag + "<dd class='text'>" + font_tag + log_text + "</dd></dl>");
			}
		}
		//一時保存ログをクリア
		this.variable.tf.backlog_text = "";
		//fontのデータがあればtrue
		this.tmp.backlog.font_flag = (this.tmp.backlog.font_tag) ? true : false;

		
	//glinkの時は普通に格納
	}else if(type=="glink"){
		this.variable.tf["system"]["backlog"].push(str);
		//一旦キャラ名をリセットするべくフラグ入れる
		this.kag.tmp.backlog.glink_flag = true;
	//通常時
	}else{
		this.variable.tf["system"]["backlog"].push("<dl class='log'>" + str + "</dl>");
	};
	
	//キャラ名保存し直し。
	if(log_name != chara_name)this.variable.tf.name_count = 0;
	this.variable.tf.backlog_name = chara_name;
	/*** ◆ end ****************************************************************************/

	if(max_back_log < this.variable.tf["system"]["backlog"].length){
		this.variable.tf["system"]["backlog"].shift();
	} 	

}


//■[p]
tyrano.plugin.kag.tag.p.start = function() {
	var that = this;
	this.kag.stat.flag_ref_page = true;
	
	/*** ◆ バックログの段落作成 ***********************************************************/
	this.kag.pushBackLog("p","p");
	/*** ◆ end ****************************************************************************/
	
	if (this.kag.stat.is_skip == true) {
		this.kag.ftag.nextOrder();
	}else if(this.kag.stat.is_auto == true){
		this.kag.stat.is_wait_auto = true;
		var auto_speed = that.kag.config.autoSpeed;
		if(that.kag.config.autoSpeedWithText != "0"){
			var cnt_text = this.kag.stat.current_message_str.length;
			auto_speed = parseInt(auto_speed) + (parseInt(that.kag.config.autoSpeedWithText)*cnt_text);
		}
		setTimeout(function(){
			if(that.kag.stat.is_wait_auto == true){
				if(that.kag.tmp.is_vo_play==true){
					that.kag.tmp.is_vo_play_wait = true;
				}else{
					that.kag.ftag.nextOrder();
				}
			}
		}, auto_speed);
	}
};

//■[r]
tyrano.plugin.kag.tag.r.start = function() {

	/*** ◆ バックログ処理 *****************************************************************/
	this.kag.pushBackLog("r","p");
	/*** ◆ end ****************************************************************************/

	var that = this;
	var j_inner_message = this.kag.getMessageInnerLayer();
	var txt = j_inner_message.find("p").find(".current_span").html() + "<br />";
	j_inner_message.find("p").find(".current_span").html(txt);
	setTimeout(function(){
		that.kag.ftag.nextOrder();
	},5);
};


//■[er]
tyrano.plugin.kag.tag.er.start = function() {

	/*** ◆ バックログの段落作成 ***********************************************************/
	this.kag.pushBackLog("er","p");
	/*** ◆ end ****************************************************************************/

	this.kag.ftag.hideNextImg();
	this.kag.getMessageInnerLayer().html("");
	this.kag.ftag.startTag("resetfont");
};

//■[cm]
tyrano.plugin.kag.tag.cm.start = function() {

	/*** ◆ バックログの段落作成 ***********************************************************/
	this.kag.pushBackLog("cm","p");
	/*** ◆ end ****************************************************************************/

	this.kag.ftag.hideNextImg();
	this.kag.layer.clearMessageInnerLayerAll();
	this.kag.layer.getFreeLayer().html("").hide();
	this.kag.ftag.startTag("resetfont");
};

//■[ct]
tyrano.plugin.kag.tag.ct.start = function() {

	/*** ◆ バックログの段落作成 ***********************************************************/
	this.kag.pushBackLog("ct","p");
	/*** ◆ end ****************************************************************************/

	this.kag.ftag.hideNextImg();
	this.kag.layer.clearMessageInnerLayerAll();
	this.kag.layer.getFreeLayer().html("").hide();
	this.kag.stat.current_layer = "message0";
	this.kag.stat.current_page = "fore";
	this.kag.ftag.startTag("resetfont");
};

//■[s]
tyrano.plugin.kag.tag.s.start = function() {

	/*** ◆ バックログの段落作成 ***********************************************************/
	this.kag.pushBackLog("s","p");
	/*** ◆ end ****************************************************************************/

	this.kag.stat.is_strong_stop = true;
	this.kag.layer.hideEventLayer();
};


//■[font]
tyrano.plugin.kag.tag.font.start = function(pm) {
	this.kag.setMessageCurrentSpan();
	var new_font = {};
	
	//◆ログ用スタイル変数
	var style_size = '';
	var style_color = '';
	var style_bold = '';
	var style_face = '';
	var style_italic = '';
	var style_tcy = '';
	
	if (pm.size) {
		this.kag.stat.font.size = pm.size;
		/*** ◆ ログ用 *******************************************************************/
		var style_size = 'font-size:' + pm.size + 'px;';
		/*** ◆ end **********************************************************************/
	}
	if (pm.color) {
		this.kag.stat.font.color = $.convertColor(pm.color);
		/*** ◆ ログ用 *******************************************************************/
		var style_color = 'color:' + $.convertColor(pm.color) + ';';
		/*** ◆ end **********************************************************************/
	}
	if (pm.bold) {
		this.kag.stat.font.bold = $.convertBold(pm.bold);
		/*** ◆ ログ用 *******************************************************************/
		var style_bold = 'font-weight:' + $.convertBold(pm.bold) + ';';	
		/*** ◆ end **********************************************************************/
	}
	if (pm.face) {
		this.kag.stat.font.face = pm.face;
		/*** ◆ ログ用 *******************************************************************/
		var style_face = 'font-family:' + pm.face + ';';
		/*** ◆ end **********************************************************************/
	}
	if (pm.italic){
		this.kag.stat.font["italic"] = $.convertItalic(pm.italic);
		/*** ◆ ログ用 *******************************************************************/
		var style_italic = 'font-style:' + $.convertItalic(pm.italic) + ';';
		/*** ◆ end **********************************************************************/
	}
	
	if (pm.edge) {
		if(pm.edge=="none" || pm.edge==""){
			this.kag.stat.font.edge = "";
		}else{
			this.kag.stat.font.edge = $.convertColor(pm.edge);
		}
	}
	if (pm.shadow) {
		if(pm.shadow=="none" || pm.shadow==""){
			this.kag.stat.font.shadow = "";
		}else{
			this.kag.stat.font.shadow = $.convertColor(pm.shadow);
		}
	}
	
	/*** ◆ 縦中横処理 ********************************************************************/
	if (pm.tcy){
		this.kag.tmp.tcy = true;
		var style_tcy = "class='tcy' ";
	}
	/*** ◆ end ****************************************************************************/
	
	/*** ◆ バックログ処理 *****************************************************************/
	if(this.kag.tmp.backlog.font_style == "true"){
		var backlog = '<span ' + style_tcy +'style="' + style_color + style_size + style_bold + style_italic + style_face + '">';
		this.kag.tmp.backlog.font_tag = backlog;
		this.kag.pushBackLog(backlog,"join");
	}
	/*** ◆ end *****************************************************************************/

	this.kag.ftag.nextOrder();
};


//■[resetfont]
tyrano.plugin.kag.tag.resetfont.start = function() {
	
	/*** ◆ バックログ処理 *****************************************************************/
	this.kag.tmp.backlog.font_flag = false;
	this.kag.tmp.backlog.font_tag = "";
	this.kag.tmp.tcy = false;//縦中横フラグ解除
	//バックログが空欄だったら閉じタグは入れない
	if (this.kag.variable.tf.backlog_text!=""){
		if(this.kag.tmp.backlog.font_style == "true" || this.kag.tmp.tcy == true){
			this.kag.pushBackLog("</span>","join");
		}
/*
		//縦中横
		else if (this.kag.tmp.tcy == true){
			this.kag.pushBackLog("</span>","join");
			this.kag.tmp.backlog.font_tag = "";
			this.kag.tmp.tcy = false;
		}
*/
	}
	/*** ◆ end *****************************************************************************/
	
	var j_span = this.kag.setMessageCurrentSpan();
	this.kag.stat.font = $.extend(true, {}, this.kag.stat.default_font);
	this.kag.ftag.nextOrder();
};

//■[glink]
tyrano.plugin.kag.tag.glink.setEvent = function(j_button,pm){
	var that = TYRANO;
	(function() {
		var _target = pm.target;
		var _storage = pm.storage;
		var _pm = pm;
		var preexp = that.kag.embScript(pm.preexp);
		var button_clicked = false;
		
		j_button.click(function(e) {
			if (_pm.clickse != "") {
				that.kag.ftag.startTag("playse", {
					"storage" : _pm.clickse
				});
			}

			/*** ◆ バックログに入れる場合の処理 ***************************************************/
			if(that.kag.tmp.backlog.glink_log != "false"){
				if(that.kag.tmp.backlog.glink_log == "true")var glink_name = "≪選択≫";
				else var glink_name = that.kag.tmp.backlog.glink_log;
				that.kag.pushBackLog("<dl class='glink'><dt class='name'>" + glink_name + "</dt><dd class='text'>" + _pm.text + "</dd></dl>","glink");
			}
			/*** ◆ end *****************************************************************************/

			if (that.kag.stat.is_strong_stop != true) {
				return false;
			}
			button_clicked = true;
			if (_pm.exp != "") {
				that.kag.embScript(_pm.exp, preexp);
			}
			that.kag.layer.showEventLayer();
			that.kag.ftag.startTag("cm", {});
			that.kag.ftag.startTag("jump", _pm);
			if(that.kag.stat.skip_link=="true"){
				e.stopPropagation();
			}else{
				that.kag.stat.is_skip = false; 
			}
		});
            
		j_button.hover(function() {
			if (_pm.enterimg != "") {
				var enterimg_url = "./data/image/" + _pm.enterimg;
				j_button.css("background-image", "url(" + enterimg_url + ")");
			}
			if (_pm.enterse != "") {
				that.kag.ftag.startTag("playse", {
					"storage" : _pm.enterse,
					"stop" : true
				});
			}
		}, 
		function() {
			if (_pm.enterimg != "") {
				var img_url = "./data/image/" + _pm.graphic;
				j_button.css("background-image", "url(" + img_url + ")");
			}
			if (_pm.leavese != "") {
				that.kag.ftag.startTag("playse", {
					"storage" : _pm.leavese,
					"stop" : true
				});
			}
		}); 

	})();
};


//■text
tyrano.plugin.kag.tag.text.showMessage = function(message_str,pm) {
	var that = this;
/*
	var chara_name = $.isNull($(".chara_name_area").html());
	if(chara_name != ""){
		this.kag.pushBackLog("<b>"+chara_name+"</b>："+message_str,"add");
	}else{
		if(pm.backlog=="join"){
			this.flag_join = true;
			this.kag.pushBackLog(message_str,"join");
		}else{
			if(this.flag_join==true){
				this.kag.pushBackLog(message_str,"join");
				this.flag_join=false;
			}else{
				this.kag.pushBackLog(message_str,"add");
			}
		}
	}
*/	
	that.kag.ftag.hideNextImg();
	(function(jtext) {
		if (jtext.html() == "") {
			jtext.append("<p class=''></p>");
		}
		var _message_str = message_str;
		var current_str = "";
		if (jtext.find("p").find(".current_span").length != 0) {
			current_str = jtext.find("p").find(".current_span").html();
		}
		var index = 0;
		that.kag.checkMessage(jtext);
		var j_span = that.kag.getMessageCurrentSpan();
		j_span.css({
			"color":that.kag.stat.font.color,
			"font-weight": that.kag.stat.font.bold,
			"font-size": that.kag.stat.font.size + "px",
			"font-family": that.kag.stat.font.face,
			"font-style":that.kag.stat.font.italic
			});
		if(that.kag.stat.font.edge !=""){
			var edge_color = that.kag.stat.font.edge;
			j_span.css("text-shadow","1px 1px 0 "+edge_color+", -1px 1px 0 "+edge_color+",1px -1px 0 "+edge_color+",-1px -1px 0 "+edge_color+"");
		}else if(that.kag.stat.font.shadow != ""){
			j_span.css("text-shadow","2px 2px 2px "+that.kag.stat.font.shadow);
		}
		if(that.kag.config.autoRecordLabel == "true"){
			if(that.kag.stat.already_read == true){
				if(that.kag.config.alreadyReadTextColor !="default"){
					j_span.css("color",$.convertColor(that.kag.config.alreadyReadTextColor));
				}
			}else{
				if(that.kag.config.unReadTextSkip == "false"){
					that.kag.stat.is_skip = false;
				}
			}
		}
		var ch_speed = 30;		
		if(that.kag.stat.ch_speed != ""){
			ch_speed = parseInt(that.kag.stat.ch_speed);
		}else if(that.kag.config.chSpeed){
			ch_speed = parseInt(that.kag.config.chSpeed);
		}		
		var pchar = function(pchar) {
			var c = _message_str.substring(index, ++index);
			if (that.kag.stat.ruby_str != "") {
				c = "<ruby><rb>" + c + "</rb><rt>" + that.kag.stat.ruby_str + "</rt></ruby>";
				that.kag.stat.ruby_str = "";
			}
			
			/*** ◆ ログ保存 **********************************************************/
			that.kag.pushBackLog(c,"join");			
			/*** ◆ end ***************************************************************/

			current_str += c;
			if(that.kag.stat.is_skip != true && that.kag.stat.is_nowait!=true && ch_speed >3){
				that.kag.appendMessage(jtext, current_str);
			}
			if (index <= _message_str.length) {
				that.kag.stat.is_adding_text = true;
				if (that.kag.stat.is_click_text == true || that.kag.stat.is_skip == true || that.kag.stat.is_nowait == true) {
					setTimeout(function() {
						pchar(pchar)
					}, 0);
				} else {
					setTimeout(function() {
						pchar(pchar)
					}, ch_speed);
				}				
			} else {
				that.kag.stat.is_adding_text = false;
				that.kag.stat.is_click_text = false;
				
				if (that.kag.stat.is_stop != "true") {
					if(that.kag.stat.is_skip == true || that.kag.stat.is_nowait==true || ch_speed < 3){
						that.kag.appendMessage(jtext, current_str);
						setTimeout(function(){
							if (!that.kag.stat.is_hide_message) that.kag.ftag.nextOrder();
						}, parseInt(that.kag.config.skipSpeed));
					}else{
						if (!that.kag.stat.is_hide_message) that.kag.ftag.nextOrder();
					}
				} else {
				}
				if (that.kag.stat.flag_glyph == "false") {
					$(".img_next").remove();
					jtext.find("p").append("<img class='img_next' src='./tyrano/images/system/nextpage.gif' />");
				} else {
					$(".glyph_image").show();
				}
			}
		};
		pchar(pchar);
	})(this.kag.getMessageInnerLayer());
};
tyrano.plugin.kag.tag.text.showMessageVertical = function(message_str,pm) {
	var that = this;
	that.kag.ftag.hideNextImg();
	
/*
	if(pm.backlog=="join"){
		this.flag_join = true;
		this.kag.pushBackLog(message_str,"join");
	}else{
		if(this.flag_join==true){
			this.kag.pushBackLog(message_str,"join");
			this.flag_join=false;
		}else{
			this.kag.pushBackLog(message_str,"add");
		}
	}
*/	
	(function(jtext) {
		if (jtext.html() == "") {
			jtext.append("<p class='vertical_text'></p>");
		}
		var _message_str = message_str;
		var current_str = "";
 		if (jtext.find("p").find(".current_span").length != 0) {
			current_str = jtext.find("p").find(".current_span").html();
		}
		var index = 0;
		that.kag.checkMessage(jtext);
		var j_span = that.kag.getMessageCurrentSpan();

		/*** ◆ 縦中横 ************************************************************/
		if(that.kag.tmp.tcy == true)j_span.addClass("tcy");
		/*** ◆ end ***************************************************************/
		
		j_span.css({
			"color":that.kag.stat.font.color,
			"font-weight": that.kag.stat.font.bold,
			"font-size": that.kag.stat.font.size + "px",
			"font-family": that.kag.stat.font.face,
			"font-style":that.kag.stat.font.italic
		});
		if(that.kag.stat.font.edge !=""){
			var edge_color = that.kag.stat.font.edge;
			j_span.css("text-shadow","1px 1px 0 "+edge_color+", -1px 1px 0 "+edge_color+",1px -1px 0 "+edge_color+",-1px -1px 0 "+edge_color+"");
		}else if(that.kag.stat.font.shadow != ""){
			j_span.css("text-shadow","2px 2px 2px "+that.kag.stat.font.shadow);
		}
		if(that.kag.config.autoRecordLabel == "true"){
			if(that.kag.config.alreadyReadTextColor !="default"){
				if(that.kag.stat.already_read == true){
					j_span.css("color",$.convertColor(that.kag.config.alreadyReadTextColor));
				}
			}
		}
		var ch_speed = 30;
		if(that.kag.stat.ch_speed != ""){
			ch_speed = parseInt(that.kag.stat.ch_speed);
		}else if(that.kag.config.chSpeed){
			ch_speed = parseInt(that.kag.config.chSpeed);
		}
		var pchar = function(pchar) {
			var c = _message_str.substring(index, ++index);
			if (that.kag.stat.ruby_str != "") {
				c = "<ruby><rb>" + c + "</rb><rt>" + that.kag.stat.ruby_str + "</rt></ruby>";
				that.kag.stat.ruby_str = "";
			}
			
			/*** ◆ ログ保存 **********************************************************/
			that.kag.pushBackLog(c,"join");			
			/*** ◆ end ***************************************************************/

			current_str += c;
			if(that.kag.stat.is_skip != true && that.kag.stat.is_nowait!=true){
				that.kag.appendMessage(jtext, current_str);
			}
			if (index <= _message_str.length) {
				that.kag.stat.is_adding_text = true;
				if (that.kag.stat.is_click_text == true || that.kag.stat.is_skip == true) {
					setTimeout(function() {
						pchar(pchar)
					}, 0);
				} else {
					setTimeout(function() {
						pchar(pchar)
					}, ch_speed);
				}
			} else {
				that.kag.stat.is_adding_text = false;
				that.kag.stat.is_click_text = false;
				if(that.kag.stat.is_skip == true || that.kag.stat.is_nowait==true){
					that.kag.appendMessage(jtext, current_str);
					setTimeout(function(){
						that.kag.ftag.nextOrder()
					}, parseInt(that.kag.config.skipSpeed));
				}else{
					that.kag.ftag.nextOrder()
				}
				if (that.kag.stat.flag_glyph == "false") {
					$(".img_next").remove();
					jtext.find("p").append("<img class='img_next' src='./tyrano/images/system/nextpage.gif' />");

				} else {
					$(".glyph_image").show();
				}
			}
		};
		pchar(pchar);
	})(this.kag.getMessageInnerLayer())
};


//■displayLog
tyrano.plugin.kag.menu.displayLog = function () {
	var that = this;
	this.kag.stat.is_skip = false;
	
	var j_save = $("<div></div>");
	
	this.kag.html("backlog", {
		"novel" : $.novel
	}, function(html_str) {
		
		var j_menu = $(html_str);
		
		var layer_menu = that.kag.layer.getMenuLayer();
		layer_menu.empty();
		layer_menu.append(j_menu);
		
		layer_menu.find(".menu_close").click(function() {
			layer_menu.fadeOut(300,function(){
				layer_menu.empty();
			});
			if (that.kag.stat.visible_menu_button == true) {
				$(".button_menu").show();
			}
		});
		
		layer_menu.find(".button_smart").hide();
		
		/*** ◆ スマホのボタンの上下でスクロールを縦書き用も追加してみたけど未確認 *******/
		if ( that.kag.config.vertical == "true" ){
			if($.userenv()!="pc"){
				layer_menu.find(".button_smart").show();
				layer_menu.find(".button_arrow_up").rotate(270).click(function(){
					var now = layer_menu.find(".log_body").scrollLeft();
					var pos = now - 60;
					layer_menu.find(".log_body").animate({scrollLeft:pos},{queue:false});
				});
				layer_menu.find(".button_arrow_down").rotate(90).click(function(){
					var now = layer_menu.find(".log_body").scrollLeft();
					var pos = now + 60;
					layer_menu.find(".log_body").animate({scrollLeft:pos},{queue:false});
				});
			}
		}else{
			if($.userenv()!="pc"){
				layer_menu.find(".button_smart").show();
				layer_menu.find(".button_arrow_up").click(function(){
					var now = layer_menu.find(".log_body").scrollTop();
					var pos = now - 60;
					layer_menu.find(".log_body").animate({scrollTop:pos},{queue:false});
				});
				layer_menu.find(".button_arrow_down").click(function(){
					var now = layer_menu.find(".log_body").scrollTop();
					var pos = now + 60;
					layer_menu.find(".log_body").animate({scrollTop:pos},{queue:false});
				});
			}
		}
		/*** ◆ end *****************************************************************************/

		var log_str = "";
		var array_log = that.kag.variable.tf.system.backlog;
		for (var i = 0; i < array_log.length; i++) {
			log_str += array_log[i];
		}

		/*** ◆ 一時保存分のログを取得 **********************************************************/
		var log_name = that.kag.variable.tf.backlog_name;
		var log_text = that.kag.variable.tf.backlog_text;
		
		var log_name_tag = (that.kag.tmp.backlog.name_none == "true") ? "" : "<dt class='name'>" + log_name + "</dt>" ;

		var none = (that.kag.variable.tf.name_count > 0) ? " none" : "";
		var log_tmp = (log_text) ? "<dl class='a" + none + "'>" + log_name_tag + "<dd class='text'>" + log_text + "</dd></dl>" : "" ;
		/*** ◆ end *****************************************************************************/
		
		/*** ◆ 一時保存ログも追加 **************************************************************/
		layer_menu.find(".log_body").html(log_str + log_tmp);
		/*** ◆ end *****************************************************************************/

		layer_menu.find(".log_body").css("font-family", that.kag.config.userFace);				
				
		/*** ◆ Config.tjsのデフォルト設定を追加 ************************************************/
		if(that.kag.tmp.backlog.def_style == "true"){
			var line_height = parseInt(that.kag.config.defaultFontSize) + parseInt(that.kag.config.defaultLineSpacing);
			line_height = parseInt(line_height) / parseInt(that.kag.config.defaultFontSize);
			var weight = (that.kag.config.defaultBold=="true") ? $.convertBold(that.kag.config.defaultBold) : "normal" ;
			$(".log_body").css({
				'font-size': that.kag.config.defaultFontSize + 'px',
				'font-weight': weight,
				'line-height': line_height,
				'letter-spacing': that.kag.config.defaultPitch + 'px',
				'color': $.convertColor(that.kag.config.defaultChColor)
			});
		};
		/*** ◆ end *****************************************************************************/

		/*** ◆ 縦書き用 ************************************************************************/
		if ( that.kag.config.vertical == "true" ){
		
			//align 削除を追加
			layer_menu.removeAttr("align")
			layer_menu.find(".log_body").removeAttr("align").addClass('vertical')
			
			//backlog.html のCSSリセット、writing-modeは強制で入れる。
			$(".log_body").css('overflow-y','').css('overflow-x','scroll').css('writing-mode','vertical-rl').css('-webkit-writing-mode','vertical-rl');
						
			//上下ホールで横スクロール
			var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
			$(document).on(mousewheelevent,function(e){
        		var num = $(".log_body").scrollLeft();
        		e.preventDefault();
        		var delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
        		if (delta < 0){
            		var num = num - 60;
            		$(".log_body").scrollLeft(num);
        		} else {
            		var num = num + 60;
           			 $(".log_body").scrollLeft(num)
        		}
			});		
		};
		/*** ◆ end *****************************************************************************/

		/*** ◆ 縦書き時のスクロール処理を追記 **************************************************/
		$.preloadImgCallback(layer_menu,function(){
			layer_menu.fadeIn(300);
			if ( that.kag.config.vertical == "true" ){
				layer_menu.find(".log_body").scrollLeft(0);
			} else {
				layer_menu.find(".log_body").scrollTop(9999999999);
			};
		},that);
		/*** ◆ end *****************************************************************************/
		
		$(".button_menu").hide();
	});
};
