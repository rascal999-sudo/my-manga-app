import { RakutenKoboResponse } from '@/types/rakuten';

const APP_ID = process.env.RAKUTEN_APPLICATION_ID;
const AFFILIATE_ID = process.env.RAKUTEN_AFFILIATE_ID;

export async function fetchKoboBooks(keyword: string): Promise<RakutenKoboResponse> {
  const baseUrl = 'https://app.rakuten.co.jp/services/api/Kobo/EbookSearch/20170426';
  
  const params = new URLSearchParams({
    applicationId: APP_ID!,
    affiliateId: AFFILIATE_ID!,
    keyword: keyword,
    format: 'json',
  });

  const response = await fetch(`${baseUrl}?${params.toString()}`);

  if (!response.ok) {
    throw new Error('楽天APIへのリクエストに失敗しました');
  }

  return response.json();
}