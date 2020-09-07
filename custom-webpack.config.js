const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      $ENV: {
        ENVIRONMENT: JSON.stringify(process.env.ENV),
        API_URL: JSON.stringify(process.env.API_URL),
        PRODUCTION: JSON.stringify(process.env.PRODUCTION)
      }
    })
  ]
};
