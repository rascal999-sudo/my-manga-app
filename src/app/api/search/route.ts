import { NextResponse } from 'next/server';
import { fetchKoboBooks, KoboSort } from '@/lib/api';

// ❌ エラーの原因になっていた動的な export const dynamic = ... は完全に削除します。

export async function GET(request: Request) {
  // 💡 ① Capacitor用のビルド（静的エクスポート）時は、リクエスト解析を完全にスキップ。
  // これにより、Next.jsはビルド時に「このルートは動的リクエスト（URLSearchParams等）に依存していない」と判断し、
  // エラーを出さずに静的ファイルとして書き出してくれます。
  if (process.env.APP_ENV === 'cap') {
    return NextResponse.json({ 
      Items: [], 
      count: 0, 
      page: 1, 
      first: 1, 
      last: 0, 
      hits: 0, 
      carrier: 0, 
      pageCount: 0 
    });
  }

  // 💡 ② Vercel（本番）や Codespaces（run dev）で動く時は、ここが通常通り実行される
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const sort = (searchParams.get('sort') as KoboSort) || 'standard';
    const page = parseInt(searchParams.get('page') || '1', 10);

    if (!keyword || keyword.trim() === '') {
      return NextResponse.json({ error: 'キーワードが必要です' }, { status: 400 });
    }

    const data = await fetchKoboBooks(keyword, sort, page);
    
    // スマホアプリからのCORS通信を許可
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error: any) {
    console.error('Route API Error:', error);
    return NextResponse.json(
      { error: error.message || '検索に失敗しました' }, 
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}

// OPTIONSハンドラー（CORS対策用）はそのまま残す
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}