Client = function() {
    this.health = 100;
    this.x = 0;
    this.y = 0;
    this.a = 0;
};

Client.prototype.spawn = function() {
    this.x = 300;
    this.y = 400;
    this.a = 45;
};
    
Client.prototype.getPosition = function() {
    return {
        x: this.x,
        y: this.y,
        a: this.a
    };
};

exports.factory = function() {
    var c = new Client();
    c.spawn();
    return c;
};
