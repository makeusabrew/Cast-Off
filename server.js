var http = require("http");
var url = require("url");

http.createServer(function(request, response) {
    var cUrl = url.parse(request.url).pathname;
    switch (cUrl) {
        case '/':
            response.writeHead(200, {'Content-Type':'text/html'});
            response.write("Hello World");
            response.end();
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
