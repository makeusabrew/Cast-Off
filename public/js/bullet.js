Bullet = function(data) {
    this.owner = data.owner;
    this.x = data.x;
    this.y = data.y;
    this.a = data.a;
    this.v = data.v;
};

var BulletManager = {
    bullets: [],
    
    addBullet: function(data) {
        var b = new Bullet(data);
        BulletManager.bullets.push(b);
    },

    tick: function() {
        for (var i = 0; i < BulletManager.bullets.length; i++) {
            // move each bullet
        }
    }
};
