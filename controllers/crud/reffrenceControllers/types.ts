export type reff = {
  reffrence_id: number;
  article_id: number;
  reference_type: string;
  authors?: string;
  title?: string;
  source?: string;
  year?: number;
  volume?: number;
  issue?: number;
  pages?: string;
  doi?: string;
  publisher?: string;
  issn?: string;
  url?: string;
  accessed?: string;
};

export interface ReqBody extends reff {
  reffrences: reff[];
}
