;/*
ProtoTight Type v1.01
Developed by Hamilton Cline
hamdiggy@gmail.com
http://www.hamiltondraws.com

Changelog
1.01- Drop jQuery dependence in favor of ES6
    - Drop Mustache Templating in favor of ES6 templating
    - Fixed sloppy location handling
    - Add activateone
    - Simplified activate code
0.93- Small Improvements to Syntax
0.92- Moved most functions to local scope
    - Pass PT variable to global and include navigate function
0.91- Completed ECMA 2015 ReWrite
    - Fixed some Sass naming and conventions
    - Added Queries and Delegations
0.9 - ECMA Rewrite
0.81- Rebranding: ProtoTight
0.8 - Added: Responsive CSS Grid to theme
    - Changed: CSS file names
    - Updated documentation
    - Modified demos
0.7 - Added: "pageshow" event to document
    - Changed: Totally changed helper functions
    - Changed: Jumps from class to data-role
    - Moved files and demo content
    - Split sass implementation
    - Improved documentation
0.6 - Removing most example and demo things
0.5 - Changed to prototypical model
0.4 - Added implementation of browser history
    - Fixed accordion implementation
0.3 - Updated to newer version of HameBase
    - Improved popups with transitions
    - Added centered navbar buttons
    - Added Mustache Templates for most elements
    - Mustache Templates can be given default values
    - Added accordion lists
0.2 - Added asides and figures
0.1 - Initial Release



uglifyjs proto.js -o proto.min.js -c -m --source-map "url='proto.min.js.map'"

*/

(function(w){

    function ProtoTight () {
        this.originalHash = w.location.hash;
        this.updateUrl= false;
        this.stateObj={title:null,url:null};
        this.currentSection = null;
        this.previousSection = null;
        this.navHistory = [];
        this.sections = [];
        this.mainElement;
    }
    ProtoTight.prototype.navigate = (str,updateUrl=true) => {
        if(str=="back") {
            if(w.history.state != null) w.history.back();
        }
        else if (w.history.pushState) {
            setActiveSection({
                title: str,
                url: w.location.origin + w.location.pathname + "#" + str
            },updateUrl);
        } else {
            /* Ajax navigation is not supported */
            w.location.assign(this.stateObj.url);
        }
    };



    const init = () => {
        // console.log("prototight")
        PT.mainElement = w.document.body;
        makeTabList();
        setEvents();
        // setTemplates();
        setInitialActive();
    };

    const setInitialActive = () => {
        let h = PT.originalHash!=="" ? PT.originalHash.substr(1) : "";
        if(!PT.sections.includes(h)) h = PT.sections[0];
        setActiveSection({title:h,url:w.location.href});
    };

    const setActiveSection = (stateObj,updateUrl) => {
        document.dispatchEvent(new CustomEvent("pageshow",{detail:{
            nextPage:{
                title:stateObj.title,
                url:stateObj.url,
                el:q("."+stateObj.title)[0]
            },
            prevPage:{
                title:PT.stateObj.title,
                url:PT.stateObj.url,
                el:q(PT.stateObj.title===null?"":"."+PT.stateObj.title)[0]
            }
        }}));
        
        PT.stateObj = {
            title:stateObj.title,
            url:stateObj.url
        }
        showActiveSection();
        
        w.history[updateUrl?'pushState':'replaceState']
            (stateObj, stateObj.title, stateObj.url);
    };
    const showActiveSection = () => {
        // q("[data-role='page'].active").forEach(o => o.classList.remove("active") );
        // q("."+PT.stateObj.title).forEach(o => o.classList.add("active"));
        qactivateone("."+PT.stateObj.title,q("[data-role='page']"));
    };
    const makeTabList = () => {
        // Search through the sections and pull out all the ids for links and tabs
        PT.sections = [];
        q("[data-role='page']").forEach(o=>{
            o.classList.add(o.id);
            PT.sections.push(o.id);
        });
    }
    const setEvents = () => {
        qdelegate(PT.mainElement[0])
        ("click","[data-role='jump']",e=>{
            e.preventDefault();
            PT.navigate(e.target.getAttribute('href').value.substr(1));
            return false;
        })

        ("click","[data-toggle]",e=>{ qtoggle(e.target.dataset.toggle); })
        ("click","[data-activate]",e=>{ qactivate(e.target.dataset.toggle); })
        ("click","[data-deactivate]",e=>{ qdeactivate(e.target.dataset.toggle); })
        ("click","[data-activateone]",e=>{ qactivateone(e.target.dataset.toggle); })
    };




// HELPER FUNCTIONS

    // Query Selector
    // const q = s => 
    //     s instanceof HTMLElement ? [s] :
    //     s.isArray ? s :
    //     !s ? [] :
    //     [].slice.call(document.querySelectorAll(s));
    // const qnext = s => 
    //     s.nextSibling instanceof HTMLElement ? 
    //     [s.nextSibling] : qnext(s.nextSibling);
    // const qprev = s => 
    //     s.previousSibling instanceof HTMLElement ? 
    //     [s.previousSibling] : qprev(s.previousSibling);

    const getPath = e => e.path || (e.composedPath && e.composedPath());
    const isDoc = d => d instanceof HTMLElement || d instanceof HTMLDocument;
    const inPath = (ev,to) => getPath(ev).some(o=>o==to);
    const sift = f => s => [...new Set(s.map(f))];

    const q = (s,sc=document) => 
        !s || !isDoc(sc) ? [] :
        s instanceof HTMLElement || s==sc ? [s] : 
        Array.isArray(s) ? s : sc.querySelectorAll(s);

    const qon = sc => {
        const d = q(sc);
        const f = (es,fn) => {
            es.trim().split(/\s+/).forEach(e=>d.forEach(o=> o.addEventListener(e,fn)));
            return f;
        }; 
        return f;
    }

    const qdelegate = sc => {
        const d = qon(sc);
        const f = (es,sl,fn) => {
            d(es,ev=>q(sl).forEach(to=>inPath(ev,to)?fn.call(to,ev,to):0));
            return f;
        };
        return f;
    }

    const qnext = sift(o=>o.nextElementSibling);
    const qprev = sift(o=>o.previousElementSibling);
    const qparent = s => [s.parentElement];


    const isJSON = (str) => {
        try { return (JSON.parse(str) && !!str); } catch (e) { return false; }
    }

    // const delegate = (o,evs,t,c) => {
    //     evs.split(" ").forEach(e => {
    //         this.addEventListener(e,e=>{
    //             [].forEach.call(document.querySelectorAll(t),to{
    //                 if(e.target==to)c.apply(e.target,[e])
    //             })
    //         },false);
    //     });
    // }

    // const activate = (obj,sel,fn) => {
    //     let el;
    //     switch(sel){
    //         case "next": el=qnext(obj); break;
    //         case "prev": el=qprev(obj); break;
    //         case "parent": el=qparent(obj); break;
    //         default: el = q(sel);
    //     }
    //     el.forEach( o => o.classList[fn]("active") );
    // }

    const qactivate = (el) => {
        q(el).forEach(o=>o.classList.add("active"));
    }
    const qdeactivate = (el) => {
        q(el).forEach(o=>o.classList.remove("active"));
    }
    const qtoggle = (el) => {
        q(el).forEach(o=>o.classList.toggle("active"));
    }
    const qactivateone = (el,arr=false) => {
        q(el).forEach(o=>{
            (arr||Array.from(o.parentElement.children)).forEach(c=>{
                if(c==o) c.classList.add("active")
                    else c.classList.remove("active");
            });
            
        });
    }

    // const setTemplates = () => {
    //     q("[data-template]").forEach(o => {
    //         let d = Object.assign({},o.dataset);
    //         for(let i of d) i = isJSON(i) ? JSON.parse(i) : i;
    //         o.innerHTML = mt(q(d.template)[0].innerHTML)(d)
    //     });
    // };


    // // Mustache Template with default values
    // const mt = (template_string) => {
    //     const getprop = (obj, prop) => {
    //         let _i;
    //         if(!obj || !prop) return obj;
    //         _i = /(.*?)\[(\d+)\]\.?(.*)/.exec(prop);
    //         if(_i !== null) {
    //             if(_i[1] && _i[3]) return getprop(obj[_i[1]][_i[2]],_i[3]);
    //             if(_i[3]) return getprop(obj[_i[2]],_i[3]);
    //             if(_i[1]) return obj[_i[1]][_i[2]];
    //             return obj[_i[2]];
    //         }
    //         _i = prop.indexOf('.');
    //         if(_i > -1) return getprop(obj[prop.substr(0, _i)], prop.substr(_i + 1));
    //         return obj[prop];
    //     }
    //     return (data) => {
    //         let output = ((html) => {
    //             let txt = document.createElement("textarea");
    //             txt.innerHTML = html;
    //             return txt.value;
    //         })(template_string);
    //         let rep = /<%=\s*(.+?)\s*%>/,m,v,s;
    //         while(m = rep.exec(output)) {
    //             s = m[1].split(":");
    //             v = getprop(data,s[0]);
    //             output = m.input.substr(0,m.index)+
    //             (v!==undefined?v:(s[1]===undefined?"[undefined]":s[1]))+
    //             m.input.substr(m[0].length+m.index);
    //         }
    //         return output;
    //     }
    // }





    const PT = new ProtoTight();
        
    w.addEventListener("popstate",o => o.state!= null ? setActiveSection(o.state) : setInitialActive());

    w.document.addEventListener("DOMContentLoaded", init );

    w.PT = PT;

})(window);
