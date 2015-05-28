$(function(){
	$('#frm').find('input[dblength],textarea[dblength]').each(function(){
		var jq = $(this);
		CheckUtil.limitDbLength(jq, jq.attr('dblength'));
	});
	CheckUtil.limitDigital($('#registerCapital, #bizManMobile, #telArea, #telNo, #telExt, #faxArea, #faxNo, #faxExt'));
	initValidate();
	initSubmit();
	
	initUpload();	
});

function initValidate() {
	$('#frm').validate({
		onBlur : true,
		conditional : {		
			confirmBizManEmail : function() {
				return CheckUtil.checkEmail($(this).val());
			}
		},
		description : {
			coName : {
				required : '请填写公司名称',
				pattern : '请填写公司名称'
			},
			coBln : {
				required : '请填写营业执照注册号'
			},
			lpName : {
				required : '请填写法人姓名'
			},
			registerCapital : {
				required : '请填写注册资本'
			},
			bizScope : {
				required : '请填写经营范围'
			},
			btImg : {
				required : '请上传营业执照副本扫描件'
			},
			orgCodeImg : {
				required : '请上传组织机构代码电子版'
			},
			taxImg : {
				required : '请上传税务登记电子版'
			},
			bankLicenseImg : {
				required : '请上传银行开户许可证电子版'
			},
			bizManName : {
				required : '请填写联系人姓名'
			},
			bizManMobile : {
				required : '请填写联系人手机号码',
				pattern : '请正确填写联系人手机号码' 
			},			
			bizManEmail : {
				required : '请填写电子邮箱',
				conditional : '请填写正确的电子邮箱'
			}				
		}
	});
}

function initSubmit() {
	$('#frm').submit(function(e){
		if(!$('#chkProtocol').prop('checked')) {
			$('#protocol_msg').html('请选择同意巨友利商家入驻条款');
			return false;
		}
	});
	
	$('#chkProtocol').change(function(e){
		if($(e.target).prop('checked')) {
			$('#protocol_msg').html('');
		} else {
			$('#protocol_msg').html('请选择同意巨友利商家入驻条款');
		}
	});
	
	$('#frm').submit(function(e){
		var startDt = $('#sBtStartDate').val();
		
		if(!startDt) {
			showErrMsg('btDate_msg', '请选择营业期限开始日期');
			return false;
		}
		
		var endDt = $('#sBtEndDate').val();
		if(endDt && endDt <= startDt) {
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
	uploadify('btnBtImg', 'imgBtImg', 'btImg');	
	uploadify('btnOrgCodeImg', 'imgOrgCodeImg', 'orgCodeImg');	
	uploadify('btnTaxImg', 'imgTaxImg', 'taxImg');	
	uploadify('btnBankLicenseImg', 'imgBankLicenseImg', 'bankLicenseImg');	
}

function uploadify(btn, img, hidden) {
	$('#' + btn).uploadify(
			{
				auto	: true,
				multi	: false,
				preventCaching : false,				
				swf	:	ctx + '/uploadify/uploadify.swf',
				uploader : imgUploadUrl,
				buttonText : '上 传',
				buttonClass : 'uploadBtn',
				height :	24, 
				width  :	54,
				fileSizeLimit : '1MB',
				fileTypeDesc :	'jpeg files',
				fileTypeExts :	'*.jpg;*.jpeg;*.gif;*.png;*.bmp',
				overrideEvents : ['onUploadProgress', 'onSelect'],
				onFallback : function(){
					alert('上传组件依赖于flash，请安装flash插件后再试！');
				},
				onUploadStart : function(file) {
					$('#' + img).parent().append('<div class="loadMask"/>');
			    },
			    onUploadComplete : function(file) {
			    	$('#' + img).parent().find('div.loadMask').remove();
		        },
				onUploadSuccess : function(file, data, response) {
					if(response) {
						var d = $.parseJSON(data);
		
						$('#' + img).attr('src', imgGetUrl + '?rid=' + d.rid);
						$('#' + hidden).val(d.rid);
						$('#' + btn).parent().siblings('div.errTxt').html('');
					}
				},
				onUploadError : function(file, errorCode, errorMsg, errorString) {
					alert(errorString);
				}
			}		
			);			
}
