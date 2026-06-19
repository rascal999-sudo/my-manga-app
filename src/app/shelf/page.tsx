'use client';

import { useState } from 'react';
import { useBookshelf } from '@/hooks/useBookshelf';
import { ShelfBook, ReadStatus } from '@/types/shelf';
import { useRouter } from 'next/navigation';
import EditModal from '@/components/EditModal';

// ★ 受賞作のマスターJSONデータをインポート
import awardedData from '@/data/awardedBooks2025.json';

export default function ShelfPage() {
  const { shelfBooks, isLoaded, removeBook, removeBooks, updateBook, updateShelf } = useBookshelf();
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingBook, setEditingBook] = useState<ShelfBook | null>(null);

  const toggleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // カードクリックのモーダル発火を防ぐ
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length > 0 && window.confirm(`${selectedIds.length}冊を削除しますか？`)) {
      removeBooks(selectedIds);
      setSelectedIds([]);
    }
  };

  // ★ メンテナンス用：受賞データを強制的に再読み込み（インポート）する関数
  const handleImportAwardedData = () => {
    if (!window.confirm('システム内の「2025年度 受賞作品」データを本棚に再読み込みしますか？\n（すでに登録済みの本は重複しません）')) {
      return;
    }

    // 現在の本棚データをベースにする
    const updatedShelf = [...shelfBooks];
    let importedCount = 0;

    awardedData.forEach((book: any) => {
      // 既に本棚に同じ itemNumber が存在するかチェック
      const isExist = shelfBooks.some(b => b.itemNumber === book.itemNumber);
      
      if (!isExist) {
        // 存在しない場合のみ、本棚の型（ShelfBook）に合わせて新しく追加
        const newBook: ShelfBook = {
          ...book,
          shelfId: book.itemNumber,
          status: (book.status as ReadStatus) || 'want_to_read',
          userTags: book.userTags && book.userTags.length > 0 ? book.userTags : ["2025年度 受賞作品"],
          userComment: book.userComment || '',
          addedAt: book.addedAt || Date.now(),
        };
        updatedShelf.unshift(newBook); // 先頭に追加
        importedCount++;
      }
    });

    // カスタムフック経由で状態とローカルストレージを一括更新
    updateShelf(updatedShelf);
    alert(`データの同期が完了しました。\n新しく ${importedCount} 冊の受賞作品を追加・復元しました。`);
  };

  if (!isLoaded) return <div className="p-8 text-center text-slate-500">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-foreground">
      <header className="bg-red-600 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-white hover:opacity-80 font-bold">◀ 戻る</button>
            <h1 onClick={() => router.push('/')} className="text-lg font-bold cursor-pointer">本棚設定</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">登録書籍一覧 ({shelfBooks.length}冊)</h2>
            {/* ★ 受賞データ読み込み用のメンテナンスボタン */}
            <button
              onClick={handleImportAwardedData}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-sm"
            >
              🔄 受賞データを同期
            </button>
          </div>
          <button 
            onClick={handleBulkDelete}
            disabled={selectedIds.length === 0}
            className="bg-red-600 text-white px-4 py-2 rounded text-sm font-bold disabled:bg-slate-300 transition-colors"
          >
            一括削除 ({selectedIds.length})
          </button>
        </div>

        {shelfBooks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-100 text-slate-500">本棚は空です</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {shelfBooks.map((book) => (
              <div 
                key={book.shelfId} 
                onClick={() => setEditingBook(book)} 
                className={`bg-white p-3 rounded-lg shadow-sm border-2 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-2 ${
                  selectedIds.includes(book.shelfId) ? 'border-red-500' : 'border-transparent'
                }`}
              >
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(book.shelfId)}
                    onClick={(e) => toggleSelect(e, book.shelfId)}
                    onChange={() => {}} 
                    className="w-5 h-5 absolute top-0 left-0 z-10"
                  />
                  <img src={book.mediumImageUrl} alt={book.title} className="w-full h-auto object-contain mb-3 rounded" />
                </div>
                
                <h3 className="text-sm font-bold line-clamp-2 mb-1">{book.title}</h3>
                
                <p className="text-[10px] text-slate-500 italic line-clamp-2 mb-2">
                  {book.userComment || "メモを追加..."}
                </p>
                <div className="flex flex-wrap gap-1">
                  {book.userTags.map(t => (
                    <span key={t} className="text-[9px] bg-indigo-50 text-indigo-700 px-1 rounded truncate max-w-[60px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {editingBook && (
          <EditModal book={editingBook} onClose={() => setEditingBook(null)} onSave={updateBook} />
        )}
      </div>
    </div>
  );
}