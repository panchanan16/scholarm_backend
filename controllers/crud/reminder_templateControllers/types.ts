export type ReqBody = {
  reminder_id: number;
  template_id: number;
  description: string;
  is_active: boolean;
  sent_to?: string;
  based_on?: number;
  timing?: string;
};
