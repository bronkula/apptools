/*
This document is a series of small helper functions.
Created by Hamilton Cline hamdiggy@gmail.com
*/


// 
const templater = f => a =>
	(Array.isArray(a)?a:[a])
	.reduce((r,o,i,a)=>r+f(o,i,a),'');


// These are really just examples of how to do some basic querying
const someProps=(p,s)=>o=>p.some(t=>RegExp(s,'i').test(o[t]));
const somePropsAll=(a,p,s)=>a.filter(someProps(p,s));
const somePropsFirst=(a,p,s)=>a.find(someProps(p,s));
const somePropsIndex=(a,p,s)=>a.findIndex(someProps(p,s));

const sameProps=(p)=>o=>Object.keys(p).every(k=>o[k]===p[k]);
const samePropsAll=(a,p)=>a.filter(sameProps(p));
const samePropsFirst=(a,p)=>a.find(sameProps(p));
const samePropsIndex=(a,p)=>a.findIndex(sameProps(p));


const zeros=(n,e)=>(+n+Math.pow(10,e)+'').substr(1);

const numberCommas=n=>(n+'').replace(/\B(?=(?=\d*\.)(\d{3})+(?!\d))/g,',');
const moneyCommas=(n,d=2)=>'$'+numberCommas(n.toFixed(d));

const arrayReplace=(ax,ar)=>c=>ax.reduce((r,o,i)=>r.replace(o,ar[i]),c);


// Pass this function a file input list and a callback for each file.
const readFiles = (f,c,i=0) => {
	if (f && f[i]) {
		let r=new FileReader();
		r.onload=e=>{ c(e); readFiles(f,c,i+1); }
		r.readAsDataURL(f[i]);
	}
}





// Use these functions to call function after function passing the return value forward to the next function
const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);
const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);
// Pass an alert at some point into the pipeline
const trace = l => v => { console.log(`${l}: ${v}`); return v; }
// Delay a promise
const delay = t => new Promise(r=>setTimeout(r,t));





// const makeQuery = t => d => aQuery(t(d));
// const aQuery = d => fetch(d).then(r => r.json());
// const aQueries = d => Promise.all(d.map(o=>aQuery(...o)));
// const aSlowQueries = async (q) =>
// 	await q.map(d=>pipeQuery(d))
//     .reduce((r,f)=>r.then(f),Promise.resolve([]));
// const aSlowQueriesIntercept = async (q) =>
//     await q.flatMap(([d,f])=>[pipeQuery(d),pipeback(f)])
//     .reduce((r,d)=>r.then(d),Promise.resolve([]));
// const pipeQuery = d => pd =>
//     aQuery(...d).then(d=>pd.concat([d]));
// const pipeback = fn => pd =>
//     new Promise(r=>{fn?fn(pd):!1;r(pd);});






// A simple asynchronous version of fetch and json
const aGetFile = async (f) => { const r = await fetch(f); return await r.json(); }


// CheckData is a promise that waits for a true callback function response
const checkData = (v,t=10) => new Promise(r => { const c=()=>!v()?setTimeout(c,t):r(v()); c(); });


// A simplification of mapping a callback onto an array and then joining the array on a delimiter
const mapJoin = (a,f,d) => a.map(f).join(d);
// Check the array, if it is not an array, split it, either way send it off to mapJoin
const splitMapJoin = (a,f,jd,sd=/\s?,\s?/) => mapJoin(Array.isArray(a)?a:a.split(sd),f,jd);




const getStore = (s) =>
    localStorage[s]!==undefined?JSON.parse(localStorage[s]):[];
const setStore = (s,v) =>
    localStorage[s] = JSON.stringify(v);


const order = (arr,p='order',r=!!0) => arr.slice()
    .sort((a,b)=>a[p]>b[p]?(r?-1:1):a[p]<b[p]?(r?1:-1):0);


