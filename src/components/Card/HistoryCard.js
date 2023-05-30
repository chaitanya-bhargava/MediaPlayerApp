import "./Card.css";
import {db} from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { doc,deleteDoc } from "firebase/firestore";
import { fetchHistory } from "../../state/action-creaters";
const HistoryCard = (props) => {
  const authUser=useSelector((state)=>state.authReducer)
  const dispatch=useDispatch();
    async function onDeleteHandler(){
      await deleteDoc(doc(db, "users", authUser.uid,"history",`${props.id}`));
      await dispatch(fetchHistory(authUser.uid))
    }
  return (
    <div>
      <div className="history-card">
        <img className="del" src="dustbin.png" alt="delete" onClick={onDeleteHandler}/>
        <div className="card-text">
          Name: {props.name}
          <br />
          <a href={props.link} target="_blank" rel="noreferrer">
            LINK
          </a>
          <br />
          Time: {props.time}
        </div>
      </div>
    </div>
  );
};
export default HistoryCard;
