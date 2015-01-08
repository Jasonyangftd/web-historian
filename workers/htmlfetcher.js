// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http-request');
var helpers = require('../web/http-helpers');

paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

var readListOfUrls = function (callback){
  fs.readFile(paths.list, {encoding: 'utf8'}, function (err, websites) {
    return callback(websites);
  });
}
