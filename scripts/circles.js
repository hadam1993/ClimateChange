const fs = require('fs-extra');
const config = require('../src/config');
const PImage = require('pureimage');

(async () => {
  async function create (file, r, g, b, a) {
    const img = PImage.make(50, 50);
    const ctx = img.getContext('2d');
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    ctx.beginPath();
    ctx.arc(25, 25, 25, 0, Math.PI * 2, true); // Outer circle
    ctx.closePath();
    ctx.fill();

    await PImage.encodePNGToStream(img, fs.createWriteStream(`./src/assets/img/markers/${file}`));
  }

  const markerImages = [];
  const mutedMarkerImages = [];

  for (const color of config.colors) {
    const { r, g, b } = hexToRgb(color);
    const full = `${color}-full.png`;
    const muted = `${color}-muted.png`;
    await create(full, r, g, b, 1);
    await create(muted, r, g, b, 0.1);

    markerImages.push(full);
    mutedMarkerImages.push(muted);
  }

  fs.writeJsonSync('./src/config.json', {
    ...config,
    markerImages: markerImages,
    mutedMarkerImages: mutedMarkerImages,
  }, { spaces: 2 });
})();

function hexToRgb (hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}
