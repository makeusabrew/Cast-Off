//@todo split out Client / Player?
var Client = {
    x: 0,
    y: 0,
    a: 0.0,
    health: 0,

    buffer: null,
    viewport: {
    },

    setBuffer: function(elem) {
        var elem = document.getElementById(elem);
        if (!elem.getContext) {
            Client.buffer = null;
            throw 'Canvas not available';
        }

        Client.buffer = elem.getContext("2d");
    },

    setViewport: function(options) {
        Client.viewport = options;
        
        // derived settings
        // see http://www.permadi.com/tutorial/raycast/rayc5.html
        Client.viewport.col_width = options.fov / options.width;
        Client.viewport.distance = (options.width / 2) / Math.tan(Utils.deg2rad(options.fov / 2));
        console.log("Viewport", Client.viewport);
    },

    spawn: function() {
        health = 100;
    },

    processInput: function() {
        //
    },

    tick: function() {
        //
    },

    render: function() {
        //back buffer
        Client.buffer.fillStyle = "rgb(0, 0, 0)";
        Client.buffer.fillRect(0, 0, 640, 480);

        //@todo camera object here?
        //@todo better way of dealing with camera (pos, angle), world (what to render)
        //and surfaces (e.g. buffer)

        // render map
        Client.buffer.fillStyle = "rgb(255, 255, 255)";
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                var cells = World.getCells();
                if (cells[j][i]) {
                    Client.buffer.fillRect(i*10, j*10, 10, 10);
                }
            }
        }
    }
};

