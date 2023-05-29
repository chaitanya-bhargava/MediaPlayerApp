import CardGrid from "../CardGrid/CardGrid"
import Heading from "../Heading/Heading";
import AddCard from '../Card/AddCard';
import { useState,useEffect } from "react";
import './Bucket.css';
import EditBucket from "./EditBucket";
import { useSelector } from "react-redux";
import { db } from "../../firebase";
import { collection,getDocs,deleteDoc,doc } from "firebase/firestore";
const Bucket=(props)=>{
  const authUser = useSelector((state)=>state.authReducer);
  const [editIsShown,setEditIsShown] = useState(false);
  const [data,setData] = useState([]);
  useEffect(() => {
    const collectionsref = collection(db, "users",authUser.uid,"buckets",`${props.id}`,"cards");
    async function fetchData() {
      const querySnapshot = await getDocs(collectionsref);
        const data=querySnapshot.docs.map((doc)=>{
          return {
            id:doc._document.data.value.mapValue.fields.id.stringValue,
            name:doc._document.data.value.mapValue.fields.name.stringValue,
            link:doc._document.data.value.mapValue.fields.link.stringValue,
          }
        })
        setData(data);
      }
      fetchData();
    }, [authUser,props]);
    const showEditHandler = () => {
      setEditIsShown(true);
    }

    const hideEditHandler = () => {
      setEditIsShown(false);
    }

    async function onClearHandler(){
      for(let x of data){
        await deleteDoc(doc(db, "users", authUser.uid,"buckets",`${props.id}`,"cards",x.id));
      }
    }

    return(
        <div className="bucket">
        <img className="edit" src="edit.png" alt="edit" onClick={showEditHandler}/>
        <img className="clear" src="broom.png" alt="clear" onClick={onClearHandler}/>
        <Heading text={props.text}/>
        <CardGrid bucketlist={props.bucketlist} bucketid={props.id} list={data}/>
        <AddCard id={props.id}/>
        {editIsShown && <EditBucket onClose={hideEditHandler} bucketid={props.id}/>}
        </div>
    )
}
export default Bucket;