var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");

http.createServer(function(request, response) {
    var cUrl = url.parse(request.url).pathname;
    switch (cUrl) {
        case '/':
            fs.readFile(process.cwd()+"/index.html", function(err, file) {
                response.writeHead(200, {'Content-Type':'text/html'});
                response.write(file, "binary");
                response.end();
            });
            break;
        case '/js/client.js':
            fs.readFile(process.cwd()+"/js/client.js", function(err, file) {
                response.writeHead(200, {'Content-Type':'text/javascript'});
                response.write(file, "binary");
                response.end();
            });
            break;
        default:
            console.log("sending 404 for URL", cUrl);
            response.writeHead(404, {'Content-Type':'text/html'});
            response.write("Sorry, that page could not be found");
            response.end();
            break;
    }
}).listen(8124);

console.log("Server running on port 8124");
