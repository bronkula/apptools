const getEventXY = (e,o) => {
  const p = e.type.substring(0,5)!="touch"?e:!e.touches.length?e.changedTouches[0]:e.touches[0];
  const rect = (o||p.target).getBoundingClientRect();
  return { x:p.pageX-rect.left, y:p.pageY-rect.top };
}

export default class SwipeSlider {
  constructor(o) {
    Object.assign(this,o);
    
    if(!this.swiperElement) throw "issue: No valid swiperElement provided";
    this.backElement = this.swiperElement.querySelector('.swipe-slider-back');
    this.frontElement = this.swiperElement.querySelector('.swipe-slider-front');
    
    this.pos = {start:{},offset:{},x:0};

    this.swiperElement.addEventListener('mousedown',e=>this.swipeStart(e));
    this.swiperElement.addEventListener('mouseup',e=>this.swipeEnd(e));
    this.swiperElement.addEventListener('mouseleave',e=>this.swipeEnd(e));
    this.swiperElement.addEventListener('mousemove',e=>this.swipeMove(e));
    this.swiperElement.addEventListener('touchstart',e=>this.swipeStart(e));
    this.swiperElement.addEventListener('touchend',e=>this.swipeEnd(e));
    this.swiperElement.addEventListener('touchmove',e=>this.swipeMove(e));
  }
  
  getSnap() {
    return this.snap!='100%'?this.snap:this.width();
  }
  canSnapToEnd() {
    const disttarget = this.getSnap()*(+this.snapPercentage||0.5);
    const dist = this.pos.offset.x + this.pos.x - this.pos.start.x;
    return (dist < -disttarget && !this.pos.open)?true:
      (dist > disttarget && this.pos.open)?false:
      this.pos.open;
  }
  
  width() { return this.swiperElement.getBoundingClientRect().width; }
  
  swipeStart(e) {
    if(this.swiping) return;
    this.swiping = true;
    Object.assign(this.pos.start,getEventXY(e,this.swiperElement));
    this.pos.offset.x = this.pos.start.x - this.pos.x;
    this.pos.open = this.pos.x!=0;
  }
  swipeEnd(e) {
    if(!this.swiping) return;
    this.swiping = false;
    if(this.canSnapToEnd()) this.pos.x = -this.getSnap();
    else this.pos.x = 0;
    this.setPosition();
  }
  swipeMove(e) {
    if(!this.swiping) return;
    e.preventDefault();
    let pos = getEventXY(e,this.swiperElement);
    this.pos.x = pos.x-this.pos.offset.x;
    this.setPosition();
  }
  setPosition(){
    Object.assign(this.frontElement.style,{
      transform:`translateX(${this.pos.x}px)`
    });
    if(this.onupdate) this.onupdate(this);
  }
}



/*
example:

new SwipeSlider({
  swiperElement:document.querySelectorAll('.swipe-slider')[2],
  snap:'100%',
  snapPercentage:0.3,
  onupdate:s=>{
    if(s.pos.x<-s.width()) return;
    Object.assign(s.backElement.style,{
      transform:`translateX(${s.pos.x}px)`
    });
  }
});
*/
