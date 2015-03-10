$(function(){
	$('#password').focus(function(){
		$('#password_msg').find('span').html('');
	});
	
	$('#confirmPassword').focus(function(){
		$('#confirmPassword_msg').find('span').html('');
	});
	
	$('#password').blur(checkPassword);
	$('#confirmPassword').blur(checkConfirmPassword);
	
	$('#frm').submit(function(e){
		if(!checkPassword() || !checkConfirmPassword()) return false;
	});
	
	$('#password').focus();
});

function checkPassword() {
	var value = $('#password').val();
	
	if(!value) {
		$('#password_msg').find('span').html('请设置新密码！');
		
		return false;
	}
	
	if(!CheckUtil.checkPassword(value)) {		
		$('#password_msg').find('span').html('密码格式不正确！');
		
		return false;
	}
	
	$('#password_msg').find('span').html('');
	return true;
}

function checkConfirmPassword() {
	var value = $('#confirmPassword').val();
	
	if(!value) {
		$('#confirmPassword_msg').find('span').html('不可为空！');
		
		return false;
	}
	
	if(value !== $('#password').val()) {		
		$('#confirmPassword_msg').find('span').html('两次密码不一致！');
		
		return false;
	}
	
	$('#confirmPassword_msg').find('span').html('');
	return true;
}
