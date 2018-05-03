
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


module.exports = {fs,assert,opn,path,wd,pkg,diffImage,browser,initWebSiteURL};