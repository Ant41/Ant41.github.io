var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.strokeStyle = "#000000"; //default

function test(event){
  if (penMode == true){
    draw(event);
  }
  if(eraseMode == true){
    erasing(event);
  }
}


function blue(){
  ctx.strokeStyle = "#008bf5";
  eraseMode = false;
  document.getElementById("selector").innerHTML = "Blue";
  penMode = true;
}

function green(){
  ctx.strokeStyle = "#0ac235";
  eraseMode = false;
  document.getElementById("selector").innerHTML = "Green";
  penMode = true;
}

function red(){
  ctx.strokeStyle = "#de0404";
  eraseMode = false;
  document.getElementById("selector").innerHTML = "Red";
  penMode = true;
}

function black(){
  ctx.strokeStyle = "#000000";
  eraseMode = false;
  document.getElementById("selector").innerHTML = "Black";
  penMode = true;
}

function yellow(){
  ctx.strokeStyle = "#e6de0b";
  eraseMode = false;
  document.getElementById("selector").innerHTML = "Yellow";
  penMode = true;
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
  console.log("x1 "+x1+" y1 "+y1);
  part1 = 1;
}

function secondPoint(){
  x2 = event.clientX;
  y2 = event.clientY;
  console.log("x2 "+x2+" y2 "+y2);
  part2 = 1;
}

function erase(){
  eraseMode = true;
  erasing(event);
  document.getElementById("selector").innerHTML = "Erase";
}

function erasing(event){
  if(eraseMode == true) {}
    myCanvas.addEventListener('mousedown', firstPoint);
    myCanvas.addEventListener('mouseup', secondPoint);

    if(part1 == 1 && part2 == 1){
      // ctx.fillStyle = "#FF0000";
      // ctx.beginPath();
      // ctx.fillRect(x1,y1,x2-x1,y2-y1);
      var imgData = ctx.getImageData(x1,y1,x2-x1,y2-y1);
      var i;
      for (i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = 255;
        imgData.data[i+1] = 255;
        imgData.data[i+2] = 255;
        imgData.data[i+3] = 255;
      }
      ctx.putImageData(imgData, x1, y1);
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
  if (eraseMode == false){
    drawOn = true;
    x = event.offsetX;
    y = event.offsetY;
    lastX = x;
    lastY = y;
  }
}

function turnOff(){
  drawOn = false;
}

function draw(event){
  x = event.offsetX; //clientX
  y = event.offsetY;
  myCanvas.addEventListener('mousedown', turnOn);
  myCanvas.addEventListener('mouseup', turnOff);

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
