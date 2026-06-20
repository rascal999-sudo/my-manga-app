import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.MyBookchelf.app',
  appName: 'My Bookshelf',
  webDir: 'out', // 💡 Next.jsの静的エクスポート先を指定
  server: {
    androidScheme: 'https' // AndroidでのCORS/リクエスト通信を安定させるための推奨設定
  }
};

export default config;