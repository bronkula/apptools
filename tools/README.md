# Helpers Documentation
- [templater](#user-content-templater)

---

## templater

### Usage

> *string* **templater**( *function* **TemplateFunction** [, *string* **InitialString** ] )( *string* **OutputSelector** )( *array* **ObjectArray** )

Stamp data onto a template

### Parameters

<dl>
	<dt>TemplateFunction</dt>
	<dd>A callback *function* which represents a backtick template string.</dd>
	<dl>
		<dt>InitialString</dt>
		<dd>An optional *string* which would initialize the output string.</dd>
	</dl>
	<dt>OutputSelector</dt>
	<dd>An optional selector *string* of an element to place the output.</dd>
	<dt>ObjectArray</dt>
	<dd>An *array* of objects, or an *object*, to be iterated over.</dd>
</dl>

### Return

> There are three return values, one from each step.
> 1. A function which has a stored template function
> 2. A function which has a stored output selector
> 3. A string representing a converted output

### Examples

```javascript
let makeName = templater(o=>`<div>${o.name}</div>`)();
makeName({name:"George"});
makeName({name:"Fred"});

output: "<div>George</div><div>Fred</div>"
```

```javascript
templater(o=>`<div>${o.name}</div>`)(".output")(
	[{name:"George"},{name:"Fred"}]
);

.output: "<div>George</div><div>Fred</div>"
```



# AppTools Documentation

- [showDataList](#user-content-show-data-list)
- [makeDataTemplate](#user-content-make-data-template)
- [searchProps](#user-content-search-props)
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

## Make Data Template

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

## Search Props

### Usage

> *string* **searchProps**( *array* **ObjectArray** , *string* **SearchTerm** , *string,array* **PropertiesToSearch** )

Search through multiple properties of an object array to find matches

### Parameters

<dl>
	<dt>ObjectArray</dt>
	<dd>An *array of objects*.</dd>
	<dt>SearchTerm</dt>
	<dd>A *string* to search for.</dd>
	<dt>PropertiesToSearch</dt>
	<dd>Either an *array* or comma separated *string* of properties to search through in each object of the array.</dd>
</dl>

### Return

> Returns a new *array* containing only elements from the **ObjectArray** with **PropertiesToSearch** values matching the **SearchTerm**.

### Examples

```javascript
let users = [{name:'George',email:'george@gmail.com'},{name:'Frank',email:'frank@gmail.com'}]
let result = searchProps( users, 'George', 'email,name' );

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
	<dd>A *value* to be checked for truth.</dd>
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