"use client";

import { AuthContextInterface } from "@/types/context/AuthContextType";
import { UserInterface } from "@/types/user/UserInterface";
import axios from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextInterface>({
  isAuthenticated: false,
  token: null,
  login: () => {},
  logout: () => {},
  loading: true,
  user: null,
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserInterface | null>(null);

  const getUser = async (jwtToken: string) => {
    try {
      const response = await axios.get("/api/auth/user", {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      if (response.status === 200 && response.data.success) {
        setUser(response.data.user);
      } else {
        toast.error(response.data.message || "Failed to load user");
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      getUser(savedToken); 
    }
    setLoading(false);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    getUser(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        login,
        logout,
        loading,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
