import SignIn from "../../components/Auth/SignIn";
import SignUp from "../../components/Auth/SignUp";
import './Auth.css';

const AuthPage = () => {
  return (
    <div className="auth-page">
      <SignIn />
      <SignUp />
    </div>
  );
};

export default AuthPage;
