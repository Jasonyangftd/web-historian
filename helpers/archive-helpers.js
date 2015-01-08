var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var helpers = require('../web/http-helpers');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.renderFile = function (file, res) {
  fs.readFile(file, {encoding: 'utf8'}, function (err, html) {
    res._responseCode = 200;
    res._headers = helpers.headers;
    res._data = html;
    res.writeHead(res._responseCode, res._headers);
    res.end(res._data);
  });
};

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, {encoding: 'utf8'}, function (err, websites) {
    return callback(websites);
  });
};

exports.isUrlInList = function(url, sites){
  return sites.indexOf(url);
};

exports.addUrlToList = function(url){
  fs.appendFile(exports.paths.list, url, function (err) {
    console.log(url)
    if (err) console.log('Error happened');
    console.log('The "data to append" was appended to file!');
  });
};

exports.isURLArchived = function(){
};

exports.downloadUrls = function(){
};
