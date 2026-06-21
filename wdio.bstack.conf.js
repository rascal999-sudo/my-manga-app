// wdio.bstack.conf.js
exports.config = {
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    
    services: ['browserstack'],
    
    specs: [
        './test/specs/**/*.js'
    ],
    
capabilities: [{
        // 1. BrowserStack用のオプション
        'bstack:options': {
            deviceName: 'Google Pixel 8',
            osVersion: '14.0',
            projectName: 'My Manga App',
            buildName: 'CircleCI Build',
            sessionName: 'App Launch Test'
        },
        // 2. 直下に置く場合、W3Cエラーを回避するために 'appium:app' とクォーテーションで囲んで記述します
        'appium:app': process.env.BROWSERSTACK_APP_URL
    }],
    
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
};