const upload = document.querySelector("#upload");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const MAXWIDTH = 600;
let scaleFactor = 1;
let paint = false;

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
    canvas.height = scaleFactor * img.height;
    canvas.width = scaleFactor * img.width;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvasListeners();
  };
} 

const mouse = {
  x: null,
  y: null
}

let brushSize = 10;

function canvasListeners() {
  canvas.addEventListener("mousedown", (e) => {
    paint = true;
  });
  
  canvas.addEventListener("mouseup", (e) => {
    paint = false;
  });

  canvas.addEventListener("mousemove", draw);
}

function draw(e) {
  if (!paint) return;
  mouse.x = e.x;
  mouse.y = e.y;
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(mouse.x - canvas.offsetLeft, mouse.y - canvas.offsetTop, brushSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}