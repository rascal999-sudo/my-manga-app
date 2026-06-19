import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}

              {/* 2. 🪧 全ページ共通の楽天クレジットフッター */}
        <footer className="w-full bg-slate-100 p-4 border-t border-slate-200 text-center mt-auto">


        {/* アコーディオンの下、フッター補足部分を以下に差し替え */}
          <p className="text-xs text-slate-500 mb-3">
            My Bookshelf v1.0.0
          </p>
          
          {/* 💡 楽天ウェブサービス公式のクレジット表記（規約準拠） */}
          <div className="flex flex-col items-center justify-center gap-2">
            {/* 公式リンクバナー（画像が読み込めない環境も考慮し、alt属性を正しく設定） */}
            <a 
              href="https://webservice.rakuten.co.jp/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src="https://webservice.rakuten.co.jp/img/credit/200709/credit_22121.gif" 
                alt="Supported by 楽天ウェブサービス" 
                title="Supported by 楽天ウェブサービス"
                width="221" 
                height="21" 
              />
            </a>
            <p className="text-[10px] text-slate-400 max-w-md mt-1">
              本アプリは楽天Koboおよび楽天ウェブサービスAPIを利用して書籍情報を取得しています。
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}

export const metadata = {
  title: 'My Bookshelf',
  description: 'あなただけの特別な電子書籍棚',
};

