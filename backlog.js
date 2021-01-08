/* 【バックログプラグイン Ver.3.01】2020/9/21          */
/*  by hororo http://hororo.wp.xdomain.jp/118/      */

//■[text]
/* これはいらんかな…
tyrano.plugin.kag.tag.text.pm = {
  "val" : "",
  //"backlog":"add" //バックログ用の文字列。改行するかどうか。add join
  "backlog":"join"
*/

//■[font]
tyrano.plugin.kag.tag.font.start = function(pm) {

  this.kag.setMessageCurrentSpan();
  var new_font = {};
  if (pm.size) {
    this.kag.stat.font.size = pm.size;
    //--- ◆ バックログ用 ---------------------------------
    this.kag.tmp.backlog.font.size = pm.size;
    //--- ◆ end -----------------------------------------
  }
  if (pm.color) {
    this.kag.stat.font.color = $.convertColor(pm.color);
    //--- ◆ バックログ用 ---------------------------------
    this.kag.tmp.backlog.font.color = $.convertColor(pm.color);
    //--- ◆ end -----------------------------------------
  }
  if (pm.bold) {
    this.kag.stat.font.bold = $.convertBold(pm.bold);
    //--- ◆ バックログ用 ---
    this.kag.tmp.backlog.font.bold = $.convertBold(pm.bold);
    //--- ◆ end -----------------------------------------
  }
  if (pm.face) {
    this.kag.stat.font.face = pm.face;
    //--- ◆ バックログ用 ---
    this.kag.tmp.backlog.font.face = pm.face;
    //--- ◆ end -----------------------------------------
  }
  if (pm.italic){
    this.kag.stat.font["italic"] = $.convertItalic(pm.italic);
    //--- ◆ バックログ用 ---
    this.kag.tmp.backlog.font["italic"] = $.convertItalic(pm.italic);
    //--- ◆ end -----------------------------------------
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
      //--- ◆ バックログ用 ---------------------------------
      this.kag.tmp.backlog.font.edge = "";
      //--- ◆ end -----------------------------------------
    }else{
      this.kag.stat.font.edge = $.convertColor(pm.edge);
      //--- ◆ バックログ用 ---------------------------------
      this.kag.tmp.backlog.font.edge = $.convertColor(pm.edge);
      //--- ◆ end -----------------------------------------
    }
  }
  if (pm.shadow) {
    if(pm.shadow=="none" || pm.shadow==""){
      this.kag.stat.font.shadow = "";
      //--- ◆ バックログ用 ---------------------------------
      his.kag.tmp.backlog.font.shadow = "";
      //--- ◆ end -----------------------------------------
    }else{
      this.kag.stat.font.shadow = $.convertColor(pm.shadow);
      //--- ◆ バックログ用 ---------------------------------
      this.kag.tmp.backlog.font.shadow = $.convertColor(pm.shadow);
      //--- ◆ end -----------------------------------------
    }
  }

  //--- ◆ name追加 -------------------------------------------------------------------------
  if (pm.name) {
    $.setName(this.kag.setMessageCurrentSpan(), pm.name);
    this.kag.stat.font.name = pm.name;
  }
  //--- ◆ end -----------------------------------------------------------------------------
  //--- ◆ バックログ用フラグ ----------------------------------------------------------------
  if(this.kag.tmp.backlog.font_style == "true") this.kag.tmp.backlog.font_flag = "true" ;
  //--- ◆ end -----------------------------------------------------------------------------
  this.kag.ftag.nextOrder();
};

//■[resetfont]
tyrano.plugin.kag.tag.resetfont.start = function() {

  //--- ◆ バックログ処理 -------------------------------------------------------------------
  this.kag.tmp.backlog.font_flag = "false";//フォントフラグ解除
  this.kag.tmp.tcy = "false";//縦中横フラグ解除
  this.kag.tmp.backlog.font = {};//バックログ用styleリセット
  //--- ◆ end -----------------------------------------------------------------------------

  var j_span = this.kag.setMessageCurrentSpan();
  this.kag.stat.font = $.extend(true, {}, this.kag.stat.default_font);
  this.kag.ftag.nextOrder();
};

//■[p]
tyrano.plugin.kag.tag.p.start = function() {

  //--- ◆ バックログ処理 ----------------------------------------------------------
  this.kag.stat.log_add="true"
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
  this.kag.stat.log_add="true"
  //--- ◆ end --------------------------------------------------------------------

  this.kag.ftag.hideNextImg();
  this.kag.getMessageInnerLayer().html("");
  this.kag.ftag.startTag("resetfont");
};

//■[cm]
tyrano.plugin.kag.tag.cm.start = function() {

  //--- ◆ バックログ処理 ----------------------------------------------------------
  this.kag.stat.log_add="true"
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
  this.kag.stat.log_add="true"
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
        that.kag.tmp.backlog.glink_flag = true;
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

  //--- ◆ バックログ ------------------------------------------------------------------
  //--- ◆ キャラ名
  var c_name = chara_name;
  if(this.kag.stat.jcharas[chara_name]) c_name = this.kag.stat.jcharas[chara_name];
  else if(chara_name == "") c_name = "no_name";

  //キャラ名保存し直し。
  if(this.kag.tmp.backlog.chara_name != chara_name){
    this.kag.tmp.backlog.name_count = 0;
    this.kag.tmp.backlog.chara_name = chara_name;
  }

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

  //キャラ名の登場回数数える
  var classnone = "";
  if(this.kag.tmp.backlog.glink_flag == true){
    this.kag.tmp.backlog.name_count = 1;//glinkの後は名前のカウントリセット
    this.kag.tmp.backlog.glink_flag = false;//glinkフラグ戻す
  }else{
    this.kag.tmp.backlog.name_count ++;
  }
  //カウント2以上の時はclass=noneを入れてdisplay:noneしとく。
  if(this.kag.tmp.backlog.name_repeat == "false" && this.kag.tmp.backlog.name_count > 1){
    var classnone = " none";
  }

  //キャラ名ログ保存
  if(pm.backlog!="join" || this.kag.tmp.backlog.name_count < 2 || this.kag.stat.log_add == "true"){
    if(this.kag.tmp.backlog.name_none == "false"){
      this.kag.pushBackLog("<dt class='log_name "+c_name + classnone + "'><span class='chara_name'"+name_color+">"+chara_name+"</span><span class='log_line'>"+this.kag.tmp.backlog.mark+"</span></dt><dd class='log_text "+c_name+"'>","add");
    }else{
      this.kag.pushBackLog("<dt class='name_none'></dt><dd class='log_text "+c_name+"'>","add");
    }
    this.kag.stat.log_add = "false";
  }

  //--- ◆ メッセージ
  var log_span = "<span class='text'></span>";
  //TIPプラグイン併用
  if(this.kag.variable.tf.system.tip_conf!=undefined){
    var tip_conf = this.kag.variable.tf.system.tip_conf;
    log_span = "<span class='text" + tip_conf.tiplog_name + "'" + tip_conf.tiplog_key + tip_conf.tiplog_obj+"></span>";
  }

  var log_style = $(log_span);

  //fontstyle指定
  if(this.kag.tmp.backlog.font_flag == "true"){
    log_style.css({
      "color":this.kag.tmp.backlog.font.color,
      "font-weight": this.kag.tmp.backlog.font.bold,
      "font-size": this.kag.tmp.backlog.font.size + "px",
      "font-family": this.kag.tmp.backlog.font.face,
      "font-style":this.kag.tmp.backlog.font.italic
    });
    if (this.kag.stat.font.edge !="") {
      var edge_color = this.kag.tmp.backlog.font.edge;
      log_style.css("text-shadow","1px 1px 0 "+edge_color+", -1px 1px 0 "+edge_color+",1px -1px 0 "+edge_color+",-1px -1px 0 "+edge_color+"");
    } else if (this.kag.stat.font.shadow !="") {
      log_style.css("text-shadow","2px 2px 2px "+this.kag.tmp.backlog.font.shadow);
    }
  //} else if (this.kag.tmp.backlog.tiplog_color != ""){
  //  log_style.css("color",this.kag.stat.font.color);
  };

  //name追加
  if(this.kag.tmp.backlog.font_style == "true"){
    if(this.kag.stat.font.name) $.setName(log_style, this.kag.stat.font.name);
  } else {
    if(this.kag.stat.font.name){
      if(this.kag.stat.font.name.includes("tcy")) $.setName(log_style, "tcy"); //style反映なしでも縦中横だけは入れる
    }
  };

  //ログ保存
  this.kag.pushBackLog(log_style.get(0).outerHTML.slice( 0, -7 ),"join");
  //--- ◆ end ------------------------------------------------------------------------------------------

  if((chara_name != "" && pm.backlog!="join") || (chara_name!="" && this.kag.stat.f_chara_ptext=="true")){
    //this.kag.pushBackLog("<b class='backlog_chara_name "+chara_name+"'>"+chara_name+"</b>：<span class='backlog_text "+chara_name+"'>"+message_str+"</span>","add");
    if(this.kag.stat.f_chara_ptext=="true"){
      this.kag.stat.f_chara_ptext="false";
      this.kag.stat.log_join = "true";
    }
  }else{
    //--- ◆ nameカウント ---------------------------------------------------------------------------------
    this.kag.tmp.backlog.name_count ++;
    //--- ◆ end ------------------------------------------------------------------------------------------
    //var log_str = "<span class='backlog_text "+chara_name+"'>"+ message_str +"</span>";
    //if(pm.backlog=="join"){
    //    this.kag.pushBackLog(log_str,"join");
    //}else{
    //    this.kag.pushBackLog(log_str,"add");
    //}
  }

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
    if (jtext.find("p").find(".current_span").length != 0) {
      jtext.find("p").find(".current_span").find("span").css({
        "opacity":1,
        "visibility":"visible",
        "animation":""
      });
      current_str = jtext.find("p").find(".current_span").html();
    }
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
    var append_str = "";
    for (var i = 0; i < message_str.length; i++) {
      var c = message_str.charAt(i);
      if (that.kag.stat.ruby_str != "") {
        c = "<ruby><rb>" + c + "</rb><rt>" + that.kag.stat.ruby_str + "</rt></ruby>";
        that.kag.stat.ruby_str = "";
      }

      //--- ◆ ログ保存 -----------------------------------------------------------
      that.kag.pushBackLog(c,"join");
      //--- ◆ end ---------------------------------------------------------------

      if(c==" "){
        append_str += "<span style='opacity:0'>" + c + "</span>";
      }else{
        append_str += "<span style='display:inline-block;opacity:0'>" + c + "</span>";
      }
    }
    current_str += "<span>" + append_str + "</span>";
    if(typeof that.kag.stat.font.effect =="undefined" || that.kag.stat.font.effect =="none" ){
      that.kag.stat.font.effect = "";
    }
    that.kag.appendMessage(jtext, current_str);
    var append_span = j_span.children('span:last-child');
    var makeVisible = function(index) {
      if(that.kag.stat.font.effect!=""){
        append_span.children("span:eq(" + index + ")").on("animationend",function(e){
          $(e.target).css({
            "opacity":1,
            "visibility":"visible",
            "animation":""
          });
        });
        append_span.children("span:eq(" + index + ")").css('animation', "t"+that.kag.stat.font.effect+' '+that.kag.stat.font.effect_speed+' ease 0s 1 normal forwards');
      }else{
        append_span.children("span:eq(" + index + ")").css({'visibility':'visible','opacity':'1'});
      }
    };
    var makeVisibleAll = function() {
      append_span.children("span").css({'visibility':'visible','opacity':'1'});
    };
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
    that.kag.pushBackLog("</span>","join");
    //--- ◆ end ------------------------------------------------------------------------------------------

  })(j_msg_inner);
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

        //if($.userenv()!="pc"){
        //    layer_menu.find(".button_smart").show();
        //    layer_menu.find(".button_arrow_up").click(function(){
        //        var now = layer_menu.find(".log_body").scrollTop();
        //        var pos = now - 60;
        //        layer_menu.find(".log_body").animate({scrollTop:pos},{queue:false});
        //    });
        //
        //    layer_menu.find(".button_arrow_down").click(function(){
        //        var now = layer_menu.find(".log_body").scrollTop();
        //        var pos = now + 60;
        //        layer_menu.find(".log_body").animate({scrollTop:pos},{queue:false});
        //    });
        //}

    var log_str = "";
    var array_log = that.kag.variable.tf.system.backlog;

    for (var i = 0; i < array_log.length; i++) {
      //--- ◆ ログ書き出し -------------------------------------------------------
      if(array_log[i].includes("script") && !array_log[i].includes("span")){
        log_str += array_log[i];
      } else {
        log_str += "<dl class='log'>" + array_log[i] + "</dl>";
      }
      //--- end ------------------------------------------------------------------
      //log_str += array_log[i] + "<br />";
    }

    layer_menu.find(".log_body").html(log_str);
    layer_menu.find(".log_body").css("font-family", that.kag.config.userFace);

    //--- ◆ デフォルトstyleを追加 -----------------------------------------
    if(that.kag.tmp.backlog.def_style == "true"){
      var line_height = parseInt(that.kag.stat.default_font.size) + parseInt(that.kag.config.defaultLineSpacing);
      line_height = parseInt(line_height) / parseInt(that.kag.stat.default_font.size);
      var weight = (that.kag.stat.default_font.bold=="true") ? $.convertBold(that.kag.stat.default_font.bold) : "normal" ;
      $(".log_body").css({
        'font-size': that.kag.stat.default_font.size + 'px',
        'font-weight': weight,
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
    //--- ◆ class=none があれば追加
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
