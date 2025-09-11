export interface JournalInput {
  journal_id?: number; 
  journal_type: string[];
  journal_issn: string;
  journal_eissn: string;
  journal_code: string;
  publication_type: string;
  journal_name: string;
  is_active?: boolean; 
}