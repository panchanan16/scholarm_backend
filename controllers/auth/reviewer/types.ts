export interface ReqBody {
  reviewer_id: number;
  email?: string;
  password?: string;
  current_password?: string;
  new_password?: string;
  confirm_password?: string;
  reviewer_name?: string;
}
