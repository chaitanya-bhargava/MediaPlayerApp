import "./Card.css";
import MediaPlayer from "../MediaPlayer/MediaPlayer";
import EditCard from "./EditCard";
import { useState } from "react";
import MoveCard from "./MoveCard";
import { useSelector } from "react-redux";
import {db} from "../../firebase";
import { doc,deleteDoc, collection,addDoc } from "firebase/firestore";

const Card = (props) => {
  const [mediaIsShown, setMediaIsShown] = useState(false);
  const [moveIsShown, setMoveIsShown] = useState(false);
  const [editIsShown, setEditIsShown] = useState(false);
  const authUser = useSelector((state)=>state.authReducer)
  async function addHistoryHandler(newHistory) {
    await addDoc(collection(db, "users", authUser.uid,"history"), {
      time:newHistory.time,
      name:newHistory.name,
      link:newHistory.link
    });
  }
  const showMediaHandler = () => {
    setMediaIsShown(true);
    var current = new Date().toLocaleString();
    const newHistory = {
      name: props.name,
      link: props.link,
      time: current,
    };
    addHistoryHandler(newHistory);
  };

  const hideMediaHandler = () => {
    setMediaIsShown(false);
  };

  const showMoveHandler = () => {
    setMoveIsShown(true);
  };
  const hideMoveHandler = () => {
    setMoveIsShown(false);
  };
  const showEditHandler = () => {
    setEditIsShown(true);
  };
  const hideEditHandler = () => {
    setEditIsShown(false);
  };

  async function onDeleteHandler() {
      await deleteDoc(doc(db, "users", authUser.uid,"buckets",`${props.bucketid}`,"cards",`${props.id}`));
  }
  function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length===11)? match[7] : false;
}
  const videoid=youtube_parser(props.link)
  return (
    <div>
      <div className="card">
        <img
          className="card-edit"
          src="edit.png"
          alt="edit"
          onClick={showEditHandler}
        />
        <img
          className="del"
          src="dustbin.png"
          alt="delete"
          onClick={onDeleteHandler}
        />
        <img
          className="move"
          src="move.png"
          alt="move"
          onClick={showMoveHandler}
        />
        <img
          className="card-image"
          src={props.image}
          alt="img"
          onClick={showMediaHandler}
        />
        <div className="card-text">
          Name: {props.name}
          <br />
          <a href={props.link} target="_blank" rel="noreferrer">
            LINK
          </a>
          <br />
        </div>
      </div>
      {mediaIsShown && <MediaPlayer id={videoid} onClose={hideMediaHandler} />}
      {moveIsShown && (
        <MoveCard
          bucketlist={props.bucketlist}
          card={props}
          onClose={hideMoveHandler}
        />
      )}
      {editIsShown && (
        <EditCard
          bucketid={props.bucketid}
          card={props}
          onClose={hideEditHandler}
        />
      )}
    </div>
  );
};
export default Card;
