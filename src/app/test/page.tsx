// src/app/test/page.tsx
'use client';

import { useState } from 'react';
import BookList from '@/components/BookList'; // 追加
import { KoboBook } from '@/types/rakuten';

export default function TestPage() {
  const [books, setBooks] = useState<KoboBook[]>([]); // 状態をKoboBookの配列に
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/search?keyword=ワンピース&sort=-releaseDate');
      const json = await res.json();
      // 楽天APIのレスポンス構造（Items[].Item）から配列を取り出す
      const extractedBooks = json.Items?.map((item: any) => item.Item) || [];
      setBooks(extractedBooks);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">UI・コンポーネントテスト</h1>
      <div className="text-center mb-6">
        <button 
          onClick={handleTest}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded font-medium disabled:bg-gray-400"
        >
          {loading ? '検索中...' : '「ワンピース」を検索してUIを表示'}
        </button>
      </div>

      {/* 作成したコンポーネントを配置 */}
      <BookList books={books} />
    </div>
  );
}