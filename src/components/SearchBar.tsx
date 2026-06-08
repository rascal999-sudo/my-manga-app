'use client';

import { useState } from 'react';
import { KoboSort } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SearchBarProps {
  onSearch: (keyword: string, sort: KoboSort) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState<KoboSort>('standard');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    onSearch(keyword, sort);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3 sm:space-y-0 sm:flex sm:gap-2 p-4 bg-background border-b sticky top-0 z-10">
      {/* 検索キーワード入力窓 */}
      <div className="flex-grow">
        <Input
          type="text"
          placeholder="漫画のタイトル、著者名など..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full"
        />
      </div>

      {/* ソート順切り替えセレクトボックス */}
      <div className="w-full sm:w-[180px]">
        <Select
          value={sort}
          onValueChange={(value) => setSort(value as KoboSort)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="並び替え" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">標準順</SelectItem>
            <SelectItem value="sales">人気順</SelectItem>
            <SelectItem value="-releaseDate">新着順</SelectItem>
            <SelectItem value="itemPrice">価格の安い順</SelectItem>
            <SelectItem value="-itemPrice">価格の高い順</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 検索ボタン */}
      <Button 
        type="submit" 
        disabled={isLoading || !keyword.trim()} 
        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
      >
        {isLoading ? '検索中...' : '検索'}
      </Button>
    </form>
  );
}