Entity = function(data) {
    this.x = data.x;
    this.y = data.y;
    this.a = data.a;
    this.h = data.h;
    this.id = data.id;
    this.type = 'CLIENT';
};

Entity.prototype.getData = function() {
    return {
        x: this.x,
        y: this.y,
        a: this.a,
        h: this.h,
        id: this.id,
        type: this.type
    };
};
