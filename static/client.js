const upload = document.querySelector("#upload");
const canvasImg = document.querySelector("#canvasImg");
const canvasDraw = document.querySelector("#canvasDraw");
const main = document.querySelector(".main");
const ctxImg = canvasImg.getContext("2d");
const ctxDraw = canvasImg.getContext("2d");
const submitBtn = document.querySelector("#submit");

const MAXWIDTH = 600;
let scaleFactor = 1;
let paint = false;

const mouse = {
  x: null,
  y: null
}

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
    canvasDrawListeners();
  };
} 

function canvasDrawListeners() {
  canvasImg.addEventListener("mousedown", (e) => {
    console.log("mousedown");
    paint = true;
  });
  
  canvasImg.addEventListener("mouseup", (e) => {
    paint = false;
  });

  canvasImg.addEventListener("mousemove", draw);
}

function draw(e) {
  if (!paint) return;
  console.log(e.x, e.y);
  mouse.x = e.pageX;
  mouse.y = e.pageY;
  ctxImg.beginPath();
  ctxImg.fillStyle = "hsl(0, 100%, 50%)";
  ctxImg.arc(mouse.x - canvasImg.offsetLeft, mouse.y - canvasImg.offsetTop, brushSize, 0, Math.PI * 2);
  ctxImg.fill();
  ctxImg.closePath();
}

submitBtn.addEventListener("click", (e) => {
  let canvasURL = canvasImg.toDataURL();
});

// Task: Draw from one canvas to another
//       Draw on one canvas and transfer it to another.
//       Scale the transfered drawing