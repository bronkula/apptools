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


---

---

... This document might need an update soon. 
