


let viewWidth;
let viewHeight;
let docHeight;
let docWidth;

let targetRatio = 0.4;
let ratio;

let created = false;
let target = "body *";

let moving = false;
let offset = 0;









const setStyle = (o,styles) => {
   for(let i in styles) o.style[i] = styles[i];
   return o;
}
const setAttr = (o,attr) => {
   for(let i in attr) o.setAttribute(i,attr[i]);
   return o;
}
const El = ({className='',type='div',styles={},attr={},html='',children=[]}) => {
   let o = window.document.createElement(type);
   if(className) o.classList.add(className);
   if(html) o.innerHTML = html;
   children.forEach(el=>o.append(el))
   for(let i in styles) o.style[i] = styles[i];
   for(let i in attr) o.setAttribute(i,attr[i]);
   return o;
}








let mini = {
   el:El({styles:{
      position:"fixed",
      top:"0",
      right:"0",
      border:"red 2px solid",
      backgroundColor:"white",
      zIndex:"10000",
      boxSizing:"content-box"
   }}),
   window:El({styles:{
      position:"absolute",
      width:"100%",
      border:"2px solid blue",
      backgroundColor:"rgba(200,200,255,0.25)",
      pointerEvents:"none",
      boxSizing:"border-box"
   }}),
   children:El({styles:{}}),
   viewWidth:0,
   viewHeight:0,
   docWidth:0,
   docHeight:0
};





let settingsElements = El({type:'select'})
let settingsClasses = El({type:'select'})
let settingsList = El({children:[settingsElements,settingsClasses]});
let settings = {
   el:El({styles:{
      position:"fixed",
      bottom:0,
      right:0,
      padding:"10px",
      backgroundColor:"white"
   },html:"<h2 style='margin:0'>settings</h2>",children:[settingsList]}),
   settingsList: settingsList,
   elements:[],
   nodeTypes:[],
   classNames:[]
}



const makeSettingsSelects = () => {
   settingsElements.innerHTML = "<option>All</option>";
   settings.nodeTypes.forEach(o=>{
      settingsElements.append(El({type:'option',attr:{value:o},html:o[0].toUpperCase()+o.substr(1).toLowerCase()}))
   })
   settingsClasses.innerHTML = "<option>All</option><option value='false'>None</option>";
   settings.classNames.forEach(o=>{
      settingsClasses.append(El({type:'option',attr:{value:o},html:"."+o}))
   })
}




const sortElements = () => {
   let els = settingsElements.value;
   let cls = settingsClasses.value;

   settings.elements.forEach(o=>{
      let display = 'none';

      if(els == 'All') display = 'block'
      else if (o.originalEl.nodeName == els) display = 'block';

      if(cls=='false') { if(o.originalEl.className!='') display = 'none'; }
      else if(cls!='All' && !o.originalEl.classList.contains(cls)) display = 'none';

      o.el.style.display = display;
   })
}
settingsClasses.addEventListener("change",sortElements)
settingsElements.addEventListener("change",sortElements)





const evPoints = event =>
   event.type.substring(0,5)!="touch"?[event]:
   !event.touches.length?event.changedTouches:event.touches;
const getEXY = (event,obj) => {
   let r = (obj||event.target).getBoundingClientRect();
   return ({ x:event.screenX-r.left, y:event.screenY-r.top }); }
const getEventXY = (event,obj) => getEXY(evPoints(event)[0],obj);



const handleMove = function(e) {
   e.preventDefault();
   if(!moving) return;
   let pos = getEventXY(e,mini.el);
   window.document.scrollingElement.scrollTop = (pos.y-offset)/ratio;
}
const handleStart = function(e) {
   let pos = getEventXY(e,mini.el);
   offset = pos.y-mini.window.offsetTop;
   moving = true;
}
const handleEnd = function(e) {
   offset = 0;
   moving = false;
}


const makeChildren = () => {
   mini.elements = [];
   mini.children.innerHTML = '';

   let t = window.document.querySelectorAll(target);
   let i = 0;

   t.forEach(o=>{
      let el = {};

      el.scrollSectionHeight = o.clientHeight;
      el.scrollTop = o.offsetTop;
      el.pageBottomToSectionTop = el.scrollTop - viewHeight; // 1
      el.pageTopToSectionTop = el.scrollTop; // 2
      el.pageBottomToSectionBottom = (el.scrollTop + el.scrollSectionHeight) - viewHeight; // 3
      el.pageTopToSectionBottom = el.scrollTop + el.scrollSectionHeight;

      el.originalEl = o;

      el.el = El({styles:{
         position:"absolute",
         width:"100%",
         border:"1px solid green",
         backgroundColor:"rgba(200,255,200,0.1)",
         pointerEvents:"none",
         boxSizing:"border-box",
         top:o.offsetTop*ratio + "px",
         left:o.offsetLeft*ratio + "px",
         width:o.clientWidth*ratio + "px",
         height:o.clientHeight*ratio + "px",
      }})

      settings.elements.push(el);
      mini.children.append(el.el);
   });

   let nodeTypes = [...(new Set(settings.elements.map(o=>o.originalEl.nodeName)))];
   let classNames = [...(new Set(settings.elements.reduce((r,o)=>([...r,...o.originalEl.classList]),[])))];

   if(nodeTypes.join('')!=settings.nodeTypes.join('') ||
      classNames.join('')!=settings.classNames.join('')) {
      settings.nodeTypes = nodeTypes;
      settings.classNames = classNames;
      makeSettingsSelects();
}

   sortElements();

   // console.log(mini.nodeTypes)
   // console.log(mini.classNames)
   // console.log(mini.elements)
   console.log(settings)
}



const setPosition = (y) => {
   if(window.document.scrollingElement.scrollHeight!=docHeight
      || window.document.scrollingElement.scrollWidth!=docWidth) init();

   setStyle(mini.window,{top:(y*ratio) + 'px'})
}

const setWindow = () => {
   setStyle(mini.window,{
      top:0,
      left:0,
      width:mini.viewWidth + 'px',
      height:mini.viewHeight + 'px'
   });
}



const init = () => {

   viewWidth = window.innerWidth;
   viewHeight = window.innerHeight;
   docWidth = window.document.scrollingElement.scrollWidth;
   docHeight = window.document.scrollingElement.scrollHeight;

   ratio = viewHeight/docHeight*targetRatio;

   mini.docHeight = docHeight*ratio;
   mini.docWidth = viewWidth*ratio;
   mini.viewHeight = viewHeight*ratio;
   mini.viewWidth = viewWidth*ratio;

   dragging = false;
   offset = 0;

   setStyle(mini.el,{
      width: mini.docWidth + 'px',
      height: mini.docHeight + 'px'
   })

   makeChildren();

   setWindow();

   if(!created) {
      mini.el.append(mini.window);
      mini.el.append(mini.children);

      created = true;
   }
}




window.document.body.append(mini.el);
window.document.body.append(settings.el);
mini.el.addEventListener("mousemove",handleMove);
mini.el.addEventListener("touchmove",handleMove);
mini.el.addEventListener("mousedown",handleStart);
mini.el.addEventListener("touchstart",handleStart);
window.addEventListener("mouseup",handleEnd);
window.addEventListener("touchend",handleEnd);

window.document.addEventListener("scroll",()=>{
   setPosition(window.document.scrollingElement.scrollTop)
})
window.addEventListener("resize",()=>{
   init();
})

// init('body *');


