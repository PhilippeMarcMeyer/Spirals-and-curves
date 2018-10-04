/*
Philippe MEYER 
DATE : 2018-10-02
*/


var globals = {
	mainHeight : 540,
	mainWidth : 480,
	baseW : 400,
	baseH: 480, 
	mode : "P2D",
	baseUnit:100,
	strokeWeight :1,
	strokeColor :  {r:255,g:255,b:255},
	backgroundColor:{r:115,g:90,b:215}

};
var CrtlPt1,CrtlPt2,ptA,ptB;
function setup() {
    var mode = (globals.mode == "WEBGL") ? WEBGL : P2D;
	var cnv = createCanvas(globals.mainWidth,globals.mainHeight,mode);
    cnv.parent('canvasZone');
	ptA = {x:globals.mainWidth/2,y:100};
	ptB = {x:globals.mainWidth/3,y:globals.mainHeight-100};
	
	//line(ptA.x,ptA.y,ptB.x,ptB.y);
	
	CrtlPt1 = {x:100,y:80,isDragged:false,radius:10,name:"1"};
	CrtlPt2 = {x:200,y:160,isDragged:false,radius:10,name:"2"};
}

function spiral(startAngle,startPoint,angleOffset,nrPoints,a,b,sign,startFct){
	var x,y;
	
	sign = sign || 1;
	if(startFct) startFct();
	push();
	translate(startPoint.x, startPoint.y);

	var angle = startAngle;
	for(var i = 0; i <nrPoints;i++){
		if(i<50) {stroke(255,0,0) } else {stroke(0)}
		r = a*Math.pow(b,angle);
		x = sign*cos(angle)*r;
		y = sign*sin(angle)*r;
		point(x, y);
		angle += angleOffset;
	}

	pop();
}

function spiralOfLength(startAngle,startPoint,angleOffset,maxLengthInLine,a,b,sign,startFct){
	var x,y,prevX,prevY;
	var lastSpiralPoint = {x:0,y:0};
	sign = sign || 1;
	if(startFct) startFct();
	push();
	translate(startPoint.x, startPoint.y);
    var nrPoints = 10000;
	var angle = startAngle;
	var prevX = 0;
	r = a*Math.pow(b,angle);
	prevX = sign*cos(angle)*r;
	prevY = sign*sin(angle)*r;
	for(var i = 1; i < nrPoints;i++){
		r = a*Math.pow(b,angle);
		x = sign*cos(angle)*r;
		y = sign*sin(angle)*r;
		line(prevX,prevY,x,y);
		prevX = x;
		prevY = y;
		angle += angleOffset;
		var len = getLineLength(startPoint.x,startPoint.y,x,y);
		if(len >= maxLengthInLine) {
			i = nrPoints; // get out of the loop
			lastSpiralPoint.x = x;
			lastSpiralPoint.y= y;
			}
	}

	pop();
	return lastSpiralPoint;
}

function getLineLength(x1,y1,x2,y2){
	var diffX = x2 - x1;
	var diffY = y2 - y1;
	return sqrt(diffX*diffX + diffY*diffY);
}

function getStokeWeight(){
	var strokeWht = globals.strokeWeight;
	if (globals.baseUnit  < 100){
		strokeWht = round(globals.baseUnit  / 20);
		if(strokeWht < 1) strokeWht = 1;
	}
	return strokeWht;
}

function draw() {
	background(globals.backgroundColor.r,globals.backgroundColor.g,globals.backgroundColor.b);
	stroke(globals.strokeColor.r,globals.strokeColor.g,globals.strokeColor.b);
	noFill();
	strokeWeight(getStokeWeight());
	var sizeMultiplier = globals.baseUnit / 100;
	var w = globals.baseW * sizeMultiplier / 2;
	var h = globals.baseH * sizeMultiplier / 4;

	var top = h;
	var delta = w / 2;
	
	var deltaTop = top + delta;
	var delta2 = delta / 2;
	var delta4 = delta / 4;
	var delta6= delta / 6;
	var delta8 = delta / 8;
	var delta12 = delta / 12;
	

	
	
push()
	stroke(0,255,0);
	bezier(ptA.x,ptA.y,CrtlPt1.x,CrtlPt1.y,CrtlPt2.x,CrtlPt2.y,ptB.x,ptB.y);
push()
stroke(0,255,255);
	curve(CrtlPt1.x,CrtlPt1.y,ptA.x,ptA.y,ptB.x,ptB.y,CrtlPt2.x,CrtlPt2.y);
pop();

push()

	strokeWeight(20);
	stroke(0,255,0);
	point(ptA.x,ptA.y);
	stroke(255,0,0);
	point(ptB.x,ptB.y);
	
pop();
	drawCtrl(CrtlPt1);
	drawCtrl(CrtlPt2);
}



function drawCtrl(pt){
	push()
		ellipseMode(CENTER);
		strokeWeight(1);
		fill(0,0,255);
		stroke(0,0,255);
		ellipse(pt.x, pt.y, pt.radius*2, pt.radius*2); 
		textSize(16);
		stroke(255);
		fill(255);
		text(pt.name,pt.x-pt.radius/2, pt.y+pt.radius/2,);
	pop();
}

function mouseDragged() {
  var x = mouseX;
  var y = mouseY;
  
 if(CrtlPt1.isDragged ){
	 CrtlPt1.x = x;
	 CrtlPt1.y = y;
 }
 
  if(CrtlPt2.isDragged ){
	 CrtlPt2.x = x;
	 CrtlPt2.y = y;
 }
  // prevent default
  return false;
}

function mousePressed() {
  var x = mouseX;
  var y = mouseY;

  if(x <= CrtlPt1.x+CrtlPt1.radius && x >= CrtlPt1.x-CrtlPt1.radius && y <= CrtlPt1.y+CrtlPt1.radius && y >= CrtlPt1.y-CrtlPt1.radius ){
	  CrtlPt1.isDragged = true;
  }
  
    if(x <= CrtlPt2.x+CrtlPt2.radius && x >= CrtlPt2.x-CrtlPt2.radius && y <= CrtlPt2.y+CrtlPt2.radius && y >= CrtlPt2.y-CrtlPt2.radius ){
	  CrtlPt2.isDragged = true;
  }
}

function mouseReleased() {
	
  var x = mouseX;
  var y = mouseY;
  
 if(CrtlPt1.isDragged ){
	 CrtlPt1.x = x;
	 CrtlPt1.y = y;
 }
 
  if(CrtlPt2.isDragged ){
	 CrtlPt2.x = x;
	 CrtlPt2.y = y;
 }
	CrtlPt1.isDragged = false;
	CrtlPt2.isDragged = false;
}