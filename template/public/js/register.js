const img_label = document.getElementById("img_label");
const image = document.getElementById("image");
const image_base64 = document.getElementById("image_base64");

image.addEventListener("change", () => {
  const file = image.files[0];
  const reader = new FileReader();
  reader.onloadend = () => {
    image_base64.value = reader.result;
    img_label.innerText = file.name;
  };
  reader.readAsDataURL(file);
});
