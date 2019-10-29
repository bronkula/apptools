/*
A small set of query selector tools, including event delegation
Created by Hamilton Cline hamdiggy@gmail.com
*/


;((w)=>{


const q = (s,sc) => new Q(s,sc);


/* Helper Functions */
q.isHTML = d => d instanceof HTMLElement || d instanceof HTMLDocument;
q.isString = d => typeof d == "string" || d instanceof String;
q.isArray = d => Array.isArray(d);



/* Manipulation functions of q elements */
q.make = function(s) {
    return q([...document.createRange().createContextualFragment(s).childNodes]) }



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


    /* Apply a function to each element of a Q and then return only unique, non false, elements */
    sift(f) { return q([...new Set(this.flatMap(f))]
        .reduce((r,o)=>o?r.concat([o]):r,[])); }

}




/* Basic array methods */
Q.prototype.forEach = Array.prototype.forEach;
Q.prototype.map = Array.prototype.map;
Q.prototype.flatMap = Array.prototype.flatMap;
Q.prototype.reduce = Array.prototype.reduce;
Q.prototype.some = Array.prototype.some;
Q.prototype.every = Array.prototype.every;
Q.prototype.filter = Array.prototype.filter;



/* Extend the prototype of qjs selections */
q.extend = (k,f,o=false) => { if(!q.hasExtension(k) || o) Q.prototype[k] = f; }
q.hasExtension = (k) => typeof Q.prototype[k] === 'function';


w.q = q;

})(window);