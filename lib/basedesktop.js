
'use strict';
debugger;
const fs = require('fs');
const {
  assert
} = require('chai');
const {
  opn
} = require('macaca-utils');
const path = require('path');
const moment = require('moment');
const KEY_MAP = require('webdriver-keycode');

const pkg = require('../package');

 const wd = require('macaca-wd');
 require('./wd-extend')(wd, false);


const diffImage = require('./utils.js').diffImage;

var browser = process.env.browser || 'electron' || 'puppeteer';
browser = browser.toLowerCase();
//

function initWebSiteURL(host,port){
var driver = wd.promiseChainRemote({
    host: host,
    port: process.env.MACACA_SERVER_PORT || 3456
  });
	return driver;
}


module.exports = {fs,assert,opn,path,moment,KEY_MAP,wd,pkg,diffImage,browser,initWebSiteURL};