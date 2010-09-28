//@todo how do we restrict access to this appropriately?
var Globals = {
    Client: {
        MOVE_SPEED: 10,
        TURN_SPEED: 10
    },

    World: {
        BLOCK_SIZE: 64
    },

    Map: {
        SCALE: 1/10,
        CAST_ACCURACY: 10   // higher = less accurate
    },

    Resolution: {
        HIGH: {
            w: 640,
            h: 480
        },
        MEDIUM: {
            w: 512,
            h: 384
        },
        LOW: {
            w: 320,
            h: 240,
        },
    },

    FOV: 60,

    Bullets: {
        VELOCITY: 50
    }

};

if (typeof exports != "undefined") {
    exports.getObject = function() {
        return Globals;
    };
}
