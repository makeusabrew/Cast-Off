var Game = {
    fps: 30,
    tickHandler: null,

    tick: function() {
        
        Client.render();

        // yes, setInterval may seem more logical, but let's use setTimeout
        // so we can dynamically adjust at run time (maybe)
        Game.tickHandler = setTimeout(function() {
            Game.tick();
        }, 1000/Game.fps);
    }
};
