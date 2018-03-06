# Proto

[Proto Demo](https://bronkula.github.io/apptools/proto/)

Proto is a tool for swiftly prototyping Single Document, Multi Page applications. It attempts to be unopinionated, and there is a tool set available for use on any project.

We have borrowed heavily from the syntax of jQuery mobile in order to create something familiar. But, whereas jQuery mobile has a habit of grabbing items and replacing and changing them, Proto simply adds functionality, sparingly, to the document.

## Getting Started

Download the proto.css and proto.js files. You'll need to have jQuery as well.

```
<link href="proto.css">
<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script src="proto.js">
```

## Pages

Pages are created using a data-role="page" attribute.

```
<section data-role="page" id="page1"></section>
```

## Jumps

Create proto-jump links to move from page to page.

```
<section data-role="page" id="page1">
	<a href="#page2" class="proto-jump">Go to Page 2</a>
</section>
<section data-role="page" id="page2">
	<a href="#page1" class="proto-jump">Go to Page 1</a>
</section>
```

## PageShow

Since there's only one document ready call on an app like this, you might need to be able to run code any time a page is loaded. So there's a "pageshow" event available to you every time a page loaded onto the page.

```
$(document).on("pageshow",function(e,o){
	console.log(e,o);
})
```

The pageshow event is passed to objects. A regular event object, and a Proto object containing two properties .nextPage and .prevPage. These will help you do something based on which page you were coming from and which page is about to be shown.

## That's all you NEED to know

There's some other stuff in there, obviously. You can see there a number of little tools built in, like an accordion, and a modal, and all that kind of stuff. But those aren't necessary. You can see that there is a single proto.css file, but the scss files have been split into core and theme. The core files are the only thing that's actually necessary to make proto run correctly. The theme content is there to use if wanted, and you can see most of that in action in the [Proto Demo](https://bronkula.github.io/apptools/proto/).