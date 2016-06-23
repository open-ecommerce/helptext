Project Based in Yii2, Phundament4, zurbfundation, jacmoe zubified

helptext
This project is intended as a live, working pilot for a platform to empower existing non-profit helplines by providing access and management of mobile text and other emerging ways of communication. The platform will allow integration with their existing systems as well as upgrade, to enable them to keep-up and transfer their standards, knowledge and skills with ease.




# Installation
## Prerequisites
Before you start, make sure you have installed [composer](https://getcomposer.org/) and [Node.js](http://nodejs.org/).
If you are on Debian or Ubuntu you might also want to install the [libnotify-bin](https://packages.debian.org/jessie/libnotify-bin) package, which is used by Gulp to inform you about its status.

### Gulp
install gulp globally if you haven't done so before

```
npm install -g gulp-cli
```
### Browsersync
install browsersync globally if you haven't done so before

```
npm install -g browser-sync
```
## Composer
```
composer global require "fxp/composer-asset-plugin:~1.1.1"
composer update
```

## Post-installation

initialize the application, choose "development"
```
./init
```

### Post-installation
Install the node modules by running this command at the project root directory:
```
npm install
```
After a successful install, build the project using:
```
gulp build
```

To launch a browser window and watch the project for changes:
~~~
gulp
~~~

To build optimized for production (minification, etc) specify the `production` flag:

~~~
gulp build --production
~~~
and/or
~~~
gulp --production
~~~







