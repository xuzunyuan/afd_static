/*! 
 * @Copyright:afd.com
 * @Author:xuzunyuan
 * @Depends: jquery check-util
 * 
 */
var count = 120;	//计数器

$(function(){
	// 手机号码、验证码只允许输入数字
	CheckUtil.limitDigital($('#mobile, #validate'));
	
	// 手机号录入11位后自动校验
	$('#mobile').bind('input propertychange', function(e){
		var value = $(this).val();
		
		if(value && value.length == 11) $(this).trigger('blur');
	});
	
	// 重复密码不允许粘贴
	CheckUtil.forbiddenPaste($('#password2'));
	
	// 记录初始tip
	$('div.checkHint').each(
		function() {
			var jq = $(this), tip = jq.find('span').html();

			jq.attr('tip', tip);
		}
	);	
	
	$('#btnSms').click(function(e){
		e.preventDefault();
		
		if($(this).hasClass('disabled')) return;
		if(!$('#mobile').hasClass('success-gou')) return;
		
		$.ajax({url:'ajax/register/sendValidator?mobile=' + $('#mobile').val(), context:this, dataType:'json',
			success : function(data) {
				if(data) {
					$(this).addClass('disabled').html('重新获取(120)');;	
					$('#validate_msg').removeClass('errTxt')
						.find('span')
						.html('动态验证码已经发送到您的手机上，请在5分钟内完成注册！');
					
					count = 120;
					setTimeout(fn, 1000);
					
				}  else {
					showErrorTip($('#validate'), '系统繁忙，请稍后再试');
				}
			},
			error : function() {
				showErrorTip($('#validate'), '系统繁忙，请稍后再试');
			}});	
	});
	
	$('#chkAgreement').change(function(){
		if(!$(this).prop('checked')) {
			$('#agreement_msg').show();
		} else {
			$('#agreement_msg').hide();
		}
	});
	
	$('#frm').submit(function(){
		if(!$('#chkAgreement').prop('checked')) 			
			return false;
		
		return (checkLoginName() 
				&& checkLoginName()
				&& checkPassword() 
				&& checkPassword2()
				&& wrappedCheckMobile()
				&& checkValidate());
	});
	
	$('#loginName, #nickname, #password, #password2, #mobile, #validate').focus(focusHandler);
	$('#password').focus(
		function() {
			var jq = $('#password2'), msg = $('#password2_msg');
			
			jq.removeClass('success-gou').val('');
			msg.removeClass('error').addClass('hint');
			msg.find('span').html(msg.attr('tip'));
		}
	);
	
	$('#loginName').blur(checkLoginName);
	$('#nickname').blur(checkNickname);
	$('#password').blur(checkPassword);
	$('#password2').blur(checkPassword2);
	$('#mobile').blur(wrappedCheckMobile);	
	$('#validate').blur(checkValidate);	
	
	$('#loginName').focus();
});

function fn() {
	if(!$('#btnSms').hasClass('disabled')) return;
	
	if(count == 0) {
		$('#btnSms').removeClass('disabled').html('获取短信验证码');
		
	} else {
		count--;
		$('#btnSms').html('重新获取(' + count + ')');
		setTimeout(fn, 1000);
	}
}

function wrappedCheckMobile() {
	var ret = checkMobile();
	
	if(ret) {
		if($('#validate').hasClass('success-gou')) {
			if($('#mobile').val() === $('#validate').attr('passedMobile')) {
				// do nothing
			
			} else {
				$('#btnSms').removeClass('disabled').html('获取短信验证码');
				$('#validate').val('').removeClass('success-gou');
				$('#validate_msg').removeClass('errTxt').find('span').html('点击获取手机短信验证码， 不区分大小写');
			}
			
		} else {
			$('#btnSms').removeClass('disabled').html('获取短信验证码');			
		}
		
	} else {
		$('#btnSms').addClass('disabled').html('获取短信验证码');
		$('#validate').val('').removeClass('success-gou');
		$('#validate_msg').removeClass('errTxt').find('span').html('点击获取手机短信验证码， 不区分大小写');
	}
	
	return ret;
}

function checkMobile() {	
	var jq = $('#mobile');	
	if(jq.hasClass('success-gou')) return true;
	
	var value = jq.val();	
	if(!value) {
		showErrorTip(jq, '请输入手机号');
		return false;
	}	
	
	if(!CheckUtil.checkMobile(value)) {
		showErrorTip(jq, '手机号码有误，请重新输入');
		return false;
	}	
	
	jq.addClass('success-gou');
	return true;
}

function checkValidate() {
	var jq = $('#validate');	
	if(jq.hasClass('success-gou')) return true;
	
	if(!$('#mobile').hasClass('success-gou')) {
		showErrorTip(jq, '请输入正确手机号并获取验证码后再试');
		return false;
	}
	
	var value = jq.val();	
	if(!value) {
		showErrorTip(jq, '请输入验证码');
		return false;
	}		
	
	if(value.length != 6) {
		showErrorTip(jq, '请输入6位验证码');
		return false;
	}
	
	var passed = false;
	$.ajax({url:'ajax/register/checkValidator?mobile=' + $('#mobile').val() + '&validator=' + value, context:jq[0], dataType:'json', async:false,
		success : function(data) {
			if(data) {
				passed = true;				
				
			}  else {				
				showErrorTip($(this), '验证码不正确或已失效！');
			}
		},
		error : function() {
			showErrorTip($(this), '系统繁忙，请稍后再试');
		}});	
	
	if(!passed) return false;
	
	jq.attr('passedMobile',  $('#mobile').val());
	jq.addClass('success-gou');
	
	return true;
}

function checkLoginName() {
	var jq = $('#loginName');	
	if(jq.hasClass('success-gou')) return true;
	
	var value = jq.val();	
	if(!value) {
		showErrorTip(jq, '请输入用户名');
		return false;
	}
	
	if(!CheckUtil.checkLoginName(value)) {
		showErrorTip(jq, '用户名格式或长度不正确，请重新输入');
		return false;
	}
	
	var isExist = false;
	$.ajax({url:'ajax/existLoginName', type:'post', data:{'loginName':value}, 
		context:jq[0], dataType:'json', async:false,
		success : function(data) {
			if(data) {
				showErrorTip($(this), '该会员名已被使用，您可以：重新填写新会员名， 或使用该会员名<a href="login?loginName=' + encodeURIComponent(encodeURIComponent(value)) + '">登录</a>');
				isExist = true;
			}
		},
		error : function() {
			showErrorTip($(this), '系统繁忙，请稍后再试');
			isExist = true;
		}});	
	
	if(isExist) return false;
	
	jq.addClass('success-gou');
	return true;
}

function checkNickname() {
	var jq = $('#nickname');	
	if(jq.hasClass('success-gou')) return true;
	
	var value = jq.val();	
	if(!value) {
		showErrorTip(jq, '请填写昵称');
		return false;
	}
	
	if(!CheckUtil.checkNickname(value)) {
		showErrorTip(jq, '昵称格式或长度不正确，请重新填写');
		return false;
	}
	
	var isExist = false;
	$.ajax({url:'ajax/existNickname', type:'post', data:{'nickname':value}, 
		context:jq[0], dataType:'json', async:false,
		success : function(data) {
			if(data) {
				showErrorTip($(this), '该昵称已被使用，请更换其他昵称');
				isExist = true;
			}
		},
		error : function() {
			showErrorTip($(this), '系统繁忙，请稍后再试');
			isExist = true;
		}});	
	
	if(isExist) return false;
	
	jq.addClass('success-gou');
	return true;
}

function checkPassword() {
	var jq = $('#password');	
	if(jq.hasClass('success-gou')) return true;
	
	var value = jq.val();	
	if(!value) {
		showErrorTip(jq, '请设置登录密码');
		return false;
	}
		
	if(!CheckUtil.checkPassword(value)) {
		showErrorTip(jq, '密码位数不足或格式有误，请输入6-20位登录密码');
		return false;
	}
		
	jq.addClass('success-gou');
	return true;
}

function checkPassword2() {
	var jq = $('#password2');	
	if(jq.hasClass('success-gou2')) return true;
	
	var value = jq.val();
	if(!value) {
		showErrorTip(jq, '不可为空');
		return false;
	}
		
	if(value !== $('#password').val()) {
		showErrorTip(jq, '两个登录密码不一致，请重新输入');
		return false;
	}

	jq.addClass('success-gou');
	return true;
}

function focusHandler(event) {
	if(!event || !event.target) return;
	
	var jq = $(event.target), msg = $('#' + jq.attr('id') + '_msg');
	
	jq.removeClass('success-gou');
	msg.removeClass('errTxt');
	msg.find('span').html(msg.attr('tip'));
}

function showErrorTip(jq, tip) {
	var msg = $('#' + jq.attr('id') + '_msg');		
	
	msg.addClass('errTxt');
	if(tip) msg.find('span').html(tip);
}

