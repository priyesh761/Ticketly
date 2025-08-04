module.exports = {
  env: {
    NEXT_PUBLIC_STRIPE_KEY: process.env.STRIPE_PUBLIC_KEY,
  },
  webpack: (config) => {
    // Pull all files inside project directory once 300 second
    config.watchOptions.poll = 300;
    return config;
  },
};
