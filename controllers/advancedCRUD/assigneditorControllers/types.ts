import { Decision, InviteStatus } from "@prisma/client";

export type ReqBody = {
  editor_id: number;
  article_id: number;
  editor_email?: string;
  status: "accepted" | "rejected";
  round: number;
  no_days?: number;
  is_completed: boolean;
  comments?: string;
  editor_file?: string;
  main_decision?: Decision; // enum
  reminder_date?: string;
  to_show?: string[];
  editor_file_link?: string;
};
