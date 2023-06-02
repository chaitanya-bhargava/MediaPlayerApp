import { useRef,useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";
import Heading from "../Heading/Heading";
import Button from "../Button/Button";
import ErrorText from "../ErrorText/ErrorText";
import "./SignIn.css"
const SignIn = () => {
  const emailInputRef= useRef();
  const passInputRef= useRef();
  const [error, setError] = useState(false);
  const [errorText,setErrorText] = useState("");
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);
    async function onSubmitHandler(event){
        event.preventDefault();
        setLoading(true)
        const enteredEmail=emailInputRef.current.value;
        const enteredPassword=passInputRef.current.value;
        try{
          await signInWithEmailAndPassword(auth,enteredEmail,enteredPassword);
          setError(false)
          setErrorText("")
          emailInputRef.current.value="";
          passInputRef.current.value="";
          setLoading(false)
          navigate('/');
        }  
        catch(err){
          setError(true)
          console.log(err.message)
          if(err.message==="Firebase: Error (auth/user-not-found)."){
            setErrorText("User not found")
          }
          else if(err.message==="Firebase: Error (auth/wrong-password)."){
            setErrorText("Invalid Credentials")
          }
          setLoading(false)
        }
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
        {error && <ErrorText text={errorText}/>}
        {loading && <img className="loading" src="loading.gif" alt="loading"/>}
        {!loading && <Button type="submit" text="Sign In"/>}
      </form>
    </div>
  );
};

export default SignIn;
