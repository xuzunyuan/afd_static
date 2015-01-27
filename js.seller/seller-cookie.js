/*! 
 * @Copyright:afd.com
 * @Author:xuzunyuan
 * @Depends: jquery、jquery.cookie.js
 * 
 * 卖家系统客户端认证，所有卖家页面应引用本文件
 * 
 */
(function($){
	
function Seller() {
	this.sellerId = 0;
	this.sellerLoginId = 0;
	this.nickName = null;
	this.loginName = null;
	this.type = null;
	this.isPaidDeposit = null;
	
	this.isLogined = false;
	
	this.init();
	this.delayLogin();
}

Seller.prototype = {
	init : function() {
		var __s = $.cookie('__s');
		if(!__s) return;
		
		var arr = __s.split('|');
		if(arr.length != 6) return;
		
		this.sellerId = (arr[0] ? arr[0] : 0);
		this.sellerLoginId = (arr[1] ? arr[1] : 0);
		this.nickName = (arr[2] ? arr[2] : null);
		this.loginName = (arr[3] ? arr[3] : null);
		this.type = (arr[4] ? arr[4] : null);
		this.isPaidDeposit = (arr[5] ? arr[5] : null);
		
		this.isLogined = this.validateLogin();
	},
	validateLogin : function() {
		if(!this.sellerLoginId) return false;
		
		var __sm = $.cookie('__sm');
		if(!__sm) return false;
		
		var __st = $.cookie('__st');
		if(!__st) return false;
			
		var arr = __st.split('|');
		if(arr.length != 2 || !$.isNumeric(arr[0]) || !$.isNumeric(arr[1])) return false;
		
		var dt = new Date().getTime();
		if((dt - arr[1]) > arr[0]) return false;
		
		return true;
	},
	delayLogin : function() {
		if(!this.isLogined) return;
		
		var __st = $.cookie('__st');
			
		var arr = __st.split('|');
		
		// 只有在截止时间只剩15分钟内才需延长登录时间(2小时)
		var dt = new Date().getTime();
		
		if((arr[0] - (dt - arr[1])) < (15 * 60 * 1000)) {
			var newDt = Number(arr[0]) + 2 * 60 * 60 * 1000;
			$.cookie('__st', newDt + '|' + arr[1], {path:'/'});			
		}
	}
};

$(function() {
	$.seller = $.Seller = new Seller();
});
	
})(jQuery);

