function setup() {
  createCanvas(400, 400);
}
function toRad(deg){
  return deg * (PI/180);
}
function draw() {
  background(220);
  var s = second();
  var m = minute();
  var h = hour();
  strokeWeight(2);
  noFill();
  arc(200, 200, 240, 240, PI + HALF_PI, PI + HALF_PI + toRad(s*6), OPEN);
  if(m==0){
    point(200, 340);
  }else{
    arc(200, 200, 280, 280, PI + HALF_PI, PI + HALF_PI + toRad(m*6), OPEN);
  }
  if(h==0){
    point(200, 360);
  }else{
    arc(200, 200, 320, 320, PI + HALF_PI, PI + HALF_PI + toRad(h*15), OPEN);
  }
}
