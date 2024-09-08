import { useRef,useState } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router";
import Heading from "../Heading/Heading";
import Button from "../Button/Button";
import ErrorText from "../ErrorText/ErrorText";
import "./SignIn.css"
import { doc, setDoc } from "firebase/firestore";
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
    const handleGuestLogin = async () => {
      setLoading(true);
      const guestEmail = `guest_${Math.random().toString(36).substring(7)}@example.com`;
    
      const response=await createUserWithEmailAndPassword(auth,guestEmail,Math.random().toString(36).substring(7));
            await setDoc(doc(db, "users", response.user.uid), {
              email:guestEmail
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
            setLoading(false)
            navigate('/');
    };
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
        {!loading && <Button onClick={handleGuestLogin} text="Guest Login"/>}
      </form>
    </div>
  );
};

export default SignIn;
