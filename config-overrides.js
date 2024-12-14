const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    buffer: require.resolve("buffer/"),
    stream: require.resolve("stream-browserify"),
    process: require.resolve("process/browser.js"), // Résolution spécifique
  };

  config.resolve.alias = {
    ...config.resolve.alias,
    "process/browser": require.resolve("process/browser.js"), // Alias ajouté
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ]);

  return config;
};
