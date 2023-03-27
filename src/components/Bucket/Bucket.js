import CardGrid from "../CardGrid/CardGrid"
import Heading from "../Heading/Heading";
import AddCard from '../Card/AddCard';
import { useState } from "react";
import './Bucket.css';
import EditBucket from "./EditBucket";
const Bucket=(props)=>{
  const [editIsShown,setEditIsShown] = useState(false);
    const loadedCards=[];
    const data=props.list;
    for(const key in data){
      loadedCards.push({
        id:key,
        name:data[key].name,
        link:data[key].link
      });
    }

    const showEditHandler = () => {
      setEditIsShown(true);
    }

    const hideEditHandler = () => {
      setEditIsShown(false);
    }

    async function onClearHandler(){
      await fetch(`https://internassignment-88d33-default-rtdb.firebaseio.com/buckets/${props.id}/cards.json`,{
        method:'delete',
      })
    }

    return(
        <div className="bucket">
        <img className="edit" src="edit.png" alt="edit" onClick={showEditHandler}/>
        <img className="clear" src="broom.png" alt="clear" onClick={onClearHandler}/>
        <Heading text={props.text}/>
        <CardGrid bucketlist={props.bucketlist} bucketid={props.id} list={loadedCards}/>
        <AddCard id={props.id}/>
        {editIsShown && <EditBucket onClose={hideEditHandler} bucketid={props.id}/>}
        </div>
    )
}
export default Bucket;