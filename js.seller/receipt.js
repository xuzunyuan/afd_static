$(function(){
	initValidate();
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
			taxNo : {
				required : '请填写公司税号'
			},
			registerAddr : {
				required : '请填写公司地址'
			},
			bankAcctName : {
				required : '请填写开户银行'
			},
			bankAcctNo : {
				required : '请填写银行账号'
			},
			btImg : {
				required : '请上传营业执照副本扫描件'
			},
			orgCodeImg : {
				required : '请上传组织机构代码电子版'
			},
			taxImg : {
				required : '请上传税务登记证电子版'
			},
			imgQualiUrl : {
				required : '请上传一般纳税人资质证明'
			},
			rName : {
				required : '请填写收件人姓名'
			},
			rMobile : {
				required : '请填写收件人手机号码',
				pattern : '请正确填写收件人手机号码' 
			},			
			rAddress : {
				required : '请填写收件地址'
			},
			bizManEmail : {
				required : '请填写电子邮箱',
				conditional : '请填写正确的电子邮箱'
			}				
		}
	});
}

function saveReceipt() {
	
	$.ajax({
		url : "../helper/saveReceipt",
		data : $('#receiptForm').serialize(),
		type : "post",
		cache : false,
		async : false,
		success : function(data) {
			if (data > 0) {
				popWindown("操作成功","submit:开票信息修改成功！","","1");
			}else {
				popWindown("操作失败","issue:网络连接异常，请联系网络管理员！","","1");
				return;
			}
		}
	});
}

function showErrMsg(msgId, msg) {
	$('#' + msgId).html(msg);
	location.hash = '#' + msgId;
}

function initUpload() {
	uploadify('btnTaxImg', 'imgTaxImg', 'taxImg');
	uploadify('btnQualiUrl', 'imgQualiUrl', 'qualiUrl');	
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
