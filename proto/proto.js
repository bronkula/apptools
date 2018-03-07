;/*
BaseProtoType v0.7
Developed by Hamilton Cline
hamdiggy@gmail.com
http://www.hamiltondraws.com

Changelog
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



    function BaseProto(el) {
        var bp = this;
        this.originalHash = location.hash;
        this.updateUrl= false;
        this.stateObj={title:null,url:null};
        this.currentSection = null;
        this.previousSection = null;
        this.navHistory = [];
        this.sections = [];
        this.mainElement = $(el||"body");
        this.makeTabList();

        this.setFigures();
        this.setEvents();

        setTimeout(function(){bp.init(el);},1);
        this.els = {

        }
    }



    BaseProto.prototype.init = function() {

        this.setInitialActive();
    };

    BaseProto.prototype.makeTabList = function() {
        var bp = this;
        // Search through the sections and pull out all the ids for links and tabs
        this.sections = [];
        $("[data-role='page']").each(function(index){
            var sid = $(this).attr("id");
            $(this).addClass(sid);
            bp.sections.push(sid);
        });
    };
    BaseProto.prototype.setInitialActive = function() {
        // console.log(location)
        // check if the hash was empty
        var h = this.originalHash!=="" ? this.originalHash.substr(1) : "";
        // if the hash was not one of the sections, the active one is the first
        if($.inArray(h,this.sections)===-1) {
            h = this.sections[0];
        }
        // console.log(h)
        // this.stateObj.title = h;
        this.setActiveSection({title:h,url:location.href});
    };
    BaseProto.prototype.setActiveSection = function(stateObj,updateUrl) {
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
    BaseProto.prototype.showActiveSection = function() {
        $("[data-role='page'].active").removeClass("active");
        $("."+this.stateObj.title).addClass("active");
    };

    BaseProto.prototype.changeSection = function(str,updateUrl) {
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
    // BaseProto.prototype.setPopup = function(str) {
    //     var $aside = $(`<aside class='${str}'>`).append(
    //         `<div class='proto-aside-cover'></div>
    //         <div class='proto-aside-content'>${this.mt($("#"+str).html())([])}<div>`
    //     ).appendTo($("section."+this.stateObj.title));
    //     setTimeout(function(){$aside.addClass("proto-show")},15);
    //     return false;
    // };
    // BaseProto.prototype.setPopdown = function() {
    //     var $aside = $(this).parents("aside").removeClass("proto-show");
    //     setTimeout(function(){$aside.remove()},300);
    //     return false;
    // };
    // BaseProto.prototype.removePops = function() {
    //     $("aside[class],.aside-cover").remove();
    // };
    BaseProto.prototype.setFigures = function() {
        var bp = this;
        $("figure[class]").each(function(){
            $(this).replaceWith(
                bp.mt($("#"+$(this).attr("class")).html())($(this).data())
            );
        });
    };
    // BaseProto.prototype.toggleAccordion = function(o){
    //     o.parents(".proto-list-accordion")
    //         .find(".proto-list-item").not(o).removeClass("proto-nextopen");
    //     o.toggleClass("proto-nextopen");
    // }
    // BaseProto.prototype.toggleActive = function(obj){
    //     obj.toggleClass("active");
    // }
    BaseProto.prototype.activate = function(obj,sel,fn){
        var el;
        switch(sel){
            case "next": el=$(obj).next(); break;
            case "prev": el=$(obj).prev(); break;
            case "parent": el=$(obj).parent(); break;
            default: el = $(sel);
        }
        el[fn]("active");
    }

    BaseProto.prototype.setEvents = function(el) {
        var bp = this;
        this.mainElement
            .on("click","[data-role='jump']",function(e){
                e.preventDefault();
                return bp.changeSection($(this).attr("href").substr(1),true); })
            .on("click","[data-role='pop']",function(e){
                e.preventDefault();
                bp.activate(this,$(this).attr("href"),"addClass")
                // return bp.setPopup($(this).attr("href").substr(1));
            })
            // .on("click",".proto-popdown,.proto-aside-cover",this.setPopdown)
            // .on("click",".proto-info-close",function(){
            //     $(".proto-info.active").removeClass("active"); })
            // .on("click","[data-toggle='next']",function(){
            //     bp.toggleActive($(this).next());
            //     // $(this).next().toggleClass("active"); 
            // })
            .on("click","[data-toggle]",function(e){
                e.preventDefault();
                bp.activate(this,$(this).data("toggle"),"toggleClass");
            })
            .on("click","[data-activate]",function(e){
                e.preventDefault();
                bp.activate(this,$(this).data("activate"),"addClass");
            })
            .on("click","[data-deactivate]",function(e){
                e.preventDefault();
                bp.activate(this,$(this).data("deactivate"),"removeClass");
            })
            // .on("click",".proto-accordion [data-toggle]",function(){
            //     bp.toggleActive(t=="next"?$(this).next():$(t),); 
            // })
            // .on("click",".proto-toggle-parentnextaccordion",function(){
            //     bp.toggleAccordion($(this).parent()); })
        // return this.mainElement;
    };

    // Mustache Template with default values
    BaseProto.prototype.mt = function(template_string){
        var bp = this;
        return function(data) {
            var output = (function(html) {
                var txt = document.createElement("textarea");
                txt.innerHTML = html;
                return txt.value;
            })(template_string);
            for(let key in data){
                if(data.hasOwnProperty(key) === false) continue;
                output = output.replace(RegExp('<%=\\s*' + key + '(:.+?)?\\s*%>', 'g'), data[key]);
            }
            output = output.replace(RegExp('<%=\\s*\\S+?:(.+?)\\s*%>', 'g'), '$1');
            return output;
        }
    }

    // $(function(){ BaseProto.init(); });

    w.BaseProto = BaseProto;


    w.onpopstate = function(o){
        // console.log(history)
        if(o.state!=null) {
            console.log("pop")
            // bp.updateUrl = false;
            // bp.stateObj.title = o.state.title;
            // bp.stateObj.url = o.state.url;
            bp.setActiveSection(o.state);
        } else {
            console.log("initial")
            bp.setInitialActive();
        }
    }
})(window);
