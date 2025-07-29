import { Decision, reviewerType } from "@prisma/client";

export type ReqBody = {
  reviewer_id: number;
  article_id: number;
  is_accepted: "accepted" | "rejected";
  is_completed: boolean;
  is_under_scope?: boolean;
  is_need_revision?: boolean;
  editor_comment?: string;
  comment?: string;
  reviewerDecision?: Decision;
  attach_file?: string;
  attach_file_link?: string;
  reviewer_type: reviewerType
};
