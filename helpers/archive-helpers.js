var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http-request');
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

exports.renderFile = function (file, res, statusCode) {
  fs.readFile(file, {encoding: 'utf8'}, function (err, html) {
    if (err) {
      res.writeHead(statusCode, helpers.headers);
      res.end();
    } else {
      res.writeHead(statusCode, helpers.headers);
      res.end(html);
    }
  });
};

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, {encoding: 'utf8'}, function (err, websites) {
    if (!err) {
      return callback(websites.split('\n'));
    }
  });
};

exports.isUrlInList = function(url, sites){
  return sites.indexOf(url);
};

exports.addUrlToList = function(url, callback){
  console.log('----url is ', url);
  fs.appendFile(exports.paths.list, url+'\n', function (err) {
    if (err){
      console.log('Error happened');
    } else {
      return callback(url);
    }
  });
};

exports.isURLArchived = function(url, callback){
  fs.readdir(exports.paths.archivedSites, function(err, files){
    // console.log('url', url, 'files', files);
    return callback(exports.isUrlInList(url, files));
  });
};

exports.downloadUrls = function(url){
  // if (url.match('.com')) {
    // console.log('----url is----', url);
    http.get(url, function (err, html) {
      if (!err) {
        // console.log('no error');
        var text = html.buffer.toString();
        fs.appendFile(path.join(exports.paths.archivedSites, url), text, function (err) {
          if (err) {
            // console.log('error happened.');
          } else {
            console.log('File was saved!');
          }
        });
      } else {
        // console.log('you have an err');
      }
    });
  // }
};
