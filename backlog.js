/* 【バックログプラグイン Ver.3.10】2021/02/18					*/
/*	by hororo http://hororo.wp.xdomain.jp/118/			*/


//■[font]
tyrano.plugin.kag.tag.font.start = function(pm) {

	//this.kag.setMessageCurrentSpan();

	//--- ◆ name追加 -------------------------------------------------------------------------
	if (pm.name) {
		$.setName(this.kag.setMessageCurrentSpan(), pm.name);
		this.kag.stat.font.name = pm.name;
	}else{
		this.kag.setMessageCurrentSpan();
	}
	//--- ◆ end -----------------------------------------------------------------------------

	var new_font = {};

	if (pm.size) {
		this.kag.stat.font.size = pm.size;
	}
	if (pm.color) {
		this.kag.stat.font.color = $.convertColor(pm.color);
	}
	if (pm.bold) {
		this.kag.stat.font.bold = $.convertBold(pm.bold);
	}
	if (pm.face) {
		this.kag.stat.font.face = pm.face;
	}
	if (pm.italic){
		this.kag.stat.font["italic"] = $.convertItalic(pm.italic);
	}

	if(pm.effect){
		if(pm.effect=="none"){
			this.kag.stat.font["effect"] = "";
		}else{
			this.kag.stat.font["effect"] = pm.effect;
		}
	}
	if(pm.effect_speed){
		this.kag.stat.font["effect_speed"] = pm.effect_speed;
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
			this.kag.stat.font.shadow = $.convertColor(pm.shadow);
		}
	}

	//--- ◆ バックログ用フラグ ----------------------------------------------------------------
	if(this.kag.tmp.backlog.font_style == "true"){
		if( pm.size || pm.color || pm.bold || pm.italic || pm.edge || pm.shadow){
			this.kag.tmp.backlog.font_flag = "true";
			this.kag.tmp.backlog.font = pm;
		}
	}
	//--- ◆ end -----------------------------------------------------------------------------

	this.kag.ftag.nextOrder();
};


//■[resetfont]
tyrano.plugin.kag.tag.resetfont.start = function() {

	//--- ◆ バックログ処理 -------------------------------------------------------------------
	this.kag.tmp.backlog.font_flag = "false";//フォントフラグ解除
	this.kag.tmp.tcy = "false";//縦中横フラグ解除
	//--- ◆ end -----------------------------------------------------------------------------

	var j_span = this.kag.setMessageCurrentSpan();
	this.kag.stat.font = $.extend(true, {}, this.kag.stat.default_font);
	this.kag.ftag.nextOrder();
};


//■[p]
tyrano.plugin.kag.tag.p.start = function() {

	//--- ◆ バックログ処理 ----------------------------------------------------------
	this.kag.stat.log_add="true";
	//--- ◆ nowait処理 ----------------------------------------------------------
	this.kag.getMessageInnerLayer().find("span").css({'opacity':'1'});
	//--- ◆ end --------------------------------------------------------------------

	var that = this;
	this.kag.stat.flag_ref_page = true;
	this.kag.ftag.showNextImg();
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

	//--- ◆ バックログ処理 -----------------------------------------------------------------
	this.kag.pushBackLog("<br>","join");
	//--- ◆ end ---------------------------------------------------------------------------

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

	//--- ◆ バックログ処理 ----------------------------------------------------------
	this.kag.stat.log_add="true";
	//--- ◆ end --------------------------------------------------------------------

	this.kag.ftag.hideNextImg();
	this.kag.getMessageInnerLayer().html("");
	this.kag.ftag.startTag("resetfont");
};


//■[cm]
tyrano.plugin.kag.tag.cm.start = function() {

	//--- ◆ バックログ処理 ----------------------------------------------------------
	this.kag.stat.log_add="true";
	//--- ◆ end --------------------------------------------------------------------

	this.kag.ftag.hideNextImg();
	if(this.kag.stat.vchat.is_active){
		this.kag.ftag.startTag("vchat_in",{});
	}else{
		this.kag.layer.clearMessageInnerLayerAll();
	}
	this.kag.stat.log_clear = true;
	this.kag.layer.getFreeLayer().html("").hide();
	this.kag.ftag.startTag("resetfont");
};


//■[ct]
tyrano.plugin.kag.tag.ct.start = function() {

	//--- ◆ バックログ処理 ----------------------------------------------------------
	this.kag.stat.log_add="true";
	//--- ◆ end --------------------------------------------------------------------

	this.kag.ftag.hideNextImg();
	this.kag.layer.clearMessageInnerLayerAll();
	this.kag.layer.getFreeLayer().html("").hide();
	this.kag.stat.current_layer = "message0";
	this.kag.stat.current_page = "fore";
	this.kag.ftag.startTag("resetfont");
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
					"storage" : _pm.clickse,
					"stop" : true
				});
			}

			//--- ◆ バックログに入れる場合の処理 --------------------------------------------------------
			var glink_name = that.kag.tmp.backlog.glink_name;
			if(_pm.log == "false"){
			}else if(that.kag.tmp.backlog.glink_log == "true"){
				if(_pm.log && _pm.log != "true") glink_name = _pm.log;
				//that.kag.tmp.backlog.glink_flag = true;
				that.kag.pushBackLog("<dt class='log_name glink'>" + glink_name + "</dt><dd class='log_text glink'>" + _pm.text + "</dd>","add");
			}
			//--- ◆ end ------------------------------------------------------------------------------

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
		}),
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
		};
	})();
};


//■[displayLog]
tyrano.plugin.kag.menu.displayLog = function() {

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

		//if($.userenv()!="pc"){
		//		layer_menu.find(".button_smart").show();
		//		layer_menu.find(".button_arrow_up").click(function(){
		//				var now = layer_menu.find(".log_body").scrollTop();
		//				var pos = now - 60;
		//				layer_menu.find(".log_body").animate({scrollTop:pos},{queue:false});
		//		});
		//
		//		layer_menu.find(".button_arrow_down").click(function(){
		//				var now = layer_menu.find(".log_body").scrollTop();
		//				var pos = now + 60;
		//				layer_menu.find(".log_body").animate({scrollTop:pos},{queue:false});
		//		});
		//}

		//--- ◆ 縦書き用スクロール処理も追加 ----------------------------------------------------
		if ( that.kag.tmp.backlog.vertical == "true" ){
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
				})
			}
		}
		//--- ◆ end ----------------------------------------------------------------------------------

		var log_str = "";
		var array_log = that.kag.variable.tf.system.backlog;

		for (var i = 0; i < array_log.length; i++) {

			//log_str += array_log[i] + "<br />";

			//--- ◆ ログ書き出し -------------------------------------------------------
			if(array_log[i].includes("script") && !array_log[i].includes("span")){
				log_str += array_log[i];
			} else {
				log_str += "<dl class='log'>" + array_log[i] + "</dl>";
			}
			//--- end ------------------------------------------------------------------

		}

		layer_menu.find(".log_body").html(log_str);
		layer_menu.find(".log_body").css("font-family", that.kag.config.userFace);

		//--- ◆ デフォルトstyleを追加 -----------------------------------------
		if(that.kag.tmp.backlog.def_style == "true"){
			var line_height = parseInt(that.kag.stat.default_font.size) + (parseInt(that.kag.config.defaultLineSpacing)*1.5);
			line_height = parseInt(line_height) / parseInt(that.kag.stat.default_font.size);
			/*var weight = "normal";
			if(!that.kag.stat.default_font.bold) weight = $.convertBold(that.kag.stat.default_font.bold);
			*/
			$(".log_body").css({
				'font-size': that.kag.stat.default_font.size + 'px',
				'font-weight': that.kag.stat.default_font.bold,
				'line-height': line_height,
				'letter-spacing': that.kag.config.defaultPitch + 'px',
				'color': $.convertColor(that.kag.stat.default_font.color)
			});

			if (that.kag.stat.default_font.edge !="") {
				var edge_color = that.kag.stat.default_font.edge;
				$(".log_body").css("text-shadow","1px 1px 0 "+edge_color+", -1px 1px 0 "+edge_color+",1px -1px 0 "+edge_color+",-1px -1px 0 "+edge_color+"");
			} else if (that.kag.stat.default_font.shadow !="") {
				$(".log_body").css("text-shadow","2px 2px 2px "+that.kag.stat.default_font.shadow);
			}
		};
		//--- class=none があれば追加
		$(".log_body .log:has(dt.none)").addClass("none");
		$(".log_body .log:has(dt.glink)").addClass("glink");
		//--- ◆ end ----------------------------------------------------------------------

		//--- ◆ 縦書き用 ------------------------------------------------------------------
		if ( that.kag.tmp.backlog.vertical == "true" ){
			//align 削除を追加
			layer_menu.removeAttr("align")
			layer_menu.find(".log_body").removeAttr("align").addClass('vertical')

			//backlog.html のCSSリセット、writing-modeは強制で入れる。
			$(".log_body").css('overflow-y','').css('overflow-x','scroll').css('writing-mode','vertical-rl').css('-webkit-writing-mode','vertical-rl');

			//上下ホールで横スクロール
			var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
			$(document).on(mousewheelevent,function(e){
				var num = $(".log_body").scrollLeft();
				//e.preventDefault();
				var delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
				if (delta < 0){
					var num = num - 60;
					$(".log_body").scrollLeft(num);
				} else {
					var num = num + 60;
				 $(".log_body").scrollLeft(num)
				}
			});
		}
		//--- ◆ end ----------------------------------------------------------------------

		//--- ◆ 縦書き時のスクロール処理を追記 ----------------------------------------------
		$.preloadImgCallback(layer_menu,function(){
			layer_menu.fadeIn(300);
			if ( that.kag.tmp.backlog.vertical == "true" ){
				layer_menu.find(".log_body").scrollLeft(0);
			} else {
				layer_menu.find(".log_body").scrollTop(9999999999);
			};
		},that);
				//--- ◆ end ----------------------------------------------------------------------

				//$.preloadImgCallback(layer_menu,function(){
						//layer_menu.fadeIn(300);
						//一番下固定させる
						//layer_menu.find(".log_body").scrollTop(9999999999);
				//},that);

		$(".button_menu").hide();
	});
}
