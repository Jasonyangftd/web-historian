var path = require('path');
var urlParser = require('url');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
// !== '/alblc'

exports.handleRequest = function (req, res) {
  var parsedUrl = urlParser.parse(req.url);
  // console.log(parsedUrl);
  if (req.method === 'GET') {
    // if requested site is '/'
    if (parsedUrl.pathname === '/') {
      archive.renderFile(path.join(__dirname, 'public', 'index.html'), res, 200);
    } else {
      archive.readListOfUrls(function (websites) {
        var sites = websites;
        var site = sites[sites.indexOf(parsedUrl.pathname.substr(1))];
        var included = archive.isUrlInList(parsedUrl.pathname.substr(1), sites);
        if (included < 0) {
          archive.addUrlToList(parsedUrl.pathname.substr(1), function (site) {
            archive.isURLArchived(site, function (result) {
              if (result >= 0) {
                archive.renderFile(path.join(__dirname, '../', 'archives', 'sites', site), res, 200);
              } else {
                archive.downloadUrls(site);
                res.writeHead(404);
                res.end();
              }
            });
          });
        } else {
          archive.renderFile(path.join(__dirname, '../', 'archives', 'sites', parsedUrl.pathname.substr(1)), res, 200);
        }
      });
    }
  } else {
    archive.readListOfUrls(function (websites) {
      var dataParams = '';
      req.on('data', function (chunk) { dataParams += chunk.toString(); });
      req.on('end', function () {
        var sites = websites;
        var site = sites[sites.indexOf(dataParams.substr(4))];
        var requestedUrl = dataParams.substr(4); // requested url
        var included = archive.isUrlInList(requestedUrl, sites);
        if (included < 0) {
          archive.addUrlToList(dataParams.substr(4), function (site) {
            archive.isURLArchived(site, function (result) {
              if (result >= 0) {
                archive.renderFile(path.join(__dirname, '../', 'archives', 'sites', site), res, 302);
              } else {
                console.log('-----------', site);
                archive.downloadUrls(site);
                archive.renderFile(path.join(__dirname, '../', 'archives', 'sites', site), res, 302);
              }
            });
          });
        } else {
          archive.renderFile(path.join(__dirname, '../', 'archives', 'sites', dataParams.substr(4)), res, 200);
        }
      });
    });
  }
};
