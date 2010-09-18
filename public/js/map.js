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
            var accuracy = 8;   // lower = better
            for (var j = 0; j < Client.buffer.getWidth(); j+= accuracy) {
                if (cAngle < 0) {
                    cAngle += 360;
                } else if (cAngle >= 360) {
                    cAngle -= 360;
                }

                var dist = Client.castRay(cAngle);
                var px = Client.x + Utils.cos(cAngle) * dist;
                var py = Client.y + Utils.sin(cAngle) * dist;
                Map.buffer.line(Client.x * Globals.Map.SCALE, Client.y * Globals.Map.SCALE, px * Globals.Map.SCALE, py * Globals.Map.SCALE, "rgb(255, 128, 64)");
                cAngle += (Client.viewport.col_width*accuracy);
            }
        }
    }
}
