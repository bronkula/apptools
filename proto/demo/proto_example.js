
var bp;
var db = [];

$.ajax({
	url:"data.json",
	dataType:'json'
}).done(function(d){
	db = d;
});



function makeSection5(){
	if(!waitForData(db,makeSection5)) return;

	showDataList(db,$("#userlist-template").html(),"#Section5 .userlist");
}
function makeSection6(){
	if(!waitForData(db,makeSection5)) return;

	var user = db.filter(obj=>obj.id==localStorage.chosenId);
	if(user.length) showDataList(user,$("#user-template").html(),"#Section6 [data-role='body']");
	else {
		$("#Section6 [data-role='body']").html("No one selected.<br><a href='#Section5' class='proto-jump'>Back to List</a>")
	}
}


$(function(){


	// Adding a pageshow event listener is very easy to do
	$(document).on("pageshow",function(e,obj){

		// Each pageshow event is passed an object with a nextPage and prevPage
		// These have title, url, and el properties
		if(obj.nextPage.title=="Section2") {
			$(".currentdate").html(new Date())
		}


		if(obj.nextPage.title=="Section5") {
			makeSection5();
		}
		if(obj.nextPage.title=="Section6") {
			makeSection6();
		}
	})


	$("body")
	.on("mousedown touchstart",".userlist .user-visit",function(){
		localStorage.chosenId = $(this).data("id");
	})

	bp = new BaseProto();

})