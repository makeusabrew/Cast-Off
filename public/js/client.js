//@todo split out Client / Player?
var Client = {
    x: 280,
    y: 230,
    a: 0.0,
    health: 0,

    // movement. @todo this needs serious improvement!
    forwards: false,
    backwards: false,
    left: false,
    right: false,

    buffer: null,
    viewport: {
    },

    init: function() {
        $(window).keydown(function(e) {
            e.preventDefault();
            var key = e.which;
            switch (key) {
                case Utils.keys.UP_ARROW:
                    Client.forwards = true;
                    Client.backwards = false;
                    break;

                case Utils.keys.DOWN_ARROW:
                    Client.forwards = false;
                    Client.backwards = true;
                    break;

                case Utils.keys.LEFT_ARROW:
                    Client.left = true;
                    Client.right = false;
                    break;

                case Utils.keys.RIGHT_ARROW:
                    Client.left = false;
                    Client.right = true;
                    break;
                default:
                    break;
            }
        });

        $(window).keyup(function(e) {
            e.preventDefault();
            var key = e.which;
            switch (key) {
                case Utils.keys.UP_ARROW:
                    Client.forwards = false;
                    break;

                case Utils.keys.DOWN_ARROW:
                    Client.backwards = false;
                    break;

                case Utils.keys.LEFT_ARROW:
                    Client.left = false;
                    break;

                case Utils.keys.RIGHT_ARROW:
                    Client.right = false;
                    break;
                default:
                    break;
            }
        });
    },

    setBuffer: function(elem) {
        Client.buffer = Utils.getBuffer(elem);
    },

    setViewport: function(options) {
        Client.viewport = options;
        
        // derived settings
        // see http://www.permadi.com/tutorial/raycast/rayc5.html
        Client.viewport.col_width = options.fov / options.width;
        Client.viewport.distance = (options.width / 2) / Utils.tan(options.fov / 2);
        console.log("Viewport", Client.viewport);
    },

    spawn: function() {
        health = 100;
        //@todo random X not in a block
        //@todo random Y not in a block
        //@todo semi random angle - but not directly facing a wall!
    },

    processInput: function() {
        if (Client.forwards || Client.backwards) {
            // both essentially the same, just need to set a direction
            var dir = Client.forwards ? 1 : -1;
            Client.x += Utils.cos(Client.a) * (Globals.Client.MOVE_SPEED * dir);
            Client.y += Utils.sin(Client.a) * (Globals.Client.MOVE_SPEED * dir);
        }

        if (Client.right || Client.left) {
            var dir = Client.right ? 1 : - 1;
            Client.a += (Globals.Client.TURN_SPEED * dir);
            if (Client.a >= 360) {
                Client.a -= 360;
            } else if (Client.a < 0) {
                Client.a += 360;
            }
        }


    },

    tick: function() {
        //
    },

    render: function() {
        //back buffer
        Client.buffer.fillRect(0, 0, Client.buffer.getWidth(), Client.buffer.getHeight());

        //@todo camera object here?
        //@todo better way of dealing with camera (pos, angle), world (what to render)
        //and surfaces (e.g. buffer)
        var cAngle = Client.a - (Client.viewport.fov / 2.0);
        for (var i = 0; i < Client.buffer.getWidth(); i++) {
            // cast ray
            //castRay(cAngle);
            cAngle += Client.viewport.col_width;
        }
    }
};
