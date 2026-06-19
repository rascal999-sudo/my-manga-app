'use client';

import { useState } from 'react';
import { useBookshelf } from '@/hooks/useBookshelf';
import EditModal from '@/components/EditModal';
import { Browser } from '@capacitor/browser';

interface BookDetailProps {
  book: any;
  onBackToList: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function BookDetail({
  book,
  onBackToList,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: BookDetailProps) {
  const { addBook, removeBook, isBookInShelf, isLoaded, shelfBooks, updateBook } = useBookshelf();
  const [editingBook, setEditingBook] = useState<any | null>(null);

  if (!book) return null;

  const inShelf = isLoaded ? isBookInShelf(book.itemNumber) : false;
  // 本棚登録済みのデータを探す
  const shelfData = shelfBooks.find((b) => b.shelfId === book.itemNumber || b.itemNumber === book.itemNumber);

  const renderStars = (rating: number) => {
    const stars = Math.round(rating || 0);
    return (
      <span className="text-amber-400 text-lg">
        {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
      </span>
    );
  };

// リンククリック時のハンドラー
const handleBuyClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
  // 環境がWebかアプリ（Capacitor）か判断して処理を分けるのがベストですが、
  // Capacitor環境で確実に外部ブラウザを開く場合は以下のようにします。
  if (typeof window !== 'undefined' && (window as any).Capacitor) {
    e.preventDefault(); // 通常のリンク遷移をキャンセル
    await Browser.open({ url: book.itemUrl }); // 外部ブラウザで開く
  }
};

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 border border-slate-200">
      {/* ナビゲーション */}
      <div className="flex justify-between items-center border-b pb-4">
        <button onClick={onBackToList} className="text-sm font-bold text-indigo-600 underline">← 一覧に戻る</button>
        <div className="flex gap-2">
          <button onClick={onPrev} disabled={!hasPrev} className="px-4 py-1.5 bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-30 text-sm font-bold">前へ</button>
          <button onClick={onNext} disabled={!hasNext} className="px-4 py-1.5 bg-slate-100 rounded hover:bg-slate-200 disabled:opacity-30 text-sm font-bold">次へ</button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* 表紙・操作エリア */}
        <div className="flex-shrink-0 w-full md:w-64 space-y-4">
          <img src={book.largeImageUrl || book.mediumImageUrl} alt={book.title} className="w-full h-auto shadow-md rounded border" />
          
          {/* 本棚操作ボタン */}
          {inShelf ? (
            <div className="space-y-2">
              <div className="w-full text-center p-3 bg-indigo-50 rounded-lg border border-indigo-200 font-bold text-indigo-700">📚 登録済み</div>
              <button onClick={() => removeBook(book.itemNumber)} className="w-full text-red-500 underline text-sm hover:text-red-700">本棚から削除</button>
            </div>
          ) : (
            <button onClick={() => addBook(book)} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition">
              📚 本棚に追加する
            </button>
          )}

{/* 購入ボタン */}
<a 
  href={book.itemUrl} 
  onClick={handleBuyClick} // onClickを追加
  target="_blank" 
  rel="noopener noreferrer" 
  className="block w-full text-center bg-slate-800 text-white font-bold py-3 rounded-lg hover:bg-slate-900 transition"
>
  楽天Koboで購入
</a>

          {/* タグ・コメント編集エリア（本棚登録時のみ） */}
          {inShelf && shelfData && (
            <div 
              onClick={() => setEditingBook(shelfData)}
              className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
            >
              <p className="text-[10px] font-bold text-slate-400 mb-2 group-hover:text-indigo-600">クリックしてタグ/メモを編集</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {shelfData.userTags.map((t: string) => <span key={t} className="text-[10px] bg-white px-2 py-0.5 rounded border">{t}</span>)}
              </div>
              <p className="text-xs text-slate-600 italic line-clamp-3">{shelfData.userComment || "コメントやタグを追加して本棚にならべましょう"}</p>
            </div>
          )}
        </div>
        
        {/* 詳細情報エリア */}
        <div className="flex-grow space-y-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">{book.title}</h1>
            <p className="text-slate-500 mt-1">{book.subTitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-slate-50 p-5 rounded-lg border border-slate-100">
            <p><strong>著者:</strong> {book.author || '不明'}</p>
            <p><strong>出版社:</strong> {book.publisherName || '不明'}</p>
            <p><strong>価格:</strong> {book.itemPrice ? `¥${book.itemPrice.toLocaleString()}` : '価格情報なし'}</p>
            <p><strong>ISBN:</strong> {book.isbn || '不明'}</p>
          </div>

          <div className="flex items-center gap-4 bg-amber-50 p-4 rounded-lg border border-amber-100">
            <div>
              <p className="text-xs font-bold text-slate-500">評価</p>
              {renderStars(book.reviewAverage)}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">平均</p>
              <p className="text-xl font-black">{book.reviewAverage || 0.0}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">件数</p>
              <p className="text-xl font-black">{book.reviewCount || 0}件</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-700">内容詳細</h3>
            <div className="text-sm text-slate-600 leading-relaxed max-h-48 overflow-y-auto border p-4 rounded bg-white">
              {book.itemCaption || '詳細な説明文はありません。'}
            </div>
          </div>
        </div>
      </div>

      {editingBook && (
        <EditModal book={editingBook} onClose={() => setEditingBook(null)} onSave={updateBook} />
      )}
    </div>
  );
}