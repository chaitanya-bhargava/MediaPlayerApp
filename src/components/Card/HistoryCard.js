import "./Card.css";
const HistoryCard = (props) => {
    async function onDeleteHandler(){
      await fetch(`https://internassignment-88d33-default-rtdb.firebaseio.com/history/${props.id}.json`,{
        method:'delete',
      })
    }
  return (
    <div>
      <div className="history-card">
        <img className="del" src="dustbin.png" alt="delete" onClick={onDeleteHandler}/>
        <div className="card-text">
          Name: {props.name}
          <br />
          <a href={props.link} target="_blank" rel="noreferrer">
            LINK
          </a>
          <br />
          Time: {props.time}
        </div>
      </div>
    </div>
  );
};
export default HistoryCard;
