var World = {
    _cells: null,
    _width: 0,
    _height: 0,

    loadMap: function() {
        var d = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ];
        World._cells = d;
        World._width = d[0].length;
        World._height = d.length;
        console.log("loaded map, dimensions", World._width, "x", World._height);
    },

    generateRandomMap: function() {
        //
    },

    getCells: function() {
        return World._cells;
    }
};
