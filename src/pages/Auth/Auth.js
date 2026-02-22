import SignIn from "../../components/Auth/SignIn";
import SignUp from "../../components/Auth/SignUp";

const AuthPage = () => {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
      <div className="grid w-full max-w-4xl gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-t-4 border-t-primary/60 card-gradient p-8 shadow-sm">
          <SignIn />
        </div>
        <div className="rounded-xl border border-t-4 border-t-primary/40 card-gradient p-8 shadow-sm">
          <SignUp />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
