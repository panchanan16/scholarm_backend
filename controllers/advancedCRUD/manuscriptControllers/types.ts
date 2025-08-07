import { ArticleStatus } from "@prisma/client";

export interface ReqBody {
    status: ArticleStatus
}