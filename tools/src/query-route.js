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
    }
};

const setActive = (state,update) => {
    if(state==null) {
        state = {
            title:w.location.hash.substr(1),
            url:w.location.href
        };
    }

    w.document.dispatchEvent(
        new CustomEvent("pageshow",{
            detail:{
                nextPage:{...state},
                prevPage:{...stateObj.state}
            }
        })
    );
    
    stateObj.state = {...state};
    
    w.history[update?'pushState':'replaceState']
        (state, state.title, state.url);

};

if(w.q) {
    w.q(()=>{
        console.log(w.q,w.q(document))
        w.q(document).delegate("click","a[href^='#']",e=>{
            e.preventDefault();
            let r = e.target.href.substr(1);
            if(r!="") route.navigate(r);
        })
    })
    w.q.extend('route',route);
}

w.addEventListener("popstate",o=>setActive(o.state));

})(window);