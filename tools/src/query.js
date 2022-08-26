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
q.isFragment = d => q.isString(d) && d.trim()[0]=="<";
q.isEntity = d => q.isString(d) && d.trim()[0]=="&" && d.trim().substr(-1)==";";
q.isJson = s => {
    s = typeof s !== "string" ? JSON.stringify(s) : s;
    try { s = JSON.parse(s); } catch (e) { return false; }
    return typeof s === "object" && s !== null;
}
q.parse = d => { try{ return JSON.parse(d); } catch(e){ return d; } }


q.asArray = d => Array.isArray(d)?d:[d];
q.makeFragment = s => q.isFragment(s) ?
    [...document.createRange().createContextualFragment(s.trim()).childNodes] : [s];
q.make = (s) => q(q.makeFragment(s));


q.htmlEncode = function(s) {
   let d = document.createElement('div');
   d.innerHTML = s; return d.innerText;
}


q.extend = (k,f,o=false) => {
    q.asArray(k).forEach(k=>{
        if(!q.hasExtension(k) || o) Q.prototype[k] = f }) }
q.hasExtension = (k) => {
    return q.isFunction(Q.prototype[k]); }


q.sift = (s,f) => {
    let set = s.toArray().flatMap(f);
    //let fset = set.filter(o=>o);
    return [...(new Set(set))]; }
q.settle = o => {
    return o.flatMap(e=> !e ? [] :
        q.isFragment(e) ? q.makeFragment(e) :
        q.isQ(e) ? e.toArray() : e ); }


q.debug = (s,sc,nl) => {
    console.group();
    console.log("debug");
    console.log("selector",s);
    console.log("selector context",sc);
    console.log("isHTML SC",q.isHTML(sc));
    console.log("isHTML S",q.isHTML(s));
    console.log("isSVG S",q.isSVG(s));
    console.log("isQ S",q.isQ(s));
    console.log("isElement S",q.isElement(s));
    console.log("isFragment S",q.isFragment(s));
    console.log("isFunction S",q.isFunction(s));
    console.log("isArray S",q.isArray(s));
    console.log("isEntity S",q.isEntity(s));
    console.log("isJson S",q.isJson(s));
    console.log("querySelectorAll S",sc.querySelectorAll(s));
    console.log("new el",nl);
    console.groupEnd();
}


class Q {
    constructor(s,sc=document,debug=false) {
        let nl =
            !s || !q.isElement(sc) ? [] :
            q.isQ(s) ? s.toArray() :
            q.isElement(s) || s==sc ? [s] :
            q.isFragment(s) ? q.makeFragment(s) :
            q.isArray(s) ? q.settle(s) :
            q.isFunction(s) ? !window.addEventListener('DOMContentLoaded',s) :
            sc.querySelectorAll(s);
        if(debug) q.debug(s,sc,nl);
        if(!nl) return false;
        Object.assign(this,nl);
        this.length = nl.length;
    }

    find(s){ return this.sift(o=>q(s,o)); }

    /* Return only unique, non false, elements */
    sift(f) { return q(q.sift(this,f)); }
    pipe(f) { return q(this.map(f)); }

    /* See if any Q elements match a selector */
    is(s) { return this.some(o=>o.matches(s)); }
    not(s) { return !this.is(s); }

    toArray() { return this.reduce((r,o)=>r.concat([o]),[]) }
    toString() { return this.reduce((r,o)=>r+q.isElement(o)?o.outerHTML:`${o}`,'') }
    toText() { return this.reduce((r,o)=>r+q.isElement(o)?o.innerText:`${o}`,'') }
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