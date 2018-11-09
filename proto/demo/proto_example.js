
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

	showDataList(db,$("#userlist-template").html(),"#page-show .userlist");
}
function makeSection6(){
	if(!waitForData(db,makeSection5)) return;

	var user = db.filter(obj=>obj.id==localStorage.chosenId);
	if(user.length) showDataList(user,$("#user-template").html(),"#page-user [data-role='main']");
	else {
		$("#page-user [data-role='main']").html("No one selected.<br><a href='#page-show' data-role='jump'>Back to List</a>")
	}
}


$(function(){


	// Adding a pageshow event listener is very easy to do
	$(document).on("pageshow",function(e){

		let nextPage = e.detail.nextPage;
		console.log(e.detail)

		// Each pageshow event is passed an object with a nextPage and prevPage
		// These have title, url, and el properties

		if(nextPage.title=="page-show") {
			makeSection5();
		}
		if(nextPage.title=="page-user") {
			makeSection6();
		}


		$("footer[data-role='footer'] .active").removeClass("active");
		$("footer[data-role='footer'] a[href='#"+nextPage.title+"']").addClass("active");
	})


	$("body")
	.on("mousedown touchstart",".userlist .user-visit",function(){
		localStorage.chosenId = $(this).data("id");
	})

	// pt = new ProtoTight();

})