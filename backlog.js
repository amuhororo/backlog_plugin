//【バックログプラグイン】
// by hororo https://memocho.no-tenki.me/

(function () {
  TYRANO.kag.stat.log_add = false; //addフラグ

  TYRANO.kag.tmp.memocho = TYRANO.kag.tmp.memocho || {}; //tmp内にめも調用の領域を勝手に作る
  TYRANO.kag.tmp.memocho.log = TYRANO.kag.tmp.memocho.log || {}; //さらにバックログ用

  //パラメータを保存
  TYRANO.kag.tmp.memocho.log.mark = TYRANO.kag.stat.mp.mark !== undefined ? TYRANO.kag.stat.mp.mark : "：";
  TYRANO.kag.tmp.memocho.log.name_color = TYRANO.kag.stat.mp.name_color || "false";
  TYRANO.kag.tmp.memocho.log.name_none = TYRANO.kag.stat.mp.name_none || "false";
  TYRANO.kag.tmp.memocho.log.name_omit = TYRANO.kag.stat.mp.name_omit || "false";
  TYRANO.kag.tmp.memocho.log.text_center = TYRANO.kag.stat.mp.text_center || "false";
  TYRANO.kag.tmp.memocho.log.glink = TYRANO.kag.stat.mp.glink || "true";
  TYRANO.kag.tmp.memocho.log.glink_name =
    TYRANO.kag.stat.mp.glink_name !== undefined ? TYRANO.kag.stat.mp.glink_name : "選択肢";
  TYRANO.kag.tmp.memocho.log.glink_mark =
    TYRANO.kag.stat.mp.glink_mark !== undefined ? TYRANO.kag.tmp.memocho.glink_mark : TYRANO.kag.tmp.memocho.log.mark;
  TYRANO.kag.tmp.memocho.log.ruby = TYRANO.kag.stat.mp.ruby || "true";
  TYRANO.kag.tmp.memocho.log.vertical = TYRANO.kag.stat.mp.vertical || TYRANO.kag.config.vertical;

  TYRANO.kag.tmp.memocho.log.nameTmp = null; //キャラ名リピートチェック用
  TYRANO.kag.tmp.memocho.log.tcy = false; //縦中横フラグ

  //保存しなくていいパラメータ
  TYRANO.kag.stat.mp.r = TYRANO.kag.stat.mp.r || "true";
  TYRANO.kag.stat.mp.l = TYRANO.kag.stat.mp.l || "true";

  //以下タグ改造
  const _ex = {}; //関数一時保存用？

  //[r]タグでログに<br>を追加
  if (TYRANO.kag.stat.mp.r == "true") {
    _ex.r = tyrano.plugin.kag.tag.r.start;
    tyrano.plugin.kag.tag.r.start = function () {
      this.kag.pushBackLog("<br>", "join"); // 追加
      _ex.r.apply(this, arguments);
    };
  }

  //[p][er][cm][ct]はadd/[l]は任意
  //面倒くさいのでforEachで回す。
  const to_add_tag = ["p", "er", "cm", "ct", "l"];
  to_add_tag.forEach(function (elem) {
    if (elem === "l" && TYRANO.kag.stat.mp.l == "true") {
    } else {
      _ex[elem] = tyrano.plugin.kag.tag[elem].start;
      tyrano.plugin.kag.tag[elem].start = function () {
        this.kag.stat.log_add = true; //addフラグをon
        //前のログに終了タグを追加
        if (this.kag.variable.tf.system.backlog.length > 0) {
          const logLast = this.kag.variable.tf.system.backlog.slice(-1)[0];
          const strHead = logLast.slice(0, 3);
          const strFoot = logLast.slice(-7);
          if (strHead === "<p " && strFoot == "</span>") this.kag.pushBackLog("</span></p>", "join");
        }
        _ex[elem].apply(this, arguments);
      };
    }
  });

  //[glink]
  TYRANO.kag.on("click-tag-glink", function (e) {
    //pmを取得
    const eventPm = JSON.parse(e.currentTarget.dataset.eventPm);
    //ログフラグを確認
    let log_flag = this.kag.tmp.memocho.log.glink == "true";
    if (eventPm.log) log_flag = eventPm.log == "true";
    //ログに入れる
    if (log_flag) {
      let log_str = `<p class="log glink">`;
      const log_name = this.kag.tmp.memocho.log.glink_name || "　";
      let mark = this.kag.tmp.memocho.log.glink_mark;
      //ログの名前部分を入れるか
      if (log_name !== "none") {
        mark = mark === "" || mark == "none" ? "" : ` data-mark="${mark}"`;
        log_str += `<b class="backlog_chara_name glink" ${mark}>${log_name}</b>`;
      }
      //テキスト
      log_str += `<span class="log_text"><span class="backlog_text glink">${eventPm.text}</span></span></p>`;

      //ログに入れる
      this.kag.pushBackLog(log_str, "add");
      this.kag.tmp.memocho.log.nameTmp = ""; //キャラ名リセット
    }
  });

  //[ruby]をログにも入れる
  if (TYRANO.kag.tmp.memocho.log.ruby == "true") {
    _ex.ruby = tyrano.plugin.kag.tag.ruby.start;
    tyrano.plugin.kag.tag.ruby.start = function (pm) {
      _ex.ruby.apply(this, arguments);
      if (this.kag.tmp.memocho.log.tcy) {
        //tcyフラグが立ってる時は無視
        this.kag.tmp.memocho.log.tcy = false;
      } else {
        //nextOrder後なのでテキストは書き出されていると思うんだけど？
        //ログの最後の配列切り取る
        let last_log = this.kag.variable.tf.system.backlog.pop();
        //カスタムルビプラグインがあったら
        if (this.kag.tmp.custom_ruby) {
          const selecter = $(".current_span").html() ? $(".current_span") : $(".current_span").prev(); //空だったら一個前見る
          const ruby_html = selecter.find("ruby:last").parent().prop("outerHTML"); //ルビ用のタグを拾う
          last_log = last_log.replace(/(.*)(\">)(.)/, "$1$2$3" + ruby_html); //ルビつっこむ
        }
        //通常のルビ
        else {
          last_log = last_log.replace(/(.*)(\">)(.)/, "$1$2<ruby>$3<rt>" + pm.text + "</rt></ruby>"); //ルビつっこむ
        }
        //ログ戻す
        this.kag.pushBackLog(last_log, "add");
      }
    };
  }

  //[pushlog] addの場合キャラ名をリセットしとく
  _ex.pushlog = tyrano.plugin.kag.tag.pushlog.start;
  tyrano.plugin.kag.tag.pushlog.start = function (pm) {
    if (pm.join == "false") this.kag.tmp.memocho.log.nameTmp = ""; //キャラ名リセット
    _ex.pushlog.apply(this, arguments);
  };

  //バックログ※改造
  tyrano.plugin.kag.tag.text.pushTextToBackLog = function (chara_name, message_str) {
    /*
    // ひとつ前のログに連結させるべきかどうか
    // たとえば[r][font][delay]などのタグを通過したあとは連結が有効になる

    var should_join_log = this.kag.stat.log_join == "true";

    // バックログへの追加
    if ((chara_name != "" && !should_join_log) || (chara_name != "" && this.kag.stat.f_chara_ptext == "true")) {
      // バックログにキャラ名を新しく書き出す場合
      const log_str =
        `<b class="backlog_chara_name ${chara_name}">${chara_name}</b>：` +
        `<span class="backlog_text ${chara_name}">${message_str}</span>`;
      this.kag.pushBackLog(log_str, "add");

      if (this.kag.stat.f_chara_ptext == "true") {
        this.kag.stat.f_chara_ptext = "false";
        this.kag.stat.log_join = "true";
      }
    } else {
      // バックログにキャラ名を新しく書き出す必要がない場合
      const log_str = `<span class="backlog_text ${chara_name}">${message_str}</span>`;
      const join_type = should_join_log ? "join" : "add";
      this.kag.pushBackLog(log_str, join_type);
    }
    */

    //add判定した方が楽な気がするのです
    const LOG = this.kag.tmp.memocho.log; //長いので代入
    const should_add_log = this.kag.stat.log_add == true; //addフラグ
    const nameE = this.kag.stat.jcharas[chara_name] || chara_name; //英数名
    const nameClass = chara_name == "" ? "no_name" : nameE; //class名
    const mark = LOG.mark === "" || LOG.mark == "none" ? "" : ` data-mark="${LOG.mark}"`;
    //名前の色
    let nameColor = "";
    let charas = this.kag.stat.charas[nameE];
    if (LOG.name_color == "true" && charas) {
      if (charas.log_color == "" || charas.log_color == "none") nameColor = "";
      else nameColor = charas.log_color || charas.color || "";
      if (nameColor) nameColor = ` style="color:` + $.convertColor(nameColor) + `"`;
    }
    //名前リピートチェック
    let none = "";
    if (LOG.nameTmp == nameE) none = " none";
    else LOG.nameTmp = nameE;
    // バックログへの追加
    if (should_add_log || this.kag.stat.f_chara_ptext == "true") {
      //addまたは[chara_ptext]直後の場合
      //<p>なら閉じ忘れてもブラウザが閉じてくれるだろう…
      const log_str =
        `<p class="log ${nameClass}${none}">` +
        `<b class="backlog_chara_name ${nameClass}"${nameColor}${mark}">${chara_name}</b>` +
        `<span class="log_text"><span class="backlog_text ${nameClass}">${message_str}</span>`;
      this.kag.pushBackLog(log_str, "add"); //配列にログを追加
      this.kag.stat.log_add = false; //addフラグを解除
      this.kag.stat.f_chara_ptext = "false"; //chara_ptextフラグ解除
    } else {
      //joinの場合はテキストのみを追加してく
      const log_str = `<span class="backlog_text ${nameClass}">${message_str}</span>`;
      this.kag.pushBackLog(log_str, "join");
    }
  };

  //displayLog
  _ex.displayLog = tyrano.plugin.kag.menu.displayLog;
  tyrano.plugin.kag.menu.displayLog = function () {
    _ex.displayLog.apply(this, arguments);
    setTimeout(function () {
      const LOG = TYRANO.kag.tmp.memocho.log; //長いので代入
      //class追加
      if (LOG.name_omit == "true") $(".log_body").addClass("name_omit");
      if (LOG.name_none == "true") $(".log_body").addClass("name_none");
      else if (LOG.text_center == "true") $(".log_body").addClass("center");
      //縦書き
      if (LOG.vertical == "true") {
        $(".log_body").addClass("vertical_text");
        //if (LOG.name_none == "true") $(".log_body").find(".backlog_chara_name").css("display", "none");
        $(".log_body").scrollLeft(0);
        //上下ホールで横スクロール
        const mousewheelevent =
          "onwheel" in document ? "wheel" : "onmousewheel" in document ? "mousewheel" : "DOMMouseScroll";
        $(document).on(mousewheelevent, function (e) {
          let num = $(".log_body").scrollLeft();
          const delta = e.originalEvent.deltaY
            ? -e.originalEvent.deltaY
            : e.originalEvent.wheelDelta
            ? e.originalEvent.wheelDelta
            : -e.originalEvent.detail;
          if (delta < 0) num = num - 60;
          else num = num + 60;
          $(".log_body").scrollLeft(num);
        });
      }
    }, 50); //表示待ち
  };

  //スクロール
  _ex.setMenuScrollEvents = tyrano.plugin.kag.menu.setMenuScrollEvents;
  tyrano.plugin.kag.menu.setMenuScrollEvents = function (j_parent, options = {}) {
    _ex.setMenuScrollEvents.apply(this, arguments);

    //** 縦書き時のスクロール処理
    if (options.target == ".log_body" && this.kag.tmp.memocho.log.vertical == "true") {
      const scroll_target_selector = options.target || ".area_save_list";
      const scroll_move = options.move || 160;
      const j_scroll_target = j_parent.find(scroll_target_selector);
      j_parent
        .find(".button_arrow_up")
        .attr("src", "./tyrano/images/system/arrow_prev.png")
        .click(() => {
          const now = j_scroll_target.scrollLeft();
          const pos = now - scroll_move;
          j_scroll_target.animate({ scrollLeft: pos }, { queue: false });
        })
        .focusable();

      j_parent
        .find(".button_arrow_down")
        .attr("src", "./tyrano/images/system/arrow_next.png")
        .css("top", "20px")
        .click(() => {
          const now = j_scroll_target.scrollLeft();
          const pos = now + scroll_move;
          j_scroll_target.animate({ scrollLeft: pos }, { queue: false });
        })
        .focusable();
    }
  };

  //mc_rubyタグ※自分用なのでサポート対象外
  //stroke、グラデーション非対応
  const tag = {}; //タグ確認用…
  tag.mc_ruby = {
    pm: {
      text: "",
    },
    log_join: "true",
    start: function (pm) {
      this.kag.tmp.memocho.log.ruby_str = pm.text;
      this.kag.ftag.nextOrder(); //次のタグへ
    },
  };

  tag.endruby = {
    log_join: "true",
    start: function () {
      let ruby_str = this.kag.tmp.memocho.log.ruby_str;
      //テキスト
      let selecter = $(".current_span").html() ? $(".current_span") : $(".current_span").prev(); //メッセージ空だったら一個前見る
      selecter.children("span:last-child").addClass("mc_ruby").attr("data-ruby", ruby_str);
      //バックログ
      let last_log = this.kag.variable.tf.system.backlog.pop();
      last_log = last_log.replace(/(.*)(\">)/, '$1 mc_ruby" data-ruby="' + ruby_str + "$2"); //ルビつっこむ
      this.kag.pushBackLog(last_log, "add");

      this.kag.tmp.memocho.log.ruby_str = "";
      this.kag.ftag.nextOrder();
    },
  };

  //ティラノのタグに登録
  for (var tag_name in tag) {
    TYRANO.kag.ftag.master_tag[tag_name] = object(tag[tag_name]);
    TYRANO.kag.ftag.master_tag[tag_name].kag = TYRANO.kag;
  }
})();
