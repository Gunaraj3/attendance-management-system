import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
 
  const login = async ({ email, password }, redirect = "") => {
   
    let headersList = {
      "Content-Type": "application/json",
    };

    let bodyContent = JSON.stringify({
      email: email,
      password: password,
    });

    let response = await fetch("http://localhost:8000/login", {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    });

    let data = await response.json();
    let success = data.success;

    if (!success) {
      return data;
    }
    localStorage.setItem("token", data.result.token);
    localStorage.setItem("role", data.result.role);
  
    

    console.log("redirecting ....");

    navigate(redirect, { replace: true });
  };

  const logout = async ({ url }) => {
    let token = localStorage.getItem("token");
    if (token) {
      console.log("insideeee");
      let response = await fetch("http://localhost:8000/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate(`/`, { replace: true });
    }
  };
  const token = () => {
    let token = localStorage.getItem("token");
    return token ? token : null;
  };
  const role = () => {
    let role = localStorage.getItem("role");
    return role ? role : null;
  };

  const email = () => {
    let email = localStorage.getItem("email");
    return email ? email : null;
  };
  
  

  return (
    <AuthContext.Provider value={{ token, login, logout, email,role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const user = useContext(AuthContext);

  return user;
};
