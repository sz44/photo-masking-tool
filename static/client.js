const upload = document.querySelector("#upload");
const canvasImg = document.querySelector("#canvasImg");
const canvasDraw = document.querySelector("#canvasDraw");
const main = document.querySelector(".main");
const ctxImg = canvasImg.getContext("2d");
const ctxDraw = canvasDraw.getContext("2d");
const submitBtn = document.querySelector("#submit");

const MAXWIDTH = 600;
let scaleFactor = 1;
let paint = false;

let brushSize = 10;

upload.addEventListener("change", () => {
  if (upload.files.length == 0) return;
  console.log(upload.files[0]);
  const imgsrc = URL.createObjectURL(upload.files[0]);
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
  ctxDraw.arc(e.clientX - rect.left - window.scrollX, e.pageY - rect.top - window.scrollY, brushSize, 0, Math.PI * 2);
  ctxDraw.fill();
  ctxDraw.closePath();
}

submitBtn.addEventListener("click", (e) => {
  console.log("transfering img");
  // let canvasURL = canvasImg.toDataURL();
  let canvasImgData = ctxImg.getImageData(0, 0, canvasImg.width, canvasImg.height);
  ctxDraw.putImageData(canvasImgData, 0, 0);
});

// Task: Draw from one canvas to another
//       Draw on one canvas and transfer it to another.
//       Scale the transfered drawing