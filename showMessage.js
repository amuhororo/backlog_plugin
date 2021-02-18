/* 【バックログプラグイン Ver.3.03】2021/02/18					*/
/*	by hororo http://hororo.wp.xdomain.jp/118/			*/

//■[showMessage]
tyrano.plugin.kag.tag.text.showMessage = function(message_str,pm,isVertical) {
	var that = this;

	if(that.kag.stat.log_join=="true"){
		pm.backlog="join";
	}

	var chara_name = "";
	if(this.kag.stat.chara_ptext!=""){
		chara_name = $.isNull($("." + this.kag.stat.chara_ptext).html());
	}

	/*
	if((chara_name != "" && pm.backlog!="join") || (chara_name!="" && this.kag.stat.f_chara_ptext=="true")){
		this.kag.pushBackLog("<b class='backlog_chara_name "+chara_name+"'>"+chara_name+"</b>：<span class='backlog_text "+chara_name+"'>"+message_str+"</span>","add");
		if(this.kag.stat.f_chara_ptext=="true"){
			this.kag.stat.f_chara_ptext="false";
			this.kag.stat.log_join = "true";
		}
	}else{
		var log_str = "<span class='backlog_text "+chara_name+"'>"+ message_str +"</span>";
		if(pm.backlog=="join"){
				this.kag.pushBackLog(log_str,"join");
		}else{
				this.kag.pushBackLog(log_str,"add");
		}
	}
	*/
//--- ◆ バックログ ------------------------------------------------------------------
	if(this.kag.stat.log_add == "true"){
		that.kag.stat.log_join=="false";
		pm.backlog="add";
	}
	////キャラ名////
	var c_name = chara_name;
	if(this.kag.stat.jcharas[chara_name]) c_name = this.kag.stat.jcharas[chara_name];
	else if(chara_name == "") c_name = "no_name";

	//キャラ名の色
	var name_color = ""
	if(this.kag.tmp.backlog.name_color == "true"){
		var name = this.kag.stat.jcharas[chara_name];
		var cpm = this.kag.stat.charas[name];
		if(cpm){
			if (cpm.color != "") {
				name_color = " style='color:" + $.convertColor(cpm.color)+";'";
			}
		}
	}

	//一番新しいログをチェック
	var array_log = that.kag.variable.tf.system.backlog.slice(-1)[0];
	var array_log_name = $(array_log).find('.chara_name').text();

	//名前分のDOM作成
	var classnone = "";
	if(array_log_name == chara_name && this.kag.tmp.backlog.name_repeat == "false") classnone = " none";
	if(this.kag.tmp.backlog.name_none == "false"){
		var log = "<dt class='log_name "+c_name+classnone+"'><span class='chara_name'"+name_color+">"+chara_name+"</span><span class='log_line'>"+this.kag.tmp.backlog.mark+"</span>";
	}else{
		var log = "<dt class='name_none'>";
	}

	//名前分のログ保存＋フラグ管理
	//if(pm.backlog!="join" || this.kag.stat.log_join == "false" || (array_log_name != chara_name && this.kag.tmp.backlog.name_none == "false")){
	if(pm.backlog!="join" || this.kag.stat.log_join == "false" || this.kag.stat.f_chara_ptext=="true"){
		this.kag.pushBackLog(log+"</dt><dd class='log_text "+c_name+"'>","add");
		if(this.kag.stat.f_chara_ptext=="true") this.kag.stat.f_chara_ptext="false";
		this.kag.stat.log_join = "true";
		this.kag.stat.log_add = "false";
	}

	////メッセージ////
	var log_span = "<span class='text'></span>";

	//TIPプラグイン併用
	var tip_flag = false; //tipの場合はendtipで<span>閉じる
	if(this.kag.variable.tf.system.tip_conf!=undefined){
		var tip_conf = this.kag.variable.tf.system.tip_conf;
		if(tip_conf.tiplog_name){
			log_span = "<span class='text" + tip_conf.tiplog_name + "'" + tip_conf.tiplog_key + tip_conf.tiplog_obj+"></span>";
			tip_conf.tiplog_name = "";
			tip_conf.tiplog_key = "";
			tip_conf.tiplog_obj = "";
			tip_flag = true;
		}
	}

	//fontstyle指定
	var log_style = $(log_span);
	if(this.kag.tmp.backlog.font_flag == "true" && this.kag.tmp.backlog.def_style == "true"){
		this.kag.tmp.backlog.font = {}; //リセット
		this.kag.tmp.backlog.font = $.extend(true, {}, this.kag.stat.font);
	};
	if(this.kag.tmp.backlog.font_flag == "true"){
		if(this.kag.tmp.backlog.font.color) log_style.css("color",$.convertColor(this.kag.tmp.backlog.font.color));
		if(this.kag.tmp.backlog.font.bold) log_style.css("font-weight",$.convertBold(this.kag.tmp.backlog.font.bold));
		if(this.kag.tmp.backlog.font.size) log_style.css("font-size",this.kag.tmp.backlog.font.size + "px");
		if(this.kag.tmp.backlog.font.face) log_style.css("font-family",this.kag.tmp.backlog.font.face);
		if(this.kag.tmp.backlog.font.italic) log_style.css("font-style",$.convertItalic(this.kag.tmp.backlog.font.italic));
		if (this.kag.tmp.backlog.font.edge !="") {
			var edge_color = this.kag.tmp.backlog.font.edge;
			log_style.css("text-shadow","1px 1px 0 "+edge_color+", -1px 1px 0 "+edge_color+",1px -1px 0 "+edge_color+",-1px -1px 0 "+edge_color+"");
		} else if (this.kag.tmp.backlog.font.shadow !="") {
			log_style.css("text-shadow","2px 2px 2px "+this.kag.tmp.backlog.font.shadow);
		}
	}

	//name追加
	if(this.kag.stat.font.name){
		if(this.kag.tmp.backlog.font_style == "true"){
			$.setName(log_style, this.kag.stat.font.name);
		}else{
			if(this.kag.stat.font.name.includes("tcy")) $.setName(log_style, "tcy"); //style反映なしでも縦中横だけは入れる
		}
	}

	//メッセージ部分のタグをログ保存 </span>は削除
	this.kag.pushBackLog(log_style.get(0).outerHTML.slice( 0, -7 ),"join");
//--- ◆ end ------------------------------------------------------------------------


	if(that.kag.stat.play_speak==true){
		speechSynthesis.speak(new SpeechSynthesisUtterance(message_str));
	}

	that.kag.ftag.hideNextImg();
	var j_msg_inner = this.kag.getMessageInnerLayer();
	if(this.kag.stat.vchat.is_active){
		j_msg_inner.show();
	}

	(function(jtext) {
		if (jtext.html() == "") {
			//タグ作成
			if (isVertical) {
				jtext.append("<p class='vertical_text'></p>");
			} else {
				jtext.append("<p class=''></p>");
			}
		}

		var current_str = "";

		/*
		if (jtext.find("p").find(".current_span").length != 0){
			jtext.find("p").find(".current_span").find("span").css({
				"opacity":1,
				"visibility":"visible",
				"animation":""
			});
			current_str = jtext.find("p").find(".current_span").html();
		}
		*/
		//--- ◆ nowait ---------------------------------------------------------------------
		if (jtext.find("p").find(".current_span").length != 0){
			jtext.find("p").find(".current_span").find("span").css({
				//"opacity":1,
				"visibility":"visible",
				"animation":""
			});
			if(that.kag.tmp.backlog.nowait!="true"){
				jtext.find("p").find(".current_span").find("span").css("opacity",1);  //瞬間表示以外の時だけ表示
			}
			current_str = jtext.find("p").find(".current_span").html();
		}
		//--- ◆ end ------------------------------------------------------------------------

		that.kag.checkMessage(jtext);

		//メッセージ領域を取得
		var j_span = {};
		if(that.kag.stat.vchat.is_active){
			j_span = jtext.find(".current_span");
			if(chara_name==""){
				$(".current_vchat").find(".vchat_chara_name").remove();
				$(".current_vchat").find(".vchat-text-inner").css("margin-top","0.2em");
			}else{
				$(".current_vchat").find(".vchat_chara_name").html(chara_name);

				//キャラ名欄の色
				var vchat_name_color = $.convertColor(that.kag.stat.vchat.chara_name_color);
				var cpm = that.kag.stat.vchat.charas[chara_name];

				if (cpm) {
					//色指定がある場合は、その色を指定する。
					if (cpm.color != "") {
						vchat_name_color = $.convertColor(cpm.color);
					}
				}

				$(".current_vchat").find(".vchat_chara_name").css("background-color",vchat_name_color);
				$(".current_vchat").find(".vchat-text-inner").css("margin-top","1.5em");
			}

		}else{
			j_span = that.kag.getMessageCurrentSpan();
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
		//アニメーション設定。無効な場合がある
		if(typeof that.kag.stat.font.effect =="undefined" || that.kag.stat.font.effect =="none" ){
			that.kag.stat.font.effect = "";
		}
		//禁則処理を有効にするための処置。エフェクトによっては有効にできないようにする
		var flag_in_block = true;
		if(that.kag.stat.font.effect=="" || that.kag.stat.font.effect=="fadeIn"){
			flag_in_block = false;
		}

		var append_str = "";
		var log_str = "";
		for (var i = 0; i < message_str.length; i++) {
			var ruby_flag = false;
			var c = message_str.charAt(i);

			//ルビ指定がされている場合
			if (that.kag.stat.ruby_str != "") {
				c = "<ruby><rb>" + c + "</rb><rt>" + that.kag.stat.ruby_str + "</rt></ruby>";
				that.kag.stat.ruby_str = "";
			}

			if(c==" "){
				append_str += "<span style='opacity:0'>" + c + "</span>";
			}else{
				if(flag_in_block){
					append_str += "<span style='display:inline-block;opacity:0'>" + c + "</span>";
				}else{
					append_str += "<span style='opacity:0;'>" + c + "</span>";
				}
			}

			//--- ◆ ログ用 -----------------------------------------------------------
			log_str += c ;
			//--- ◆ end ---------------------------------------------------------------
		}

		//--- ◆ mc_ruby  -----------------------------------------------------------
		if (that.kag.tmp.backlog.ruby_str != "") {
			append_str = "<ruby class='mcrb' data-ruby='"+that.kag.tmp.backlog.ruby_str+"'>" + append_str + "<rt>" + that.kag.tmp.backlog.ruby_str + "</rt></ruby>";
			log_str = "<ruby class='mcrb' data-ruby='"+that.kag.tmp.backlog.ruby_str+"'>" + log_str + "<rt>" + that.kag.tmp.backlog.ruby_str + "</rt></ruby>";
		};
		//--- ◆ end ---------------------------------------------------------------
		//--- ◆ ログ保存 -----------------------------------------------------------
		that.kag.pushBackLog(log_str,"join");
		//--- ◆ end ---------------------------------------------------------------

		/*
		current_str += "<span>" + append_str + "</span>";
		that.kag.appendMessage(jtext, current_str);
		var append_span = j_span.children('span:last-child');
		var makeVisible = function(index) {
			if(that.kag.stat.font.effect!=""){
				append_span.children("span:eq(" + index + ")").on("animationend",function(e){
					$(e.target).css({
						"opacity":1,
						"visibility":"visible",
						"animation":""
					}).addClass("stop");
				});
				append_span.children("span:eq(" + index + ")").css('animation', "t"+that.kag.stat.font.effect+' '+that.kag.stat.font.effect_speed+' ease 0s 1 normal forwards');
			}else{
				append_span.children("span:eq(" + index + ")").css({'visibility':'visible','opacity':'1'});
			}
		};
		var makeVisibleAll = function() {
			append_span.children("span").css({'visibility':'visible','opacity':'1'});
		};
		*/

		//--- ◆ 変更 -----------------------------------------------------------
		// spanにclassを追加して、children→findへ変更。childrenだとruby内のspanが動かない。
		current_str += "<span class='str'>" + append_str + "</span>";
		that.kag.appendMessage(jtext, current_str);
		var append_span = j_span.find(".str").last();
		var makeVisible = function(index) {
			if(that.kag.stat.font.effect!=""){
				append_span.find("span:eq(" + index + "),span:eq(" + index + ")+rt").on("animationend",function(e){
					$(e.target).css({
						"opacity":1,
						"visibility":"visible",
						"animation":""
					});
				});
				append_span.find("span:eq(" + index + ")").css('animation', "t"+that.kag.stat.font.effect+' '+that.kag.stat.font.effect_speed+' ease 0s 1 normal forwards');
				append_span.find("span:eq(" + index + ")+span.rt").css('animation', "t"+that.kag.stat.font.effect+' '+that.kag.stat.font.effect_speed+' ease 0s 1 normal forwards');
			}else{
				append_span.find("span:eq(" + index + ")").css({'visibility':'visible','opacity':'1'});
			}
		};
		var makeVisibleAll = function() {
			if(that.kag.stat.is_nowait == true && that.kag.tmp.backlog.nowait == "true"){
				append_span.css('opacity','0'); //瞬間表示の場合はまだ表示しない
			}else{
				append_span.find("span").css({'visibility':'visible','opacity':'1'});
			}
		};
		//--- ◆ end ---------------------------------------------------------------


		var pchar = function(index) {
			var isOneByOne = (
				that.kag.stat.is_skip != true
				&& that.kag.stat.is_nowait != true
				&& ch_speed >= 3
			);
			if (isOneByOne) {
				makeVisible(index);
			}
			if (index <= message_str.length) {
				that.kag.stat.is_adding_text = true;
				if (that.kag.stat.is_click_text == true || that.kag.stat.is_skip == true || that.kag.stat.is_nowait == true) {
					pchar(++index);
				} else {
					setTimeout(function() {
						pchar(++index);
					}, ch_speed);
				}
			} else {
				that.kag.stat.is_adding_text = false;
				that.kag.stat.is_click_text = false;
				if (that.kag.stat.is_stop != "true") {
					if(!isOneByOne){
						makeVisibleAll();
						setTimeout(function(){
							if (!that.kag.stat.is_hide_message) that.kag.ftag.nextOrder();
						}, parseInt(that.kag.config.skipSpeed));
					}else{
						if (!that.kag.stat.is_hide_message) that.kag.ftag.nextOrder();
					}
				}
			}
		};
		pchar(0);

		//--- ◆ ログ綴じタグ ----------------------------------------------------------------------------------
		if(tip_flag == false){
			that.kag.pushBackLog("</span>","join");
		}
		//--- ◆ end ------------------------------------------------------------------------------------------

	})(j_msg_inner);
};
