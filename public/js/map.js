var Map = {

    buffer: null,

    entities: [],

    setBuffer: function(elem) {
        var bWidth = (World.getWidth() * Globals.World.BLOCK_SIZE) * Globals.Map.SCALE;
        var bHeight = (World.getHeight() * Globals.World.BLOCK_SIZE) * Globals.Map.SCALE;
        console.log("map size", bWidth, "x", bHeight);
        $("#"+elem).attr("width", bWidth);
        $("#"+elem).attr("height", bHeight);
        Map.buffer = Utils.getBuffer(elem);
    },

    addEntity: function(e) {
        // we expect this to be an Entity() object
        this.entities.push(e);
    },

    getEntities: function(type) {
        if (typeof type == "undefined") {
            return Map.entities;
        }
        var _entities = [];
        for (var i = 0; i < Map.entities.length; i++) {
            if (Map.entities[i].type == type) {
                _entities.push(Map.entities[i]);
            }
        }
        return _entities;
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

        var clients = Map.getEntities("CLIENT");
        for (var i = 0; i < clients.length; i++) {
            var x = clients[i].x * Globals.Map.SCALE;
            var y = clients[i].y * Globals.Map.SCALE;

            Map.buffer.fillRect(x-1, y-1, 2, 2, "rgb(255, 0, 0)");
            

            var client = clients[i];

            var cAngle = client.a - (Client.viewport.fov / 2);
            var accuracy = Globals.Map.CAST_ACCURACY; 
            for (var j = 0; j < Client.buffer.getWidth(); j+= accuracy) {
                if (cAngle < 0) {
                    cAngle += 360;
                } else if (cAngle >= 360) {
                    cAngle -= 360;
                }

                var ray = Client.castRay(client.x, client.y, cAngle);
                var dist = ray.dist;
                var px = client.x + Utils.cos(cAngle) * dist;
                var py = client.y + Utils.sin(cAngle) * dist;
                var colour = "";
                if (ray.vertical) {
                    colour = "rgb(255, 128, 64)";
                } else {
                    colour = "rgb(64, 128, 255)";
                }
                Map.buffer.line(client.x * Globals.Map.SCALE, client.y * Globals.Map.SCALE, px * Globals.Map.SCALE, py * Globals.Map.SCALE, colour);
                cAngle += (Client.viewport.col_width*accuracy);
            }
        }
    }
}
