import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 💡 環境変数 APP_ENV が 'cap' のときだけ静的エクスポート（Capacitor用）にする
  output: process.env.APP_ENV === 'cap' ? 'export' : undefined,

  // 💡 Capacitor（静的エクスポート）時は画像最適化を無効化（ローカルファイルとして画像を読み込むため必須）
  // Vercelデプロイ時（Web版）はVercelの高速な画像最適化をそのまま有効にします
  images: {
    unoptimized: process.env.APP_ENV === 'cap' ? true : false,
  },
};

export default nextConfig;