;((w)=>{


const stateObj = {};

const checkNextRoute = (checkroute,hashroute) => {

}

const route = {
    navigate : (str,updateUrl=true) => {
        if(str=="back") {
            if(w.history.state != null) w.history.back();
        }
        else if (w.history.pushState) {
            setActive({
                title: str,
                url: w.location.origin + w.location.pathname + "#" + str
            },updateUrl);
        } else {
            w.location.assign(stateObj.url);
        }
    },
    matches:(h,r) => {
        if(h[0]!=r[0]) return false;
        let v = {};
        for(let i in h) {
            if(h[i]==r[i]) continue;
            else if(r[i].slice(0,1)==":") v[r[i].slice(1)] = h[i];
            else if(h[i]!=r[i]) return false;
        }
        return v;
    },
    make: (routes,page=()=>{},basis) => {
        let hashroute = (basis?basis:w.location.hash.slice(1));
        let hashsplit = hashroute.split("/");
        let v={};
        if(hashroute != '') {
            for(let [checkroute,fn] of Object.entries(routes)) {
                v={};
                if(checkroute==hashroute) { page = fn; break; }
                let checksplit = checkroute.split("/");
                if(checksplit[0]==hashsplit[0] && checksplit.length==hashsplit.length) {
                    v = route.matches(hashsplit,checksplit);
                    if(v!==false) { page = fn; break; }
                }
            }
        }
        return (d)=>page(v,d);
    }
};

const setActive = (state,update) => {

    // console.log(w.history,state,stateObj);

    if(state==null) {
        state = {
            title:w.location.hash.slice(1),
            url:w.location.href
        };
    }
    
    stateObj.state = {...state};
    
    w.history[update?'pushState':'replaceState']
        (state, state.title, state.url);

    w.document.dispatchEvent(
        new CustomEvent("pageshow",{
            detail:{
                nextPage:{...state},
                prevPage:{...stateObj.state}
            }
        })
    );

};

if(w.q) {
    q(()=>{
        q(document).delegate("click","a[href^='#']",function(e){
            e.preventDefault();
            let r = this.attributes.href.value.slice(1);
            if(r!="") route.navigate(r);
        })
    });
    q.route = route;
}
else w.route = route;


w.addEventListener("load",()=>{
    setTimeout(()=>w.addEventListener("popstate",o=>setActive(o.state)),0)
});
w.addEventListener("DOMContentLoaded",e=>setActive(null))


})(window);