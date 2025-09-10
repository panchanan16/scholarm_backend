export interface ReqBody {
  system_admin_id: number;
  email?: string;
  password?: string;
  current_password?: string;
  new_password?: string;
  confirm_password?: string;
  system_admin_name?: string;
}