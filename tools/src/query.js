/** @preserve qjs created by Hamilton Cline - hamdiggy@gmail.com */


;((w)=>{


const q = (s,sc) => new Q(s,sc);


/* Helper Functions */
q.isHTML = d => d instanceof HTMLElement || d instanceof HTMLDocument;
q.isString = d => typeof d == "string" || d instanceof String;
q.isFunction = d => typeof d == "function";
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
            q.isFunction(s) ? !window.addEventListener('DOMContentLoaded',s) :
            sc.querySelectorAll(s);
        if(!nl) return false;
        Object.assign(this,nl);
        this.length = nl.length;
    }


    /* Return only unique, non false, elements */
    sift(f) { return q([...new Set(this.flatMap(f).filter(o=>o))]); }
    /* See if any Q elements match a selector */
    is(s){ return this.some(o=>o.matches(s)); }
    /* See if all Q elements do not match a selector */
    not(s){ return !this.is(s); }
    pipe(f) { return q(this.map(f)); }
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
q.hasExtension = (k) => q.isFunction(Q.prototype[k]);



w.q = q;
})(window);