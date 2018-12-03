const templater=tf=>oa=>(Array.isArray(oa)?oa:[oa]).reduce((r,o,i,a)=>r+tf(o,i,a),'');
const rebounce=(c,f,a,t=100)=>!c?!setTimeout(()=>f.apply(c,a),t):true;

const someProps=(p,s)=>o=>p.some(t=>RegExp(s,'i').test(o[t]));
const somePropsAll=(a,p,s)=>a.filter(someProps(p,s));
const somePropsFirst=(a,p,s)=>a.find(someProps(p,s));
const somePropsIndex=(a,p,s)=>a.findIndex(someProps(p,s));

const sameProps=(p)=>o=>Object.keys(p).every(k=>o[k]===p[k]);
const samePropsAll=(a,p)=>a.filter(sameProps(p));
const samePropsFirst=(a,p)=>a.find(sameProps(p));
const samePropsIndex=(a,p)=>a.findIndex(sameProps(p));

const rand=(n,x)=>{let r=Math.random();return !x?(!n?r<0.5:~~(r*n)):Math.round((r*(x-n))+n)}
const zeros=(n,e)=>(+n+Math.pow(10,e)+'').substr(1);

const numberCommas=n=>(n+'').replace(/\B(?=(?=\d*\.)(\d{3})+(?!\d))/g,',');
const moneyCommas=(n,d=2)=>'$'+numberCommas(n.toFixed(d));

const arrayReplace=(ax,ar)=>c=>ax.reduce((r,o,i)=>r+r.replace(o,ar[i]),c);

const readFiles = (f,c,i=0) => {
	if (f && f[i]) {
		let reader=new FileReader();
		reader.onload=e=>{ c(e); readFiles(f,c,i+1); }
		reader.readAsDataURL(f[i]);
	}
}

const sift = f => s => s.map(f).filter(o=>o);

// Selector Functions
const q = (s,sc=document) => 
    !s ? [] : s instanceof HTMLElement ? [s] : Array.isArray(s) ? s :
    [].slice.call(sc.querySelectorAll(s));
const qnext = s => sift(o=>q(o).nextElementSibling)(s);
const qprev = s => sift(o=>q(o).previousElementSibling)(s);
const qparent = s => sift(o=>q(o).parentElement)(s);
// Event Delegation Functions
const qdelegate = el => (es,t,c) =>{
	es.trim().split(" ").forEach(e =>{
	    q(el).forEach(o=>o.addEventListener(e,ev=>{
	        d(t).forEach(to=>{
	        	if(ev.target==to)c.call(ev.target,ev)
	    	})
	    },!1))
	});
}
const qon = o => (et,f) => et.trim().split(" ").forEach(e => q(o).forEach(o=>o.addEventListener(e,f)));



export { 
	templater,rebounce,
	someProps,somePropsAll,somePropsFirst,somePropsIndex,
	sameProps,samePropsAll,samePropsFirst,samePropsIndex,
	rand,zeros,
	numberCommas,moneyCommas,
	arrayReplace,
	sift,
	q,qdelegate,qon,qprev,qnext,qparent,
	readFiles
};
