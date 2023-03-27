import './Modal.css';
const Backdrop = (props) => {
    return <div className='backdrop' onClick={props.onClose}/>
}
const ModalOverlay= props => {
    return <div className='modal'>
        <div className='content'>{props.children}</div>
    </div>
}
const Modal = props => {
    return (
        <div>
            <Backdrop onClose={props.onClose}/>
            <ModalOverlay>{props.children}</ModalOverlay>
        </div>
    )
}
export default Modal;