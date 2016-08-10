//■text■
tyrano.plugin.kag.tag.text.showMessage = function(message_str) {
	var that = this;
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
			
			that.kag.pushBackLog(c);//◆追加
			
			current_str += c;
			if(that.kag.stat.is_skip != true && that.kag.stat.is_nowait!=true){
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
					if(that.kag.stat.is_skip == true || that.kag.stat.is_nowait==true){
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
					jtext.find("p").append("<img class='img_next' src='./tyrano/images/kag/nextpage.gif' />");
				} else {
					$(".glyph_image").show();
				}
			}
		};
		pchar(pchar);
	})(this.kag.getMessageInnerLayer());
};
tyrano.plugin.kag.tag.text.showMessageVertical = function(message_str) {
	var that = this;
	that.kag.ftag.hideNextImg();
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
		j_span
			.css("color", that.kag.stat.font.color)
			.css("font-weight", that.kag.stat.font.bold)
			.css("font-size", that.kag.stat.font.size + "px")
			.css("font-family", that.kag.stat.font.face);
            
		//既読管理中の場合、現在の場所が既読済みなら、色を変える 
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
			current_str += c;
                
			that.kag.pushBackLog(c);//◆追加

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
					jtext.find("p").append("<img class='img_next' src='./tyrano/images/kag/nextpage.gif' />");

				} else {
					$(".glyph_image").show();
				}
			}
		};
		pchar(pchar);
	})(this.kag.getMessageInnerLayer())
};