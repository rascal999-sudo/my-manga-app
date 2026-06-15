'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import BookList from '@/components/BookList';
import BookDetail from '@/components/BookDetail';
import { KoboBook } from '@/types/rakuten';
import { KoboSort } from '@/lib/api';

// 💡 【修正点2の補足】: 
// 以下のコードはpage.tsxの全文ですが、「カードが浮き出るCSS」は各カード（部品）に直接設定する必要があります。
// 別ファイルである `BookList.tsx` のカードを囲んでいる要素(divなど)に、以下のクラスを追加してください。
// 追加するクラス: "transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"

export default function HomePage() {
  const [books, setBooks] = useState<KoboBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false); // 追加読み込み専用のローディング
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // 💡 ページネーション（上限なし取得）のための状態管理
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [currentSort, setCurrentSort] = useState<KoboSort>('standard');

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // 初回の検索（1ページ目の30件を取得）
  const handleSearch = async (keyword: string, sort: KoboSort) => {
    if (!keyword || keyword.trim() === '') {
      setError('検索キーワードを入力してください');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setSelectedIdx(null);
    setCurrentPage(1);
    setCurrentKeyword(keyword);
    setCurrentSort(sort);

    try {
      const params = new URLSearchParams({
        keyword: keyword,
        sort: sort,
        page: '1',
      });

      const res = await fetch(`/api/search?${params.toString()}`);
      
      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || 'データの取得に失敗しました');
      }

      const json = await res.json();
      const extractedBooks = json?.Items?.map((item: any) => item.Item) || [];
      setBooks(extractedBooks);
      
      // 💡 まだ次のページ（続きのデータ）があるかを判定
      setHasMore(json.page < json.pageCount);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '検索中にエラーが発生しました。時間をおいて再度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 追加読み込み（2ページ目以降を上限なしで取得し、後ろにドッキングする）
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    setError(null);
    const nextPage = currentPage + 1;

    try {
      const params = new URLSearchParams({
        keyword: currentKeyword,
        sort: currentSort,
        page: nextPage.toString(),
      });

      const res = await fetch(`/api/search?${params.toString()}`);
      
      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || '追加データの取得に失敗しました');
      }

      const json = await res.json();
      const extractedBooks = json?.Items?.map((item: any) => item.Item) || [];
      
      // 💡 今まで持っていた本の後ろに、新しく見つけた本を合体させる
      setBooks(prevBooks => [...prevBooks, ...extractedBooks]);
      setCurrentPage(nextPage);
      setHasMore(json.page < json.pageCount);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '追加データの読み込み中にエラーが発生しました。');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleBackToTop = () => {
    // 💡 修正点: スムーズに一番上へ戻る処理を追加
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setBooks([]);
    setHasSearched(false);
    setSelectedIdx(null);
    setError(null);
    setCurrentPage(1);
    setHasMore(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-foreground flex flex-col">
      {/* 💡 修正点3: 上部バーの左端に「トップに戻る」旨を記載しました。
        flexbox を使って左側にテキスト、中央にタイトルを配置しています。
      */}
      <header 
        className="sticky top-0 z-50 bg-red-600 text-white p-4 shadow-md flex items-center justify-between cursor-pointer select-none transition-colors hover:bg-red-700" 
        onClick={handleBackToTop}
      >
        <div className="text-[10px] sm:text-xs font-bold opacity-80 animate-pulse w-24">
          ◀ 押すとトップ
        </div>
        <div className="text-center flex-grow">
          <h1 className="text-lg sm:text-xl font-bold tracking-wider">楽天Kobo 漫画検索</h1>
          <p className="text-[10px] sm:text-xs opacity-80 mt-1">いつでもお得に電子コミックを検索</p>
        </div>
        <div className="w-24"></div> {/* 中央寄せのバランスをとるための空要素 */}
      </header>

      {selectedIdx === null && <SearchBar onSearch={handleSearch} isLoading={loading} />}

      {/* 💡 修正点1: レスポンシブ対応な画面設計（余白の最適化） 
        スマホでは px-2 で画面を広く使い、タブレット以上で md:px-6 と余白を広げます。
      */}
      <main className="w-full max-w-6xl mx-auto flex-grow flex flex-col justify-start px-2 py-4 md:px-6 md:py-8 pb-12">
        {error && (
          <div className="m-4 p-4 bg-destructive/10 text-destructive rounded-lg text-sm font-medium text-center">
            {error}
          </div>
        )}

        {selectedIdx !== null ? (
          <BookDetail 
            book={books[selectedIdx]}
            onBackToList={() => setSelectedIdx(null)}
            onBackToTop={handleBackToTop}
            onPrev={() => setSelectedIdx(prev => (prev !== null && prev > 0 ? prev - 1 : prev))}
            onNext={() => setSelectedIdx(prev => (prev !== null && prev < books.length - 1 ? prev + 1 : prev))}
            hasPrev={selectedIdx > 0}
            hasNext={selectedIdx < books.length - 1}
          />
        ) : (
          <>
            {!hasSearched && !loading && (
              <div className="flex-grow flex flex-col items-center justify-center text-center py-20 px-4 my-auto">
                <div className="text-5xl mb-4">📚</div>
                <h2 className="text-lg font-bold text-slate-800">コミックを探してみよう</h2>
                <p className="text-xs text-muted-foreground max-w-xs mt-1">
                  上の検索窓に好きな作品名や著者名を入力して検索してください。
                </p>
              </div>
            )}

            {loading && (
              <div className="text-center py-20 text-sm text-muted-foreground font-medium">
                データを読み込み中...
              </div>
            )}

            {!loading && hasSearched && (
              <>
                <BookList books={books} onBookSelect={(idx) => setSelectedIdx(idx)} />
                
                {/* 💡 続きのデータがある場合のみ「もっと見る」ボタンを表示 */}
                {hasMore && (
                  <div className="text-center mt-8">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm py-3 px-8 border border-slate-300 rounded-lg shadow-sm transition-colors disabled:opacity-50 min-w-[200px]"
                    >
                      {loadingMore ? '読み込み中...' : 'もっと見る（制限なし）'}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>

      <footer className="border-t bg-white py-6 text-center text-xs text-muted-foreground space-y-2 mt-auto">
        <p>© {new Date().getFullYear()} 漫画検索 App</p>
        <p className="px-4 max-w-md mx-auto opacity-70">
          Supported by <a href="https://webservice.rakuten.co.jp/" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-600">楽天ウェブサービス</a>
        </p>
      </footer>
    </div>
  );
}