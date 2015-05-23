$(function(){
	publish = new publish();
	$('#title').bind('input propertychange', function() {
		checkLength($(this), 'title_warn', 60);
	});
	
	if(brandId >0){
		$('#brand'+brandId).prop('selected', true);	
	}
	
	selectedAttr();
	selectedSkus();
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
	
	this.limitPrice = function(jq) {
		jq.bind('input propertychange', function(e){
			var jq = $(this), value = jq.val();
			var newValue = value.replace(/[^\d^\.]/g, ''); 
			if(value !== newValue) {
				jq.val(newValue);
			}	
		});
	};
	
	this.validateTitle = function(){
		var ret = false;
		var jq = $('input[name=title]');
		if($.trim(jq.val()).length == 0 ){
			location.hash = '#title';
			jq.parent().next().text("请填写商品标题！");
			return false;
		}else if(jq.val().length > 30 ){
			location.hash = '#title';
			jq.parent().next().text("字数超长或有误，请填写30个字以内的标题！");
			return false;
		}else{
			jq.parent().next().text("");
			ret = true;
		}	
		return ret;
	};
	
	this.validateSubtitle = function(){
		var ret = false;
		var jq = $('input[name=subtitle]');
		if($.trim(jq.val()).length > 100 ){
			location.hash = '#subtitle';
			jq.parent().next().text("商品卖点字数超长！");
			return false;
		}else{
			jq.parent().next().text("");
			ret =  true;
		}
		return ret;
	};
	
	this.validateArtNo = function(){
		var ret = false;
		var regArtNo = /^[a-zA-Z0-9]{12,16}$/;
	 	var jq = $("input[name=artNo]");
		if($.trim(jq.val()).length == 0 ){
			location.hash = '#artNo';
			jq.parent().next().text("请填写货号！");
			return false;
		}else if(!regArtNo.test(jq.val())){
			location.hash = '#artNo';
			jq.parent().next().text("输入有误，请重新填写货号！");
			return false;
		}else{
			jq.parent().next().text("");
			ret =  true;
		}
		return ret;
	};
	
	this.validateBrand = function(){
		var ret = false;
		jq = $('select[name=brand] :selected');
		if(jq.val() < 0){
			location.hash = '#brand';
			jq.parent().parent().next().text("请选择品牌！");
			return false;
		}else{
			$('#brandId').val(jq.val());
			$('#brandName').val(jq.text());
			jq.parent().parent().next().text("");
			ret = true;
		}
		return ret;
	}

	this.valaidateAttr = function(){
		ret = false;
		var jq = $('[name="attr"]');
		jq.each(function(){
			var require = $(this).attr('require'),
			displayMode = $(this).attr('displayMode'),
			attrName = $(this).attr('attrName'),
			attrId = $(this).attr('attrId');
			
			if(require == 'false') return;
			if(displayMode =='1'){
				var attrValue = $('[name="attrValue"][attrId="' + attrId + '"]').val();
				if(!!!attrValue){
					location.hash = '#attrValue';
					jq.prev().parent().next().text("请选择属性'" + attrName + "'");
					return false;
				}else{
					jq.prev().parent().next().text("");
					ret = true;
				}
			}else{
				var chks = $('[name="attrValue"][attrId="' + attrId + '"]').filter(":checked");
				if (chks.length == 0) {
					location.hash = '#attrValue';
					jq.prev().parent().next().text("请选择属性'" + attrName + "'");
					return false;
				}else{
					jq.prev().parent().next().text("");
					ret = true;
				}
			}
		});
		return ret; 
	};
	
	this.validateSpec = function(){
		ret = false;
		var jq = $('ul[specId]');
		for(var i = 1; i <= jq.length;i++){
			var specId = $('ul[var="'+i+'"]').attr('specId');
			var chks = $('[name="specValue"][skuSpecId="'+specId+'"]').filter(":checked");
			if (chks.length == 0) {
				location.hash = '#specValue';
				$("#spacErr").text("请选择规格！");
				return false;
			}else{
				$("#spacErr").text("");
				ret = true;
			}
		}
		return ret;
	};
	
	this.validateSkuSalePrice = function(){
		var regPrice = /^([1-9]+[0-9]*|[0])([\.][0-9]{1,2})?$/;	
		var skuSalePrices = $('[name="skuSalePrice"]');
		var ret = false;
		skuSalePrices.each(function(){
			salePrice = parseFloat($(this).val());
			marketPrice = parseFloat($(this).parent().next().children().val());
			if(!regPrice.test(salePrice)){
				location.hash = "#genSpec";
				$('#precErrMsg').text("单价输入有误，请输入大于0且小于999999！");
				return false;
			}else if(!!!salePrice){
				location.hash = "#genSpec";
				$('#precErrMsg').text("请输入单价！");
				return false;
			}else if(marketPrice > salePrice){
				location.hash = "#genSpec";
				$('#precErrMsg').text("特卖价应小于单价！");
				return false;
			}else if(salePrice == 0 || salePrice =='0.0' || salePrice =='0.00'){
				location.hash = "#genSpec";
				$('#precErrMsg').text("单价输入有误，请输入大于0且小于999999！");
				return false;
			}else{
				$('#precErrMsg').text("");
				ret = true;
			}
		});
		return ret;
	};
	
	this.validateSkuMarketPrice = function(){
		var regPrice = /^([1-9]+[0-9]*|[0])([\.][0-9]{1,2})?$/;	
		var skuMarketPrices = $('[name="skuMarketPrice"]');
		var ret = false;
		skuMarketPrices.each(function(){
			marketPrice = parseFloat($(this).val());
			salePrice = parseFloat($(this).parent().prev().children().val());
			
			if(!regPrice.test(marketPrice)){
				location.hash = "#genSpec";
				$('#precErrMsg').text("特卖价输入有误，请输入大于0且小于999999！");
				return false;
			}else if(!!!marketPrice){
				location.hash = "#genSpec";
				$('#precErrMsg').text("请输入特卖价！");
				return false;
			}else if(marketPrice > salePrice){
				location.hash = "#genSpec";
				$('#precErrMsg').text("特卖价应小于单价！");
				return false;
			}else if(marketPrice == 0 || marketPrice =='0.0' || marketPrice =='0.00'){
				location.hash = "#genSpec";
				$('#precErrMsg').text("特卖价输入有误，请输入大于0且小于999999！");
				return false;
			}else{
				$('#precErrMsg').text("");
				ret = true;
			}
		});
		return ret;
	};
	
	this.validateSkuStockBalance = function(){
		var regBalance = /^[1-9][\d]{0,4}$/;
		var ret = false;
		var skuStockBalances = $('[name="skuStockBalance"]');
		skuStockBalances.each(function(){
			stockBalance = $(this).val();
			if(!!!stockBalance){
				location.hash = "#genSpec";
				$('#precErrMsg').text("请填写数量！");
				return false;
			}if(!regBalance.test(stockBalance)){
				location.hash = "#genSpec";
				$('#precErrMsg').text("商品数量有误，请输入大于0且小于999999！");
				return false;
			}else{
				$('#precErrMsg').text("");
				ret = true;
			}
		});
		return ret;
	};
	
	this.validateSellerNo = function(){
		var regBSellerNo = /^[1-9][\d]{0,4}$/;
		ret = false;
		var sellerNos = $('[name="sellerNo"]');
		sellerNos.each(function(){
			sellerNo = $(this).val();
			if(!!!sellerNo){
				location.hash = "#genSpec";
				$('#precErrMsg').text("请填写商家编号！");
				return false;
			}if(!regBSellerNo.test(sellerNo)){
				location.hash = "#genSpec";
				$('#precErrMsg').text("商家编号输入错误，请输入大于0且小于999999！");
				return false;
			}else{
				$('#precErrMsg').text("");
				ret = true;
			}
		});
		return ret;
	};
	
	this.validateSkuImg = function(){
		var ret = false;
		var totalImgCount = $('#skuImg li').length;
		var jq = $('input[name="skuImgUrl"]');
		jq.each(function(){
			var flg = $(this).attr('flg');
			var imgUrl = $('input[name="skuImgUrl"][flg="' + flg + '"]').val();
			if(!!!imgUrl){
				location.hash = "#errSkuImg";
				$('#errSkuImg').text("请上传全部的sku图片");
				return false;
			}else{
				$('#errSkuImg').text("");	
				ret = true;
			}
		});
		return ret;
	};
	
	this.validateDetail = function(){
		ret = false;
		var jq = $('#detail');
		if(!!!jq.val()){
			location.hash = '#detail';
			jq.parent().parent().next().text("请填写商品描述！");
			return false;
		}else{
			jq.parent().parent().next().text("");
			ret = true;
		}
		return ret;
	}
	
	this.checkFromData = function(){
		ret = true;
		
		if(!this.validateTitle()){
			return false;
		}
		if(!this.validateSubtitle()){
			return false;
		}
		if(!this.validateArtNo()){
			return false;
		}
		if(!this.validateBrand()){
			return false;
		}
		if(!this.validateDetail()){
			return false;
		}
		if(!this.valaidateAttr()){
			return false;
		}
		if(!this.validateSpec()){
			return false;
		}
		if(!this.validateSkuImg()){
			return false;
		}
		if(!this.validateSkuSalePrice()){
			return false;
		}
		if(!this.validateSkuMarketPrice()){
			return false;
		}
		if(!this.validateSkuStockBalance()){
			return false;
		}
		if(!this.validateSellerNo()){
			return false;
		}		
		return ret;
	};

	
	this.modifyBc = function(pathId){
		if(!pathId) return;
		window.location.href = "../product/category?pathId="+pathId+"&m=2001";
	};
	
	this.generateSku = function(obj){
	//TODO 	editSpec(obj);
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
		
		selectedArr.sort(function(a, b) {
			return (parseInt(a['specOrder']) < parseInt(b['specOrder']) ? -1 : 1);
		});
		
		var table = $('#genSpec');
		
		// 记录原有sku数据
		var oldSkuSalePriceValue = [],
			oldSkuMarketPriceValue =[],
			oldSkuStockBalanceValue = [],
			oldSellerNoValue = [],
			oldSkuSpecIdValue = [],
			oldSkuSpecNameValue = [],
			oldSkuImgUrlValue = [];
		
		var oldSkuSalePrice = table.find('input[name="skuSalePrice"]'),
			oldSkuMarketPrice = table.find('input[name="skuMarketPrice"]'),
			oldSkuStockBalance = table.find('input[name="skuStockBalance"]'),
			oldSellerNo = table.find('input[name="sellerNo"]'),
			oldSkuSpecId = table.find('input[name="skuSpecId"]'),
			oldSkuSpecName = table.find('input[name="skuSpecName"]'),
			oldSkuImgUrl = table.find('input[name="skuImgUrl"]');
		
		for (var i = 0; i < oldSkuSalePrice.length; i ++) {
			oldSkuSalePriceValue[i] = $(oldSkuSalePrice[i]).val();
			oldSkuMarketPriceValue[i] = $(oldSkuMarketPrice[i]).val();
			oldSkuStockBalanceValue[i] = $(oldSkuStockBalance[i]).val();
			oldSellerNoValue[i] = $(oldSellerNo[i]).val();
			oldSkuSpecIdValue[i] = $(oldSkuSpecId[i]).val();
			oldSkuSpecNameValue[i] =  $(oldSkuSpecName[i]).val();
			oldSkuImgUrlValue[i] = $(oldSkuImgUrl[i]).val();
		}
		
		generateSpec(selectedArr);
		
		//校验
		table.find('[name="skuStockBalance"]').bind("blur", this.validateSkuStockBalance);
		
		// 恢复原有数据
		var newSkuSalePrice = table.find('input[name="skuSalePrice"]'),
			newSkuMarketPrice = table.find('input[name="skuMarketPrice"]'),
			newSkuStockBalance = table.find('input[name="skuStockBalance"]'),
			newSellerNo = table.find('input[name="sellerNo"]'),
			newSkuSpecId = table.find('input[name="skuSpecId"]'),
			newSkuImgUrl = table.find('input[name="skuImgUrl"]');
		
		for (var i = 0; i < newSkuSalePrice.length; i ++) {
			var specId = $(newSkuSpecId[i]).val();
			
			for (var j = 0; j < oldSkuSalePriceValue.length; j ++) {
				if (oldSkuSpecIdValue[j] == specId) {
					$(newSkuSalePrice[i]).val(oldSkuSalePriceValue[j]);
					$(newSkuMarketPrice[i]).val(oldSkuMarketPriceValue[j]);
					$(newSkuStockBalance[i]).val(oldSkuStockBalanceValue[j]);
					$(newSellerNo[i]).val(oldSellerNoValue[j]);
					
					if (oldSkuImgUrlValue[j]) {
						var flg = $(newSkuImgUrl[i]).attr('flg');
						$('input[name="skuImgUrl"][flg="' + flg + '"]').val(oldSkuImgUrlValue[j]);
						$('img[flg="' + flg + '"]').attr("src",imgGetUrl +"?rid="+ oldSkuImgUrlValue[j]+"&op=s0_w238_h238");
					}
					break;
				}
			}
		}
	};
	
	this.setDefaultImg = function(obj){
		ret = true;
		var jq = $(obj).closest('li').children('.mod-upload').find('img');
		flg = parseInt(jq.attr("flg"));
		imgUrl = $('input[name="skuImgUrl"][flg="' + flg + '"]').val();
		if(!!imgUrl){
			var img = $('input[name="imgUrl"]');
				img.val(imgUrl);
				img.attr('flg',flg);
			$('input[name="setImgBtn"]').show();
			$(obj).hide();
		}else{
			alert('请上传sku图片');
			ret = false;
		}
		
		return ret;
	};
	
	this.saveProduct = function(){
		if (!publish.checkFromData()) {
			return false;
		}else{
			prepareAttrData(); 
			
			$.ajax({
				url : "../product/save",
				data : $('#publishForm').serialize(),
				type : "post",
				cache : false,
				async : false,
				success : function(data) {
					if (data.success == 0) {
						popWindown("发布商品成功","publish:您可在<b>“在售商品管理”</b>中查看、修改商品","","1");
					}else if(data.success ==1){
						popWindown("修改商品成功","publish:您可在<b>“在售商品管理”</b>中查看、修改商品","","1");
					}else {
						popWindown("发布商品失败","publish:网络连接异常，请联系网络管理员！","","1");
						return;
					}
				}
			});
		}
	};
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
			"<colgroup><col width='' />" +
			"<col width='85' />" +
			"<col width='85' />" +
			"<col width='85' />";
	
	$(selectedArr).each(function() {
		thead += "<col width='85' />";
	});
	
	thead += "</colgroup><thead><tr>" ;
	
	$(selectedArr).each(function() {
		thead += "<th>" + this.skuSpecName + "</th>";
	});
	thead += "<th>单价</th>" +
			"<th>特卖价</th>" +
			"<th>数量</th>" +
			"<th rowspan='3'>商家编号</th>" +
			"</tr></thead>" +
			"<tbody>";

	table.append(thead);
	var rows = recurse(selectedArr, 0).html;
	$(rows).each(function() {
		table.find('tbody').append(this);
		table.find('tbody').parent().after('<div class="note errTxt" id="precErrMsg"></div>');
	});
	
	var flg = $('input[name="imgUrl"]').attr('flg');
	if(parseInt(flg) > 0){
		$('img[flg="' + flg + '"]').closest('li').children('.btnWrap').find('input').hide();
	}
	
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
				html[j] = "<tr id=spec"+ item.values[j].specValueId +"> "+ html[j] +
						"<td><input type='text' class='txt lg w-sm' name='skuSalePrice'  value='' onblur='publish.validateSkuSalePrice();' /></td>" +
						"<td><input type='text' class='txt lg w-sm' name='skuMarketPrice' value='' onblur='publish.validateSkuMarketPrice();' /></td>" +
						"<td><input type='text' class='txt lg ' name='skuStockBalance' value='' onblur='publish.validateSkuStockBalance();' /></td>" +
						"<td><input type='text' class='txt lg ' name='sellerNo' value='' onblur='publish.validateSellerNo();' /></td>" +
		         		"<input type='hidden' name='skuSpecId' value='" + specValues[j].skuSpecId + "'>" +
		         		"<input type='hidden' name='skuSpecName' value='" + specValues[j].skuSpecName + "'>" +
		         		"<input type='hidden' name='skuImgUrl' flg='" + item.values[j].specValueId + "' value='' >" +
		         		"</tr>";
				
				var specValueName = item.values[j].specValueName;
				if (specValueName != null && specValueName != "") {
					var jq = $("<li><div class='mod-upload'><img src='"+cssUrl+"/img/upload_img.jpg' alt='' flg='" + item.values[j].specValueId + "' /></div>" +
							"<p>"+item.skuSpecName+"："+specValueName+"</p>" +
							"<div class='btnWrap'>" +
							"<input type='button' value='设为主图' name='setImgBtn' onclick='publish.setDefaultImg(this);' flg='' class='btn btn-def' /></div></li>");
					jq.appendTo(ul);
					jq.find('img').each(function(){
						uploadSkuImg(this);
					});
				}
			}
		}
	}else{
		var next = recurse(arr, i + 1);
		var count = next.html.length;

		for (var j = 0; j < item.values.length; j++) {
			for (var k = 0; k < count; k++) {
				specValues[j * count + k] = 
				{'skuSpecId' :  item.skuSpecId + ':::' + item.values[j].specValueId + '|||' + next.specValues[k].skuSpecId,
				'skuSpecName' : item.skuSpecName + ':::' + item.values[j].specValueName + '|||' + next.specValues[k].skuSpecName};
				
				var row = '' ;
				if (i == 0){
					var specId = '';
					var specs =  specValues[j * count + k].skuSpecId.split('|||');
					for (var m = 0; m < specs.length; m++) {
						specId += specs[m].split(':::')[1];
					}
					row = row + "<tr id=spec"+ specId +" >";
				}
				row = row + "<td>"+item.values[j].specValueName+"</td>" + next.html[k];
				
				if (i == 0) {
					row	+= "<td><input type='text' class='txt lg w-sm' name='skuSalePrice' value='' onblur='publish.validateSkuSalePrice();' /></td>" +
							"<td><input type='text' class='txt lg w-sm' name='skuMarketPrice' value='' onblur='publish.validateSkuMarketPrice();' /></td>" +
							"<td><input type='text' class='txt lg ' name='skuStockBalance' value='' onblur='publish.validateSkuStockBalance();' /></td>" +
							"<td><input type='text' class='txt lg ' name='sellerNo' value='' onblur='publish.validateSellerNo();' /></td>" +
			         		"<input type='hidden' name='skuSpecId' value='" + specValues[j * count + k].skuSpecId + "'>" +
			         		"<input type='hidden' name='skuSpecName' value='" + specValues[j * count + k].skuSpecName + "'>" +	
			         		"<input type='hidden' name='skuImgUrl' flg='" + item.values[j].specValueId + "' value=''>" +
							"</tr>";
					
					if (k == 0) {
						var jq = $("<li><div class='mod-upload'><img src='"+cssUrl+"/img/upload_img.jpg' alt='' flg='" + item.values[j].specValueId + "' onclick='uploadSkuImg(this);' /></div>" +
								"<p>"+item.skuSpecName+"："+item.values[j].specValueName+"</p>" +
								"<div class='btnWrap'>" +
								"<input type='button' value='设为主图' name='setImgBtn' onclick='publish.setDefaultImg(this);' class='btn btn-def' /></div></li>");
						jq.appendTo(ul);
						jq.find('img').each(function(){
							uploadSkuImg(this);
						});
					}
				}
				
				html[j * count + k] = row;	
			}
		}
	}
	return {'html' : html, 'specValues' : specValues};
}

//validate editor
function checkLength(obj, detail_warn, maxlen) {
	var v = obj.val(), maxlen = !maxlen ? 100 : maxlen, curlen = maxlen, len = v.length;
	for (var i = 0; i < v.length; i++) {
		if (v.charCodeAt(i) < 0 || v.charCodeAt(i) > 255) {
			curlen -= 1;
		}
	}
	if (curlen >= len) {
		$("#"+detail_warn).html("还可输入 <strong>" + Math.floor((curlen - len) / 2)
				+ "</strong>个字").css('color', '');
	} else {
		$("#"+detail_warn).html("还可输入 <strong>0</strong>个字").css('color', '').css('color', '#FF0000');
		obj.val(v.substring(0, len-Math.floor((len - curlen) / 2)));
	}
}

function uploadSkuImg(obj) {
	new AjaxUpload(obj, {
		action: '../image/saveImg',
		filename: 'filename',
		autoSubmit: true,
		multiple: true,
		onComplete: function(file, response) {
			response = eval("("+response+")");
			if (!!response.url) {
				$(obj).attr("src",response.url);
				var flg = $(obj).attr('flg');
				if (flg) {
					$('input[name="skuImgUrl"][flg="' + flg + '"]').val(splitString(response.url));
					if(!!!$('input[name="imgUrl"]').val()){
						$(obj).closest('li').children('.btnWrap').find('input').trigger('click');
					}
					publish.validateSkuImg();
				}
			} else {
				alert(response.message);
				return;
			}
		}
	});
}

function splitString(url) {
 	imgUrl = url.split("=");
 	return imgUrl[1];
}

// prepare attr
function prepareAttrData() {
	var attrs = $('[name="attr"]'), attrValueId = '', attrValueName = '';
	
	attrs.each(function() {
		var displayMode = $(this).attr('displayMode'),
			attrId = $(this).attr('attrId'),
			attrName = $(this).attr('attrName');
		
		if (displayMode == '1') {
			var value = $('[name="attrValue"][attrId="' + attrId + '"]').val();
			if (!value) return;
			
			var arr = value.split('|||');
			attrValueId = attrValueId + (attrValueId ? '|||' : '') + attrId + ':::' + arr[0];
			attrValueName = attrValueName + (attrValueName ? '|||' : '') + attrName + ':::' + arr[1];
			
		} else {
			var chks = $('[name="attrValue"][attrId="' + attrId + '"]').filter(":checked");
			if (chks.length == 0) return;
			var chkValueId = '', chkValueName = '';
			
			chks.each(function() {
				var tmpValueId = $(this).attr('attrValueId'), tmpValueName = $(this).attr('attrValueName');
				
				chkValueId = chkValueId + (chkValueId ? ",,," : '') + tmpValueId;
				chkValueName = chkValueName + (chkValueName ? ",,," : '') + tmpValueName;
			});
			
			attrValueId = attrValueId + (attrValueId ? '|||' : '') + attrId + ':::' + chkValueId;
			attrValueName = attrValueName + (attrValueName ? '|||' : '') + attrName + ':::' + chkValueName;
		}
	});
	
	$('input[name="attrValueId"]').val(attrValueId);
	$('input[name="attrValueName"]').val(attrValueName);
}

function selectedAttr(){
	if (!attrValueId) return;
	var attrArr = attrValueId.split('|||');
	$.each(attrArr, function() {
		var attr  = this.split(':::');
		if (!attr || attr.length != 2) return;
		var attrId = attr[0], attrValueId = attr[1];
		var attrCtrl = $('[name="attr"][attrId="' + attrId + '"]');
		if (attrCtrl.length == 0) return;
		
		var displayMode = attrCtrl.attr('displayMode');
		if (displayMode == '1') {
			var arr = attrValueId.split('>>>');
			var attrValueCtrl =  $('[name="attrValue"][attrId="' + attrId + '"]');			
			attrValueCtrl.find('option[attrValueId="' + arr[0] + '"]').prop('selected', true);
			if (arr.length > 1) {//二级
				var attrValue2Ctrl = $('[name="attrValue2"][attrId="' + attrId + '"][attrValueId="' + arr[0] + '"]');
				attrValue2Ctrl.find('option[attrValue2Id="' + arr[1] + '"]').prop('selected', true);
				attrValue2Ctrl.show();
			}
		} else {
			var arr = attrValueId.split(',,,');
			$.each(arr, function(){
				$('[name="attrValue"][attrId="' + attrId + '"][attrValueId="' + this + '"]').prop('checked', true);
			});			
		}
	});
}

function selectedSkus(){
	if(!skuSpecIdArr) return;
	var chk;
	for (var i = 0; i < skuSpecIdArr.length; i++) {
	 	var skuSpecId = skuSpecIdArr[i], skuSpecName = skuSpecNameArr[i];	
	 	var arrId = skuSpecId.split('|||'), arrName = skuSpecName.split('|||');
	 	
	 	for (var j = 0; j < arrId.length; j++) {
	 		var idPair = arrId[j].split(':::'), namePair = arrName[j].split(':::');
	 		chk = $('[name="specValue"][skuSpecId="' + idPair[0] + '"][specValueId="' + idPair[1] + '"]');
	 		chk.prop('checked', true);			
	 		
	 		chk.siblings('input').val(namePair[1]);
	 		chk.siblings('[name="specValueTxt"]') .html(namePair[1]);
	 		
	 		if (chk) chk.trigger('change');	
	 	}
	}
	
	var table = $('#genSpec');	
	var specCount = $('ul[specId]').length;
	for (var i = 0; i < skuSpecIdArr.length; i++) {
		var selectedSpecId = '';
		var specs = skuSpecIdArr[i].split('|||');
		for (var m = 0; m < specs.length; m++) {
			selectedSpecId += specs[m].split(':::')[1];
		}
		
		var row = $("#spec"+selectedSpecId).length; 
		if(row == 1 ){
			var tr = $("#spec"+selectedSpecId);
			tr.children('td').children('input').attr('superSpecId', selectedSpecId);  
			var skuSalePrice = tr.find('input[superspecid='+selectedSpecId+'][name="skuSalePrice"]');
			var skuMarketPrice = tr.find('input[superspecid='+selectedSpecId+'][name="skuMarketPrice"]');	
			var skuStockBalance = tr.find('input[superspecid='+selectedSpecId+'][name="skuStockBalance"]');
			var sellerNo = tr.find('input[superspecid='+selectedSpecId+'][name="sellerNo"]');
			$(skuSalePrice[0]).val(parseFloat(s_salePrice[i]).toFixed(2));
			$(skuMarketPrice[0]).val(parseFloat(s_marketPrice[i]).toFixed(2));
			$(skuStockBalance[0]).val(s_stockBalance[i]);
			$(sellerNo[0]).val(s_sellerNo[i]);
		}
		
		skuImgUrl = table.find('input[name="skuImgUrl"]');
		if (skuImgUrl[i]) {
			var flg = $(skuImgUrl[i]).attr('flg');
			$('input[name="skuImgUrl"][flg="' + flg + '"]').val(s_imgUrl[i]);
			$('img[flg="' + flg + '"]').attr("src",imgGetUrl +"?rid="+ s_imgUrl[i]+"&op=s0_w238_h238");
			if(skuSortRankArr[i] == 0){
				$('img[flg="' + flg + '"]').closest('li').children('.btnWrap').find('input').trigger('click');
			}
		}
	}
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
	             '|', 'image', 'table', 'hr', 'emoticons', 'pagebreak', 'link', 'unlink'
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
			checkLength($("#detail"),'detail_warn', 40000);
		},
		// 图片地址
	    afterUpload : function(url) {
	    }
	});
});
