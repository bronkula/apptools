/* Ham Apptools created by Hamilton Cline http://hamiltondraws.com */



/* 
This function takes an array of objects, 
stamps each object onto a lodash template string, 
then places that output into a target_selector jQuery element
or returns the output string if no target_selector is given

example:
showDataList(
	[{x:10,y:10},{x:20,y:5}],
	`<div><%= x %> x <%=y%></div>`,
	'.output'
	);
*/
function showDataList(object_array,template_string,target_selector){
	var output = "";
	var template_function = makeDataTemplate(template_string);
	for(let i in object_array) {
		output += template_function(object_array[i]);
	}
	if(!target_selector) return output;
	else document.querySelector(target_selector).innerHTML = output;
}
/*
This function takes a template_string using <%= %> style templates
it outputs a function which can be passed an object to stamp onto the string

example:
var fn = makeDataTemplate("Name: <%= name %>");
var output = fn({name:"George"});
*/
function makeDataTemplate(template_string){
	return function(data) {
		var output = template_string;
		for(let key in data){
			if(data.hasOwnProperty(key) === false) continue;
			output = output.replace(RegExp('<%=\s*' + key + '\s*%>', 'g'), data[key]);
		}
		return output;
	}
}




/*
This function takes an array of objects,
a search_string to search for in each object,
an array of search_properties in each object to search through,
an optional function that will be passed the output array

example:
searchDataList(
	[{name:'George',email:'george@gmail.com'},{name:'Frank',email:'frank@gmail.com'}],
	'George',
	'email,name'
	);
*/
function searchDataList(object_array,search_string,search_properties,fn){
	var arr = object_array.filter(obj=>{
		for(let i in prop_search) {
			if(RegExp(search_string,'i').test(obj[search_properties[i]])) return true;
		}
		return false;
	});
	if(fn === undefined) return arr;
	else fn(arr);
}
