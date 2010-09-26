var Utils = {
    deg2rad: function(angle) {
        return (angle/180)*Math.PI;
    },

    rad2deg: function(angle) {
        return angle*(180/Math.PI);
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

    atan: function(angle) {
        return Math.atan(Utils.deg2rad(angle));
    },

    atan2: function(y, x) {
        return Math.atan2(y, x);
    },

    getBuffer: function(elem) {
        return new Surface(elem);
    },

    keyDown: function(k) {
        Utils.keysPressed[k] = true;
    },

    keyUp: function(k) {
        Utils.keysPressed[k] = false;
    },

    isKeyDown: function(k) {
        return Utils.keysPressed[k];
    },

    captureKey: function(k) {
        for (i in Utils.keys) {
            if (Utils.keys[i] == k) {
                return true;
            }
        }
        return false;
    },

    keysPressed: {},

    keys: {
        UP_ARROW : 38,
        DOWN_ARROW : 40,
        LEFT_ARROW : 37,
        RIGHT_ARROW : 39,
        SPACE_BAR : 32
    },
    
    messages: {
        START: 1,
        CLIENT_CONNECTED: 2,
        CLIENT_DISCONNECTED: 3
    }

};
