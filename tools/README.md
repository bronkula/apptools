

## AppTools Documentation

- [showDataList](#user-content-show-data-list)
- [makeDataTemplate](#user-content-make-data-template)
- [rebounce](#user-content-re-bounce)
- [readFiles](#user-content-read-files)


---

### Show Data List

**showDataList()** Stamp data onto a template

*Usage*

*string* **showDataList**( *object,array* **Data** , *string* **Template** [, *string* **OutputSelector** ] )

*Parameters*

**Data**

   Either an *object* or *array or objects*.

**Template**

   A template *string* to have data stamped onto it.

**OutputSelector**

   An optional selector *string* of an element to place the output.

*Return*

Return value is a *string* with **Data** onto the **Template**. 

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

*string* **makeDataTemplate**( *string* **Template** [, *array* **Markup** ] )( *object* **Data** )

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

Custom markup can be created


```
let output = makeDataTemplate("<div>{{name}}</div>",["{{","}}"])({name:"George"});

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