import Modal from '../Modal/Modal';
import Button from '../Button/Button';
const MediaPlayer = props => {
    return(
        <Modal onClose={props.onClose}>
            <div className='video-container'>
            <iframe className='video' src={`https://www.youtube.com/embed/${props.id}?autoplay=1`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            </div>
            <Button text="Close!" onClick={props.onClose}/>
        </Modal>
    )
}
export default MediaPlayer;