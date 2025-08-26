export type ReqBody = {
  template_id: number;
  template_type: string;
  template_name: string;
  template_for?: string;
  is_active: boolean;
  subject: string;
  body: string;
};
