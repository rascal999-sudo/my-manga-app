// wdio.bstack.conf.js
exports.config = {
    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,
    
    services: ['browserstack'],
    
    specs: [
        './test/specs/**/*.js'
    ],
    
capabilities: [{
        // 1. 端末のスペックやプロジェクト名は bstack:options の中
        'bstack:options': {
            deviceName: 'Google Pixel 8',
            osVersion: '14.0',
            projectName: 'My Manga App',
            buildName: 'CircleCI Build',
            sessionName: 'App Launch Test'
        },
        // 2. アプリのURL（app）だけは、例外として直下に配置する
        app: process.env.BROWSERSTACK_APP_URL
    }],
    
    framework: 'mocha',
    reporters: ['spec'],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    }
};