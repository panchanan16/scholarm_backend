export type reff = {
  ref_id: number,
  reffrence_html_id: string;
  article_id: number;
  reffrence: string
};

export interface ReqBody extends reff {
  reffrences: reff[];
}
