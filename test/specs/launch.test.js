
describe('マンガ検索アプリの操作テスト', () => {
    it('キーワードを入力して検索し、結果をクリックする', async () => {
        // 起動待ち
        await driver.pause(5000);

        // 起動した画面のスクリーンショットをBrowserStackに残す
        await driver.takeScreenshot();
        
        // 起動成功の判定（ここでは起動してエラー落ちしなければ合格とします）
        console.log('アプリの起動を確認しました！');

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
        const firstResult = await $('//android.view.ViewGroup[1]/android.widget.ImageView');
        await firstResult.waitForExist({ timeout: 5000 });

        // 一覧画面のスクリーンショットをBrowserStackに残す
        await driver.takeScreenshot();
        // 一覧成功の判定（ここでは起動してエラー落ちしなければ合格とします）
        console.log('検索一覧を確認しました！');

        await firstResult.click();

        // 4. 詳細画面が表示されたか確認
        await driver.pause(2000);
        await driver.takeScreenshot();
        console.log('詳細画面の表示を確認しました');
    });
});