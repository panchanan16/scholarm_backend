export interface JournalIssueInput {
  iss_id: number;
  iss_name: string;
  is_special: boolean;
  is_published: boolean;
  created_at?: string | null;
  journal_id: number;
  vol_id: number;
}