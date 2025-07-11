export type ReqBody = {
    reviewer_id: number;
    article_id: number;
    is_accepted: "accepted" | "rejected";
}