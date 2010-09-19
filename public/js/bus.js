/******
 * Simple pub / sub wrapper using jquery
 */

var Bus = {
    _bindTo: document,

    publish: function(topic, data) {
        $(Bus._bindTo).trigger(topic, data);
    },

    subscribe: function(topic, data, callback) {
        $(Bus._bindTo).bind(topic, data, callback);
    }
}
        
