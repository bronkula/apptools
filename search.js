// Requires Lodash full build for .filter and .template
// https://cdn.jsdelivr.net/npm/lodash@4.17.5/lodash.min.js


/* 
This function takes an array of objects, 
stamps each object onto a lodash template string, 
then places that output into a target_selector jQuery element
or returns the output string if no target_selector is given

example:
showDataList(
	[{x:10,y:10},{x:20,y:5}],
	`<div><%= x %> x <%= y %></div>`,
	'.output'
	);
*/
function showDataList(object_array,template_string,target_selector){
	var output = "";
	var templ = _.template(template_string);
	for(var i in object_array) {
		output += templ(object_array[i]);
	}
	if(!target_selector) return output;
	else document.querySelector(target_selector).innerHTML = output;
}


/*
This function takes an array of objects,
a search_string to search for in each object,
a string of comma separated search_properties in each object to search in,
an optional function that will be passed the output array

example:
searchDataList(
	[{name:'George',email:'george@gmail.com'},{name:'Frank',email:'frank@gmail.com'}],
	'George',
	'email,name'
	);
*/
function searchDataList(object_array,search_string,search_properties,fn){
	var prop_search = search_properties.split(",");
	var arr = object_array.filter(obj=>{
		for(let i in prop_search) {
			if(RegExp(search_string,'i').test(obj[prop_search[i]])) return true;
		}
		return false;
	});
	if(fn === undefined) return arr;
	else fn(arr);
}
