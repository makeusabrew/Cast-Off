var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var mime = require("./modules/mime");
var io = require("socket.io");

var WEBROOT = process.cwd()+"/../public";
var TEST_WEBROOT = process.cwd()+"/../tests/public";

var server = http.createServer(function(request, response) {
    var cUrl = url.parse(request.url).pathname;

    switch (cUrl) {
        case '/':
            fs.readFile(WEBROOT+"/index.html", function(e, file) {
                response.writeHead(200, {'Content-Type':'text/html'});
                response.write(file);
                response.end();
            });
            break;
        default:
            if (cUrl.match(/tests/i)) {
                // test stuff has a different directory prefix 
                var cUrl = cUrl.substr(6);
                var filename = path.join(TEST_WEBROOT, cUrl);
            } else {
                // try and match static stuff in /public
                var filename = path.join(WEBROOT, cUrl);
            }
            path.exists(filename, function(exists) {
                if (!exists) {
                    console.log("sending 404 for URL", cUrl);
                    response.writeHead(404, {'Content-Type':'text/html'});
                    response.write("Sorry, that page could not be found");
                    response.end();
                    return;
                }
                fs.readFile(filename, function (e, file) {
                    if (e) {
                        throw e;
                    }
                    response.writeHead(200, {
                        'Content-Length' : file.length,
                        'Content-Type' : mime.getType(filename)
                    });
                    response.write(file);
                    response.end();
                });
            });
            break;
    }
});

server.listen(8124);

console.log("Server running on port 8124");

var socket = io.listen(server);


// load the map data once only
var world = require("./game/world.js").factory();
var map = world.loadMap();

socket.on("connection", function(sClient) {
    var client = require("./game/client.js").factory(sClient.sessionId);
    client.spawn(world);
    world.addClient(client);
    
    //@todo we've now created duplication here by including ourselves
    // in getEntities and calling getData - needs refactoring
    var entities = world.getEntities();
    var data = client.getData(); 
    var msg = {
        type: 'START',
        world: map,
        cData: data,
        entities: entities
    };
    sClient.send(JSON.stringify(msg));

    // now broadcast to existing clients with new entity position
    var msg = {
        type: 'NEW_CLIENT',
        cData: data
    };
    sClient.broadcast(JSON.stringify(msg));
    sClient.on("message", function(msg) {
        var msg = JSON.parse(msg);
        switch (msg.type) {
            case 'MOVE':
                // wait a tick, in theory we've already got the client object, right?
                //var client = world.getClientBySessionId(sClient.sessionId);
                console.log("client", client.sessionId, "moved");
                client.moveTo(msg.pos);
                var retMsg = {
                    type: 'MOVE',
                    cData: client.getData()
                };
                sClient.broadcast(JSON.stringify(retMsg));
                break;
            default:
                console.log("unhandled client message", msg.type);
                break;
        }
    });
    sClient.on("disconnect", function() {
        world.removeClient(client);
        //@todo broadcast? or does ^^ take care of that?
    });
});
