
var bp;
var db = [];

$.ajax({
	url:"data/data.json",
	dataType:'json'
}).done(function(d){
	db = d;
});



function makeSection5(){
	if(!rebounce(db.length,makeSection5,[])) return;

	showDataList(db,$("#userlist-template").html(),"#page-show .userlist");
}
function makeSection6(){
	if(!rebounce(db.length,makeSection6,[])) return;

	var user = db.filter(obj=>obj.id==localStorage.chosenId);
	if(user.length) showDataList(user,$("#user-template").html(),"#page-user [data-role='main']");
	else {
		$("#page-user [data-role='main']").html("No one selected.<br><a href='#page-show' data-role='jump'>Back to List</a>")
	}
}


$(function(){
	console.log("local")

	// Adding a pageshow event listener is very easy to do
	$(document).on("pageshow",function(e){

		// Each pageshow event is passed an object with a nextPage and prevPage
		// These have title, url, and el properties

		switch(e.detail.nextPage.title) {
			case "page-show": makeSection5(); break;
			case "page-user": makeSection6(); break;
		}


		$("footer[data-role='footer'] .active").removeClass("active");
		$("footer[data-role='footer'] a[href='#"+e.detail.nextPage.title+"']").addClass("active");
	})


	$("body")
	.on("mousedown touchstart",".userlist .user-visit",function(){
		localStorage.chosenId = $(this).data("id");
	})

	// pt = new ProtoTight();

})