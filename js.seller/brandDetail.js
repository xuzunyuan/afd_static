$(function(){
	initAddProduct();
	
	$('#specialList>table').each(function(){
		initTable($(this));
	});
	
	$('#popupTip').find('i.close').click(function(){
		$('#popupTip,#popupMask').hide();
	});
	
	$('#frm').submit(function(e){
		var checked = true;
		var jq = $(this).find('input[name="discount"],input[name="showPrice"],input[name="showBalance"]');
		
		if(!jq.length) {
			$('#popupTip,#popupMask').show();
			return false;
		}
		
		jq.each(function(){
			if(!$(this).val() || !($(this).val() * 1)) {
				$('#popupTip,#popupMask').show();
				checked = false;
				return false;
			}
		});
		
		return checked;
	});
});

function initAddProduct() {
	var jq = $('#popupProduct');
	
	jq.find('i.close').click(function(e) {
		$('#popupProduct,#popupMask').hide();
	});
	
	$('#btnAddProduct').click(function(e){
		if(!jq.attr('inited')) {
			initProduct();
		}		
		
		$('#tblProduct>tbody>tr').each(function(){
			var product = $(this).data('product');
			
			if($('input[name="prodId"][value="' + product.prodId + '"]').length > 0) {
				$(this).hide();
			} else {
				$(this).show();
			}			
		});
		
		$('#popupProduct,#popupMask').show();
	});
}

function initProduct() {
	$('#chkBatch').click(function(e){
		var checked = $(this).prop('checked');
		
		$('#tblProduct>tbody').find(':checkbox').prop('checked', checked);
	});
	
	$('#btnBatch').click(function(e){
		e.preventDefault();
		
		$('#tblProduct>tbody').find(':checked').each(function(e){
			addProduct($(this).parents('tr'));
		});
	});
	
	$.ajax({url: ctx + '/ajax/getOnlineProduct', dataType:'json', async:false, data: {'sellerId' : $.seller.sellerId, 'brandId' : brandId},
		success : function(data) {
			if(data && data.length > 0) {
				var tby = $('#tblProduct>tbody');
				
				$(data).each(function(){
					var tr = $('<tr><td><input type="checkbox" class="chk" name="chkProduct"/></td>' +
					  '<td><div class="pro-img"><img src="' + imgGetUrl + '?rid=' + this.skus[0].skuImgUrl + '" alt=""></div></td>' +
					  '<td>' + (this.prodCode ? this.prodCode : '') + '</td>' +
					  '<td class="table-left"><p>' + this.title + '</p></td>' +
					  '<td>' + this.brandName + '</td>' +
					  '<td>' + this.bcName + '</td>' +
					  '<td>' + this.skus[0].salePrice + '</td>' +
					  '<td><a href="javascript:;" class="btn btn-def">添加</a></td></tr>')
					.appendTo(tby);
					
					tr.data('product', this);		
					tr.find('a').click(function(e){
						e.preventDefault();
						addProduct($(this).parents('tr'));
					});
				});							
				
				$('#popupProduct').attr('inited', true);
			}
		},
		error : function() {
			
		}});	
}

function addProduct(tr) {
	var product = tr.data('product');
	
	var tbl = $('<table class="table table-line table-product">' +
	           '<colgroup><col width="60"><col width="160"><col width="140"><col width="153"><col width="150"><col width="150"><col width="180"></colgroup>' +
	           '<thead>	<tr class="tr-head">' +
			   '<td colspan="7"><span>货号：' + (product.artNo ? product.artNo : '')  + '</span>' +
			   '<span><a href="#">商品名称：' + product.title + '</a></span>' +
			   '<span>品牌：' + product.brandName + '</span></td></tr>' + 
			   '<tr><td>商品图片</td><td>规格</td><td>原价</td><td>折扣</td><td>特卖价</td><td>库存</td><td>操作</td></tr></thead>' +
			   '<tbody class="interleave-even"></tbody></table>').insertBefore($('#paging'));
	
	$(product.skus).each(function(index, sku){
		var s = '<tr><td><img style="width:50px;height:50px;" src="' + imgGetUrl + '?rid=' + sku.skuImgUrl + '" alt=""></td>' + 
				'<td><p>' + sku.skuSpecName.replace(/:::/g, ' : ').replace(/\|\|\|/, '</p><p>') + '</td></p>' +
				'<td>￥' + sku.marketPrice + '</td>' +
				'<td><input type="text" class="txt sm w-sm" placeholder="10" name="discount" maxlength="3">折</td>' + 
				'<td><input type="text" class="txt sm w-sm" placeholder="10" name="showPrice" maxlength="11" marketPrice="' + sku.marketPrice  + '"></td>' +
				'<td><input type="text" class="txt sm w-sm" placeholder="10" name="showBalance" maxlength="6">' +
					'<input type="hidden" name="prodId" value="' + sku.prodId + '">' +
					'<input type="hidden" name="skuId" value="' + sku.skuId + '">' +
					'<input type="hidden" name="bSDId" value="0">' +
					'<input type="hidden" name="prodCode" value="' + (sku.prodCode ? sku.prodCode : '') + '">' +
					'<input type="hidden" name="skuCode" value="' + (sku.skuCode ? sku.skuCode : '') + '">' +
					'<input type="hidden" name="prodName" value="' + product.title + '">' +
					'<input type="hidden" name="prodTitle" value="' + product.title + '">' +
					'<input type="hidden" name="prodImg" value="' + sku.skuImgUrl + '">' +
					'<input type="hidden" name="skuSpecName" value="' + sku.skuSpecName + '">' +
					'<input type="hidden" name="orgPrice" value="' + sku.marketPrice + '">' +
					'<input type="hidden" name="artNo" value="' + product.artNo + '">' +
				'</td>';
		
		if(index == 0) {
			s += '<td class="td-operate" rowspan="' + product.skus.length + '">' +
				 '<p><a href="#" class="btn btn-def lg">移除商品</a></p>' +
				 '</td>';			
		}
			
		s += '</tr>';
		
		$(s).appendTo(tbl);		
	});
	
	initTable(tbl);
		
	tr.hide();
}

function initTable(tbl) {
	tbl.find('a').click(function(e){
		e.preventDefault();
		$(this).parents('table').remove();
	});
	
	CheckUtil.limitDigital(tbl.find('input[name="showBalance"]'));
	
	tbl.find('input[name="discount"],input[name="showPrice"]').bind('input propertychange', function(e){
		var jq = $(this), value = jq.val();

		if(value) {
			var newValue = value.replace(/[^0-9\.]/g, '').replace(/^\./g,"").replace(/\.{2,}/g,".");
			
			newValue = newValue.replace('.', 'a').replace(/\./g,"").replace('a', '.');  
			
			if(value !== newValue) {
				jq.val(newValue);
			}			
		}
	});
	
	tbl.find('input[name="discount"]').bind('input propertychange', function(e){
		var jq = $(this), value = jq.val();
		
		if(value) {
			value = value * 1;
			
			if(value > 10) {
				jq.val(10);
			} else if(value <= 0) {
				jq.val(0.1);
			}
		}
		
	});
	
	tbl.find('input[name="discount"]').bind('input propertychange', function(e){
		var jq = $(this), value = jq.val();
		
		if(value) {
			var jqShowPrice = jq.parents('tr').find('input[name="showPrice"]');
			
			var newPrice = (jqShowPrice.attr('marketPrice') * 0.1 * value).toFixed(2);
			
			if(jqShowPrice.val() != newPrice) {
				e.preventDefault();
				jqShowPrice.val(newPrice);
			}
		}
		
	});
	
	tbl.find('input[name="discount"]').bind('input propertychange', function(e){
		var jq = $(this), value = jq.val();
		
		if(value) {
			var jqShowPrice = jq.parents('tr').find('input[name="showPrice"]');
			
			var newPrice = (jqShowPrice.attr('marketPrice') * 0.1 * value).toFixed(2);
			
			if(jqShowPrice.val() != newPrice) {
				jqShowPrice.val(newPrice);
			}
		}
		
	});
	
	tbl.find('input[name="showPrice"]').bind('input propertychange', function(e){
		var jq = $(this), value = jq.val();
		
		if(value) {
			value = (value * 1).toFixed(2);
		
			var marketPrice = jq.attr('marketPrice') * 1;
			
			if(value > marketPrice) {
				jq.val(marketPrice);
			} else if(value <= 0) {
				jq.val((marketPrice * 0.1).toFixed(2));
			} else {
				if((jq.val() * 1) != value) {
					jq.val(value);
				}
			}
		}
		
	});
	
	tbl.find('input[name="showPrice"]').bind('input propertychange', function(e){
		var jq = $(this), value = jq.val();
		
		if(value) {
			var jqDiscount = jq.parents('tr').find('input[name="discount"]');
			
			var newDiscount = (value / jq.attr('marketPrice') * 10).toFixed(1);
			
			if(jqDiscount.val() != newDiscount) {
				jqDiscount.val(newDiscount);
			}
		}
		
	});
}