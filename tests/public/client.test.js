module("Client");

test("Initial Values", function() {
    equals(0, Client.x, "x value");
    equals(0, Client.y, "y value");
    equals(0, Client.a, "a value");
    equals(0, Client.h, "h value");
});
