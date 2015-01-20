$(function(){
	var isLogin = validUser();
	alert(isLogin);
	
	function validUser(){
		var u = $.cookie("_u");
		var um = $.cookie("_um");
		var ut = $.cookie("_ut");
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
				$.cookie("_ut",newExpired+"|"+timeDiff,{expires:newExpiredDate,path:"/",domain:".afd.com"});
			}
		}
		return true;
	}
})