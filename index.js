var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var canvasBack = document.getElementById("CanvasBack");
var ctxBack = canvasBack.getContext("2d");

var canvasTemp = document.getElementById("CanvasTemp");
var ctxTemp = canvasTemp.getContext("2d");

var canvasSave = document.getElementById("CanvasSave");
var ctxSave = canvasSave.getContext("2d");

var background;

var video = document.getElementById('video');

//background.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80";

// background.onload = function(){
//     ctxBack.drawImage(background,0,0);
// }

ctx.font = "20px Arial";
ctxBack.font = "20px Arial";
ctxTemp.font = "20px Arial";

fontSize = 20;

var topSheet = true;
var bottomSheet = false;

function topDraw(){
  document.getElementById("top").style.border = "4px solid #2AD3D7";
  document.getElementById("bottom").style.border = "0px";
  topSheet = true;
  bottomSheet = false;
}

function bottomDraw(){
  document.getElementById("bottom").style.border = "4px solid #2AD3D7";
  document.getElementById("top").style.border = "0px";
  topSheet = false;
  bottomSheet = true;
}

window.onbeforeunload = function(event) {
  event.returnValue = "Are you sure you want to leave the page?";
};

///////////hot key section

document.addEventListener('keydown', hotKey);

function hotKey(){
  key = event.keyCode;
  //console.log(key);

  if(key == 87){ //w
    penSwitch();
  }
  if(key == 67){ //c
    circSwitch();
  }
  if(key == 83){ //s
    straightSwitch();
  }
  if(key == 82){ //r
    rectSwitch();
  }
  if(key == 69){
    erase();
  }
  if(key == 84){
    textBox();
  }
  if(key == 85){
    undo();
  }
}


/////////////pop up help section
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("help");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


////////////initial settings
ctx.strokeStyle = "#000000"; //default
ctx.fillStyle = "#000000"; //default
ctx.lineWidth = 1; //default

document.getElementById("cameraButton").style.display = "none"; //or "visible"
document.getElementById("cameraButtonCancel").style.display = "none"; //or "visible"
document.getElementById("backButton").disabled = true;

var lastImageFront;
var lastImageBack;

var moveDrawingMode = false;

function moveDrawingMain(event){
  x = event.offsetX;
  y = event.offsetY;

  if(part1 == 1 && part2 == 0){
    xTemp = event.offsetX;
    yTemp = event.offsetY;
    document.addEventListener('mousemove', tempClearRect);
  }

  else if(part1 == 1 && part2 == 1){
    document.removeEventListener('mousemove', tempClearRect);
    lastImageBack = ctxBack.getImageData(0, 0, canvasBack.width, canvasBack.height);
    lastImageFront = ctx.getImageData(0, 0, canvas.width, canvas.height);
    document.getElementById("backButton").disabled = false;
    if(topSheet == true){
      imageToCopy = ctx.getImageData(x1, y1, x2-x1, y2-y1);
      part1 = 0;
      part2 = 0;
      ctx.clearRect(x1,y1,x2-x1,y2-y1);
      document.addEventListener('mousemove', previewImage);
      document.addEventListener('mousedown', placeImage);
    }
    else {
      imageToCopy = ctxBack.getImageData(x1, y1, x2-x1, y2-y1);
      part1 = 0;
      part2 = 0;
      ctxBack.clearRect(x1,y1,x2-x1,y2-y1);
      document.addEventListener('mousemove', previewImage);
      document.addEventListener('mousedown', placeImage);
    }
  }
}

var copyDrawingMode = false;
var imageToCopy;

function copyDrawingMain(event){
  x = event.offsetX;
  y = event.offsetY;

  if(part1 == 1 && part2 == 0){
    xTemp = event.offsetX;
    yTemp = event.offsetY;
    document.addEventListener('mousemove', tempClearRect);
  }

  else if(part1 == 1 && part2 == 1){
    document.removeEventListener('mousemove', tempClearRect);
    lastImageBack = ctxBack.getImageData(0, 0, canvasBack.width, canvasBack.height);
    lastImageFront = ctx.getImageData(0, 0, canvas.width, canvas.height);
    document.getElementById("backButton").disabled = false;
    if(topSheet == true){
      imageToCopy = ctx.getImageData(x1, y1, x2-x1, y2-y1);
      part1 = 0;
      part2 = 0;
      document.addEventListener('mousemove', previewImage);
      document.addEventListener('mousedown', placeImage);
    }
    else {
      imageToCopy = ctxBack.getImageData(x1, y1, x2-x1, y2-y1);
      part1 = 0;
      part2 = 0;
      document.addEventListener('mousemove', previewImage);
      document.addEventListener('mousedown', placeImage);
    }
  }
}

function previewImage(){
  ctxTemp.clearRect(0,0,canvasTemp.width,canvasTemp.height);
  x = event.offsetX;
  y = event.offsetY;
  ctxTemp.putImageData(imageToCopy,x,y);
}

function placeImage(){
  if(topSheet == true){
    ctx.putImageData(imageToCopy,x,y);
  }
  else {
    ctxBack.putImageData(imageToCopy,x,y);
  }
  document.removeEventListener('mousemove', previewImage);
  document.removeEventListener('mousedown', placeImage);
  document.getElementById("backButton").disabled = false;
  ctxTemp.clearRect(0,0,canvasTemp.width,canvasTemp.height);
}


function pageExtend(){
  lastImageBack = ctxBack.getImageData(0, 0, canvasBack.width, canvasBack.height);
  lastImageFront = ctx.getImageData(0, 0, canvas.width, canvas.height);

  document.getElementById("backButton").disabled = false;

  canvas.height = canvas.height + 500;
  canvasBack.height = canvasBack.height + 500;
  canvasTemp.height = canvasTemp.height + 500;
  canvasSave.height = canvasSave.height + 500;

  ctx.putImageData(lastImageFront, 0, 0);
  ctxBack.putImageData(lastImageBack, 0, 0);

  ctx.font = `${fontSize}px Arial`;
  ctxBack.font = `${fontSize}px Arial`;
  ctxTemp.font = `${fontSize}px Arial`;
}

function undo(){
  ctx.putImageData(lastImageFront, 0, 0);
  ctxBack.putImageData(lastImageBack, 0, 0);
  document.getElementById("backButton").disabled = true;
}

function takePhoto(event){
  video = document.querySelector('video');
  document.getElementById("video").style.visibility = "hidden";
  document.getElementById("cameraButton").style.display = "none"; //or "visible"
  document.getElementById("cameraButtonCancel").style.display = "none"; //or "visible"

  document.addEventListener('mousemove', previewCamera);
  document.addEventListener('mousedown', placePhotoCamera);
}

function previewCamera(){
  ctxTemp.putImageData(lastImageBack,0,0); //put the previous photos
  x = event.offsetX;
  y = event.offsetY;
  ctxTemp.drawImage(video,x,y);
}

function placePhotoCamera(){
  xAnchor = x;
  yAnchor = y;
  document.removeEventListener('mousemove', previewCamera);
  document.removeEventListener('mousedown', placePhotoCamera);
  document.getElementById("backButton").disabled = false;
  document.addEventListener('mousemove', resizeCamera);
  document.addEventListener('mousedown', finishPhotoResizeCamera);

  // ctxTemp.clearRect(0,0,canvasTemp.width,canvasTemp.height);
  // ctxBack.putImageData(lastImageBack,0,0);
  // ctxBack.drawImage(video,x,y);
  // document.removeEventListener('mousemove', previewCamera);
  // document.removeEventListener('mousedown', placePhotoCamera);
  // document.getElementById("backButton").disabled = false;
  // video = document.querySelector('video');
  // const mediaStream = video.srcObject;
  // const tracks = mediaStream.getTracks();
  // tracks[0].stop();
}

function resizeCamera(){
  ctxTemp.putImageData(lastImageBack,0,0); //put the previous photos
  xTemp = event.offsetX;
  yTemp = event.offsetY;
  width = Math.abs(xTemp-xAnchor);
  height = Math.abs(yTemp-yAnchor);
  ctxTemp.drawImage(video,xAnchor,yAnchor,width,height);
}

function finishPhotoResizeCamera(){
  ctxTemp.clearRect(0,0,canvasTemp.width,canvasTemp.height);
  ctxBack.putImageData(lastImageBack,0,0);
  ctxBack.drawImage(video,xAnchor,yAnchor,width,height);
  document.removeEventListener('mousemove', resizeCamera);
  document.removeEventListener('mousedown', finishPhotoResizeCamera);
  document.getElementById("backButton").disabled = false;
  video = document.querySelector('video');
  const mediaStream = video.srcObject;
  const tracks = mediaStream.getTracks();
  tracks[0].stop();
}

function cancel(event){
  video = document.querySelector('video');
  const mediaStream = video.srcObject;
  const tracks = mediaStream.getTracks();
  tracks[0].stop();
  document.getElementById("video").style.visibility = "hidden";
  document.getElementById("cameraButton").style.display = "none"; //or "visible"
  document.getElementById("cameraButtonCancel").style.display = "none"; //or "visible"
}

function startPhoto(event){
  lastImageBack = ctxBack.getImageData(0, 0, canvasBack.width, canvasBack.height);
  lastImageFront = ctx.getImageData(0, 0, canvas.width, canvas.height);
  document.getElementById("backButton").disabled = false;
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        //video.src = window.URL.createObjectURL(stream);
        //video.play();
        video.srcObject = stream;
        document.getElementById("video").style.visibility = "visible";
        document.getElementById("cameraButton").style.display = "inline"; //or "visible"
        document.getElementById("cameraButtonCancel").style.display = "inline"; //or "visible"
        numClicks = 2;
    });
  }
}

// function takePhoto(event) {
//   if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && photoTaken == false) {
//     navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
//         //video.src = window.URL.createObjectURL(stream);
//         video.srcObject = stream;
//         video.play();
//         ctxBack.drawImage(video, 0, 0);
//         photoTaken = true;
//     });
//   }
//   else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && photoTaken == true) {
//     navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
//         //video.src = window.URL.createObjectURL(stream);
//         video.srcObject = stream;
//         video.pause();
//         ctxBack.drawImage(video, 0, 0);
//         photoTaken = false;
//         console.log("here");
//     });
//   }
//
// }

function saveImage(){
  var imgDataBack = ctxBack.getImageData(0, 0, canvasBack.width, canvasBack.height);
  var imgDataFront = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var imgData = ctxSave.getImageData(0, 0, canvas.width, canvas.height);
  //console.log(imgData);
  for (var i = 0; i < imgDataFront.data.length; i += 4) {
    if(imgDataFront.data[i + 3] == 0) { //if the front is transparent, make the background visible for that pixel area
      if(imgDataBack.data[i] == 0 && imgDataBack.data[i+1] == 0 && imgDataBack.data[i+2] == 0 && imgDataBack.data[i+3] == 0) { //if the entire canvas page is set to 0000, just put white for the pixel
        imgData.data[i] = 255;
        imgData.data[i+1] = 255;
        imgData.data[i+2] = 255;
        imgData.data[i+3] = 255;
      }
      else {
        imgData.data[i] = imgDataBack.data[i];
        imgData.data[i+1] = imgDataBack.data[i+1];
        imgData.data[i+2] = imgDataBack.data[i+2];
        imgData.data[i+3] = 255;
      }
    }
    else { //front is drawn on
      if(imgDataFront.data[i] == 0 && imgDataFront.data[i+1] == 0 && imgDataFront.data[i+2] == 0 && imgDataFront.data[i+3] == 0){
        imgData.data[i] = 255;
        imgData.data[i+1] = 255;
        imgData.data[i+2] = 255;
        imgData.data[i+3] = 255;
      }
      else {
      imgData.data[i] = imgDataFront.data[i];
      imgData.data[i+1] = imgDataFront.data[i+1];
      imgData.data[i+2] = imgDataFront.data[i+2];
      imgData.data[i+3] = 255;
      }
    }
  }

  ctxSave.putImageData(imgData, 0, 0);
  var image = canvasSave.toDataURL("image/png").replace("image/png", "image/octet-stream"); //Convert image to 'octet-stream' (Just a download, really)
  window.location.href = image;
  ctxSave.clearRect(0,0,canvasSave.width,canvasSave.height);
}

function test(event){
  ctxTemp.clearRect(0,0,canvasTemp.width,canvasTemp.height);
  if (penMode == true){
    document.removeEventListener('keydown', firstPoint);
    document.removeEventListener('keyup', secondPoint);
    document.removeEventListener('keydown', centerPoint);
    document.removeEventListener('keyup', radiusLength);
    document.removeEventListener('mousemove', displayTextBox);
    draw(event);
  }
  if(eraseMode == true){
    document.addEventListener('keydown', firstPoint);
    document.addEventListener('keyup', secondPoint);
    document.removeEventListener('mousemove', displayTextBox);
    erasing(event);
  }
  if(rectMode == true){
    document.addEventListener('keydown', firstPoint);
    document.addEventListener('keyup', secondPoint);
    document.removeEventListener('mousemove', displayTextBox);
    rectDraw(event);
  }
  if(circMode == true){
    document.addEventListener('keydown', centerPoint);
    document.addEventListener('keyup', radiusLength);
    document.removeEventListener('mousemove', displayTextBox);
    circDraw(event);
  }
  if(straightMode == true){
    document.addEventListener('keydown', firstPoint);
    document.addEventListener('keyup', secondPoint);
    document.removeEventListener('mousemove', displayTextBox);
    straightDraw(event);
  }
  if(textMode == true){
    document.addEventListener('keydown', firstPoint);
    //document.addEventListener('keydown', getUserLetters);
    document.addEventListener('mousemove', displayTextBox);
    ctx.font = `${fontSize}px Arial`;
    ctxBack.font = `${fontSize}px Arial`;
    ctxTemp.font = `${fontSize}px Arial`;
    textBoxEntry(event);
  }
  if(moveDrawingMode == true){
    document.addEventListener('keydown', firstPoint);
    document.addEventListener('keyup', secondPoint);
    document.removeEventListener('mousemove', displayTextBox);
    moveDrawingMain(event);
  }
  if(copyDrawingMode == true){
    document.addEventListener('keydown', firstPoint);
    document.addEventListener('keyup', secondPoint);
    document.removeEventListener('mousemove', displayTextBox);
    copyDrawingMain(event);
  }
}

function penSwitch(){
  penMode = true;
  eraseMode = false;
  rectMode = false;
  circMode = false;
  straightMode = false;
  textMode = false;
  moveDrawingMode = false;
  copyDrawingMode = false;
  document.getElementById("pen").style.border = "4px solid #2AD3D7";
  document.getElementById("rectangle").style.border = "0px";
  document.getElementById("circle").style.border = "0px";
  document.getElementById("straightLine").style.border = "0px";
  document.getElementById("eraser").style.border = "0px";
  document.getElementById("alterFile").style.border = "0px";
  document.getElementById("moveDrawing").style.border = "0px";
  document.getElementById("copyDrawing").style.border = "0px";
}

function rectSwitch(){
  penMode = false;
  eraseMode = false;
  rectMode = true;
  circMode = false;
  straightMode = false;
  textMode = false;
  moveDrawingMode = false;
  copyDrawingMode = false;
  document.getElementById("pen").style.border = "0px";
  document.getElementById("rectangle").style.border = "4px solid #2AD3D7";
  document.getElementById("circle").style.border = "0px";
  document.getElementById("straightLine").style.border = "0px";
  document.getElementById("eraser").style.border = "0px";
  document.getElementById("alterFile").style.border = "0px";
  document.getElementById("moveDrawing").style.border = "0px";
  document.getElementById("copyDrawing").style.border = "0px";
}

function circSwitch(){
  penMode = false;
  eraseMode = false;
  rectMode = false;
  circMode = true;
  straightMode = false;
  textMode = false;
  moveDrawingMode = false;
  copyDrawingMode = false;
  document.getElementById("pen").style.border = "0px";
  document.getElementById("rectangle").style.border = "0px";
  document.getElementById("circle").style.border = "4px solid #2AD3D7";
  document.getElementById("straightLine").style.border = "0px";
  document.getElementById("eraser").style.border = "0px";
  document.getElementById("alterFile").style.border = "0px";
  document.getElementById("moveDrawing").style.border = "0px";
  document.getElementById("copyDrawing").style.border = "0px";
}

function straightSwitch(){
  penMode = false;
  eraseMode = false;
  rectMode = false;
  circMode = false;
  straightMode = true;
  textMode = false;
  moveDrawingMode = false;
  copyDrawingMode = false;
  document.getElementById("pen").style.border = "0px";
  document.getElementById("rectangle").style.border = "0px";
  document.getElementById("circle").style.border = "0px";
  document.getElementById("straightLine").style.border = "4px solid #2AD3D7";
  document.getElementById("eraser").style.border = "0px";
  document.getElementById("alterFile").style.border = "0px";
  document.getElementById("moveDrawing").style.border = "0px";
  document.getElementById("copyDrawing").style.border = "0px";
}

function textBox(){
  penMode = false;
  eraseMode = false;
  rectMode = false;
  circMode = false;
  straightMode = false;
  straightMode = false;
  textMode = true;
  moveDrawingMode = false;
  copyDrawingMode = false;
  document.getElementById("pen").style.border = "0px";
  document.getElementById("rectangle").style.border = "0px";
  document.getElementById("circle").style.border = "0px";
  document.getElementById("straightLine").style.border = "0px";
  document.getElementById("eraser").style.border = "0px";
  document.getElementById("alterFile").style.border = "4px solid #2AD3D7";
  document.getElementById("moveDrawing").style.border = "0px";
  document.getElementById("copyDrawing").style.border = "0px";
}

function moveDrawing(){
  penMode = false;
  eraseMode = false;
  rectMode = false;
  circMode = false;
  straightMode = false;
  straightMode = false;
  textMode = false;
  moveDrawingMode = true;
  copyDrawingMode = false;
  document.getElementById("pen").style.border = "0px";
  document.getElementById("rectangle").style.border = "0px";
  document.getElementById("circle").style.border = "0px";
  document.getElementById("straightLine").style.border = "0px";
  document.getElementById("eraser").style.border = "0px";
  document.getElementById("alterFile").style.border = "0px";
  document.getElementById("moveDrawing").style.border = "4px solid #2AD3D7";
  document.getElementById("copyDrawing").style.border = "0px";
}

function copyDrawing(){
  penMode = false;
  eraseMode = false;
  rectMode = false;
  circMode = false;
  straightMode = false;
  straightMode = false;
  textMode = false;
  moveDrawingMode = false;
  copyDrawingMode = true;
  document.getElementById("pen").style.border = "0px";
  document.getElementById("rectangle").style.border = "0px";
  document.getElementById("circle").style.border = "0px";
  document.getElementById("straightLine").style.border = "0px";
  document.getElementById("eraser").style.border = "0px";
  document.getElementById("alterFile").style.border = "0px";
  document.getElementById("moveDrawing").style.border = "0px";
  document.getElementById("copyDrawing").style.border = "4px solid #2AD3D7";
}

function fineMode() {
  ctx.lineWidth = 1;
  ctxBack.lineWidth = 1;
  document.getElementById("fine").style.border = "4px solid #2AD3D7";
  document.getElementById("normal").style.border = "0px";
  document.getElementById("thick").style.border = "0px";
}

function normalMode() {
  ctx.lineWidth = 5;
  ctxBack.lineWidth = 5;
  document.getElementById("fine").style.border = "0px";
  document.getElementById("normal").style.border = "4px solid #2AD3D7";
  document.getElementById("thick").style.border = "0px";
}

function thickMode() {
  ctx.lineWidth = 10;
  ctxBack.lineWidth = 10;
  document.getElementById("fine").style.border = "0px";
  document.getElementById("normal").style.border = "0px";
  document.getElementById("thick").style.border = "4px solid #2AD3D7";
}

function blue(){
  ctx.strokeStyle = "#008bf5";
  ctx.fillStyle = "#008bf5";
  ctxBack.strokeStyle = "#008bf5";
  ctxBack.fillStyle = "#008bf5";
  document.getElementById("color").style.border = "4px solid #008bf5";
}

function green(){
  ctx.strokeStyle = "#0ac235";
  ctx.fillStyle = "#0ac235";
  ctxBack.strokeStyle = "#0ac235";
  ctxBack.fillStyle = "#0ac235";
  document.getElementById("color").style.border = "4px solid #0ac235";
}

function red(){
  ctx.strokeStyle = "#de0404";
  ctx.fillStyle = "#de0404";
  ctxBack.strokeStyle = "#de0404";
  ctxBack.fillStyle = "#de0404";
  document.getElementById("color").style.border = "4px solid #de0404";
}

function black(){
  ctx.strokeStyle = "#000000";
  ctx.fillStyle = "#000000";
  ctxBack.strokeStyle = "#000000";
  ctxBack.fillStyle = "#000000";
  document.getElementById("color").style.border = "4px solid #000000";
}

function yellow(){
  ctx.strokeStyle = "#e6de0b";
  ctx.fillStyle = "#e6de0b";
  ctxBack.strokeStyle = "#e6de0b";
  ctxBack.fillStyle = "#e6de0b";
  document.getElementById("color").style.border = "4px solid #e6de0b";
}

function pink(){
  ctx.strokeStyle = "#EE37DB";
  ctx.fillStyle = "#EE37DB";
  ctxBack.strokeStyle = "#EE37DB";
  ctxBack.fillStyle = "#EE37DB";
  document.getElementById("color").style.border = "4px solid #EE37DB";
}

function purple(){
  ctx.strokeStyle = "#9700FF";
  ctx.fillStyle = "#9700FF";
  ctxBack.strokeStyle = "#9700FF";
  ctxBack.fillStyle = "#9700FF";
  document.getElementById("color").style.border = "4px solid #9700FF";
}

function cyan(){
  ctx.strokeStyle = "#00FFDF";
  ctx.fillStyle = "#00FFDF";
  ctxBack.strokeStyle = "#00FFDF";
  ctxBack.fillStyle = "#00FFDF";
  document.getElementById("color").style.border = "4px solid #00FFDF";
}

function orange(){
  ctx.strokeStyle = "#FFA100";
  ctx.fillStyle = "#FFA100";
  ctxBack.strokeStyle = "#FFA100";
  ctxBack.fillStyle = "#FFA100";
  document.getElementById("color").style.border = "4px solid #FFA100";
}

var background;

function uploading(event){
  lastImageBack = ctxBack.getImageData(0, 0, canvasBack.width, canvasBack.height);
  lastImageFront = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var file = event.target.files[0];
  var reader  = new FileReader();
  reader.onloadend = function (e) {
      background = new Image();
      background.src = e.target.result;
      background.onload = function(ev) {
        ratio = background.height/background.width;
        if (background.width >= 1200){
          background.width = 200;
          // background.width = 1200;
          // canvas.width = background.width;
          // canvasBack.width = background.width;
          // canvasTemp.width = background.width;
          // canvasSave.width = background.width;
        }
        if(background.height >= 650){
          background.height = background.width*ratio;
          //background.height = 650; //uncomment for fixed height limit
          // canvas.height = background.height;
          // canvasBack.height = background.height;
          // canvasTemp.height = background.height;
          // canvasSave.height = background.height;
        }
        document.addEventListener('mousemove', preview);
        document.addEventListener('mousedown', placePhoto);
      }
  }
  reader.readAsDataURL(file);
}

function uploadOldWork(){
  lastImageBack = ctxBack.getImageData(0, 0, canvasBack.width, canvasBack.height);
  lastImageFront = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var file = event.target.files[0];
  var reader  = new FileReader();
  reader.onloadend = function (e) {
      background = new Image();
      background.src = e.target.result;
      background.onload = function(ev) {
        if(background.height >= 500){
          canvas.height = background.height;
          canvasBack.height = background.height;
          canvasTemp.height = background.height;
          canvasSave.height = background.height;
        }
        ctxBack.drawImage(background,0,0);
        console.log("here");
      }
  }
  reader.readAsDataURL(file);
}

function preview(){
  ctxTemp.putImageData(lastImageBack,0,0); //put the previous photos
  x = event.offsetX;
  y = event.offsetY;
  ctxTemp.drawImage(background,x,y,background.width,background.height);
}

function placePhoto(){
  xAnchor = x;
  yAnchor = y;
  document.removeEventListener('mousemove', preview);
  document.removeEventListener('mousedown', placePhoto);
  document.getElementById("backButton").disabled = false;
  document.addEventListener('mousemove', resize);
  document.addEventListener('mousedown', finishPhotoResize);
}

var width;
var height;

function resize(){
  ctxTemp.putImageData(lastImageBack,0,0); //put the previous photos
  xTemp = event.offsetX;
  yTemp = event.offsetY;
  width = Math.abs(xTemp-xAnchor);
  height = width*ratio;
  ctxTemp.drawImage(background,xAnchor,yAnchor,width,height);
}

function finishPhotoResize(){
  ctxTemp.clearRect(0,0,canvasTemp.width,canvasTemp.height);
  ctxBack.putImageData(lastImageBack,0,0);
  ctxBack.drawImage(background,xAnchor,yAnchor,width,height);
  document.removeEventListener('mousemove', resize);
  document.removeEventListener('mousedown', finishPhotoResize);
}

function clearBack() {
  lastImageBack = ctxBack.getImageData(0, 0, canvasBack.width, canvasBack.height);
  lastImageFront = ctx.getImageData(0, 0, canvas.width, canvas.height);
  document.getElementById("backButton").disabled = false;
  ctxBack.clearRect(0,0,canvasBack.width,canvasBack.height);
  canvasBack.width = 1200;
  canvasBack.height = 500;
  canvas.width = 1200;
  canvas.height = 500;
  canvasTemp.width = 1200;
  canvasTemp.height = 500;
  canvasSave.width = 1200;
  canvasSave.height = 500;
  ctx.font = "20px Arial";
  ctxBack.font = "20px Arial";
  ctxTemp.font = "20px Arial";
}

function clearInk(){
  lastImageBack = ctxBack.getImageData(0, 0, canvasBack.width, canvasBack.height);
  lastImageFront = ctx.getImageData(0, 0, canvas.width, canvas.height);
  document.getElementById("backButton").disabled = false;
  ctx.clearRect(0,0,canvasBack.width,canvasBack.height);
}

var x1;
var x2;
var y1;
var y2;
var xTemp;
var yTemp;
var eraseMode = false;
var part1 = 0;
var part2 = 0;

/////////Use these if wanting to do mouse click instead
// function firstPoint(){
//   x1 = event.offsetX; //clientX
//   y1 = event.offsetY;
//   //console.log("x1 "+x1+" y1 "+y1);
//   part1 = 1;
// }
//
// function secondPoint(){
//   x2 = event.offsetX;
//   y2 = event.offsetY;
//   //console.log("x2 "+x2+" y2 "+y2);
//   part2 = 1;
// }

function firstPoint(){
  if(event.key == "Alt"){
    x1 = x;
    y1 = y;
    part1 = 1;
  }
}

function secondPoint(){
  if(event.key == "Alt"){
    x2 = x;
    y2 = y;
    part2 = 1;
  }
}

function erase(){
  penMode = false;
  eraseMode = true;
  rectMode = false;
  circMode = false;
  straightMode = false;
  textMode = false;
  erasing(event);
  document.getElementById("pen").style.border = "0px";
  document.getElementById("rectangle").style.border = "0px";
  document.getElementById("circle").style.border = "0px";
  document.getElementById("straightLine").style.border = "0px";
  document.getElementById("eraser").style.border = "4px solid #2AD3D7";
  document.getElementById("moveDrawing").style.border = "0px";
  document.getElementById("copyDrawing").style.border = "0px";
  document.getElementById("alterFile").style.border = "0px";
}

function erasing(event){
    x = event.offsetX;
    y = event.offsetY;

    if(part1 == 1 && part2 == 0){
      xTemp = event.offsetX;
      yTemp = event.offsetY;
      document.addEventListener('mousemove', tempClearRect);
    }

    else if(part1 == 1 && part2 == 1){
      lastImageBack = ctxBack.getImageData(0, 0, canvasBack.width, canvasBack.height);
      lastImageFront = ctx.getImageData(0, 0, canvas.width, canvas.height);
      document.getElementById("backButton").disabled = false;
      if(topSheet == true){
        ctx.clearRect(x1,y1,x2-x1,y2-y1);
      }
      else{
        ctxBack.clearRect(x1,y1,x2-x1,y2-y1);
      }
      document.removeEventListener('mousemove', tempClearRect);
      ctxTemp.clearRect(0,0,canvasTemp.width,canvasTemp.height);
      part1 = 0;
      part2 = 0;
    }

}

var textMode = false;
var letter;
var doneTyping = false;
document.getElementById("textInput").style.display = "none";

function getUserLetters(){
  key = event.keyCode;
  letter = String.fromCharCode(key);
  if(key == 13){ //enter key
    doneTyping = true;
  }
  sentence = document.getElementById("textInput").value
  console.log(sentence);
}

function displayTextBox(){
  xAnchor = x;
  yAnchor = y;
  sentence = "text";
  ctxTemp.clearRect(0,0,canvasTemp.width,canvasTemp.height);
  ctxTemp.fillText(sentence,xAnchor,yAnchor);
}

function displayText(){
  ctxTemp.clearRect(0,0,canvasTemp.width,canvasTemp.height);
  ctxTemp.fillText(sentence,xAnchor,yAnchor);
}

function textBoxEntry(event){
  x = event.offsetX;
  y = event.offsetY;

  if(part1 == 1){
    document.addEventListener('keydown', getUserLetters);
    document.getElementById("textInput").style.display = "inline";
    document.removeEventListener('keydown', hotKey);
    document.removeEventListener('mousemove', displayTextBox);
    document.addEventListener('keydown', displayText);
  }
  if(doneTyping == true){
    lastImageBack = ctxBack.getImageData(0, 0, canvasBack.width, canvasBack.height);
    lastImageFront = ctx.getImageData(0, 0, canvas.width, canvas.height);
    document.getElementById("textInput").style.display = "none";
    ctx.fillText(sentence,xAnchor,yAnchor);
    doneTyping = false;
    part1 = 0;
    document.removeEventListener('keydown', getUserLetters);
    document.removeEventListener('keydown', displayText);
    document.addEventListener('keydown', hotKey);
    sentence = " ";
    document.getElementById("textInput").value = " ";
  }
}

var rectMode = false;

function tempClearRect(){
  ctxTemp.clearRect(0,0,canvasTemp.width,canvasTemp.height);
  ctxTemp.beginPath();
  ctxTemp.strokeRect(x1,y1,xTemp-x1,yTemp-y1);
}

function rectDraw(event){
  x = event.offsetX;
  y = event.offsetY;

  if(part1 == 1 && part2 == 0){
    xTemp = event.offsetX;
    yTemp = event.offsetY;
    document.addEventListener('mousemove', tempClearRect);
  }

  else if(part1 == 1 && part2 == 1){
    document.removeEventListener('mousemove', tempClearRect);
    lastImageBack = ctxBack.getImageData(0, 0, canvasBack.width, canvasBack.height);
    lastImageFront = ctx.getImageData(0, 0, canvas.width, canvas.height);
    document.getElementById("backButton").disabled = false;
    if(topSheet == true){
      ctx.beginPath();
      //console.log(x1+" "+y1+" "+x2+" "+y2);
      ctx.strokeRect(x1,y1,x2-x1,y2-y1);
      ctxTemp.clearRect(0,0,canvasTemp.width,canvasTemp.height);
      part1 = 0;
      part2 = 0;
      ctx.closePath();
    }
    else{
      ctxBack.beginPath();
      //console.log(x1+" "+y1+" "+x2+" "+y2);
      ctxBack.strokeRect(x1,y1,x2-x1,y2-y1);
      ctxTemp.clearRect(0,0,canvasTemp.width,canvasTemp.height);
      part1 = 0;
      part2 = 0;
      ctxBack.closePath();
    }
  }
}

var rad = 0;
var circMode = false;

function centerPoint(){
  if(event.key == "Alt"){
    x1 = x; //event.offsetX;
    y1 = y; //event.offsetY;
    //console.log("x1 "+x1+" y1 "+y1);
    part1 = 1;
  }
}

function radiusLength(){
  if(event.key == "Alt"){
    x2 = x; //event.offsetX;
    y2 = y; //event.offsetY;
    //console.log("x2 "+x2+" y2 "+y2);
    part2 = 1;
    rad = Math.pow(Math.abs(x2-x1),2) + Math.pow(Math.abs(y2-y1),2);
    rad = Math.sqrt(rad);
  }
}

function radiusLengthTemp(){
  //console.log("x2 "+x2+" y2 "+y2);
  radTemp = Math.pow(Math.abs(xTemp-x1),2) + Math.pow(Math.abs(yTemp-y1),2);
  radTemp = Math.sqrt(radTemp);
}

function tempClearCircle(){
  radiusLengthTemp();
  ctxTemp.clearRect(0,0,canvasTemp.width,canvasTemp.height);
  ctxTemp.beginPath();
  ctxTemp.arc(x1,y1,radTemp,0, 2*Math.PI);
  ctxTemp.stroke();
  ctxTemp.closePath();
}

function circDraw(event){
  x = event.offsetX;
  y = event.offsetY;

  if(part1 == 1 && part2 == 1){
    document.removeEventListener('mousemove', tempClearCircle);
    lastImageBack = ctxBack.getImageData(0, 0, canvasBack.width, canvasBack.height);
    lastImageFront = ctx.getImageData(0, 0, canvas.width, canvas.height);
    document.getElementById("backButton").disabled = false;
    if(topSheet == true){
      ctx.beginPath();
      ctx.arc(x1,y1,rad,0, 2*Math.PI);
      ctx.stroke();
      ctx.closePath();
      part1 = 0;
      part2 = 0;
      ctxTemp.clearRect(0,0,canvasTemp.width,canvasTemp.height);
    }
    else {
      ctxBack.beginPath();
      ctxBack.arc(x1,y1,rad,0, 2*Math.PI);
      ctxBack.stroke();
      ctxBack.closePath();
      part1 = 0;
      part2 = 0;
      ctxTemp.clearRect(0,0,canvasTemp.width,canvasTemp.height);
    }
  }

  else if(part1 == 1 && part2 == 0){
    xTemp = event.offsetX;
    yTemp = event.offsetY;
    document.addEventListener('mousemove', tempClearCircle);
  }
}

var straightMode = false;

function tempClearLine(){
  ctxTemp.clearRect(0,0,canvasTemp.width,canvasTemp.height);
  ctxTemp.beginPath();
  ctxTemp.moveTo(x1,y1);
  ctxTemp.lineTo(xTemp,yTemp);
  ctxTemp.stroke();
  ctxTemp.closePath();
}

function straightDraw(event) {
  x = event.offsetX;
  y = event.offsetY;

  if(part1 == 1 && part2 == 1){
    document.removeEventListener('mousemove', tempClearLine);
    lastImageBack = ctxBack.getImageData(0, 0, canvasBack.width, canvasBack.height);
    lastImageFront = ctx.getImageData(0, 0, canvas.width, canvas.height);
    document.getElementById("backButton").disabled = false;
    if(topSheet == true){
      ctx.beginPath();
      ctx.moveTo(x1,y1);
      ctx.lineTo(x2,y2);
      ctx.stroke();
      part1 = 0;
      part2 = 0;
      ctxTemp.clearRect(0,0,canvasTemp.width,canvasTemp.height);
    }
    else {
      ctxBack.beginPath();
      ctxBack.moveTo(x1,y1);
      ctxBack.lineTo(x2,y2);
      ctxBack.stroke();
      part1 = 0;
      part2 = 0;
      ctxTemp.clearRect(0,0,canvasTemp.width,canvasTemp.height);
    }
  }
  else if(part1 == 1 && part2 == 0){
    xTemp = event.offsetX;
    yTemp = event.offsetY;
    document.addEventListener('mousemove', tempClearLine);
  }
}

var initialFlag = 1;
var drawOn = false;
var lastX;
var lastY;
var x;
var y;
var penMode = true;

function turnOn(){
  if(event.key == "Alt"){
    lastImageBack = ctxBack.getImageData(0, 0, canvasBack.width, canvasBack.height);
    lastImageFront = ctx.getImageData(0, 0, canvas.width, canvas.height);
    document.getElementById("backButton").disabled = false;
    drawOn = true;
    lastX = x; //reset the x and y when the mouse is reclicked
    lastY = y;
    //console.log(event.key);
  }
}

function turnOff(){
  if(event.key == "Alt"){
    drawOn = false;
    document.removeEventListener('keydown', turnOn);
    document.removeEventListener('keyup', turnOff);
    //console.log("off");
  }
}

function draw(event){
  x = event.offsetX; //clientX
  y = event.offsetY;
  document.addEventListener('keydown', turnOn); //activates when key is pressed only
  document.addEventListener('keyup', turnOff); //activates when key is pressed only

  if (initialFlag == 1) { //initial postion
    lastX = x;
    lastY = y;
    initialFlag = 0;
  }

  if (drawOn == true){
    if(topSheet == true){
      ctx.beginPath();
      ctx.moveTo(lastX,lastY);
      ctx.lineTo(x,y);
      ctx.stroke();
      lastX = x;
      lastY = y;
    }
    else {
      ctxBack.beginPath();
      ctxBack.moveTo(lastX,lastY);
      ctxBack.lineTo(x,y);
      ctxBack.stroke();
      lastX = x;
      lastY = y;
    }
  }
}
