import type { NextConfig } from "next";

// 💡 package.jsonにてnpm cap:build時にapp_envを指定している。
 const isCapacitor = process.env.APP_ENV === 'cap';

const nextConfig: NextConfig = {

// APP_ENV が 'cap' なら 'export'、それ以外は undefined (サーバーサイドレンダリング有効)
  output: isCapacitor ? 'export' : undefined,

  // 💡 Capacitor（静的エクスポート）時は画像最適化を無効化（ローカルファイルとして画像を読み込むため必須）
  // Vercelデプロイ時（Web版）はVercelの高速な画像最適化をそのまま有効にします
  images: {
    unoptimized: process.env.APP_ENV === 'cap' ? true : false,
  },
};

export default nextConfig;