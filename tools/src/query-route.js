;
((w)=>{

const stateObj = {};

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
    matches:(r) => {
        let hash = w.location.hash.substr(1).split("/");
        let h = r.split("/");
        return h[0]==hash[0] && h.length==hash.length;
    },
    make: (routes,defaultRoute=()=>{}) => {
        let hash = w.location.hash.substr(1).split("/");
        for(let [route,callback] of Object.entries(routes)) {
            let h = route.split("/");
            if(h[0]==hash[0] && h.length==hash.length) {
                let v = {};
                h.forEach((o,i)=>{
                    if(o!==hash[i]) v[o.substr(1)] = hash[i];
                });
                return callback(v);
            }
        }
        return defaultRoute();
    }
};

const setActive = (state,update) => {

    // console.log(w.history,state,stateObj);

    if(state==null) {
        state = {
            title:w.location.hash.substr(1),
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
        q(document).delegate("click","a[href^='#']",e=>{
            e.preventDefault();
            let r = e.target.attributes.href.value.substr(1);
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