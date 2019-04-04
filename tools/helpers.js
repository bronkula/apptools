/*
This document is a series of small helper functions.
Created by Hamilton Cline hamdiggy@gmail.com
*/


const templater = (tf,istr='') => {
	const t = (r,o,i,a)=>r+tf(o,i,a);
	return (ts=false) => oa => {
		const o = (Array.isArray(oa)?oa:[oa]).reduce(t,istr);
		if(ts) document.querySelectorAll(ts).forEach(e=>e.innerHTML=o);
		return o;
	}
}
// const templater=tf=>oa=>(Array.isArray(oa)?oa:[oa]).reduce((r,o,i,a)=>r+tf(o,i,a),'');
// const templater=tf=>oa=>oa.reduce((r,o,i,a)=>r+tf(o,i,a),'');

const rebounce=(c,f,a,t=100)=>!c?!setTimeout(()=>f.apply(c,a),t):true;



const someProps=(p,s)=>o=>p.some(t=>RegExp(s,'i').test(o[t]));
const somePropsAll=(a,p,s)=>a.filter(someProps(p,s));
const somePropsFirst=(a,p,s)=>a.find(someProps(p,s));
const somePropsIndex=(a,p,s)=>a.findIndex(someProps(p,s));

const sameProps=(p)=>o=>Object.keys(p).every(k=>o[k]===p[k]);
const samePropsAll=(a,p)=>a.filter(sameProps(p));
const samePropsFirst=(a,p)=>a.find(sameProps(p));
const samePropsIndex=(a,p)=>a.findIndex(sameProps(p));



const rand=(n,x)=>Math.round((Math.random()*(x-n))+n);

const zeros=(n,e)=>(+n+Math.pow(10,e)+'').substr(1);

const numberCommas=n=>(n+'').replace(/\B(?=(?=\d*\.)(\d{3})+(?!\d))/g,',');
const moneyCommas=(n,d=2)=>'$'+numberCommas(n.toFixed(d));

const arrayReplace=(ax,ar)=>c=>ax.reduce((r,o,i)=>r.replace(o,ar[i]),c);



const readFiles = (f,c,i=0) => {
	if (f && f[i]) {
		let reader=new FileReader();
		reader.onload=e=>{ c(e); readFiles(f,c,i+1); }
		reader.readAsDataURL(f[i]);
	}
}





export { 
	templater,rebounce,
	someProps,somePropsAll,somePropsFirst,somePropsIndex,
	sameProps,samePropsAll,samePropsFirst,samePropsIndex,
	rand,zeros,
	numberCommas,moneyCommas,
	arrayReplace,
	readFiles
};
