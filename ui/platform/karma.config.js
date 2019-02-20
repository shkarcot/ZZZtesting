// Karma configuration
// Generated on Tue Mar 08 2016 09:25:05 GMT+0530 (IST)
var webpack = require("webpack");

module.exports = function(config) {
    config.set({
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            '../node_modules/jquery/dist/jquery.min.js',
            '../node_modules/angular/angular.min.js',
            '../node_modules/ng-lodash/build/ng-lodash.min.js',
            '../node_modules/angular-ui-router/release/angular-ui-router.js',
            '../node_modules/bootstrap/dist/js/bootstrap.min.js',
            '../node_modules/angular-mocks/angular-mocks.js',
            'test/**/*.test.js',
            'test/*.test.js'
        ],
        preprocessors: {
            "test/**/*.test.js": ["webpack", "sourcemap"]
        },
        webpack: {
            devtool: "inline-source-map",
            resolve: {
                extensions: ["", ".js"]
            },
            module: {
                loaders: [
                    { test: /\.js$/, loader: 'ng-annotate?add=true', exclude: /node_modules/ },
                    { test: /\.html$/, loader: "raw-loader" },
                    { test: /\.(jpg|png|woff|woff2|eot|ttf|svg|scss)$/, loader: "null-loader" },
                    { test: /\.json$/, loader: "json-loader", exclude: /node_modules/ }
                ],
                postLoaders: [
                    // instrument only testing sources with Istanbul
                    {
                        test: /\.js$/,
                        loader: 'istanbul-instrumenter-loader',
                        exclude: [
                            /\.spec\.js$/,
                            /node_modules/
                        ]
                    }
                ]
            },
            externals: {
                // angular is included specifically in the "files" setting
                // prevent webpack from requiring it multiple time from each spec
                "angular": "angular"
            }
        },
        webpackMiddleware: {
            noInfo: true,
            stats: { colors: true }
        },
        singleRun: false,
        autoWatch: true,
        browsers: ['PhantomJS'],
        //browsers: ['Chrome', 'Firefox', 'IE'],
        coverageReporter: {
            dir: ".tmp/coverage/",
            subdir: function(browser) {
                // normalization process to eliminate version and capitalization differences
                return browser.toLowerCase().split(/[ /-]/)[0];
            }
        },
        port: 9876,
        // enable / disable colors in the output (reporters and logs)
        colors: true,
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,
        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'story', 'coverage'],

    })
}



