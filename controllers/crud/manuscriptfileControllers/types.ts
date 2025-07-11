import { FileRequest } from "@/middleware/types";

export interface ReqBody extends FileRequest {
  article_id: number;
  manuscript_file?: string;
  manuscript_file_link?: string;
};
