var Globals = require("../../public/js/globals").getObject();

Client = function(sId) {
    this.h = 100;
    this.x = 0;
    this.y = 0;
    this.a = 0;
    this.sessionId = sId;
};

Client.prototype.spawn = function(world) {
    var maxWidth = world.getWidth() * Globals.World.BLOCK_SIZE;
    var maxHeight = world.getHeight() * Globals.World.BLOCK_SIZE;

    this.x = Math.floor(Math.random() * maxWidth);
    this.y = Math.floor(Math.random() * maxHeight);
    this.a = Math.floor(Math.random() * 360);
};
    
Client.prototype.getData = function() {
    return {
        x: this.x,
        y: this.y,
        a: this.a,
        h: this.h,
        sessionId: this.sessionId
    };
};

Client.prototype.moveTo = function(pos) {
    this.x = pos.x;
    this.y = pos.y;
    this.a = pos.a;
};

Client.prototype.getId = function() {
    return this.sessionId;
};

exports.factory = function(sId) {
    var c = new Client(sId);
    return c;
};
