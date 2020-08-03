# Helpers Documentation
- [Distribution](#user-content-distribution)
	- [Current Version](#user-content-current-version)
- [App Tools](#user-content-app-tools)
	- [Query.js](#user-content-queryjs)
- [Draw Tools](#user-content-draw-tools)

---

## Distribution

### Current Version
v0.3.36

- **[query.min.js](https://cdn.jsdelivr.net/gh/bronkula/apptools@v0.3.36/tools/dist/query.min.js)**
- **[query-lite.min.js](https://cdn.jsdelivr.net/gh/bronkula/apptools@v0.3.36/tools/dist/query-lite.min.js)**
- **[query-route.min.js](https://cdn.jsdelivr.net/gh/bronkula/apptools@v0.3.36/tools/dist/query-route.min.js)**
- **[drawtools.min.js](https://cdn.jsdelivr.net/gh/bronkula/apptools@v0.3.36/tools/dist/drawtools.min.js)**

## App Tools

### Query.js

#### Q Core

- q.isElement
- q.isHTML
- q.isSVG
- q.isString
- q.isFunction
- q.isQ
- q.isArray
- q.isHTMLString
- q.make
- q.extend
- q.hasExtension
- q.sift
- q.settle

#### Q Extensions

- q().sift
- q().pipe
- q().is
- q().not

#### Array Extensions

- q().forEach
- q().map
- q().flatMap
- q().reduce
- q().some
- q().every
- q().filter

#### Traversal Extensions

- q().toArray
- q().find
- q().next
- q().prev
- q().parent
- q().closest
- q().children
- q().last
- q().first
- q().siblings

#### Manipulation Core

- q.setCSS
- q.setAttr
- q.setVal
- q.setHTML
- q.setCache
- q.setData
- q.getData
- q.toPropCase

#### Manipulation Extensions

- q().remove
- q().clear
- q().append
- q().appendTo
- q().prepend
- q().prependTo
- q().before
- q().after
- q().addClass
- q().removeClass
- q().toggleClass
- q().hasClass
- q().addAttr
- q().removeAttr
- q().toggleAttr
- q().hasAttr
- q().css
- q().attr
- q().data
- q().val
- q().html


#### Events Core

- q.getPath
- q.inPath
- q.evPoints
- q.getEXY
- q.getEventXY


#### Events Extensions

- q().on
- q().delegate


#### Fetch Core

- q.fetch
- q.fetchAll
- q.fetchEach
- q.post


### Details

- **[query.min.js](https://github.com/bronkula/apptools/blob/master/tools/bin/query.min.js)**
- **[apptools.min.js](https://github.com/bronkula/apptools/blob/master/tools/bin/apptools.min.js)**

This set of tools is a small simplified alternative to some basic jQuery functionality for selecting elements and delegating events.

- [q](#user-content-q)
- [on](#user-content-on)

---

### q

#### Usage

> *NodeList* **q**( *string* **Selector** )

Return a DOM NodeList

#### Parameters

<dl>
	<dt>Selector</dt>
	<dd>A selector of an element to place the output. It can optionally be a DOM object, or a NodeList.</dd>
</dl>

#### Return

> *NodeList* 

#### Examples

```javascript
let el1 = q(".container");
let el2 = q("dl dt");
let el3 = q(document.querySelector("#section1"));
```

---

### .on()

#### Usage

> *NodeList* **qon**( *string* **Selector** ) ( *string* **EventString**, *function* **Callback** )

Curried 

#### Parameters

<dl>
	<dt>Selector</dt>
	<dd>A selector of an element to place the output. It can optionally be a DOM object, or a NodeList.</dd>
</dl>

#### Return

> *NodeList* 

#### Examples

```javascript
let el1 = q(".container");
let el2 = q("dl dt");
let el3 = q(document.querySelector("#section1"));
```

---
---

## Draw Tools

---

This document is a work in progress.



### templater

#### Usage

> *string* **templater**( *function* **TemplateFunction** [, *string* **InitialString** ] )( *string* **OutputSelector** )( *array* **ObjectArray** )

Stamp data onto a template

#### Parameters

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

#### Return

> There are three return values, one from each step.
> 1. A function which has a stored template function
> 2. A function which has a stored output selector
> 3. A string representing a converted output

#### Examples

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