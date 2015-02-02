$(function(){
	$('#frm').find('input["dblength"],textarea["dblength"]').each(function(){
		var jq = $(this);
		CheckUtil.limitDbLength(jq, jq.attr('dblength'));
	});
	CheckUtil.limitDigital($('#registerCapital'));
	initValidate();
	initSubmit();
	
	//initUpload();	
});

function initValidate() {
	$('#frm').validate({
		onBlur : true,
		eachInvalidField : function() {
			location.hash = '#' + $(this).attr('data-describedby');		
		},
		conditional : {
			confirmTel : function() {
				return ($('#telArea').val().length >= 3 && $('#tel').val().length >= 7);
			},
			confirmTaxType : function() {
				return $('input[name="taxType"]:checked').length > 0;
			},
			confirmOtherMobile : function() {
				return (!$(this).val() || CheckUtil.checkMobile((this).val()));
			},
			confirmEmail : function() {
				return CheckUtil.checkEmail($(this).val());
			},
			confirmTaxNo : function() {
				return (CheckUtil.chnLength($(this).val()) < 30);
			}
		},
		description : {
			coName : {
				required : '请输入公司名称',
				pattern : '请输入公司名称'
			},
			coBln : {
				required : '请输入营业执照注册号'
			},
			lpName : {
				required : '请输入法人姓名'
			},
			registerCapital : {
				required : '请输入注册资本'
			},
			bizScope : {
				required : '请输入经营范围'
			},
			tel : {
				conditional : '请正确填写您的公司电话,如：010-52369956'
			},
			orgCode : {
				required : '请输入组织机构代码',
				pattern : '组织机构代码可由英文、数字组成'
			},
			orgCodeUrl : {
				required : '请上传组织机构代码证'
			},
			taxNo : {
				required : '请输入纳税人识别号',
				conditional : "纳税人识别号不能超过30个字符"
			},
			taxType : {
				conditional : '请选择一项类型'
			},
			taxUrl : {
				required : '请上传税务登记证'
			},
			bankAcctName : {
				required : '请输入银行开户名'
			},
			bankAcctNo : {
				required : '请输入公司银行账号',
				pattern : '输入错误，银行账号可由英文、数字组成'
			},
			bankUrl : {
				required : '请上传银行开户许可证'
			},						
			otherMobile : {
				conditional : '请填写正确的手机号'
			},
			email : {
				required : '请输入电子邮箱',
				conditional : '请输入正确的电子邮箱'
			}				
		}
	});
}

function initSubmit() {
	$('#frm').submit(function(e){
		var startDt = $('#sBtStartDate').val();
		
		if(!startDt) {
			showErrMsg('btDate_msg', '请选择营业期限开始日期');
			return false;
		}
		
		var endDt = $('#sBtEndDate').val();
		if(endDate && endDate <= startDt) {
			showErrMsg('btDate_msg', '营业期限截止日期必须大于开始日期');
			return false;
		}
	});	
	
	$('#sBtStartDate,#sBtEndDate').focus(function(e){
		$(e.target).parent().siblings('div.errTxt').html('');
	});
}

function showErrMsg(msgId, msg) {
	$('#' + msgId).html(msg);
	location.hash = '#' + msgId;
}

function initUpload() {
	$('#uploadBtImg').uploadify(
		{
			auto	: true,
			multi	: false,
			preventCaching : false,				
			swf	:	ctx + '/uploadify/uploadify.swf',
			uploader : imgUploadUrl,
			buttonText : '上 传',
			height :	20, 
			width  :	50,
			fileSizeLimit : '5MB',
			fileTypeDesc :	'jpeg files',
			fileTypeExts :	'*.jpg;*.jpeg;*.gif;*.png;*.bmp',
			overrideEvents : ['onUploadProgress', 'onSelect'],
			onFallback : function(){
				alert('上传组件依赖于flash，请安装flash插件后再试！');
			},
			onUploadStart : function(file) {
				$('#imgBtImg').parent().append('<div class="loadMask"/>');
		    },
		    onUploadComplete : function(file) {
		    	$('#imgBtImg').parent().find('div.loadMask').remove();
	        },
			onUploadSuccess : function(file, data, response) {
				if(response) {
					var d = $.parseJSON(data);
	
					$('#imgBtImg').attr('src', imgGetUrl + '?rid=' + d.rid);
					$('#btImg').val(d.rid);
				}
			},
			onUploadError : function(file, errorCode, errorMsg, errorString) {
				alert(errorString);
			}
		}		
		);			
}

