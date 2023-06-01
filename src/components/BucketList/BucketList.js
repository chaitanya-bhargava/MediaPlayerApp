import Bucket from "../Bucket/Bucket";
const BucketList = (props) => {
  return (
    <div className="bucketlist">
        {props.list.map((item) => (
          <Bucket key={item.id} bucketlist={props.list} text={item.name} list={item.cards} id={item.id}/>
      ))}
    </div>
  );
};
export default BucketList;