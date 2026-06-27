import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.MyBookchelf.app',
  appName: 'My Bookshelf',
  webDir: 'out',
  server: {
    androidScheme: 'http',
    // 外部のVercelドメインへの通信を明示的に許可する
    allowNavigation: ['my-manga-app-ten.vercel.app'] 
  }
};

export default config;