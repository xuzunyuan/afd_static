$(function(){
	CheckUtil.limitDbLength($('#categories'), 1000);
	initValidate();
	initSubmit();
	
	initUpload();	
	initSearch();
});

function initValidate() {
	$('#frm').validate({
		onBlur : true,
		description : {
			trademarkCert : {
				required : '请上传商标注册证/商标受理通知书'
			},
			authCert : {
				required : '请上传品牌授权书'
			},
			otherCert : {
				required : '请上传其他资质'
			},
			categories : {
				required : '请填写经营类目'
			}
		}
	});
}

function initSubmit() {
	$('#frm').submit(function(e){
		if($('#sellerBrandId').val()) return true;
		
		var jqBrandName = $('#brandName'),
			 keyword = jqBrandName.val(),
			 jqBrandId = $('#brandId');
		
		if(!keyword) {
			showErrMsg('brandId_msg', '请选择品牌');
			return false;
		}

		if(!jqBrandId.val() || jqBrandId.attr('brandName') != keyword) {
			var found = false;
			
			$.ajax({url: ctx +'/ajax/matchBrand', dataType:'json', async:false, data: {'keyword' : keyword},
				success : function(data) {
					if(data) {
						found = true;
						jqBrandId.val(data.brandId);
										
					} else {
						showErrMsg('brandId_msg', '请选择品牌');
					}
				},
				error : function(req, e) {
					showErrMsg('brandId_msg', '请选择品牌');
				}});
			
			if(!found) return false;
		}
		
		found = false;
		$.ajax({url: ctx +'/ajax/existBrand', dataType:'json', async:false, 
				data: {'sellerId' : $.seller.sellerId, 'brandId' : jqBrandId.val()},
			success : function(data) {
				if(data) {
					found = true;
					showErrMsg('brandId_msg', '您已经申请了该品牌，不能重复申请');									
				} 
			},
			error : function(req, e) {
				found = true;
				showErrMsg('brandId_msg', '系统繁忙，请稍后再试');
			}});
		
		if(found) return false;
		
		return true;
	});
	
	$('#frm').submit(function(e){
		if($(':checked[name="authType"]').length == 0) {
			showErrMsg('authType_msg', '请选择授权类型');
			return false;
		}
	});
	
	$('[name="authType"]').change(function(e){
		if($(':checked[name="authType"]').length > 0) {
			showErrMsg('authType_msg', '');
		}
	});
	
	$('#frm').submit(function(e){
		var startDt = $('#sAuthStartDate').val();
		
		if(!startDt) {
			showErrMsg('authDate_msg', '请选择授权有效期开始日期');
			return false;
		}
		
		var endDt = $('#sAuthEndDate').val();
		if(endDt && endDt <= startDt) {
			showErrMsg('authDate_msg', '授权有效期截止日期必须大于开始日期');
			return false;
		}
	});	
	
	$('#sAuthStartDate,#sAuthEndDate').focus(function(e){
		showErrMsg('authDate_msg', '');
	});
}

function showErrMsg(msgId, msg) {
	$('#' + msgId).html(msg);
	location.hash = '#' + msgId;
}

function initUpload() {
	uploadify('btnTrademarkCert', 'imgTrademarkCert', 'trademarkCert');	
	uploadify('btnAuthCert', 'imgAuthCert', 'authCert');	
	uploadify('btnOtherCert', 'imgOtherCert', 'otherCert');	
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

function initSearch(){
	$('#brandName').keydown(function(e){
		if(e.which == 13) {
			e.preventDefault();
			search();
		}
	});	
	
	$('#searchBtn').click(function(e){
		search();
	});
}

function search() {
	if($('#sellerBrandId').val()) return;
	
	var jqBrandName = $('#brandName'),
		 keyword = jqBrandName.val(),
		 jqResult = $('#searchResult'),
		 jqTip = $('#brandId_msg'),
		 jqBrandId = $('#brandId');
	
	if(!keyword) return;
	jqResult.empty();
	jqTip.html('');
	
	$.ajax({url: ctx +'/ajax/queryBrand', dataType:'json', async:false, data: {'keyword' : keyword},
		success : function(data) {
			if(data && data.length > 0) {
				$(data).each(function(){
					$('<li>' + this.showName + '</li>')
						.appendTo(jqResult)
						.attr('brandId', this.brandId)
						.attr('brandName', this.brandName ? this.brandName : this.brandEname)
						.click(function(e){
							jqBrandName.val($(this).attr('brandName'));
							jqBrandId.val($(this).attr('brandId'))
								.attr('brandName', $(this).attr('brandName'));							
						});
				})
								
			} else {
				jqTip.html('对不起，没找到匹配的品牌');
			}
		},
		error : function() {
			jqTip.html('系统繁忙，请稍后再试');
		}});	
	
}
