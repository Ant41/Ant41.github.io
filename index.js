var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var canvasBack = document.getElementById("CanvasBack");
var ctxBack = canvasBack.getContext("2d");
var background;
//background.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80";

// background.onload = function(){
//     ctxBack.drawImage(background,0,0);
// }

ctx.strokeStyle = "#000000"; //default
ctx.fillStyle = "#000000"; //default
ctx.lineWidth = 1; //default

function test(event){

  if (penMode == true){
    draw(event);
  }
  if(eraseMode == true){
    erasing(event);
  }
  if(rectMode == true){
    rectDraw(event);
  }
  if(circMode == true){
    circDraw(event);
  }
  if(straightMode == true){
    straightDraw(event);
  }
}

function penSwitch(){
  penMode = true;
  eraseMode = false;
  rectMode = false;
  circMode = false;
  straightMode = false;
  document.getElementById("tool select").innerHTML = "pen";
  document.getElementById("selector").innerHTML = "select color";
}

function rectSwitch(){
  penMode = false;
  eraseMode = false;
  rectMode = true;
  circMode = false;
  straightMode = false;
  document.getElementById("tool select").innerHTML = "rectangle";
}

function circSwitch(){
  penMode = false;
  eraseMode = false;
  rectMode = false;
  circMode = true;
  straightMode = false;
  document.getElementById("tool select").innerHTML = "circle";
}

function straightSwitch(){
  penMode = false;
  eraseMode = false;
  rectMode = false;
  circMode = false;
  straightMode = true;
  document.getElementById("tool select").innerHTML = "straight line";
}

function fineMode() {
  ctx.lineWidth = 1;
  document.getElementById("Brush Size").innerHTML = "fine";
}

function normalMode() {
  ctx.lineWidth = 5;
  document.getElementById("Brush Size").innerHTML = "normal";
}

function thickMode() {
  ctx.lineWidth = 10;
  document.getElementById("Brush Size").innerHTML = "thick";
}

function blue(){
  ctx.strokeStyle = "#008bf5";
  ctx.fillStyle = "#008bf5";
  document.getElementById("selector").innerHTML = "Blue";
}

function green(){
  ctx.strokeStyle = "#0ac235";
  ctx.fillStyle = "#0ac235";
  document.getElementById("selector").innerHTML = "Green";
}

function red(){
  ctx.strokeStyle = "#de0404";
  ctx.fillStyle = "#de0404";
  document.getElementById("selector").innerHTML = "Red";
}

function black(){
  ctx.strokeStyle = "#000000";
  ctx.fillStyle = "#000000";
  document.getElementById("selector").innerHTML = "Black";
}

function yellow(){
  ctx.strokeStyle = "#e6de0b";
  ctx.fillStyle = "#e6de0b";
  document.getElementById("selector").innerHTML = "Yellow";
}

function uploading(event){
  var file = event.target.files[0];
  var reader  = new FileReader();
  reader.onloadend = function (e) {
      background = new Image();
      background.src = e.target.result;
      background.onload = function(ev) {
        if(background.height > 650){
          background.height = 650;
          canvas.height = background.height;
          canvasBack.height = background.height;
        }
        if (background.width > 1200){
          background.width = 1200;
          canvas.width = background.width;
          canvasBack.width = background.width;
        }
        ctxBack.drawImage(background,0,0);
      }
  }
  reader.readAsDataURL(file);
}

var backgroundWhite;

function clearBack() {
  ctxBack.clearRect(0,0,canvasBack.width,canvasBack.height);
  canvasBack.width = 1200;
  canvasBack.height = 500;
  canvas.width = 1200;
  canvas.height = 500;
}

function clearInk(){
  ctx.clearRect(0,0,canvasBack.width,canvasBack.height);
}

var x1;
var x2;
var y1;
var y2;
var eraseMode = false;
var part1 = 0;
var part2 = 0;

function firstPoint(){
  x1 = event.clientX;
  y1 = event.clientY;
  //console.log("x1 "+x1+" y1 "+y1);
  part1 = 1;
}

function secondPoint(){
  x2 = event.clientX;
  y2 = event.clientY;
  //console.log("x2 "+x2+" y2 "+y2);
  part2 = 1;
}

function erase(){
  penMode = false;
  eraseMode = true;
  rectMode = false;
  circMode = false;
  straightMode = false;
  erasing(event);
  document.getElementById("selector").innerHTML = "Erase";
  document.getElementById("tool select").innerHTML = "Eraser";
}

function erasing(event){
    myCanvas.addEventListener('mousedown', firstPoint);
    myCanvas.addEventListener('mouseup', secondPoint);

    if(part1 == 1 && part2 == 1){
      ctx.clearRect(x1,y1,x2-x1,y2-y1);
      // var imgData = ctx.getImageData(x1,y1,x2-x1,y2-y1);
      // var i;
      // for (i = 0; i < imgData.data.length; i += 4) {
      //   imgData.data[i] = 255;
      //   imgData.data[i+1] = 255;
      //   imgData.data[i+2] = 255;
      //   imgData.data[i+3] = 255;
      // }
      // ctx.putImageData(imgData, x1, y1);
      part1 = 0;
      part2 = 0;
    }

  }

var rectMode = false;

function rectDraw(event){
  myCanvas.addEventListener('mousedown', firstPoint);
  myCanvas.addEventListener('mouseup', secondPoint);

  if(part1 == 1 && part2 == 1){
    ctx.beginPath();
    ctx.strokeRect(x1,y1,x2-x1,y2-y1);
    part1 = 0;
    part2 = 0;
  }
}

var rad = 0;
var circMode = false;

function centerPoint(){
  x1 = event.clientX;
  y1 = event.clientY;
  //console.log("x1 "+x1+" y1 "+y1);
  part1 = 1;
}

function radiusLength(){
  x2 = event.clientX;
  y2 = event.clientY;
  //console.log("x2 "+x2+" y2 "+y2);
  part2 = 1;
  rad = Math.pow(Math.abs(x2-x1),2) + Math.pow(Math.abs(y2-y1),2);
  rad = Math.sqrt(rad);
}

function circDraw(event){
  myCanvas.addEventListener('mousedown', centerPoint);
  myCanvas.addEventListener('mouseup', radiusLength);

  if(part1 == 1 && part2 == 1){
    ctx.beginPath();
    ctx.arc(x1,y1,rad,0, 2*Math.PI);
    ctx.stroke();
    part1 = 0;
    part2 = 0;
  }
}

var straightMode = false;

function straightDraw(event) {
  myCanvas.addEventListener('mousedown', firstPoint);
  myCanvas.addEventListener('mouseup', secondPoint);

  if(part1 == 1 && part2 == 1){
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    part1 = 0;
    part2 = 0;
  }
}

var initialFlag = 1;
var drawOn = false;
var lastX;
var lastY;
var x;
var y;
var penMode = false;

function turnOn(){
  drawOn = true;
  x = event.offsetX;
  y = event.offsetY;
  lastX = x;
  lastY = y;
}

function turnOff(){
  drawOn = false;
}

function draw(event){
  x = event.offsetX; //clientX
  y = event.offsetY;
  document.addEventListener('keydown', turnOn);
  document.addEventListener('keyup', turnOff);

  if (initialFlag == 1) { //initial postion
    lastX = x;
    lastY = y;
    initialFlag = 0;
  }

  if (drawOn == true){
    ctx.beginPath();
    ctx.moveTo(lastX,lastY);
    ctx.lineTo(x,y);
    ctx.stroke();
    lastX = x;
    lastY = y;
  }
}
