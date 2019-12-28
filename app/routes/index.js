let routes = {};

require("fs").readdirSync(__dirname).forEach(function(file) {
    if (file === 'index.js') {
        return;
    }
    var routeName = file.replace(/\..*$/g, '').replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    routes[routeName] = require("./" + file);
});

module.exports = routes;
