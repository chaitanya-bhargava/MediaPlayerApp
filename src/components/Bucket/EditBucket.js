import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import { useRef } from "react";
const EditBucket = (props) => {
  const renameInputRef = useRef();
  async function editBucketHandler(newBucket,bucketid) {
    await fetch(
      `https://internassignment-88d33-default-rtdb.firebaseio.com/buckets/${bucketid}.json`,
      {
        method: "PATCH",
        body: JSON.stringify(newBucket),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const onSaveHandler = (event) => {
    event.preventDefault();
    const enteredName = renameInputRef.current.value;
    if (enteredName === "") {
      return;
    }
    const newBucket={
        name:enteredName,
    }
    editBucketHandler(newBucket,props.bucketid);
    renameInputRef.current.value="";
    props.onClose();
  };
  return (
    <Modal onClose={props.onClose}>
      <form onSubmit={onSaveHandler}>
        Rename bucket to: <input name="rename" ref={renameInputRef}/>
        <Button text="Save" type="submit" />
      </form>
      <Button text="Close!" onClick={props.onClose} />
    </Modal>
  );
};
export default EditBucket;