# Peti lépcső
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

Raspberry install

Oprendszer+alapbeállítások
- https://www.raspberrypi.org/downloads/	//Raspberry os lite gui nélkül 
- https://www.youtube.com/watch?v=y5SOuBOy2ZQ
- Jelszó változtatás
- Név változtatás
- SSH engedélyezés
- ssh pi@192.168.1.xxx 	//Távoli kapcsolódás terminálból

Programok telepítése
- sudo apt-get update	 //alap command készletet frissíti
- sudo curl -o- -L https://yarnpkg.com/install.sh | bash 		//felrakja a Yarn környezetet
- yarn upgrade--latest 	//frissíti a yarn környezetet a legfrissebbre
- curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash //??
- nvm install --lts 	//felrakja az NVM környezetet
- sudo apt install git-all  //Githez szükséges parancs környezetet rakja fel

Verziók lekérdezése
- yarn -v  
- nvm -v
- npm -v
- node -v

Mappa létrhozás és feltöltés és git clone-al
- mkdir Development		//Csinál egy Development mappát
- cd Development	//belép a Development mappába

Git parancsok
- git clone https://github.com/jorgibravo/ttt-iot-xmas.git	//lemásolja Githubrol a repot
- git branch	//melyik branchben vagyok
- git pull	//frissiti a branch tartalmát
- git checkout peti	//átvált a Peti branchre

Futtatás
- cd Development	//ha nem ott vagyok akkor belép a developmentbe
- cd ttt-iot-xmas	//ha nem ott vagyok akkor belép a ttt-iot-xmasbe
- sudo node Development/ttt-iot-xmas/main/index.js -d //egyből a mappából indítja
- yarn install
- yarn build
- yarn start
- sudo node ./main/index.js

Startupkor indítás
- crontab -e //elindítja az ütenetés szerkesztőt
- @reboot sudo /usr/local/bin/node Development/ttt-iot-xmas/main/index.js & //ez indítja el
- ctrl x//kilépés, mentés

Github commit
- Cerzuzával edit
- Alul commit gomb


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
