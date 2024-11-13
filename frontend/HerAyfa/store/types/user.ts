export interface User {
  name: string;
  email: string;
  id: string;
  photoURL: string;
}

export interface UserStore {
  user: User | null;
  setUser: () => Promise<void>;
  clearUser: () => Promise<void>;
}
