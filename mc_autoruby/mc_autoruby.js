//【自動でルビを入れるプラグイン】
// Ver.1.00 2022/6/
// by hororo https://memocho.no-tenki.me/

(function(){

	//パラメータ保存
	TYRANO.kag.tmp.memocho = TYRANO.kag.tmp.memocho || {};
	TYRANO.kag.tmp.memocho.log = TYRANO.kag.tmp.memocho.log || {};
	TYRANO.kag.tmp.memocho.log.auto_ruby = false; //ルビフラグ


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
			if(value.target.className == "current_span"){
				flag = "current_span";
				target_layer = value.target.parentNode.parentNode.parentNode.className;
				//target_layer = value.target.parentNode.parentNode.parentNode;
				if(TYRANO.kag.tmp.memocho.log.ruby_str) text = ""; //ルビがある時はスルー
				else if(value.addedNodes) text = value.addedNodes[value.addedNodes.length-1].innerText || "";
				text += $("." + target_layer.replace(/ /g, ".")).find(".chara_name_area").text();
			}

			else if(value.target.classList[0] == "chara_name_area"){
				flag = "chara_name_area";
				target_layer = value.target.parentNode.className;
				//target_layer = value.target.parentNode;
			}

			else if(value.target.classList[0] == "layer" && value.addedNodes[0]){
				if(value.addedNodes[0].nodeName == "P" || value.target.classList[1] == "layer_free") {
					flag = "layer";
				}
			}

			//縦横切換え
			else if(value.target.nodeName == "P" && value.target.parentNode !== null){
				target_layer = $("." + value.target.parentNode.className.replace(/ /g, "."));
				//target_layer = $("." + target_layer.replace(/ /g, "."));
				if(value.target.parentNode.className.indexOf('message') > -1){
					//flag = "vertical";
					if(vertical == "true"){
						target_layer.find('.mc_ruby.auto').each(function() {
							let data_pos = $(this).attr('data-pos');
							$(this).css({'left':0,'top':data_pos});
						});
					}else{
						target_layer.find('.mc_ruby.auto').each(function() {
							let data_pos = $(this).attr('data-pos');
							$(this).css({'left':data_pos,'top':0});
						});
					}
				}
			}


			if(flag){

				MEMOCHO.autoruby_log();

				target_layer = $("." + target_layer.replace(/ /g, "."));
				//console.log(flag,target_layer,text);
				Object.keys(ruby_list).forEach(function(key){

					ruby_tag = "<ruby class='mc_ruby auto' data-ruby='" + ruby_list[key].ruby + "'>";

					if(text.indexOf(key) > -1){

						//ログ
						//console.log(flag,key,'/あるよ！',text);
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

							case 'current_span':
							//text = $(".current_span").children('span:last');
							let pos = " data-pos='" + ruby_list[key].pos + "'";
							if(vertical == "true") pos += " style='left:0;top:" + ruby_list[key].pos + ";'";
							else pos += " style='left:" + ruby_list[key].pos + ";top:0;'";
							//const pos = " data-pos='" + ruby_list[key]["pos"] + "' style='left:" + ruby_list[key]["pos"] + ";top:" + ruby_list[key]["pos"] + ";'";
							ruby_tag = "<ruby class='mc_ruby auto'" + pos + " data-ruby='" + ruby_list[key].ruby + "'></ruby>";
							const p = new RegExp(key,"g");
							let result;
							while (result = p.exec(text)) {
								//console.log("テキスト",key,target_layer.find('.current_span').children('span:last').children('span').eq(result.index),result);
								let taget_span = $('.current_span').children('span:last').children('span').eq(result.index);
								if(taget_span.text() == key.slice(0,1)){
									target_layer.find('.current_span').children('span:last').children('span').eq(result.index).append(ruby_tag);
								}
							}
							break;

							case 'chara_name_area':
							target_layer.find('.chara_name_area').addClass('mc_ruby auto').attr('data-ruby',ruby_list[key].ruby).attr('data-name',key);
							break;

							case 'layer':
							target_layer.children().each(function(){
								let txt = $(this).html();
								$(this).html(txt.replace(new RegExp(key+"(?!('>|</ruby>))","g"),ruby_tag + key + "</ruby>")); //ログ置換
							});
							break;

/*							case 'ptext':
							target_layer.children('p').each(function(){
								let txt = $(this).html();
								$(this).html(txt.replace(new RegExp(key+"(?!('>|</ruby>))","g"),ruby_tag + key + "</ruby>")); //ログ置換
							});
							break;*/
/*							case 'glink':
							$('.glink_button').each(function() {
								let txt = $(this).html();
								$(this).html(txt.replace(new RegExp(key+"(?!('>|</ruby>))","g"),ruby_tag + key + "</ruby>")); //ログ置換
							});
							break;
*/
/*							case 'free':
							$('.layer_free').children().each(function(){
								let txt = $(this).html();
								$(this).html(txt.replace(new RegExp(key+"(?!('>|</ruby>))","g"),ruby_tag + key + "</ruby>")); //ログ置換
							});
							break;*/
/*							case 'vertical': //メッセージの縦横切り替え用
							class_name = target_layer.children('p').attr('class');
							if(vertical == "true"){
								target_layer.find('.mc_ruby.auto').each(function() {
									let data_pos = $(this).attr('data-pos');
									$(this).css({'left':0,'top':data_pos});
								});
							}else{
								target_layer.find('.mc_ruby.auto').each(function() {
									let data_pos = $(this).attr('data-pos');
									$(this).css({'left':data_pos,'top':0});
								});
							}
							break;
*/
						} //END switch


					}else{
						if(flag == "chara_name_area"){
							const chara_name = target_layer.find('.chara_name_area').text();
							const ruby_name = target_layer.find('.chara_name_area').attr('data-name');
							if(chara_name != ruby_name) $('.chara_name_area').attr('data-ruby','');
						}
					}

				}); //END ruby_list.forEach
				//if(flag == "log" && $(".log_body").html() != text) $(".log_body").html(text);
				//TYRANO.kag.tmp.memocho.log.auto_ruby = true
			}else{
				//TYRANO.kag.tmp.memocho.log.auto_ruby = false;
			} //END if(flag)

		});
	});

	//監視対象
	const selector = document.getElementById('tyrano_base');
	observer.observe(selector,{
		childList: true,  // 子要素が登録されたら
		//characterData: true,
		subtree: true,    // 子孫も含める
	});



	let ruby_list = {
		"誰": "だれ",
		"名前": "なまえ",
		"私": "わたし",
		"簡単": "かんたん",
		"機能": "きのう",
		"あかね": "アカネ",
		"Tyranoscript": "ティラノスクリプト",
		"興味": "きょうみ",
		"自動": "じどう",
		他: "ほか",
		追加: "ついか",
		対象: "たいしょう",
		強制的: "きょうせいてき", //入る
		強制: "きょうせい",       //前方一致は無効化できる（cssで非表示）
		非対応: "ひたいおう",     //入る
		対応: "たいおう",         //後方一致は無効化できない（ログには入らない）
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
		頂く: "いただ　　",
		感: "かん"
	};

	//パラメータがあれば渡す
	if(TYRANO.kag.stat.mp.ruby_list) ruby_list = TYRANO.kag.embScript(TYRANO.kag.stat.mp.ruby_list);

	//文字数で表示位置調整
	const ruby_newlist = function(ruby_list) {
		TYRANO.kag.tmp.memocho.log.ruby_list = {};
		Object.keys(ruby_list).forEach(function(key){
			let pos = ((key.length * 0.5) -1);
			if(key.match(/^[A-Za-z0-9]*$/)) pos = (pos * 0.5) - 0.25; //半角
			pos = pos + "em";
			TYRANO.kag.tmp.memocho.log.ruby_list[key] = {
				ruby: ruby_list[key],
				pos: pos
			};
		});
	};

	ruby_newlist(ruby_list);

	const log_autoruby = function(key,ruby_tag) {
		if(TYRANO.kag.variable.tf.system.backlog.length > 0){
			let last_log = $(TYRANO.kag.variable.tf.system.backlog.pop()); //最後のログ
			let logdmy = $('<div>');
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


	//ログに自動でルビを振ります。
	if(typeof window.MEMOCHO === "undefined") window.MEMOCHO = {};
	MEMOCHO.autoruby_log = function(){
		if(TYRANO.kag.variable.tf.system.backlog.length > 0){
			const ruby_list = TYRANO.kag.tmp.memocho.log.ruby_list;
			let last_log = TYRANO.kag.variable.tf.system.backlog.pop(); //最後のログ
			last_log = $('<div>').append(last_log);
			let txt = last_log.html();
			Object.keys(ruby_list).forEach(function(key){
				let ruby_tag = "<ruby class='mc_ruby auto' data-ruby='" + ruby_list[key].ruby + "'>";
				if(last_log.text().indexOf(key) > -1){
					txt = txt.replace(new RegExp(key+"(?!(\'>|\">|</ruby>))","g"),ruby_tag + key + "</ruby>");
					//console.log("ログ1：",key,txt);
				}
			});
			last_log = $('<div>').append(txt).html();
			//console.log("ログ：",last_log);
			TYRANO.kag.variable.tf.system.backlog.push(last_log);
		}
	}


}());
