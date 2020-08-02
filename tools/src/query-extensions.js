;(()=>{
if(!q) throw "qjs not imported yet";


q.template=f=>a=>(Array.isArray(a)?a:[a]).reduce((r,o,i,a)=>r+f(o,i,a),'');
q.pad=(n,e)=>(+n+Math.pow(10,e)+'').substr(1);