/*
A small set of query selector tools, including event delegation
Created by Hamilton Cline hamdiggy@gmail.com
*/


((w)=>{


const q = (s,sc) => new Q(s,sc);



/* Fetch and Post functions */
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


/* Helper Functions */
q.getPath = e => e.path || (e.composedPath && e.composedPath());
q.isHTML = d => d instanceof HTMLElement || d instanceof HTMLDocument;
q.isString = d => typeof d == "string" || d instanceof String;
q.isArray = d => Array.isArray(d);
q.inPath = (e,t) => q.getPath(e).some(o=>o==t);


/* Manipulation functions of q elements */
q.make = function(s) {
    return q([...document.createRange().createContextualFragment(s).childNodes]) }
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



class Q {
    constructor(s,sc=document) {
        let nl = !s || !q.isHTML(sc) ? [] : 
            q.isHTML(s) || s==sc ? [s] : 
            q.isArray(s) ? s :
            q.isString(s) && s.trim()[0]=="<" ? q.make(s) :
            sc.querySelectorAll(s);
        Object.assign(this,nl);
        this.length = nl.length;
    }


    /* Apply events to Q elements */
    on(eventString,fn,capture=false) {
        eventString.trim().split(/\s+/).forEach(event=>{
            this.forEach(el=>{
                return el.addEventListener(event,fn,capture)
            })
        });
        return this;
    }
    /* Delegate events to children of Q elements */
    delegate(eventString,selector,fn) {
        this.on(eventString,event=>{
            return this.find(selector).forEach(o=>{
                return q.inPath(event,o)?fn.call(o,event,o):0
            })
        },{capture:true});
        return this;
    }


    /* Apply a function to each element of a Q and then return only unique, non false, elements */
    sift(f) { return q([...new Set(this.flatMap(f))]
        .reduce((r,o)=>o?r.concat([o]):r,[])); }
    /* Get array from Q */
    toArray() { return this.reduce((r,o)=>r.concat([o]),[]) }
    /* See if any Q elements match a selector */
    is(s) { return this.every(o=>o.matches(s)); }


    /* Traversal methods */
    find(s) {
        return q(this.reduce((r,o)=>[...r,...q(s,o).toArray()],[])); }
    next() {
        return this.sift(o=>o.nextElementSibling); }
    prev() {
        return this.sift(o=>o.previousElementSibling); }
    parent() {
        return this.sift(o=>o.parentElement); }
    closest(s) {
        return this.sift(o=>o.closest(s)); }
    children(s) {
        return this.sift(o=>[...o.children].filter(a=>s?a.matches(s)?a:false:true)); }
    last() {
        return q(o=>this[this.length-1]); }
    first() {
        return q(o=>this[0]); }
    siblings(s) {
        return this.sift(o=>{
            return [...o.parentElement.children].filter(a=>{
                return a==o?false:s?a.matches(s):true;
            })
        }); }


    /* Manipulation methods */
    remove() {
        return this.sift(o=>{o.parentElement.removeChild(o); return false; }) }
    append(e) {
        return this.sift(o=>e.map(el=>{ o.appendChild(el); return o; })); }
    appendTo(e) {
        return this.sift(o=>e.map(el=>{ el.appendChild(o); return o; })); }
    prepend(e) {
        return this.sift(o=>e.map(el=>{ o.insertBefore(el,o.children[0]); return o; })); }

    style(e) {
        if(q.isString(e)) return this[0].style[e];
        return this.sift(o=>{ Object.assign(o.style,e); return o; }); }
    attr(e) {
        if(q.isString(e)) return this[0].getAttribute(e);
        return this.sift(o=>q.setAttr(o,e)); }
    data(e) {
        if(q.isString(e)) return q.getData(this[0],e);
        return this.sift(o=>q.setData(o,e)); }


}




/* Basic array methods */
Q.prototype.forEach = Array.prototype.forEach;
Q.prototype.map = Array.prototype.map;
Q.prototype.flatMap = Array.prototype.flatMap;
Q.prototype.reduce = Array.prototype.reduce;
Q.prototype.some = Array.prototype.some;
Q.prototype.every = Array.prototype.every;
Q.prototype.filter = Array.prototype.filter;



q.extend = (k,f) => { Q.prototype[k] = f; }



w.q = q;

})(window);