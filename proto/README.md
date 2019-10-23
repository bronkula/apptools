# ProtoTight

## Contents
- **[ProtoTight Demo](https://bronkula.github.io/apptools/proto/demo)**
- [Getting Started](#user-content-getting-started)
- [Documentation](#user-content-documentation)

---

ProtoTight is a tool for swiftly prototyping Single Document, Multi Page applications. It attempts to be unopinionated, and there is a tool set available for use on any project.

We have borrowed heavily from the syntax of jQuery mobile in order to create something familiar. But, whereas jQuery mobile has a habit of grabbing items and replacing and changing them, ProtoTight simply adds functionality, sparingly, to the document.

## Getting Started

Download the proto_core.css and proto.js files. Then start up a new ProtoTight object. We have made sure that ProtoTight doesn't have any dependencies of its own, so it can be dropped into any project.

```
<link href="proto_core.css" rel="stylesheet">
<script src="proto.js"></script>
```

## Pages

Pages are created using a data-role="page" attribute.

```
<section data-role="page" id="page1"></section>
```

## Jumps

Create data-role="jump" links to move from page to page.

```
<section data-role="page" id="page1">
    <a href="#page2" data-role="jump">Go to Page 2</a>
</section>
<section data-role="page" id="page2">
    <a href="#page1" data-role="jump">Go to Page 1</a>
</section>
```

ProtoTight will handle all the history states of routing around your application.

## PageShow

Since there's only one document ready call on an app like this, you might need to be able to run code any time a page is loaded. So there's a "pageshow" event available to you every time a page is loaded onto the page.

```
<script>
window.document.querySelector(document)
    .addEventListener("pageshow",function(e){
        // Run some code
    })
</script>
```

The pageshow event is passed a regular event object. The details property of that event object contains a ProtoTight object containing two properties nextPage and prevPage. These will help you do something based on which page you were coming from and which page is about to be shown.

## That's all you NEED to know

There's some other stuff in there, obviously. You can see there are a number of little tools built in, like an activator and a templating system, and all that kind of stuff. But those aren't necessary. You can see that there is a single proto_theme.min.css file, but the scss files have been split into sub files so that you can customize to your heart's content. The core code is the only thing that's actually necessary to make protoTight run correctly. The theme content is there to use if wanted, and you can see most of that in action in the [ProtoTight Demo](https://bronkula.github.io/apptools/proto/demo).

---
---

## Documentation

## Contents
- [ProtoTight Demo](https://bronkula.github.io/apptools/proto/demo)
- [Data Roles](#user-content-data-roles)
- [Data Activators](#user-content-data-activators)
- [Data Templates](#user-content-data-templates)

---

### Data Roles

**[data-role]** Set a role to an element

*Values*

- page
- header
- main
- footer
- jump

*Example*

```
<section data-role="page" id="page1">
    <header data-role="header">Title</header>
    <div data-role="main">
        <a href="#page2" data-role="jump">Link</a>
    </div>
</section>
```

```
<section data-role="page" id="page2">
    <footer data-role="footer">Navigation</footer>
    <div data-role="main">
        <a href="#page1" data-role="jump">Link</a>
    </div>
</section>
```

---

### Data activators

**[data-toggle]** Toggle the active class of another element

*Values*

- next
- prev
- parent
- *selector*

*Example*

```
<div data-toggle="next">Click Me</div>
<div>I will activate and deactivate when the previous div is clicked</div>
```

```
<div data-toggle="#item1">Click Me</div>
<div id="item1">I will activate and deactivate when the previous div is clicked</div>
```

---

**[data-activate]** Add the active class to another element

*Values*

- next
- prev
- parent
- *selector*

*Example*

```
<div data-activate="next">Click Me</div>
<div>I will activate when the previous div is clicked</div>
```

```
<div data-activate="#item1">Click Me</div>
<div id="item1">I will activate when the previous div is clicked</div>
```

---

**[data-deactivate]** Remove the active class from another element

*Values*

- next
- prev
- parent
- *selector*

*Example*

```
<div data-deactivate="next">Click Me</div>
<div>I will deactivate when the previous div is clicked</div>
```

```
<div data-deactivate="#item1">Click Me</div>
<div id="item1">I will deactivate when the previous div is clicked</div>
```

---

### Data Templates

**[data-template]** Use another element's innerHTML to replace the innerHTML of this element

The data template will also take in the data attributes of the replacing element and stamp those onto the template element's html.

*Values*

- *selector*

*Example*

```
<footer data-template="#footer-template"></footer>
<script type="text/template" id="footer-template">
This text would show up in and replace any text in the [data-template] div.
</script>
```

```
<div data-template="#header-template" data-title="New Title"></div>
<script type="text/template" id="header-template">
<div>
    Use data attributes to replace content in templates
    <%= title %>
    The words "New Title" should replace the previous line.
</div>
</script>
```
