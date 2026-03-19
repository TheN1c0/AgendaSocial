export interface User {
  id: string;
  nombre: string;
  email: string;
  role: 'ADMIN' | 'SOCIAL_WORKER' | string;
}
