const path = require("path");

module.exports = {
    entry: "./src/app.js",
    output: {
        path: path.resolve(__dirname, "public/scripts"),
        filename: "bundle.js"
    },
    mode: "development",
    watch: true,
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ["env", "react"]
              }
            }
          },
          {
            test: /\.scss$/,
            use: [ 'style-loader', 'css-loader', 'sass-loader' ]
          }
        ]
    },
    devtool: "cheap-module-eval-source-map",
    devServer: {
      contentBase: path.resolve(__dirname, "public"),
      compress:true,
      publicPath: "/scripts"
    }
}