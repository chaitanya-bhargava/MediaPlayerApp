import "./Home.css";
import BucketList from "../../components/BucketList/BucketList";
import { useEffect} from "react";
import { useSelector } from "react-redux";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { fetchBuckets, userSignIn, userSignOut } from "../../state/action-creaters";
import { NavLink } from "react-router-dom";

const Home = () => {
  const authUser = useSelector((state) => state.authReducer);
  const buckets = useSelector((state)=>state.fetchBucketsReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(userSignIn(user));
        dispatch(fetchBuckets(user.uid));
      } else {
        dispatch(userSignOut());
      }
    });
    return () => {
      return listen()
    }
  },[dispatch]);
  if (authUser) {
    return (
      <div className="home">
        <h1>Home</h1>
        <BucketList list={buckets}/>
      </div>
    );
  } else {
    return (
      <div className="home-signout">
        <h1>Welcome to <span className="mediaplayer-span">Media Player</span>!</h1>
        <NavLink to={"/auth"} className="custom-button">Sign Up/Log in</NavLink>
      </div>
    );
  }
};

export default Home;
