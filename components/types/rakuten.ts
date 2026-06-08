export interface KoboBook {
  title: string;
  author: string;
  itemPrice: number;
  itemUrl: string;
  mediumImageUrl: string;
  salesDate: string;
  seriesName?: string;
}

export interface RakutenKoboResponse {
  Items: { Item: KoboBook }[];
  count: number;
  page: number;
  pageCount: number;
}