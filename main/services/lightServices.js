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
const ledNumberArgument = process.argv[2] && parseInt(process.argv[2], 10);
let NUM_LEDS = Number.isInteger(ledNumberArgument) || 4; // Number of LEDs on the LED Strip
if (process.argv[2] !== undefined && Number.isInteger(parseInt(process.argv[2], 10))) {
  NUM_LEDS = parseInt(process.argv[2], 10);
}
let activeAnimation = null; // The Current / Default animation as a <Timeout>
let animationName = 'off';
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
  console.log(` - Initialized ws281x with ${NUM_LEDS} LEDs`);
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
// This is where we kickoff the animations based on the type
const playAnimation = type => {
  initLEDs(NUM_LEDS);
  let animationToReturn = null;
  const pixelData = new Uint32Array(NUM_LEDS);
  //
  let offset = 0;
  //
  switch (type) {
    case 'rainbow':
      animationToReturn = setInterval(() => {
        for (let i = 0; i < NUM_LEDS; i += 1) {
          pixelData[i] = colorwheel((offset + i) % 256);
        }
        //
        offset = (offset + 1) % 256;
        ws281x.render(pixelData);
      }, ledSpeed);
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
  switch (type) {
    case 'rainbow':
      if (animationName !== 'off') {
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
  const returnMessage = `Changed lights to ${type}`;
  console.log(` - ${returnMessage}`);
  console.log(`_________________________________`);
  return returnMessage;
};
//
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
    const returnMessage = `Changed speed to ${speed}`;
    console.log(` - ${returnMessage}`);
    console.log(`_________________________________`);
    return returnMessage;
  }
  throw new Error('Not a valid speed');
};
//
//
// This is the function that we call as the API endpoint for getLightStatus
const getLightStatus = () => {
  const ledDetails = {
    animationName,
    ledSpeed,
  };
  return ledDetails;
};
//
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
