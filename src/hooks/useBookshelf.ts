// src/hooks/useBookshelf.ts
'use client';

import { useState, useEffect } from 'react';
import { KoboBook } from '@/types/rakuten';
import { ShelfBook, ReadStatus } from '@/types/shelf';

const STORAGE_KEY = 'kobo_manga_bookshelf';

export function useBookshelf() {
  const [shelfBooks, setShelfBooks] = useState<ShelfBook[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初回レンダリング時にローカルストレージからデータを読み込む
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setShelfBooks(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse bookshelf data', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 本棚を更新してローカルストレージにも保存する関数
  const updateShelf = (newShelf: ShelfBook[]) => {
    setShelfBooks(newShelf);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newShelf));
  };

  // 本棚に本を追加する関数
  const addBook = (book: KoboBook, status: ReadStatus = 'want_to_read') => {
    // 既に本棚にある場合は何もしない
    if (shelfBooks.some(b => b.itemNumber === book.itemNumber)) return;

    const newBook: ShelfBook = {
      ...book,
      shelfId: book.itemNumber,
      status,
      userTags: [],
      userComment: '',
      addedAt: Date.now(),
    };

    updateShelf([newBook, ...shelfBooks]);
  };

  // 本棚から本を削除する関数
  const removeBook = (itemNumber: string) => {
    const newShelf = shelfBooks.filter(b => b.itemNumber !== itemNumber);
    updateShelf(newShelf);
  };

  // 本が本棚に登録されているかチェックする関数
  const isBookInShelf = (itemNumber: string) => {
    return shelfBooks.some(b => b.itemNumber === itemNumber);
  };

  /*
  const updateBook = (shelfId: string, updates: Partial<ShelfBook>) => {
  const newShelf = shelfBooks.map(b => 
    b.shelfId === shelfId ? { ...b, ...updates } : b
  );
  updateShelf(newShelf);
};
*/

const updateBook = (shelfId: string, updates: Partial<ShelfBook>) => {
  setShelfBooks((prev) =>
    prev.map((b) => (b.shelfId === shelfId ? { ...b, ...updates } : b))
  );
  // ローカルストレージへの反映
  const updatedShelf = shelfBooks.map((b) => (b.shelfId === shelfId ? { ...b, ...updates } : b));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedShelf));
};

  return {
    shelfBooks,
    isLoaded,
    addBook,
    removeBook,
    isBookInShelf,
    updateBook,
  };
}