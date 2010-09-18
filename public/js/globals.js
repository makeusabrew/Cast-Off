//@todo how do we restrict access to this appropriately?
var Globals = {
    Client: {
        MOVE_SPEED : 10,
        TURN_SPEED: 10
    },

    World: {
        BLOCK_SIZE: 64
    },

    Map: {
        SCALE: 1/10,
        BLOCK_SIZE: 60 // 64 * (1/10) just doesn't render nicely
    }
};
