'use client';

import { KoboBook } from '@/types/rakuten';
import { useBookshelf } from '@/hooks/useBookshelf';
import { Card, CardContent } from '@/components/ui/card';

interface BookListProps {
  books: KoboBook[];
  onBookSelect: (index: number) => void;
  totalHits: number;
  onBack: () => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

export default function BookList({ books, onBookSelect, totalHits, onBack, onLoadMore, hasMore }: BookListProps) {
  const { isBookInShelf } = useBookshelf();

// 上下共通のバナーUI
  const Banner = ({ position }: { position: 'top' | 'bottom' }) => (
    <div className="bg-red-600 text-white p-3 rounded-lg shadow-md flex items-center justify-between text-xs font-bold">
      <button onClick={onBack} className="underline">← 本棚に戻る</button>
      
      {/* 検索結果画面の上部バナー用の説明・リンクエリア */}
      <div className="flex items-center gap-4">
        <span>ヒット: {totalHits}件 / 表示: {books.length}件</span>
      </div>

      <span className="opacity-80">本をクリックし詳細を表示</span>
    </div>
  );

  return (
    <div className="space-y-4">
      <Banner position="top" />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {books.map((book, index) => (
          <div 
            key={index} 
            onClick={() => onBookSelect(index)}
            className="bg-white p-3 rounded shadow transition-all hover:shadow-lg hover:-translate-y-2 cursor-pointer border border-transparent hover:border-indigo-500 relative"
          >
            {/* 本棚マーク */}
            {isBookInShelf(book.itemNumber) && (
              <div className="absolute top-4 right-4 z-10 bg-yellow-400 text-white text-base font-bold px-2 py-1 rounded-full shadow-lg">📚</div>
            )}

            <img src={book.mediumImageUrl} alt={book.title} className="w-full rounded" />
            <p className="text-xs mt-2 font-bold truncate">{book.title}</p>
          </div>
        ))}
      </div>

      {hasMore && (
        <button onClick={onLoadMore} className="w-full py-3 bg-slate-200 text-slate-700 font-bold rounded hover:bg-slate-300">もっと見る</button>
      )}
      
      <Banner position="bottom" />
    </div>
  );
}