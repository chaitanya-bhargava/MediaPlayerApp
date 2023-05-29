import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import { useRef } from "react";
import {db} from "../../firebase";
import { doc,deleteDoc,setDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
const MoveCard = (props) => {
  const destInputRef = useRef();
  const authUser = useSelector((state)=>state.authReducer)
  async function addCardhandler(newCard,bucketid) {
    await setDoc(doc(db, "users", authUser.uid,"buckets",`${bucketid}`,"cards",`${newCard.id}`), {
      id:newCard.id,
      name:newCard.name,
      link:newCard.link
    });
  }

  async function onDeleteHandler(){
    await deleteDoc(doc(db, "users", authUser.uid,"buckets",`${props.card.bucketid}`,"cards",`${props.card.id}`));
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
