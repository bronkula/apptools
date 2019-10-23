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
const showDataList = function(object_array,template_string,target_selector){
	let output = "";
	const template_function = makeDataTemplate(template_string);
	if(Array.isArray(object_array)){
		for(let i in object_array) {
			output += template_function(object_array[i]);
		}
	} else output = template_function(object_array);
	if(target_selector) document.querySelector(target_selector).innerHTML = output;
	return output;
}


const reduceData = (a,s) => {
	s = makeDataTemplate(s);
	return (Array.isArray(a)?a:[a]).reduce((r,o)=>r+s(o));
}

// a = array or object, f = template function, t = target output
const makeTemplate = (a,f,t) => {
	let o = (Array.isArray(a)?a:[a]).reduce(f,'');
	if(t) $(t).html(o);
	return o;
}
/*

Example 1:
makeTemplater((r,o)=>r+`<div>${o.name}</div>`)({name:"Bryan"});
Example 2:
const makePage = makeTemplater((r,o)=>r+`<div>${o.name}</div>`);
makePage({name:Bryan});
*/
const makeTemplater = tf => oa => (Array.isArray(oa)?oa:[oa]).reduce((r,o,i,a)=>r+tf(o,i,a),'');


/*
This function takes a template_string using <%= %> style templates
it outputs a function which can be passed an object to stamp onto the string

Example:
var fn = makeDataTemplate("Name: <%= name %>");
var output = fn({name:"George"});

Return:
`Name: George`

Example 2:
var output = makeDataTemplate("Name: <%= name.first %>")({name:{first:"George"}});

Return:
`Name: George`
*/
const makeDataTemplate = function(template_string,markup=['<%=','%>']){
	const getProp = function(obj, prop) {
	    let _i;
	    prop = prop.trim();
	    if(!obj || !prop) return obj;
	    // Check for array notation
	    _i = /(.*?)\[(\d+)\]\.?(.*)/.exec(prop);
	    if(_i !== null) {
	        if(_i[1] && _i[3]) return getProp(obj[_i[1]][_i[2]],_i[3]);
	        if(_i[3]) return getProp(obj[_i[2]],_i[3]);
	        if(_i[1]) return obj[_i[1]][_i[2]];
	        return obj[_i[2]];
	    }
	    // Check for object notation
	    _i = prop.indexOf('.');
	    if(_i > -1) return getProp(obj[prop.substr(0, _i)], prop.substr(_i + 1));
	    return obj[prop];
	}
	let rep = RegExp(`${markup[0]}\\s*(.+?)\\s*${markup[1]}`);
	return function(data) {
		// Get text of the element making sure it's proper text
        let output = (function(html) {
            let txt = document.createElement("textarea");
            txt.innerHTML = html;
            return txt.value;
        })(template_string);
        let m;
        // Loop through the string replacing syntax with data
		while(m = rep.exec(output)) {
			let s = m[1].split(":");
			// Use getprop to get sub property values
			let v = getProp(data,s[0]);
			output = 
				m.input.substr(0,m.index) +
				(v!==undefined?v:(s[1]===undefined?"[undefined]":s[1])) +
				m.input.substr(m[0].length+m.index);
		}
		return output;
	}
}




/*
This function takes an array of objects,
a search_string to search for in each object,
an array of search_properties in each object to search through

The result is a filtered array of matching objects

Example:
searchProps(
	[{name:'George',email:'george@gmail.com'},{name:'Frank',email:'frank@gmail.com'}],
	'George',
	'email,name'
	);
	
Return:
[{name:'George',email:'george@gmail.com'}]
*/
const searchProps = (arr,str,props) => arr.filter( li =>
	(Array.isArray(props)?props:props.split(",")).filter( o =>
		RegExp(str,'i').test(li[o])
	).length
);




/*
Rebounce
It takes in a variable value to check for truey
It takes a return function to call if the check is falsey
It gets passed an arguments array of values to call with the fn callback
It can be passed a timer value for when to check next

Example:
let somearray = [1]
function fooFunction(){
	if(!rebounce(somearray.length,fooFunction,arguments)) return;
	// some code
}
*/
const rebounce = (check,fn,args,timer=100) =>
	!!check || !setTimeout(() => fn.apply(null,args) , timer);






/*
This function will recursively call itself until a list of files has been loaded into a page with javascript,
and will fire a callback function for each file as they are loaded.

demo: https://codepen.io/bronkula/pen/bvrgxQ

example:
$("input[type='file']").on("change",function() {
  readFiles(this.files, function(e){ $(".output").attr({src:e.target.result}); });
});
*/
const readFiles = function(files,callback,index=0) {
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


