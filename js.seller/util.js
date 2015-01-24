/*! 
 * @Copyright:afd.com
 * @Author:xuzunyuan
 * @Depends: jquery
 * 
 * 工具类
 */

CheckUtil = {};

/**
 * 计算字符串长度
 */
CheckUtil.length = function(value) {
	return value ? value.length : 0;
};

/**
 * 计算字符串长度，中文字符按2位累计
 */
CheckUtil.chnLength = function(value) {
	if(!value) return 0;
	
	value = value.replace(/[^\x00-\xff]/g, '11');
	return value.length;
};

/**
 * 限制控件只允许输入数字
 */
CheckUtil.limitDigital = function(jq) {
	jq.bind('input propertychange', function(e){
		var jq = $(this), value = jq.val();

		if(value) {
			var newValue = value.replace(/\D/g, '');

			if(value !== newValue) {
				jq.val(newValue);
			}			
		}
	});
};

/**
 * 限制控件输入字数，1个中文算两个
 */
CheckUtil.limitChnLength = function(jq, len) {
	jq.bind('input propertychange', function(e){
		var value = jq.val();
		if(!value) return;
		
		if(CheckUtil.chnLength(value) <= len) return;		
		var pos = Math.floor(len / 2), newLen = CheckUtil.chnLength(value.substr(0, pos));
		
		while(newLen <= len) {
			newLen += (value.charCodeAt(pos) > 255 ? 2 : 1);
			pos ++;
		}	
		
		var newValue = value.substr(0, --pos);
		jq.val(newValue);
	});
};

/**
 * 禁止控件执行粘贴操作
 */
CheckUtil.forbiddenPaste = function(jq) {
	jq.bind('paste', function(){return false;});
};

/**
 * 验证登录名规则，6-20个字符，由中文、英文、数字及“_”、“-”组成，一个汉字算两个字符
 */
CheckUtil.checkLoginName = function(value) {
	var length = CheckUtil.chnLength(value);
	if(length < 6 || length > 20) return false;
	
	return /^[\u4e00-\u9fa5a-zA-Z0-9_\-]+$/.test(value);
};

/**
 * 验证昵称规则，5-24个字符，可使用字母/数字或中文组合
 */
CheckUtil.checkNickname = function(value) {
	var length = CheckUtil.chnLength(value);
	if(length < 5 || length > 24) return false;
	
	return /^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(value);
};

/**
 * 验证密码规则，6-20个字符，英文加数字或符号组合密码，不能单独使用英文，数字或符号
 */
CheckUtil.checkPassword = function(value) {
	if(!value) return false;
	var length = value.length;
	
	if(length < 6 || length > 20) return false;	
	if(/[^A-Za-z0-9\@\!\#\$\%\^\&\*\.\~\(\)\+\-\_\=\[\]\{\}\:\;\'\"\|\<\>\,\.\?]/.test(value)) return false;
	if(/^[A-Za-z]+$/.test(value)) return false;
	if(/^[0-9]+$/.test(value)) return false;
	if(/^[\@\!\#\$\%\^\&\*\.\~\(\)\+\-\_\=\[\]\{\}\:\;\'\"\|\<\>\,\.\?]+$/.test(value)) return false;
		
	return true;
};

/**
 * 验证手机号规则
 */
CheckUtil.checkMobile = function(value) {
	if(!value) return false;
	
	return /^[1]\d{10}$/.test(value);
};

/**
 * 手机号码加密
 */
CheckUtil.encryptMobile = function(value) {
	return (value.substr(0, 3) + '*****' + value.substr(8));
};

/**
 * 邮编校验规则，6位数字
 */
CheckUtil.checkZipCode = function(value) {
	if(!value) return false;
	
	return /^\d{6}$/.test(value);
};

/**
 * 身份证规则校验
 */
CheckUtil.checkCertNo = function(value) {
	if(!value) return false;
	
	return /^[1-9]\d{14}(\d{2}[0-9xX])?$/.test(value);
};

/**
 * 郵箱规则校验
 */
CheckUtil.checkEmail = function(value) {
	if(!value) return false;
	
	return /^[a-zA-Z0-9_\.]+@[a-zA-Z0-9-]+[\.a-zA-Z]+$/.test(value);
};

