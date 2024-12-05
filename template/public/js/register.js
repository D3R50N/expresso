const img_label = document.getElementById("img_label");
const image = document.getElementById("image");

image.addEventListener("change", () => {
  const file = image.files[0];
  const reader = new FileReader();
  reader.onloadend = () => {
    img_label.innerText = file.name;
  };
  reader.readAsDataURL(file);
});
 