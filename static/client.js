const upload = document.querySelector("#upload");
const canvasImg = document.querySelector("#canvasImg");
const canvasDraw = document.querySelector("#canvasDraw");
const main = document.querySelector(".main");
const footer = document.querySelector(".footer");
const ctxImg = canvasImg.getContext("2d");
const ctxDraw = canvasDraw.getContext("2d");
const submitBtn = document.querySelector("#submit");
const brushColorPicker = document.querySelector("#brushColor");
const bgColorPicker = document.querySelector("#backgroundColor");
const brushToolSize = document.querySelector("#brushSize");
const sizeNum = document.querySelector("#sizeNum");

const MAXWIDTH = 600;
let scaleFactor = 1;
let paint = false;

let brushSize = brushToolSize.value;
sizeNum.value = brushSize;
let brushColor = brushColorPicker.value;
let bgColor = bgColorPicker.value;

let imgsrc;

let imgHeight;
let imgWidth;

brushColorPicker.addEventListener("change", (e) => {
  brushColor = e.target.value;
});

bgColorPicker.addEventListener("change", (e) => {
  bgColor = e.target.value;
});

brushToolSize.addEventListener("change", (e) => {
  brushSize = e.target.value;
  sizeNum.value = e.target.value;
});

sizeNum.addEventListener("change", (e) => {
  brushToolSize.value = e.target.value;
  brushSize = e.target.value;
})

upload.addEventListener("change", () => {
  if (upload.files.length == 0) return;
  console.log(upload.files[0]);
  imgsrc = URL.createObjectURL(upload.files[0]);

  const img = new Image();
  img.src = imgsrc;

  // scale image, set canvas sizes and draw image to canvas
  img.onload = () => {
    if (img.height >= MAXWIDTH) {
      scaleFactor = MAXWIDTH/img.height;
    }
    imgHeight = img.height;
    imgWidth = img.width;
    canvasImg.height = scaleFactor * img.height;
    canvasImg.width = scaleFactor * img.width;
    canvasDraw.height = scaleFactor * img.height;
    canvasDraw.width = scaleFactor * img.width;
    ctxImg.drawImage(img, 0, 0, canvasImg.width, canvasImg.height);
    main.style.height = `${canvasImg.height + 20}px`;
  };
});

canvasDraw.addEventListener("mousedown", (e) => {
  paint = true;
});

canvasDraw.addEventListener("mouseup", (e) => {
  paint = false;
});

canvasDraw.addEventListener("mousemove", draw);

function draw(e) {
  if (!paint) return;
  const rect = canvasDraw.getBoundingClientRect();
  ctxDraw.beginPath();
  ctxDraw.fillStyle = brushColor;
  ctxDraw.arc(e.pageX - rect.left - window.scrollX, e.pageY - rect.top - window.scrollY, brushSize, 0, Math.PI * 2);
  ctxDraw.fill();
  ctxDraw.closePath();
}

// Generate mask button
submitBtn.addEventListener("click", copyDrawToFullScale);

function copyDrawToFullScale(e) {
  const canvasDrawCopy = document.createElement("canvas");
  const h = imgHeight;
  const w = imgWidth;
  console.log(`h: ${h} w: ${w}`);
  canvasDrawCopy.height = h; 
  canvasDrawCopy.width = w;
  const canvasCopyCtx = canvasDrawCopy.getContext("2d");

  //convert drawn img to bitmap then draw to canvas copy at full size
  createImageBitmap(ctxDraw.getImageData(0,0, canvasDraw.width, canvasDraw.height)).then((bitmap) => {
    canvasCopyCtx.drawImage(bitmap, 0, 0, canvasDraw.width, canvasDraw.height, 0, 0, w, h);
    // footer.appendChild(canvasDrawCopy);
    drawFullSizeImageCanvas().then((fullCanvas) => {
      paintCanvasToCanvas(canvasDrawCopy, fullCanvas);
      downloadMask(fullCanvas);
    });
  });
}

// create new canvas and draw img at full original size
function drawFullSizeImageCanvas() {
  return new Promise((resolve, reject) => {
    const fullCanvas = document.createElement("canvas");
    const fullCanvasCtx = fullCanvas.getContext("2d");
    const fullImg = new Image();
    fullImg.src = imgsrc;
    fullImg.onload = () => {
      fullCanvas.height = fullImg.height;
      fullCanvas.width = fullImg.width;
      fullCanvasCtx.drawImage(fullImg, 0, 0, fullImg.width, fullImg.height);
      // footer.appendChild(fullCanvas);
      resolve(fullCanvas);
    }
  });
}

//paint full size drawn mask to full size img.
//iterate srcCanvas.data.length if red in srcCanvas paint red in dstCanvas
function paintCanvasToCanvas(srcCanvas, dstCanvas) {
  console.log("painting");
  const srcCtx = srcCanvas.getContext("2d");
  const dstCtx = dstCanvas.getContext("2d");
  const srcData = srcCtx.getImageData(0, 0, srcCanvas.width, srcCanvas.height);
  const dstData = dstCtx.getImageData(0, 0, dstCanvas.width, dstCanvas.height);
  
  for (let i = 0; i < srcData.data.length; i+=4) {
    if (srcData.data[i] >= 150) {
      dstData.data[i] = 255;
      dstData.data[i+1] = 0;
      dstData.data[i+2] = 0;
      dstData.data[i+3] = 255;
    } else {
      dstData.data[i] = 0;
      dstData.data[i+1] = 0;
      dstData.data[i+2] = 0;
      dstData.data[i+3] = 255;
    }
  }
  dstCtx.putImageData(dstData, 0, 0);
}

function downloadMask(fullCanvas) {
  const link = document.createElement("a");
  link.download = "mask" + upload.files[0].name;
  link.href = fullCanvas.toDataURL();
  link.click();
}