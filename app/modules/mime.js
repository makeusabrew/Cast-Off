exports.default = "text/plain";

exports.getType = function(file) {
    var extpos = file.lastIndexOf(".");
    if (extpos == -1) {
        return exports.default;
    }
    var ext = file.substr(extpos);

    return exports.types[ext] || exports.default;
};

exports.types = {
    'html' : 'text/html',
    'txt'  : 'text/plain',
    'js'   : 'application/javascript'
};
