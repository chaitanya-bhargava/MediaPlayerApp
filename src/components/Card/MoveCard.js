import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import { useRef } from "react";
const MoveCard = (props) => {
  const destInputRef = useRef();
  async function addCardhandler(newCard,bucketid) {
    await fetch(
      `https://internassignment-88d33-default-rtdb.firebaseio.com/buckets/${bucketid}/cards.json`,
      {
        method: "POST",
        body: JSON.stringify(newCard),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  async function onDeleteHandler(){
    await fetch(`https://internassignment-88d33-default-rtdb.firebaseio.com/buckets/${props.card.bucketid}/cards/${props.card.id}.json`,{
      method:'delete',
    })
  }

  const onSaveHandler = (event) => {
    event.preventDefault();
    const enteredDest = destInputRef.current.value;
    if (enteredDest === "") {
      return;
    }
    const newCard={
        id:props.card.id,
        name:props.card.name,
        link:props.card.link
    }
    addCardhandler(newCard,destInputRef.current.value);
    onDeleteHandler();
    destInputRef.current.value = "";
    props.onClose();
  };
  return (
    <Modal onClose={props.onClose}>
      <form onSubmit={onSaveHandler}>
        Move Card to:
        <select ref={destInputRef} id="cars" name="dest">
        {props.bucketlist.map((item) => (
          <option value={item.id}>{item.name}</option>
      ))}
        </select>
        <Button text="Save" type="submit" />
      </form>
      <Button text="Close!" onClick={props.onClose} />
    </Modal>
  );
};
export default MoveCard;
