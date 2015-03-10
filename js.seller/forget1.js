$(function(){
	$('#changeone').click(function(e){
		e.preventDefault();
		
		$('#imgValidator').attr('src', '../validator?t=' + new Date().getTime());
	});
	
	$('#frm').submit(function(e){
		var loginName = $('#loginName').val(), validator = $('#validator').val();
		
		if(!loginName) {
			$('#msg').html('请填写用户名！');
			$('#msg').show();
			return false;
		}
		
		if(!CheckUtil.checkLoginName(loginName)) {
			$('#msg').html('请填写合法用户名！');
			$('#msg').show();
			return false;
		}
		
		if(!validator || validator.length != 4) {
			$('#msg').html('请填写4位验证码！');
			$('#msg').show();
			return false;
		}
		
		$('#msg').hide();
	});	
		
	$('#loginName').focus();
	
});
