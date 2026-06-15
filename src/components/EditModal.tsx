'use client';

import { useState } from 'react';
import { ShelfBook } from '@/types/shelf';

interface Props {
  book: ShelfBook;
  onClose: () => void;
  onSave: (shelfId: string, updates: Partial<ShelfBook>) => void;
}

// プリセットタグの定義（自由に追加・変更可能）
const PRESET_TAGS = ['読みたい', '積読', '泣ける', '全巻コンプ', '参考になる', '再読予定'];

export default function EditModal({ book, onClose, onSave }: Props) {
  const [comment, setComment] = useState(book.userComment || '');
  const [tags, setTags] = useState<string[]>(book.userTags || []);
  const [newTag, setNewTag] = useState('');

  // 閉じる際に自動保存
  const handleClose = () => {
    onSave(book.shelfId, { userTags: tags, userComment: comment });
    onClose();
  };

  // タグ追加ロジック
  const addTag = (tagName: string) => {
    const trimmed = tagName.trim();
    if (!trimmed) return;
    if (trimmed.length > 10) {
      alert('タグは10文字以内で入力してください');
      return;
    }
    if (!tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setNewTag('');
  };

  // タグ削除ロジック
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative shadow-2xl">
        {/* ×ボタン（保存して閉じる） */}
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-xl"
        >
          ✕
        </button>
        
        <h2 className="font-bold text-lg mb-6 text-slate-800">{book.title}</h2>
        
        {/* メモ入力 */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-slate-500 mb-2">メモ (最大200文字)</label>
          <textarea 
            maxLength={200}
            value={comment} 
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-slate-200 p-3 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            rows={4}
            placeholder="感想やメモを入力..."
          />
          <p className="text-right text-[10px] text-slate-400 mt-1">{comment.length}/200</p>
        </div>

        {/* タグ管理 */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-500 mb-2">タグ管理</label>
          
          {/* プリセットタグ選択 */}
          <div className="flex flex-wrap gap-2 mb-3">
            {PRESET_TAGS.map(t => (
              <button 
                key={t} 
                onClick={() => addTag(t)} 
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-colors"
              >
                + {t}
              </button>
            ))}
          </div>

          {/* 新規追加入力 */}
          <div className="flex gap-2 mb-3">
            <input 
              value={newTag} 
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTag(newTag)}
              className="flex-grow border border-slate-200 p-2 rounded text-sm outline-none focus:border-indigo-500"
              placeholder="新しいタグを追加..."
            />
          </div>

          {/* 現在のタグ一覧 */}
          <div className="flex flex-wrap gap-2">
            {tags.map(t => (
              <span key={t} className="bg-indigo-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                {t} 
                <button onClick={() => removeTag(t)} className="hover:text-indigo-200">✕</button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}