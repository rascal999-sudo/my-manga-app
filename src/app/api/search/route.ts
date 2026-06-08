import { NextResponse } from 'next/server';
import { fetchKoboBooks, KoboSort } from '@/lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const sort = (searchParams.get('sort') as KoboSort) || 'standard';
  const page = parseInt(searchParams.get('page') || '1', 10); // 💡 ページ番号を取得

  if (!keyword || keyword.trim() === '') {
    return NextResponse.json({ error: 'キーワードが必要です' }, { status: 400 });
  }

  try {
    const data = await fetchKoboBooks(keyword, sort, page); // 💡 ページ番号を渡す
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Route API Error:', error);
    return NextResponse.json(
      { error: error.message || '検索に失敗しました' }, 
      { status: 500 }
    );
  }
}