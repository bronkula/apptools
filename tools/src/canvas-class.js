/*
 * Canvas.js from the DrawTools.js library
 * Creator: Hamilton Cline
 * Email: hamdiggy@gmail.com
 * Website: hamiltondraws.com
*/


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







const rand = (n,x) => Math.round(Math.random()*(x-n))+n;
const toward = (min,max) => n => n*(max-min)+min;
const partof = (min,max) => n => (n-min)/(max-min);
const mapRange = (min,max) => {
    const t = toward(min,max);
    return (min,max) => {
       const p = partof(min,max);
       return n => t(p(n));
    }
}




/*----------------------------------------------------------------------*/
/*                         Path functions                               */
export class Pather {
    constructor(ctx,cvs) {
        this.ctx = ctx;
        this.cvs = cvs;
        ctx.save();
    }
    path(paths,close=true) {
        Pathmaker.start(this.ctx);
        for(let o of paths) Pathmaker[o[0]](this.ctx,...o.slice(1));
        if(close) Pathmaker.end(this.ctx);
        return this;
    }


    start() { this.ctx.beginPath(); }
    end() { this.ctx.closePath(); }
    points(pts) {
        if (pts.length<2) return false;
        this.ctx.moveTo(pts[0].x,pts[0].y);
        for(let {x,y} of pts) this.ctx.lineTo(x,y);
        return this;
    }
    polygon(x,y,r,a,s) {
        let eachangle = 360/s;
        let line = [];
        for(let i=0;i<=s;i++) {
            line.push(getSatelliteXY(x,y,degreesToRadians(a+(eachangle*i)),r));
        }
        this.points(line);
        return this;
    }
    circle(x,y,r,a1=0,a2=2*Math.PI,angledirection) {
        this.arc(x,y,r,a1,a2,angledirection);
        return this;
    }
    arc(x,y,r,a1,a2,angledirection) {
        this.ctx.arc(x,y,r,a1,a2,angledirection);
        return this;
    }
    rect(x,y,w,h) {
        this.points([
            {x:x,y:y},
            {x:x+w,y:y},
            {x:x+w,y:y+h},
            {x:x,y:y+h},
            {x:x,y:y}
        ]);
        return this;
    }
    pie(x,y,outerradius,innerradius,startangle,endangle,angledirection) {
        this.arc(x,y,outerradius, startangle, endangle+startangle, !angledirection);
        this.arc(x,y,innerradius, endangle+startangle, startangle, angledirection);
        return this;
    }
    roundRect(x,y,w,h,r) {
        if (typeof r === 'undefined') r = 0;
        else if (typeof r === 'number') {
            r = {tl: r, tr: r, br: r, bl: r};
        } else {
            r = Object.assign({tl: 0, tr: 0, br: 0, bl: 0},r);
        }
        this.ctx.moveTo(x + r.tl, y);
        this.ctx.lineTo(x + w - r.tr, y);
        this.ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
        this.ctx.lineTo(x + w, y + h - r.br);
        this.ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
        this.ctx.lineTo(x + r.bl, y + h);
        this.ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
        this.ctx.lineTo(x, y + r.tl);
        this.ctx.quadraticCurveTo(x, y, x + r.tl, y);
        return this;
    }



    stroke(options={}) {
        if(options.lineWidth) Object.assign(this.ctx,options).stroke();
        return this;
    }
    fill(options={}) {
        if(options.fillStyle) Object.assign(this.ctx,options).fill();
        return this;
    }


    draw = {
        circle: (x,y,r,options) => {
            this.path([["circle",x,y,r]]);
            this.fill(options);
            this.stroke(options);
            return this;
        },
        /* Draw a rectangle: x,y, width, height */
        rect: (x,y,w,h,options,c=false) => {
           this.path([["rect",c?x-w*0.5:x,c?y-h*0.5:y,w,h]]);
           this.fill(options);
           this.stroke(options);
           return this;
        },
        /* Draw a Polygon: x,y, radius, start angle, sides */
        polygon: (x,y,r,a,s,options) => {
           this.path([["polygon",x,y,r,a,s]]);
           this.fill(options);
           this.stroke(options);
           return this;
        },
        /* Draw a rectangle with a random color, using the rand helper function */
        randomRect: (x,y,w,h,options) => {
           options.fillStyle = `rgba(
              ${rand(120,250)},
              ${rand(120,250)},
              ${rand(120,250)},
              ${Object.assign({opacity:0.7},options).opacity}
              )`;
           this.draw.rect(x,y,w,h,options);
           return this;
        },
        /* Draw one line segment */
        segment: (x1,y1,x2,y2,options) => {
           this.path([["points",[
              {x:x1,y:y1},
              {x:x2,y:y2}
              ]]]);
           this.stroke(options);
           return this;
        },
        /* Draw an array of line segments, allowing smooth connections */
        line: (line,options,close=false) => {
           this.path([["points",line]],close);
           this.stroke(options);
           this.fill(options);
           return this;
        },
        
        /* Draw text */
        text: (x,y,text,options) => {
           Object.assign(this.ctx,options);
           if(options.lineWidth) this.ctx.strokeText(text,x,y);
           if(options.fillStyle) this.ctx.fillText(text,x,y);
           return this;
        },
        /* Draw text, replacing new lines characters with visible line breaks */
        paragraph: (x,y,text,lineHeight,options) => {
           var ps = text.split(/\n/);
           for(let i in ps) {
              this.draw.text(x,y+(lineHeight*i),ps[i],options);
           }
           return this;
        },
        /* Draw text with a cut out stroke */
        label: (text,x,y,options) => {
           Object.assign(this.ctx,options);
           this.ctx.globalCompositeOperation = "destination-out";
           this.ctx.strokeText(text,x,y);
           this.ctx.globalCompositeOperation = "source-over";
           this.ctx.fillText(text,x,y);
           return this;
        },
        
        /* Draw a pie shape or donut pie shape */
        pie: (x,y,outerRadius,innerRadius,startangle,endangle,additive,options) => {
           this.path([["pie",x,y,outerRadius,innerRadius,startangle,endangle,additive]]);
           this.fill(options);
           this.stroke(options);
           return this;
        },
        
        roundRect: (x,y,w,h,r,options) => {
           this.path([["roundRect",x,y,w,h,r]]);
           this.stroke(options);
           this.fill(options);
           return this;
        },


        /* Draw a gradient
        direction: [x1,y1,x2,y2]
        stops: [[percent,color],[percent,color]]
        position: [x,y,w,h]
        */
        gradient: (direction,stops,position) => {
            let grd = this.ctx.createLinearGradient.apply(direction);
            for(let o of stops) grd.addColorStop.apply(grd,o);
            this.ctx.fillStyle = grd;
            this.ctx.fillRect.apply(position);
        },
        
        
        
        /* draw a series of circle at x y coordinates */
        points: (line,radius,options) => {
            this.start();
            for(let {x,y} of line) {
                this.ctx.moveTo(x,y);
                this.circle(x,y,radius);
            }
            // pathmaker.end(ctx);
            this.stroke(options);
            this.fill(options);
        },
        /* draw a series of lines vertically and horizontally */
        grid: (x,y,w,h,rows,cols,options) => {
            this.start(ctx);
            // Draw the rows
            for(let i in rows) {
                this.points([
                    {x:x,y:(h*(i/rows))+y},
                    {x:x+w,y:(h*(i/rows))+y}
                    ]);
            }
            // Draw the columns
            for(let i in cols) {
                this.points([
                    {x:(w*(i/cols))+x,y:y},
                    {x:(w*(i/cols))+x,y:y+h}
                    ]);
            }
            this.end(ctx);
            this.stroke(options);
        },
        /* Draw a grid, a line, and a series of points */
        lineGraph: (x,y,w,h,line,row,col,r,options=[
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
            this.draw.grid(x,y,w,h,row,col,options[0]);
            this.draw.line(line,options[1]);
            this.draw.points(line,r,options[2]);
        },



        /* Create a curryed function which preloads an image to be placed onto canvas */
        /*
        example:
        var drawMyImage = drawableImage("imageurl.jpg");
        drawMyImage(ctx,10,10,50,50);
        */
        drawableImage: url => {
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
        },
        /* This function will store a canvas into an image */
        storeImage: (cvs,w,h) => { 
            let i = new Image();
            i.src = cvs.toDataURL();
            return i;
        },
        /* Translate, Scale, Rotate, then draw an image */
        drawImageTSR: (ctx,img,x,y,w,h,sx,sy,r) => {
            translateScaleRotate(ctx,x,y,sx,sy,r,function(){
                ctx.drawImage(img,-w*0.5,-h*0.5,w,h);
            });
        },
    }

    image = {
        ctx: this.ctx,
        make(src) {
            let loaded = false;
            let i = new Image();
            i.onload = ()=> loaded=true;
            i.src = src;
        },
        draw(x,y,w,h) {
            if(!this.loaded) setTimeout(this.draw,10);
            else this.ctx.drawImage(i,x,y,w,h);
        },
        store(cvs,w,h) { 
            let i = new Image();
            i.src = cvs.toDataURL();
            return i;
        },
        TSR: (img,x,y,w,h,sx,sy,r) => {
            this.translateScaleRotate(x,y,sx,sy,r,function(){
                ctx.drawImage(img,-w*0.5,-h*0.5,w,h);
            });
        },
    }


    /* Create a line from a square position, and an array of values mapped to a min and max */
    static lineFromValues = (x,y,w,h,min,max,v) =>
        v.map((o,i)=>({
            x:toward(x,x+w)(i/(v.length-1)),
            y:mapRange(y+h,y)(min,max)(o)}));
        
        
        
    rotateAndDo = ( angleInRad , x, y, fn) => {
        this.ctx.translate( x, y );
        this.ctx.rotate( angleInRad );
        fn();
        this.ctx.rotate( -angleInRad );
        this.ctx.translate( -x, -y );
    }
    /* This function does three operations, and saves first */
    translateScaleRotate = (x,y,sx,sy,r,fn) => {
        this.ctx.save();
        this.ctx.translate(x,y);
        this.ctx.scale(sx,sy);
        this.ctx.rotate(r);
        fn();
        this.ctx.restore();
    }
    /* This function will Translate and then Scale, and saves first */
    translateScale = (x,y,sx,sy,fn) => {
        this.ctx.save();
        this.ctx.translate(x,y);
        this.ctx.scale(sx,sy);
        fn();
        this.ctx.restore();
    }

    transform = {
        t: {
            x:0,
            y:0,
        },
        s: {
            x:1,
            y:1,
        },
        r: 0,
        scale: (x, y) => {
            this.s = { x: x, y: y === undefined ? x : y };
            this.ctx.scale(this.s.x, this.s.y);
            return this;
        },
        unscale: () => {
            this.ctx.scale(-this.s.x, -this.s.y);
            return this;
        },
        translate: (x, y) => {
            this.t = { x, y };
            this.ctx.translate(this.t.x, this.t.y);
            return this;
        },
        untranslate: () => {
            this.ctx.translate(-this.t.x, -this.t.y);
            return this;
        },
        rotate: (r) => {
            this.r = r;
            this.ctx.rotate(this.r);
            return this;
        },
        unrotate: () => {
            this.ctx.rotate(-this.r);
            return this;
        },
        do: (fn, ...args) => {
            fn(this.ctx, ...args);
            return this;
        },
        restore: () => {
            this.ctx.restore();
            return this;
        },
        save: () => {
            this.ctx.save();
            return this;
        },
    }




    static make = (ctx) => new Pather(ctx);
}


export class ctxImage {
    constructor(ctx,cvs) {
        this.ctx = ctx;
        this.cvs = cvs;
        this.loaded = false;
        this.image;
    }
    make(src) {
        this.image = new Image();
        this.image.onload = () => loaded = true;
        this.image.src = src;
        return this;
    }
    draw(x,y,w,h) {
        if(!this.loaded) setTimeout(this.draw,10);
        else this.ctx.drawImage(this.image,x,y,w,h);
        return this;
    }
    store() { 
        let i = new Image();
        i.src = this.cvs.toDataURL();
        return i;
    }
}