import { useRef } from "react";
import { useState } from "react";
import ErrorText from "../ErrorModal/ErrorModal";
import Button from "../Button/Button";
import {db} from "../../firebase";
import { setDoc,doc } from "firebase/firestore";
import { useSelector } from "react-redux";

const AddCard = (props) => {
  const authUser = useSelector((state)=>state.authReducer);
  const nameInputRef = useRef();
  const linkInputRef = useRef();
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  async function addCardhandler(newCard) {
    await setDoc(doc(db, "users", authUser.uid,"buckets",`${props.id}`,"cards",`${newCard.id}`), {
        id:newCard.id,
        name:newCard.name,
        link:newCard.link
      });
  }
  const onSubmitHandler = (event) => {
    event.preventDefault();
    const enteredName = nameInputRef.current.value;
    const enteredLink = linkInputRef.current.value;
    if (enteredName === "" || enteredLink === "") {
      setErrorText("Please enter valid values!");
      setError(true);
      return;
    }
    if (
      !enteredLink.includes("www.youtube.com/watch?v") &&
      !enteredLink.includes("m.youtube.com/watch?v")
    ) {
      setErrorText("Please enter complete youtube video links only!");
      setError(true);
      return;
    }
    const newId=Math.floor(Math.random() * 99999999999)
    const newCard = {
      name: enteredName,
      link: enteredLink,
      id: String(newId)
    };
    nameInputRef.current.value = "";
    linkInputRef.current.value = "";
    setError(false);
    setErrorText("");
    addCardhandler(newCard);
  };
  return (
    <form onSubmit={onSubmitHandler} className="add-form">
      <h3>Add Another Video!</h3>
      Name: <input ref={nameInputRef} name="name" />
      <br />
      Link: <input ref={linkInputRef} name="link" />
      {error && <ErrorText text={errorText} />}
      <Button text="ADD" />
    </form>
  );
};

export default AddCard;
