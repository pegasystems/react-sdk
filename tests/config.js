// require('lighthouse/lighthouse-core/config/lr-desktop-config.js');

const config = {
  baseUrl: 'http://localhost:3502/portal',
  apps: {
    mediaCo: {
      rep: {
        username: 'rep@mediaco',
        password: 'pega'
      },
      manager: {
        username: 'manager@mediaco',
        password: 'pega'
      },
      tech: {
        username: 'tech@mediaco',
        password: 'pega'
      }
    },
    digv2: {
      user: {
        username: 'user.digv2',
        password: 'pega'
      }
    }
  },
  testsetting: {
    // Enable network throttling(Default is false)
    throttle: false,
    // Simulate absence of connectivity
    offline: false,
    // Simulated download speed (bytes/s)
    downloadThroughput: 500,
    // Simulated upload speed (bytes/s)
    uploadThroughput: 500,
    // Simulated latency (ms)
    latency: 20,

    defaulttimeout: 60000,
    jesttimeout: 300000,
    slowmo: 120,
    slowmof: 30,
    width: 1920,
    height: 1080,
    headless: true,
    devtools: false
  }
};

// eslint-disable-next-line no-undef
exports.config = config;
