import CardGrid from "../CardGrid/CardGrid"
import Heading from "../Heading/Heading";
import AddCard from '../Card/AddCard';
import { useState,useEffect } from "react";
import './Bucket.css';
import EditBucket from "./EditBucket";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../firebase";
import { deleteDoc,doc } from "firebase/firestore";
import { fetchCards } from "../../state/action-creaters";

const Bucket=(props)=>{
  const authUser = useSelector((state)=>state.authReducer);
  const [editIsShown,setEditIsShown] = useState(false);
  const allCards=useSelector((state)=>state.fetchCardsReducer);
  const cards=allCards[`${props.id}`]
  const dispatch=useDispatch();
  useEffect(() => {
    dispatch(fetchCards({
      userID:authUser.uid,
      bucketid:props.id
    }))
    }, [authUser,props,dispatch]);
    const showEditHandler = () => {
      setEditIsShown(true);
    }

    const hideEditHandler = () => {
      setEditIsShown(false);
    }

    async function onClearHandler(){
      for(let x of cards){
        await deleteDoc(doc(db, "users", authUser.uid,"buckets",`${props.id}`,"cards",x.id));
      }
      await dispatch(fetchCards({
        userID:authUser.uid,
        bucketid:props.id
      }));
    }

    return(
        <div className="bucket">
        <img className="edit" src="edit.png" alt="edit" onClick={showEditHandler}/>
        <img className="clear" src="broom.png" alt="clear" onClick={onClearHandler}/>
        <Heading text={props.text}/>
        {cards && <CardGrid bucketlist={props.bucketlist} bucketid={props.id} list={cards}/>}
        <AddCard id={props.id}/>
        {editIsShown && <EditBucket onClose={hideEditHandler} bucketid={props.id}/>}
        </div>
    )
}
export default Bucket;