/**
 * webpack for local development
 * **/

var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractCSS = new ExtractTextPlugin('[name].css');
module.exports = {
	entry: {
		vendor: ["./app/vendor.js"],
		app: ["webpack/hot/dev-server", "./app/app.module.js"]

	},
	output: {
		filename: "[name].js",
		path: __dirname + "/dist"
			//path: require("path").resolve("./.tmp")
	},
	devtool: "source-map",
	devServer: {
		port: 9005,
        proxy: {
           // "/api" : "http://localhost:8000" // <- backend
           '/api': {
                target: 'http://localhost:8000',
                secure: false,
                prependPath: false,
                proxyTimeout: 1000 * 60 * 10,
                timeout: 1000 * 60 * 10
            }
        }
	},
	resolve: {
		extensions: ["", ".js", '.json']
	},
	eslint: {
		failOnError: true
	},
	sassLoader: {
		includePaths: [require("path").resolve(__dirname, "./src")]
	},
	module: {
		preLoaders: [{
			test: /\.js$/,
			loader: 'jshint-loader',
			exclude: /node_modules/
		}],
		loaders: [{
			test: /\.js$/,
			loader: 'ng-annotate?add=true',
			exclude: /node_modules/,
			enforce: 'pre'
		}, {
		    test: /.json$/,
		    loader: "json-loader"
		}, {
			test: /.html$/,
			loaders: ["raw-loader"]
		}, {
			test: /\.scss$/,
			loader: extractCSS.extract(['css', 'autoprefixer-loader?browsers=last 2 versions', 'sass'])

		}, {
			test: /\.(jpg|png|svg)$/,
			loader: "file-loader?name=[path][name].[ext]"
		}, {
			test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
			loader: "url-loader?limit=10000&mimetype=application/font-woff"
		}, {
			test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
			loader: "file-loader"
		}]
	},
	plugins: [

		new webpack.HotModuleReplacementPlugin(),
		extractCSS,
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendor"
		}),

		new HtmlWebpackPlugin({
			template: "./app/index.html",
			inject: true,
			filename: 'index.html',
			favicon: './app/favicon.ico'
		})
	]
};