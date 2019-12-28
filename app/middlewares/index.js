let middlewares = {};

require("fs").readdirSync(__dirname).forEach(function(file) {
    if (file === 'index.js') {
        return;
    }
    var middlewareName = file.replace(/\..*$/g, '').replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    middlewares[middlewareName] = require("./" + file);
});

module.exports = middlewares;
