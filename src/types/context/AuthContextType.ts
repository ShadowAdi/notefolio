import { UserInterface } from "../user/UserInterface";

export interface AuthContextInterface {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
  user:UserInterface|null
}
