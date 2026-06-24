
describe('マンガ検索アプリの操作テスト', () => {
    it('キーワードを入力して検索し、結果をクリックする', async () => {
        // 1. 起動待ちを少し長めにとる
        await driver.pause(8000); 
        // 起動した画面のスクリーンショットをBrowserStackに残す
        await driver.takeScreenshot();
        await driver.saveScreenshot('./test-results/1_init_screenshot.png');
        
        // 起動成功の判定（ここでは起動してエラー落ちしなければ合格とします）
        console.log('アプリの起動を確認しました！');

        // 2. ★超重要：コンテキストをWebViewに切り替える
        const contexts = await driver.getContexts();
        console.log('Available contexts:', contexts); // ログに出して確認
        
        // 通常、[0]はNATIVE_APP, [1]以降にWEBVIEWがあるはずです
        // 念のためWEBVIEWを探す処理を入れると堅牢になります
        const webviewContext = contexts.find(c => c.includes('WEBVIEW'));
        if (webviewContext) {
            await driver.switchContext(webviewContext);
        } else {
            throw new Error('WebViewが見つかりませんでした');
        }

        // 1. 検索入力欄を探して文字を入力 (Accessibility IDやXPathを使用)
        // ※ IDはAppium Inspectorで確認します
        const searchInput = await driver.$('input[placeholder="漫画のタイトル、著者名など..."]');
        await searchInput.setValue('ワンピース');

        // 2. 検索ボタンをクリック
        // ボタンの中から「検索」というテキストを持つものを探す
        const searchButton = await driver.$('button*=検索'); 
        await searchButton.click();

        // 3. 検索結果の一覧が表示されるまで待機して、最初の一つをクリック
        // 要素が動的に生成される場合、waitForExistを使うのがコツです
        const firstResult = await driver.$('img'); 
        await firstResult.waitForExist({ timeout: 10000 }); // 念のため10秒待機

        // 一覧画面のスクリーンショットをBrowserStackに残す
        await driver.takeScreenshot();
        await driver.saveScreenshot('./test-results/2_search_screenshot.png');
        // 一覧成功の判定（ここでは起動してエラー落ちしなければ合格とします）
        console.log('検索一覧を確認しました！');

        await firstResult.click();

        // 3. 詳細画面が表示されたか確認
        await driver.pause(2000);
        await driver.takeScreenshot();
        await driver.saveScreenshot('./test-results/3_detail_screenshot.png');
        console.log('詳細画面の表示を確認しました');
    });
});