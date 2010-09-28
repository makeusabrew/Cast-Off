var Globals = require("../../public/js/globals").getObject();

Bullet = function(sId) {
    this.owner = sId;
    this.x = 0;
    this.y = 0;
    this.a = 0;
    this.v = 0;
};

Bullet.prototype.spawn = function(pos) {
    this.x = pos.x;
    this.y = pos.y;
    this.a = pos.a;
    this.v = Globals.Bullets.VELOCITY;
};

Bullet.prototype.getData = function() {
    return {
        x: this.x,
        y: this.y,
        a: this.a,
        v: this.v,
        owner: this.owner
    }
};

exports.factory = function(sId) {
    var c = new Bullet(sId);
    return c;
};
