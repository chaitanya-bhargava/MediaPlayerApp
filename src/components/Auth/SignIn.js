import { useRef } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";
import Heading from "../Heading/Heading";
import Button from "../Button/Button";
import "./SignIn.css"
const SignIn = () => {
    const emailInputRef= useRef();
    const passInputRef= useRef();
    const navigate = useNavigate();
    async function onSubmitHandler(event){
        event.preventDefault();
        const enteredEmail=emailInputRef.current.value;
        const enteredPassword=passInputRef.current.value;
        const response=await signInWithEmailAndPassword(auth,enteredEmail,enteredPassword);
        console.log(response);
        emailInputRef.current.value="";
        passInputRef.current.value="";
        navigate('/');
    }
  return (
    <div className="sign-in">
      <Heading text="Sign In"/>
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
        <Button type="submit" text="Sign In"/>
      </form>
    </div>
  );
};

export default SignIn;
