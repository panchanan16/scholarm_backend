import { ArticleStatus, InviteStatus } from "@prisma/client";

export interface ReqBody {
    status: ArticleStatus
    editorStatus: InviteStatus,
    reviewerStatus: InviteStatus,
    completed: string,
    article_id: number,
    role: string,
    userId: number,
    processed: string
}