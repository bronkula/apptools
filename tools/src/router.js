
export class Router {
    static #stored = {};

    static init = () => {
        window.document.addEventListener("click", function(e){
            if(e?.composedPath().some(el => el.matches("a[href^='#']"))) {
                e.preventDefault();
                let route = this.attributes.href.value.slice(1);
                if (route != "") Router.navigate(route);
            }
        });

        window.addEventListener("load",() => {
            setTimeout(() => window.addEventListener("popstate", ({state}) => this.setActive(state)), 0);
        });
        window.addEventListener("DOMContentLoaded", () => this.setActive(null));
    }

    static setActive = (state, update) => {
        if(state==null) {
            state = {
                title: window.location.hash.slice(1),
                url: window.location.href,
            };
        }
        this.#stored.state = {...state};
        window.history[update ? 'pushState' : 'replaceState']
            (state, state.title, state.url);
    
        window.document.dispatchEvent(
            new CustomEvent("pageshow", {
                detail: {
                    nextPage: {...state},
                    prevPage: {...this.#stored.state},
                }
            })
        );
    }
    static navigate = (str, updateUrl = true) => {
        if (str == "back") {
            if (window.history.state != null) window.history.back();
        }
        else if (window.history.pushState) {
            this.setActive({
                title: str,
                url: window.location.origin + window.location.pathname + "#" + str
            }, updateUrl);
        } else {
            window.location.assign(this.#stored.url);
        }
    }
    static matches = (basis, tocheck) => {
        if(basis[0]!=tocheck[0]) return false;
        let props = {};
        for(let i in basis) {
            if(basis[i]==tocheck[i]) continue;
            else if(tocheck[i].slice(0,1)==":") props[tocheck[i].slice(1)] = basis[i];
            else if(basis[i]!=tocheck[i]) return false;
        }
        return props;
    }
    static make = (routes, page = ()=>{}, basis) => {
        let hashroute = (basis ? basis : w.location.hash.slice(1));
        let hashsplit = hashroute.split("/");
        let props = {};
        if(hashroute != '') {
            for (let [checkroute,fn] of Object.entries(routes)) {
                props = {};
                if (checkroute == hashroute) { page = fn; break; }
                let checksplit = checkroute.split("/");
                if (checksplit[0] == hashsplit[0] && checksplit.length==hashsplit.length) {
                    props = this.matches(hashsplit,checksplit);
                    if(props!==false) { page = fn; break; }
                }
            }
        }
        return (d) => page(props, d);
    }
}
