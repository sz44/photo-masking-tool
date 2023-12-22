const upload = document.querySelector("#upload");
const canvasImg = document.querySelector("#canvasImg");
const canvasDraw = document.querySelector("#canvasDraw");
const main = document.querySelector(".main");
const footer = document.querySelector(".footer");
const ctxImg = canvasImg.getContext("2d");
const ctxDraw = canvasDraw.getContext("2d");
const submitBtn = document.querySelector("#submit");

const MAXWIDTH = 600;
let scaleFactor = 1;
let paint = false;

let brushSize = 10;

let imgsrc;

upload.addEventListener("change", () => {
  if (upload.files.length == 0) return;
  console.log(upload.files[0]);
  imgsrc = URL.createObjectURL(upload.files[0]);
  loadImg(imgsrc);
});

function loadImg(imgsrc) {
  const img = new Image();
  img.src = imgsrc;
  
  img.onload = () => {
    if (img.height >= MAXWIDTH) {
      scaleFactor = MAXWIDTH/img.height;
    }
    canvasImg.height = scaleFactor * img.height;
    canvasImg.width = scaleFactor * img.width;
    ctxImg.drawImage(img, 0, 0, canvasImg.width, canvasImg.height);
    main.style.height = `${canvasImg.height + 20}px`;
  };
} 

canvasDrawListeners();
function canvasDrawListeners() {
  canvasDraw.addEventListener("mousedown", (e) => {
    console.log("mousedown");
    paint = true;
  });
  
  canvasDraw.addEventListener("mouseup", (e) => {
    paint = false;
  });

  canvasDraw.addEventListener("mousemove", draw);
}

function draw(e) {
  if (!paint) return;
  const rect = canvasDraw.getBoundingClientRect();
  ctxDraw.beginPath();
  ctxDraw.fillStyle = "hsl(0, 100%, 50%)";
  // ctxDraw.arc(e.clientX - canvasDraw.offsetLeft, e.clintY - canvasDraw.offsetTop, brushSize, 0, Math.PI * 2);
  ctxDraw.arc(e.pageX - rect.left - window.scrollX, e.pageY - rect.top - window.scrollY, brushSize, 0, Math.PI * 2);
  ctxDraw.fill();
  ctxDraw.closePath();
}

submitBtn.addEventListener("click", copyScale);

function copyScale() {
  const canvasDrawCopy = document.createElement("canvas");
  canvasDrawCopy.height = canvasDraw.height;
  canvasDrawCopy.width = canvasDraw.width;
  const canvasCopyCtx = canvasDrawCopy.getContext("2d");
  let canvasDrawData = ctxDraw.getImageData(0, 0, canvasDraw.width, canvasDraw.height);
  canvasCopyCtx.putImageData(canvasDrawData, 0, 0);
  footer.appendChild(canvasDrawCopy);
}

function handleSubmit() {
  console.log("transfering img");
  // let canvasURL = canvasImg.toDataURL();
  // let canvasImgData = ctxImg.getImageData(0, 0, canvasImg.width, canvasImg.height);
  // ctxDraw.putImageData(canvasImgData, 0, 0);
  const fullCanvas = document.createElement("canvas");
  const fullCanvasCtx = fullCanvas.getContext("2d");
  const fullImg = new Image();
  fullImg.src = imgsrc;
  fullImg.onload = () => {
    fullCanvas.height = fullImg.height;
    fullCanvas.width = fullImg.width;
    fullCanvasCtx.drawImage(fullImg, 0, 0, fullImg.width, fullImg.height);
    let canvasDrawData = ctxDraw.getImageData(0,0, canvasDraw.width, canvasDraw.height);
    let canvasImgData = ctxImg.getImageData(0,0, canvasImg.width, canvasImg.height);
    // let canvasDrawDataRed = makeBGTrans(canvasDrawData);
    let paintedImageData = paintCanvasToCanvas(canvasDrawData, canvasImgData);
    fullCanvasCtx.putImageData(canvasDrawDataRed, 0, 0);
    footer.appendChild(fullCanvas);
  }
}

function paintCanvasToCanvas(drawData, imgData) {
}

function makeBGTrans(imageData) {
  for (let p = 0; p < imageData.data.length; p+=4) {
    // if (imageData.data[p] != 255) {
      imageData.data[p] = 0;
      imageData.data[p+1] = 0;
      imageData.data[p+2] = 0;
      imageData.data[p+3] = 0;
    // }
  }
  return imageData;
}

// Task: make a new canvas with from draw that is the right size
//       paint of the fullsized image useing above data
//      