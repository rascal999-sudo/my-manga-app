// src/app/test/page.tsx
'use client';

import { useState } from 'react';

export default function TestPage() {
  const [data, setData] = useState<any>(null);

  const handleTest = async () => {
    // 動作確認用に「ワンピース」で固定検索してみる
    const res = await fetch('/api/search?keyword=ワンピース');
    const json = await res.json();
    setData(json);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">API接続テスト</h1>
      <button 
        onClick={handleTest}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        APIを呼び出す
      </button>
      <pre className="mt-4 p-4 bg-gray-100 overflow-auto max-h-96">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}