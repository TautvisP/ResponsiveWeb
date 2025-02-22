// webpack.config.js
module.exports = {
    // Other configurations...
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto",
          use: []
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
          exclude: [
            // Exclude problematic source maps
            /node_modules\/@mediapipe\/tasks-vision/
          ]
        }
      ]
    }
  };