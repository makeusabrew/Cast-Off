//@todo split out Client / Player?
var Client = {
    x: 0,
    y: 0,
    a: 0.0,
    health: 0,

    // movement. @todo this needs serious improvement!
    forwards: false,
    backwards: false,
    left: false,
    right: false,

    buffer: null,
    ws: null,

    world: null, // a reference to the world. could remove...

    viewport: {
    },

    init: function() {
        Client._bindKeys();
        Client._bindSockets();
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

    spawn: function(pos) {
        health = 100;
        Client.x = pos.x;
        Client.y = pos.y;
        Client.a = pos.a;
        console.log("spawned at x", Client.x, "y", Client.y, "a", Client.a);
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
        Client.buffer.fillRect(0, 0, Client.buffer.getWidth(), Client.buffer.getHeight(), "rgb(0,0,0)");
        
        // sky (ahem)
        Client.buffer.fillRect(0, 0, Client.buffer.getWidth(), Client.buffer.getHeight()/2, "rgb(200, 200, 200)");
        // floor (ahem)
        Client.buffer.fillRect(0, Client.buffer.getHeight()/2, Client.buffer.getWidth(), Client.buffer.getHeight()/2, "rgb(100, 100, 100)");
        //@todo camera object here?
        //@todo better way of dealing with camera (pos, angle), world (what to render)
        //and surfaces (e.g. buffer)
        var cAngle = Client.a - (Client.viewport.fov / 2.0);
        for (var i = 0; i < Client.buffer.getWidth(); i++) {
            if (cAngle < 0) {
                cAngle += 360;
            } else if (cAngle >= 360) {
                cAngle -= 360;
            }
            var ray = Client.castRay(cAngle);
            var dist = ray.dist;
            dist *= Utils.cos(Client.a - cAngle);
            var sliceHeight = Globals.World.BLOCK_SIZE / dist * Client.viewport.distance;
            var y = (Client.viewport.height / 2.0) - (sliceHeight / 2.0);
            var colour = "";
            if (ray.vertical) {
                colour = "rgb(0, 0, 255)";
            } else {
                colour = "rgb(10, 10, 128)";
            }
            Client.buffer.line(i+0.5, y+0.5, i+0.5+1, y+0.5+(sliceHeight), colour);  
            cAngle += Client.viewport.col_width;
        }
    },

    castRay: function(a) {
        var cY = 0;
        var cX = 0;
        var Ya = 0;
        var Xa = 0;
        var possible = true; // specific angles will never collide with a wall
        var horzDist = 0;
        var vertDist = 0;
        var cells = World.getCells();

        // check for horizontal intersections first
        //@todo need some unit tests to verify every angle is caught and handled properly
        if (a > 180 && a < 360) {
            cY = (Math.floor(Client.y / Globals.World.BLOCK_SIZE) * Globals.World.BLOCK_SIZE) - 1;
            Ya = -Globals.World.BLOCK_SIZE; 
            cX = Client.x - (Client.y - cY) / Utils.tan(a);
            Xa = -Globals.World.BLOCK_SIZE / Utils.tan(a);
        } else if (a > 0 && a < 180) {
            cY = (Math.floor(Client.y / Globals.World.BLOCK_SIZE) * Globals.World.BLOCK_SIZE) + Globals.World.BLOCK_SIZE;
            Ya = Globals.World.BLOCK_SIZE; 
            cX = Client.x - (Client.y - cY) / Utils.tan(a);
            Xa = Globals.World.BLOCK_SIZE / Utils.tan(a);
        } else if (a == 0 || a == 180) {
            possible = false;
            horzDist = 9999999999999999999;
        }
        while (possible) {
            //Map.buffer.pixel(cX* Globals.Map.SCALE, cY * Globals.Map.SCALE, "rgb(0, 255, 0)");
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

        // reset a few vars
        cY = 0;
        cX = 0;
        Ya = 0;
        Xa = 0;
        possible = true;

        // now check for vertical intersections
        if (a > 90 && a < 270) {
            cX = (Math.floor(Client.x / Globals.World.BLOCK_SIZE) * Globals.World.BLOCK_SIZE) - 1;
            Xa = -Globals.World.BLOCK_SIZE;
            cY = Client.y - (Client.x - cX) * Utils.tan(a);
            Ya = -Globals.World.BLOCK_SIZE * Utils.tan(a);
        } else if ((a > 270 && a < 360) || (a >= 0 && a < 90)) {
            cX = (Math.floor(Client.x / Globals.World.BLOCK_SIZE) * Globals.World.BLOCK_SIZE) + Globals.World.BLOCK_SIZE;
            Xa = Globals.World.BLOCK_SIZE;
            cY = Client.y - (Client.x - cX) * Utils.tan(a);
            Ya = Globals.World.BLOCK_SIZE * Utils.tan(a);
        } else if (a == 90 || a == 270) {
            possible = false;
            vertDist = 9999999999999999999;
        }

        while (possible) {
            //Map.buffer.pixel(cX* Globals.Map.SCALE, cY * Globals.Map.SCALE, "rgb(0, 0, 255)");
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
        var ray = {};
        if (vertDist < horzDist) {
            ray.dist = vertDist;
            ray.vertical = true;
        } else {
            ray.dist = horzDist;
            ray.vertical = false;
        }
        return ray;
    },

    _bindKeys: function() {
        
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

    _bindSockets: function() {
        Client.ws = new io.Socket(); 
        Client.ws.connect();
        Client.ws.on("connect", Client.onOpen);
        Client.ws.on("message", Client.onMessage);
    },
    
    onOpen: function () {
        console.log("opened");
    },

    onMessage: function(msg) {
        var msg = JSON.parse(msg);
        console.log("msg", msg);
        switch (msg.type) {
            case 'START':
                Client.loadWorld(msg.world);
                Client.spawn(msg.position);
                Client.registerEntities(msg.entities);
                Client.activate();
                break;

            default:
                console.log("unknown msg type", msg.type);
                break;
        
        }
    },

    onClose: function() {
        console.log("closed");
    },

    loadWorld: function(data) {
        World.loadMap(data);
    },

    activate: function() {
        Bus.publish("client_ready");
    },

    registerEntities: function(entities) {
        // entities is an array, so just
        // push each entry onto our local stack
    }

};
