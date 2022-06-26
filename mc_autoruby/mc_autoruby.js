//【自動でルビを入れるプラグイン】
// Ver.1.00 2022/6/
// by hororo https://memocho.no-tenki.me/

(function(){

	//パラメータ保存
	TYRANO.kag.tmp.memocho = TYRANO.kag.tmp.memocho || {};
	TYRANO.kag.tmp.memocho.log = TYRANO.kag.tmp.memocho.log || {};


	//ルビ
	const observer = new MutationObserver(function(Records){
		const ruby_list = TYRANO.kag.tmp.memocho.log.ruby_list;
		console.log("Records",Records);
		Records.forEach(function( value ,i) {
			const vertical = TYRANO.kag.stat.vertical;
			let flag = ""; //フラグ
			let target_layer = value.target.className; //親レイヤ
			let text = value.target.innerText; //テキスト

			//ルビ対象チェック
			//link
			if(value.target.classList[1] == "event-setting-element"){
				flag = "current_span";
				target_layer = value.target.parentNode.parentNode.parentNode.className;
			}

			//普通のテキスト
			else if(value.target.className == "current_span"){
				flag = "current_span";
				target_layer = value.target.parentNode.parentNode.parentNode.className;
				//target_layer = value.target.parentNode.parentNode.parentNode;
				//if(TYRANO.kag.tmp.memocho.log.ruby_str) text = ""; //ルビがある時はスルー
				//else if(value.addedNodes) text = value.addedNodes[value.addedNodes.length-1].innerText || "";
				if(value.addedNodes) text = value.addedNodes[value.addedNodes.length-1].innerText || "";
				text = text.replace(/\n.*\n/g, "");
				text += $("." + target_layer.replace(/ /g, ".")).find(".chara_name_area").text();
			}

			//キャラ名
			else if(value.target.classList[0] == "chara_name_area"){
				flag = "chara_name_area";
				target_layer = value.target.parentNode.className;
				//target_layer = value.target.parentNode;
			}

			//glink・ptextなど
			else if(value.target.classList[0] == "layer" && value.addedNodes[0]){
				if(value.addedNodes[0].nodeName == "P" || value.target.classList[1] == "layer_free") {
					flag = "layer";
				}
			}

			//縦横切換え
			else if(value.target.nodeName == "P" && value.target.parentNode !== null){
				target_layer = $("." + value.target.parentNode.className.replace(/ /g, "."));
				//target_layer = $("." + target_layer.replace(/ /g, "."));
				if(value.target.parentNode.className.indexOf("message") > -1){
					//flag = "vertical";
					if(vertical == "true"){
						target_layer.find(".mc_ruby.auto").each(function() {
							let data_pos = $(this).attr("data-pos");
							$(this).css({"left":0,"top":data_pos});
						});
					}else{
						target_layer.find(".mc_ruby.auto").each(function() {
							let data_pos = $(this).attr("data-pos");
							$(this).css({"left":data_pos,"top":0});
						});
					}
				}
			}


			if(flag){

				//ログ
				MEMOCHO.autoruby_log();

				target_layer = $("." + target_layer.replace(/ /g, "."));
				//Object.keys(ruby_list).forEach(function(key){
				ruby_list.forEach(function(elem,i){

					ruby_tag = "<ruby class='mc_ruby auto' data-ruby='" + elem.ruby + "'>";

					if(text.indexOf(elem.key) > -1){

						//ログ
						//log_autoruby(key,ruby_tag);
						/*
						if(TYRANO.kag.variable.tf.system.backlog.length > 0){
							let last_log = $(TYRANO.kag.variable.tf.system.backlog.pop()); //最後のログ
							let logdmy = $('<div>');
							last_log.each(function() {
								let text = $(this).html() || $(this).text();
								let html = $(this).html(text.replace(new RegExp(key+"(?!(</ruby>))","g"),ruby_tag + key + "</ruby>"));
								logdmy.append(html); //ログ置換
							});
							last_log = logdmy.html();
							//last_log = last_log.replace(new RegExp(key+"(?!('>|</ruby>))","g"),ruby_tag + key + "</ruby>"); //ログ置換
							TYRANO.kag.variable.tf.system.backlog.push(last_log);
						}
						*/

						switch (flag){

							case "current_span":
							//text = $(".current_span").children('span:last');
							let pos = " data-pos='" + elem.pos + "'";
							if(vertical == "true") pos += " style='left:0;top:" + elem.pos + ";'";
							else pos += " style='left:" + elem.pos + ";top:0;'";
							//const pos = " data-pos='" + ruby_list[key]["pos"] + "' style='left:" + ruby_list[key]["pos"] + ";top:" + ruby_list[key]["pos"] + ";'";
							ruby_tag = "<ruby class='mc_ruby auto'" + pos + " data-ruby='" + elem.ruby + "'></ruby>";
							const p = new RegExp(elem.key,"g");
							let result;
							while (result = p.exec(text)) {
								//console.log("テキスト",elem.key,text,target_layer.find('.current_span').children('span:last').children('span').eq(result.index),result);
								let taget_span = $(".current_span").children("span:last").children("span").eq(result.index);
								//keyの1文字目確認
								if(taget_span.text() == elem.key.slice(0,1)){
									const target_class = target_layer.find(".current_span").children("span:last").children("span").eq(result.index).attr("class");
									if(target_class != "no_ruby"){
										target_layer.find(".current_span").children("span:last").children("span").eq(result.index).append(ruby_tag);
										for(let i = 1; i < elem.key.length ; i++){
											target_layer.find(".current_span").children("span:last").children("span").eq(result.index + i).addClass("no_ruby");
										}
									}
								}
							}
							break;

							case "chara_name_area":
							target_layer.find(".chara_name_area").addClass("mc_ruby auto").attr("data-ruby",elem.ruby).attr("data-name",elem.key);
							//console.log("キャラ名：",target_layer.find('.chara_name_area').html());
							break;

							case "layer":
							target_layer.children().each(function(){
								let txt = $(this).html();
								$(this).html(txt.replace(new RegExp(elem.key+"(?!('>|</ruby>))","g"),ruby_tag + elem.key + "</ruby>")); //ログ置換
							});
							break;

						} //END switch

					}

					//一致しない場合
					else{
						if(flag == "chara_name_area"){
							const chara_name = target_layer.find(".chara_name_area").text();
							const ruby_name = target_layer.find(".chara_name_area").attr("data-name");
							if(chara_name != ruby_name) $(".chara_name_area").attr("data-ruby","");
						}
					}

				}); //END ruby_list.forEach
			} //END if(flag)

		});
	});

	//監視対象
	const selector = document.getElementById("tyrano_base");
	observer.observe(selector,{
		childList: true,  // 子要素が登録されたら
		subtree: true,    // 子孫も含める
	});



	//ルビリスト
	let ruby_list = {
		名前: "なまえ",
		簡単: "かんたん",
		来: "き",
		誰: "だれ",
		帰: "かえ",
		名前: "なまえ",
		私: "わたし",
		開発: "かいはつ",
		興味: "きょうみ",
		嬉: "うれ",
		君: "きみ",
		耳寄: "みみよ",
		情報源: "じょうほうげん",
		情報: "じょうほう",
		使: "つか",
		本格的: "ほんかくてき",
		機能: "きのう",
		確認: "かくにん",
		最後: "さいご",
		特徴: "とくちょう",
		動作: "どうさ",
		一度: "いちど",
		多: "おお",
		環境: "かんきょう",
		発表: "はっぴょう",
		貼: "は",
		付: "つ",
		気軽: "きがる",
		主要: "しゅよう",
		安心: "あんしん",
		最近: "さいきん",
		復旧: "普及かな？",
		僕: "ぼく",
		訪: "おとず",
		増: "ふ",
		問題: "もんだい",
		向: "む",
		化: "か",
		販売: "はんばい",
		貧困生活: "ひんこんせいかつ",
		脱出: "だっしゅつ",
		売: "う",
		次: "つぎ",
		場面: "ばめん",
		移動: "いどう",
		廊下: "ろうか",
		寒: "さむ",
		教室: "きょうしつ",
		戻: "もど",
		今: "いま",
		違: "ちが",
		急: "いそ",
		演出: "えんしゅつ",
		加: "くわ",
		画面: "がめん",
		切: "き",
		替: "か",
		種類: "しゅるい",
		以上: "いじょう",
		便利: "べんり",
		方法: "ほうほう",
		全: "ぜん",
		物語: "ものがたり",
		読: "よ",
		場合: "ばあい",
		方式: "ほうしき",
		非常: "ひじょう",
		強力: "きょうりょく",
		柔軟: "じゅうなん",
		表現: "ひょうげん",
		可能: "かのう",
		文字: "もじ",
		変更: "へんこう",
		変: "か",
		記述: "きじゅつ",
		時: "とき",
		同: "おな",
		形式: "けいしき",
		好: "す",
		画像: "がぞう",
		合わ: "あ",
		右下: "みぎした",
		風: "ふう",
		必要: "ひつよう",
		上: "うえ",
		持: "も",
		特別: "とくべつ",
		標準: "ひょうじゅん",
		用意: "ようい",
		大丈夫: "だいじょうぶ",
		困: "こま",
		音楽: "おんがく",
		鳴: "な",
		再生: "さいせい",
		徐々: "じょじょ",
		試: "ため",
		選択肢: "せんたくし",
		分岐: "ぶんき",
		別: "べつ",
		登場: "とうじょう",
		何人: "なんにん",
		基本: "きほん",
		説明: "せつめい",
		終: "お",
		自分: "じぶん",
		気: "き",
		最初: "さいしょ",
		公式: "こうしき",
		良: "よ",
		思: "おも",
		動: "うご",
		参考: "さんこう",
		制作事例: "せいさくじれい",
		制作: "せいさく",
		事: "こと",
		最後: "さいご",
		役立: "やくだ",
		情報: "じょうほう",
		確認: "かくにん",
		紹介: "しょうかい",
		応用: "おうよう",
		苦手: "にがて",
		沢山: "たくさん",
		作成: "さくせい",
		一部: "いちぶ",
		出来: "でき",
		掲示板: "けいじばん",
		質問: "しつもん",
		詳細: "しょうさい",
		作: "つく",
		身: "み",
		知: "し",
		乗: "の",
		役: "やく",
		立: "た",
		源: "げん",
		言: "い",
		丸: "まる",
		触: "さわ",
		色: "いろ",
		"あかね": "アカネ",
		"Tyranoscript": "ティラノスクリプト",
		"自動": "じどう",
		他: "ほか",
		追加: "ついか",
		対象: "たいしょう",
		強制的: "きょうせいてき",
		強制: "きょうせい",
		非対応: "ひたいおう",
		対応: "たいおう",
		非: "ひ",
		全部: "ぜんぶ",
		振: "ふ",
		表示: "ひょうじ",
		実験: "じっけん",
		要素: "ようそ",
		漢字: "かんじ",
		直下: "ちょっか",
		置換: "ちかん",
		縦書: "たてが",
		横書: "よこが",
		切換: "きりか",
		需要: "じゅよう",
		無料: "むりょう",
		健か: "したた　　",
		人: "ひと",
		遊: "あそ",
		用: "よう",
		俺: "おれ",
		頂: "いただ",
		感: "かん",
		長: "なが",
		分: "わ",
		長い長ーーーい名前: "なが　　なが　　　　　　　　 なまえ "  //名前は分割指定できん
	};

	//パラメータがあれば渡す
	if(TYRANO.kag.stat.mp.ruby_list) ruby_list = TYRANO.kag.embScript(TYRANO.kag.stat.mp.ruby_list);

	//文字数で表示位置調整して配列作り直し
	const ruby_newlist = function(ruby_list) {
		TYRANO.kag.tmp.memocho.log.ruby_list = [];
		Object.keys(ruby_list).forEach(function(key,i){
			let pos = ((key.length * 0.5) -1); //全角
			if(key.match(/^[A-Za-z0-9]*$/)) pos = (pos * 0.5) - 0.25; //半角
			pos = pos + "em";
			TYRANO.kag.tmp.memocho.log.ruby_list[i] = {
				key: key,
				ruby: ruby_list[key],
				pos: pos
			};
		});
	};

	ruby_newlist(ruby_list); //実行

/*
	const log_autoruby = function(key,ruby_tag) {
		if(TYRANO.kag.variable.tf.system.backlog.length > 0){
			let last_log = $(TYRANO.kag.variable.tf.system.backlog.pop()); //最後のログ
			let logdmy = $("<div>");
			if(last_log.html()){
				last_log.each(function() {
					let text = $(this).html() || $(this).text();
					let html = $(this).html(text.replace(new RegExp(key+"(?!(\'>|\">|</ruby>))","g"),ruby_tag + key + "</ruby>"));
					logdmy.append(html); //ログ置換
				});
				last_log = logdmy.html() || last_log;
			}else{
				let text = last_log.selector;
				last_log = "<span>" + text.replace(new RegExp(key,"g"),ruby_tag + key + "</ruby>") + "</span>";
			}
			//last_log = last_log.replace(new RegExp(key+"(?!('>|</ruby>))","g"),ruby_tag + key + "</ruby>"); //ログ置換
			TYRANO.kag.variable.tf.system.backlog.push(last_log);
		}
	}
*/

	//ログに自動でルビを振ります。
	//iscriptでも実行したいのでグローバル関数に（タグ化した方がいいかも？）
	if(typeof window.MEMOCHO === "undefined") window.MEMOCHO = {};
	MEMOCHO.autoruby_log = function(){
		//ログに配列が無かったら実行しない
		if(TYRANO.kag.variable.tf.system.backlog.length > 0){
			const ruby_list = TYRANO.kag.tmp.memocho.log.ruby_list; //ルビリスト
			let last_log = TYRANO.kag.variable.tf.system.backlog.pop(); //最後のログ
			last_log = $("<div>").append(last_log); //ログをjQueryドキュメントに
			let txt = last_log.html(); //置換用
			ruby_list.forEach(function(elem,i){ //ルビリストを順番に処理
				let ruby_tag = "<ruby class='mc_ruby auto' data-ruby='" + elem.ruby + "'>"; //rubyタグ作成
				if(last_log.text().indexOf(elem.key) > -1){ //リストの文字があったら
					txt = txt.replace(new RegExp(elem.key+"(?!(\'>|\">|</ruby>))","g"),ruby_tag + elem.key + "</ruby>"); //rubyで囲う
				}
			});
			//Object.keys(ruby_list).forEach(function(key){ //ルビリストを順番に処理
				//let ruby_tag = "<ruby class='mc_ruby auto' data-ruby='" + ruby_list[key].ruby + "'>"; ///rubyタグ作成
				//if(last_log.text().indexOf(key) > -1){ //リストの文字があったら
					//txt = txt.replace(new RegExp(key+"(?!(\'>|\">|</ruby>))","g"),ruby_tag + key + "</ruby>"); //rubyで囲う
				//}
			//});
			last_log = $("<div>").append(txt).html(); //文字列に戻す
			TYRANO.kag.variable.tf.system.backlog.push(last_log); //ログに戻す
		}
	}


}());
