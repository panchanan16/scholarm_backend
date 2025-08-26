export type ReqBody = {
  reviewers: { reviewer_id: number; article_id: number }[];
  article_id?: number;
  reviewer_id?: number;
  round: number;
};
