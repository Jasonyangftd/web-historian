var path = require('path');
var urlParser = require('url');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var parsedUrl = urlParser.parse(req.url);
  console.log(parsedUrl);
  if (req.method === 'GET') {
    // if requested site is '/'
    if (parsedUrl.pathname === '/') {
      archive.renderFile(path.join(__dirname, 'public', 'index.html'), res);
    } else {
      // serve static asset in sites folder
      // check the url to see if it's a valid url
      archive.readListOfUrls(function (websites) {
        var sites = websites.split('\n');
        var included =
          archive.isUrlInList(parsedUrl.pathname.substr(1), sites);
        if (!included) {
          archive.addUrlToList(parsedUrl.pathname.substr(1));
        } else {
          archive
            .renderFile(path.join(__dirname, '../', 'archives', 'sites', parsedUrl.pathname.substr(1)), res);
        }
      });
    }
  } else {
    archive.readListOfUrls(function (websites) {
      var sites = websites.split('\n');
      var tempUrl = req._postData.url;
      console.log(parsedUrl);
      var included = archive.isUrlInList(tempUrl, sites);
      if (included === -1) {
        console.log('url needs to be added');
        archive.addUrlToList(tempUrl);
      } else {
        console.log('url is already in the list');
        archive
          .renderFile(path.join(__dirname, '../', 'archives', 'sites', tempUrl), res);
      }
      console.log('sites', sites);
      console.log('tempUrl', tempUrl);
      console.log('included?', included);
    });
  }
};
