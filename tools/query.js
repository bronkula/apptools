/*
A small set of query selector tools, including event delegation
Created by Hamilton Cline hamdiggy@gmail.com
*/

const getPath = e => e.path || (e.composedPath && e.composedPath());
const isDoc = d => d instanceof HTMLElement || d instanceof HTMLDocument;
const inPath = (ev,to) => getPath(ev).some(o=>o==to);
const sift = f => s => [...new Set(s.map(f))];

// Selector Function
const q = (s,sc=document) => 
    !s || !isDoc(sc) ? [] :
    s instanceof HTMLElement || s==sc ? [s] : 
    Array.isArray(s) ? s : sc.querySelectorAll(s);

// Event Delegation Functions
/*
example:
qon('a')('click',e=>console.log(e))
*/
const qon = sc => {
    const d = q(sc);
    const f = (es,fn) => {
        es.trim().split(/\s+/).forEach(e=>d.forEach(o=> o.addEventListener(e,fn)));
        return f;
    }; 
    return f;
}
/*
example:
qdelegate('body')('click','a',e=>console.log(e))
*/
const qdelegate = sc => {
    const d = qon(sc);
    const f = (es,sl,fn) => {
        d(es,ev=>q(sl).forEach(to=>inPath(ev,to)?fn.call(to,ev,to):0));
        return f;
    };
    return f;
}

// Traversal Functions
const qnext = sift(o=>o.nextElementSibling);
const qprev = sift(o=>o.previousElementSibling);
const qparent = sift(o=>o.parentElement);

const qis = (s1,s2) => q(s1).some(o=>o.matches(s2));
const qclosest = s => sift(o=>o.closest(s));

export { 
   getPath, isDoc, inPath, sift,
  
   q, qon, qdelegate,
   qnext, qprev, qparent,
   qis, qclosest
};
