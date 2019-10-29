/*
A small set of query selector tools, including event delegation
Created by Hamilton Cline hamdiggy@gmail.com
*/


((w)=>{

// const q = (s,sc) => new Q(s,sc);
const q = (s,sc) => new QOR(s,sc);



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

// /* Nodelist object with basic array methods, event delegation, and dom traversal */
// const Q = function(s,sc=document) {
//     let nl = !s || !q.isHTML(sc) ? [] : 
//         q.isHTML(s) || s==sc ? [s] : 
//         q.isArray(s) ? s :
//         q.isString(s) && s.trim()[0]=="<" ? q.make(s) :
//         sc.querySelectorAll(s);
//     Object.assign(this,nl);
//     this.length = nl.length;
// }

class QOR {
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
        return this.sift(o=>this[this.length-1]); }
    first() {
        return this.sift(o=>this[0]); }
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
QOR.prototype.forEach = Array.prototype.forEach;
QOR.prototype.map = Array.prototype.map;
QOR.prototype.flatMap = Array.prototype.flatMap;
QOR.prototype.reduce = Array.prototype.reduce;
QOR.prototype.some = Array.prototype.some;
QOR.prototype.every = Array.prototype.every;
QOR.prototype.filter = Array.prototype.filter;


// /* Apply events to Q elements */
// Q.prototype.on = function(eventString,fn,capture=false) {
//     eventString.trim().split(/\s+/).forEach(event=>{
//         this.forEach(el=>{
//             return el.addEventListener(event,fn,capture)
//         })
//     });
//     return this;
// }
// /* Delegate events to children of Q elements */
// Q.prototype.delegate = function(eventString,selector,fn) {
//     this.on(eventString,event=>{
//         return this.find(selector).forEach(o=>{
//             return q.inPath(event,o)?fn.call(o,event,o):0
//         })
//     },{capture:true});
//     return this;
// }


// /* Apply a function to each element of a Q and then return only unique, non false, elements */
// Q.prototype.sift = function(f) {
//     return q([...new Set(this.flatMap(f))].reduce((r,o)=>o?r.concat([o]):r,[])); }
// /* Get array from Q */
// Q.prototype.toArray = function() {
//     return this.reduce((r,o)=>r.concat([o]),[]) }
// /* See if any Q elements match a selector */
// Q.prototype.is = function(s) {
//     return this.every(o=>o.matches(s)); }


// /* Traversal methods */
// Q.prototype.find = function(s) {
//     return q(this.reduce((r,o)=>[...r,...q(s,o).toArray()],[])); }
// Q.prototype.next = function() {
//     return this.sift(o=>o.nextElementSibling); }
// Q.prototype.prev = function() {
//     return this.sift(o=>o.previousElementSibling); }
// Q.prototype.parent = function() {
//     return this.sift(o=>o.parentElement); }
// Q.prototype.closest = function(s) {
//     return this.sift(o=>o.closest(s)); }
// Q.prototype.children = function(s) {
//     return this.sift(o=>[...o.children].filter(a=>s?a.matches(s)?a:false:true)); }
// Q.prototype.last = function() {
//     return this.sift(o=>this[this.length-1]); }
// Q.prototype.first = function() {
//     return this.sift(o=>this[0]); }
// Q.prototype.siblings = function(s) {
//     return this.sift(o=>{
//         return [...o.parentElement.children].filter(a=>{
//             return a==o?false:s?a.matches(s):true;
//         })
//     }); }


// /* Manipulation methods */
// Q.prototype.remove = function() {
//     return this.sift(o=>{o.parentElement.removeChild(o); return false; }) }
// Q.prototype.append = function(e) {
//     return this.sift(o=>e.map(el=>{ o.appendChild(el); return o; })); }
// Q.prototype.appendTo = function(e) {
//     return this.sift(o=>e.map(el=>{ el.appendChild(o); return o; })); }
// Q.prototype.prepend = function(e) {
//     return this.sift(o=>e.map(el=>{ o.insertBefore(el,o.children[0]); return o; })); }

// Q.prototype.style = function(e) {
//     if(q.isString(e)) return this[0].style[e];
//     return this.sift(o=>{ Object.assign(o.style,e); return o; }); }
// Q.prototype.attr = function(e) {
//     if(q.isString(e)) return this[0].attributes[e];
//     return this.sift(o=>q.setAttr(o,e)); }
// Q.prototype.data = function(e) {
//     if(q.isString(e)) return q.getData(this[0],e);
//     return this.sift(o=>q.setData(o,e)); }

w.q = q;

})(window);