var http = require("http");
var fs = require("fs");
http
  .createServer(function (req, res) {
    // Check the URL of the current request
    if (req.url == "/") {
      fs.readFile("samplenode.html", function (err, data) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end();
      });
    }

    if (req.url == "/login") {
      fs.readFile("login.html", function (err, data) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
        return res.end();
      });
    }
  })
  .listen(8881);

// https://www.geeksforgeeks.org/node-js-web-server/

// node .\httpServer.js