import "./Home.css";
import BucketList from "../../components/BucketList/BucketList";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { userSignIn, userSignOut } from "../../state/action-creaters";
import { NavLink } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
const Home = () => {
  const authUser = useSelector((state) => state.authReducer);
  const [buckets, setBuckets] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(userSignIn(user));
      } else {
        dispatch(userSignOut());
      }
    });
    return () => {
      return listen()
    }
  },[dispatch]);
  useEffect(() => {
    if(!authUser){
      return
    }
    const collectionsref = collection(db, "users",authUser.uid,"buckets");
    async function fetchData() {
      const querySnapshot = await getDocs(collectionsref);
      const data=querySnapshot.docs.map((doc)=>{
        return {
          id:doc._document.data.value.mapValue.fields.id.stringValue,
          name:doc._document.data.value.mapValue.fields.name.stringValue
        }
      })
      setBuckets(data);
    }
    fetchData();
  }, [authUser]);
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
        <h1>Welcome to Media Player!</h1>
        <h2>Sign Up or Log in to continue</h2>
        <button className="custom-button">
          <NavLink to={"/auth"}>Sign Up/Log In</NavLink>
        </button>
      </div>
    );
  }
};

export default Home;
