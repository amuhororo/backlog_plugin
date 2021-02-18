/* 【バックログプラグイン Ver.3.03】2021/02/18					*/
/*	by hororo http://hororo.wp.xdomain.jp/118/			*/

//■[s]
tyrano.plugin.kag.tag.s.start = function() {
	//--- ◆ nowait処理 ----------------------------------------------------------
	this.kag.getMessageInnerLayer().find("span").css({'opacity':'1'});
	//--- ◆ end --------------------------------------------------------------------

	this.kag.stat.is_strong_stop = true;
	this.kag.layer.hideEventLayer();
};


//■[l]
tyrano.plugin.kag.tag.l.start = function() {
	var that = this;

	//--- ◆ nowait処理 ----------------------------------------------------------
	this.kag.getMessageInnerLayer().find("span").css({'opacity':'1'});
	//--- ◆ end --------------------------------------------------------------------

	this.kag.ftag.showNextImg();
	//クリックするまで、次へすすまないようにする
	if (this.kag.stat.is_skip == true) {
		//スキップ中の場合は、nextorder
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
				//ボイス再生中の場合は、オートで次に行かない。効果音再生終了後に進めるためのフラグを立てる
				if(that.kag.tmp.is_vo_play==true){
					that.kag.tmp.is_vo_play_wait = true;
				}else{
					that.kag.ftag.nextOrder();
				}
			}
		}, auto_speed);
	}
};
