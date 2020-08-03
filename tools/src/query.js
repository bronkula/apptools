/** qjs created by Hamilton Cline - hamdiggy@gmail.com */


;((w)=>{


const q = (s,sc,d) => new Q(s,sc,d);



q.isElement = d => d instanceof HTMLDocument || d instanceof HTMLElement || d instanceof SVGElement || d instanceof Element;
q.isHTML = d => d instanceof HTMLElement || d instanceof HTMLDocument;
q.isSVG = d => d instanceof SVGElement;
q.isString = d => typeof d == "string" || d instanceof String;
q.isFunction = d => typeof d == "function";
q.isQ = d => d instanceof Q;
q.isArray = d => Array.isArray(d);
q.isHTMLString = d => q.isString(d) && d.trim()[0]=="<";
q.parse = d => { try{ return JSON.parse(d); } catch(e){ return d; } }


q.make = function(s) { if(!q.isHTMLString(s)) return false;
    else return q([...document.createRange().createContextualFragment(s.trim()).childNodes]) }
q.extend = (k,f,o=false) => {
    if(!q.hasExtension(k) || o) Q.prototype[k] = f; }
q.hasExtension = (k) => {
    return q.isFunction(Q.prototype[k]); }


q.sift = (s,f) => {
    let set = s.toArray().flatMap(f);
    let fset = set.filter(o=>o);
    return [...(new Set(set))]; }
q.settle = o => {
    return o.flatMap(e=> q.isQ(e) ? e.toArray() :
        q.isElement(e) ? e :
        q.isHTMLString(e) ? q.make(e.trim()).toArray() :
        e ); }


class Q {
    constructor(s,sc=document,debug=false) {
        let nl =
            !s || !q.isElement(sc) ? [] :
            q.isQ(s) ? s :
            q.isElement(s) || s==sc ? [s] :
            q.isHTMLString(s) ? q.make() :
            q.isFunction(s) ? !window.addEventListener('DOMContentLoaded',s) :
            q.isArray(s) ? q.settle(s) :
            sc.querySelectorAll(s);
        // if(debug) console.log("debug",
        //     s,sc,
        //     q.isHTML(sc),
        //     q.isHTML(s),
        //     q.isSVG(s),
        //     q.isQ(s),
        //     q.isElement(s),
        //     q.isHTMLString(s),
        //     q.isFunction(s),
        //     q.isArray(s),
        //     sc.querySelectorAll(s),
        //     nl
        //     );
        if(!nl) return false;
        Object.assign(this,nl);
        this.length = nl.length;
    }


    /* Return only unique, non false, elements */
    sift(f) { return q(q.sift(this,f)); }
    pipe(f) { return q(this.map(f)); }

    /* See if any Q elements match a selector */
    is(s) { return this.some(o=>o.matches(s)); }
    not(s) { return !this.is(s); }

    toArray() { return this.reduce((r,o)=>r.concat([o]),[]) }
}



/* Basic array methods */
Q.prototype.forEach = Array.prototype.forEach;
Q.prototype.map = Array.prototype.map;
Q.prototype.flatMap = Array.prototype.flatMap;
Q.prototype.reduce = Array.prototype.reduce;
Q.prototype.some = Array.prototype.some;
Q.prototype.every = Array.prototype.every;
Q.prototype.filter = Array.prototype.filter;



w.q = q;
})(window);