var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
	entry: './src/js/script.js',
	output: {
		path: './public/js',
		filename: 'app.bundle.js'
	},
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    colors: true,
    historyApiFallback: true,
    inline: true
  },
  plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.html'
      })
  ]
}
