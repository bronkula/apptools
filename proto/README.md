# Proto

Proto is a tool for swiftly prototyping Single Document, Multi Page applications. It attempts to be unopinionated, and there is a tool set available for use on any project.

We have borrowed heavily from the syntax of jQuery mobile in order to create something familiar. But, whereas jQuery mobile has a habit of grabbing items and replacing and changing them, Proto simply adds functionality, sparingly, to the document.

##Pages

Pages are created using a data-role="page" attribute.

```
<section data-role="page" id="page1"></section>
```

##Jumps

Create proto-jump links to move from page to page.

```
<a href="#page1" class="proto-jump">Page 1</a>
```

And that's about it that you NEED to know. Go make a clickthrough prototype of your app using all your html and css knowledge and let proto hop between pages for you.