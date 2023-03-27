import './Home.css';
import BucketList from "../../components/BucketList/BucketList";
import { useEffect, useState } from "react";
const Home = () => {
  const [buckets,setBuckets] =useState([]);
    useEffect(()=>{
        async function fetchData(){
            const response= await fetch("https://internassignment-88d33-default-rtdb.firebaseio.com/buckets.json");
            const data=await response.json();
            setBuckets(data);
        }
        fetchData();
    },[buckets])
  return (
    <div className="home">
      <h1>Home</h1>
      <BucketList list={buckets}/>
    </div>
  );
};

export default Home;
