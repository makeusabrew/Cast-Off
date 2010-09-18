var Map = {

    buffer: null,

    clients: [],

    setBuffer: function(elem) {
        var bWidth = (World.getWidth() * Globals.World.BLOCK_SIZE) * Globals.Map.SCALE;
        var bHeight = (World.getHeight() * Globals.World.BLOCK_SIZE) * Globals.Map.SCALE;
        console.log("map size", bWidth, "x", bHeight);
        $("#"+elem).attr("width", bWidth);
        $("#"+elem).attr("height", bHeight);
        Map.buffer = Utils.getBuffer(elem);
    },

    registerClient: function(client) {
        Map.clients.push(client);
    },

    render: function() {
        //back buffer
        Map.buffer.fillRect(0, 0, Map.buffer.getWidth(), Map.buffer.getHeight(), "rgb(0, 0, 0)");
        
        // render map
        var blockSize = Globals.World.BLOCK_SIZE * Globals.Map.SCALE;
        var cells = World.getCells();
        for (var y = 0; y < World.getHeight(); y++) {
            Map.buffer.line(0+0.5, y*blockSize+0.5, Map.buffer.getWidth(), y*blockSize, "rgb(100, 100, 100)");
            for (var x = 0; x < World.getWidth(); x++) {
                if (y == 0) {
                    Map.buffer.line(x*blockSize+0.5, 0+0.5, x*blockSize, Map.buffer.getHeight(), "rgb(100, 100, 100)");
                }
                if (cells[y][x]) {
                    Map.buffer.fillRect(x*blockSize, y*blockSize, blockSize, blockSize, "rgb(255, 255, 0)");
                }
            }
        }

        for (var i = 0; i < Map.clients.length; i++) {
            var x = Map.clients[i].x * Globals.Map.SCALE;
            var y = Map.clients[i].y * Globals.Map.SCALE;

            Map.buffer.fillRect(x-1, y-1, 2, 2, "rgb(255, 0, 0)");
            

            /********************************************
            *
            ********************************************/
            var Client = Map.clients[i];
            var cAngle = Client.a - (Client.viewport.fov / 2);
            var cells = World.getCells();
            var accuracy = 4;   // lower = better
            for (var j = 0; j < Client.buffer.getWidth(); j+= accuracy) {
                if (cAngle < 0) {
                    cAngle += 360;
                } else if (cAngle >= 360) {
                    cAngle -= 360;
                }

                var dlen = 50 * Globals.Map.SCALE;
                var dx = x + (Utils.cos(cAngle) * dlen);
                var dy = y + (Utils.sin(cAngle) * dlen);

                Map.buffer.line(x, y, dx, dy, "rgb(255, 0, 0)");
                var cY = 0;
                var cX = 0;
                var Ya = 0;
                var Xa = 0;
                var possible = true;
                var horzDist = 0;
                var vertDist = 0;
                if (cAngle > 180 && cAngle < 360) {
                    cY = (Math.floor(Client.y / Globals.World.BLOCK_SIZE) * Globals.World.BLOCK_SIZE) - 1;
                    Ya = -Globals.World.BLOCK_SIZE; 
                    cX = Client.x - (Client.y - cY) / Utils.tan(cAngle);
                    Xa = -Globals.World.BLOCK_SIZE / Utils.tan(cAngle);
                } else if (cAngle > 0 && cAngle < 180) {
                    cY = (Math.floor(Client.y / Globals.World.BLOCK_SIZE) * Globals.World.BLOCK_SIZE) + Globals.World.BLOCK_SIZE;
                    Ya = Globals.World.BLOCK_SIZE; 
                    cX = Client.x - (Client.y - cY) / Utils.tan(cAngle);
                    Xa = Globals.World.BLOCK_SIZE / Utils.tan(cAngle);
                } else if (cAngle == 0 || cAngle == 180) {
                    possible = false;
                    horzDist = 999999999999;
                }
                while (possible) {
                    Map.buffer.pixel(cX* Globals.Map.SCALE, cY * Globals.Map.SCALE, "rgb(0, 255, 0)");
                    var gX = Math.floor(cX / Globals.World.BLOCK_SIZE);
                    var gY = Math.floor(cY / Globals.World.BLOCK_SIZE);
                    if (gX < 0 || gX >= World.getWidth() || gY < 0 || gY >= World.getHeight() || cells[gY][gX] != 0) {
                        var dx = cX - Client.x;
                        var dy = cY - Client.y;
                        horzDist = Math.sqrt(dx*dx + dy*dy);
                        break;
                    }
                    cX += Xa;
                    cY += Ya;
                }
                cY = 0;
                cX = 0;
                Ya = 0;
                Xa = 0;
                possible = true;
                if (cAngle > 90 && cAngle < 270) {
                    cX = (Math.floor(Client.x / Globals.World.BLOCK_SIZE) * Globals.World.BLOCK_SIZE) - 1;
                    Xa = -Globals.World.BLOCK_SIZE;
                    cY = Client.y - (Client.x - cX) * Utils.tan(cAngle);
                    Ya = -Globals.World.BLOCK_SIZE * Utils.tan(cAngle);
                } else if ((cAngle > 270 && cAngle < 360) || (cAngle > 0 && cAngle < 90)) {
                    cX = (Math.floor(Client.x / Globals.World.BLOCK_SIZE) * Globals.World.BLOCK_SIZE) + Globals.World.BLOCK_SIZE;
                    Xa = Globals.World.BLOCK_SIZE;
                    cY = Client.y - (Client.x - cX) * Utils.tan(cAngle);
                    Ya = Globals.World.BLOCK_SIZE * Utils.tan(cAngle);
                } else if (cAngle == 90 || cAngle == 270) {
                    possible = false;
                    vertDist = 9999999999999;
                }

                while (possible) {
                    Map.buffer.pixel(cX* Globals.Map.SCALE, cY * Globals.Map.SCALE, "rgb(0, 0, 255)");
                    var gX = Math.floor(cX / Globals.World.BLOCK_SIZE);
                    var gY = Math.floor(cY / Globals.World.BLOCK_SIZE);
                    if (gX < 0 || gX >= World.getWidth() || gY < 0 || gY >= World.getHeight() || cells[gY][gX] != 0) {
                        var dx = cX - Client.x;
                        var dy = cY - Client.y;
                        vertDist = Math.sqrt(dx*dx + dy*dy);
                        break;
                    }
                    cX += Xa;
                    cY += Ya;
                }
                var dist = horzDist < vertDist ? horzDist : vertDist;
                var px = Client.x + Utils.cos(cAngle) * dist;
                var py = Client.y + Utils.sin(cAngle) * dist;
                Map.buffer.line(Client.x * Globals.Map.SCALE, Client.y * Globals.Map.SCALE, px * Globals.Map.SCALE, py * Globals.Map.SCALE, "rgb(255, 128, 64)");
                cAngle += (Client.viewport.col_width*accuracy);
            }
        }
    }
}
