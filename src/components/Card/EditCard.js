import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import { useRef } from "react";
const EditCard = (props) => {
  const nameInputRef = useRef();
  const linkInputRef = useRef();
  async function editCardHandler(newCard,bucketid) {
    await fetch(
      `https://internassignment-88d33-default-rtdb.firebaseio.com/buckets/${bucketid}/cards/${props.card.id}.json`,
      {
        method: "PATCH",
        body: JSON.stringify(newCard),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const onSaveHandler = (event) => {
    event.preventDefault();
    const enteredName = nameInputRef.current.value;
    const enteredLink = linkInputRef.current.value;
    if (enteredName === "" || enteredLink==="") {
      return;
    }
    const newCard={
        name:enteredName,
        link:enteredLink,
    }
    editCardHandler(newCard,props.bucketid);
    nameInputRef.current.value="";
    linkInputRef.current.value="";
    props.onClose();
  };
  return (
    <Modal onClose={props.onClose}>
      <form onSubmit={onSaveHandler}>
        New Name: <input name="name" ref={nameInputRef}/><br/>
        New Link: <input name="name" ref={linkInputRef}/>
        <Button text="Save" type="submit" />
      </form>
      <Button text="Close!" onClick={props.onClose} />
    </Modal>
  );
};
export default EditCard;