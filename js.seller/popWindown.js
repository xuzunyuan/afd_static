///-------------------------------------------------------------------------
//jQuery弹出窗口
//--------------------------------------------------------------------------
/*参数：[可选参数在调用时可写可不写,其他为必写]
----------------------------------------------------------------------------
    title:	窗口标题
  	content:  内容(可选内容为){ warning | issue | appr | text_warn | text_error | text | submit}
  	time:	自动关闭等待的时间，为空是则不自动关闭
    showbg:	[可选参数]设置是否显示遮罩层(0为不显示,1为显示)
    
 ------------------------------------------------------------------------*/

function popWindown(title,content,time,showbg){
	$("#windown-box").remove();
	
	var jsonStr = arguments[4];
	var jsonHTML = [];
	
	var	windown_html = 
		"<div class=\"mask\" id='windownbg' style=\"display: none;\"></div>" +
		"<div class=\"popup popup-primary\" style=\" position:fixed;left:50%;top:50%;margin-top:-85px;width:500px;margin-left:-250px;\" id=\"windown-box\" >" +
			"<div class=\"hd\" id=\"windown-title\"><h2></h2><i class=\"close\" id=\"windown-close\"></i></div>" +
			"<div class=\"bd\" id=\"windown-content\">" +
			"</div>" +
		"</div>";
		
		$("body").append(windown_html);
		
		show  = false;
		
		contentType = content.substring(0,content.indexOf(":"));
		content = content.substring(content.indexOf(":")+1,content.length);
		
		switch(contentType){
			case "warning":				
				var content_html = 
					"<dl class=\"popup-doc\">" +
						"<dt>" +
							"<i class=\"icon i-danger\"></i>" +
						"</dt>" +
						"<dd>" +
							"<h3>"+title+"</h3>" +
							"<p>"+content+"</p>" +
							"<div class=\"btnWrap\"><a href=\"javascript:;\" id=\"submitBtn\" class=\"btn btn-primary\">确定</a>" +
							"<a href=\"javascript:;\" id=\"restBtn\" class=\"btn btn-def\">取消</a></div>" +
						"</dd>" +
					"</dl>";
					
				$("#windown-content").html(content_html);
				break;
			case "issue" :
				var content_html =
					"<dl class=\"popup-doc\">" +
						"<dt>" +
							"<i class=\"icon i-danger\"></i>" +
						"</dt>" +
						"<dd>" +
							"<h3>"+title+"</h3>" +
							"<p>"+content+"</p>" +
							"<div class=\"btnWrap\"><a href=\"javascript:;\" id=\"restBtn\" class=\"btn btn-primary\">我知道了</a></div>" +
						"</dd>" +
					"</dl>";
				$("#windown-content").html(content_html);
				break;
//			case "appr":
//				contentTitle = content.substring(0,content.indexOf("|"));
//				content = content.substring(content.indexOf("|")+1,content.length);
//				var content_html = "<h2><i class=\"icon i-duigou\"></i>"+contentTitle+"</h2>" +
//				 		"<ul>"+content+"</ul> ";
//				$("#windown-content").html(content_html);
//				break;
			case "submit":
				var content_html = 
					"<dl class=\"popup-doc\">" +
					"<dt>" +
						"<i class=\"icon i-danger\"></i>" +
					"</dt>" +
					"<dd>" +
						"<h3>"+title+"</h3>" +
						"<p>"+content+"</p>" +
						"<div class=\"btnWrap\"><a href=\"javascript:;\" id=\"restBtn\" class=\"btn btn-primary\">确认</a></div>" +
					"</dd>" +
				"</dl>";
				$("#windown-content").html(content_html);
				break;			
			case "publish" :
				var content_html =
					"<dl class=\"popup-doc\">" +
						"<dt>" +
							"<i class=\"icon i-right\"></i>" +
						"</dt>" +
						"<dd>" +
							"<h3>"+title+"</h3>" +
							"<p>"+content+"</p>" +
							"<div class=\"btnWrap\"><a href=\"../product/category?m=2002\" id=\"submitBtn\" class=\"btn btn-primary\">继续发布商品</a>" +
							"<a href=\"../product/online?m=2002\" id=\"restBtn\" class=\"btn btn-def\">查看在售商品</a></div>" +
						"</dd>" +
					"</dl>";
				
				$("#windown-content").html(content_html);
				break;	
				
		}

		if(showbg =="1"){
			$("#windownbg").show();
		}else{
			$("#windownbg").remove();
		}
		$("#windown-box").show();
		
		$("#restBtn").on("click",function(){
			$("#windown-box").fadeOut("slow",function(){
				$(this).remove();
				$("#windownbg").remove();
			});
		});
		
		var closeWindown = function(){
			$("#windownbg").remove();
			$("#windown-box").fadeOut("slow",function(){
				$(this).remove();
			});
		}
				
		if( time == "" || typeof(time) == "undefined") {
			if (!!jsonStr && jsonStr == 'john') {
			} else {
				$("#windown-close").click(function() {
					$("#windownbg").remove();
					$("#windown-box").fadeOut("slow",function(){
						$(this).remove();
					});
				});
			}
		}else { 
			setTimeout(closeWindown,time);
		}	
		
}