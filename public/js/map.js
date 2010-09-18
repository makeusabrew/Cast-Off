var Map = {

    buffer: null,

    clients: [],

    setBuffer: function(elem) {
        Map.buffer = Utils.getBuffer(elem);
    },

    registerClient: function(client) {
        Map.clients.push(client);
    },

    render: function() {
        //back buffer
        Map.buffer.fillStyle = "rgb(0, 0, 200)";
        Map.buffer.fillRect(0, 0, 100, 100);
        
        // render map
        Map.buffer.fillStyle = "rgb(255, 255, 0)";
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                var cells = World.getCells();
                if (cells[j][i]) {
                    Map.buffer.fillRect(i*10, j*10, 10, 10);
                }
            }
        }

        for (var i = 0; i < Map.clients.length; i++) {
            Map.buffer.fillStyle = "rgb(255, 0, 0)";
            Map.buffer.fillRect(Map.clients[i].x, Map.clients[i].y, 2, 2);
        }
    }
}
