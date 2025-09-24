import { createContext, useState, useEffect, useContext } from "react";
import { authService } from "../services";
import { SplashScreen } from "../components/ui";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else authService.clearSession();

    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    function handleStorageChange(event) {
      if (
        (event.key === "user" && event.newValue === null) ||
        (event.key === "token" && event.newValue === null) ||
        (event.key === "refreshToken" && event.newValue === null)
      )
        authService.logout();
    }

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (isLoading) return <SplashScreen />;

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
