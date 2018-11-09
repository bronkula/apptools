;/*
ProtoTight Type v0.81
Developed by Hamilton Cline
hamdiggy@gmail.com
http://www.hamiltondraws.com

Changelog
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

    function ProtoTight (el) {
        var pt = this;
        this.originalHash = location.hash;
        this.updateUrl= false;
        this.stateObj={title:null,url:null};
        this.currentSection = null;
        this.previousSection = null;
        this.navHistory = [];
        this.sections = [];
        this.mainElement = q(el||"body");
        this.makeTabList();
        this.setTemplates();
        this.setEvents();

        setTimeout(function(){pt.init(el);},1);

        ProtoTight.tites.push(this);
    }
    ProtoTight.tites = [];

    ProtoTight.prototype.init = function() {
        this.setInitialActive();
    };

    ProtoTight.prototype.makeTabList = function() {
        var pt = this;
        // Search through the sections and pull out all the ids for links and tabs
        this.sections = [];
        q("[data-role='page']").forEach(function(o){
            o.classList.add(o.id);
            pt.sections.push(o.id);
        });
    };

    ProtoTight.prototype.setInitialActive = function() {
        var h = this.originalHash!=="" ? this.originalHash.substr(1) : "";
        if($.inArray(h,this.sections)===-1) {
            h = this.sections[0];
        }
        this.setActiveSection({title:h,url:location.href});
    };

    ProtoTight.prototype.setActiveSection = function(stateObj,updateUrl) {
        document.dispatchEvent(new CustomEvent("pageshow",{detail:{
            nextPage:{
                title:stateObj.title,
                url:stateObj.url,
                el:q("."+stateObj.title)
            },
            prevPage:{
                title:this.stateObj.title,
                url:this.stateObj.url,
                el:q(this.stateObj.title===null?"":"."+this.stateObj.title)
            }
        }}));
        
        this.stateObj = {
            title:stateObj.title,
            url:stateObj.url
        }
        this.showActiveSection();
        
        history[updateUrl?'pushState':'replaceState'](stateObj, stateObj.title, stateObj.url);
    };
    ProtoTight.prototype.showActiveSection = function() {
        q("[data-role='page'].active").forEach(o => o.classList.remove("active") );
        q("."+this.stateObj.title).forEach(o => o.classList.add("active"));
    };

    ProtoTight.prototype.changeSection = function(str,updateUrl) {
        if(str=="back") {
            if(history.state != null) w.history.back();
        }
        else if (history.pushState) {
            this.setActiveSection({
                title: str,
                url: w.location.origin + w.location.pathname + "#" + str
            },updateUrl);
        } else {
            /* Ajax navigation is not supported */
            location.assign(this.stateObj);
        }
    };
    ProtoTight.prototype.setTemplates = function() {
        var pt = this;
        q("[data-template]").forEach(o => o.innerHTML = mt(q(o.dataset.template)[0].innerHTML)(o.dataset) );
    };
    ProtoTight.prototype.activate = function(obj,sel,fn){
        var el;
        switch(sel){
            case "next": el=qnext(obj); break;
            case "prev": el=qprev(obj); break;
            case "parent": el=qparent(obj); break;
            default: el = q(sel);
        }
        el.forEach( o => o.classList[fn] );
    }

    ProtoTight.prototype.setEvents = function(el) {
        var pt = this;
        console.log(this)
        
        delegate(this.mainElement[0],"click","[data-role='jump']",function(e){
            console.dir(this)
                e.preventDefault();
                pt.changeSection([].find.call(this.attributes,o => o.nodeName=='href').value.substr(1),true);
                return false;
            })
        delegate(this.mainElement[0],"click","[data-toggle]",function(e){
                pt.activate(this,this.dataset.toggle,"toggle");
            })
        delegate(this.mainElement[0],"click","[data-activate]",function(e){
                pt.activate(this,this.dataset.activate,"add");
            })
        delegate(this.mainElement[0],"click","[data-deactivate]",function(e){
                pt.activate(this,this.dataset.deactivate,"remove");
            })
    };






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
        [s.previousSibling] : qnext(s.previousSibling);
    const qparent = s => [s.parentElement];


    const delegate = function(o,e,t,c){
        var o = this;
        e.split(" ").forEach(function(e){
            o.addEventListener(e,function(e){
                [].forEach.call(document.querySelectorAll(t),function(to){
                    if(e.target==to)c.apply(e.target,[e])
                })
            },false);
        });
    }

    const attr = (o,a) => o.find()


    // Mustache Template with default values
    const mt = function(template_string){
        var pt = this;
        var ds = function(obj, prop) {
            if(typeof obj === 'undefined') return false;
            var _index = prop.indexOf('.')
            if(_index > -1) return ds(obj[prop.substr(0, _index)], prop.substr(_index + 1));
            return obj[prop];
        }
        return function(data) {
            var output = (function(html) {
                var txt = document.createElement("textarea");
                txt.innerHTML = html;
                return txt.value;
            })(template_string);
            var rep = /<%=\s*(.+?)\s*%>/,m,v,s;
            while(m = rep.exec(output)) {
                s = m[1].split(":");
                v = ds(data,s[0]);
                output = m.input.substr(0,m.index)+
                (v!==undefined?v:(s[1]===undefined?"[undefined]":s[1]))+
                m.input.substr(m[0].length+m.index);
            }
            return output;
        }
    }



        
    w.onpopstate = function(o){
        ProtoTight.tites.forEach(t => o.state!= null ? t.setActiveSection(o.state) : t.setInitialActive() );
        // if(o.state!=null) {
        //     pt.setActiveSection(o.state);
        // } else {
        //     pt.setInitialActive();
        // }
    }







    w.document.addEventListener("DOMContentLoaded", () => new ProtoTight() );

})(window);
