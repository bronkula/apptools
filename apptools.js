/* Ham Apptools created by Hamilton Cline http://hamiltondraws.com */



/* 
This function takes an array of objects, 
stamps each object onto a template string function, 
then places that output into a target_selector jQuery element
or returns the output string if no target_selector is given

Example:
showDataList(
	[{x:10,y:10},{x:20,y:5}],
	`<div><%= x %> x <%=y%></div>`,
	'.output'
	);

Return:
`<div>10 x 10</div><div>20 x 5</div>`
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

Example:
var fn = makeDataTemplate("Name: <%= name %>");
var output = fn({name:"George"});

Return:
`Name: George`
*/
function makeDataTemplate(template_string){
	return function(data) {
		var output = template_string,rep = /<%=\s*(.+?)\s*%>/,m,v,s;
		while(m = rep.exec(output)) {
			s = m[1].split(":");
			v = fetchFromObject(data,s[0]);
			output = m.input.substr(0,m.index)+
			(v!==undefined?v:(s[1]===undefined?"[undefined]":s[1]))+
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

Example:
searchDataList(
	[{name:'George',email:'george@gmail.com'},{name:'Frank',email:'frank@gmail.com'}],
	'George',
	'email,name'
	);
	
Return:
[{name:'George',email:'george@gmail.com'}]
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

Example:
function fooFunction(){
	if(!waitForData(barArray,fooFunction)) return;
	// some code
}
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






/*
This function will recursively call itself until a list of files has been loaded into a page with javascript,
and will fire a callback function for each file as they are loaded.

example:
$("input[type='file']").on("change",function() {
  readFiles(this.files, function(e){ $(".output").attr({src:e.target.result}); });
});
*/
function readFiles(files,callback,index=0) {
  if (files && files[0]) {
    let file = files[index++],
        reader = new FileReader();
    reader.onload = function(e){
      callback(e);
      if(index<files.length) readFiles(files,callback,index);
    }
    reader.readAsDataURL(file);
  }
}
