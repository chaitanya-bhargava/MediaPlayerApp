import HistoryCard from '../Card/HistoryCard';
import Card from '../Card/Card';
import './CardGrid.css';
const CardGrid = (props) => {
  if(props.list.length===0){
    return <div> Nothing to display! </div>
  }
  if(props.type==="history"){
    return (
      <div className="grid hgrid">
      {props.list.map((item) => (
        <HistoryCard
        key={item.id}
        id={item.id}
        name={item.name}
        link={item.link}
        time={item.time}
        />
        ))}
    </div>
  );
  }
  else{

    return (
      <div className="grid">
      {props.list.map((item) => (
        <Card
        key={item.id}
        bucketlist={props.bucketlist}
        bucketid={props.bucketid}
        id={item.id}
        name={item.name}
        link={item.link}
        image='play.png'
        />
        ))}
    </div>
  );
}
};
export default CardGrid;
