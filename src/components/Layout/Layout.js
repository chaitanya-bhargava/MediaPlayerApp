import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { setUser, clearUser } from "../../state/slices/authSlice";
import { fetchBuckets } from "../../state/slices/bucketsSlice";
import { fetchHistory } from "../../state/slices/historySlice";
import Navbar from "../Navbar/Navbar";

const Layout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(setUser({ uid: firebaseUser.uid, email: firebaseUser.email }));
        dispatch(fetchBuckets(firebaseUser.uid));
        dispatch(fetchHistory(firebaseUser.uid));
      } else {
        dispatch(clearUser());
      }
    });
    return unsubscribe;
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
