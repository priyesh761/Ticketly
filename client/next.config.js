module.exports = {
  webpack: (config) => {
    // Pull all files inside project directory once 300 second
    config.watchOptions.poll = 300;
    return config;
  },
};
