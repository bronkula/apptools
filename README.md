# Apptools
A Javascript toolset for app development

## Contents
- [ProtoTight](#user-content-prototight)
- [Apptools](#user-content-apptools)
- [Smallcode](#user-content-smallcode-min)


## ProtoTight
**[ProtoTight Demo](https://bronkula.github.io/apptools/proto/demo)**

ProtoTight is a tool for prototyping. I wanted a simple unopinionated page routing tool with enough tools that a person with a moderate knowledge of html and css could use it. There is an entire frontend css framework under the hood of this project that is quite robust, but no node or anything like that is required.

## Apptools

Tools that can be useful when creating a dynamic frontend application. Many functions dealing with templating data onto a page are present here.


### Show Data List

**showDataList()** Stamp data onto a template

*Usage*

*[String]* **showDataList**(*(Object|Array)* **Data**, *(String)* **Template** [, *(String)* **OutputSelector**])

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

*[String]* **makeDataTemplate**(*(String)* **Template**)(*(Object)* **Data**)

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


## Smallcode

An art project for tiny versions of smallcode.