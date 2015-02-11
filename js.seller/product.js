	
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