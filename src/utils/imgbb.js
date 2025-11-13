const fetch = require("node-fetch");
const IMGBB_KEY = process.env.IMGBB_KEY;

async function uploadToImgbb(base64Image) {
  const url = `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`;
  const form = new URLSearchParams();
  form.append("image", base64Image.replace(/^data:image\/\w+;base64,/, ""));

  const res = await fetch(url, { method: "POST", body: form });
  const json = await res.json();
  if (!json.success) throw new Error("imgbb upload failed");
  return json.data.url;
}

module.exports = uploadToImgbb;
