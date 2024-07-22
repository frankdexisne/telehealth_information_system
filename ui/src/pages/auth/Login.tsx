import { AuthenticationForm } from "./AuthenticationForm";
import { Navigate } from "react-router-dom";

const Login = () => {
  if (localStorage.getItem(import.meta.env.VITE_TOKEN_NAME)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-sky-500 to-indigo-500">
      <AuthenticationForm />
    </div>
  );
};

export default Login;
