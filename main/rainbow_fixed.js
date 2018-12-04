const ws281x = require('rpi-ws281x-native');

const NUM_LEDS = parseInt(process.argv[2], 10) || 4;
const pixelData = new Uint32Array(NUM_LEDS);

const brightness = 128;
const signals = {
  SIGINT: 2,
  SIGTERM: 15,
};

ws281x.init(NUM_LEDS);

// generate integer from RGB value
function color(r, g, b) {
  r = (r * brightness) / 255;
  g = (g * brightness) / 255;
  b = (b * brightness) / 255;
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff); // eslint-disable-line
}
//
// generate rainbow colors accross 0-255 positions.
function wheel(pos) {
  pos = 255 - pos;
  if (pos < 85) {
    return color(255 - pos * 3, 0, pos * 3);
  }
  if (pos < 170) {
    pos -= 85;
    return color(0, pos * 3, 255 - pos * 3);
  }
  pos -= 170;
  return color(pos * 3, 255 - pos * 3, 0);
}

const lightsOff = function() {
  for (let i = 0; i < NUM_LEDS; i += 1) {
    pixelData[i] = color(0, 0, 0);
  }
  ws281x.render(pixelData);
  ws281x.reset();
};

function shutdown(signal) {
  console.log(`Stopped by ${signal}`);
  lightsOff();
  process.nextTick(() => {
    process.exit(0);
  });
}

Object.keys(signals).forEach(signal => {
  process.on(signal, () => {
    shutdown(signal, signals[signal]);
  });
});

// ---- animation-loop
let offset = 0;
setInterval(() => {
  for (let i = 0; i < NUM_LEDS; i += 1) {
    pixelData[i] = wheel(((i * 256) / NUM_LEDS + offset) % 256);
  }

  offset = (offset + 1) % 256;
  ws281x.render(pixelData);
}, 1000 / 30);

console.log('Rainbow started. Press <ctrl>+C to exit.');
