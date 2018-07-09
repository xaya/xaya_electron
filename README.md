[![License](http://img.shields.io/badge/Licence-MIT-brightgreen.svg)](LICENSE.md)

# Introduction

Uses angular + electron to build the wallet


## Getting Started

Clone this repository locally :

``` bash
git clone https://github.com/xaya/xaya.git
```

Install dependencies with npm :

``` bash
npm install
```

There is an issue with `yarn` and `node_modules` that are only used in electron on the backend when the application is built by the packager. Please use `npm` as dependencies manager.


If you want to generate Angular components with Angular-cli , you **MUST** install `@angular/cli` in npm global context.  
Please follow [Angular-cli documentation](https://github.com/angular/angular-cli) if you had installed a previous version of `angular-cli`.

``` bash
npm install -g @angular/cli
```

## To build for development

- **in a terminal window** -> npm start  

## Manage your environment variables

- Using local variables :  `npm start` or `cross-env ENV=local npm start`
- Using development variables :  `cross-env ENV=dev npm start`
- Using production variables  :  `cross-env ENV=prod npm start`

## Included Commands

|Command|Description|
|--|--|
|`npm run ng:serve`| Execute the app in the browser |
|`npm run build`| Build the app. Your built files are in the /dist folder. |
|`npm run build:prod`| Build the app with Angular aot. Your built files are in the /dist folder. |
|`npm run electron:local`| Builds your application and start electron
|`npm run electron:linux`| Builds your application and creates an app consumable on linux system |
|`npm run electron:windows`| On a Windows OS, builds your application and creates an app consumable in windows 32/64 bit systems |
|`npm run electron:mac`|  On a MAC OS, builds your application and generates a `.app` file of your application that can be run on Mac |


## Daemon

Place daemon into "daemon" folder before running or building
Daemon parameters are hardcoded mostly, tho you can still create *.conf file manually if you are advanced user

## Webpack

Webpack is configured inside angular-cli.json on the high-level
Or inside ngw.config.ts for low-level injections
Do not 'ng eject', as this will break the angular-cli
Please not that 'ngw' is used in package.json for that purpose instead of 'ng'

## HOW TO DEVELOP WALLET
Its basically build in top of angular-electron boilerplate
Develop GUI as simple angular application inside 'app' folder
Daemon stuff communication is done via 'global.service.ts', its based on
bitcoin-core node, which you simply expand with new functions, as shown iside 'global.service.ts'
src/main.ts is entry point, if you want to alter anything related to electron window