;(()=>{
if(!q) throw "qjs not imported yet";


/* Manipulation methods */
q.extend('remove',function(){
    return this.sift(o=>{ o.parentElement.removeChild(o); return false; }) });
q.extend('clear',function(){
    return this.sift(o=>{ o.innerHTML = ""; return o; }) });
q.extend('append',function(e){
    return this.sift(o=>e.map(el=>{ o.appendChild(el); return o; })); });
q.extend('appendTo',function(e){
    return this.sift(o=>e.map(el=>{ el.appendChild(o); return o; })); });
q.extend('prepend',function(e){
    return this.sift(o=>e.map(el=>{ o.insertBefore(el,o.children[0]); return o; })); });
q.extend('prependTo',function(e){
    return this.sift(o=>e.map(el=>{ el.insertBefore(o,el.children[0]); return o; })); });



q.extend('addClass',function(e){
    return this.sift(o=>e.map(el=>{ el.classList.add(e); return o; })); });
q.extend('removeClass',function(e){
    return this.sift(o=>e.map(el=>{ el.classList.remove(e); return o; })); });
q.extend('toggleClass',function(e){
    return this.sift(o=>e.map(el=>{ el.classList.toggle(e); return o; })); });
q.extend('hasClass',function(e){ return this.every(o=>o.matches(s)); });



/* Manipulation functions of q elements */
q.setCSS = function(o,e) {
    for(let i in e) { if(e.hasOwnProperty(i)){
        o.style[q.toPropCase(i)] = e[i]; } }
    return o; }
q.setAttr = function(o,e) {
    for(let i in e) { if(e.hasOwnProperty(i)){
        o.setAttribute(i,e[i]); } }
    return o; }


/* Cache methods for data manipulation */
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


/* Turn css dash case properties to Camelcase */
q.toPropCase = function(e) {
    return e.replace(/\-([a-z])/g,(m,p)=>p.toUpperCase()); }



q.extend('css',function(e){
    if(q.isString(e)) return this[0].style[q.toPropCase(e)];
    return this.sift(o=>q.setCSS(o,e)); });
q.extend('attr',function(e){
    if(q.isString(e)) return this[0].getAttribute(e);
    return this.sift(o=>q.setAttr(o,e)); });
q.extend('data',function(e){
    if(q.isString(e)) return q.getData(this[0],e);
    return this.sift(o=>q.setData(o,e)); });
q.extend('html',function(e){
    if(e===undefined) return this[0].innerHTML;
    return this.sift(o=>{ o.innerHTML=e; return o; }); });


})();