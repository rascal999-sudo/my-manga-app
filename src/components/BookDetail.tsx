import { KoboBook } from '@/types/rakuten';
import { useBookshelf } from '@/hooks/useBookshelf'; // ★追加

interface BookDetailProps {
  book: KoboBook;
  onBackToList: () => void;
  onBackToTop: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function BookDetail({
  book,
  onBackToList,
  onBackToTop,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: BookDetailProps) {

// ★追加：本棚フックを呼び出す
  const { addBook, removeBook, isBookInShelf, isLoaded } = useBookshelf();

  if (!book) return null;

  // ★追加：この本が既に本棚にあるかチェック
  const inShelf = isLoaded ? isBookInShelf(book.itemNumber) : false;

  // ★ 修正ポイント: 星評価を安全にレンダリングする関数
  const renderStars = (reviewAverage: any) => {
    // 文字列やundefinedで来ても、強制的に数値に変換（ダメなら0点にする）
    const rating = Number(reviewAverage) || 0;
    // 星の数は 0〜5 の間に必ず収める
    const num = Math.min(5, Math.max(0, Math.round(rating)));
    
    return (
      <div className="flex items-center gap-1">
        <span className="text-amber-500">{'★'.repeat(num)}{'☆'.repeat(5 - num)}</span>
        <span className="text-xs font-bold text-slate-700 ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6 border border-slate-100">
      {/* ナビゲーションバー */}
      <div className="flex justify-between items-center border-b pb-4">
        <button
          onClick={onBackToList}
          className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
        >
          ← 一覧に戻る
        </button>
        <div className="flex gap-2">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 rounded text-xs font-medium transition-colors"
          >
            前へ
          </button>
          <button
            onClick={onNext}
            disabled={!hasNext}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 rounded text-xs font-medium transition-colors"
          >
            次へ
          </button>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0 mx-auto md:mx-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={book.largeImageUrl}
            alt={book.title}
            className="w-48 h-auto object-contain rounded shadow-sm border border-slate-200 bg-slate-50"
          />
        </div>
        
        <div className="flex-grow space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">{book.title}</h2>
            {book.titleKana && <p className="text-xs text-muted-foreground mt-0.5">{book.titleKana}</p>}
          </div>

          <div className="space-y-1.5 text-sm text-slate-700">
            <p><span className="font-medium text-slate-400 mr-2">著者</span>{book.author || '---'}</p>
            <p><span className="font-medium text-slate-400 mr-2">出版社</span>{book.publisherName || '---'}</p>
            <p><span className="font-medium text-slate-400 mr-2">発売日</span>{book.salesDate || '---'}</p>
            <p className="text-xl font-black text-red-600 pt-1">
              ¥{book.itemPrice?.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">（税込）</span>
            </p>
          </div>

          {/* レビューセクション */}
          <div className="flex items-center gap-2 border-t border-b py-2 my-2 bg-slate-50/50 px-3 rounded-lg">
            <span className="text-xs font-semibold text-slate-500">評価</span>
            {renderStars(book.reviewAverage)}
            <span className="text-xs text-slate-400">({book.reviewCount || 0}件のレビュー)</span>
          </div>

          {/* あらすじ */}
          {book.itemCaption && (
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">作品紹介</h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg max-h-40 overflow-y-auto whitespace-pre-wrap">
                {book.itemCaption}
              </p>
            </div>
          )}


{/* あらすじの下あたりに「本棚ボタン」を追加 */}
          <div className="pt-2 flex flex-col md:flex-row gap-3">
            <a
              href={book.itemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-center md:flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-2.5 px-6 rounded-lg shadow-sm transition-colors"
            >
              楽天Koboで詳細を見る
            </a>
            
            {/* ★追加：本棚追加/削除ボタン */}
            <button
              onClick={() => inShelf ? removeBook(book.itemNumber) : addBook(book)}
              className={`inline-block text-center md:flex-1 font-bold text-sm py-2.5 px-6 rounded-lg shadow-sm transition-colors border ${
                inShelf 
                  ? 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200' 
                  : 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {inShelf ? '本棚から外す' : '📚 本棚に追加'}
            </button>
          </div>


        </div>
      </div>
    </div>
  );
}