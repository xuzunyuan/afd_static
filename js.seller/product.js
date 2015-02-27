	
function product(){
	this.loadBcCategory = function(elemId,pId){
		if(pId === ""){
			$('#second_list,#third_list').empty();
		}else if (pId >= 0){
			$.ajax({
				url : "../product/loadBc",
				type : "POST",
				data : {pId : pId},
				async: false,
				success : function(list) {
					if(null !=list && list.length > 0){
						appendOption(elemId, list);
					}
				}
			});
		}
	};
	
	
	this.delProduct = function(prodId){
		popWindown("删除商品确认","warning:确定要删除已选商品吗？删除后将无法恢复！","","1");
		
		$("#submitBtn").on("click",function(){
			$.post("../product/delProd",{prodId:prodId},function(data){
				if(data.success == 1){
//					tipsWindown("","text:删除成功！","2000","1");
					setTimeout("submitFrom();",1000); 
				}else{
//					tipsWindown("","text_error:商品删除失败，请重新操作！","2000","1");
					return false;
				}
			});
		});
	};

}


function submitFrom(){
	$("#queryForm").submit();
}

function appendOption(elemId, bcList){
	var sel$ = $(elemId);
	sel$.empty();
	
	if("#second_list" === elemId){
		$("#third_list").empty();
		
	}
	
	$.each(bcList,function(){
		sel$.append('<li id="'+this.bcId+'">'+this.bcName+'</li>');
	});
}

