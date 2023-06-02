import { useRef } from "react";
import { useState } from "react";
import ErrorText from "../ErrorText/ErrorText";
import Button from "../Button/Button";
import {db} from "../../firebase";
import { setDoc,doc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { fetchCards } from "../../state/action-creaters";

const AddCard = (props) => {
  const authUser = useSelector((state)=>state.authReducer);
  const nameInputRef = useRef();
  const linkInputRef = useRef();
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const dispatch=useDispatch();
  async function addCardhandler(newCard) {
    await setDoc(doc(db, "users", authUser.uid,"buckets",`${props.id}`,"cards",`${newCard.id}`), {
        id:newCard.id,
        name:newCard.name,
        link:newCard.link
      });
    await dispatch(fetchCards({
      userID:authUser.uid,
      bucketid:props.id
    }))
  }
  function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length===11)? match[7] : false;
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
      !youtube_parser(enteredLink)
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
