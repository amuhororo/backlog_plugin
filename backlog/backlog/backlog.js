//【バックログプラグイン】
// Ver.3.53β2 2022/8/4
// by hororo https://memocho.no-tenki.me/

(function () {
  //パラメータ保存
  TYRANO.kag.tmp.memocho = TYRANO.kag.tmp.memocho || {};
  TYRANO.kag.tmp.memocho.log = TYRANO.kag.tmp.memocho.log || {};

  TYRANO.kag.tmp.memocho.log.mark = TYRANO.kag.stat.mp.mark || "：";
  TYRANO.kag.tmp.memocho.log.name_color = TYRANO.kag.stat.mp.name_color || "false";
  TYRANO.kag.tmp.memocho.log.name_none = TYRANO.kag.stat.mp.name_none || "false";
  TYRANO.kag.tmp.memocho.log.name_repeat = TYRANO.kag.stat.mp.name_repeat || "false";
  TYRANO.kag.tmp.memocho.log.text_center = TYRANO.kag.stat.mp.text_center || "false";
  TYRANO.kag.tmp.memocho.log.vertical = TYRANO.kag.stat.mp.vertical || TYRANO.kag.config.vertical;
  TYRANO.kag.tmp.memocho.log.text_count = 0;

  // [l]でaddにならないように。
  if (TYRANO.kag.stat.mp.l_join == "true") tyrano.plugin.kag.tag.l.log_join = "true";

  //[endmacro]でlogがうまく取れない対策
  if (TYRANO.kag.stat.mp.macro_join != "true") {
    //endmacro
    tyrano.plugin.kag.tag.endmacro.log_join = "inherit";
    //nextOrder
    tyrano.plugin.kag.ftag.nextOrder = function () {
      //基本非表示にする。
      this.kag.layer.layer_event.hide();

      var that = this;

      //[s]タグ。ストップするか否か
      if (this.kag.stat.is_strong_stop == true) {
        return false;
      }

      if (this.kag.stat.is_adding_text == true) {
        return false;
      }

      /*
							try {
      */

      this.current_order_index++;

      //ファイルの終端に着ている場合は戻す
      if (this.array_tag.length <= this.current_order_index) {
        this.kag.endStorage();
        return false;
      }

      var tag = $.cloneObject(this.array_tag[this.current_order_index]);

      this.kag.stat.current_line = tag.line;

      if (this.kag.is_rider) {
        tag.ks_file = this.kag.stat.current_scenario;
        this.kag.rider.pushConsoleLog(tag);
      } else if (this.kag.is_studio) {
        tag.ks_file = this.kag.stat.current_scenario;
        this.kag.studio.pushConsole(tag);

        this.kag.log("**:" + this.current_order_index + "　line:" + tag.line);
        this.kag.log(tag);
      } else {
        this.kag.log("**:" + this.current_order_index + "　line:" + tag.line);
        this.kag.log(tag);
      }
      //前に改ページ指定が入っている場合はテキスト部分をクリアする
      if (
        (tag.name == "call" && tag.pm.storage == "make.ks") ||
        this.kag.stat.current_scenario == "make.ks" ||
        (tag.name == "call" && tag.pm.storage == this.kag.stat.resizecall["storage"]) ||
        this.kag.stat.current_scenario == this.kag.stat.resizecall["storage"]
      ) {
        //make or resize中 です
        //make中は基本、メッセージクリアを行わない
        if (this.kag.stat.flag_ref_page == true) {
          this.kag.tmp.loading_make_ref = true;
          this.kag.stat.flag_ref_page = false;
        }
      } else {
        if (this.kag.stat.flag_ref_page == true) {
          this.kag.stat.flag_ref_page = false;

          //バックログ、画面クリア後は強制的に画面クリア
          this.kag.stat.log_clear = true;

          this.kag.ftag.hideNextImg();

          //vchatの場合タグを入れる
          if (that.kag.stat.vchat.is_active) {
            this.kag.ftag.startTag("vchat_in", {});
          } else {
            this.kag.getMessageInnerLayer().html("");
          }
        }
      }

      //タグを無視する
      if (this.checkCond(tag) != true) {
        this.nextOrder();
        return;
      }

      //メッセージ非表示状態の場合は、表示して、テキスト表示
      if (this.kag.stat.is_hide_message == true && that.kag.stat.fuki.active != true) {
        this.kag.layer.showMessageLayers();
        this.kag.stat.is_hide_message = false;
      }

      if (this.master_tag[tag.name]) {
        //この時点で、変数の中にエンティティがあれば、置き換える必要あり
        tag.pm = this.convertEntity(tag.pm);

        //必須項目チェック
        var err_str = this.checkVital(tag);

        //バックログに入れるかどうか。
        if (this.master_tag[tag.name].log_join == "true") {
          TYRANO.kag.tmp.memocho.log.text_count = 0;
          this.kag.stat.log_join = "true";
        } else if (this.master_tag[tag.name].log_join == "inherit") {
          //何もしない
        } else {
          if (tag.name == "text") {
            //テキストが連続する場合、二つ目以降はtrueに
            if (TYRANO.kag.tmp.memocho.log.text_count == 0) TYRANO.kag.tmp.memocho.log.text_count++;
            else {
              TYRANO.kag.tmp.memocho.log.text_count++;
              this.kag.stat.log_join = "true";
            }
          } else {
            TYRANO.kag.tmp.memocho.log.text_count = 0;
            this.kag.stat.log_join = "false";
          }
        }

        console.log("nextOrder2：", this.kag.stat.log_join, TYRANO.kag.tmp.memocho.log.text_count);

        //クリック待ち解除フラグがたってるなら
        if (this.checkCw(tag)) {
          this.kag.layer.layer_event.show();
        }

        if (err_str != "") {
          this.kag.error(err_str);
        } else {
          tag.pm["_tag"] = tag.name;
          this.master_tag[tag.name].start($.extend(true, $.cloneObject(this.master_tag[tag.name].pm), tag.pm));
        }
      } else if (this.kag.stat.map_macro[tag.name]) {
        tag.pm = this.convertEntity(tag.pm);

        //マクロの場合、その位置へジャンプ
        var pms = tag.pm;
        var map_obj = this.kag.stat.map_macro[tag.name];

        //スタックに追加する
        //呼び出し元の位置

        var back_pm = {};
        back_pm.index = this.kag.ftag.current_order_index;
        back_pm.storage = this.kag.stat.current_scenario;
        back_pm.pm = pms;

        this.kag.stat.mp = pms;
        //参照用パラメータを設定

        this.kag.pushStack("macro", back_pm);

        this.kag.ftag.nextOrderWithIndex(map_obj.index, map_obj.storage);
      } else {
        //実装されていないタグの場合は、もう帰る
        $.error_message($.lang("tag") + "：[" + tag.name + "]" + $.lang("not_exists"));

        this.nextOrder();
      }

      /*
							} catch(e) {
									console.log(e);
									that.kag.error($.lang("error_occurred"));
							}
			*/

      //ラベルといった、先行してオンメモリにしておく必要が有る命令に関しては、ここで精査しておく
    };

    //[r]
    if (TYRANO.kag.stat.mp.r_log != "false") {
      tyrano.plugin.kag.tag.r.start = function () {
        // 追加 ////////////////////////////////////////////////
        this.kag.pushBackLog("<br>", "join");
        // END /////////////////////////////////////////////////

        //var that = this; /たぶんこれいらない
        this.kag.getMessageInnerLayer().find("p").find(".current_span").append("<br>");
        this.kag.ftag.nextOrder();
      };
    }
  }

  //displayLog
  tyrano.plugin.kag.menu.displayLog = function () {
    var that = this;
    this.kag.stat.is_skip = false;

    //var j_save = $("<div></div>"); //たぶんこれいらない

    this.kag.html(
      "backlog",
      {
        novel: $.novel,
      },
      function (html_str) {
        var j_menu = $(html_str);

        var layer_menu = that.kag.layer.getMenuLayer();
        layer_menu.empty();
        layer_menu.append(j_menu);

        layer_menu.find(".menu_close").click(function () {
          layer_menu.fadeOut(300, function () {
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
          layer_menu.find(".button_arrow_up").click(function () {
            var now = layer_menu.find(".log_body").scrollTop();
            var pos = now - 60;
            layer_menu.find(".log_body").animate({ scrollTop: pos }, { queue: false });
          });

          layer_menu.find(".button_arrow_down").click(function () {
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
          array_log[i] = array_log[i].replace(/\\x20|&nbsp;/g, " "); //半角空白置換
          let new_log = array_log[i];

          let charaEName = ""; //キャラ名（英）
          let charaColor = ""; //キャラ色
          let class_name = "log"; //div用class

          //classがある場合
          let classList = ["ないよ"];
          if (new_log.indexOf("class=") > -1) {
            let logHTML = $(new_log); //jQuery
            //let logHTML = $.parseHTML(new_log); //node?
            //順番に処理
            for (let i = 0; i < logHTML.length; i++) {
              if (logHTML[i]["nodeName"] != "#comment") {
                //コメントは無視
                classList = logHTML[i]["classList"] || classList; //classListを取得
                //glinkか
                if (logHTML[i]["className"].indexOf("glink") > -1) {
                  charaEName = "glink";
                  new_log = new_log.replace("<span", '<p class="log_text"><span') + "</p>";
                }
                //キャラ名があるか
                else if (classList[0] == "backlog_chara_name") {
                  //日本語名なら英数名に
                  charaEName = TYRANO.kag.stat.jcharas[classList[1]] || classList[1];
                  //名前の色
                  if (log.name_color == "true" && TYRANO.kag.stat.charas[charaEName]) {
                    charaColor = TYRANO.kag.stat.charas[charaEName].color || "";
                    charaColor = ' style="color:' + $.convertColor(charaColor) + '"';
                    new_log = new_log.replace("<b", "<b" + charaColor);
                  }
                  //テキストを p で囲う
                  new_log = new_log.replace("</b>：", '</b><p class="log_text">') + "</p>";
                }
                //メッセージか
                else if (classList[0] == "backlog_text") {
                  charaEName = "no_name"; //名前指定無し
                  //名前用 b を追加してテキストを p で囲う
                  new_log = '<b class="backlog_chara_name"></b><div class="log_text">' + new_log + "</div>";
                }
                //pushLog
                else {
                  charaEName = classList.value; //class全部
                  new_log = '<span class="log_text">' + new_log + "</span>";
                }
                //マーク
                if (!logHTML[i].attributes["data-mark"] && log.mark != "none") {
                  new_log = new_log.replace("<b ", '<b data-mark="' + log.mark + '" '); //マーク
                }
                break; //一個目のタグでやめる
              } //end コメント無視
            } //end for logHTML.length
          } else {
            new_log = '<span class="log_text">' + new_log + "</span>";
          }
          //マーク
          if (charaEName) class_name += " " + charaEName;
          if (chara_name == charaEName) class_name += " none";
          else chara_name = charaEName;

          log_str += '<div class="' + class_name + '">' + new_log + "</div>"; //divで囲おう
        }
        // class追加 ////////////////////////////////////////////
        if (log.name_none == "true") layer_menu.find(".log_body").addClass("name_none");
        if (log.name_repeat == "true") layer_menu.find(".log_body").addClass("name_repeat");
        else if (log.text_center == "true") layer_menu.find(".log_body").addClass("center");
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
        if (log.name_none == "true") {
          layer_menu.find(".log_body").find(".backlog_chara_name").css("display", "none");
        }
        if (log.vertical == "true") {
          //縦書き用スクロール
          if ($.userenv() != "pc") {
            layer_menu.find(".button_smart").show();
            layer_menu
              .find(".button_arrow_up")
              .rotate(270)
              .click(function () {
                const now = layer_menu.find(".log_body").scrollLeft();
                const pos = now - 60;
                layer_menu.find(".log_body").animate({ scrollLeft: pos }, { queue: false });
              });
            layer_menu
              .find(".button_arrow_down")
              .rotate(90)
              .click(function () {
                const now = layer_menu.find(".log_body").scrollLeft();
                const pos = now + 60;
                layer_menu.find(".log_body").animate({ scrollLeft: pos }, { queue: false });
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
            "-webkit-writing-mode": "vertical-rl",
          });
        }
        //上下ホールで横スクロール
        const mousewheelevent =
          "onwheel" in document ? "wheel" : "onmousewheel" in document ? "mousewheel" : "DOMMouseScroll";
        $(document).on(mousewheelevent, function (e) {
          let num = $(".log_body").scrollLeft();
          //e.preventDefault();
          const delta = e.originalEvent.deltaY
            ? -e.originalEvent.deltaY
            : e.originalEvent.wheelDelta
            ? e.originalEvent.wheelDelta
            : -e.originalEvent.detail;
          if (delta < 0) {
            num = num - 60;
            $(".log_body").scrollLeft(num);
          } else {
            num = num + 60;
            $(".log_body").scrollLeft(num);
          }
        });

        //縦書き時のスクロール処理を追加
        $.preloadImgCallback(
          layer_menu,
          function () {
            layer_menu.fadeIn(300);
            if (log.vertical == "true") {
              layer_menu.find(".log_body").scrollLeft(0);
            } else {
              layer_menu.find(".log_body").scrollTop(9999999999);
            }
          },
          that
        );
        // END /////////////////////////////////////////////////

        $(".button_menu").hide();
      }
    );
  };
})();
