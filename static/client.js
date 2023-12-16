const upload = document.querySelector("#upload");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const MAXWIDTH = 600;
let scaleFactor = 1;

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
    draw();
  };
}

function draw() {
}