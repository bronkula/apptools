;/*
BaseProtoType v0.6
Developed by Hamilton Cline
hamdiggy@gmail.com
http://www.hamiltondraws.com

Changelog
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

        this.originalHash = location.hash;
        this.updateUrl= false;
        this.stateObj={title:null,url:location.href};
        this.currentSection = null;
        this.navHistory = [];
        this.sections = [];
        this.mainElement = $(el||"body");
        this.init(el);

        this.els = {

        }
    }



    BaseProto.prototype.init = function() {
        var bp = this;
        bp.makeTabList();

        bp.setInitialActive();

        bp.setFigures();
        bp.setEvents();



        w.onpopstate = function(o){
            if(o.state!=null) {
                // console.log("pop")
                bp.updateUrl = false;
                bp.stateObj.title = o.state.title;
                bp.stateObj.url = o.state.url;
                bp.setActive(bp.stateObj.title);
            } else {
                // console.log("initial")
                bp.setInitialActive();
            }
        }
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
        // check if the hash was empty
        var h = this.originalHash!=="" ? this.originalHash.substr(1) : "";
        // if the hash was not one of the sections, the active one is the first
        if($.inArray(h,this.sections)===-1) {
            h = this.sections[0];
        }
        this.stateObj.title = h;
        this.setActive(h);
    };
    BaseProto.prototype.setActive = function(str) {
        this.currentSection = str;
        $(".active").removeClass("active");
        $("."+str).addClass("active");
        
        if (this.updateUrl) {
            history.pushState(this.stateObj, this.stateObj.title, this.stateObj.url);
            this.updateUrl = false;
        }
    };

    BaseProto.prototype.setSection = function(str) {

        if(str=="back") {
            if(history.state != null) w.history.back();
        }
        else if (history.pushState) {
            this.stateObj = {
                title: str,
                url: w.location.origin + w.location.pathname + "#" + str
            };
            this.updateUrl = true;
            this.setActive(str);
        } else {
            /* Ajax navigation is not supported */
            location.assign(this.stateObj.url);
        }
    };
    BaseProto.prototype.setPopup = function(str) {
        var $aside = $(`<aside class='${str}'>`).append(
            `<div class='proto-aside-cover'></div>
            <div class='proto-aside-content'>${this.mt($("#"+str).html())([])}<div>`
        ).appendTo($("section."+this.currentSection));
        setTimeout(function(){$aside.addClass("proto-show")},15);
        return false;
    };
    BaseProto.prototype.setPopdown = function() {
        var $aside = $(this).parents("aside").removeClass("proto-show");
        setTimeout(function(){$aside.remove()},300);
        return false;
    };
    BaseProto.prototype.removePops = function() {
        $("aside[class],.aside-cover").remove();
    };
    BaseProto.prototype.setFigures = function() {
        var bp = this;
        $("figure[class]").each(function(){
            $(this).replaceWith(
                bp.mt($("#"+$(this).attr("class")).html())($(this).data())
            );
        });
    };
    BaseProto.prototype.toggleAccordion = function(o){
        o.parents(".proto-list-accordion")
            .find(".proto-list-item").not(o).removeClass("proto-nextopen");
        o.toggleClass("proto-nextopen");
    }

    BaseProto.prototype.setEvents = function(el) {
        var bp = this;
        this.mainElement
            .on("click",".proto-jump",function(e){
                e.preventDefault();
                return bp.setSection($(this).attr("href").substr(1)); })
            .on("click",".proto-popup",function(e){
                e.preventDefault();
                return bp.setPopup($(this).attr("href").substr(1)); })
            .on("click",".proto-popdown,.proto-aside-cover",this.setPopdown)
            .on("click",".proto-info-close",function(){
                $(".proto-info.active").removeClass("active"); })
            .on("click",".proto-toggle-next",function(){
                $(this).toggleClass("proto-nextopen"); })
            .on("click",".proto-toggle-parentnext",function(){
                $(this).parent().toggleClass("proto-nextopen"); })
            .on("click",".proto-toggle-nextaccordion",function(){
                bp.toggleAccordion($(this)); })
            .on("click",".proto-toggle-parentnextaccordion",function(){
                bp.toggleAccordion($(this).parent()); })
        // return this.mainElement;
    };

    // Mustache Template with default values
    BaseProto.prototype.mt = function(template_string){
        var bp = this;
        return function(data) {
            var output = bp.decodeHtml(template_string);
            for(let key in data){
                if(data.hasOwnProperty(key) === false) continue;
                console.log(output,data,key,'<%=\s*' + key + '(\:.+?)?\s*%>')
                output = output.replace(RegExp('<%=\\s*' + key + '(:.+?)?\\s*%>', 'g'), data[key]);
            }
            output = output.replace(RegExp('<%=\\s*\\S+?:(.+?)\\s*%>', 'g'), '$1');
            return output;
        }
    }
    BaseProto.prototype.decodeHtml = function(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    // $(function(){ BaseProto.init(); });

    w.BaseProto = BaseProto;
})(window);
