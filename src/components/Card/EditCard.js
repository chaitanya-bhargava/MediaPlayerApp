import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import ErrorText from "../ErrorModal/ErrorModal";
import { useRef,useState } from "react";
const EditCard = (props) => {
  const nameInputRef = useRef();
  const linkInputRef = useRef();
  const [error,setError] = useState(false);
  const [errorText,setErrorText] = useState("");
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
    if(enteredName==="" || enteredLink===""){
      setErrorText("Please enter valid values!");
      setError(true);
      return;
  }
  if(!enteredLink.includes("www.youtube.com/watch?v")){
      setErrorText("Please enter youtube video links only!");
      setError(true);
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
        {error && <ErrorText text={errorText}/>}
        <Button text="Save" type="submit" />
      </form>
      <Button text="Close!" onClick={props.onClose} />
    </Modal>
  );
};
export default EditCard;