const ws281x = require('rpi-ws281x-native');

// _____________________________________________________________________________
//  _____ ____   _   _ ______ _____ _____
// / ____/ __ \ | \ | |  ____|_   _/ ____|
// | |   | |  | |  \| | |__    | || |  __
// | |   | |  | | . ` |  __|   | || | |_ |
// | |___| |__| | |\  | |     _| || |__| |
// \_____\____/ |_| \_|_|    |_____\_____|
// _____________________________________________________________________________
//
let ledSpeed = 200; // The speed of the animation
const NUM_LEDS = 4; // Number of LEDs on the LED Strip
let activeAnimation = null; // The Current / Default animation as a <Timeout>
let animationName = 'off';
let direction = 'FORWARD'; // Direction of the Loop
let ledId = 0; // Loop step id
let continousAnimation = true; // If the animation should end after first run, or keep going
//
// _____________________________________________________________________________
//  _____ ____  _      ____   _____       _    _ _______ _____ _       _____
// / ____/ __ \| |    / __ \ |  __ \     | |  | |__   __|_   _| |     / ____|
// | |   | |  | | |   | |  | | |__) |    | |  | |  | |    | | | |    | (___
// | |   | |  | | |   | |  | |  _  /     | |  | |  | |    | | | |     \___ \
// | |___| |__| | |___| |__| | | \ \     | |__| |  | |   _| |_| |____ ____) |
// \_____\____/|______\____/ |_|  \_\     \____/   |_|  |_____|______|_____/
// _____________________________________________________________________________
//
// Initialize the LED Strip
const initLEDs = numberOfLEds => {
  ws281x.init(numberOfLEds);
};
//
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
//
// _____________________________________________________________________________
//      _        _ _____ __  __       _______ _____ ____  _   _
//     /\   | \ | |_   _|  \/  |   /\|__   __|_   _/ __ \| \ | |
//    /  \  |  \| | | | | \  / |  /  \  | |    | || |  | |  \| |
//   / /\ \ | . ` | | | | |\/| | / /\ \ | |    | || |  | | . ` |
//  / ____ \| |\  |_| |_| |  | |/ ____ \| |   _| || |__| | |\  |
// /_/    \_\_| \_|_____|_|  |_/_/    \_\_|  |_____\____/|_| \_|
// _____________________________________________________________________________
//
// This handles the loop outside of the intervalFunctions
const increment = () => {
  // console.log('DIRECTION:', direction, 'ledId:', ledId);
  if (direction === 'FORWARD') {
    if (ledId === NUM_LEDS - 1) {
      if (continousAnimation === true) {
        direction = 'REVERSE';
        if (animationName === 'chase') {
          ledId -= 1;
        }
      }
    } else {
      ledId += 1;
    }
  } else if (ledId === 0) {
    if (continousAnimation === true) {
      direction = 'FORWARD';
      if (animationName === 'chase') {
        ledId += 1;
      }
    }
  } else {
    ledId -= 1;
  }
};
//
// This is where we kickoff the animations based on the type
const playAnimation = type => {
  ledId = 0;
  let animationToReturn = null;
  const pixelData = new Uint32Array(NUM_LEDS);
  //
  let offset = 0;
  const color = type === 'red' ? rgb2Int(255, 0, 0) : rgb2Int(0, 255, 0);
  //
  switch (type) {
    case 'rainbow':
      continousAnimation = true;
      animationToReturn = setInterval(() => {
        for (let i = 0; i < NUM_LEDS; i += 1) {
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
            pixelData[i] = rgb2Int(255, 0, 0);
          } else if ((direction === 'FORWARD' && i === ledId - 1) || (direction === 'REVERSE' && i === ledId + 1)) {
            pixelData[i] = rgb2Int(255, 0, 0);
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
};
//
// _____________________________________________________________________________
//  _____  ____  _   _   _______ _____   ____  _
// / ____ / __  \ | \ | |__   __|  __ \ / __ \| |
// | |   | |  | |  \| |    | |  | |__) | |  | | |
// | |   | |  | | . ` |    | |  |  _  /| |  | | |
// | |___| |__| | |\  |    | |  | | \ \| |__| | |____
// \_____ \____/|_| \_|    |_|  |_|  \_\\____/|______|
//
// _____________________________________________________________________________
//
// This is the function that we call as the API endpoint for setLightMode
const setLightMode = type => {
  //
  initLEDs(NUM_LEDS);
  switch (type) {
    case 'rainbow':
    case 'scanner':
    case 'chase':
    case 'red':
    case 'green':
      if (animationName !== 'off' && animationName !== 'red' && animationName !== 'green') {
        clearInterval(activeAnimation);
        ws281x.reset();
      }
      activeAnimation = playAnimation(type);
      animationName = type;
      break;
    case 'off':
      clearInterval(activeAnimation);
      ws281x.reset();
      animationName = type;
      break;
    default:
      Error(`This is not a valid option`);
  }
  //
  return `Changed lights to ${type}`;
};
//
// This is the function that we call as the API endpoint for getLightStatus
const getLightStatus = () => {
  const ledDetails = {
    ledSpeed,
    animationName,
    continousAnimation,
  };
  return ledDetails;
};
//
// Sets the new speed for the animation
const setLightSpeed = speed => {
  const speedAsNumber = parseInt(speed, 10);
  if (Number.isInteger(speedAsNumber)) {
    ledSpeed = speedAsNumber;
    //
    // Restart Animation with the new Speed
    if (animationName !== 'off' && animationName !== 'red' && animationName !== 'green') {
      clearInterval(activeAnimation);
      ws281x.reset();
      activeAnimation = playAnimation(animationName);
    }
    return `New speed is set to ${speed}`;
  }
  throw new Error('Not a valid speed');
};
//
// Reset the LED Strip on Ctrl + C
process.on('SIGINT', () => {
  ws281x.reset();
  process.nextTick(() => process.exit(0));
});
//
module.exports = {
  setLightMode: setLightMode,
  getLightStatus: getLightStatus,
  setLightSpeed: setLightSpeed,
};
