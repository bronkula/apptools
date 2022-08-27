/*
 * Canvas.js from the DrawTools.js library
 * Creator: Hamilton Cline
 * Email: hamdiggy@gmail.com
 * Website: hamiltondraws.com
*/


/* This library requires the Maths.js library for a number of its functions */

/*
Context options to remember
fillStyle:"#fff"
strokeStyle:"#000"
lineWidth:number
lineJoin:"round|bevel|miter"
lineCap:"round|butt|square"
font:"16px verdana"
textAlign:"center|left|right"
textBaseline:"top|middle|bottom|alphabetic|hanging"
globalAlpha:0-1
globalCompositeOperation:"source-over|destination-out"
*/










/*----------------------------------------------------------------------*/
/*                         Path functions                               */

const pathmaker = {
   start(ctx){ ctx.beginPath(); },
   end(ctx){ ctx.closePath(); },
   points(ctx,pts){
      if(pts.length<2) return false;
      ctx.moveTo(pts[0].x,pts[0].y);
      for(let {x,y} of pts) ctx.lineTo(x,y);
   },
   polygon(ctx,x,y,r,a,s){
      let eachangle = 360/s;
      let line = [];
      for(let i=0;i<=s;i++) {
         line.push(getSatelliteXY(x,y,degreesToRadians(a+(eachangle*i)),r));
      }
      pathmaker.points(ctx,line);
   },
   circle(ctx,x,y,r,a1=0,a2=2*Math.PI,a3){
      pathmaker.arc(ctx,x,y,r,a1,a2,a3);
   },
   arc(ctx,x,y,r,a1,a2,a3){
      ctx.arc(x,y,r,a1,a2,a3); },
   rect(ctx,x,y,w,h){
      pathmaker.points(ctx,[
         {x:x,y:y},
         {x:x+w,y:y},
         {x:x+w,y:y+h},
         {x:x,y:y+h},
         {x:x,y:y}
      ]);
   },
   pie(ctx,x,y,or,ir,sa,ea,ad){
      pathmaker.arc(ctx,x,y,or, sa, ea+sa, !ad);
      pathmaker.arc(ctx,x,y,ir, ea+sa, sa, ad);
   },
   roundRect(ctx,x,y,w,h,r){
      if (typeof r === 'undefined') r = 0;
      else if (typeof r === 'number') {
         r = {tl: r, tr: r, br: r, bl: r};
      } else {
         r = Object.assign({tl: 0, tr: 0, br: 0, bl: 0},r);
      }
      ctx.moveTo(x + r.tl, y);
      ctx.lineTo(x + w - r.tr, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
      ctx.lineTo(x + w, y + h - r.br);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
      ctx.lineTo(x + r.bl, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
      ctx.lineTo(x, y + r.tl);
      ctx.quadraticCurveTo(x, y, x + r.tl, y);
   }
}
const makePath = (ctx,paths,close=true) => {
   pathmaker.start(ctx);
   for(let o of paths) pathmaker[o.splice(0,1,ctx)[0]].apply(null,o);
   if(close) pathmaker.end(ctx);
}


/*----------------------------------------------------------------------*/
/*                         Draw functions                               */

/* Stroke path */
const strokeIt = (ctx,options) => {
   if(!options) return;
   if(options.lineWidth) Object.assign(ctx,options).stroke();
}
/* Fill a path */
const fillIt = (ctx,options) =>{
   if(!options) return;
   if(options.fillStyle) Object.assign(ctx,options).fill();
}


/* Draw a circle */
const drawCircle = (ctx,x,y,r,options) => {
   makePath(ctx,[["circle",x,y,r]]);
   fillIt(ctx,options);
   strokeIt(ctx,options);
}
/* Draw a rectangle: x,y, width, height */
const drawRect = (ctx,x,y,w,h,options,c=false) => {
   makePath(ctx,[["rect",c?x-w*0.5:x,c?y-h*0.5:y,w,h]]);
   fillIt(ctx,options);
   strokeIt(ctx,options);
}
/* Draw a Polygon: x,y, radius, start angle, sides */
const drawPolygon = (ctx,x,y,r,a,s,options) => {
   makePath(ctx,[["polygon",x,y,r,a,s]]);
   fillIt(ctx,options);
   strokeIt(ctx,options);
}
/* Draw a rectangle with a random color, using the rand helper function */
const drawRandomRect = (ctx,x,y,w,h,options) => {
   options.fillStyle = `rgba(
      ${rand(120,250)},
      ${rand(120,250)},
      ${rand(120,250)},
      ${Object.assign({opacity:0.7},options).opacity}
      )`;
   drawRect(ctx,x,y,w,h,options);
}
/* Draw one line segment */
const drawSegment = (ctx,x1,y1,x2,y2,options) => {
   makePath(ctx,[["points",[
      {x:x1,y:y1},
      {x:x2,y:y2}
      ]]]);
   strokeIt(ctx,options);
}
/* Draw an array of line segments, allowing smooth connections */
const drawLine = (ctx,line,options,close=false) => {
   makePath(ctx,[["points",line]],close);
   strokeIt(ctx,options);
   fillIt(ctx,options);
}

/* Draw text */
const drawText = (ctx,x,y,text,options) => {
   ctx = Object.assign(ctx,options);
   if(options.lineWidth) ctx.strokeText(text,x,y);
   if(options.fillStyle) ctx.fillText(text,x,y);
}
/* Draw text, replacing new lines characters with visible line breaks */
const drawParagraph = (ctx,x,y,text,lineHeight,options) => {
   var ps = text.split(/\n/);
   for(let i in ps) {
      drawText(ctx,x,y+(lineHeight*i),ps[i],options);
   }
}
/* Draw text with a cut out stroke */
const drawLabel = (ctx,text,x,y,options) => {
   ctx = Object.assign(ctx,options);
   ctx.globalCompositeOperation = "destination-out";
   ctx.strokeText(text,x,y);
   ctx.globalCompositeOperation = "source-over";
   ctx.fillText(text,x,y);
}

/* Draw a pie shape or donut pie shape */
const drawPie = (ctx,x,y,outerRadius,innerRadius,startangle,endangle,additive,options) => {
   makePath(ctx,[["pie",x,y,outerRadius,innerRadius,startangle,endangle,additive]]);
   fillIt(ctx,options);
   strokeIt(ctx,options);
}

const drawRoundRect = (ctx,x,y,w,h,r,options) => {
   makePath(ctx,[["roundRect",x,y,w,h,r]]);
   strokeIt(ctx,options);
   fillIt(ctx,options);
}

/* Draw a gradient
direction: [x1,y1,x2,y2]
stops: [[percent,color],[percent,color]]
position: [x,y,w,h]
*/
const drawGradient = (ctx,direction,stops,position) => {
   let grd=ctx.createLinearGradient.apply(ctx,direction);
   for(let o of stops) grd.addColorStop.apply(grd,o);
   ctx.fillStyle=grd;
   ctx.fillRect.apply(ctx,position);
}



/* draw a series of circle at x y coordinates */
const drawPoints = (ctx,line,radius,options) => {
   pathmaker.start(ctx);
   for(let {x,y} of line) {
      ctx.moveTo(x,y);
      pathmaker.circle(ctx,x,y,radius);
   }
   // pathmaker.end(ctx);
   strokeIt(ctx,options);
   fillIt(ctx,options);
}
/* draw a series of lines vertically and horizontally */
const drawGrid = (ctx,x,y,w,h,rows,cols,options) => {
   pathmaker.start(ctx);
   // Draw the rows
   for(let i=0;i<=rows;i++) {
      pathmaker.points(ctx,[
         {x:x,y:(h*(i/rows))+y},
         {x:x+w,y:(h*(i/rows))+y}
         ]);
   }
   // Draw the columns
   for(let i=0;i<=cols;i++) {
      pathmaker.points(ctx,[
         {x:(w*(i/cols))+x,y:y},
         {x:(w*(i/cols))+x,y:y+h}
         ]);
   }
   pathmaker.end(ctx);
   strokeIt(ctx,options);
}
/* Draw a grid, a line, and a series of points */
const drawLineGraph = (ctx,x,y,w,h,line,row,col,r,options=[
      {
         strokeStyle:"#ddd",
         lineWidth:2,
         lineJoin:"round",
         lineCap:"round"
      },{
         strokeStyle:"black",
         lineWidth:2,
         lineJoin:"round",
         lineCap:"round"
      },{
         fillStyle:"white",
         strokeStyle:"black",
         lineWidth:2
      }
   ]) => {
   drawGrid(ctx,x,y,w,h,row,col,options[0]);
   drawLine(ctx,line,options[1]);
   drawPoints(ctx,line,r,options[2]);
}


/* Create a line from a square position, and an array of values mapped to a min and max */
const lineFromValues = (x,y,w,h,min,max,v) =>
   v.map((o,i)=>({
      x:toward(x,x+w)(i/(v.length-1)),
      y:mapRange(y+h,y)(min,max)(o)}));



const rotateAndDo = ( ctx, angleInRad , positionX, positionY, callback) => {
   ctx.translate( positionX, positionY );
   ctx.rotate( angleInRad );
   callback();
   ctx.rotate( -angleInRad );
   ctx.translate( -positionX, -positionY );
}
/* This function does three operations, and saves first */
const translateScaleRotate = (ctx,x,y,sx,sy,r,fn) => {
  ctx.save();
   ctx.translate(x,y);
   ctx.scale(sx,sy);
   ctx.rotate(r);
   fn();
  ctx.restore();
}
/* This function will Translate and then Scale, and saves first */
const translateScale = (ctx,x,y,sx,sy,fn) => {
  ctx.save();
   ctx.translate(x,y);
   ctx.scale(sx,sy);
   fn();
  ctx.restore();
}




/* Create a curryed function which preloads an image to be placed onto canvas */
/*
example:
var drawMyImage = drawableImage("imageurl.jpg");
drawMyImage(ctx,10,10,50,50);
*/
const drawableImage = url => {
   let loaded = false;
   let i = new Image();
   i.onload = ()=> loaded=true;
   i.src = url;

   const drawI = function(ctx,x,y,w,h){
      //     console.log(i)
      if(!loaded) setTimeout(drawI,10);
      else ctx.drawImage(i,x,y,w,h);
   }
   return drawI;
}
/* This function will store a canvas into an image */
const storeImage = (cvs,w,h) => { 
  let i = new Image();
  i.src = cvs.toDataURL();
  return i;
}
/* Translate, Scale, Rotate, then draw an image */
const drawImageTSR = (ctx,img,x,y,w,h,sx,sy,r) => {
  translateScaleRotate(ctx,x,y,sx,sy,r,function(){
    ctx.drawImage(img,-w*0.5,-h*0.5,w,h);
  });
}






const pathtransform = function(ctx){
   this.ctx = ctx;
   ctx.save();
}
pathtransform.prototype.scale = function(x,y) {
   this.s = {x:x,y:y===undefined?x:y};
   this.ctx.scale(this.s.x,this.s.y);
   return this;
}
pathtransform.prototype.unscale = function() {
   this.ctx.scale(-this.s.x,-this.s.y);
   return this;
}
pathtransform.prototype.translate = function(x,y) {
   this.t = {x,y};
   this.ctx.translate(this.t.x,this.t.y);
   return this;
}
pathtransform.prototype.untranslate = function() {
   this.ctx.translate(-this.t.x,-this.t.y);
   return this;
}
pathtransform.prototype.rotate = function(r) {
   this.r = r;
   this.ctx.rotate(this.r);
   return this;
}
pathtransform.prototype.unrotate = function() {
   this.ctx.rotate(-this.r);
   return this;
}
pathtransform.prototype.do = function(fn,...args) {
   fn(this.ctx,...args);
   return this;
}
pathtransform.prototype.restore = function() {
   this.ctx.restore();
   return this;
}
pathtransform.prototype.save = function() {
   this.ctx.save();
   return this;
}
