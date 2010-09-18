exports.default = "text/plain";

exports.getType = function(file) {
    var extpos = file.lastIndexOf(".");
    if (extpos == -1) {
        return exports.default;
    }
    var ext = file.substr(extpos+1);

    var mime = exports.types[ext] || exports.default;
    /*console.log("returning type ["+mime+"] for extension ["+ext+"]");*/
    return mime;
};

exports.types = {
    'html' : 'text/html',
    'txt'  : 'text/plain',
    'css'  : 'text/css',
    'js'   : 'application/javascript'
};
