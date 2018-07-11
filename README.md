[![License](http://img.shields.io/badge/Licence-MIT-brightgreen.svg)](LICENSE.md
)

# Introduction

The XAYA wallet uses Angular and Electron to build the wallet.


## Getting Started

Clone this repository locally:

``` bash
git clone https://github.com/xaya/xaya_electron.git
```

Install dependencies with npm :

``` bash
npm install
```

There is an issue with `yarn` and `node_modules` that are only used in Electron 
on the backend when the application is built by the packager. Please use `npm` 
as the dependencies manager.

``` bash
npm install -g @angular/cli
```

## To build for development

- **In a terminal window** -> npm start  

## Manage your environment variables

- Using local variables:  `npm start` or `cross-env ENV=local npm start`
- Using development variables:  `cross-env ENV=dev npm start`
- Using production variables:  `cross-env ENV=prod npm start`

## Included Commands

|Command|Description|
|--|--|
|`npm run ng:serve`| Execute the app in the browser. |
|`npm run build`| Build the app. Your built files are in the /dist folder. |
|`npm run build:prod`| Build the app with Angular aot. Your built files are in 
the /dist folder. |
|`npm run electron:local`| Builds your application and starts Electron.
|`npm run electron:linux`| Builds your application and creates an app consumable 
on a Linux system. |
|`npm run electron:windows`| On a Windows OS, builds your application and 
creates an app consumable in Windows 32- and 64-bit systems. |
|`npm run electron:mac`|  On a MAC OS, i.e. OS X, builds your application and 
generates a `.app` file of your application that can be run on OS X. |


## Daemon

Place the daemon into the "daemon" folder before running or building.
The daemon parameters are mostly hardcoded, although advanced users can still 
create *.conf file manually.

## Webpack

Webpack is configured inside angular-cli.json at a high-level 
or inside ngw.config.ts for low-level injections.
Do not use 'ng eject', as this will break angular-cli.
Note that 'ngw' is used in package.json for that purpose instead of 'ng'.

## HOW TO DEVELOP WALLET
It's basically built on top of an Angular-Electron boilerplate.
You can develop the GUI as a simple Angular application inside the 'app' folder.
The daemon communication is done via 'global.service.ts'. It's based on
the bitcoin-core node, which you simply expand with new functions, as shown in 
'global.service.ts'.
The main entry point is src/main.ts, if you want to alter anything related to 
the Electron window.