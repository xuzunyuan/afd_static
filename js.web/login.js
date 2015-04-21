$(function(){
	var isLogin = validUser();
	if(isLogin){
		$("#unLogin").addClass("hide");
		$("#login").removeClass("hide");
	}else{
		$("#unLogin").removeClass("hide");
		$("#login").addClass("hide");
	}
	
	$(document).on("click","#logout",function(){
		$.cookie("_um",null,{domain:".juyouli.com",path:"/",expires:0});
		$.cookie("_ut",null,{domain:".juyouli.com",path:"/",expires:0});
		location.href = "http://www.juyouli.com/login.action";
	});
	
});

function validUser(){
	var u = $.cookie("_u");
	var um = $.cookie("_um");
	var ut = $.cookie("_ut");
	
	if(!!u){
		var us = u.split("|");
		var userName = us[1];
		var nickName = us[2];
		if(!!nickName && nickName!="null"){
			$("#name").append(nickName);
		}else{
			$("#name").append(userName);
		}
	}
	
	if(!u||!um||!ut){
		return false;
	}
	
	var uts = ut.split("|");
	var expired = uts[0];
	var timeDiff = uts[1];
	var now = new Date();
	var serverTime = now.getTime() - timeDiff;
	if(serverTime > expired){
		return false;
	}else{
		var warnTime = expired - 15*60*1000;
		if(serverTime > warnTime){
			var newExpired = serverTime + 2*60*60*1000;
			var newExpiredDate = new Date();
			newExpiredDate.setTime(newExpired);
			$.cookie("_ut",newExpired+"|"+timeDiff,{expires:newExpiredDate,path:"/",domain:".juyouli.com"});
		}
	}
	return true;
}