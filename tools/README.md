

# AppTools Documentation

- [showDataList](#user-content-show-data-list)
- [makeDataTemplate](#user-content-make-data-template)
- [rebounce](#user-content-re-bounce)
- [readFiles](#user-content-read-files)


---

## Show Data List

**showDataList()** Stamp data onto a template

### Usage

> *string* **showDataList**( *object,array* **Data** , *string* **Template** [, *string* **OutputSelector** ] )

### Parameters

<dl>
	<dt>Data</dt>
	<dd>Either an *object* or *array of objects*.</dd>
	<dt>Template</dt>
	<dd>A template *string* to have data stamped onto it.</dd>
	<dt>OutputSelector</dt>
	<dd>An optional selector *string* of an element to place the output.</dd>
</dl>

### Return

> Return value is a *string* with **Data** stamped onto the **Template**. 

### Examples

```javascript
let output = showDataList(
	{name:"George"},
	"<div><%= name %></div>"
);

output: "<div>George</div>"
```

```javascript
showDataList(
	[{name:"George"},{name:"Frank"}],
	"<div><%= name %></div>",
	".output"
);

.output: "<div>George</div><div>Frank</div>"
```

---

## Make Data Template

**makeDataTemplate()** Create a curried templating function

### Usage

> *string* **makeDataTemplate**( *string* **Template** [, *array* **Markup** ] )( *object* **Data** )

### Parameters

<dl>
	<dt>Template</dt>
	<dd>A template *string* to have data stamped onto it.</dd>
	<dt>Markup</dt>
	<dd>An optional *array* containing two strings which represent markup for data in the Template</dd>
	<dt>Data</dt>
	<dd>Either an *object* with properties matching strings in the **Template**</dd>
</dl>

### Return

> Initial return is a *function* which can be called with a **Template** *string*.

> The return of the second *function* is a *string* with **Data** stamped onto the **Template**. 

### Examples

```javascript
let templater = makeDataTemplate("<div><%= name %></div>");
templater({name:"George"});
templater({name:"Frank"});

output: "<div>George</div>\n<div>Frank</div>"
```

```javascript
let output = makeDataTemplate("<div><%= name %></div>")({name:"George"});

output: "<div>George</div>"
```

Custom markup can be created


```javascript
let output = makeDataTemplate("<div>{{name}}</div>",["{{","}}"])({name:"George"});

output: "<div>George</div>"
```

---

## Re Bounce

**rebounce()** If check is false, execute callback function with arguments

### Usage

> *Boolean* **rebounce**( *value* **Data** , *function* **Callback** , *array* **Arguments** [, *number* **Timer** ] )

### Parameters

<dl>
	<dt>Data</dt>
	<dd>A *value* to be chacked for truth.</dd>
	<dt>Callback</dt>
	<dd>A *function* to be called if **Data** equals false.</dd>
	<dt>Arguments</dt>
	<dd>An *array* of arguments to be passed into the **Callback**.</dd>
	<dt>Timer</dt>
	<dd>An optional *integer* representing milliseconds to wait before running the **Callback**.</dd>
</dl>

### Return

> Returns true or false depending on **Data** truey status.

### Example

```javascript
const checker = function(v) {
    if(!rebounce(tocheck,checker,arguments)) return;
    // run code if tocheck is true
}
```

---

## Read Files

**readFiles()** Read through file input files after loading

### Usage

> **rebounce**( *FileSet* **Files** , *function* **Callback** )

### Parameters

<dl>
	<dt>Files</dt>
	<dd>A *fileset* from an input with type="file".</dd>
	<dt>Callback</dt>
	<dd>A *function* to be called when **Files** have finished loading.</dd>
</dl>

### Examples

```javascript
document.querySelector("input[type='file']").addEventListener("change",function() {
  readFiles(this.files, e => console.log(e.target.result); );
});
```

---