export interface ReqBody {
  admin_id: number;
  email?: string;
  password?: string;
  current_password?: string;
  new_password?: string;
  confirm_password?: string;
  admin_name?: string;
}
