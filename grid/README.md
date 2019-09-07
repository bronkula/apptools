# Responsive Grid

### .row

Use as direct parent of .col elements

### .row.gap

Use to add space between columns

### .col

Use a column element for each space in the grid

### -xs, -sm, -md, -lg, -xl

This is a mobile first grid, so think in -xs first, then respond up

### -1 through -12

Set how many column sizes this element will cross



### [.grid]

Use to fix row gap in flex grid only


---

```
<div class="row gap">
	<div class="col-xs-12 col-md-6"></div>
	<div class="col-xs-12 col-md-6"></div>
</div>
```

```
<div class="row">
	<div class="col-xs-12 col-md-4"></div>
	<div class="col-xs-12 col-md-4"></div>
	<div class="col-xs-12 col-md-4"></div>
</div>
```

```
<div class="row gap">
	<div class="col-xs-6 col-md-3"></div>
	<div class="col-xs-6 col-md-3"></div>
	<div class="col-xs-6 col-md-3"></div>
	<div class="col-xs-6 col-md-3"></div>
</div>
```