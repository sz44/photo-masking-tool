const upload = document.querySelector("#upload");
const canvasImg = document.querySelector("#canvasImg");
const canvasDraw = document.querySelector("#canvasDraw");
const canvasContainer = document.querySelector(".canvasContainer");
const footer = document.querySelector(".footer");
const ctxImg = canvasImg.getContext("2d");
const ctxDraw = canvasDraw.getContext("2d");
const submitBtn = document.querySelector("#submit");
const brushColorPicker = document.querySelector("#brushColor");
const bgColorPicker = document.querySelector("#backgroundColor");
const brushToolSize = document.querySelector("#brushSize");
const sizeNum = document.querySelector("#sizeNum");
const transCheck = document.querySelector("#transCheck");
const imgCheck = document.querySelector("#imgCheck");

const MAXWIDTH = 600;
let scaleFactor = 1;
let paint = false;

let brushSize = brushToolSize.value;
sizeNum.value = brushSize;
let brushColor = brushColorPicker.value;
let bgColor = bgColorPicker.value;

let imgsrc;

let imgHeight = 600;
let imgWidth = 600;

transCheck.checked = false;
imgCheck.checked = false;
let transparent = transCheck.checked;
let keepImgBG = imgCheck.checked;

transCheck.addEventListener("change", (e) => {
  transparent = e.target.checked
  imgCheck.checked = false;
  keepImgBG = imgCheck.checked;
});

imgCheck.addEventListener("change", (e) => {
  keepImgBG = e.target.checked
  transCheck.checked = false;
  transparent = transCheck.checked;
});

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
    canvasContainer.style.height = `${canvasImg.height + 20}px`;
  };
});

canvasDraw.addEventListener("click", (e) => {
  paint = true;
  draw(e);
  paint = false;
});

canvasDraw.addEventListener("mouseover", e => {

})

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

// Download mask button
submitBtn.addEventListener("click", copyDrawToFullScale);

function copyDrawToFullScale(e) {
  const canvasDrawCopy = document.createElement("canvas");
  canvasDrawCopy.height = imgHeight; 
  canvasDrawCopy.width = imgWidth;
  const canvasCopyCtx = canvasDrawCopy.getContext("2d");

  //convert drawn img to bitmap then draw to canvas copy at full size
  createImageBitmap(ctxDraw.getImageData(0,0, canvasDraw.width, canvasDraw.height)).then((bitmap) => {
    canvasCopyCtx.drawImage(bitmap, 0, 0, canvasDraw.width, canvasDraw.height, 0, 0, imgWidth, imgHeight);
    // footer.appendChild(canvasDrawCopy);
    if (transparent) {
      downloadMask(canvasDrawCopy);
    } else if(keepImgBG) {
      
      //drawfull image on canvas
      // draw mask on image
      //downlaod
      drawFullSizeImageCanvas().then((fullCanvas) => {
        paintCanvasToCanvas(canvasDrawCopy, fullCanvas);
        downloadMask(fullCanvas);
      });

    } else {
      const fullDrawData = canvasCopyCtx.getImageData(0,0, imgWidth, imgHeight);
      bgRed = Number("0x" + bgColor[1] + bgColor[2] );
      bgGreen = Number("0x" + bgColor[3] + bgColor[4] );
      bgBlue = Number("0x" + bgColor[5] + bgColor[6] );
      for (let i = 0; i < fullDrawData.data.length; i += 4) {
        if (fullDrawData.data[i+3] < 255) {
          fullDrawData.data[i] = bgRed;
          fullDrawData.data[i+1] = bgGreen;
          fullDrawData.data[i+2] = bgBlue;
          fullDrawData.data[i+3] = 255;
        }
      }
      canvasCopyCtx.putImageData(fullDrawData, 0, 0);
      downloadMask(canvasDrawCopy);
    }
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
  
  red = Number("0x" + brushColor[1] + brushColor[2]);
  green = Number("0x" + brushColor[3] + brushColor[4]);
  blue = Number("0x" + brushColor[5] + brushColor[6]);

  for (let i = 0; i < srcData.data.length; i+=4) {
    if (srcData.data[i+3] > 0) {
      dstData.data[i] = red;
      dstData.data[i+1] = green;
      dstData.data[i+2] = blue;
      dstData.data[i+3] = 255;
    } 
  }
  dstCtx.putImageData(dstData, 0, 0);
}

function downloadMask(fullCanvas) {
  const link = document.createElement("a");
  link.download = "mask" + upload.files[0].name;
  link.href = fullCanvas.toDataURL("image/png");
  link.click();
}