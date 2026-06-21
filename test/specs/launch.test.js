// test/specs/launch.test.js
describe('アプリ起動テスト', () => {
    it('アプリが正常に起動して画面が表示されること', async () => {
        // Capacitorアプリが起動するまで数秒待つ
        await driver.pause(5000);
        
        // 起動した画面のスクリーンショットをBrowserStackに残す
        await driver.takeScreenshot();
        
        // 起動成功の判定（ここでは起動してエラー落ちしなければ合格とします）
        console.log('アプリの起動を確認しました！');
    });
});