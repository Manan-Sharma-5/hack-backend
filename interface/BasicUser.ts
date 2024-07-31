export interface User {
  name: string;
  email: string;
  password: string;
  id: string;
  username: string;
}

export interface IndustrialUser extends User {
  company: string;
  charge: string;
  position: string;
}

export interface AdminUser extends User {
  role: string;
}
