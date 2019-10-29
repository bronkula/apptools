
;(()=>{

/* required */
q.extend('find',function(s){
    return q(this.reduce((r,o)=>[...r,...q(s,o).toArray()],[])); });



q.getPath = e => e.path || (e.composedPath && e.composedPath());
q.inPath = (e,t) => q.getPath(e).some(o=>o==t);


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