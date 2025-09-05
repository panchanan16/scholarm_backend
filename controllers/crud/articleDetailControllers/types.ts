import { FileRequest } from "@/middleware/types";

// export interface ReqBody extends FileRequest {
//     article_id: number;
//     cover_letter: string;
//     cover_letter_file?: string;
//     cover_letter_file_link?: string;
//     isFunding: string;
//     isMaterial?: boolean | string;
//     material_file_link?: string;
//     materialFile?: string;
//     isCoding?: boolean | string;
//     code_file_link?: string;
//     codeFile?: string;
//     isData?: boolean | string;
//     data_file_link?: string;
//     dataFile?: string;
//     isHuman?: string;
//     isBoradApproval?: string;
//     approvalDetails?: string;
//     manuscript_file?: string;
//     manuscript_file_link?: string;
//     istick: boolean
// }

export interface ReqBody extends FileRequest {
  article_id: number;
  isConflictInterest: boolean;
  conflict?: string | null;

  isFunded: boolean;
  funding_info?: string | null;

  isEthical: boolean;
  ethical_info?: string | null;

  isInformedConsent: boolean;
  consent_info?: string | null;

  isClinical: boolean;
  clinical_info?: string | null;

  copyright: string;

  manuscript_file?: string | null;
  manuscript_file_link: string;
  istick?: boolean;
}
