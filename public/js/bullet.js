Bullet = function(data) {
    //
    this.owner = data.owner;
    this.x = data.x;
    this.y = data.y;
    this.a = data.a;
    this.v = data.v;
};

var BulletManager = {
    bullets: [],
    
    spawnBullet: function(data) {
        data.v = 50;
        var b = new Bullet(data);
        BulletManager.bullets.push(b);
    }
};
