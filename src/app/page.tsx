'use client';

import { useState, useMemo, useEffect } from 'react';
import { useBookshelf } from '@/hooks/useBookshelf';
import SearchBar from '@/components/SearchBar';
import BookList from '@/components/BookList';
import BookDetail from '@/components/BookDetail';
import Link from 'next/link';
import { KoboBook } from '@/types/rakuten';
import { KoboSort } from '@/lib/api';

const STORAGE_KEY_LAST_TAG = "my_bookshelf_last_tag";

export default function HomePage() {
  const { shelfBooks, isLoaded } = useBookshelf();
  const [mode, setMode] = useState<'SHELF' | 'SEARCH'>('SHELF');
  
  const [books, setBooks] = useState<KoboBook[]>([]);
  const [totalHits, setTotalHits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentKeyword, setCurrentKeyword] = useState('');
  const [currentSort, setCurrentSort] = useState<KoboSort>('standard');
  const [selectedBook, setSelectedBook] = useState<any | null>(null);

  // 初期の選択タグは空文字で設定（マウント後に localStorage または本棚の先頭タグから復元）
  const [selectedTag, setSelectedTag] = useState<string>('');

  // インデックス管理
  const currentIndex = books.findIndex(b => b.itemNumber === selectedBook?.itemNumber);

  const handleMovePage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < books.length) {
      setSelectedBook(books[newIndex]);
    }
  };

  // 全タグの集計（本棚にあるタグのみを純粋にカウント）
  const tagStats = useMemo(() => {
    const counts: Record<string, number> = {};
    shelfBooks.forEach(b => {
      if (b.userTags && Array.isArray(b.userTags)) {
        b.userTags.forEach(t => {
          counts[t] = (counts[t] || 0) + 1;
        });
      }
    });
    return counts;
  }, [shelfBooks]);

  // 本の件数が多い順にソートされたタグリスト
  const allTags = useMemo(() => {
    return Object.keys(tagStats).sort((a, b) => tagStats[b] - tagStats[a]);
  }, [tagStats]);

  // 起動時（マウント時）に一度だけ localStorage または本棚のデータから初期タグを決定
  useEffect(() => {
    const savedTag = localStorage.getItem(STORAGE_KEY_LAST_TAG);
    if (savedTag && allTags.includes(savedTag)) {
      setSelectedTag(savedTag);
    } else if (allTags.length > 0) {
      // 履歴がない、または履歴のタグが既に存在しない場合は、一番本の多いタグを初期表示
      setSelectedTag(allTags[0]);
    }
  }, [allTags]);

  // タグが変更されたら localStorage に保存する処理
  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    localStorage.setItem(STORAGE_KEY_LAST_TAG, tag);
  };

  const handleSearch = async (keyword: string, sort: KoboSort, page: number = 1) => {
    if (page === 1) {
      setLoading(true);
      setCurrentKeyword(keyword);
      setCurrentSort(sort);
    }
    
    setMode('SEARCH');
    try {
      const params = new URLSearchParams({ keyword, sort, page: page.toString() });
      const res = await fetch(`/api/search?${params.toString()}`);
      const json = await res.json();
      
      const newBooks = json?.Items?.map((item: any) => item.Item) || [];
      setBooks(page === 1 ? newBooks : [...books, ...newBooks]);
      setTotalHits(json.count || 0);
      setHasMore(json.page < json.pageCount);
      setCurrentPage(page);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  if (!isLoaded) return <div className="p-10 text-center">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-red-600 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => setMode('SHELF')}>
            <h1 className="text-xl font-bold">📚 My Bookshelf</h1>
            <p className="text-[10px] opacity-80">～埋もれていた名作に出会える～　楽天Koboで電子書籍を検索できます</p>
          </div>
          <Link href="/shelf" className="text-xs font-bold bg-white text-red-600 px-3 py-1 rounded-full hover:bg-slate-100">
            📚本棚設定
          </Link>
          <Link href="/help">❓ヘルプ</Link>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto w-full p-4">
        {selectedBook ? (
          <BookDetail 
            book={selectedBook}
            onBackToList={() => setSelectedBook(null)}
            onPrev={() => handleMovePage('prev')}
            onNext={() => handleMovePage('next')}
            hasPrev={currentIndex > 0}
            hasNext={currentIndex < books.length - 1}
          />
        ) : (
          <>
            <SearchBar onSearch={(k, s) => handleSearch(k, s, 1)} isLoading={loading} />

            {mode === 'SHELF' && selectedTag && (
              <div className="my-6 border-b pb-4 flex items-center gap-4">
                <h2 className="text-lg font-bold text-slate-700">「{selectedTag}」({tagStats[selectedTag] || 0}冊) を表示中</h2>
                <select 
                  value={selectedTag} 
                  onChange={(e) => handleTagChange(e.target.value)} 
                  className="border p-2 rounded text-sm bg-white"
                >
                  {allTags.map(t => <option key={t} value={t}>{t} ({tagStats[t] || 0}冊)</option>)}
                </select>
              </div>
            )}

            {mode === 'SHELF' ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {shelfBooks.filter(b => b.userTags && b.userTags.includes(selectedTag)).map(book => (
<div 
        key={book.shelfId} 
        onClick={() => setSelectedBook(book)} 
        className="bg-white p-3 rounded shadow transition-all hover:shadow-lg hover:-translate-y-2 cursor-pointer border border-transparent hover:border-indigo-500 relative"
      >

{/* 修正後のデザイン：帯（リボン）スタイル */}
{book.userComment && (
  <div className="absolute top-2 left-0 z-10 w-full overflow-hidden">
    <div className="bg-red-600 text-white text-[12px] font-bold px-2 py-1 shadow-sm truncate">
      {book.userComment}
    </div>
  </div>
)}
        <img src={book.mediumImageUrl} className="w-full rounded" alt={book.title} />
        <p className="text-xs mt-2 font-bold truncate">{book.title}</p>
      </div>
                ))}
                {shelfBooks.length === 0 && (
                  <p className="col-span-full text-center text-sm text-slate-400 py-10">本棚に本がありません。上のバーから検索して追加してください。</p>
                )}
                {shelfBooks.length > 0 && shelfBooks.filter(b => b.userTags && b.userTags.includes(selectedTag)).length === 0 && (
                  <p className="col-span-full text-center text-sm text-slate-400 py-10">選択されたタグに該当する本がありません。</p>
                )}
              </div>
            ) : (
              <BookList 
                books={books} 
                totalHits={totalHits}
                hasMore={hasMore}
                onBookSelect={(i) => setSelectedBook(books[i])} 
                onBack={() => setMode('SHELF')}
                onLoadMore={() => handleSearch(currentKeyword, currentSort, currentPage + 1)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}