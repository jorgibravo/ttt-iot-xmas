// Convert an array of 3 numbers between 0-255 to a single Int that the ws281x can handle
const rgb2Int = (r, g, b) => ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff); // eslint-disable-line
//
// rainbow-colors, taken from http://goo.gl/Cs3H0v
const colorwheel = pos => {
  pos = 255 - pos;
  let colorToReturn = null;
  if (pos < 85) {
    colorToReturn = rgb2Int(255 - pos * 3, 0, pos * 3);
  } else if (pos < 170) {
    pos -= 85;
    colorToReturn = rgb2Int(0, pos * 3, 255 - pos * 3);
  } else {
    pos -= 170;
    colorToReturn = rgb2Int(pos * 3, 255 - pos * 3, 0);
  }
  return colorToReturn;
};

module.exports = {
  rgb2Int: rgb2Int,
  colorwheel: colorwheel,
};
