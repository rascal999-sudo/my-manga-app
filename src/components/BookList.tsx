// src/components/BookList.tsx
import { KoboBook } from '@/types/rakuten';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface BookListProps {
  books: KoboBook[];
  onBookSelect: (index: number) => void; // ★追加：選択されたインデックスを親に伝える
}

export default function BookList({ books, onBookSelect }: BookListProps) {
  if (!books || books.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        該当する漫画が見つかりませんでした。
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
      {books.map((book, index) => (
        <Card 
          key={index} 
          onClick={() => onBookSelect(index)} // ★追加：カードクリックで詳細へ
          className="flex flex-col h-full justify-between overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02] bg-white"
        >
          <CardHeader className="p-0">
            <div className="relative w-full aspect-[3/4] bg-muted flex items-center justify-center overflow-hidden">
              {book.mediumImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={book.mediumImageUrl} alt={book.title} className="object-cover w-full h-full" loading="lazy" />
              ) : (
                <span className="text-xs text-muted-foreground">No Image</span>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-3 flex-grow">
            <CardTitle className="text-sm font-bold line-clamp-2 min-h-[2.5rem] mb-1">
              {book.title}
            </CardTitle>
            <p className="text-xs text-muted-foreground truncate">{book.author}</p>
            <p className="text-xs font-semibold text-rose-600 mt-1">
              {book.itemPrice > 0 ? `${book.itemPrice.toLocaleString()}円` : '無料'}
            </p>
          </CardContent>

          <CardFooter className="p-3 pt-0" onClick={(e) => e.stopPropagation()}>
            {/* ★ e.stopPropagation() で詳細画面への遷移をバブリング防止 */}
            <a
              href={book.itemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-3 rounded transition-colors"
            >
              楽天Koboで見る
            </a>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}