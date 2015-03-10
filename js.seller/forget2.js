var count = 120;

$(function(){
	var mobile = $('#mobile').val();

	$('#divMobile').html(CheckUtil.encryptMobile(mobile));	
	$('#btnSms').click(function(e) {
		e.preventDefault();
		
		if($(this).hasClass('disabled')) return;
		
		$.ajax({url:'../ajax/forgetPassword/sendValidator?mobile=' + mobile, context:this, dataType:'json',
			success : function(data) {
				if(data) {
					$(this).addClass('disabled').html('重新获取(120)');;	
					$('#btnSms_msg').removeClass('errTxt')
						.html('验证码已发出，请注意查收短信，如果没有收到，您可以在<b>120</b>秒后重新获取短信验证码')
						.show();
					
					count = 120;
					setTimeout(fn, 1000);
					
				}  else {
					$('#btnSms_msg').removeClass('hint')
						.addClass('errTxt')
						.html('系统繁忙，请稍后再试')
						.show();
				}
			},
			error : function() {
				$('#btnSms_msg')
					.addClass('errTxt')
					.html('系统繁忙，请稍后再试')
					.show();
			}});	
	});
	
	CheckUtil.limitDigital($('#sms'));
	
	$('#sms').blur(checkSms);
	$('#sms').focus(function(e) {
		$('#sms_msg').hide();
	});
	
	$('#frm').submit(function(e){
		if(!checkSms()) return false;
	});
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

function checkSms() {
	var jq = $('#sms');	
	if(jq.attr('passed')) return true;
		
	var value = jq.val();	
	if(!value || value.length != 6) {
		$('#sms_msg').html('请输入6位短信验证码！');
		$('#sms_msg').show();
		return false;
	}		
		
	var passed = false;
	$.ajax({url:'../ajax/forgetPassword/checkValidator?mobile=' + $('#mobile').val() + '&validator=' + value, context:jq[0], dataType:'json', async:false,
		success : function(data) {
			if(data) {
				passed = true;				
				
			}  else {				
				$('#sms_msg').html('验证码不正确或已失效！');
				$('#sms_msg').show();
			}
		},
		error : function() {
			$('#sms_msg').html('系统繁忙，请稍后再试！');
			$('#sms_msg').show();
		}});	
	
	if(!passed) return false;
	
	jq.attr('passed', true);
	return true;
}

