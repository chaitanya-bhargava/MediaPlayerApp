import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";
import { fetchBuckets } from "../../state/slices/bucketsSlice";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { DEFAULT_BUCKETS } from "../../constants";
import { Loader2, AlertCircle } from "lucide-react";

const SignUp = () => {
  const emailRef = useRef();
  const passRef = useRef();
  const passConfirmRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const password = passRef.current.value;
    const confirm = passConfirmRef.current.value;

    if (password !== confirm) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        emailRef.current.value,
        password
      );
      await setDoc(doc(db, "users", user.uid), {
        email: emailRef.current.value,
      });
      for (const bucket of DEFAULT_BUCKETS) {
        await setDoc(doc(db, "users", user.uid, "buckets", bucket.id), bucket);
      }
      dispatch(fetchBuckets(user.uid));
      emailRef.current.value = "";
      passRef.current.value = "";
      passConfirmRef.current.value = "";
      navigate("/");
    } catch (err) {
      const code = err.code;
      if (code === "auth/email-already-in-use")
        setError("This email is already registered.");
      else if (code === "auth/weak-password")
        setError("Password must be at least 6 characters.");
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold tracking-tight mb-6">
        Create Account
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            ref={emailRef}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-pass">Password</Label>
          <Input
            id="signup-pass"
            type="password"
            placeholder="Min 6 characters"
            ref={passRef}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-confirm">Confirm Password</Label>
          <Input
            id="signup-confirm"
            type="password"
            placeholder="Repeat your password"
            ref={passConfirmRef}
            required
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
