
/* MATHS.JS */
/*---------------------- Math Helper Functions -----------------------------*/

/* Turn degrees into Radians, necessary for circle math */
export const degreesToRadians = a => a*Math.PI/180;
   
/* Turn Radians into Degrees, necessary for circle math */
export const radiansToDegrees = a => a*180/Math.PI;
   
/* Returns the angle from two points */
export const angleFromPoints = (x1,y1,x2,y2) => Math.atan2(y2-y1,x2-x1);
/* The distance between two points */
export const pointDistance = (x1,y1,x2,y2) => Math.hypot(x1-x2,y1-y2);

// Will return the angle opposite of the B side
export const angleFromSides = (a,b,c) => Math.acos((c*c+a*a-b*b)/(2*c*a));
   
/* A random integer between n and x */
export const rand = (n,x) => Math.round(Math.random()*(x-n))+n;

export const circumference = r => Math.PI*2*r;



/* Returns an x y object from x y values */
export const xy = (x,y) => ({x,y});

/* Vector cross product. This shit is magic */
export const vxs = (x0,y0,x1,y1) => (x0*y1) - (x1*y0);
   
/* If p(osition) is outside of n or x, return a reversed s(peed) */
export const bounce = (min,max) => (pos,spd) => pos>=max||pos<=min?-spd:spd;

/* Bounce angle a off of a vertical or horizontal wall */
export const bounceX = a => Math.sign(a)*unsignHalfRadian(-signHalfRadian(Math.abs(signRadian(a))));
export const bounceY = a => -signRadian(a);

/* This function is basic ratio math. curries a ratio and then multiplies that by another number */
export const ratio = (min,max) => n => n*min/max;

/* Nudge a number a certain percentage of a distance using a starting offset */
export const nudge = (o,p,n) => p*n+o;




/* ---------------------  CLAMPS AND WRAPS ----------------------------*/

/* Make sure a number does not passbelow a min or above a max */
export const clamp = (min,max) => n => n>max?max:n<min?min:n;

/* Given a curried max value, attempts to bring negative numbers to positive range of loop */
export const unsignNumber = max => n => n<0?n+max:n;
   const unsignRadian = unsignNumber(Math.PI*2);
   const unsignHalfRadian = unsignNumber(Math.PI);
   const unsignDegree = unsignNumber(360);

/* Given a curried max value, attempts to wrap a number over half into a negative number of loop */
export const signNumber = max => n => n>max*0.5?n-max:n<max*-0.5?n+max:n;
   const signRadian = signNumber(Math.PI*2);
   const signHalfRadian = signNumber(Math.PI);
   const signDegree = signNumber(360);

/* Given a curried max value, attempts to wrap a number within that max */
export const wrapNumber = max => {
   const t = unsignNumber(max);
   const s = signNumber(max);
   return n => t(s(n));
}

/* This function returns an arbitrary positive number looped inside an arbitrary positive number range. */
export const within = (min,max) => {
   const t = wrapNumber(max-min+1);
   return n => t(n-min)+min;
}



/* ----------------------------  MAPPING ----------------------------*/

   
/* This function returns the percentage of an arbitrary number mapped to an arbitrary number range */
export const partof = (min,max) => n => (n-min)/(max-min);
   const partofCircle = partof(0,360);
   
/* This function returns a number from an arbitrary number range using a percentage. Optional offset value.
example:
toward(10,20)(0.5) > 15
*/
export const toward = (min,max) => n => n*(max-min)+min;

/* This function maps a number from one arbitrary range onto another arbitrary range.
example:
mapRange(5,0,10,0,360) > 180
mapN(0,360)(0,10)(2) > 72
*/
export const mapRange = (min,max) => {
   const t = toward(min,max);
   return (min,max) => {
      const p = partof(min,max);
      return n => t(p(n));
   }
}

/* Round number n to nearest number x */
export const roundTo = (n,x) => {
   if(x<1){var m=(""+x).split(".");var m2=Math.pow(10,m[1].length);n*=m2;x*=m2;}
   let r=x*Math.round(n/x);
   return m2?r/m2:r;
}
   





/*------------------------ Positional Functions ------------------------------------*/

/* Return a point between one point and another: Position1, Position2, Percentage */
export const positionToward = (x1,y1,x2,y2,p) =>
   xy(toward(x1,x2)(p),toward(y1,y2)(p));

/* Expects an X and a Y, an angle, and a distance. Returns an XY object */
export const getSatelliteXY = (x,y,a,d) =>
   ({x:x+Math.cos(a)*d,y:y+Math.sin(a)*d});

/* check if two number ranges overlap */
export const overlap = (a1,a2,b1,b2) =>
   Math.min(a1,a2) <= Math.max(b1,b2) && Math.min(b1,b2) <= Math.max(a1,a2);

/* check if two boxes overlap */
export const intersectBox = (x0,y0,x1,y1,x2,y2,x3,y3) =>
   overlap(x0,x1,x2,x3) && overlap(y0,y1,y2,y3);

/* determine which side of a line a point is on */
export const pointSide = (px,py,x0,y0,x1,y1) =>
   vxs(x1-x0,y1-y0,px-x0,py-y0);

/* Intersect: Calculate the point of intersection between two lines. */
export const intersect = (x0,y0,x1,y1,x2,y2,x3,y3) => xy(
   vxs(vxs(x0,y0,x1,y1),x0-x1,vxs(x2,y2,x3,y3),x2-x3) / vxs(x0-x1,y0-y1,x2-x3,y2-y3),
   vxs(vxs(x0,y0,x1,y1),y0-y1,vxs(x2,y2,x3,y3),y2-y3) / vxs(x0-x1,y0-y1,x2-x3,y2-y3)
);

/* Calculate if two lines intersect */
export const isIntersect = (x0,y0,x1,y1,x2,y2,x3,y3) =>
   IntersectBox(x0,y0,x1,y1, x2,y2,x3,y3) &&
   Math.abs(PointSide(x2,y2,x0,y0,x1,y1) + PointSide(x3,y3,x0,y0,x1,y1)) != 2 &&
   Math.abs(PointSide(x0,y0,x2,y2,x3,y3) + PointSide(x1,y1,x2,y2,x3,y3)) != 2;

/* Detect if a point is in a rectangle */
export const pointInRect = (x1,y1,x2,y2) => (px,py) =>
   px>=x1&&px<=x2&&py>=y1&&py<=y2;

export const inRange = (a,b) => n =>
   a<=n&&b>=n;

export const pointInArc = (px,py,ax,ay,ir,or,as,ae) =>
   inRange(as,ae)(Math.atan2(ay-py,ax-px)) &&
   inRange(ir,or)(Math.hypot(px-ax,py-ay));


/* Curried function. Detect if a rectangle is fully within another rectangle */
export const rectInRect = (x1,y1,x2,y2) => {
   const r = pointInRect(x1,y1,x2,y2);
   return (x1,y1,x2,y2) => r(x1,y1) && r(x2,y2);
}

/* detect if a circle is touching another circle. Use 0 for r1 if a point */
export const circleCollission = (x1,y1,r1,x2,y2,r2) =>
   pointDistance(x1,y1,x2,y2) < (r1 + r2);

