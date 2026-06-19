'use client';

import { useState, useMemo, useEffect } from 'react'; // useEffect を追加
import { useBookshelf } from '@/hooks/useBookshelf';
import { ShelfBook, ReadStatus } from '@/types/shelf';
import { useRouter } from 'next/navigation';
import EditModal from '@/components/EditModal';

// 受賞作のマスターデータをインポート
import awardedData from '@/data/awardedBooks2025.json';

export default function ShelfPage() {
  const { shelfBooks, isLoaded, removeBooks, updateBook, updateShelf } = useBookshelf();
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingBook, setEditingBook] = useState<ShelfBook | null>(null);

// ★追加：レビューモーダル用状態
  const [showReviewModal, setShowReviewModal] = useState(false);
  const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.example.mybookshelf";

  // 本棚設定画面の表示回数カウント処理
  useEffect(() => {
    if (!isLoaded) return;
    
    const COUNT_KEY = "my_shelf_view_count";
    const currentCount = parseInt(localStorage.getItem(COUNT_KEY) || "0") + 1;
    localStorage.setItem(COUNT_KEY, currentCount.toString());

    // 10回目に表示（テスト時は >= 1 にするとすぐ確認できます）
    if (currentCount === 12) {
      setShowReviewModal(true);
      // カウントをリセットしたい場合はここで 0 にする
      // localStorage.setItem(COUNT_KEY, "0"); 
    }
  }, [isLoaded]);


  // 永続化キー
  const HIDE_AWARDED_KEY = "my_shelf_hide_awarded";

  // 受賞データをSet化して高速マッチングを可能にする
  const awardedItemNumbers = useMemo(() => {
    return new Set(awardedData.map((b: any) => b.itemNumber));
  }, []);

  // 非表示フラグの初期値を localStorage からロード
  const [hideAwarded, setHideAwarded] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(HIDE_AWARDED_KEY) === 'true';
    }
    return false;
  });

  // 非表示フラグの切り替えと保存
  const handleToggleHideAwarded = (checked: boolean) => {
    setHideAwarded(checked);
    localStorage.setItem(HIDE_AWARDED_KEY, String(checked));
  };

  // ★ メンテナンス用：受賞データを強制的に再読み込みする関数（維持）
  const handleImportAwardedData = () => {
    if (!window.confirm('システム内の「2025年度 受賞作品」データを本棚に再読み込みしますか？\n（すでに登録済みの本は重複しません）')) {
      return;
    }

    const updatedShelf = [...shelfBooks];
    let importedCount = 0;

    awardedData.forEach((book: any) => {
      const isExist = shelfBooks.some(b => b.itemNumber === book.itemNumber);
      if (!isExist) {
        const newBook: ShelfBook = {
          ...book,
          shelfId: book.itemNumber,
          status: (book.status as ReadStatus) || 'want_to_read',
          userTags: book.userTags && book.userTags.length > 0 ? book.userTags : ["2025年度 受賞作品"],
          userComment: book.userComment || '',
          addedAt: book.addedAt || Date.now(),
        };
        updatedShelf.unshift(newBook);
        importedCount++;
      }
    });
    updateShelf(updatedShelf);
    alert(`データの同期が完了しました。\n新しく ${importedCount} 冊の受賞作品を追加・復元しました。`);
  };

  // 表示する本のフィルタリング
  const filteredBooks = useMemo(() => {
    if (!hideAwarded) return shelfBooks;
    return shelfBooks.filter(b => !awardedItemNumbers.has(b.itemNumber));
  }, [shelfBooks, hideAwarded, awardedItemNumbers]);

  const toggleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredBooks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBooks.map(b => b.shelfId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length > 0 && window.confirm(`${selectedIds.length}冊を削除しますか？`)) {
      removeBooks(selectedIds);
      setSelectedIds([]);
    }
  };

  if (!isLoaded) return <div className="p-8 text-center text-slate-500">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-foreground">
      <header className="bg-red-600 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="text-white hover:opacity-80 font-bold">◀ 戻る</button>
            <h1 onClick={() => router.push('/')} className="text-lg font-bold cursor-pointer">本棚設定</h1>
            <p className="text-[10px] opacity-80">～埋もれていた名作に出会える～　本棚を整理しましょう。</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">登録書籍一覧 ({filteredBooks.length}冊)</h2>
            <div className="flex gap-2">
              <button onClick={handleImportAwardedData} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">
                🔄 受賞作品を同期
              </button>
              <button onClick={toggleSelectAll} className="bg-slate-600 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-slate-700">
                {selectedIds.length === filteredBooks.length ? '全解除' : '全選択'}
              </button>
              <button onClick={handleBulkDelete} disabled={selectedIds.length === 0} className="bg-red-600 text-white px-3 py-1.5 rounded text-xs font-bold disabled:bg-slate-300 hover:bg-red-700">
                削除 ({selectedIds.length})
              </button>
            </div>
          </div>
          
          <label className="flex items-center gap-2 text-sm font-bold text-slate-600 cursor-pointer">
            <input 
              type="checkbox" 
              checked={hideAwarded} 
              onChange={(e) => handleToggleHideAwarded(e.target.checked)} 
              className="w-4 h-4" 
            />
            度受賞作品を非表示にする
          </label>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-100 text-slate-500">
            {hideAwarded ? "受賞作品を除外したため表示する本はありません" : "本棚は空です"}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredBooks.map((book) => (
              <div 
                key={book.shelfId} 
                onClick={() => setEditingBook(book)} 
                className={`bg-white p-3 rounded-lg shadow-sm border-2 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
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
                <p className="text-[10px] text-slate-500 italic line-clamp-2 mb-2">{book.userComment || "メモを追加..."}</p>
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


{/* ★追加：レビュー依頼用モーダル */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">本棚整理、お疲れ様です！</h3>
            <p className="text-sm text-slate-600 mb-6">
              いつもご利用ありがとうございます。本棚は綺麗になりましたか？ぜひストアでレビューを書いて応援してください！
            </p>
            <div className="flex gap-2">
              <button onClick={() => setShowReviewModal(false)} className="flex-1 py-2 text-sm font-bold text-slate-500">今はいいや</button>
              <button 
                onClick={() => { window.open(PLAY_STORE_URL, "_blank"); setShowReviewModal(false); }} 
                className="flex-1 py-2 bg-red-600 text-white rounded font-bold text-sm"
              >
                レビューを書く
              </button>
            </div>
          </div>
        </div>
      )}

        {editingBook && (
          <EditModal 
            book={editingBook} 
            onClose={() => setEditingBook(null)} 
            onSave={updateBook} 
          />
        )}
      </div>
    </div>
  );
}