
;(()=>{
if(!q) throw "qjs not imported yet";

/* required */
q.extend('find',function(s){
    return q(this.reduce((r,o)=>[...r,...q(s,o).toArray()],[])); });



q.getPath = e => e.path || (e.composedPath && e.composedPath());
q.inPath = (e,t) => q.getPath(e).some(o=>o==t);



/* Return an array of either touches or a click */
q.evPoints = e =>
    e.type.substring(0,5)!="touch"?[e]:
    !e.touches.length?e.changedTouches:e.touches;
/* Return an offset xy object for the position of the click or touch in the object */
/* Pass in an optional object that will be used for basis */
q.getEXY = (e,o) => {
    let r = (o||e.target).getBoundingClientRect();
    return ({ x:e.pageX-r.left, y:e.pageY-r.top }); }
/* Return the first xy position from an event, whether touch or click */
q.getEventXY = (e,o) =>
    q.getEXY(q.evPoints(e)[0],o);



/* Apply events to Q elements */
q.extend('on',function(eventString,fn,capture=false) {
    eventString.trim().split(/\s+/).forEach(event=>{
        this.forEach(el=>{
            return el.addEventListener(event,fn,capture)
        })
    });
    return this;
});
/* Delegate events to children of Q elements */
q.extend('delegate',function(eventString,selector,fn) {
    this.on(eventString,event=>{
        return this.find(selector).forEach(o=>{
            return q.inPath(event,o)?fn.call(o,event,o):0
        })
    },{capture:true});
    return this;
});

})();