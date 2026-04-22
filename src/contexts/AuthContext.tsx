import { createContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/error";
import { AuthAPI } from "@/api";

interface UserData {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  isEmailVerified: boolean;
  role: string;
  status: string;
}

export interface AuthContextType {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  loading: boolean;
  loggedIn: boolean;
  login: (userData: UserData, token: string) => void;
  logout: () => Promise<void>;
  clearSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user info from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    const verifyToken = async () => {
      try {
        if (storedToken) {
          const res = await AuthAPI.verifyToken();
          if (res.status === 200) {
            setUser(res.data.data);
            setLoggedIn(true);
          } else logout();
        } else logout();
      } catch (error) {
        const msg =
          getErrorMessage(error) ||
          "Token verification failed. Please log in again.";
        toast.error(msg, { position: "top-right" });
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  // Login method
  const login = (userData: UserData, token: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    setLoggedIn(true);
  };
  // Logout method
  const logout = async () => {
    try {
      //   await AuthAPI.logout({ deviceId });
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      setLoggedIn(false);
    } catch (error) {
      console.error("Error logging out:", error);
      const msg = getErrorMessage(error) || "Logout failed. Please try again.";
      toast.error(msg, { position: "top-right" });
    }
  };

  const clearSession = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, loggedIn, login, logout, clearSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
