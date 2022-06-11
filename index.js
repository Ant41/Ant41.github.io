var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var canvasBack = document.getElementById("CanvasBack");
var ctxBack = canvasBack.getContext("2d");

var canvasTemp = document.getElementById("CanvasTemp");
var ctxTemp = canvasTemp.getContext("2d");

var canvasSave = document.getElementById("CanvasSave");
var ctxSave = canvasSave.getContext("2d");

var canvasLine = document.getElementById("CanvasLine");
var ctxLine = canvasLine.getContext("2d");

////////////initial settings
document.getElementById("cameraButton").style.display = "none"; //or "visible"
document.getElementById("cameraButtonCancel").style.display = "none"; //or "visible"
document.getElementById("backButton").disabled = true;

//text formatting
ctx.strokeStyle = "#000000"; //default
ctx.fillStyle = "#000000"; //default
ctx.lineWidth = 1; //default
ctx.font = "20px Arial";
ctxBack.font = "20px Arial";
ctxTemp.font = "20px Arial";
var fontSize = 20;

window.onload = function(event) {
  ctxSave.fillStyle = "white";
  ctxSave.fillRect(0,0,canvas.width,canvas.height);
};

window.onbeforeunload = function(event) {
  event.returnValue = "Are you sure you want to leave the page?";
};

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
//////////////

//backup of canvas
var lastImageFront;
var lastImageBack;

function startingFunction(event){
  ctxTemp.clearRect(0,0,canvasTemp.width,canvasTemp.height);
  preserveLineProperties();
  if (penMode == true){
    lineAlpha = "FF";
    document.addEventListener('keydown', turnOn); //activates when key is pressed only
    document.addEventListener('keyup', turnOff); //activates when key is pressed only
    document.removeEventListener('keydown', firstPoint);
    document.removeEventListener('keyup', secondPoint);
    document.removeEventListener('keydown', centerPoint);
    document.removeEventListener('keyup', radiusLength);
    document.removeEventListener('mousemove', displayTextBox);
    draw(event);
  }
  if(eraseMode == true){
    lineAlpha = "FF";
    document.addEventListener('keydown', firstPoint);
    document.addEventListener('keyup', secondPoint);
    document.removeEventListener('mousemove', displayTextBox);
    erasing(event);
  }
  if(rectMode == true){
    lineAlpha = "FF";
    document.addEventListener('keydown', firstPoint);
    document.addEventListener('keyup', secondPoint);
    document.removeEventListener('mousemove', displayTextBox);
    rectDraw(event);
  }
  if(circMode == true){
    lineAlpha = "FF";
    document.addEventListener('keydown', centerPoint);
    document.addEventListener('keyup', radiusLength);
    document.removeEventListener('mousemove', displayTextBox);
    circDraw(event);
  }
  if(straightMode == true){
    lineAlpha = "FF";
    document.addEventListener('keydown', firstPoint);
    document.addEventListener('keyup', secondPoint);
    document.removeEventListener('mousemove', displayTextBox);
    if(gridState == true){
      topDraw();
    }
    straightDraw(event);
  }
  if(highlightMode == true){
    lineAlpha = "50";
    document.addEventListener('keydown', firstPoint);
    document.addEventListener('keyup', secondPoint);
    document.removeEventListener('mousemove', displayTextBox);
    straightDraw(event);
  }
  if(textMode == true){
    lineAlpha = "FF";
    topDraw();
    document.addEventListener('keydown', firstPoint);
    //document.addEventListener('keydown', getUserLetters);
    document.addEventListener('mousemove', displayTextBox);
    ctx.font = `${fontSize}px Arial`;
    ctxBack.font = `${fontSize}px Arial`;
    ctxTemp.font = `${fontSize}px Arial`;
    textBoxEntry(event);
  }
  if(moveDrawingMode == true){
    lineAlpha = "FF";
    document.addEventListener('keydown', firstPoint);
    document.addEventListener('keyup', secondPoint);
    document.removeEventListener('mousemove', displayTextBox);
    moveDrawingMain(event);
  }
  if(copyDrawingMode == true){
    lineAlpha = "FF";
    document.addEventListener('keydown', firstPoint);
    document.addEventListener('keyup', secondPoint);
    document.removeEventListener('mousemove', displayTextBox);
    copyDrawingMain(event);
  }
}

//resizing canvas to have sharp image
var scaleBy = window.devicePixelRatio;
var w = canvas.width;
var h = canvas.height;
resizeCanvas();

function resizeCanvas(){
  canvas.width = w * scaleBy; //2400px, this is the resolution of the drawing
  canvas.height = h * scaleBy;
  canvas.style.width = w + 'px'; //1200 px, this is shown on screen
  canvas.style.height = h + 'px';
  canvasBack.width = w * scaleBy;
  canvasBack.height = h * scaleBy;
  canvasBack.style.width = w + 'px';
  canvasBack.style.height = h + 'px';
  canvasTemp.width = w * scaleBy;
  canvasTemp.height = h * scaleBy;
  canvasTemp.style.width = w + 'px';
  canvasTemp.style.height = h + 'px';
  canvasSave.width = w * scaleBy;
  canvasSave.height = h * scaleBy;
  canvasSave.style.width = w + 'px';
  canvasSave.style.height = h + 'px';
  ctx.scale(scaleBy, scaleBy); //now one CSS unit is equal to 2 actual pixels, ensures that drawings look correct
  ctxBack.scale(scaleBy, scaleBy);
  ctxTemp.scale(scaleBy, scaleBy);
  ctxSave.scale(scaleBy, scaleBy);
}

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

var uploadLevel

function topSelect(){
  uploadLevel = 1;
}

function bottomSelect(){
  uploadLevel = 0;
}

//grid drawing
var gridState = false;
var gridIndex;
var gridSpacing = 15;
var snapToGrid = false

function gridToggle(){
  gridState = !gridState
  if(gridState == true){
    drawGrid();
  }
  else {
    ctxSave.clearRect(0,0,canvas.width,canvas.height);
    ctxSave.fillStyle = "white";
    ctxSave.fillRect(0,0,canvas.width,canvas.height);
  }
}

function drawGrid() {
  ctxSave.clearRect(0,0,canvas.width,canvas.height);
  ctxSave.fillStyle = "white";
  ctxSave.fillRect(0,0,canvas.width,canvas.height);
  ctxSave.lineWidth = 1;
  ctxSave.strokeStyle = "#DEDEDE";
  gridIndex = 0;
  while(gridIndex < canvas.width) {
    ctxSave.beginPath();
    ctxSave.moveTo(gridIndex,0);
    ctxSave.lineTo(gridIndex,canvas.height);
    ctxSave.stroke();
    gridIndex = gridIndex + gridSpacing;
  }
  gridIndex = 0;
  while(gridIndex < canvas.height) {
    ctxSave.beginPath();
    ctxSave.moveTo(0,gridIndex);
    ctxSave.lineTo(canvas.width,gridIndex);
    ctxSave.stroke();
    gridIndex = gridIndex + gridSpacing;
  }
}

///////////hot key section
document.addEventListener('keydown', hotKey);

function hotKey(){

  key = event.key;
  //console.log(key);

  if(key == 'w'){ //w
    penSwitch();
  }
  if(key == 'c'){ //c
    circSwitch();
  }
  if(key == 's'){ //s
    straightSwitch();
  }
  if(key == 'r'){ //r
    rectSwitch();
  }
  if(key == 'e'){
    erase();
  }
  if(key == 't'){
    textBox();
  }
  if(key == 'u'){
    undo();
  }
  if(key == 'm'){
    moveDrawing();
  }
  if(key == 'k'){
    copyDrawing();
  }
  if(key == 'g'){
    snapToGrid = !snapToGrid
  }
  if(key == 'h'){
    console.log("here")
    highlightSwitch();
  }
}

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
      imageToCopy = ctx.getImageData(x1*scaleBy, y1*scaleBy, (x2-x1)*scaleBy, (y2-y1)*scaleBy);
      part1 = 0;
      part2 = 0;
      ctx.clearRect(x1,y1,(x2-x1),(y2-y1));
      document.addEventListener('mousemove', previewImage);
      document.addEventListener('mousedown', placeImage);
    }
    else {
      imageToCopy = ctxBack.getImageData(x1*scaleBy, y1*scaleBy, (x2-x1)*scaleBy, (y2-y1)*scaleBy);
      part1 = 0;
      part2 = 0;
      ctxBack.clearRect(x1,y1,(x2-x1),(y2-y1));
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
      imageToCopy = ctx.getImageData(x1*scaleBy, y1*scaleBy, (x2-x1)*scaleBy, (y2-y1)*scaleBy);
      part1 = 0;
      part2 = 0;
      document.addEventListener('mousemove', previewImage);
      document.addEventListener('mousedown', placeImage);
    }
    else {
      imageToCopy = ctxBack.getImageData(x1*scaleBy, y1*scaleBy, (x2-x1)*scaleBy, (y2-y1)*scaleBy);
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
  ctxTemp.putImageData(imageToCopy,x*scaleBy,y*scaleBy);
}

function placeImage(){
  if(topSheet == true){
    ctx.putImageData(imageToCopy,x*scaleBy,y*scaleBy);
  }
  else {
    ctxBack.putImageData(imageToCopy,x*scaleBy,y*scaleBy);
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

  canvas.height = (canvas.height + 500)/scaleBy;
  canvasBack.height = (canvasBack.height + 500)/scaleBy;
  canvasTemp.height = (canvasTemp.height + 500)/scaleBy;
  canvasSave.height = (canvasSave.height + 500)/scaleBy;
  h = canvas.height
  resizeCanvas();

  ctx.putImageData(lastImageFront, 0, 0);
  ctxBack.putImageData(lastImageBack, 0, 0);

  ctxSave.fillStyle = "white";
  ctxSave.fillRect(0,0,canvas.width,canvas.height);

  if(gridState == true){
    drawGrid();
  }

  ctx.font = `${fontSize}px Arial`;
  ctxBack.font = `${fontSize}px Arial`;
  ctxTemp.font = `${fontSize}px Arial`;

  preserveLineProperties();
}

function undo(){
  document.getElementById("backButton").disabled = true;
  if(changedSize == true){
    h = oldHeight;
    w = oldWidth;
    resizeCanvas();
    ctx.putImageData(lastImageFront, 0, 0);
    ctxBack.putImageData(lastImageBack, 0, 0);
    changedSize = false;
  }
  else {
    ctx.putImageData(lastImageFront, 0, 0);
    ctxBack.putImageData(lastImageBack, 0, 0);
  }
}

var video = document.getElementById('video');

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
  // console.log(imgData);
  // for (var i = 0; i < imgDataFront.data.length; i += 4) {
  //   if(imgDataFront.data[i + 3] == 0) { //if the front is transparent, make the background visible for that pixel area
  //     if(imgDataBack.data[i] == 0 && imgDataBack.data[i+1] == 0 && imgDataBack.data[i+2] == 0 && imgDataBack.data[i+3] == 0) { //if the entire canvas page is set to 0000, just put white for the pixel
  //       imgData.data[i] = 255;
  //       imgData.data[i+1] = 255;
  //       imgData.data[i+2] = 255;
  //       imgData.data[i+3] = 255;
  //     }
  //     else {
  //       imgData.data[i] = imgDataBack.data[i];
  //       imgData.data[i+1] = imgDataBack.data[i+1];
  //       imgData.data[i+2] = imgDataBack.data[i+2];
  //       imgData.data[i+3] = 255;
  //     }
  //   }
  //   else { //front is drawn on
  //     if(imgDataFront.data[i] == 0 && imgDataFront.data[i+1] == 0 && imgDataFront.data[i+2] == 0 && imgDataFront.data[i+3] == 0){
  //       imgData.data[i] = 255;
  //       imgData.data[i+1] = 255;
  //       imgData.data[i+2] = 255;
  //       imgData.data[i+3] = 255;
  //     }
  //     else {
  //     imgData.data[i] = imgDataFront.data[i];
  //     imgData.data[i+1] = imgDataFront.data[i+1];
  //     imgData.data[i+2] = imgDataFront.data[i+2];
  //     imgData.data[i+3] = 255;
  //     }
  //   }
  // }
  //
  // ctxSave.putImageData(imgData, 0, 0);

  ctxSave.drawImage(canvasBack,0,0,canvas.width/scaleBy,canvas.height/scaleBy); //drawImage uses the canvas's intrinsic size in CSS pixels to draw, not HTML size
  ctxSave.drawImage(canvas,0,0,canvas.width/scaleBy,canvas.height/scaleBy);

  // canvasSave.style.height = canvas.height/scaleBy;
  // canvasSave.style.width = canvas.width/scaleBy;

  // var image = canvasSave.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream"); //Convert image to 'octet-stream' (Just a download, really)
  // window.location.href = image;
  // ctxSave.clearRect(0,0,canvasSave.width,canvasSave.height);

  //save full version
  var url;
  canvasSave.toBlob(function(blob){
    url = URL.createObjectURL(blob);
    window.open(
      url,
      '_blank' // <- This is what makes it open in a new window.
    );
  });
  ctxSave.clearRect(0,0,canvasSave.width,canvasSave.height);
  URL.revokeObjectURL(url);

  //save front page
  canvas.toBlob(function(blob){
    url = URL.createObjectURL(blob);
    window.open(
      url,
      '_blank' // <- This is what makes it open in a new window.
    );
  });
  URL.revokeObjectURL(url);

  //save back page
  var url;
  canvasBack.toBlob(function(blob){
    url = URL.createObjectURL(blob);
    window.open(
      url,
      '_blank' // <- This is what makes it open in a new window.
    );
  });
  URL.revokeObjectURL(url);

  preserveLineProperties();
}

function penSwitch(){
  part1 = 0;
  part2 = 0;
  penMode = true;
  eraseMode = false;
  rectMode = false;
  circMode = false;
  straightMode = false;
  highlightMode = false;
  textMode = false;
  moveDrawingMode = false;
  copyDrawingMode = false;
  document.getElementById("pen").style.border = "4px solid #2AD3D7";
  document.getElementById("rectangle").style.border = "0px";
  document.getElementById("circle").style.border = "0px";
  document.getElementById("straightLine").style.border = "0px";
  document.getElementById("highlighter").style.border = "0px";
  document.getElementById("eraser").style.border = "0px";
  document.getElementById("textBox").style.border = "0px";
  document.getElementById("moveDrawing").style.border = "0px";
  document.getElementById("copyDrawing").style.border = "0px";
}

function rectSwitch(){
  part1 = 0;
  part2 = 0;
  penMode = false;
  eraseMode = false;
  rectMode = true;
  circMode = false;
  straightMode = false;
  highlightMode = false;
  textMode = false;
  moveDrawingMode = false;
  copyDrawingMode = false;
  document.getElementById("pen").style.border = "0px";
  document.getElementById("rectangle").style.border = "4px solid #2AD3D7";
  document.getElementById("circle").style.border = "0px";
  document.getElementById("straightLine").style.border = "0px";
  document.getElementById("highlighter").style.border = "0px";
  document.getElementById("eraser").style.border = "0px";
  document.getElementById("textBox").style.border = "0px";
  document.getElementById("moveDrawing").style.border = "0px";
  document.getElementById("copyDrawing").style.border = "0px";
}

function circSwitch(){
  part1 = 0;
  part2 = 0;
  penMode = false;
  eraseMode = false;
  rectMode = false;
  circMode = true;
  straightMode = false;
  highlightMode = false;
  textMode = false;
  moveDrawingMode = false;
  copyDrawingMode = false;
  document.getElementById("pen").style.border = "0px";
  document.getElementById("rectangle").style.border = "0px";
  document.getElementById("circle").style.border = "4px solid #2AD3D7";
  document.getElementById("straightLine").style.border = "0px";
  document.getElementById("highlighter").style.border = "0px";
  document.getElementById("eraser").style.border = "0px";
  document.getElementById("textBox").style.border = "0px";
  document.getElementById("moveDrawing").style.border = "0px";
  document.getElementById("copyDrawing").style.border = "0px";
}

function straightSwitch(){
  part1 = 0;
  part2 = 0;
  penMode = false;
  eraseMode = false;
  rectMode = false;
  circMode = false;
  straightMode = true;
  highlightMode = false;
  textMode = false;
  moveDrawingMode = false;
  copyDrawingMode = false;
  document.getElementById("pen").style.border = "0px";
  document.getElementById("rectangle").style.border = "0px";
  document.getElementById("circle").style.border = "0px";
  document.getElementById("straightLine").style.border = "4px solid #2AD3D7";
  document.getElementById("highlighter").style.border = "0px";
  document.getElementById("eraser").style.border = "0px";
  document.getElementById("textBox").style.border = "0px";
  document.getElementById("moveDrawing").style.border = "0px";
  document.getElementById("copyDrawing").style.border = "0px";
}

function textBox(){
  part1 = 0;
  part2 = 0;
  penMode = false;
  eraseMode = false;
  rectMode = false;
  circMode = false;
  straightMode = false;
  highlightMode = false;
  textMode = true;
  moveDrawingMode = false;
  copyDrawingMode = false;
  document.getElementById("pen").style.border = "0px";
  document.getElementById("rectangle").style.border = "0px";
  document.getElementById("circle").style.border = "0px";
  document.getElementById("straightLine").style.border = "0px";
  document.getElementById("highlighter").style.border = "0px";
  document.getElementById("eraser").style.border = "0px";
  document.getElementById("textBox").style.border = "4px solid #2AD3D7";
  document.getElementById("moveDrawing").style.border = "0px";
  document.getElementById("copyDrawing").style.border = "0px";
}

function moveDrawing(){
  part1 = 0;
  part2 = 0;
  penMode = false;
  eraseMode = false;
  rectMode = false;
  circMode = false;
  straightMode = false;
  highlightMode = false;
  textMode = false;
  moveDrawingMode = true;
  copyDrawingMode = false;
  document.getElementById("pen").style.border = "0px";
  document.getElementById("rectangle").style.border = "0px";
  document.getElementById("circle").style.border = "0px";
  document.getElementById("straightLine").style.border = "0px";
  document.getElementById("highlighter").style.border = "0px";
  document.getElementById("eraser").style.border = "0px";
  document.getElementById("textBox").style.border = "0px";
  document.getElementById("moveDrawing").style.border = "4px solid #2AD3D7";
  document.getElementById("copyDrawing").style.border = "0px";
}

function copyDrawing(){
  part1 = 0;
  part2 = 0;
  penMode = false;
  eraseMode = false;
  rectMode = false;
  circMode = false;
  straightMode = false;
  highlightMode = false;
  textMode = false;
  moveDrawingMode = false;
  copyDrawingMode = true;
  document.getElementById("pen").style.border = "0px";
  document.getElementById("rectangle").style.border = "0px";
  document.getElementById("circle").style.border = "0px";
  document.getElementById("straightLine").style.border = "0px";
  document.getElementById("highlighter").style.border = "0px";
  document.getElementById("eraser").style.border = "0px";
  document.getElementById("textBox").style.border = "0px";
  document.getElementById("moveDrawing").style.border = "0px";
  document.getElementById("copyDrawing").style.border = "4px solid #2AD3D7";
}

function highlightSwitch(){
  part1 = 0;
  part2 = 0;
  penMode = false;
  eraseMode = false;
  rectMode = false;
  circMode = false;
  straightMode = false;
  highlightMode = true;
  textMode = false;
  moveDrawingMode = false;
  copyDrawingMode = false;
  document.getElementById("pen").style.border = "0px";
  document.getElementById("rectangle").style.border = "0px";
  document.getElementById("circle").style.border = "0px";
  document.getElementById("straightLine").style.border = "0px";
  document.getElementById("highlighter").style.border = "4px solid #2AD3D7";
  document.getElementById("eraser").style.border = "0px";
  document.getElementById("textBox").style.border = "0px";
  document.getElementById("moveDrawing").style.border = "0px";
  document.getElementById("copyDrawing").style.border = "0px";
}

// function fineMode() {
//   ctx.lineWidth = 1;
//   ctxBack.lineWidth = 1;
//   ctxTemp.lineWidth = 1;
//   document.getElementById("fine").style.border = "4px solid #2AD3D7";
//   document.getElementById("normal").style.border = "0px";
//   document.getElementById("thick").style.border = "0px";
// }
//
// function normalMode() {
//   ctx.lineWidth = 5;
//   ctxBack.lineWidth = 5;
//   ctxTemp.lineWidth = 5;
//   document.getElementById("fine").style.border = "0px";
//   document.getElementById("normal").style.border = "4px solid #2AD3D7";
//   document.getElementById("thick").style.border = "0px";
// }
//
// function thickMode() {
//   ctx.lineWidth = 10;
//   ctxBack.lineWidth = 10;
//   ctxTemp.lineWidth = 10;
//   document.getElementById("fine").style.border = "0px";
//   document.getElementById("normal").style.border = "0px";
//   document.getElementById("thick").style.border = "4px solid #2AD3D7";
// }

function selectThickness() {
  document.getElementById("lineThicknessSlider").style.display = "inline";
}

function updateLine(){
  ctxLine.clearRect(0,0,canvasLine.width,canvasLine.height);
  document.getElementById("thicknessNumber").innerHTML = document.getElementById("thicknessValue").value;
  ctxLine.lineWidth = document.getElementById("thicknessValue").value;
  ctxLine.beginPath();
  ctxLine.moveTo(50,50);
  ctxLine.lineTo(250,50);
  ctxLine.stroke();
  ctxLine.closePath();
}

function confirmLine(){
  penThickness = document.getElementById("thicknessValue").value/2;
  ctx.lineWidth = document.getElementById("thicknessValue").value;
  ctxBack.lineWidth = document.getElementById("thicknessValue").value;
  ctxTemp.lineWidth = document.getElementById("thicknessValue").value;
  document.getElementById("lineThicknessSlider").style.display = "none";
}

function closeLineSelector(){
  document.getElementById("thicknessNumber").innerHTML = penThickness*2;
  document.getElementById("thicknessValue").value = penThickness*2;
  document.getElementById("lineThicknessSlider").style.display = "none";
}

function preserveLineProperties(){
  ctx.lineWidth = document.getElementById("thicknessValue").value
  ctxBack.lineWidth = document.getElementById("thicknessValue").value
  ctxTemp.lineWidth = document.getElementById("thicknessValue").value

  if(colourCount == 1) {
    black();
  }
  else if(colourCount == 2) {
    red();
  }
  else if(colourCount == 3) {
    yellow();
  }
  else if(colourCount == 4) {
    pink();
  }
  else if(colourCount == 5) {
    purple();
  }
  else if(colourCount == 6) {
    cyan();
  }
  else if(colourCount == 7) {
    orange();
  }
  else if(colourCount == 8) {
    blue();
  }
  else if(colourCount == 9) {
    green();
  }
  else if(colourCount == 10) {
    selected_color();
  }
}

var colourCount = 1;
var colorFreeze = false;
function changeColour(){
  colourSelect = event.key;
  if (colorFreeze != true) {
    if (colourSelect == "l") {
      colourCount = colourCount + 1;
      if (colourCount == 10){
        colourCount = 1;
      }
      if (colourCount == 1){
        black();
      }
      else if (colourCount == 2) {
        red();
      }
      else if (colourCount == 3) {
        yellow();
      }
      else if (colourCount == 4) {
        pink();
      }
      else if (colourCount == 5) {
        purple();
      }
      else if (colourCount == 6) {
        cyan();
      }
      else if (colourCount == 7) {
        orange();
      }
      else if (colourCount == 8) {
        blue();
      }
      else {
        green();
      }
    }
    if (colourSelect == "p") {
      colourCount = colourCount - 1;
      if (colourCount == 0){
        colourCount = 9;
      }
      if (colourCount == 1){
        black();
      }
      else if (colourCount == 2) {
        red();
      }
      else if (colourCount == 3) {
        yellow();
      }
      else if (colourCount == 4) {
        pink();
      }
      else if (colourCount == 5) {
        purple();
      }
      else if (colourCount == 6) {
        cyan();
      }
      else if (colourCount == 7) {
        orange();
      }
      else if (colourCount == 8) {
        blue();
      }
      else {
        green();
      }
    }
  }
}

function preserveLineProperties(){
  if(colourCount == 1) {
    black();
  }
  else if(colourCount == 2) {
    red();
  }
  else if(colourCount == 3) {
    yellow();
  }
  else if(colourCount == 4) {
    pink();
  }
  else if(colourCount == 5) {
    purple();
  }
  else if(colourCount == 6) {
    cyan();
  }
  else if(colourCount == 7) {
    orange();
  }
  else if(colourCount == 8) {
    blue();
  }
  else if(colourCount == 9) {
    green();
  }
  else if(colourCount == 10) {
    selected_color();
  }
}

function blue(){
  ctx.strokeStyle = "#008bf5" + lineAlpha;
  ctx.fillStyle = "#008bf5" + lineAlpha;
  ctxBack.strokeStyle = "#008bf5";
  ctxBack.fillStyle = "#008bf5";
  ctxTemp.strokeStyle = "#008bf5";
  ctxTemp.fillStyle = "#008bf5";
  document.getElementById("color").style.border = "4px solid #008bf5";
  colourCount = 8;
}

function green(){
  ctx.strokeStyle = "#0ac235" + lineAlpha;
  ctx.fillStyle = "#0ac235" + lineAlpha;
  ctxBack.strokeStyle = "#0ac235";
  ctxBack.fillStyle = "#0ac235";
  ctxTemp.strokeStyle = "#0ac235";
  ctxTemp.fillStyle = "#0ac235";
  document.getElementById("color").style.border = "4px solid #0ac235";
  colourCount = 9;
}

function red(){
  ctx.strokeStyle = "#de0404" + lineAlpha;
  ctx.fillStyle = "#de0404" + lineAlpha;
  ctxBack.strokeStyle = "#de0404";
  ctxBack.fillStyle = "#de0404";
  ctxTemp.strokeStyle = "#de0404";
  ctxTemp.fillStyle = "#de0404";
  document.getElementById("color").style.border = "4px solid #de0404";
  colourCount = 2;
}

function black(){
  ctx.strokeStyle = "#000000" + lineAlpha;
  ctx.fillStyle = "#000000" + lineAlpha;
  ctxBack.strokeStyle = "#000000";
  ctxBack.fillStyle = "#000000";
  ctxTemp.strokeStyle = "#000000";
  ctxTemp.fillStyle = "#000000";
  document.getElementById("color").style.border = "4px solid #000000";
  colourCount = 1;
}

function yellow(){
  ctx.strokeStyle = "#e6de0b" + lineAlpha;
  ctx.fillStyle = "#e6de0b" + lineAlpha;
  ctxBack.strokeStyle = "#e6de0b";
  ctxBack.fillStyle = "#e6de0b";
  ctxTemp.strokeStyle = "#e6de0b";
  ctxTemp.fillStyle = "#e6de0b";
  document.getElementById("color").style.border = "4px solid #e6de0b";
  colourCount = 3;
}

function pink(){
  ctx.strokeStyle = "#EE37DB" + lineAlpha;
  ctx.fillStyle = "#EE37DB" + lineAlpha;
  ctxBack.strokeStyle = "#EE37DB";
  ctxBack.fillStyle = "#EE37DB";
  ctxTemp.strokeStyle = "#EE37DB";
  ctxTemp.fillStyle = "#EE37DB";
  document.getElementById("color").style.border = "4px solid #EE37DB";
  colourCount = 4;
}

function purple(){
  ctx.strokeStyle = "#9700FF" + lineAlpha;
  ctx.fillStyle = "#9700FF" + lineAlpha;
  ctxBack.strokeStyle = "#9700FF";
  ctxBack.fillStyle = "#9700FF";
  ctxTemp.strokeStyle = "#9700FF";
  ctxTemp.fillStyle = "#9700FF";
  document.getElementById("color").style.border = "4px solid #9700FF";
  colourCount = 5;
}

function cyan(){
  ctx.strokeStyle = "#00FFDF" + lineAlpha;
  ctx.fillStyle = "#00FFDF" + lineAlpha;
  ctxBack.strokeStyle = "#00FFDF";
  ctxBack.fillStyle = "#00FFDF";
  ctxTemp.strokeStyle = "#00FFDF";
  ctxTemp.fillStyle = "#00FFDF";
  document.getElementById("color").style.border = "4px solid #00FFDF";
  colourCount = 6;
}

function orange(){
  ctx.strokeStyle = "#FFA100" + lineAlpha;
  ctx.fillStyle = "#FFA100" + lineAlpha;
  ctxBack.strokeStyle = "#FFA100";
  ctxBack.fillStyle = "#FFA100";
  ctxTemp.strokeStyle = "#FFA100";
  ctxTemp.fillStyle = "#FFA100";
  document.getElementById("color").style.border = "4px solid #FFA100";
  colourCount = 7;
}

var custom_color;

function selected_color(){
  colourCount = 10;
  custom_color = document.getElementById("user_color").value
  ctx.strokeStyle = custom_color + lineAlpha;
  ctx.fillStyle = custom_color + lineAlpha;
  ctxBack.strokeStyle = custom_color;
  ctxBack.fillStyle = custom_color;
  ctxTemp.strokeStyle = custom_color;
  ctxTemp.fillStyle = custom_color;
  custom_color = "4px solid "+custom_color;
  document.getElementById("color").style.border = custom_color;
}

function open_colorSelector(){
  document.getElementById("color_wheel").style.display = "inline";
}

function closeColor(){
  document.getElementById("color_wheel").style.display = "none";
}

function confirmColor(){
  selected_color();
  document.getElementById("color_wheel").style.display = "none";
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
          background.width = 1200;
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
  event.target.value = ""; //allows for files to be selected more than one time in a row
}

function uploadOldWork(){
  lastImageBackTemp = ctxBack.getImageData(0, 0, canvasBack.width, canvasBack.height);
  lastImageFrontTemp = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var file = event.target.files[0];
  var reader  = new FileReader();
  reader.onloadend = function (e) {
      background = new Image();
      background.src = e.target.result;
      background.onload = function(ev) {

        w = background.width/scaleBy;
        h = background.height/scaleBy;
        canvas.style.width = w + 'px';
        canvasBack.style.width = w + 'px';
        canvasTemp.style.width = w + 'px';
        canvasSave.style.width = w + 'px';
        canvas.style.height = h + 'px';
        canvasBack.style.height = h + 'px';
        canvasTemp.style.height = h + 'px';
        canvasSave.style.height = h + 'px';
        canvas.width = 1200*scaleBy;
        canvasBack.width = 1200*scaleBy;
        canvasTemp.width = 1200*scaleBy;
        canvasSave.width = 1200*scaleBy;
        canvas.height = h*scaleBy;
        canvasBack.height = h*scaleBy;
        canvasTemp.height = h*scaleBy;
        canvasSave.height = h*scaleBy;

        if(uploadLevel == 1){ //if uploading top layer of work
          document.getElementById("frontConfirmUpload").style.display = "inline-block";
          ctx.drawImage(background,0,0,canvas.width,canvas.height);
          ctx.scale(scaleBy, scaleBy);
          ctxBack.scale(scaleBy, scaleBy);
          ctxTemp.scale(scaleBy, scaleBy);
          ctxSave.scale(scaleBy, scaleBy);
          ctxBack.putImageData(lastImageBackTemp, 0, 0);
        }
        else if(uploadLevel == 0) { //if uploading back layer of work
          document.getElementById("backConfirmUpload").style.display = "inline-block";
          ctxBack.drawImage(background,0,0,canvas.width,canvas.height);
          ctx.scale(scaleBy, scaleBy);
          ctxBack.scale(scaleBy, scaleBy);
          ctxTemp.scale(scaleBy, scaleBy);
          ctxSave.scale(scaleBy, scaleBy);
          ctx.putImageData(lastImageFrontTemp, 0, 0);
        }

      }
  }
  reader.readAsDataURL(file);
  event.target.value = ""; //allows for files to be selected more than one time in a row
}

function open_oldFileUpload(){
  document.getElementById("OldWorkUpload").style.display = "inline";
  uploadLevel = -1;
  lastImageBack = ctxBack.getImageData(0, 0, canvasBack.width, canvasBack.height);
  lastImageFront = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function cancelUpload(){
  if(uploadLevel != -1){
    undo();
  }
  document.getElementById("OldWorkUpload").style.display = "none";
}

function confirmUpload(){
  document.getElementById("OldWorkUpload").style.display = "none";
  document.getElementById("frontConfirmUpload").style.display = "none";
  document.getElementById("backConfirmUpload").style.display = "none";
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

var oldHeight;
var oldWidth;
var changedSize = false;

function clearBack() {
  lastImageBack = ctxBack.getImageData(0, 0, canvasBack.width, canvasBack.height);
  lastImageFront = ctx.getImageData(0, 0, canvas.width, canvas.height);
  document.getElementById("backButton").disabled = false;
  ctxBack.clearRect(0,0,canvasBack.width,canvasBack.height);
  changedSize = true;
  oldHeight = parseInt(canvas.style.height);
  oldWidth = parseInt(canvas.style.width);
  h = 500;
  w = 1200;
  resizeCanvas();

  ctxSave.fillStyle = "white";
  ctxSave.fillRect(0,0,canvas.width,canvas.height);

  if(gridState == true){
    drawGrid();
  }

  ctx.font = "20px Arial";
  ctxBack.font = "20px Arial";
  ctxTemp.font = "20px Arial";

  preserveLineProperties();
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
  if(event.key == "Alt" || event.key == "Control"){
    x1 = x;
    y1 = y;
    part1 = 1;
  }
}

function secondPoint(){
  if(event.key == "Alt" || event.key == "Control"){
    x2 = x;
    y2 = y;
    part2 = 1;
  }
}

function erase(){
  part1 = 0;
  part2 = 0;
  penMode = false;
  eraseMode = true;
  rectMode = false;
  circMode = false;
  straightMode = false;
  highlightMode = false;
  textMode = false;
  erasing(event);
  document.getElementById("pen").style.border = "0px";
  document.getElementById("rectangle").style.border = "0px";
  document.getElementById("circle").style.border = "0px";
  document.getElementById("straightLine").style.border = "0px";
  document.getElementById("highlighter").style.border = "0px";
  document.getElementById("eraser").style.border = "4px solid #2AD3D7";
  document.getElementById("moveDrawing").style.border = "0px";
  document.getElementById("copyDrawing").style.border = "0px";
  document.getElementById("textBox").style.border = "0px";
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
document.getElementById("sizeSection").style.display = "none";

function getUserLetters(){
  key = event.key; //or try keyCode
  //letter = String.fromCharCode(key);
  if(key == "Enter"){ //enter key 13
    doneTyping = true;
  }
  sentence = document.getElementById("textInput").value
  // console.log(sentence);
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
    colorFreeze = true;
    document.addEventListener('keydown', getUserLetters);
    document.getElementById("textInput").style.display = "inline";
    document.getElementById("sizeSection").style.display = "inline";
    document.removeEventListener('keydown', hotKey);
    document.removeEventListener('mousemove', displayTextBox);
    document.addEventListener('input', displayText);
  }
  if(doneTyping == true){
    colorFreeze = false;
    lastImageBack = ctxBack.getImageData(0, 0, canvasBack.width, canvasBack.height);
    lastImageFront = ctx.getImageData(0, 0, canvas.width, canvas.height);
    document.getElementById("textInput").style.display = "none";
    document.getElementById("sizeSection").style.display = "none";
    ctx.fillText(sentence,xAnchor,yAnchor);
    doneTyping = false;
    part1 = 0;
    document.removeEventListener('keydown', getUserLetters);
    document.removeEventListener('keydown', displayText);
    document.addEventListener('keydown', hotKey);
    sentence = "";
    document.getElementById("textInput").value = "";
  }
}

function getTextSize() {
  fontSize = document.getElementById("textSize").value;
  ctx.font = `${fontSize}px Arial`;
  ctxBack.font = `${fontSize}px Arial`;
  ctxTemp.font = `${fontSize}px Arial`;
  displayText();
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

    if(gridState == true) {
      if(y1%gridSpacing <= gridSpacing/2) { //if overshooting the point
        y1 = y1 - (y1%gridSpacing);
      }
      else { //if undershooting the point
        y1 = y1 - (y1%gridSpacing) + gridSpacing;
      }
      if(y2%gridSpacing <= gridSpacing/2) { //if overshooting the point
        y2 = y2 - (y2%gridSpacing);
      }
      else { //if undershooting the point
        y2 = y2 - (y2%gridSpacing) + gridSpacing;
      }
      if(x1%gridSpacing <= gridSpacing/2) { //if overshooting the point
        x1 = x1 - (x1%gridSpacing);
      }
      else { //if undershooting the point
        x1 = x1 - (x1%gridSpacing) + gridSpacing;
      }
      if(x2%gridSpacing <= gridSpacing/2) { //if overshooting the point
        x2 = x2 - (x2%gridSpacing);
      }
      else { //if undershooting the point
        x2 = x2 - (x2%gridSpacing) + gridSpacing;
      }
    }

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
  if(event.key == "Alt" || event.key == "Control"){
    x1 = x; //event.offsetX;
    y1 = y; //event.offsetY;
    //console.log("x1 "+x1+" y1 "+y1);
    part1 = 1;
  }
}

function radiusLength(){
  if(event.key == "Alt" || event.key == "Control"){
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
    if(snapToGrid == true){
      if(Math.abs(x2-x1) >= Math.abs(y2-y1)){ //close to a horizontal line
        y2 = y1;
      }
      else {
        x2 = x1;
      }
    }

    if(gridState == true) {
      if(y1%gridSpacing <= gridSpacing/2) { //if overshooting the point
        y1 = y1 - (y1%gridSpacing);
      }
      else { //if undershooting the point
        y1 = y1 - (y1%gridSpacing) + gridSpacing;
      }
      if(y2%gridSpacing <= gridSpacing/2) { //if overshooting the point
        y2 = y2 - (y2%gridSpacing);
      }
      else { //if undershooting the point
        y2 = y2 - (y2%gridSpacing) + gridSpacing;
      }
      if(x1%gridSpacing <= gridSpacing/2) { //if overshooting the point
        x1 = x1 - (x1%gridSpacing);
      }
      else { //if undershooting the point
        x1 = x1 - (x1%gridSpacing) + gridSpacing;
      }
      if(x2%gridSpacing <= gridSpacing/2) { //if overshooting the point
        x2 = x2 - (x2%gridSpacing);
      }
      else { //if undershooting the point
        x2 = x2 - (x2%gridSpacing) + gridSpacing;
      }
    }

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
var lineAlpha = "FF";
var highlightMode = false;
var penThickness;

function turnOn(){
  if(event.key == "Alt" || event.key == "Control"){
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
  if(event.key == "Alt" || event.key == "Control"){
    drawOn = false;
    document.removeEventListener('keydown', turnOn);
    document.removeEventListener('keyup', turnOff);
    //console.log("off");
  }
}

function draw(event){
  x = event.offsetX; //clientX
  y = event.offsetY;

  if (initialFlag == 1) { //initial postion
    lastX = x;
    lastY = y;
    initialFlag = 0;
  }

  if (drawOn == true){
    if(topSheet == true){
      ctx.beginPath();
      ctx.arc(x,y,penThickness,0,2*Math.PI);
      ctx.fill();
      ctx.closePath();

      ctx.beginPath();
      ctx.moveTo(lastX,lastY);
      ctx.lineTo(x,y);
      ctx.stroke();
      ctx.closePath();
      lastX = x;
      lastY = y;
    }
    else {
      ctxBack.beginPath();
      ctxBack.arc(x,y,penThickness,0,2*Math.PI);
      ctxBack.fill();
      ctxBack.closePath();

      ctxBack.beginPath();
      ctxBack.moveTo(lastX,lastY);
      ctxBack.lineTo(x,y);
      ctxBack.stroke();
      ctxBack.closePath();
      lastX = x;
      lastY = y;
    }
  }
}
