Client = function(sId) {
    this.health = 100;
    this.x = 0;
    this.y = 0;
    this.a = 0;
    this.sessionId = sId;
};

Client.prototype.spawn = function(world) {
    var maxWidth = world.getWidth() * 64;       //@todo get from globals
    var maxHeight = world.getHeight() * 64;  //@todo get from globals

    this.x = Math.floor(Math.random() * maxWidth);
    this.y = Math.floor(Math.random() * maxHeight);
    this.a = Math.floor(Math.random() * 360);
};
    
Client.prototype.getPosition = function() {
    return {
        x: this.x,
        y: this.y,
        a: this.a
    };
};

Client.prototype.getData = function() {
    return {
        x: this.x,
        y: this.y,
        a: this.a,
        sId: this.sessionId
    };
};

exports.factory = function(sId) {
    var c = new Client(sId);
    return c;
};
