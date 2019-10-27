/*
A small set of query selector tools, including event delegation
Created by Hamilton Cline hamdiggy@gmail.com
*/

const qlist = function(s,sc=document) {
    let nl = !s || !this.isDoc(sc) ? [] :
        s instanceof HTMLElement || s==sc ? [s] : 
        Array.isArray(s) ? s : sc.querySelectorAll(s);
    Object.assign(this,nl);
    this.length = nl.length;
}

const q = (...a) => new qlist(...a);

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

qlist.prototype.on = function(evs,fn,b=false) {
    evs.trim().split(/\s+/).forEach(ev=>{
        this.forEach(el=>{
            return el.addEventListener(ev,fn,b)
        })
    });
    return this;
}

qlist.prototype.delegate = function(evs,sl,fn) {
    this.on(evs,ev=>{
        return this.find(sl).forEach(to=>{
            return this.inPath(ev,to)?fn.call(to,ev,to):0
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