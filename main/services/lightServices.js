const ws281x = require('rpi-ws281x-native');
const gpio = require('onoff').Gpio;

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
let actionCounter = 0;
const ledNumberArgument = process.argv[2] && parseInt(process.argv[2], 10);
let NUM_LEDS = Number.isInteger(ledNumberArgument) || 4; // Number of LEDs on the LED Strip
if (process.argv[2] !== undefined && Number.isInteger(parseInt(process.argv[2], 10))) {
  NUM_LEDS = parseInt(process.argv[2], 10);
}
let activeAnimation = null; // The Current / Default animation as a <Timeout>
let animationName = 'off';
let direction = 'FORWARD'; // Direction of the Loop
let animacioLepesId = 0; // Loop step id
let continousAnimation = true; // If the animation should end after first run, or keep going
//
// MOTION
const pir = new gpio(12, 'in', 'both');
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
  // console.log('DIRECTION:', direction, 'animacioLepesId:', animacioLepesId);
  if (direction === 'FORWARD') {
    if (animacioLepesId === NUM_LEDS - 1) {
      if (continousAnimation === true) {
        direction = 'REVERSE';
        if (animationName === 'chase') {
          animacioLepesId -= 1;
        }
      }
    } else {
      animacioLepesId += 1;
    }
  } else if (animacioLepesId === 0) {
    if (continousAnimation === true) {
      direction = 'FORWARD';
      if (animationName === 'chase') {
        animacioLepesId += 1;
      }
    }
  } else {
    animacioLepesId -= 1;
  }
};
//
// This is where we kickoff the animations based on the type
const playAnimation = type => {
  initLEDs(NUM_LEDS);
  animacioLepesId = 0;
  let animationToReturn = null;
  const pixelData = new Uint32Array(NUM_LEDS);
  //
  // PETI LEPCSO CONFIG
  const ledekSzamaEgyLepcsonel = 40;
  const lepcsokSzama = 10;
  const lepcsoLedek = [];
  let ledLepcsoId = 0;
  for (let i = 0; i < lepcsokSzama; i += 1) {
    lepcsoLedek[i] = [];
    for (let j = 0; j < ledekSzamaEgyLepcsonel; j += 1) {
      lepcsoLedek[i].push(ledLepcsoId);
      ledLepcsoId += 1;
    }
  }
  console.info('lepcsoLedek:', lepcsoLedek);
  //
  let offset = 0;
  const lepcsoColor = rgb2Int(125, 125, 125);
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
          if (i === animacioLepesId) {
            pixelData[i] = rgb2Int(255, 0, 0);
          } else if ((direction === 'FORWARD' && i === animacioLepesId - 1) || (direction === 'REVERSE' && i === animacioLepesId + 1)) {
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
          if ((i + animacioLepesId) % 2 === 0) {
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
        pixelData[animacioLepesId] = color;
        ws281x.render(pixelData);
        if (animacioLepesId + 1 < NUM_LEDS) {
          increment();
        }
      }, ledSpeed);
      //
      break;
    case 'lepcso':
      continousAnimation = false;
      animationToReturn = setInterval(() => {
        // console.info('animacioLepesId:', animacioLepesId);
        if (animacioLepesId < lepcsokSzama * ledekSzamaEgyLepcsonel) {
          const ledekEzenALepcson = lepcsoLedek[animacioLepesId];
          // console.info('ledekEzenALepcson:', ledekEzenALepcson);
          for (let i = 0; i < ledekSzamaEgyLepcsonel; i += 1) {
            // pixelData[i] = rgb2Int(127, 0, 0);
            if (ledekEzenALepcson) {
              const ezALepcso = ledekEzenALepcson[i];
              // console.info('ezALepcso:', ezALepcso);
              pixelData[ezALepcso] = lepcsoColor;
            }
          }
          ws281x.render(pixelData);
          if (animacioLepesId + 1 <= lepcsokSzama) {
            increment();
          }
        }
      }, ledSpeed);
      break;
    case 'lepcsole':
      continousAnimation = false;
      animationToReturn = setInterval(() => {
        animacioLepesId = NUM_LEDS;
        console.info('animacioLepesId:', animacioLepesId);
        console.info('lepcsokSzama:', lepcsokSzama);
        if (animacioLepesId < lepcsokSzama * ledekSzamaEgyLepcsonel) {
          const ledekEzenALepcson = lepcsoLedek[animacioLepesId];
          // console.info('ledekEzenALepcson:', ledekEzenALepcson);
          for (let i = 0; i < ledekSzamaEgyLepcsonel; i += 1) {
            // pixelData[i] = rgb2Int(127, 0, 0);
            if (ledekEzenALepcson) {
              const ezALepcso = ledekEzenALepcson[i];
              // console.info('ezALepcso:', ezALepcso);
              pixelData[ezALepcso] = rgb2Int(0, 0, 0);
            }
          }
          ws281x.render(pixelData);
          if (animacioLepesId + 1 <= lepcsokSzama) {
            increment();
          }
        }
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
  actionCounter += 1;
  switch (type) {
    case 'rainbow':
    case 'scanner':
    case 'chase':
    case 'red':
    case 'lepcso':
    case 'green':
      direction = 'FORWARD';
      if (animationName !== 'off') {
        clearInterval(activeAnimation);
        ws281x.reset();
      }
      activeAnimation = playAnimation(type);
      animationName = type;
      break;
    case 'lepcsole':
      direction = 'REVERSE';
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
  console.log(` - Action Counter: ${actionCounter}`);
  console.log(` - ${returnMessage}`);
  console.log(`_________________________________`);
  return returnMessage;
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
  actionCounter += 1;
  const speedAsNumber = parseInt(speed, 10);
  if (Number.isInteger(speedAsNumber)) {
    ledSpeed = speedAsNumber;
    //
    // Restart Animation with the new Speed
    if (animationName !== 'off') {
      clearInterval(activeAnimation);
      ws281x.reset();
      activeAnimation = playAnimation(animationName);
    }
    const returnMessage = `Changed speed to ${speed}`;
    console.log(` - Action Counter: ${actionCounter}`);
    console.log(` - ${returnMessage}`);
    console.log(`_________________________________`);
    return returnMessage;
  }
  throw new Error('Not a valid speed');
};
//
//
// PIR WATCHER
pir.watch((err, value) => {
  if (value === 1) {
    console.log('Intruder alert');
    setLightMode('lepcso');
  } else {
    console.log('Intruder gone');
    setLightMode('lepcsole');
  }
});
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
