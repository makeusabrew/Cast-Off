var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");
var mime = require("./modules/mime");
var io = require("socket.io");
var Globals = require("../public/js/globals").getObject();

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

var io = io.listen(server);


// load the map data once only
var world = require("./game/world.js").factory();
world.loadMap();

io.sockets.on("connection", function(sClient) {
    var client = require("./game/client").factory(sClient.id);
    /**
     *
     * from here we only want to be dealing with client rather than sClient
     * unless dealing with socket stuff. all game logic should deal with client!
     */
    client.spawn(world);
    world.addClient(client);
    
    //@todo we've now created duplication here by including ourselves
    // in getEntities and calling getData - needs refactoring
    var entities = world.getEntities();
    var data = client.getData(); 
    var msg = {
        type: 'START',
        world: world.getMap(),
        cData: data,
        entities: entities
    };
    sClient.send(JSON.stringify(msg));

    // now broadcast to existing clients with new entity position
    var msg = {
        type: 'NEW_CLIENT',
        cData: data
    };
    sClient.emit(JSON.stringify(msg));
    sClient.on("message", function(msg) {
        var msg = JSON.parse(msg);
        switch (msg.type) {
            case 'MOVE':
                client.moveTo(msg.pos);
                var retMsg = {
                    type: 'MOVE',
                    cData: client.getData()
                };
                sClient.emit(JSON.stringify(retMsg));
                break;
            case 'FIRE':
                var bullet = require("./game/bullet").factory(client.getId());
                bullet.spawn(msg.pos);
                world.addBullet(bullet);
                console.log("client", client.getId(), "fired!");

                // NOTE that we use socket.broadcast NOT sClient.broadcast
                // this is because we want to broadcast the shot to *everyone*
                io.sockets.emit(JSON.stringify({
                    type:'FIRE',
                    bData: bullet.getData()
                }));
                break;
            default:
                console.log("unhandled client message", msg.type);
                break;
        }
    });
    sClient.on("disconnect", function() {
        world.removeClient(client);
        var msg = {
            type: 'DISCONNECT',
            id: sClient.id
        };
        sClient.emit(JSON.stringify(msg));
    });
});
