# AppTools Documentation

- [showDataList](#user-content-show-data-list)
- [makeDataTemplate](#user-content-make-data-template)
- [rebounce](#user-content-re-bounce)
- [readFiles](#user-content-read-files)


---

## Show Data List

### Usage

> *string* **showDataList**( *object,array* **Data** , *string* **Template** [, *string* **OutputSelector** ] )

Stamp data onto a template

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

## Search Data Template

### Usage

> *string* **makeDataTemplate**( *string* **Template** [, *array* **Markup** ] )( *object* **Data** )

Create a curried templating function

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

## Search Data List

### Usage

> *string* **searchDataList**( *object,array* **Data** , *string* **SearchTerm** , *string,array* **PropertiesToSearch** )

Search through multiple properties of an object array to find matches

### Parameters

<dl>
	<dt>Data</dt>
	<dd>Either an *object* or *array of objects*.</dd>
	<dt>SearchTerm</dt>
	<dd>A *string* to search for.</dd>
	<dt>PropertiesToSearch</dt>
	<dd>Either an *array* or comma separated *string* of properties to search through in each object of the array.</dd>
</dl>

### Return

> Returns a new *array* containing only elements from the **Data** with **PropertiesToSearch** values matching the **SearchTerm**.

### Examples

```javascript
let users = [{name:'George',email:'george@gmail.com'},{name:'Frank',email:'frank@gmail.com'}]
let result = searchDataList( users, 'George', 'email,name' );

result: [{name:'George',email:'george@gmail.com'}];
```

---

## Re Bounce

### Usage

> *Boolean* **rebounce**( *value* **Data** , *function* **Callback** , *array* **Arguments** [, *number* **Timer** ] )

If Data check is false, execute callback function with arguments

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

### Usage

> **rebounce**( *FileSet* **Files** , *function* **Callback** )

Read through file input files after loading

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