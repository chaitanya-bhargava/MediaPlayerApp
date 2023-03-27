import './ErrorModal.css'
const ErrorText = (props) => {
return (
    <p className='error-text'>{props.text}</p>
  );
};
export default ErrorText;