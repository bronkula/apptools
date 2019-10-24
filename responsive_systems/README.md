# Responsive Systems

Creating responsive systems is useful for prototypers or people who make new websites often. They allow a designer or developer to add quick responsive layouts at the beginning of a project.

## Breakpoint Systems

All these systems are built to use a breakpoint system involving simple keys. With these breakpoints a design can have simple layout responsiveness baked into it from the beginning.

The breakpoints in these systems will be represented as such:

| Breakpoint | Key | Value |
| --- | --- | --- |
| Extra Small | xs | 0 |
| Small | sm | 320px |
| Medium | md | 600px |
| Large | lg | 960px |
| Extra Large | xs | 1200px |

This means our breakpoints will represent a mobile first approach to their use. When dealing with any breakpoint classes, you will always think in terms of mobile first, and then move forward adding breakpoint changes as necessary. Although you might have an urge to think of these sizes in terms of devices, technically these systems are device agnostic, and simply try to fit into whatever screen size is given to them.

```html
<div class="col-xs-12 col-md-6"></div>
```

In this example we have set an extra small breakpoint to a 100% column, and a medium breakpoint to a 50% column. Skip breakpoints where no changes are made, and only add breakpoints when your layout changes.

## Flex System

The flex system gives a simple way of providing rudimentary flex box layout to designs. Things like widths and heights will still need to be given directly, but many common layout problems can be solved with just this system.

## Flex Grid System

A flex grid can still be useful to carry around as a backup for a proper CSS grid system. Some older browsers and devices still don't recognize grid, subgrid, or grid gap.

## Grid Grid System

This is a proper CSS grid design system. It uses a 12 column grid by default.

## Utilities System

The utilities expand on the initial systems concept and vastly increase the amount of classes available to a designer, using a simple naming convention to allow lots of design variances.