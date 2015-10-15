var UglifyJS = require("uglify-js");

function minify(src, options) {
    options = options || {};
    options.fromString = true;

    return UglifyJS.minify(src, options).code;
}

module.exports = function (lasso, pluginConfig) {
    lasso.addTransform({
        contentType: 'js',

        name: module.id,

        stream: false,

        transform: function(code, lassoContext) {
            try {
                var minified = minify(code, pluginConfig);
                if (minified.length && !minified.endsWith(";")) {
                    minified += ";";
                }
                return minified;
            } catch(e) {
                if (e.line) {
                    var dependency = lassoContext.dependency;
                    console.error('Unable to minify the following code for ' + dependency + ' at line '  + e.line + ' column '+ e.col + ':\n' +
                                  '------------------------------------\n' +
                                  code + '\n' +
                                  '------------------------------------\n');
                    throw new Error('JavaScript minification error for ' + dependency + ': ' + e.message + ' (line ' + e.line + ', col ' + e.col + ')');
                } else {
                    throw e;
                }
            }

        }
    });
};
