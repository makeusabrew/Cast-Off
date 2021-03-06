var World = {
    _cells: null,
    _width: 0,
    _height: 0,

    loadMap: function(d) {
        World._cells = d;
        World._width = d[0].length;
        World._height = d.length;
        console.log("loaded map, dimensions", World._width, "x", World._height);
        console.log("actual units", (World._width * Globals.World.BLOCK_SIZE), "x", (World._height * Globals.World.BLOCK_SIZE));
    },

    generateRandomMap: function() {
        //
    },

    getCells: function() {
        return World._cells;
    },

    getWidth: function() {
        return World._width;
    },

    getHeight: function() {
        return World._height;
    }
};
