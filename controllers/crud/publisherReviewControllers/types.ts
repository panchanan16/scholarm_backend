import { Decision } from "@prisma/client";

export type ReqBody = {
  article_id: number;
  admin_id: number;
  comments: string;
  admin_file: string;
  admin_file_link: string;
  main_decision: Decision;
  to_show: string[];
  round: number;
  email_email?: string;
  email_subject: string;
  email_body: string;
};
