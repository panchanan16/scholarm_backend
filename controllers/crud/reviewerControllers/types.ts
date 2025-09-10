export type ReqBody = {
  reviewer_id: number;
  reviewer_name: string;
  reviewer_email: string;
  reviewer_designation?: string;
  is_active: boolean;
  reviewer_password: string;
  journal_id: number
};
