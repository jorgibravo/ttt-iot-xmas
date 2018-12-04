# BLACK SWAN BUDAPEST
# THURSDAY TECH TALK (TTT)
### IOT Xmas LEDs
---

## DESCRIPTION
The purpose of this demonstration is to showcase an example project that can be easily customized and extended for other purposes. In this demo we are going to become familiar with the components listed below.

---
## COMPONENTS
#### Hardware:
- Raspberry Pi model B+ and Accessories: ~ 45 USD
- WS2812B Individually addressable LED strip: ~ 4 USD / metres
- WS2812B Female Male 3-Pin Connectors: ~ 0.3 USD / pair
- 3.3V to 5V Logic Level Converter: ~ 3 USD
**TOTAL:** ~53 USD

---

#### Software:
##### Back-End:
- Node Js v8.10.0
- Swagger with OpenApi 3

##### Front-End:
- React v16.6.3
- Material-UI v3.6.1
- Sass

##### Utils:
- Express
- Yarn
- esLint
- Babel
- [Text to ASCII generator](http://patorjk.com/software/taag/#p=display&f=Small&t=myComment)
- NodeJs LEDStrip controller: [rpi-ws281x-native](https://www.npmjs.com/package/rpi-ws281x-native)

---

## HOW TO GET STARTED
### Step-By-Step on computer
> Each step is separated into different branches, if you would like to follow the progress, you can start by checking out the first branch in numeric order. Each branch has it's own GUIDE.md to explain the details.
```
yarn install
yarn build
yarn start
```

### Running on Raspberry
> To access the phisycal memory of the device, the app needs to run with sudo privileges. Start the app with
```
sudo node ./main/index.js
```

### Final Code
> The master branch has the final code, that you can run on your computer after cloning the repo with the following commands:


---


### Sources:
- [Adafruit tutorials](https://learn.adafruit.com/adafruit-neopixel-uberguide?view=all)
- [WS2812B on Raspberry](https://blog.hypriot.com/post/drive-neopixels-in-docker/)
