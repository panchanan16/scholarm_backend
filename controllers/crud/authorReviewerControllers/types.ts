import { reviewerType } from "@prisma/client"

export type ReqBody = {
    reviewers: { article_id: number, reviewer_id: number, reviewer_type: reviewerType}[]
}

export type ReqQuery = {
    article_id: number;
    reviewer_id?: number;
}