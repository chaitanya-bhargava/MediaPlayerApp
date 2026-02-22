import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router";
import { fetchBuckets } from "../../state/slices/bucketsSlice";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { setDoc, doc } from "firebase/firestore";
import { DEFAULT_BUCKETS } from "../../constants";
import { Loader2, AlertCircle } from "lucide-react";

const SignIn = () => {
  const emailRef = useRef();
  const passRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passRef.current.value
      );
      emailRef.current.value = "";
      passRef.current.value = "";
      navigate("/");
    } catch (err) {
      const msg = err.code;
      if (msg === "auth/user-not-found") setError("No account found with this email.");
      else if (msg === "auth/wrong-password") setError("Invalid credentials.");
      else if (msg === "auth/invalid-credential") setError("Invalid email or password.");
      else setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGuestLogin() {
    setLoading(true);
    setError("");
    try {
      const guestEmail = `guest_${Math.random().toString(36).slice(2, 10)}@mediaplayer.app`;
      const guestPass = Math.random().toString(36).slice(2, 14);
      const { user } = await createUserWithEmailAndPassword(auth, guestEmail, guestPass);
      await setDoc(doc(db, "users", user.uid), { email: guestEmail });
      for (const bucket of DEFAULT_BUCKETS) {
        await setDoc(doc(db, "users", user.uid, "buckets", bucket.id), bucket);
      }
      dispatch(fetchBuckets(user.uid));
      navigate("/");
    } catch {
      setError("Guest login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Sign In</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signin-email">Email</Label>
          <Input
            id="signin-email"
            type="email"
            placeholder="you@example.com"
            ref={emailRef}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signin-pass">Password</Label>
          <Input
            id="signin-pass"
            type="password"
            placeholder="Enter your password"
            ref={passRef}
            required
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleGuestLogin}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Try as Guest
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
