const ws281x = require('rpi-ws281x-native');

const ledSpeed = 100;
const NUM_LEDS = 4;
let activeAnimation = null;
let direction = 'FORWARD';
let ledId = 0;
let continousAnimation = true;
//
const initLEDs = (numberOfLEds) => {
  ws281x.init(numberOfLEds);
};
//
const setLightMode = type => {
  console.log('type:', type);
  //
  switch (type) {
    case 'rainbow':
    case 'scanner':
    case 'chase':
    case 'red':
    case 'green':
      activeAnimation = playAnimation(type);
      break;
    case 'off':
      clearInterval(activeAnimation);
      ws281x.reset();
      break;
    default:
      Error(`This is not a valid option`);
  }
  //
  console.log('activeAnimation:', activeAnimation);
  return `Changed lights to ${type}`;
};
//
const playAnimation = (type) => {
  initLEDs(NUM_LEDS);
  ledId = 0;
  let animationToReturn = null;
  const pixelData = new Uint32Array(NUM_LEDS);
  //
  let offset = 0;
  let color = type === 'red' ? rgb2Int(127, 0, 0) : rgb2Int(0, 127, 0);
  //
  switch (type) {
    case 'rainbow':
      continousAnimation = true;
      animationToReturn = setInterval(() => {
        for (var i = 0; i < NUM_LEDS; i += 1) {
          pixelData[i] = colorwheel((offset + i) % 256);
        }
        //
        offset = (offset + 1) % 256;
        ws281x.render(pixelData);
      }, ledSpeed);
      break;
    case 'scanner':
      continousAnimation = true;
      animationToReturn = setInterval(() => {
        for (let i = 0; i < NUM_LEDS; i += 1) {
          if (i === ledId) {
            pixelData[i] = rgb2Int(127, 0, 0);
          } else if ((direction === 'FORWARD' && i === ledId - 1) || (direction === 'REVERSE' && i === ledId + 1)) {
            pixelData[i] = rgb2Int(127, 0, 0);
          } else {
            pixelData[i] = rgb2Int(0, 0, 0);
          }
        }
        ws281x.render(pixelData);
        increment();
      }, ledSpeed);
      break;
    case 'chase':
      continousAnimation = true;
      animationToReturn = setInterval(() => {
        console.log('__');
        for (let i = 0; i < NUM_LEDS; i += 1) {
          if ((i + ledId) % 2 === 0) {
            pixelData[i] = rgb2Int(127, 0, 0);
          } else {
            pixelData[i] = rgb2Int(0, 127, 0);
          }
        }
        ws281x.render(pixelData);
        increment();
      }, ledSpeed);
      break;
    case 'red':
    case 'green':
      continousAnimation = false;
      animationToReturn = setInterval(() => {
          pixelData[ledId] = color;
          ws281x.render(pixelData);
          if (ledId + 1 < NUM_LEDS) {
            increment();
          } else {
            clearInterval(activeAnimation);
          }
      }, ledSpeed);
      //
      break;
    default:
      Error(`This is not a valid option`);
  }
  //
  return animationToReturn;
}
//
// ---- catch the SIGINT and reset before exit
process.on('SIGINT', () => {
  ws281x.reset();
  process.nextTick(() => process.exit(0));
});
//
// rainbow-colors, taken from http://goo.gl/Cs3H0v
const colorwheel = (pos) => {
  pos = 255 - pos;
  if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3); }
  else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3); }
  else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0); }
}
//
const rgb2Int = (r, g, b) => {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}
//
const increment = () => {
  console.log('DIRECTION:', direction);
  if (direction === 'FORWARD') {
     if (ledId === NUM_LEDS - 1) {
       if (continousAnimation === true) {
         direction = 'REVERSE';
       }
     } else {
       ledId += 1;
     }
  } else if (ledId === 0) {
    if (continousAnimation === true) {
      direction = 'FORWARD';
    }
  } else {
    ledId -= 1;
  }
}
//
module.exports = {
  setLightMode: setLightMode
};
