var Utils = {
    deg2rad: function(angle) {
        return (angle/180)*Math.PI;
    },

    cos: function(angle) {
        return Math.cos(Utils.deg2rad(angle));
    },

    sin: function(angle) {
        return Math.sin(Utils.deg2rad(angle));
    },

    tan: function(angle) {
        return Math.tan(Utils.deg2rad(angle));
    },

    getBuffer: function(elem) {
        var elem = document.getElementById(elem);
        if (!elem.getContext) {
            throw new Error('Canvas not available');
        }

        return elem.getContext("2d");
    },

    keys: {
        UP_ARROW : 38,
        DOWN_ARROW : 40,
        LEFT_ARROW : 37,
        RIGHT_ARROW : 39
    }
};
