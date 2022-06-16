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
			let flag = ""; //フラグ
			let target_layer = value.target.className; //親レイヤ
			let text = value.target.innerText; //テキスト
			//ルビ要素チェック
			if(value.target.className == "current_span"){
				flag = "current_span";
				target_layer = value.target.parentNode.parentNode.parentNode.className;
				//target_layer = value.target.parentNode.parentNode.parentNode;
				if(TYRANO.kag.tmp.memocho.log.ruby_str) text = ""; //ルビがある時はスルー
				else if(value.addedNodes) text = value.addedNodes[value.addedNodes.length-1].innerText || "";
			}else if(value.target.classList[0] == "chara_name_area"){
				flag = "chara_name_area";
				target_layer = value.target.parentNode.className;
				//target_layer = value.target.parentNode;
			}else if(value.target.classList[0] == "layer" && value.addedNodes[0]){
				if(value.addedNodes[0].nodeName == "P") {
					flag = "ptext";
				}else if(value.target.classList[1] == "layer_free"){
					flag = "free";
				}
			}else if(value.target.nodeName == "P" && value.target.parentNode !== null){
				target_layer = value.target.parentNode.className;
				if(value.target.parentNode.className.indexOf('message') > -1){
					flag = "vertical";
				}
			}
			console.log(flag,'/',target_layer,'/',text);

			if(flag){
				target_layer = $("." + target_layer.replace(/ /g, "."));
				//console.log(flag,target_layer,text);
				Object.keys(ruby_list).forEach(function(key){
					if(text.indexOf(key) > -1){
						let ruby_tag = "<ruby class='mc_ruby auto' data-ruby='" + ruby_list[key].ruby + "'>";
						let class_name = "";
						//const ruby = ruby_list[key].ruby; //ふりがな
						//ログ
						if(TYRANO.kag.variable.tf.system.backlog.length > 0){
							let last_log = TYRANO.kag.variable.tf.system.backlog.pop(); //最後のログ
							last_log = last_log.replace(new RegExp(key+"(?!('>|</ruby>))","g"),ruby_tag + key + "</ruby>"); //ログ置換
							TYRANO.kag.variable.tf.system.backlog.push(last_log);
						}

						switch (flag){

							case 'current_span':
							class_name = target_layer.children('p').attr('class');
							let pos = " data-pos='" + ruby_list[key].pos + "'";
							if(class_name) pos += " style='left:0;top:" + ruby_list[key].pos + ";'";
							else pos += " style='left:" + ruby_list[key].pos + ";top:0;'";
							//const pos = " data-pos='" + ruby_list[key]["pos"] + "' style='left:" + ruby_list[key]["pos"] + ";top:" + ruby_list[key]["pos"] + ";'";
							ruby_tag = "<ruby class='mc_ruby auto'" + pos + " data-ruby='" + ruby_list[key].ruby + "'></ruby>";
							const p = new RegExp(key,"g");
							let result;
							while (result = p.exec(text)) {
								let taget_span = $('.current_span').children('span:last').children('span').eq(result.index);
								if(taget_span.text() == key.slice(0,1)){
									target_layer.find('.current_span').children('span:last').children('span').eq(result.index).append(ruby_tag);
								}
							}
							break;

							case 'chara_name_area':
							target_layer.find('.chara_name_area').addClass('mc_ruby auto').attr('data-ruby',ruby_list[key].ruby).attr('data-name',key);
							break;

							case 'ptext':
							let txt = target_layer.children('p').html();
							target_layer.children('p').html(txt.replace(new RegExp(key+"(?!('>|</ruby>))","g"),ruby_tag + key + "</ruby>")); //ログ置換
							break;

							case 'glink':
							$('.glink_button').each(function() {
								let txt = $(this).html();
								$(this).html(txt.replace(new RegExp(key+"(?!('>|</ruby>))","g"),ruby_tag + key + "</ruby>")); //ログ置換
							});
							break;

							case 'free':
							$('.layer_free').children().each(function(){
								let txt = $(this).html();
								$(this).html(txt.replace(new RegExp(key+"(?!('>|</ruby>))","g"),ruby_tag + key + "</ruby>")); //ログ置換
							});
							break;

							case 'vertical': //メッセージの縦横切り替え用
							class_name = target_layer.children('p').attr('class');
							if(class_name){
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

						}

					}else{
						if(flag == "chara_name_area"){
							const chara_name = target_layer.find('.chara_name_area').text();
							const ruby_name = target_layer.find('.chara_name_area').attr('data-name');
							if(chara_name != ruby_name) $('.chara_name_area').attr('data-ruby','');
						}
					}

				}); //END ruby_list.forEach
			} //END

		});
	});

	//監視対象レイヤー
	//const num = parseInt(TYRANO.kag.config.numMessageLayers);
	//let layer = [];
	//layer.push(document.getElementById('tyrano_base'));
	//for(let i=0; i< num ; i++) {
	//	layer.push(document.getElementsByClassName('message'+i+'_fore')[0]);
	//}
	//const selector = document.body;
	const selector = document.getElementById('tyrano_base');
	//const selector = document.getElementById('root_layer_system');
	//const selector = document.getElementsByClassName('message0_fore')[0];
	//for(const selector of layer){
		observer.observe(selector,{
			childList: true,  // 子要素が登録されたら
			//characterData: true,
			subtree: true,    // 子孫も含める
		});
	//}


	const ruby_list = {
		"誰": "だれ",
		"名前": "なまえ",
		"私": "わたし",
		"簡単": "かんたん",
		"機能": "きのう",
		"あかね": "アカネ",
		"Tyranoscript": "ティラノスクリプト",
		"興味": "きょうみ"
	};
	if(TYRANO.kag.stat.mp.ruby_list) ruby_list = TYRANO.kag.embScript(TYRANO.kag.stat.mp.ruby_list);

	//文字数で表示位置調整
	const ruby_newlist = function(ruby_list) {
		TYRANO.kag.tmp.memocho.log.ruby_list = {};
		Object.keys(ruby_list).forEach(function(key){
		//ruby_list.forEach(function(key){
			let pos = ((key.length * 0.5) -1);
			if(key.match(/^[A-Za-z0-9]*$/)) pos = pos * 0.5; //半角
			pos = pos + "em";
			//if(key[2]) pos = key[2];
			TYRANO.kag.tmp.memocho.log.ruby_list[key] = {
				ruby: ruby_list[key],
				pos: pos
			};
		});
		console.log(TYRANO.kag.tmp.memocho.log.ruby_list);
	};

	ruby_newlist(ruby_list);



}());
