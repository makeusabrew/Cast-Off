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
        console.log(Map.buffer);
    },

    registerClient: function(client) {
        Map.clients.push(client);
    },

    render: function() {
        //back buffer
        Map.buffer.fillStyle = "rgb(0, 0, 200)";
        Map.buffer.fillRect(0, 0, Map.buffer.canvas.clientWidth, Map.buffer.canvas.clientHeight);
        
        // render map
        var blockSize = Globals.World.BLOCK_SIZE * Globals.Map.SCALE;
        var cells = World.getCells();
        Map.buffer.fillStyle = "rgb(255, 255, 0)";
        for (var y = 0; y < World.getHeight(); y++) {
            for (var x = 0; x < World.getWidth(); x++) {
                if (cells[y][x]) {
                    Map.buffer.fillRect(x*blockSize, y*blockSize, blockSize, blockSize);
                }
            }
        }

        for (var i = 0; i < Map.clients.length; i++) {
            var x = Map.clients[i].x * Globals.Map.SCALE;
            var y = Map.clients[i].y * Globals.Map.SCALE;

            Map.buffer.fillStyle = "rgb(255, 0, 0)";
            Map.buffer.fillRect(x-1, y-1, 2, 2);
        }
    }
}
