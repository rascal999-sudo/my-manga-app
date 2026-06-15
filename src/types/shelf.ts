// src/types/shelf.ts
import { KoboBook } from './rakuten';

// 読書ステータスの定義
export type ReadStatus = 'want_to_read' | 'reading' | 'read';

// 楽天の本データに、ユーザー独自のデータを追加した「本棚専用」の型
export interface ShelfBook extends KoboBook {
  shelfId: string;      // 本を一意に特定するID（楽天のitemNumberなどを使用）
  status: ReadStatus;   // 読書状態
  userTags: string[];   // ユーザーが付与したタグ（フェーズ2で使用）
  userComment: string;  // メモや感想（フェーズ2で使用）
  addedAt: number;      // 本棚に追加した日時（ソート用）
}