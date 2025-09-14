import { createContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

interface AuthData {
  username?: string;
  email?: string;
}

interface AuthContextType {
  auth: AuthData;
  setAuth: React.Dispatch<React.SetStateAction<AuthData>>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>({
  auth: {},
  setAuth: () => {},
});

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthData>({});
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    const storedUser = localStorage.getItem("rememberedUser");
    const storedUserSession = sessionStorage.getItem("rememberedUser");

    if (storedUser) {
      try {
        setAuth(JSON.parse(storedUser));
      } catch (e) {
        console.error("Invalid JSON in localStorage", e);
      }
    } else if (storedUserSession) {
      try {
        setAuth(JSON.parse(storedUserSession));
      } catch (e) {
        console.error("Invalid JSON in localStorage", e);
      }
    }
    
  }, []);

  if ((!auth.email || !auth.username) && pathname !== "/") {
    return (
      <div className="flex items-center justify-center flex-col gap-3  h-full w-screen">
        <p className="text-red-400 text-center">
          Unauthorized
          <br /> Please login first.
        </p>

        <span className="bg-blue-400 block cursor-pointer text-sm hover:bg-indigo-400 rounded-2xl p-2 text-blue-50">
          <Link to={"/"}>
            <button>To Home</button>
          </Link>
        </span>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default ContextProvider;
