'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface HelpItem {
  title: string;
  content: React.ReactNode;
}

export default function HelpPage() {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const helpData: HelpItem[] = [
    {
      title: "🔍 楽天Koboと連携したリアルタイム検索について",
      content: (
        <p>
          上部の検索バーにマンガのタイトルや著者名を入力することで、楽天Koboの膨大なデータベースからリアルタイムに電子書籍を検索できます。
          最新の価格、レビュー評価、詳細なあらすじ情報をその場でチェックすることが可能です。
        </p>
      )
    },
    {
      title: "📚 本棚への追加と管理方法",
      content: (
        <p>
          検索結果から気になる本をタップすると詳細画面が開きます。
          詳細画面にある追加ボタンを押すことで、あなた専用の「本棚」へ一瞬で登録されます。
          本棚に登録された書籍は、スマートフォンやタブレットなど、お使いのデバイスの画面サイズに合わせて見やすく美しく自動配置されます。
        </p>
      )
    },
    {
      title: "🏷️ オリジナルタグと読書メモの活用",
      content: (
        <p>
          「本棚設定」画面から、登録した本に対して自分だけの自由なタグ（例：「読みたい」「完結」「泣ける」など）を付けたり、独自の読書メモを残すことができます。
          トップ画面では、設定したタグごとに本を絞り込んで表示する便利なフィルタリング機能が自動的に有効になります。
        </p>
      )
    },
    {
      title: "🏆 初期データ「2025年度 受賞作品」について",
      content: (
        <p>
          本アプリには、使い始めのガイドとして「2025年度 受賞作品」のデータセットが最初から本棚に自動注入されています。
          これらの作品をそのまま楽しむことも、タグを自分好みに変更してご自身の本棚のコレクションへ完全に統合することも自由に行えます。
        </p>
      )
    },
    {
      title: "💾 データの保存場所と同期・復元について",
      content: (
        <p>
          本棚に登録したデータやメモは、お使いのブラウザ（ローカルストレージ）に安全に自動保存されるため、面倒なアカウント作成やログインは不要です。
          もしデータが消えてしまったり、最新の受賞作データを再度読み込み直したい場合は、
          <strong>「本棚設定」画面にある「🔄 受賞データを同期」ボタン</strong>を押すことで、いつでも安全にシステム標準のデータを差分インポート・復元できます。
        </p>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* ヘッダー */}
      <header className="bg-red-600 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => router.back()} 
            className="text-white hover:opacity-80 font-bold text-sm"
          >
            ◀ 戻る
          </button>
          <h1 className="text-lg font-bold">アプリの使い道 ＆ ヘルプ</h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-3xl mx-auto p-4 md:p-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">📚 My Bookshelf とは？</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            「My Bookshelf」は、膨大な作品の中からお気に入りのマンガや書籍を瞬時に探し出し、あなた好みのカスタマイズで美しく整理・管理できる、シンプルで洗練された電子書籍管理アプリです。
            日々の読書ライフをより豊かに、そしてお気に入りの一冊と出会うための快適な空間を提供します。
          </p>
        </div>

        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3進む">よくある質問・機能説明</h3>
        
        {/* アコーディオンリスト */}
        <div className="space-y-3">
          {helpData.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  className="w-full text-left p-4 font-bold text-sm md:text-base flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700"
                  onClick={() => toggleAccordion(index)}
                >
                  <span>{item.title}</span>
                  <span className="text-slate-400 font-mono text-xs">
                    {isOpen ? '▲' : '▼'}
                  </span>
                </button>
                
                {isOpen && (
                  <div className="p-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                    {item.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* フッター補足 */}

      </main>
    </div>
  );
}