/*
A small set of query selector tools, including event delegation
Created by Hamilton Cline hamdiggy@gmail.com
*/

const q = (...a) => new qlist(...a);



q.fetch = d => fetch(d).then(r => r.json());
q.fetchAll = d => Promise.all(d.map(o => q.fetch(o)));
q.fetchEach = (d,f=d=>d) => 
    d.map(u => pd => q.fetch(u).then(d => pd.concat([f(d)])))
    .reduce((r,f) => r.then(f),Promise.resolve([]));
q.post = (u,d) =>
    fetch(u,{
        headers:{ 'Content-Type': 'application/json' },
        method: 'POST', body: JSON.stringify(d)
    }).then(r => r.json());




const qlist = function(s,sc=document) {
    let nl = !s || !this.isDoc(sc) ? [] :
        s instanceof HTMLElement || s==sc ? [s] : 
        Array.isArray(s) ? s : sc.querySelectorAll(s);
    Object.assign(this,nl);
    this.length = nl.length;
}

qlist.prototype.forEach = Array.prototype.forEach;
qlist.prototype.map = Array.prototype.map;
qlist.prototype.flatMap = Array.prototype.flatMap;
qlist.prototype.reduce = Array.prototype.reduce;
qlist.prototype.some = Array.prototype.some;
qlist.prototype.every = Array.prototype.every;

qlist.prototype.getPath = e => e.path || (e.composedPath && e.composedPath());
qlist.prototype.isDoc = d => d instanceof HTMLElement || d instanceof HTMLDocument;
qlist.prototype.inPath = function(e,t) { return this.getPath(e).some(o=>o==t); }
qlist.prototype.sift = function(f) { return q([...new Set(this.flatMap(f))]); }

qlist.prototype.on = function(eventString,fn,capture=false) {
    eventString.trim().split(/\s+/).forEach(event=>{
        this.forEach(el=>{
            return el.addEventListener(event,fn,capture)
        })
    });
    return this;
}

qlist.prototype.delegate = function(eventString,selector,fn) {
    this.on(eventString,event=>{
        return this.find(selector).forEach(o=>{
            return this.inPath(event,o)?fn.call(o,event,o):0
        })
    },{capture:true});
    return this;
}

qlist.prototype.toArray = function() {
    return this.reduce((r,o)=>r.concat([o]),[]) }
qlist.prototype.find = function(s) {
    return q(this.reduce((r,o)=>[...r,...q(s,o).toArray()],[])); }
qlist.prototype.next = function() {
    return this.sift(o=>o.nextElementSibling); }
qlist.prototype.prev = function() {
    return this.sift(o=>o.previousElementSibling); }
qlist.prototype.parent = function() {
    return this.sift(o=>o.parentElement); }
qlist.prototype.children = function() {
    return this.sift(o=>[...o.children]); }
qlist.prototype.siblings = function(s) {
    return this.sift(o=>{
        return [...o.parentElement.children].filter(a=>{
            return a==o?false:s?a.matches(s):true;
        })
    }); }

qlist.prototype.is = function(s) {
    return this.some(o=>o.matches(s)); }
qlist.prototype.closest = function(s) {
    return this.sift(o=>o.closest(s)); }