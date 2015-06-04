$(function(){
	initValidate();
	initUpload();	
	
});
function initValidate() {
     $('#receiptForm').validate({
            valid:function() { saveReceipt(); },
		onBlur : true,
            sendForm : false,
		description : {
			coName : {
				required : '请填写公司名称'
			},
			taxNo : {
				required : '请填写公司税号'
			},
			registerAddr : {
				required : '请填写公司地址'
			},
			telNo : {
				required : '请填写公司电话',
				pattern : '请正确填写电话号码'
			},
			telArea:{
				required : '请填写公司电话区号',
				pattern : '请正确填写电话区号'
			},	
			telExt:{
				pattern : '请正确填写电话分机号'
			},	
			qualiUrl :{
				required : '请上传一般纳税人资质证明'
			},
			taxImg:{
				required : '请上传税务登记证'
			},
			bankAcctName$ : {
				required : '请填写开户银行'
			},
			bankAcctNo : {
				required : '请填写银行账号'
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
			}				
		}
	});
}

function saveReceipt() {
	
	$.ajax({
		url : "/helper/saveReceipt",
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
