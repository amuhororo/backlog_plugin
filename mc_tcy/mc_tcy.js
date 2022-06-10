//【縦中横プラグイン】
// Ver.1.00 2022/6/10
// by hororo https://memocho.no-tenki.me/

(function(){

	const tag = {}; //タグ確認用…

	//[tcy]タグ
	const tcy = {
		log_join: "true",
		start : function(pm) {

			//nextOrder待ちtime
			let time = (TYRANO.kag.stat.font.effect) ? parseFloat(TYRANO.kag.stat.font.effect_speed)*800 : TYRANO.kag.config.chSpeed;
			time = (!TYRANO.kag.stat.is_click_text || !TYRANO.kag.stat.is_nowait || !TYRANO.kag.stat.is_skip) ? time : 0;

			//微妙だけどeffect対応
			let style = "";
			if (TYRANO.kag.stat.font.effect && TYRANO.kag.stat.font.effect != "fadeIn") style = " style='display:inline-block;opacity:0;'";
			//メッセージに追加
			$(".current_span").children('span:last-child').append("<tcy" + style + ">" + pm.text + "</tcy>");

			//ログ
			let last_log = TYRANO.kag.variable.tf.system.backlog.pop(); //ログの最後の配列切り取る
			last_log = last_log.replace(/(.*)<\/span>/,"$1<tcy>"+ pm.text + "</tcy></span>"); //最初のタグの次にねじ込む
			TYRANO.kag.pushBackLog(last_log,"join"); //ログに戻す

			//effect
			let index = parseFloat($(".current_span").find('tcy').length)-1;
			if(TYRANO.kag.stat.font.effect != ""){
				let anim = 't' + TYRANO.kag.stat.font.effect + ' ' + TYRANO.kag.stat.font.effect_speed + ' ease 0s 1 normal forwards';
				$(".current_span").find('tcy:eq('+index+')').css('animation', anim);
			}

			setTimeout(function(){
				$(".current_span").find('tcy:eq('+index+')').css({
					"opacity": 1,
					"visibility": "visible",
					"animation": ""
				});
				TYRANO.kag.ftag.nextOrder(); //次のタグへ
			},time);

			console.log("ちめ：",time);
		}
	}


	//ティラノのタグに登録
	TYRANO.kag.ftag.master_tag.tcy = object(tcy);
	TYRANO.kag.ftag.master_tag.tcy.kag = TYRANO.kag;

}());
