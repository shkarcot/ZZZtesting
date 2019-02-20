/** 
 * webpack for build deployment 
 * **/

var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    vendor: ["angular"],
    app: ["./app/app.module.js"]
  },
  output: {
    filename: "[name].js",
    path: require("path").resolve("./dist")
  },
  devtool: "source-map",
  devServer: {
    port: 8000
  },
  resolve: {
    extensions: ["", ".js"]
  },
  "html-minify-loader": {
    empty: true // don't remove empty attributes
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'ng-annotate?add=true!babel',
      exclude: /node_modules/
    }, {
      test: /.html$/,
      loaders: ["raw-loader"]
    }, {
      test: /\.scss$/,
      loaders: ['style', 'css', 'autoprefixer-loader?browsers=last 2 versions', 'sass']
    }, , {
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
    new ExtractTextPlugin("[name].css"),
    new webpack.optimize.DedupePlugin(),
    new HtmlWebpackPlugin({
      template: "./app/index.html",
      inject: true,
      hash: true,
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};