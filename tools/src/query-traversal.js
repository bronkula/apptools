/* Traversal methods for Qjs*/

;(()=>{
if(!q) throw "qjs not imported yet";

/* Get array from Q */
q.extend('toArray',function(){ return this.reduce((r,o)=>r.concat([o]),[]) });
/* See if any Q elements match a selector */
q.extend('is',function(s){ return this.every(o=>o.matches(s)); });


/* Traversal methods */
q.extend('find',function(s){
    return q(this.reduce((r,o)=>[...r,...q(s,o).toArray()],[])); });
q.extend('next',function(){
    return this.sift(o=>o.nextElementSibling); });
q.extend('prev',function(){
    return this.sift(o=>o.previousElementSibling); });
q.extend('parent',function(){
    return this.sift(o=>o.parentElement); });
q.extend('closest',function(s){
    return this.sift(o=>o.closest(s)); });
q.extend('children',function(s){
    return this.sift(o=>[...o.children].filter(a=>s?a.matches(s)?a:false:true)); });
q.extend('last',function(){
    return q(this[this.length-1]); });
q.extend('first',function(){
    return q(this[0]); });
q.extend('siblings',function(s){
    return this.sift(o=>{
        return [...o.parentElement.children].filter(a=>{
            return a==o?false:s?a.matches(s):true;
        })
    }); });

})();