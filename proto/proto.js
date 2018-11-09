;/*
ProtoTight Type v0.81
Developed by Hamilton Cline
hamdiggy@gmail.com
http://www.hamiltondraws.com

Changelog
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
        this.mainElement = $(el||"body");
        this.makeTabList();
        this.setTemplates();
        this.setEvents();

        setTimeout(function(){pt.init(el);},1);
    }



    ProtoTight.prototype.init = function() {
        this.setInitialActive();
    };

    ProtoTight.prototype.makeTabList = function() {
        var pt = this;
        // Search through the sections and pull out all the ids for links and tabs
        this.sections = [];
        $("[data-role='page']").each(function(index){
            var sid = $(this).attr("id");
            $(this).addClass(sid);
            pt.sections.push(sid);
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
        $(document).trigger("pageshow",{
            nextPage:{
                title:stateObj.title,
                url:stateObj.url,
                el:$("."+stateObj.title)
            },
            prevPage:{
                title:this.stateObj.title,
                url:this.stateObj.url,
                el:$(this.stateObj.title===null?"":"."+this.stateObj.title)
            }
        });
        
        this.stateObj = {
            title:stateObj.title,
            url:stateObj.url
        }
        this.showActiveSection();
        
        history[updateUrl?'pushState':'replaceState'](stateObj, stateObj.title, stateObj.url);
    };
    ProtoTight.prototype.showActiveSection = function() {
        $("[data-role='page'].active").removeClass("active");
        $("."+this.stateObj.title).addClass("active");
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
        $("[data-template]").each(function(){
            $(this).html(
                pt.mt($($(this).data("template")).html())($(this).data())
            );
        });
    };
    ProtoTight.prototype.activate = function(obj,sel,fn){
        var el;
        switch(sel){
            case "next": el=$(obj).next(); break;
            case "prev": el=$(obj).prev(); break;
            case "parent": el=$(obj).parent(); break;
            default: el = $(sel);
        }
        el[fn]("active");
    }

    ProtoTight.prototype.setEvents = function(el) {
        var pt = this;
        this.mainElement
            .on("click","[data-role='jump']",function(e){
                e.preventDefault();
                return pt.changeSection($(this).attr("href").substr(1),true); })
            .on("click","[data-toggle]",function(e){
                e.preventDefault();
                pt.activate(this,$(this).data("toggle"),"toggleClass");
            })
            .on("click","[data-activate]",function(e){
                e.preventDefault();
                pt.activate(this,$(this).data("activate"),"addClass");
            })
            .on("click","[data-deactivate]",function(e){
                e.preventDefault();
                pt.activate(this,$(this).data("deactivate"),"removeClass");
            })
    };

    // Mustache Template with default values
    ProtoTight.prototype.mt = function(template_string){
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
        // console.log(history)
        if(o.state!=null) {
            // console.log("pop");
            pt.setActiveSection(o.state);
        } else {
            // console.log("initial")
            pt.setInitialActive();
        }
    }

    document.addEventListener("DOMContentLoaded",o => new ProtoTight());
    
})(window);
