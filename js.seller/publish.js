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
		var jq = $('input[name=title]');
		if($.trim(jq.val()).length == 0 ){
			jq.parent().next().text("请填写商品标题！");
			return;
		}else if(jq.val().length > 20 ){
			jq.parent().next().text("字数超长或有误，请填写30个字以内的标题！");
			return;
		}else{
			jq.parent().next().text("");
		}	
	};
	
	this.validateArtNo = function(){
		var regArtNo = /^[a-zA-Z0-9]{12,16}$/;
	 	var jq = $("input[name=artNo]");
		if($.trim(jq.val()).length == 0 ){
			jq.parent().next().text("请填写货号！");
			return;
		}else if(!regArtNo.test(jq.val())){
			jq.parent().next().text("输入有误，请重新填写货号！");
			return;
		}else{
			jq.parent().next().text("");
		}
	};
	
	this.validateBrand = function(){
		jq = $('select[name=brand] :selected');
		if(jq.val() < 0){
			jq.parent().parent().next().text("请选择品牌！");
			return;
		}else{
			jq.parent().parent().next().text("");
		}
	}

	this.valaidateAttr = function(){
		ref = true;
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
					jq.prev().parent().next().text("请选择属性'" + attrName + "'");
					ref = false;
					return ref;
				}else{
					jq.prev().parent().next().text("");
				}
			}else{
				var chks = $('[name="attrValue2"][attrId="' + attrId + '"]').filter(":checked");
				if (chks.length == 0) {
					jq.prev().parent().next().text("请选择属性'" + attrName + "'");
					ref = false;
					return ref;
				}else{
					jq.prev().parent().next().text("");
				}
			}
		});
		return ref; 
	};
	
	this.validateSpec = function(){
		ref = true;
		var jq = $('ul[specId]');
		for(var i = 1; i <= jq.length;i++){
			var specId = $('ul[var="'+i+'"]').attr('specId');
			var chks = $('[name="specValue"][skuSpecId="'+specId+'"]').filter(":checked");
			if (chks.length == 0) {
				$("#spacErr").text("请选择规格！");
				ref = false;
				return ref;
			}else{
				$("#spacErr").text("");
				if(!this.validateSkuSalePrice() || !this.validateSkuMarketPrice() || !this.validateSkuStockBalance()){
					ref = false;
				}
			}
		}
		return ref ;
	};
	
	this.validateSkuSalePrice = function(obj){
		this.limitPrice($(obj));
		ref = true;
		var regPrice = /^([1-9]+[0-9]*|[0])([\.][0-9]{1,2})?$/;	
		var skuSalePrices = $('[name="skuSalePrice"]');
		skuSalePrices.each(function(){
			salePrice = parseFloat($(this).val());
			marketPrice = parseFloat($(this).parent().next().children().val());
			if(!regPrice.test(salePrice)){
				$('#precErrMsg').text("单价输入有误，请输入大于0且小于999999！");
				ref = false;
			}else if(!!!salePrice){
				$('#precErrMsg').text("请输入单价！");
				ref = false;
			}else if(marketPrice > salePrice){
				$('#precErrMsg').text("特卖价应小于单价！");
				ref = false;
			}else if(salePrice == 0 || salePrice =='0.0' || salePrice =='0.00'){
				$('#precErrMsg').text("单价输入有误，请输入大于0且小于999999！");
				ref = false;
			}else{
				$('#precErrMsg').text("");
			}
		});
		
		return ref;
	};
	
	this.validateSkuMarketPrice = function(obj){
		this.limitPrice($(obj));
		var regPrice = /^([1-9]+[0-9]*|[0])([\.][0-9]{1,2})?$/;	
		ref = true;
		var skuMarketPrices = $('[name="skuMarketPrice"]');
		skuMarketPrices.each(function(){
			marketPrice = parseFloat($(this).val());
			salePrice = parseFloat($(this).parent().prev().children().val());
			
			if(!regPrice.test(marketPrice)){
				$('#precErrMsg').text("特卖价输入有误，请输入大于0且小于999999！");
				ref = false;
			}else if(!!!marketPrice){
				$('#precErrMsg').text("请输入特卖价！");
				ref = false;
			}else if(marketPrice > salePrice){
				$('#precErrMsg').text("特卖价应小于单价！");
				ref = false;
			}else if(marketPrice == 0 || marketPrice =='0.0' || marketPrice =='0.00'){
				$('#precErrMsg').text("特卖价输入有误，请输入大于0且小于999999！");
				ref = false;
			}else{
				$('#precErrMsg').text("");
			}
		});
		return ref;
	};
	
	this.validateSkuStockBalance = function(obj){
		this.limitDigital($(obj));
		var regBalance = /^[1-9][\d]{0,4}$/;
		ref = true;
		var skuStockBalances = $('[name="skuStockBalance"]');
		skuStockBalances.each(function(){
			stockBalance = $(this).val();
			if(!!!stockBalance){
				$('#precErrMsg').text("请填写数量！");
				ref = false;
			}if(!regBalance.test(stockBalance)){
				$('#precErrMsg').text("商品数量有误，请输入大于0且小于999999！");
				ref = false;
			}else{
				$('#precErrMsg').text("");
			}
		});
		return ref;
	};
	
	this.validateSkuImg = function(){
		var ref = true;
		var totalImgCount = $('#skuImg li').length;
		var jq = $('input[name="skuImgUrl"]');
		jq.each(function(){
			var flg = $(this).attr('flg');
			var imgUrl = $('input[name="skuImgUrl"][flg="' + flg + '"]').val();
			if(imgUrl == ""){
				$('#errSkuImg').text("请上传全部的sku图片");
				ref =  false;
			}else{
				$('#errSkuImg').text("");	
			}
		});
		return ref;
	};
	
	this.validateDetail = function(){
		ref = true;
		var jq = $('#detail');
		if(!!!jq.val()){
			jq.parent().parent().next().text("请填写商品描述！");
			ref = false;
		}else{
			jq.parent().parent().next().text("");
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
		if(!this.valaidateAttr() | !this.validateSpec() | !this.validateSkuImg()){
			ref = false;
		};
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
		 
		selectedArr.sort(function(a, b) {
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
						$('img[flg="' + flg + '"]').attr("src",oldSkuImgUrlValue[j]);
					}
					break;
				}
			}
		}
	};
	
	this.setDefaultImg = function(obj){
		ref = true;
		var jq = $(obj).closest('li').children('.mod-upload').find('img');
		flg = parseInt(jq.attr("flg"));
		imgUrl = $('input[name="skuImgUrl"][flg="' + flg + '"]').val();
		if(imgUrl){
			var img = $('input[name="imgUrl"]');
				img.val(imgUrl);
				img.attr('flg',flg);
			$('input[name="setImgBtn"]').show();
			$(obj).hide();
		}else{
			alert('请上传sku图片');
			ref = false;
		}
		
		return ref;
	};
	
	this.saveProduct = function(){
		if (!publish.checkFromData()) {
			return false;
		}

		$.ajax({
			url : "../product/save",
			data : $('#publishForm').serialize(),
			type : "post",
			cache : false,
			async : false,
			success : function(data) {
				if (data > 0) {
//					tipsWindown("发布商品成功","submit:<p class='meg'><em>*</em>新发布的商品5分钟后会在\"待上架商品\"列表中显示</p> <p>您可在<a href=\"${ctx}/product/stockProd?m=12\">库存商品管理</a>中查看、修改已发布的商品</P>","","1","john");
					alert("success");
				} else {
					alert("error");
//					tipsWindown("","text:发布商品失败，网络异常请联系网络管理员！","2000","1");
				}
			}
		});
		
//		$('#publishForm').submit();
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
		table.find('tbody').parent().after('<div class="note errTxt" id="precErrMsg"></div>');
	});
	
	var flg = $('input[name="imgUrl"]').attr('flg');
	if(parseInt(flg)>0){
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
				html[j] = "<tr> "+ html[j] +
						"<td><input type='text' class='txt lg w-sm' name='skuSalePrice' value='' onkeyup='publish.validateSkuSalePrice(this);' /></td>" +
						"<td><input type='text' class='txt lg w-sm' name='skuMarketPrice' value='' onkeyup='publish.validateSkuMarketPrice(this);' /></td>" +
						"<td><input type='text' class='txt lg ' name='skuStockBalance' value='' onkeyup='publish.validateSkuStockBalance(this);' /></td>" +
		         		"<td><input type='hidden' name='skuSpecId' value='" + specValues[j].skuSpecId + "'>" +
		         		"<input type='hidden' name='skuSpecName' value='" + specValues[j].skuSpecName + "'>" +
		         		"<input type='hidden' name='skuImgUrl' onchange='publish.validateSkuImg();' flg='" + item.values[j].specValueId + "' value='' >" +
		         		"</td></tr>";
				
				var specValueName = item.values[j].specValueName;
				if (specValueName != null && specValueName != "") {
					ul.append("<li><div class='mod-upload'><img src='"+cssUrl+"/img/upload_img.jpg' alt='' flg='" + item.values[j].specValueId + "' onclick='uploadSkuImg(this);' /></div>" +
							"<p>"+item.skuSpecName+"："+specValueName+"</p>" +
							"<div class='btnWrap'>" +
							"<input type='button' value='设为主图' name='setImgBtn' onclick='publish.setDefaultImg(this);' flg='' class='btn btn-def' /></div></li>");
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
					row	+= "<td><input type='text' class='txt lg w-sm' name='skuSalePrice' value='' onkeyup='publish.validateSkuSalePrice();' /></td>" +
							"<td><input type='text' class='txt lg w-sm' name='skuMarketPrice' value='' onkeyup='publish.validateSkuMarketPrice(this);' /></td>" +
							"<td><input type='text' class='txt lg ' name='skuStockBalance' value='' onkeyup='publish.validateSkuStockBalance();' /></td>" +
			         		"<td><input type='hidden' name='skuSpecId' value='" + specValues[j * count + k].skuSpecId + "'>" +
			         		"<input type='hidden' name='skuSpecName' value='" + specValues[j * count + k].skuSpecName + "'>" +	
			         		"<input type='hidden' name='skuImgUrl' onchange='publish.validateSkuImg();' flg='" + item.values[j].specValueId + "' value=''>" +
							"</td></tr>";
				}
				html[j * count + k] = row;	
			}
			
			var specValueName = item.values[j].specValueName;
			if (specValueName != null && specValueName != "") {
				ul.append("<li><div class='mod-upload'><img src='"+cssUrl+"/img/upload_img.jpg' alt='' flg='" + item.values[j].specValueId + "' onclick='uploadSkuImg(this);' /></div>" +
						"<p>"+item.skuSpecName+"："+specValueName+"</p>" +
						"<div class='btnWrap'>" +
						"<input type='button' value='设为主图' name='setImgBtn' onclick='publish.setDefaultImg(this);' class='btn btn-def' /></div></li>");
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
//			$("#detail_warn").html("");
	//		checkLength($("#detail"),'detail_warn', 40000);
		},
		// 图片地址
	    afterUpload : function(url) {
	    }
	});
});

function uploadSkuImg(jq) {
	new AjaxUpload(jq, {
		action: '../image/saveImg',
		filename: 'filename',
		autoSubmit: true,
		multiple: true,
		onComplete: function(file, response) {
			response = eval("("+response+")");
			if (!!response.url) {
				$(jq).attr("src",response.url);
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
