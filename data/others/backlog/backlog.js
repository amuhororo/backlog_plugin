// JavaScript Document

//BackLogを格納します
tyrano.plugin.kag.pushBackLog = function(str){
    	
	var that = this;
    
	this.variable.tf["system"]["backlog"].push(str);

};

tyrano.plugin.kag.pushBackLogNew = function(str){
    	
	var that = this;
	
	//バックログを文字列に
	var log_str = "";
	var array_log = this.variable.tf.system.backlog;
	log_str = array_log.join("");

	
	//バックログを削除
	this.variable.tf.system.backlog = [];
	
	//新バックログの変数が無ければ定義
	if(!this.variable.tf.backlog) this.variable.tf.backlog = [];
	console.log(log_str);


	//新バックログ変数にpush
	var log_conf = this.variable.sf.log_conf;
	
	if(log_str!="")this.variable.tf["backlog"].push("<p>"+log_str+"</p>");
	if(str)this.variable.tf["backlog"].push(str);
	
	
	var max_back_log = parseInt(this.kag.config["maxBackLogNum"]);
    	
	if(max_back_log < 1 ) return ;
		
	//上限を超えたらFILO で処理
	if(max_back_log < this.variable.tf["backlog"].length){
		this.variable.tf["backlog"].shift();
	}
    	
	var test = that.kag.variable.tf["backlog"];
	console.log(test);
};

//■p■
tyrano.plugin.kag.tag.p.start = function() {
	var that = this;
			
	this.kag.pushBackLogNew();
	
	this.kag.stat.flag_ref_page = true;
	if (this.kag.stat.is_skip == true) this.kag.ftag.nextOrder();
	else if (this.kag.stat.is_auto == true) {
		this.kag.stat.is_wait_auto = true;
		setTimeout(function() {
			if (that.kag.stat.is_wait_auto == true) that.kag.ftag.nextOrder()
		}, parseInt(that.kag.config.autoSpeed))
	}
};

//■r■
tyrano.plugin.kag.tag.r.start = function() {

	if(pm.backlog=="true")this.kag.pushBackLogNew();
	else this.kag.pushBackLog("<br>");

	//クリックするまで、次へすすまないようにする
	var j_inner_message = this.kag.getMessageInnerLayer();

	var txt = j_inner_message.find("p").find(".current_span").html() + "<br />";
	j_inner_message.find("p").find(".current_span").html(txt);

	this.kag.ftag.nextOrder();
};

//■er■
tyrano.plugin.kag.tag.er.start = function() {

	this.kag.pushBackLogNew();

	this.kag.ftag.hideNextImg();
	//フォントのリセット
	//カレントレイヤのみ削除
	this.kag.getMessageInnerLayer().html("");
	this.kag.ftag.startTag("resetfont");
	//this.kag.ftag.nextOrder();
};

//■ct■
tyrano.plugin.kag.tag.ct.start = function() {

	this.kag.pushBackLogNew();

	this.kag.ftag.hideNextImg();

	//フォントのリセット
	//カレントレイヤだけじゃなくて、全てもメッセージレイヤを消去する必要がある
	this.kag.layer.clearMessageInnerLayerAll();

	//フリーレイヤ消去
	this.kag.layer.getFreeLayer().html("").hide();

	this.kag.stat.current_layer = "message0";
	this.kag.stat.current_page = "fore";

	this.kag.ftag.startTag("resetfont");
};

//■cm■
tyrano.plugin.kag.tag.cm.start = function() {
	
	this.kag.pushBackLogNew();

	this.kag.ftag.hideNextImg();
	//フォントのリセット
	//カレントレイヤだけじゃなくて、全てもメッセージレイヤを消去する必要がある
	this.kag.layer.clearMessageInnerLayerAll();
	//フリーレイヤ消去
	this.kag.layer.getFreeLayer().html("").hide();

	this.kag.ftag.startTag("resetfont");
};

//■s■
tyrano.plugin.kag.tag.s.start = function() {
	
	this.kag.pushBackLogNew();

	this.kag.stat.is_strong_stop = true;
	this.kag.layer.hideEventLayer();
};


//■font■
tyrano.plugin.kag.tag.font.start = function(pm) {
	
	this.kag.setMessageCurrentSpan();
	
	var new_font = {};
	
	if (pm.size) {
		this.kag.stat.font.size = pm.size;
		var style_size = 'font-size:' + pm.size + 'px;';
	}else{
		var style_size = '';
	}
	
	if (pm.color) {
		this.kag.stat.font.color = $.convertColor(pm.color);
		var style_color = 'color:' + $.convertColor(pm.color) + ';';
	}else{
		var style_color = '';
	}

	if (pm.bold) {
		this.kag.stat.font.bold = $.convertBold(pm.bold);
		var style_bold = 'font-weight:' + $.convertBold(pm.bold) + ';';
	}else{
		var style_bold = '';
	}

	if (pm.face) {
		this.kag.stat.font.face = pm.face;
		var style_face = 'font-family:' + pm.face + ';';
	}else{
		var style_face = '';
	}
        
	if (pm.italic){
		this.kag.stat.font["italic"] = $.convertItalic(pm.italic);
		var style_italic = 'font-style:' + $.convertItalic(pm.italic) + ';';
	}else{
		var style_italic = '';
	}
	
	//◆設定呼び出し
	var log_conf = this.kag.variable.sf.log_conf;
	if(log_conf.font_style == true){
		var backlog = '<span style="' + style_color + style_size + style_bold + style_italic + style_face + '">';
		this.kag.pushBackLog(backlog);
	}

	this.kag.ftag.nextOrder();
};


//■resetfont■
tyrano.plugin.kag.tag.resetfont.start = function() {
	
	//◆設定呼び出し
	var log_conf = this.kag.variable.sf.log_conf;
	var array_backlog = tyrano.plugin.kag.variable.tf.system.backlog;
	var last_log = array_backlog[array_backlog.length -1];

	if (array_backlog.length > 0){
		if(log_conf.font_style == true)this.kag.pushBackLog("</span>");
	}
	
	var j_span = this.kag.setMessageCurrentSpan();
	
	this.kag.stat.font = $.extend(true, {}, this.kag.stat.default_font);
	this.kag.ftag.nextOrder();
};


//■ptext■
tyrano.plugin.kag.tag.ptext.start = function(pm) {

	var that = this;

	//◆バックログに入れる場合の処理
	if(pm.backlog == "true"){
		//◆設定呼び出し
		var log_conf = this.kag.variable.sf.log_conf;
		//pm.color = $.convertColor(pm.color);
		var style_color = (pm.color != "") ? 'color:' + $.convertColor(pm.color) + ';' : '';
		var style_size = (pm.size != "") ? 'font-size:' + pm.size + 'px;' : '';
		var style_bold = (pm.bold != "") ? 'font-weight:' + pm.bold + ';' : '';
		var style_face = (pm.face != "") ? 'font-family:' + pm.face + ';' : '';
		var backlog = '<p class="mtext">' + pm.text + '</p>';
		if(log_conf.font_style == true) var backlog = '<p class="ptext" style="' + style_color + style_size + style_bold + style_face + '">' + pm.text + '</p>';
		this.kag.pushBackLogNew(backlog);
	};
	//◆end

	//visible true が指定されている場合は表示状態に持っていけ
	//これはレイヤのスタイル
        
	//指定がない場合はデフォルトフォントを適応する
        
	if(pm.face ==""){
		pm.face=that.kag.stat.font.face;
	}
        
	if(pm.color == ""){
		pm.color=$.convertColor(that.kag.stat.font.color);
	}else{
		pm.color = $.convertColor(pm.color);
	}

	var font_new_style = {

		"color" : pm.color,
		"font-weight" : pm.bold,
		"font-style" : pm.fontstyle,
		"font-size" : pm.size + "px",
		"font-family" : pm.face,
		"z-index" : "999",
		"text" : ""

	};

	var target_layer = this.kag.layer.getLayer(pm.layer, pm.page);

	//上書き指定
	if (pm.overwrite == "true" && pm.name != "") {
		if ($("." + pm.name).size() > 0) {
			$("." + pm.name).html(pm.text);
			this.kag.ftag.nextOrder();
			return false;
		}
	}

	var tobj = $("<p></p>");

	tobj.css("position", "absolute");
	tobj.css("top", pm.y + "px");
	tobj.css("left", pm.x + "px");
	//tobj.css("width", "100%");
	tobj.css("width", "auto");
        
	if (pm.vertical == "true") {
		tobj.addClass("vertical_text");
	}

	//オブジェクトにクラス名をセットします
	$.setName(tobj, pm.name);

	tobj.html(pm.text);

	this.kag.setStyles(tobj, font_new_style);
        
	if(pm.layer=="fix"){
            tobj.addClass("fixlayer");
	}
        
	//時間指定
	if(pm.time != ""){
		tobj.css("opacity",0);
		target_layer.append(tobj);
		tobj.animate(
			{"opacity":1},
			parseInt(pm.time), 
			function(){
				that.kag.ftag.nextOrder();
			}
		);
	}else{
		this.kag.ftag.nextOrder();
		target_layer.append(tobj);
	}
        
	//◆センタリング
	if (pm.x == "center") {
		var x = (parseInt(that.kag.config.scWidth,10) - parseInt(tobj.outerWidth(),10))*0.5;
		tobj.css("left", x + "px");
	}
	if (pm.y == "center") {
		var y = (parseInt(that.kag.config.scHeight,10) - parseInt(tobj.outerHeight(),10))*0.5;
		tobj.css("top", y + "px");
	}
};


//■mtext■
tyrano.plugin.kag.tag.mtext.start = function(pm) {
	var that = this;

	//◆バックログに入れる場合の処理
	if(pm.backlog == "true"){
		//◆設定呼び出し
		var log_conf = this.kag.variable.sf.log_conf;
		//pm.color = $.convertColor(pm.color);
		var style_color = (pm.color != "") ? 'color:' + $.convertColor(pm.color) + ';' : '';
		var style_size = (pm.size != "") ? 'font-size:' + pm.size + 'px;' : '';
		var style_bold = (pm.bold != "") ? 'font-weight:' + pm.bold + ';' : '';
		var style_face = (pm.face != "") ? 'font-family:' + pm.face + ';' : '';
		var backlog = '<p class="mtext">' + pm.text + '</p>';
		if(log_conf.font_style == true) var backlog = '<p class="mtext" style="' + style_color + style_size + style_bold + style_face + '">' + pm.text + '</p>';
		this.kag.pushBackLogNew(backlog);
	};
	//◆end

	//指定がない場合はデフォルトフォントを適応する
	if(pm.face ==""){
		pm.face=that.kag.stat.font.face;
	}
        
	if(pm.color == ""){
		pm.color=$.convertColor(that.kag.stat.font.color);
	}else{
		pm.color = $.convertColor(pm.color);
	}
        
	var font_new_style = {

		"color" : pm.color,
		"font-weight" : pm.bold,
		"font-style" : pm.fontstyle,
		"font-size" : pm.size + "px",
		"font-family" : pm.face,
		"z-index" : "999",
		"text" : ""

	};
		
		
	var target_layer = this.kag.layer.getLayer(pm.layer, pm.page);

	var tobj = $("<p></p>");

	tobj.css("position", "absolute");
	tobj.css("top", pm.y + "px");
	tobj.css("left", pm.x + "px");
	//tobj.css("width", "100%");
	tobj.css("width", "auto");

	if (pm.vertical == "true") {
		tobj.addClass("vertical_text");
	}

	//オブジェクトにクラス名をセットします
	$.setName(tobj, pm.name);

	tobj.html(pm.text);

	this.kag.setStyles(tobj, font_new_style);
        
	if(pm.layer=="fix"){
		tobj.addClass("fixlayer");
	}
        
	//前景レイヤ
	target_layer.append(tobj);
        
	//bool変換
	for(key in pm){
		if(pm[key]=="true"){
			pm[key] = true;
		}else if(pm[key] =="false"){
			pm[key] = false;
		}
	}
        
	//tobj をアニメーションさせる
	tobj.textillate({ 
            
		"loop":pm["fadeout"],
		"minDisplayTime":pm["time"],
                
 		"in": { 
			"effect":pm["in_effect"], 
			"delayScale":pm["in_delay_scale"],
			"delay":pm["in_delay"],
			"sync":pm["in_sync"],
			"shuffle":pm["in_shuffle"],
			"reverse":pm["in_reverse"],
			"callback":function(){
				if (pm.fadeout==false && pm.wait == true) {
					that.kag.ftag.nextOrder();
				}
			}
		},
                
		"out": {
			"effect": pm["out_effect"], 
			"delayScale": pm["out_delay_scale"],
			"delay": pm["out_delay"],
			"sync": pm["out_sync"],
			"shuffle": pm["out_shuffle"],
			"reverse": pm["out_reverse"],
			"callback":function(){
				tobj.remove();
				if (pm.wait == true) {
					that.kag.ftag.nextOrder();
				}
			}
		}
                
	});
            
	if(pm.wait != true){
		this.kag.ftag.nextOrder();
	}

	//◆センタリング
	if (pm.x == "center") {
		var x = (parseInt(that.kag.config.scWidth,10) - parseInt(tobj.outerWidth(),10))*0.5;
		tobj.css("left", x + "px");
	}
	if (pm.y == "center") {
		var y = (parseInt(that.kag.config.scHeight,10) - parseInt(tobj.outerHeight(),10))*0.5;
		tobj.css("top", y + "px");
	}
};


//■glink■
tyrano.plugin.kag.tag.glink.setEvent = function(j_button,pm){
         
	var that = TYRANO;
         
	(function() {

		var _target = pm.target;
		var _storage = pm.storage;
		var _pm = pm;
		var preexp = that.kag.embScript(pm.preexp);
		var button_clicked = false;

		j_button.click(function(e) {
                
			//クリックされた時に音が指定されていたら
			if (_pm.clickse != "") {
				that.kag.ftag.startTag("playse", {
					"storage" : _pm.clickse
				});
			}

			//◆バックログに入れる場合の処理
			if(_pm.backlog == "true"){
				that.kag.pushBackLogNew("<p class='glink'>" + _pm.text + "</p>");
			}

			//Sタグに到達していないとクリッカブルが有効にならない fixの時は実行される必要がある
			if (that.kag.stat.is_strong_stop != true) {
				return false;
			}

			button_clicked = true;

			if (_pm.exp != "") {
				//スクリプト実行
				that.kag.embScript(_pm.exp, preexp);
			}

			that.kag.layer.showEventLayer();
			
			that.kag.ftag.startTag("cm", {});
			//コールを実行する
			that.kag.ftag.startTag("jump", _pm);
							
			//選択肢の後、スキップを継続するか否か
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

			//マウスが乗った時
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
			//マウスが乗った時
			if (_pm.leavese != "") {
				that.kag.ftag.startTag("playse", {
					"storage" : _pm.leavese,
					"stop" : true
				});
			}
		}); 

	})();
};


//■chara_ptext■
tyrano.plugin.kag.tag.chara_ptext.start = function(pm) {
	
	this.kag.pushBackLogNew();
	
	var name_color = '';
	
	//◆設定呼び出し
	var log_conf = this.kag.variable.sf.log_conf;
	
	if (pm.name == "") {
		$("." + this.kag.stat.chara_ptext).html("").hide();
		
		//◆名前無い時も空タグ入れる
		this.kag.pushBackLog( '<span class="chara_name"></span>' );
		
		//全員の明度を下げる。誰も話していないから
		//明度設定が有効な場合
		if (this.kag.stat.chara_talk_focus != "none") {
			$("#tyrano_base").find(".tyrano_chara").css({
				"-webkit-filter" : this.kag.stat.apply_filter_str,
				"-ms-filter" : this.kag.stat.apply_filter_str,
				"-moz-filter" : this.kag.stat.apply_filter_str
			});
		}
	} else {
		//日本語から逆変換することも可能とする
		if(this.kag.stat.jcharas[pm.name]){
			pm.name = this.kag.stat.jcharas[pm.name];
		}
		var cpm = this.kag.stat.charas[pm.name];
		if (cpm) {
			//キャラクター名出力
			$("." + this.kag.stat.chara_ptext).html(cpm.jname).show();
						
			//色指定がある場合は、その色を指定する。
			if (cpm.color != "") {
				$("." + this.kag.stat.chara_ptext).css("color", $.convertColor(cpm.color));
			}
			
			//明度設定が有効な場合
			if (this.kag.stat.chara_talk_focus != "none") {
				$("#tyrano_base").find(".tyrano_chara").css({
					"-webkit-filter" : this.kag.stat.apply_filter_str,
					"-ms-filter" : this.kag.stat.apply_filter_str,
					"-moz-filter" : this.kag.stat.apply_filter_str
				});
				$("#tyrano_base").find("." + pm.name + ".tyrano_chara").css({
					"-webkit-filter" : "brightness(100%) blur(0px)",
					"-ms-filter" : "brightness(100%) blur(0px)",
					"-moz-filter" : "brightness(100%) blur(0px)"
				});
			}
			
			//◆キャラ名をログに保存
			if(log_conf.font_style == true && cpm.color != "") var name_color = ' style="color:' + $.convertColor(cpm.color) +'"';
			//else var name_color = '';
			this.kag.pushBackLog( '<span class="chara_name"' + name_color + '>' + cpm.jname + '</span>' );

		} else {
			//存在しない場合はそのまま表示できる
			$("." + this.kag.stat.chara_ptext).html(pm.name).show();
			
			//◆キャラ名をログに保存
			this.kag.pushBackLog( '<span class="chara_name">' + pm.name + '</span>' );
		}
	
	}
	
	//表情の変更もあわせてできる
	if (pm.face != "") {
		if (!(this.kag.stat.charas[pm.name]["map_face"][pm.face])) {
			this.kag.error("指定されたキャラクター「" + pm.name + "」もしくはface:「" + pm.face + "」は定義されていません。もう一度確認をお願いします");
			return;
		}
		var storage_url = this.kag.stat.charas[pm.name]["map_face"][pm.face];
		$("." + pm.name).attr("src", "./data/fgimage/" + storage_url);
	};
		
	this.kag.ftag.nextOrder();
};


//■displayLog■
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
			layer_menu.hide();
			if (that.kag.stat.visible_menu_button == true) {
				$(".button_menu").show();
			}
		});
		
		//◆ログを取得（段落化済みの分）
		var newlog_str = "";
		
		var array_newlog = that.kag.variable.tf.backlog;

		for (var i = 0; i < array_newlog.length; i++) {
			newlog_str += array_newlog[i];
		}

		//◆ログを取得（段落化前の分）
		var log_str = newlog_str;
		
		var array_log = that.kag.variable.tf.system.backlog;

		for (var i = 0; i < array_log.length; i++) {
			log_str += array_log[i];
		}

		layer_menu.find(".log_body").html(log_str);
		layer_menu.show();
		
		//空タグを削除
		//$(".log_body").find("p[class!='chara_name']:empty").remove();
		
		//◆設定呼び出し
		var log_conf = that.kag.variable.sf.log_conf;
		
		//◆Config.tjsのデフォルト設定を追加
		if(log_conf.def_style == true){
			var line_height = parseInt(that.kag.config.defaultFontSize) + parseInt(that.kag.config.defaultLineSpacing);
			line_height = parseInt(line_height) / parseInt(that.kag.config.defaultFontSize);
			var weight = (that.kag.config.defaultBold=="true") ? $.convertBold(that.kag.config.defaultBold) : "normal" ;
			$(".log_body").css({
				'font-size': that.kag.config.defaultFontSize + 'px',
				'font-weight': weight,
				'line-height': line_height,
				'letter-spacing': that.kag.config.defaultPitch + 'px',
				'font-family': that.kag.config.userFace,
				'color': $.convertColor(that.kag.config.defaultChColor)
			});
		};

		//◆縦書きの時
		if ( that.kag.config.vertical == "true" ){
		
			layer_menu.find(".log_body").addClass('vertical')
			$(".log_body").css('overflow-y','').css('overflow-x','scroll').css('writing-mode','vertical-rl').css('-webkit-writing-mode','vertical-rl').css('position','absolute').css('top','10%').css('left','3%');
			
			/* margin指定はやめ
			if(e.log_p_margin != 0)$(".log_body").find("p[class!='chara_name']").css('margin-left',e.log_p_margin + 'em');
			if(e.log_chara_name_margin != 0)$(".log_body").find(".chara_name").css('margin-right',e.log_chara_name_margin + 'em');
			if(e.log_mtext_margin != 0)$(".log_body").find(".mtext").css('margin','0 ' + e.log_mtext_margin + 'em');
			*/
			
			//上下ホールで横スクロール
			var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
			$(document).on(mousewheelevent,function(e){
        		var num = $(".log_body").scrollLeft();
        		e.preventDefault();
        		var delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
        		if (delta < 0){
            		var num = num - 100;
            		$(".log_body").scrollLeft(num);
        		} else {
            		var num = num + 100;
           			 $(".log_body").scrollLeft(num)
        		}
			});
			
			//一番左固定させる
			layer_menu.find(".log_body").scrollLeft(0);
			
		} else {
			
			/*
			if(e.log_p_margin != 0)$(".log_body").find("p[class!='chara_name']").css('margin-bottom',e.log_p_margin + 'em');
			if(e.log_chara_name_margin != 0)$(".log_body").find(".chara_name").css('margin-top',e.log_chara_name_margin + 'em');
			if(e.log_mtext_margin != 0)$(".log_body").find(".mtext").css('margin',e.log_mtext_margin + 'em 0');
			*/
			
			//一番下固定させる
			layer_menu.find(".log_body").scrollTop(9999999999);
		};
		
		
		$(".button_menu").hide();
	});
};
