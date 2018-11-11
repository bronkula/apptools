;/*
ProtoTight Type v0.81
Developed by Hamilton Cline
hamdiggy@gmail.com
http://www.hamiltondraws.com

Changelog
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
        this.originalHash = location.hash;
        this.updateUrl= false;
        this.stateObj={title:null,url:null};
        this.currentSection = null;
        this.previousSection = null;
        this.navHistory = [];
        this.sections = [];
        this.mainElement;
    }
    ProtoTight.prototype.navigate = function(str,updateUrl=true) {
        if(str=="back") {
            if(history.state != null) w.history.back();
        }
        else if (history.pushState) {
            setActiveSection({
                title: str,
                url: w.location.origin + w.location.pathname + "#" + str
            },updateUrl);
        } else {
            /* Ajax navigation is not supported */
            location.assign(this.stateObj.url);
        }
    };



    const init = function() {
        // console.log("prototight")
        PT.mainElement = w.document.body;
        makeTabList();
        setEvents();
        setTemplates();
        setInitialActive();
    };

    const setInitialActive = function() {
        let h = PT.originalHash!=="" ? PT.originalHash.substr(1) : "";
        if(!PT.sections.includes(h)) h = PT.sections[0];
        setActiveSection({title:h,url:location.href});
    };

    const setActiveSection = function(stateObj,updateUrl) {
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
        
        history[updateUrl?'pushState':'replaceState'](stateObj, stateObj.title, stateObj.url);
    };
    const showActiveSection = function() {
        q("[data-role='page'].active").forEach(o => o.classList.remove("active") );
        q("."+PT.stateObj.title).forEach(o => o.classList.add("active"));
    };
    const makeTabList = function() {
        let pt = this;
        // Search through the sections and pull out all the ids for links and tabs
        PT.sections = [];
        q("[data-role='page']").forEach(function(o){
            o.classList.add(o.id);
            PT.sections.push(o.id);
        });
    }
    const setEvents = function() {
        delegate(PT.mainElement[0],"click","[data-role='jump']",function(e){
                e.preventDefault();
                PT.navigate([].find.call(this.attributes,o => o.nodeName=='href').value.substr(1));
                return false;
            })
        delegate(PT.mainElement[0],"click","[data-toggle]",function(e){
                activate(this,this.dataset.toggle,"toggle");
            })
        delegate(PT.mainElement[0],"click","[data-activate]",function(e){
                activate(this,this.dataset.activate,"add");
            })
        delegate(PT.mainElement[0],"click","[data-deactivate]",function(e){
                activate(this,this.dataset.deactivate,"remove");
            })
    };




// HELPER FUNCTIONS

    // Query Selector
    const q = s => 
        s instanceof HTMLElement ? [s] :
        s.isArray ? s :
        !s ? [] :
        [].slice.call(document.querySelectorAll(s));
    const qnext = s => 
        s.nextSibling instanceof HTMLElement ? 
        [s.nextSibling] : qnext(s.nextSibling);
    const qprev = s => 
        s.previousSibling instanceof HTMLElement ? 
        [s.previousSibling] : qprev(s.previousSibling);
    const qparent = s => [s.parentElement];


    const isJSON = function(str) {
        try { return (JSON.parse(str) && !!str); } catch (e) { return false; }
    }

    const delegate = function(o,e,t,c){
        e.split(" ").forEach(e => {
            this.addEventListener(e,function(e){
                [].forEach.call(document.querySelectorAll(t),function(to){
                    if(e.target==to)c.apply(e.target,[e])
                })
            },false);
        });
    }

    const activate = function(obj,sel,fn){
        let el;
        switch(sel){
            case "next": el=qnext(obj); break;
            case "prev": el=qprev(obj); break;
            case "parent": el=qparent(obj); break;
            default: el = q(sel);
        }
        el.forEach( o => o.classList[fn]("active") );
    }

    const setTemplates = function() {
        q("[data-template]").forEach(o => {
            let d = Object.assign({},o.dataset);
            for(let i in d) d[i] = isJSON(d[i]) ? JSON.parse(d[i]) : d[i];
            o.innerHTML = mt(q(d.template)[0].innerHTML)(d)
        });
    };


    // Mustache Template with default values
    const mt = function(template_string){
        let getprop = function(obj, prop) {
            let _i;
            if(!obj || !prop) return obj;
            _i = /(.*?)\[(\d+)\]\.?(.*)/.exec(prop);
            if(_i !== null) {
                if(_i[1] && _i[3]) return getprop(obj[_i[1]][_i[2]],_i[3]);
                if(_i[3]) return getprop(obj[_i[2]],_i[3]);
                if(_i[1]) return obj[_i[1]][_i[2]];
                return obj[_i[2]];
            }
            _i = prop.indexOf('.');
            if(_i > -1) return getprop(obj[prop.substr(0, _i)], prop.substr(_i + 1));
            return obj[prop];
        }
        return function(data) {
            let output = (function(html) {
                let txt = document.createElement("textarea");
                txt.innerHTML = html;
                return txt.value;
            })(template_string);
            let rep = /<%=\s*(.+?)\s*%>/,m,v,s;
            while(m = rep.exec(output)) {
                s = m[1].split(":");
                v = getprop(data,s[0]);
                output = m.input.substr(0,m.index)+
                (v!==undefined?v:(s[1]===undefined?"[undefined]":s[1]))+
                m.input.substr(m[0].length+m.index);
            }
            return output;
        }
    }





    const PT = new ProtoTight();
        
    w.addEventListener("popstate",o => o.state!= null ? setActiveSection(o.state) : setInitialActive());

    w.document.addEventListener("DOMContentLoaded", init );

    w.PT = PT;

})(window);
