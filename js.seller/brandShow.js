$(function(){
	renderCity($('#deliverProvince'), $('#deliverCity'));
	$('#bgColor').bind('input propertychange', function(e){
		var jq = $(this), value = jq.val();

		if(value) {
			var newValue = value.replace(/[^0-9a-fA-F]/g, '');

			if(value !== newValue) {
				jq.val(newValue);
			}			
		}
	});
	CheckUtil.limitDigital($('input[name="serviceQqs"]'));
	
	initValidate();
	initSubmit();
	
	initUpload();	
});

function initValidate() {
	$('#frm').validate({
		onBlur : true,
		conditional : {		
			confirmBgColor : function() {
				return ($(this).val().length >= 3);
			}
		},
		description : {
			brandId : {
				required : '请选择品牌'
			},
			title : {
				required : '请填写专场名称',
				pattern : '请填写专场名称'
			},
			showBannerImg : {
				required : '请上传专场页Banner'
			},
			homeBannerImg : {
				required : '请上传首页Banner'
			},
			bgColor : {
				required : '请填写专场页背景色',
				conditional : '至少填写3位颜色值'
			},
			deliverProvince : {
				required : '请选择发货省份'
			},	
			deliverCity : {
				required : '请选择发货城市'
			}		
		}
	});
}

function initSubmit() {
	$('#frm').submit(function(e){
		if($('input[name="sRAId"]').filter(':checked').length == 0) {
			showErrMsg('sRAId_msg', '请选择专场退货地址');
			return false;
		}
	});
	
	$('input[name="sRAId"]').change(function(e){
		showErrMsg('sRAId_msg', '');
	});
	
	$('#frm').submit(function(e){
		if($('input[name="logisticsCompId"]').filter(':checked').length == 0) {
			showErrMsg('logisticsCompId_msg', '请选择快递公司');
			return false;
		}
	});
	
	$('input[name="logisticsCompId"]').change(function(e){
		showErrMsg('logisticsCompId_msg', '');
	});
	
	$('#frm').submit(function(e){
		var found = false;
		
		$('input[name="serviceQqs"]').each(function(){
			if($(this).val()) {
				found = true;
				return false;
			}
		});
		
		if(!found) {
			showErrMsg('serviceQqs_msg', '请至少填写一个客服QQ');
			return false;
		}
	});
	
	$('input[name="serviceQqs"]').change(function(e){
		showErrMsg('serviceQqs_msg', '');
	});
	
	$('#frm').submit(function(e){
		var found = false;
		
		$('input[name="serviceTels"]').each(function(){
			if($(this).val()) {
				found = true;
				return false;
			}
		});
		
		if(!found) {
			showErrMsg('serviceTels_msg', '请至少填写一个客服QQ');
			return false;
		}
	});
	
	$('input[name="serviceTels"]').change(function(e){
		showErrMsg('serviceTels_msg', '');
	});
}

function showErrMsg(msgId, msg) {
	$('#' + msgId).html(msg);
}

function initUpload() {
	uploadify('btnShowBannerImg', 'imgShowBannerImg', 'showBannerImg');	
	uploadify('btnHomeBannerImg', 'imgHomeBannerImg', 'homeBannerImg');		
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
				height :	26, 
				width  :	78,
				fileSizeLimit : '10MB',
				fileTypeDesc :	'jpeg files',
				fileTypeExts :	'*.jpg;*.jpeg;*.gif;*.png;*.bmp',
				overrideEvents : ['onUploadProgress', 'onSelect'],
				onFallback : function(){
					alert('上传组件依赖于flash，请安装flash插件后再试！');
				},
				onUploadStart : function(file) {
					
			    },
			    onUploadComplete : function(file) {
			    	
		        },
				onUploadSuccess : function(file, data, response) {
					if(response) {
						var d = $.parseJSON(data);
		
						$('#' + img).attr('src', imgGetUrl + '?rid=' + d.rid);
						$('#' + hidden).val(d.rid);
						$('#' + btn).parent().find('div.errTxt').html('');
					}
				},
				onUploadError : function(file, errorCode, errorMsg, errorString) {
					alert(errorString);
				}
			}		
			);			
}