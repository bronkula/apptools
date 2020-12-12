;(()=>{
if(!q) throw "qjs not imported yet";





q.getPath = event => event.path || (event.composedPath && event.composedPath());
q.inPath = (event,target) => q.getPath(event).some(o=>o==target);



/* Return an array of either touches or a click */
q.evPoints = event =>
    event.type.substring(0,5)!="touch"?[event]:
    !event.touches.length?event.changedTouches:event.touches;
/* Return an offset xy object for the position of the click or touch in the object */
/* Pass in an optional object that will be used for basis */
q.getEXY = (event,obj) => {
    let r = (obj||event.target).getBoundingClientRect();
    return ({ x:event.pageX-r.left, y:event.pageY-r.top }); }
/* Return the first xy position from an event, whether touch or click */
/* Pass in an optional object that will be used for basis */
q.getEventXY = (event,obj) =>
    q.getEXY(q.evPoints(event)[0],obj);



/* Apply events to Q elements */
q.extend('on',function(eventString,fn,capture=false) {
    eventString.trim().split(/\s+/).forEach(event=>{
        this.forEach(el=>{
            return el.addEventListener(event,fn,capture);
        });
    });
    return this;
});
/* Delegate events to children of Q elements */
q.extend('delegate',function(eventString,selector,fn) {
    this.on(eventString,event=>{
        this.find(selector).forEach(o=>{
            if(q.inPath(event,o)) fn.call(o,event,o);
        });
    },{capture:true});
    return this;
});


})();