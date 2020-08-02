;(()=>{
if(!q) throw "qjs not imported yet";


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


})();