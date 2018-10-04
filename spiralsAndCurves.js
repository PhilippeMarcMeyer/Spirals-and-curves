/*
Philippe MEYER 
DATE : 2018-10-02
*/


var globals = {
	mainHeight : 640,
	mainWidth : 640,
	baseW : 640,
	baseH: 640, 
	mode : "P2D",
	baseUnit:100,
	strokeWeight :1,
	strokeColor :  {r:0,g:0,b:0},
	backgroundColor:{r:225,g:225,b:225}

};
var CrtlPt1,CrtlPt2,ptA,ptB;
var arrObjects = [];
function setup() {
    var mode = (globals.mode == "WEBGL") ? WEBGL : P2D;
	var cnv = createCanvas(globals.mainWidth,globals.mainHeight,mode);
    cnv.parent('canvasZone');
	ptA = {x:globals.mainWidth/2,y:100,isDragged:false,radius:10,name:"A",color:"#00ff00"};
	ptB = {x:globals.mainWidth/3,y:globals.mainHeight-100,isDragged:false,radius:10,name:"B",color:"#ee0000"};
	
	//line(ptA.x,ptA.y,ptB.x,ptB.y);
	
	CrtlPt1 = {x:100,y:80,isDragged:false,radius:10,name:"1",color:"#0000ff"};
	CrtlPt2 = {x:200,y:160,isDragged:false,radius:10,name:"2",color:"#0000ff"};
	arrObjects = [CrtlPt1,CrtlPt2,ptA,ptB];
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
	stroke(255,0,0);
		curve(CrtlPt1.x,CrtlPt1.y,ptA.x,ptA.y,ptB.x,ptB.y,CrtlPt2.x,CrtlPt2.y);
	pop();

	arrObjects.forEach(function(pt){
		drawObject(pt);
	});
	push()
		textSize(12);
		stroke(0);
		fill(0);
		text("Bezier in green and curve in red",20,globals.mainHeight-30);
	pop();
		
}



function drawObject(pt){
	push()
		ellipseMode(CENTER);
		strokeWeight(1);
		fill(pt.color);
		stroke(pt.color);
		ellipse(pt.x, pt.y, pt.radius*2, pt.radius*2); 
		textSize(16);
		stroke(255);
		fill(255);
		text(pt.name,pt.x-pt.radius/2, pt.y+pt.radius/2);
		textSize(12);
		stroke(0);
		fill(0);
		text(floor(pt.x)+","+floor(pt.y),pt.x+pt.radius*2, pt.y);
	pop();
}

function mouseDragged() {
  var x = mouseX;
  var y = mouseY;
  	arrObjects.forEach(function(pt){
		 if(pt.isDragged ){
			 pt.x = x;
			 pt.y = y;
		}
	});
  // prevent default
  return false;
}

function mousePressed() {
  var x = mouseX;
  var y = mouseY;

  arrObjects.forEach(function(pt){
  if(x <= pt.x+pt.radius && x >= pt.x-pt.radius && y <= pt.y+pt.radius && y >= pt.y-pt.radius ){
		pt.isDragged = true;
		}
	});
}

function mouseReleased() {
	
  var x = mouseX;
  var y = mouseY;
  
   arrObjects.forEach(function(pt){
	if(pt.isDragged ){
		 pt.x = x;
		 pt.y = y;
	 }
	 pt.isDragged = false;
   });
  
}