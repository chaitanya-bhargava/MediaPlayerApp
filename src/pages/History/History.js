import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDocs,collection } from "firebase/firestore";
import CardGrid from "../../components/CardGrid/CardGrid";
import { userSignIn, userSignOut } from "../../state/action-creaters";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
const History = () => {
    const [history,setHistory] =useState([]);
    const dispatch = useDispatch();
    const authUser = useSelector((state) => state.authReducer);
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
    useEffect(()=>{
      if(!authUser){
        return
      }
      const collectionsref = collection(db, "users",authUser.uid,"history");
      async function fetchData() {
        const querySnapshot = await getDocs(collectionsref);
        const data=querySnapshot.docs.map((doc)=>{
          return {
            id:doc.id,
            link:doc._document.data.value.mapValue.fields.link.stringValue,
            name:doc._document.data.value.mapValue.fields.name.stringValue,
            time:doc._document.data.value.mapValue.fields.time.stringValue
          }
        })
        setHistory(data);
      }
      fetchData();
    },[authUser])
  return (
    <div className="history">
      <h1>History</h1>
      <CardGrid type="history" list={history}/>
    </div>
  );
};

export default History;
