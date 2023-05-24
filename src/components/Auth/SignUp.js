import { useRef } from "react";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";
import Heading from "../Heading/Heading";
import Button from "../Button/Button";
import "./SignUp.css";
const SignUp = () => {
    const emailInputRef= useRef();
    const passInputRef= useRef();
    const navigate = useNavigate();
    async function onSubmitHandler(event){
        event.preventDefault();
        const enteredEmail=emailInputRef.current.value;
        const enteredPassword=passInputRef.current.value;
        const response=await createUserWithEmailAndPassword(auth,enteredEmail,enteredPassword);
        console.log(response);
        emailInputRef.current.value="";
        passInputRef.current.value="";
        navigate('/');
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
        <Button type="submit" text="Sign Up"/>
      </form>
    </div>
  );
};

export default SignUp;