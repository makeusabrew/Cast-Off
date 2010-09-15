//@todo split out Client / Player?
var Client = {
    x: 0,
    y: 0,
    a: 0.0,
    health: 0,

    buffer: null,

    setBuffer: function(elem) {
        var elem = document.getElementById(elem);
        if (!elem.getContext) {
            Client.buffer = null;
            throw 'Canvas not available';
        }

        Client.buffer = elem.getContext("2d");
    },

    spawn: function() {
        health = 100;
    },

    render: function() {
        Client.buffer.fillStyle = "rgb(0, 0, 0)";
        Client.buffer.fillRect(0, 0, 640, 480);
    }
};
