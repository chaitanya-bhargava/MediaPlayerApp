import { useRef, useState } from "react";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";
import Heading from "../Heading/Heading";
import Button from "../Button/Button";
import { setDoc,doc, } from "firebase/firestore";
import { db } from "../../firebase";
import "./SignUp.css";
import ErrorText from "../ErrorText/ErrorText";

const SignUp = () => {
    const emailInputRef= useRef();
    const passInputRef= useRef();
    const passInputRef2= useRef();
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [errorText,setErrorText] = useState("");
    const [loading,setLoading] = useState(false);
    async function onSubmitHandler(event){
        event.preventDefault();
        setLoading(true);
        const enteredEmail=emailInputRef.current.value;
        const enteredPassword=passInputRef.current.value;
        const enteredPassword2=passInputRef2.current.value;
        try{
          if(enteredPassword!==enteredPassword2){
            throw new Error("Passwords do not match")
          }
          const response=await createUserWithEmailAndPassword(auth,enteredEmail,enteredPassword);
          await setDoc(doc(db, "users", response.user.uid), {
            email:enteredEmail
          });
          await setDoc(doc(db, "users", response.user.uid,"buckets","0"), {
            id:"0",
            name: "Entertainment Videos"
          });
          await setDoc(doc(db, "users", response.user.uid,"buckets","1"), {
            id:"1",
            name: "Educational Videos"
          });
          await setDoc(doc(db, "users", response.user.uid,"buckets","2"), {
            id:"2",
            name: "Funny Videos"
          });
          await setDoc(doc(db, "users", response.user.uid,"buckets","3"), {
            id:"3",
            name: "Vlogs"
          });
          await setDoc(doc(db, "users", response.user.uid,"buckets","4"), {
            id:"4",
            name: "Product Reviews"
          });
          setError(false)
          setErrorText("")
          emailInputRef.current.value="";
          passInputRef.current.value="";
          passInputRef2.current.value="";
          setLoading(false)
          navigate('/');
        }
        catch(err){
          setError(true)
          if(err.message==="Firebase: Error (auth/email-already-in-use)."){
            setErrorText("Email already in use")
          }
          else if(err.message==="Firebase: Password should be at least 6 characters (auth/weak-password)."){
            setErrorText("Password should be at least 6 characters long")
          }
          else{
            setErrorText(err.message)
          }
          setLoading(false)
        }
    }
  return (
    <div className="sign-up">
      <Heading text="Create Account"/>
      <form onSubmit={onSubmitHandler}>
        <input
          type="email"
          placeholder="Enter Email"
          name="email"
          ref={emailInputRef}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          name="password"
          ref={passInputRef}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          name="password"
          ref={passInputRef2}
          required
        />
        {error && <ErrorText text={errorText}/>}
        {loading && <img className="loading" src="loading.gif" alt="loading"/>}
        {!loading && <Button type="submit" text="Sign Up"/>}
      </form>
    </div>
  );
};

export default SignUp;
