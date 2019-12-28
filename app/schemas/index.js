let schemas = {};

require("fs").readdirSync(__dirname).forEach(function(file) {
    if (file === 'index.js') {
        return;
    }
    var schemaName = file.replace(/\..*$/g, '').replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    schemas[schemaName] = require("./" + file);
});

module.exports = schemas;
