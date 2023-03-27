import './Button.css'
const Button =(props)=>{
    return <button className="custom-button" onClick={props.onClick} type={props.type}>
            {props.text}
    </button>
}

export default Button;