# Apptools
A Javascript toolset for app development

## Contents
- [ProtoTight](#user-content-prototight)
- [Apptools](#user-content-apptools)
- [Smallcode](#user-content-smallcode)


---


## ProtoTight
- **[ProtoTight Demo](https://bronkula.github.io/apptools/blob/master/proto/demo)**
- **[ProtoTight Repo](https://github.com/bronkula/apptools/blob/master/proto)**

ProtoTight is a tool for prototyping. I wanted a simple unopinionated page routing tool with enough tools that a person with a moderate knowledge of html and css could use it. There is an entire frontend css framework under the hood of this project that is quite robust, but no node or anything like that is required.


---


## Apptools

Tools that can be useful when creating a dynamic frontend application. Many functions dealing with templating data onto a page are present here.

- **[Apptools.js](https://github.com/bronkula/apptools/blob/master/tools/apptools.js)**
- **[Apptools tests](https://bronkula.github.io/apptools/tests/apptools_tests.html)**


### AppTools Documentation

- [showDataList](#user-content-show-data-list)
- [makeDataTemplate](#user-content-make-data-template)
- [rebounce](#user-content-re-bounce)
- [readFiles](#user-content-read-files)


---

### Show Data List

**showDataList()** Stamp data onto a template

*Usage*

*string* **showDataList**( *object,array* **Data** , *string* **Template** [, *string* **OutputSelector** ] )

*Example*

```
let output = showDataList(
	{name:"George"},
	"<div><%= name %></div>"
);

output: "<div>George</div>"
```

```
showDataList(
	[{name:"George"},{name:"Frank"}],
	"<div><%= name %></div>",
	".output"
);

.output: "<div>George</div><div>Frank</div>"
```

---

### Make Data Template

**makeDataTemplate()** Create a curried templating function

*Usage*

*string* **makeDataTemplate**( *string* **Template** )( *object* **Data** )

*Example*

```
let templater = makeDataTemplate("<div><%= name %></div>");
templater({name:"George"});
templater({name:"Frank"});

output: "<div>George</div>\n<div>Frank</div>"
```

```
let output = makeDataTemplate("<div><%= name %></div>")({name:"George"});

output: "<div>George</div>"
```

---

### Re Bounce

**rebounce()** If check is false, execute callback function with arguments

*Usage*

*Boolean* **rebounce**( *value* **Data** , *function* **Callback** , *array* **Arguments** [, *number* **Timer** ] )

*Example*

```
const checker = function(v) {
    if(!rebounce(tocheck,checker,arguments)) return;
    // run code if tocheck is true
}
```

---

### Read Files

**readFiles()** Read through file input files after loading

*Usage*

**rebounce**( *FileSet* **Files** , *function* **Callback** )

*Example*

```
document.querySelector("input[type='file']").addEventListener("change",function() {
  readFiles(this.files, e => console.log(e.target.result); );
});
```

---


## Smallcode

- **[Smallcode.js](https://github.com/bronkula/apptools/blob/master/small/smallcode.js)**
- **[Smallcode.min.js](https://github.com/bronkula/apptools/blob/master/small/smallcode.js)**

An art project for tiny versions of smallcode.

The min code is hand written small code examples and sort of an art project.