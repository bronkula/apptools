;(()=>{
if(!q) throw "qjs not imported yet";

console.log(q.extend)

/* Manipulation functions of q elements */
q.setAttr = function(o,e) {
    for(let i in e) { if(e.hasOwnProperty(i)){ o.setAttribute(i,e[i]); } }
    return o; }
q.setCache = function(o,k,v) {
    if(o.qcache===undefined) o.qcache = {};
    o.qcache[k]=v; }
q.setData = function(o,e) {
    if(o.qcache===undefined) o.qcache = {};
    for(let i in e) { if(e.hasOwnProperty(i)){ o.qcache[i]=e[i]; } } return o; }
q.getData = function(o,e) {
    if(o.qcache===undefined)
        for(let [k,v] of Object.entries(o.dataset))
            q.setCache(o,k,JSON.data.parse(v));
    if(o.dataset[e]!==undefined&&o.qcache[e]!=o.dataset[e])
        q.setCache(o,e,JSON.parse(o.dataset[e]));
    return o.qcache[e]; }

	
/* Manipulation methods */
q.extend('remove',function(){
    return this.sift(o=>{o.parentElement.removeChild(o); return false; }) });
q.extend('append',function(e){
    return this.sift(o=>e.map(el=>{ o.appendChild(el); return o; })); });
q.extend('appendTo',function(e){
    return this.sift(o=>e.map(el=>{ el.appendChild(o); return o; })); });
q.extend('prepend',function(e){
    return this.sift(o=>e.map(el=>{ o.insertBefore(el,o.children[0]); return o; })); });

q.extend('style',function(e){
    if(q.isString(e)) return this[0].style[e];
    return this.sift(o=>{ Object.assign(o.style,e); return o; }); });
q.extend('attr',function(e){
    if(q.isString(e)) return this[0].getAttribute(e);
    return this.sift(o=>q.setAttr(o,e)); });
q.extend('data',function(e){
    if(q.isString(e)) return q.getData(this[0],e);
    return this.sift(o=>q.setData(o,e)); });

})();