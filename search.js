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
// function makeDataTemplate(template_string){
// 	return function(data) {
// 		var output = template_string;
// 		for(let key in data){
// 			if(data.hasOwnProperty(key) === false) continue;
// 			output = output.replace(RegExp('<%=\s*' + key + '\s*%>', 'g'), data[key]);
// 		}
// 		output = output.replace(RegExp('<%=\s*\S+?\:(\S+?)\s*%>', 'g'), '$1');
// 		return output;
// 	}
// }
function makeDataTemplate(template_string){
	return function(data) {
		var output = template_string,rep = /<%=\s*(.+?)\s*%>/,m,v,s;
		while(m = rep.exec(output)) {
			s = m[1].split(":");
			v = fetchFromObject(data,s[0]);
			output = m.input.substr(0,m.index)+
			(v?v:(s[1]===undefined?"[undefined]":s[1]))+
			m.input.substr(m[0].length+m.index);
		}
		return output;
	}
}
// https://stackoverflow.com/questions/4255472/javascript-object-access-variable-property-by-name-as-string#answer-26407251
function fetchFromObject(obj, prop) {
    if(typeof obj === 'undefined') return false;
    var _index = prop.indexOf('.')
    if(_index > -1) return fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
    return obj[prop];
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
	return object_array.filter(obj=>{
		for(let i in search_properties) {
			if(RegExp(search_string,'i').test(obj[search_properties[i]])) return true;
		}
		return false;
	});
}





/*
This function waits for an array to have some elements,
It recursively calls itself until the array has objects in it
*/
function waitForData(object_array,callback_function,passthrough_arguments){
	if(!object_array || !object_array.length) {
		setTimeout(function(){
			callback_function.apply(this,passthrough_arguments);
		},150);
		return false;
	}
	return true;
}