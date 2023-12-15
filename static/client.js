const upload = document.querySelector("#upload");
const prev = document.querySelector("#prev");
const canvas = document.querySelector("canvas");


upload.addEventListener("change", () => {
  if (upload.files.length == 0) return;
  console.log(upload.files[0]);
  const imgsrc = URL.createObjectURL(upload.files[0]);
  draw(imgsrc);
  // const el = document.createElement("img");
  // el.src = imgurl;
  // prev.appendChild(el);
});

function draw(imgsrc) {
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
  };
  img.src = imgsrc;
}