// wdio.bstack.conf.js
exports.config = {
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    
    services: ['browserstack'],
    
    specs: [
        './test/specs/**/*.js'
    ],
    
    capabilities: [{
        'bstack:options': {
            deviceName: 'Google Pixel 8',
            osVersion: '14.0',
            projectName: 'My Manga App',
            buildName: 'CircleCI Build',
            sessionName: 'App Launch Test'
        },
        app: process.env.BROWSERSTACK_APP_URL
    }],
    
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
};