import { useEffect, useReducer, useRef } from "react";
import LoadingComponent from "../components/loading/LoadingComponent";
import dataInitialize from './dataInitialize.svg';
import dataStatics from './dataStatics.svg';
import * as solarisData from '../Solaris-2.json';
import { useState } from "react";

export interface ISolarisData{
  status:string;
  age:string;
  diet:string;
  taxonomy:string[];
  id:number;
}

export interface ISolarisTimeLine {
 timeLine:Date;
 solarisDatas:ISolarisData[];
}
function App() {

  let [data,setData] = useState<ISolarisTimeLine[]>([]);

 
  function processData(){
    let data:ISolarisTimeLine[] = [];
    (solarisData as any).default.map((item:any) => data.push({timeLine:new Date(item[0]),solarisDatas:item[1]}))
    setData(data)
  }


  useEffect(()=> {
    console.log(data.map((item) => item.solarisDatas.find((x:ISolarisData) => x.id= 100184)));
    dispatch({type: "DATA_PROCESS"})
  },[data])

  function appReducer(state:any, action:any) {
    switch(action.type) {
      case 'DATA_PROCESS':
        return { data: state.data,isDataProcessing: false ,isStaticExtracting: true , svgSrc:dataStatics , svgDescription: "Statics are extracting..."}
      case 'STATICS_EXTRACT':
        return Object.assign({}, state, {
          isStaticExtracting: true
       })
      default:
        return state
    }
  }
  const initialState = {
    isDataProcessing:true,
    isStaticExtracting: false,
    svgSrc:dataInitialize,
    svgDescription: "Data is initializing..." 
  }
  const [store, dispatch] = useReducer(appReducer,initialState)
  
  useEffect(() => {
    let timer = setTimeout(() => processData(), 2000);
    return () => {
      clearTimeout(timer);
    };
  },[])

 
  return (
    <div className="App">
      <LoadingComponent svgSrc={store.svgSrc} svgDescription={store.svgDescription}/>
    </div>
  );
}

export default App;
