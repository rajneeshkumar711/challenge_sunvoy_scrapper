export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuthValues {
  access_token: string;
  openId: string;
  userId: string;
  apiuser: string;
  operateId: string;
  language: string;
  checkcode: string;
  timestamp: string;
}