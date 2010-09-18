Surface = function(elem) {
    var elem = document.getElementById(elem);
    if (!elem.getContext) {
        throw new Error('Canvas not available');
    }

    this.buffer = elem.getContext("2d");
};

Surface.prototype.line = function(x, y, x1, y1, colour) {
    this.buffer.strokeStyle = colour;
    this.buffer.beginPath();
    this.buffer.moveTo(x, y);
    this.buffer.lineTo(x1, y1);
    this.buffer.closePath();
    this.buffer.stroke();
};

Surface.prototype.fillRect = function(x, y, w, h, colour) {
    this.buffer.fillStyle = colour;
    this.buffer.fillRect(x, y, w, h);
};

Surface.prototype.getWidth = function() {
    return this.buffer.canvas.clientWidth;
};

Surface.prototype.getHeight = function() {
    return this.buffer.canvas.clientHeight;
};
