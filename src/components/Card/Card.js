import "./Card.css";
import MediaPlayer from "../MediaPlayer/MediaPlayer";
import EditCard from "./EditCard";
import { useState } from "react";
import MoveCard from "./MoveCard";
const Card = (props) => {
  const [mediaIsShown, setMediaIsShown] = useState(false);
  const [moveIsShown, setMoveIsShown] = useState(false);
  const [editIsShown, setEditIsShown] = useState(false);
  async function addHistoryHandler(newHistory) {
    await fetch(
      `https://internassignment-88d33-default-rtdb.firebaseio.com/history.json`,
      {
        method: "POST",
        body: JSON.stringify(newHistory),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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
    await fetch(
      `https://internassignment-88d33-default-rtdb.firebaseio.com/buckets/${props.bucketid}/cards/${props.id}.json`,
      {
        method: "delete",
      }
    );
  }

  const videolink = new URL(props.link);
  const videoid = videolink.searchParams.get("v");
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
