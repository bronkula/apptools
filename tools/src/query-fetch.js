;(()=>{
if(!q) throw "qjs not imported yet";


q.catchJson = async d => {
   let r = await d.text();
   return q.isJson(r) ? Promise.resolve(JSON.parse(r)) :
      Promise.resolve({error:r}); }


q.promiseList = (t) => (l,f=d=>d) => 
   l.map((...u) => pd => t(...u).then(d => pd.concat([f(d)])))
q.promiseEach = (l) => 
   l.reduce((r,f) => r.then(f),Promise.resolve([]));



q.get = (d,o={}) => fetch(d,o).then(q.catchJson);
q.getAll = d => Promise.all(d.map(o => q.get(...q.asArray(o))));
q.getList = q.promiseList(q.get);
q.getEach = l => q.promiseEach(q.getList(l));


    
q.post = (u,o={}) =>
   fetch(u,{ headers:{ 'Content-Type': 'application/json' },
   method: 'POST', body: JSON.stringify(o) }).then(q.catchJson);
q.postAll = d => Promise.all(d.map(o => q.post(...q.asArray(o))));
q.postList = q.promiseList(q.post);
q.postEach = l => q.promiseEach(q.postList(l));



})();