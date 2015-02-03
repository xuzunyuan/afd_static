$(function(){
	publish = new publish();
});
	
function publish(){
	
	this.limitDigital = function(jq) {
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
	
	this.validateTitle = function(){
		var title = $('input[name=title]').val();
		if($.trim(title).length == 0 ){
			alert("请输入商品标题！");
			return;
		}else if(title.length > 20 ){
			alert("字数超长或有误，请填写20个字以内的标题！");
			return;
		}	
	};
	
	this.validateArtNo = function(obj){
		this.limitDigital($(obj));
	 	var artNo = $("input[name=artNo]").val();
		if($.trim(artNo).length == 0 ){
			alert("请输入货号！");
			return;
		}else if(artNo.length > 20 ){
			alert("字数超长或有误，请填写20个字以内的货号！");
			return;
		}
	};
	
	this.validateBrand = function(){
		brand = $('select[name=brand] :selected').val();
		if(brand < 0){
			alert("请选择品牌");
			return;
		}
	}

	this.valaidateAttr = function(){
		ref = true;
		var attrs = $('[name="attr"]');
		attrs.each(function(){
			var require = $(this).attr('require'),
			displayMode = $(this).attr('displayMode'),
			attrName = $(this).attr('attrName'),
			attrId = $(this).attr('attrId');

			if(require == 'false') return;
			if(displayMode =='1'){
				var attrValue = $('[name="attrValue"][attrId="' + attrId + '"]').val();
				if(!attrValue){
					alert("请选择属性");
					ref = false;
					return; 
				}
			}else{
				var chks = $('[name="attrValue2"][attrId="' + attrId + '"]').filter(":checked");
				if (chks.length == 0) {
					alert("请勾选属性");
					ref = false;
					return;
				}
			}
		});
		return ref; 
	};
	
	this.validateSpec = function(){
		ref = true;
		var specIds = $('ul[specId]');
		for(var i = 1; i <= specIds.length;i++){
			var specId = $('ul[var="'+i+'"]').attr('specId');
			var chks = $('[name="specValue"][skuSpecId="'+specId+'"]').filter(":checked");
			if (chks.length == 0) {
				alert("请勾选规格");
				ref = false;
				return ref;
			}else{
				ref = this.validateSkuSalePrice();
				ref = this.validateSkuMarketPrice();
				ref = this.validateSkuStockBalance();
			}
		}
		return ref ;
	};
	
	this.validateSkuSalePrice = function(obj){
		ref = true;
		this.limitDigital($(obj));
		var skuSalePrices = $('[name="skuSalePrice"]');
		skuSalePrices.each(function(){
			salePrice = $(this).val();
			if(salePrice == 0 || salePrice > 999998){
				alert("销售价格有误，请输入大于0且小于999999");
				ref = false;
			}
		});
		
		return ref;
	};
	
	this.validateSkuMarketPrice = function(obj){
		ref = true;
		this.limitDigital($(obj));
		var skuMarketPrices = $('[name="skuMarketPrice"]');
		skuMarketPrices.each(function(){
			marketPrice = $(this).val();
			if(marketPrice == 0 || marketPrice > 999998){
				alert("特卖价格有误，请输入大于0且小于999999");
				ref = false;
			}
		});
		return ref;
	};
	
	this.validateSkuStockBalance = function(obj){
		ref = true;
		this.limitDigital($(obj));
		var skuStockBalances = $('[name="skuStockBalance"]');
		skuStockBalances.each(function(){
			stockBalance = $(this).val();
			if(stockBalance == 0 || stockBalance > 999998){
				alert("商品数量有误，请输入大于0且小于999999");
				ref = false;
			}
		});
		return ref;
	};
	
	this.validateDetail = function(){
		ref = true;
		var detail = $('#detail').val();
		if(!!!detail){
			alert('商品描述必填');
			ref = false;
		}
		return ref;
	}
	
	this.checkFromData = function(){
		ref = true;
		var title = $('input[name=title]').val(), artNo = $('input[name=artNo]').val(),brand = $('select[name=brand] :selected').val(),detail = $('#detail').val();
		if(!!!title || !!! artNo || brand < 0 || !!!detail){
			this.validateTitle();
			this.validateArtNo();
			this.validateBrand();
			this.validateDetail();
			ref = false;
		}
		
		ref = this.valaidateAttr();
		ref = this.validateSpec();
		
		return ref;
	};
	
	
	this.modifyBc = function(){
		alert("modifyBc");
	};
	
	
	this.generateSku = function(obj){
		editSpec(obj);
		
		var checkedArray = $('input[name="specValue"]:checked');
		var selectedSpec = {},specNames = {};
		specNames.total = 0;
		
		for (var i = 0 ; i < checkedArray.length; i++) {
			var jq = $(checkedArray[i]),
			specName = jq.attr('skuSpecName'),
			specId = jq.attr('skuSpecId');
			specValueName = jq.siblings("label[name='specValueTxt']").text(),
			specValueId = jq.attr('specValueId');
			specOrder = jq.attr('specOrder');
			
			if(!selectedSpec[specId]){
				selectedSpec[specId] = {'skuSpecName' : specName,
    					'skuSpecId'	: specId,
    					'specOrder' : specOrder,
    					'values' : []};
			}
			selectedSpec[specId].values.push({'specValueId' : specValueId,
				'specValueName' : specValueName});
		}
		
		
		var selectedArr = [];
		for (var key in selectedSpec) {
			selectedArr.push(selectedSpec[key]);
		}
		 
		selectedArr.sort(function(a, b) {// TODO 排序
			return (parseInt(a['specOrder']) < parseInt(b['specOrder']) ? -1 : 1);
		});
		
		var table = $('#genSpec');
		
		// 记录原有sku数据
		var oldSkuSalePriceValue = [],
			oldSkuMarketPriceValue =[],
			oldSkuStockBalanceValue = [],
			oldSkuSpecIdValue = [],
			oldSkuSpecNameValue = [],
			oldSkuImgUrlValue = [];
		
		var oldSkuSalePrice = table.find('input[name="skuSalePrice"]'),
			oldSkuMarketPrice = table.find('input[name="skuMarketPrice"]'),
			oldSkuStockBalance = table.find('input[name="skuStockBalance"]'),
			oldSkuSpecId = table.find('input[name="skuSpecId"]'),
			oldSkuSpecName = table.find('input[name="skuSpecName"]'),
			oldSkuImgUrl = table.find('input[name="skuImgUrl"]');
		
		for (var i = 0; i < oldSkuSalePrice.length; i ++) {
			oldSkuSalePriceValue[i] = $(oldSkuSalePrice[i]).val();
			oldSkuMarketPriceValue[i] = $(oldSkuMarketPrice[i]).val();
			oldSkuStockBalanceValue[i] = $(oldSkuStockBalance[i]).val();
			oldSkuSpecIdValue[i] = $(oldSkuSpecId[i]).val();
			oldSkuSpecNameValue[i] =  $(oldSkuSpecName[i]).val();
			oldSkuImgUrlValue[i] = $(oldSkuImgUrl[i]).val();
		}
		
		generateSpec(selectedArr);
		
		// 恢复原有数据
		var newSkuSalePrice = table.find('input[name="skuSalePrice"]'),
			newSkuMarketPrice = table.find('input[name="skuMarketPrice"]'),
			newSkuStockBalance = table.find('input[name="skuStockBalance"]'),
			newSkuSpecId = table.find('input[name="skuSpecId"]'),
			newSkuImgUrl = table.find('input[name="skuImgUrl"]');
		
		for (var i = 0; i < newSkuSalePrice.length; i ++) {
			var specId = $(newSkuSpecId[i]).val();
			
			for (var j = 0; j < oldSkuSalePriceValue.length; j ++) {
				if (oldSkuSpecIdValue[j] == specId) {
					$(newSkuSalePrice[i]).val(oldSkuSalePriceValue[j]);
					$(newSkuMarketPrice[i]).val(oldSkuMarketPriceValue[j]);
					$(newSkuStockBalance[i]).val(oldSkuStockBalanceValue[j]);
					
					if (oldSkuImgUrlValue[j]) {
						var flg = $(newSkuImgUrl[i]).attr('flg');
						
						$('input[name="skuImgUrl"][flg="' + flg + '"]').val(oldSkuImgUrlValue[j]);
						$('input[name="uploadImg"][flg="' + flg + '"]').closest('li').children('.mod-upload').find('img').attr("src",oldSkuImgUrlValue[j]);
					}
					break;
				}
			}
		}
	};
	
	
	this.saveProduct = function(){
		if (!publish.checkFromData()) {
			return false;
		}
		
//		this.prepareData();
		
		$('#publishForm').submit();
	};
	
//	this.prepareData = function(){
//		var attrs = $('[name=attr]'), attrValueId = '', attrValueName = '';
//		
//		attrs.each(function() {
//			var displayMode = $(this).attr('displayMode'),
//			attrId = $(this).attr('attrId'),
//			attrName = $(this).attr('attrName');
//			
//			if(displayMode == 1){
//				var attrValue = $('[name="attrValue"][attrId="' + attrId + '"]').val();
////				if (!attrValue) { 
////					alert("请选择属性");
////					return ;
////				}
//				
//				
//				var arr = attrValue.split('|||');
//				if(arr[2] == true){ //含有子属性
//					var attrValue2 = $('[name="attrValue2"][attrValueId="' + arr[0] + '"]').val();
////					if (!attrValue2) return;
//					
//					var arr2 = attrValue2.split('|||');
//					
//					attrValueId = attrValueId + (attrValueId ? '|||' : '') + attrId + ':::' + arr[0] + '>>>' + arr2[0];
//					attrValueName = attrValueName + (attrValueName ? '|||' : '') + attrName + ':::' + arr[1] + '>>>' + arr2[1];
//					
//				}else{ 
//					attrValueId = attrValueId + (attrValueId ? '|||' : '') + attrId + ':::' + arr[0];
//					attrValueName = attrValueName + (attrValueName ? '|||' : '') + attrName + ':::' + arr[1];
//				}
//				
//			}else{
//				var chks = $('[name="attrValue"][attrId="' + attrId + '"]').filter(":checked");
////				if (chks.length == 0) {
////				alert("请选择属性");
////				return ;
////				}
//				if (chks.length == 0) return;
//				var chkValueId = '', chkValueName = '';
//				
//				chks.each(function() {
//					var tmpValueId = $(this).attr('attrValueId'), tmpValueName = $(this).attr('attrValueName');
//					
//					chkValueId = chkValueId + (chkValueId ? ",,," : '') + tmpValueId;
//					chkValueName = chkValueName + (chkValueName ? ",,," : '') + tmpValueName;
//				});
//				
//				attrValueId = attrValueId + (attrValueId ? '|||' : '') + attrId + ':::' + chkValueId;
//				attrValueName = attrValueName + (attrValueName ? '|||' : '') + attrName + ':::' + chkValueName;
//				
//			}
//			
//			$('#attrValueId').val(attrValueId);
//			$('#attrValueName').val(attrValueName);
//			
//		});
//		
////		var attrs = $("[name=attrValue]  :selected").val();
////		alert(attrs);
//	};

}

function editSpec(obj){
	var label = $(obj).siblings('label');
	var specName = label.next();
	
	if(obj.checked){
		label.addClass("hide");
		specName.addClass("show-iblock");
		specName.val(label.text());
	}else{
		label.removeClass('hide');
		specName.removeClass('show-iblock');
	}
}

function generateSpec(selectedArr){
	var table = $('#genSpec');
	table.hide();
	table.prev().hide();
	var skuImgDiv = $('#skuImgDiv');
	skuImgDiv.hide();
	table.html('');
	
	var selectedSpectLength = selectedArr.length;      		
	if (selectedSpectLength < $('ul[specId]').length) {  
		table.html('');
		return;
	}
	
	var thead = "<table class='table table-line'>" +
			"<colgroup><col width='100' />" +
			"<col width='100' />" +
			"<col width='100' />";
	
	$(selectedArr).each(function() {
		thead += "<col width='100' />";
	});
	
	thead += "</colgroup><thead><tr>" ;
	
	$(selectedArr).each(function() {
		thead += "<th>" + this.skuSpecName + "</th>";
	});
	thead += "<th>单价</th>" +
			"<th>特卖价</th>" +
			"<th>数量</th>" +
			"</tr></thead>" +
			"<tbody>";

	table.append(thead);
	var rows = recurse(selectedArr, 0).html;
	
	$(rows).each(function() {
		table.find('tbody').append(this);
	});
	
	table.prev().show();
	table.show();
	skuImgDiv.show();
	
}


function recurse(arr, i){
	var item = arr[i], html = [], specValues = [];
	var ul = $('#skuImg');
	ul.html('');
	
	if (i == (arr.length - 1)) {
		for (var j = 0; j < item.values.length; j++) {
			specValues[j] = {'skuSpecId' :  item.skuSpecId + ':::' + item.values[j].specValueId,
					'skuSpecName' : item.skuSpecName + ':::' + item.values[j].specValueName};
			
			html[j] = "<td>"+item.values[j].specValueName+"</td>";
			if(i == 0){
				html[j] = "<tr> "+ html[j] +
						"<td><input type='text' class='txt lg w-sm' name='skuSalePrice' value='' onkeyup='publish.validateSkuSalePrice(this);' /></td>" +
						"<td><input type='text' class='txt lg w-sm' name='skuMarketPrice' value='' onkeyup='publish.validateSkuMarketPrice(this);' /></td>" +
						"<td><input type='text' class='txt lg ' name='skuStockBalance' value='' onkeyup='publish.validateSkuStockBalance(this);' /></td>" +
		         		"<td><input type='hidden' name='skuSpecId' value='" + specValues[j].skuSpecId + "'>" +
		         		"<input type='hidden' name='skuSpecName' value='" + specValues[j].skuSpecName + "'>" +
		         		"<input type='hidden' name='skuImgUrl' flg='" + item.values[j].specValueId + "' value='' >" +
		         		"</td></tr>";
				
				var specValueName = item.values[j].specValueName;
				if (specValueName != null && specValueName != "") {
					ul.append("<li><div class='mod-upload'><img src='${ctx }/static/img/upload_img.jpg' alt='' /></div>" +
							"<p>"+item.skuSpecName+"："+specValueName+"</p>" +
							"<div class='btnWrap'>" +
							"<input type='button' name='uploadImg' onclick='uploadSkuImg(this);' value='上传图片' flg='" + item.values[j].specValueId + "' class='btn btn-def' /></div></li>");
				}
			}
		}
	}else{
		var next = recurse(arr, i + 1);
		var count = next.html.length;
		for (var j = 0; j < item.values.length; j++) {
			for (var k = 0; k < count; k++) {
				var row = "<tr><td>"+item.values[j].specValueName+"</td>" + next.html[k];
				specValues[j * count + k] = 
						{'skuSpecId' :  item.skuSpecId + ':::' + item.values[j].specValueId + '|||' + next.specValues[k].skuSpecId,
						'skuSpecName' : item.skuSpecName + ':::' + item.values[j].specValueName + '|||' + next.specValues[k].skuSpecName};
				
				if (i == 0) {
					row	+= "<td><input type='text' class='txt lg w-sm' name='skuSalePrice' value='' onkeyup='publish.validateSkuSalePrice(this);' /></td>" +
							"<td><input type='text' class='txt lg w-sm' name='skuMarketPrice' value='' onkeyup='publish.validateSkuMarketPrice(this);' /></td>" +
							"<td><input type='text' class='txt lg ' name='skuStockBalance' value='' onkeyup='publish.validateSkuStockBalance(this);' /></td>" +
			         		"<td><input type='hidden' name='skuSpecId' value='" + specValues[j * count + k].skuSpecId + "'>" +
			         		"<input type='hidden' name='skuSpecName' value='" + specValues[j * count + k].skuSpecName + "'>" +	
			         		"<input type='hidden' name='skuImgUrl' flg='" + item.values[j].specValueId + "' value=''>" +
							"</td></tr>";
				}
				html[j * count + k] = row;	
			}
			
			var specValueName = item.values[j].specValueName;
			if (specValueName != null && specValueName != "") {
				ul.append("<li><div class='mod-upload'><img src='${ctx }/static/img/upload_img.jpg' alt='' /></div>" +
						"<p>"+item.skuSpecName+"："+specValueName+"</p>" +
						"<div class='btnWrap'>" +
						"<input type='button' name='uploadImg' onclick='uploadSkuImg(this);' value='设为主图' flg='" + item.values[j].specValueId + "' class='btn btn-def' /></div></li>");
			}
		}
	}
	return {'html' : html, 'specValues' : specValues};
}

KindEditor.ready(function(K) {
		K.create('textarea[name="detail"]', {
		uploadJson : '../image/saveImg',
		allowFileManager : false,
		allowPreviewEmoticons: false,
	    urlType:'domain',
		items : ['source', '|', 'undo', 'redo', '|', 'preview', 'template', '|', 
				 'justifyleft', 'justifycenter', 'justifyright','justifyfull', 
				 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 
	             'clearhtml', 'quickformat', '|', 'fullscreen', '|', 'formatblock', 
	             'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 
	             'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', 
	             '|', 'image', 'table', 'hr', 'emoticons', 'map',  'pagebreak', 'link', 'unlink'
	            ],
		afterCreate : function() {
			var self = this;
			K.ctrl(document, 13, function() {
				self.sync();
				document.forms['frm'].submit();
			});
			K.ctrl(self.edit.doc, 13, function() {
				self.sync();
				document.forms['frm'].submit();
			});
		},
		// 失去焦点同步数据
		afterBlur:function() {
			this.sync();
		},
		afterChange:function() {
			this.sync();
			$("#detail_warn").html("");
	//		checkLength($("#detail"),'detail_warn', 40000);
		},
		// 图片地址
	    afterUpload : function(url) {
	    }
	});
});


function skuImgClick() {
	var jq = $(this);
	new AjaxUpload(jq, {
		action: '../image/saveImg',
		filename: 'filename',
		autoSubmit: true,
		multiple: true,
      
		onComplete: function(file, response) {
			response = eval("("+response+")");
			if (!!response.url) {
				jq.parent().find('img').attr("src",response.url);
				var flg = jq.attr('flg');

				if (flg) {
					$('input[name="skuImgUrl"][flg="' + flg + '"]').val(splitString(response.url));
				}
			} else {
				alert(response.message);
				return;
			}
		}
	});
}

function uploadSkuImg(jq) {
	new AjaxUpload(jq, {
		action: '../image/saveImg',
		filename: 'filename',
		autoSubmit: true,
		multiple: true,
		onComplete: function(file, response) {
			response = eval("("+response+")");
			if (!!response.url) {
				$(jq).closest('li').children('.mod-upload').find('img').attr("src",response.url);
				var flg = $(jq).attr('flg');
				if (flg) {
					$('input[name="skuImgUrl"][flg="' + flg + '"]').val(response.url);
				}
			} else {
				alert(response.message);
				return;
			}
		}
	});
}

//function strLenCalc(obj, checklen, maxlen) {
//	var v = obj.val(), maxlen = !maxlen ? 100 : maxlen, curlen = maxlen, len = v.length;
//	for (var i = 0; i < v.length; i++) {
//		if (v.charCodeAt(i) < 0 || v.charCodeAt(i) > 255) {
//			curlen -= 1;
//		}
//	}
//	
//	if (curlen >= len) {
//		$("#" + checklen).html("还可输入 <strong>" + Math.floor((curlen - len) / 2)
//						+ "</strong>个字").css('color', '');
//	} else {
//		$("#" + checklen).html("还可输入 <strong>0</strong>个字").css('color', ''); 
//		obj.val(v.substring(0, len-Math.floor((len - curlen) / 2)));
//	}
//}
