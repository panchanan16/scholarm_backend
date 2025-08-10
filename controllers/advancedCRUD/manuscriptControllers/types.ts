import { ArticleStatus } from "@prisma/client";

export interface ReqBody {
    status: ArticleStatus
    article_id: number
}