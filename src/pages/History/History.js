import { useEffect, useState } from "react";
import CardGrid from "../../components/CardGrid/CardGrid";
const History = () => {
    const [history,setHistory] =useState([]);
    useEffect(()=>{
        async function fetchData(){
            const response= await fetch("https://internassignment-88d33-default-rtdb.firebaseio.com/history.json");
            const data=await response.json();
            const loadedHistory=[];
            for(const key in data){
                loadedHistory.push({
                    id:key,
                    name:data[key].name,
                    link:data[key].link,
                    time:data[key].time
                });
            }
            setHistory(loadedHistory);
        }
        fetchData();
    },[history])
  return (
    <div className="history">
      <h1>History</h1>
      <CardGrid type="history" list={history}/>
    </div>
  );
};

export default History;
