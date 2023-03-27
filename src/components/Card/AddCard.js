import { useRef } from "react";
import { useState } from "react";
import ErrorText from "../ErrorModal/ErrorModal";
import Button from "../Button/Button";

const AddCard= props =>{
    const nameInputRef= useRef();
    const linkInputRef= useRef();
    const [error,setError] = useState(false);
    const [errorText,setErrorText] = useState("");
    async function addCardhandler(newCard){
        await fetch(`https://internassignment-88d33-default-rtdb.firebaseio.com/buckets/${props.id}/cards.json`,{
            method:'POST',
            body:JSON.stringify(newCard),
            headers:{
                'Content-Type':'application/json'
            }
        });
    }
    const onSubmitHandler = (event) => {
        event.preventDefault();
        const enteredName=nameInputRef.current.value;
        const enteredLink=linkInputRef.current.value;
        if(enteredName==="" || enteredLink===""){
            setErrorText("Please enter valid values!");
            setError(true);
            return;
        }
        if(!enteredLink.includes("www.youtube.com")){
            setErrorText("Please enter youtube links only!");
            setError(true);
            return;
        }
        const newCard={
            name:enteredName,
            link:enteredLink,
            id:Math.floor(Math.random() * 99999999999)
        }
        nameInputRef.current.value="";
        linkInputRef.current.value="";
        setError(false);
        setErrorText("");
        addCardhandler(newCard);
    }
    return (
        <form onSubmit={onSubmitHandler} className="add-form">
            <h3>Add Another Card!</h3>
            Name: <input ref={nameInputRef} name="name"/><br/>
            Link: <input ref={linkInputRef} name="link"/>
            {error && <ErrorText text={errorText}/>}
            <Button text="ADD"/>
        </form>
    )
}

export default AddCard;