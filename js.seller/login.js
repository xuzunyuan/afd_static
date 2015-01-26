/*! 
 * @Copyright:afd.com
 * @Author:xuzunyuan
 * @Depends: jquery、jquery.cookie.js、seller-cookie.js
 * 
 */

$(function() {
	if($("#msg").html()){
		$("#msg").show();
	} else {
		$("#msg").hide();
	}
	
	$('#changeone').click(function(e){
		e.preventDefault();
		
		$('#imgValidator').attr('src', 'validator?t=' + new Date().getTime());
	});
	
	// 提交校验
	$("#frm").submit(function(){		
		if(!validateLoginName()) {
			 $("#loginName").focus();
			 return false;
		}
		
		if(!validatePassword()) {
			$("#password").focus();
			return false;
		}
		
		if(!validateValidator()) {
			$("#validator").focus();
			return false;
		}
		
		$("#clientDt").val(new Date().getTime());
	});

	// 初始化登录名
	if(!$("#loginName").val()) {
		if($.seller && $.seller.loginName) {
			$("#loginName").val($.seller.loginName);
		}
	}		
	
	// 决定是否显示验证码
	var errCount = $.cookie('__c');

	if(errCount && errCount >= 3) {
		$('#divValidate').removeClass('hide');
	}
	
	// 设置焦点
	if(!$("#loginName").val()) {
		$("#loginName").focus();
	} else {
		$("#password").focus();
	}
});

function showMsg(msg) {
	$("#msg").html(msg).show();
}

/**
 * 验证用户名
 * @returns {Boolean}
 */
function validateLoginName() {
	var value = $("#loginName").val();
		
	if(!value) {
		showMsg("请填写会员名");
		return false;
	}
	
	if(!CheckUtil.checkLoginName(value)) {
		showMsg("不是合法的会员名");
		return false;
	}
	
	return true;
}

/**
 * 验证密码
 * @returns {Boolean}
 */
function validatePassword() {
	var value = $("#password").val();
	
	if(!value) {
		showMsg("请填写密码");
		return false;
	}
	
	if(value.length < 6 || value.length > 20) {
		showMsg("密码不匹配");
		return false;
	}
	
	return true;
}

/**
 * 验证验证码
 * @returns {Boolean}
 */
function validateValidator() {
	if($('#divValidate').hasClass('hide')) return true;
	
	var value = $("#validator").val();
	
	if(!value || value.length != 4) {
		showMsg("请填写4位验证码");
		return false;
	}
		
	return true;
}