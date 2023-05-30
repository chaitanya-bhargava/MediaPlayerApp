import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import { useRef,useState } from "react";
import ErrorText from "../ErrorModal/ErrorModal";
import { updateDoc,doc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../firebase";
import { fetchBuckets } from "../../state/action-creaters";

const EditBucket = (props) => {
  const authUser = useSelector((state)=>state.authReducer);
  const renameInputRef = useRef();
  const dispatch=useDispatch();
  const [error,setError] = useState(false);
  const [errorText,setErrorText] = useState("");
  async function editBucketHandler(newBucket,bucketid) {
    const docRef = doc(db, "users",authUser.uid,"buckets",`${bucketid}`);
    await updateDoc(docRef,newBucket);
    await dispatch(fetchBuckets(authUser.uid));
  }
  const onSaveHandler = (event) => {
    event.preventDefault();
    const enteredName = renameInputRef.current.value;
    if (enteredName === "") {
      setErrorText("Please enter a valid name!");
      setError(true);
      return;
    }
    const newBucket={
        name:enteredName,
    }
    editBucketHandler(newBucket,props.bucketid);
    renameInputRef.current.value="";
    setError(false);
    setErrorText("");
    props.onClose();
  };
  return (
    <Modal onClose={props.onClose}>
      <form onSubmit={onSaveHandler}>
        Rename bucket to: <input name="rename" ref={renameInputRef}/>
        {error && <ErrorText text={errorText}/>}
        <Button text="Save" type="submit" />
      </form>
      <Button text="Close!" onClick={props.onClose} />
    </Modal>
  );
};
export default EditBucket;