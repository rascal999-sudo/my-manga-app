// src/hooks/useBookshelf.ts
'use client';

import { useState, useEffect } from 'react';
import { KoboBook } from '@/types/rakuten';
import { ShelfBook, ReadStatus } from '@/types/shelf';
// ★ 2025年受賞作のJSONデータをインポート
import awardedData from '@/data/awardedBooks2025.json';

const STORAGE_KEY = 'kobo_manga_bookshelf';
const SYSTEM_DEFAULT_TAG = "2025年度 受賞作品";

export function useBookshelf() {
  const [shelfBooks, setShelfBooks] = useState<ShelfBook[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初回レンダリング時にローカルストレージからデータを読み込む（または初期データを注入）
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setShelfBooks(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse bookshelf data', e);
      }
    } else {
      // ★D案：初回起動時のみ、自分が登録したデータとしてJSONを流し込む
      try {
        const initialBooks: ShelfBook[] = awardedData.map((book: any) => ({
          ...book,
          shelfId: book.itemNumber, // itemNumberを棚IDとして利用
          status: (book.status as ReadStatus) || 'want_to_read',
          userTags: book.userTags && book.userTags.length > 0 ? book.userTags : [SYSTEM_DEFAULT_TAG],
          userComment: book.userComment || '',
          addedAt: book.addedAt || Date.now(),
        }));

        setShelfBooks(initialBooks);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBooks));
      } catch (e) {
        console.error('Failed to inject initial awarded books data', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 本棚を更新してローカルストレージにも保存する共通関数
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

  // 複数まとめて本棚から削除する関数
  const removeBooks = (shelfIds: string[]) => {
    const newShelf = shelfBooks.filter(b => !shelfIds.includes(b.shelfId));
    updateShelf(newShelf);
  };

  // 本が本棚に登録されているかチェックする関数
  const isBookInShelf = (itemNumber: string) => {
    return shelfBooks.some(b => b.itemNumber === itemNumber);
  };

  // 本の情報を更新（タグやコメント編集用）する関数
  const updateBook = (shelfId: string, updates: Partial<ShelfBook>) => {
    // ステートの更新
    setShelfBooks((prev) =>
      prev.map((b) => (b.shelfId === shelfId ? { ...b, ...updates } : b))
    );
    // 最新の状態を計算してローカルストレージに直接反映（ステート更新の遅延対策）
    const updatedShelf = shelfBooks.map((b) => (b.shelfId === shelfId ? { ...b, ...updates } : b));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedShelf));
  };

  return {
    shelfBooks,
    isLoaded,
    addBook,
    removeBook,
    removeBooks, 
    updateShelf, 
    isBookInShelf,
    updateBook,
  };
}