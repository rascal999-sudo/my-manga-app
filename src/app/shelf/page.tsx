'use client';

import { useState, useMemo } from 'react';
import { useBookshelf } from '@/hooks/useBookshelf';
import { ShelfBook } from '@/types/shelf';
import Link from 'next/link';
import EditModal from '@/components/EditModal';

export default function ShelfPage() {
  const { shelfBooks, isLoaded, removeBook, updateBook } = useBookshelf();
  const [keyword, setKeyword] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<ShelfBook | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    shelfBooks.forEach((b) => b.userTags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [shelfBooks]);

  const filteredBooks = useMemo(() => {
    return shelfBooks.filter((book) => {
      const matchesKeyword = book.title.toLowerCase().includes(keyword.toLowerCase());
      const matchesTag = selectedTag ? book.userTags.includes(selectedTag) : true;
      return matchesKeyword && matchesTag;
    });
  }, [shelfBooks, keyword, selectedTag]);

  if (!isLoaded) return <div className="p-8 text-center text-slate-500">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-2xl font-bold text-slate-800">📚 わたしの本棚</h1>
          <p className="text-sm text-slate-500 mt-2">
            検索窓右のセレクトボックスから、設定した<strong>タグで絞り込み検索</strong>が可能です。
          </p>
        </header>

        {shelfBooks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-100 text-slate-500">
            本棚は空っぽです。
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm border border-slate-100">
              <input
                type="text"
                placeholder="タイトルで検索..."
                className="flex-grow border p-2 rounded text-sm"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <select
                className="border p-2 rounded text-sm bg-white"
                onChange={(e) => setSelectedTag(e.target.value || null)}
                value={selectedTag || ''}
              >
                <option value="">すべてのタグで表示</option>
                {allTags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filteredBooks.map((book) => (
                <div 
                  key={book.shelfId} 
                  onClick={() => setEditingBook(book)} // ★カードクリックでモーダル
                  className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex flex-col cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <img src={book.mediumImageUrl} alt={book.title} className="w-full h-auto object-contain mb-3 rounded" />
                  <h3 className="text-sm font-bold line-clamp-2 mb-1">{book.title}</h3>
{/* メモの表示（50文字制限） */}
  <p className="text-[10px] text-slate-500 mt-2 italic line-clamp-2">
    {book.userComment ? (book.userComment.length > 50 ? `${book.userComment.substring(0, 50)}...` : book.userComment) : "メモを追加..."}
  </p>

  <div className="flex flex-wrap gap-1 mt-2">
      {book.userTags.map(t => <span key={t} className="text-[9px] bg-indigo-50 text-indigo-700 px-1 rounded">{t}</span>)}
  </div>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeBook(book.shelfId); }}
                    className="mt-4 self-end text-slate-400 hover:text-red-500 transition-colors"
                    aria-label="削除"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {editingBook && (
          <EditModal book={editingBook} onClose={() => setEditingBook(null)} onSave={updateBook} />
        )}
      </div>
    </div>
  );
}