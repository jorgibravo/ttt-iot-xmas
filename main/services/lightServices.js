const ws281x = require('rpi-ws281x-native');
const gpio = require('onoff').Gpio;
const lightFunctions = require('./lightFunctions');

// _____________________________________________________________________________
//  _____ ____   _   _ ______ _____ _____
// / ____/ __ \ | \ | |  ____|_   _/ ____|
// | |   | |  | |  \| | |__    | || |  __
// | |   | |  | | . ` |  __|   | || | |_ |
// | |___| |__| | |\  | |     _| || |__| |
// \_____\____/ |_| \_|_|    |_____\_____|
// _____________________________________________________________________________
//
//  _    ___ ___  ___ ___  ___     ___ ___  _  _ ___ ___ ___
// | |  | __| _ \/ __/ __|/ _ \   / __/ _ \| \| | __|_ _/ __|
// | |__| _||  _/ (__\__ \ (_) | | (_| (_) | .` | _| | | (_ |
// |____|___|_|  \___|___/\___/   \___\___/|_|\_|_| |___\___|
const ledekSzamaEgyLepcsonel = 42;
const lepcsokSzama = 16;
const lepcsoLedek = [];
let lepcsoColor = lightFunctions.rgb2Int(125, 125, 125);
let ledLepcsoId = 0;
for (let i = 0; i < lepcsokSzama; i += 1) {
  lepcsoLedek[i] = [];
  for (let j = 0; j < ledekSzamaEgyLepcsonel; j += 1) {
    lepcsoLedek[i].push(ledLepcsoId);
    ledLepcsoId += 1;
  }
}
console.info('lepcsoLedek:', lepcsoLedek.length);
console.log ('lepcsoLedek:', lepcsoLedek.length);
//
//  __  __  ___ _____ ___ ___  _  _    ___ ___  _  _ ___ ___ ___
// |  \/  |/ _ \_   _|_ _/ _ \| \| |  / __/ _ \| \| | __|_ _/ __|
// | |\/| | (_) || |  | | (_) | .` | | (_| (_) | .` | _| | | (_ |
// |_|  |_|\___/ |_| |___\___/|_|\_|  \___\___/|_|\_|_| |___\___|
const pirlenn = new gpio(12, 'in', 'both');
const pirfenn = new gpio(13, 'in', 'both');

//
let ledSpeed = 200; // The speed of the animation
let actionCounter = 0;
const ledNumberArgument = process.argv[2] && parseInt(process.argv[2], 10);
let NUM_LEDS = Number.isInteger(ledNumberArgument) || lepcsokSzama * ledekSzamaEgyLepcsonel; // Number of LEDs on the LED Strip
if (process.argv[2] !== undefined && Number.isInteger(parseInt(process.argv[2], 10))) {
  NUM_LEDS = parseInt(process.argv[2], 10);
}
let activeAnimation = null; // The Current / Default animation as a <Timeout>
let animationName = 'off';
let direction = 'FORWARD'; // Direction of the Loop
let animacioLepesId = 0; // Loop step id
let continousAnimation = true; // If the animation should end after first run, or keep going

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
  console.log('DIRECTION:', direction, 'animacioLepesId:', animacioLepesId);
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
  let offset = 0;


  // Default ertek a red green blue szinekhez, color válotó deklarálás hozzá

if (type === 'red') {
   color = lightFunctions.rgb2Int(255, 0, 0);
} else if (type === 'green') {
   color = lightFunctions.rgb2Int(0, 255, 0);
} else if (type === 'blue') {
   color = lightFunctions.rgb2Int(0, 0, 255);
}  
  
  switch (type) {
    case 'rainbow':
      continousAnimation = true;
      animationToReturn = setInterval(() => {
        for (let i = 0; i < NUM_LEDS; i += 1) {
          pixelData[i] = lightFunctions.colorwheel((offset + i) % 256);
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
            pixelData[i] = lightFunctions.rgb2Int(255, 0, 0);
          } else if ((direction === 'FORWARD' && i === animacioLepesId - 1) || (direction === 'REVERSE' && i === animacioLepesId + 1)) {
            pixelData[i] = lightFunctions.rgb2Int(255, 0, 0);
          } else {
            pixelData[i] = lightFunctions.rgb2Int(0, 0, 0);
          }
          console.log('animacioLepesId:', animacioLepesId);
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
            pixelData[i] = lightFunctions.rgb2Int(127, 0, 0);
          } else {
            pixelData[i] = lightFunctions.rgb2Int(0, 127, 0);
          }
          console.log('animacioLepesId:', animacioLepesId);
        }
        ws281x.render(pixelData);
        increment();
      }, ledSpeed);
      break;
    case 'red':
    case 'blue':
    case 'green':
      continousAnimation = false;
      animationToReturn = setInterval(() => {
        pixelData[animacioLepesId] = color;
        ws281x.render(pixelData);
        if (animacioLepesId + 1 < NUM_LEDS) {
          increment();
          console.log('animacioLepesId:', animacioLepesId);
        }
      }, ledSpeed);
      //
      break;
    case 'lepcsofellentrol':
    case 'lepcsolelentrol':
    case 'lepcsofelfentrol':
    case 'lepcsolefentrol':
      continousAnimation = false;
      console.info('lépcsőcolor: ', lepcsoColor);
      console.info('animacioLepesId at start:', animacioLepesId);
      //ez a for teszi az egészet fehérre mielőtt lekapcsolna
      if (type === 'lepcsolelentrol' || type === 'lepcsolefentrol') {   
            for (let i = 0; i < NUM_LEDS; i += 1) {
                pixelData[i] = lightFunctions.rgb2Int(125, 125, 125);
                }
                 ws281x.render(pixelData);
        }
      animationToReturn = setInterval(() => {
        if (animacioLepesId < lepcsokSzama) {
          console.log('animacioLepesId: ', animacioLepesId);
          console.log('lepcsokSzama:', lepcsokSzama);          
          let lepcsoid = animacioLepesId;
          if (type === 'lepcsolefentrol' || type === 'lepcsofelfentrol') {
            lepcsoid = lepcsokSzama - (animacioLepesId + 1);
          }
          console.info('lepcsoid:', lepcsoid);
          console.info('animacioLepesId: ', animacioLepesId);
          console.info('lépcsőcolor: ', lepcsoColor);
          const ledekEzenALepcson = lepcsoLedek[lepcsoid];
          console.info('ledekEzenALepcson:', ledekEzenALepcson);
          
          

          for (let i = 0; i < ledekSzamaEgyLepcsonel; i += 1) {
            if (ledekEzenALepcson) {
              const ezALepcso = ledekEzenALepcson[i];
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
    case 'lepcsofellentrol':
    case 'lepcsolelentrol':
    case 'lepcsofelfentrol':
    case 'lepcsolefentrol':
      direction = 'FORWARD';
      clearInterval(activeAnimation);
      activeAnimation = playAnimation(type);
      animationName = type;
      if (type === 'lepcsolelentrol' || type === 'lepcsolefentrol') {
      lepcsoColor = lightFunctions.rgb2Int(0, 0, 0);      
      } else if (type === 'lepcsofellentrol' || type === 'lepcsofelfentrol') {        
      lepcsoColor = lightFunctions.rgb2Int(125, 125, 125);
      }
      
      break;
    case 'rainbow':
    case 'scanner':
    case 'chase':
    case 'red':
    case 'blue':
    case 'green':
      direction = 'FORWARD';
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
// PIR WATCHER
pirlenn.watch((err, value) => {
  console.log(value)
  if (value === 1 && animationName === 'off') {
    console.log('Intruder alert');
    setLightMode('lepcsofellentrol');
  } else if (animationName === 'lepcsofellentrol') {
    console.log('Intruder gone');
    setLightMode('lepcsolefentrol');
  }
});
pirfenn.watch((err, value) => {
  if (value === 1 && animationName === 'off') {
    console.log('Intruder alert');
    setLightMode('lepcsofelfentrol');
  } else if (animationName === 'lepcsofelfentrol') {
    console.log('Intruder gone');
    setLightMode('lepcsolelentrol');
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
