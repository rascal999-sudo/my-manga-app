import { KoboBook } from '@/types/rakuten';

export type KoboSort = 'standard' | 'sales' | '+itemPrice' | '-itemPrice' | 'reviewAverage' | 'reviewCount' | '-releaseDate';

export interface RakutenKoboResponse {
  Items: { Item: KoboBook }[];
  count: number;
  page: number;
  first: number;
  last: number;
  hits: number;
  pageCount: number;
}

export async function fetchKoboBooks(
  keyword: string,
  sort: KoboSort = 'standard',
  page: number = 1
): Promise<RakutenKoboResponse> {
  // 💡 重要: Capacitorのビルド（静的エクスポート）時は、環境変数がなくてもエラーにせず空データを返す
  if (process.env.APP_ENV === 'cap') {
    return { Items: [], count: 0, page: 1, first: 1, last: 0, hits: 0, pageCount: 0 };
  }

  const APP_ID = process.env.RAKUTEN_APPLICATION_ID;
  const ACCESS_KEY = process.env.RAKUTEN_ACCESS_KEY;
  const AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID;

  // 💡 本番（Vercel）での実行時のみ、キーの存在チェックを行う
  if (!APP_ID || !ACCESS_KEY) {
    throw new Error('API IDまたはAccess Keyが設定されていません');
  }

  if (!keyword || keyword.trim() === '') {
    throw new Error('キーワードが必要です');
  }

  const baseUrl = 'https://openapi.rakuten.co.jp/services/api/Kobo/EbookSearch/20170426';
  
  const params = new URLSearchParams({
    applicationId: APP_ID,
    accessKey: ACCESS_KEY,
    keyword: keyword.trim(),
    sort: sort,
    koboGenreId: '101', // コミック・漫画限定
    format: 'json',
    hits: '30',
    page: page.toString(),
  });

  if (AFFILIATE_ID) {
    params.append('affiliateId', AFFILIATE_ID);
  }

  const url = `${baseUrl}?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error_description || '楽天APIの通信に失敗しました');
  }

  return response.json();
}