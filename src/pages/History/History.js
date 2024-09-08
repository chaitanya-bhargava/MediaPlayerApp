import { useEffect } from "react";
import { useSelector } from "react-redux";
import CardGrid from "../../components/CardGrid/CardGrid";
import { fetchHistory, userSignIn, userSignOut } from "../../state/action-creaters";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
const History = () => {
    const dispatch = useDispatch();
    const history = useSelector((state) => state.fetchHistoryReducer);
    useEffect(() => {
      const listen = onAuthStateChanged(auth, (user) => {
        if (user) {
          dispatch(userSignIn(user));
          dispatch(fetchHistory(user.uid));
        } else {
          dispatch(userSignOut());
        }
      });
      return () => {
        return listen()
      }
    },[dispatch]);
  return (
    <div className="history">
      <h1>History</h1>
      <CardGrid type="history" list={history}/>
    </div>
  );
};

export default History;
